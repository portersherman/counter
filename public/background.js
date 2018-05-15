class Background {
    constructor() {
        this.setupSound();
        this.env.triggerAttack();
    }

    setupSound() {
        this.arpStep = 5;
        this.basePitch = 60;

        this.env = new p5.Env();
        this.env.setADSR(1, 0.5, 0.2, 0.5);
        this.env.setRange(0.25, 0);

        this.oscs = [];

        this.oscs[0] = new p5.Oscillator();
        this.oscs[0].setType('sine');
        this.oscs[0].freq(midiToFreq(this.basePitch));
        this.oscs[0].amp(this.env);
        this.oscs[0].pan(-1);
        this.oscs[0].disconnect();
        this.oscs[0].connect(backFilter);
        this.oscs[0].start();

        this.oscs[1] = new p5.Oscillator();
        this.oscs[1].setType('sine');
        this.oscs[1].freq(midiToFreq(this.basePitch));
        this.oscs[1].amp(this.env);
        this.oscs[1].pan(-0.33);
        this.oscs[1].disconnect();
        this.oscs[1].connect(backFilter);
        this.oscs[1].start();

        this.oscs[2] = new p5.Oscillator();
        this.oscs[2].setType('sine');
        this.oscs[2].freq(midiToFreq(this.basePitch));
        this.oscs[2].amp(this.env);
        this.oscs[2].pan(0.33);
        this.oscs[2].disconnect();
        this.oscs[2].connect(backFilter);
        this.oscs[2].start();

        this.oscs[3] = new p5.Oscillator();
        this.oscs[3].setType('sine');
        this.oscs[3].freq(midiToFreq(this.basePitch - 12));
        this.oscs[3].amp(this.env);
        this.oscs[3].pan(1);
        this.oscs[3].disconnect();
        this.oscs[3].connect(backFilter);
        this.oscs[3].start();
    }

    update() {
        var index = 0;
        this.oscs.forEach((osc) => {
            var newFreq = (index != 3) ?
                this.basePitch + SCALES[MAJPENT][Math.floor(Math.random() * SCALES[MAJPENT].length)] :
                this.basePitch - 12 + SCALES[MAJPENT][Math.floor(Math.random() * SCALES[MAJPENT].length)];
            osc.freq(midiToFreq(newFreq));
            index++
        });
    }
}
