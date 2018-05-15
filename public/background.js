class Background {
    constructor() {
        this.setupSound();
        this.env.triggerAttack();
    }

    setupSound() {
        this.env = new p5.Env();
        this.env.setADSR(1, 0.5, 0.5, 0.5);
        this.env.setRange(0.4, 0);

        this.osc = new p5.Oscillator();
        this.osc.setType('sawtooth');
        this.osc.freq(midiToFreq('48'));
        this.osc.amp(this.env);
        this.osc.pan((this.id - 1.5)*1.66);
        this.osc.disconnect();
        this.osc.connect(filter);
        this.osc.start();

        this.lOsc = new p5.Oscillator();
        this.lOsc.setType('sawtooth');
        this.lOsc.freq(midiToFreq('36'));
        this.lOsc.amp(this.env);
        this.lOsc.pan((this.id - 1.5)*2);
        this.lOsc.disconnect();
        this.lOsc.connect(filter);
        this.lOsc.start();

        this.hOsc = new p5.Oscillator();
        this.hOsc.setType('sawtooth');
        this.hOsc.freq(midiToFreq('60'));
        this.hOsc.amp(this.env);
        this.hOsc.pan((this.id - 1.5)*2);
        this.hOsc.disconnect();
        this.hOsc.connect(filter);
        this.hOsc.start();

        this.subOsc = new p5.Oscillator();
        this.subOsc.setType('sine');
        this.subOsc.freq(midiToFreq('24'));
        this.subOsc.amp(this.env);
        this.subOsc.pan((this.id - 1.5)*1.66);
        this.subOsc.disconnect();
        this.subOsc.connect(filter);
        this.subOsc.start();
    }
}
