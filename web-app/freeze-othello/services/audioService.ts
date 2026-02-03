
export class AudioService {
  private static ctx: AudioContext | null = null;
  private static bgmGain: GainNode | null = null;
  private static isBgmPlaying: boolean = false;
  private static schedulerTimer: number | null = null;
  private static nextStartTime: number = 0;
  
  private static readonly LOOK_AHEAD = 0.2; 
  private static readonly SCHEDULE_INTERVAL = 40; 
  private static readonly PATTERN_LEN = 2.0; 

  private static getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  static async startBGM() {
    if (this.isBgmPlaying) return;
    const ctx = this.getContext();
    await ctx.resume();

    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0.45; // 音量をさらにアップ
    this.bgmGain.connect(ctx.destination);
    
    this.isBgmPlaying = true;
    this.nextStartTime = ctx.currentTime;
    this.scheduler();
  }

  private static scheduler() {
    if (!this.isBgmPlaying) return;
    const ctx = this.getContext();
    while (this.nextStartTime < ctx.currentTime + this.LOOK_AHEAD) {
      this.scheduleLoopSegment(this.nextStartTime);
      this.nextStartTime += this.PATTERN_LEN;
    }
    this.schedulerTimer = window.setTimeout(() => this.scheduler(), this.SCHEDULE_INTERVAL);
  }

  private static scheduleLoopSegment(time: number) {
    const ctx = this.getContext();
    if (!this.bgmGain) return;

    // ベース
    const osc1 = ctx.createOscillator();
    const g = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(41.2, time); // E1
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + this.PATTERN_LEN);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.6, time + 0.1);
    g.gain.linearRampToValueAtTime(0, time + this.PATTERN_LEN + 0.05);
    osc1.connect(filter);
    filter.connect(g);
    g.connect(this.bgmGain);
    osc1.start(time);
    osc1.stop(time + this.PATTERN_LEN + 0.05);

    // グリッチ音
    if (Math.random() > 0.4) {
      const gOsc = ctx.createOscillator();
      const gGain = ctx.createGain();
      gOsc.type = 'square';
      gOsc.frequency.setValueAtTime(Math.random() * 2000, time + Math.random());
      gGain.gain.setValueAtTime(0, time);
      gGain.gain.linearRampToValueAtTime(0.1, time + 0.05);
      gGain.gain.linearRampToValueAtTime(0, time + 0.15);
      gOsc.connect(gGain);
      gGain.connect(this.bgmGain);
      gOsc.start(time);
      gOsc.stop(time + 0.2);
    }
  }

  static stopBGM() {
    this.isBgmPlaying = false;
    if (this.schedulerTimer) clearTimeout(this.schedulerTimer);
    if (this.bgmGain) {
      const ctx = this.getContext();
      this.bgmGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => { this.bgmGain?.disconnect(); this.bgmGain = null; }, 600);
    }
  }

  static playPuchun() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(12000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  static playClick() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  static playFlip() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  static playGameOver(win: boolean) {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(win ? 220 : 440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(win ? 880 : 40, ctx.currentTime + 2.0);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.0);
  }
}
