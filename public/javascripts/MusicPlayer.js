function MusicPlay(obj) {
    this.source = null;
    this.count = 0;

    this.analyser = MusicPlay.ac.createAnalyser();
    this.size = obj.size;
    this.analyser.fftSize = this.size * 2;

    this.gainNode = MusicPlay.ac.createGain();
    this.gainNode.connect(MusicPlay.ac.destination);

    this.analyser.connect(this.gainNode);
    this.xhr = new XMLHttpRequest();

    this.draw = obj.draw;

    this.view();
}

MusicPlay.ac = new window.AudioContext();

MusicPlay.prototype.load = function (url, callback) {
    this.xhr.abort();
    this.xhr.open('GET', url);
    this.xhr.responseType = 'arraybuffer';
    var self = this;
    this.xhr.onload = function () {
        callback(self.xhr.response);
    }
    this.xhr.send();
}

MusicPlay.prototype.decode = function (arraybuffer, callback) {
    MusicPlay.ac.decodeAudioData(arraybuffer, function (buffer) {
        callback(buffer);
    }, function (err) {
        console.log(err);
    })
}

MusicPlay.prototype.play = function (url) {
    var n = ++ this.count;
    var self = this;
    if(this.source && bufferSource.stop();) {
        bufferSource.stop();
    }
    this.load(url, function (arraybuffer) {
        if(n != self.count) return;
        self.decode(arraybuffer, function (buffer) {
            if(n != self.count) return;
            var bufferSource = MusicPlay.ac.createBufferSource();
            bufferSource.connect(self.analyser);
            bufferSource.buffer = buffer;
            bufferSource.start();
            self.source = bufferSource;
        })
    });
}

MusicPlay.prototype.changeVolume = function (percent) {
    this.gainNode.gain.value = percent * percent;
}

MusicPlay.prototype.view = function () {
    var arr = new Uint8Array(this.analyser.frequencyBinCount);
    var self = this;
    cancelAnimationFrame(frameId);
    function v() {
        self.analyser.getByteFrequencyData(arr);
        self.draw(arr);
        frameId = requestAnimationFrame(v);        
    }
    v();
}
