
export class AudioService {
  private static ctx: AudioContext | null = null;
  private static bgmGain: GainNode | null = null;
  private static isBgmPlaying: boolean = false;
  private static schedulerTimer: number | null = null;
  private static nextStartTime: number = 0;
  private static readonly LOOK_AHEAD = 0.2; // 200ms先までスケジュール
  private static readonly SCHEDULE_INTERVAL = 50; // 50msごとにチェック
  private static readonly BEAT_DURATION = 1.0; // 1拍の長さ (1秒)

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
    this.bgmGain.gain.value = 0.25; // 音量をさらに引き上げ
    this.bgmGain.connect(ctx.destination);
    
    this.isBgmPlaying = true;
    this.nextStartTime = ctx.currentTime;
    this.scheduler();
  }

  private static scheduler() {
    if (!this.isBgmPlaying) return;
    const ctx = this.getContext();

    // 次の再生開始時間が現在時間+LookAheadより前なら、次の音をスケジュール
    while (this.nextStartTime < ctx.currentTime + this.LOOK_AHEAD) {
      this.scheduleLoopSegment(this.nextStartTime);
      this.nextStartTime += this.BEAT_DURATION;
    }

    this.schedulerTimer = window.setTimeout(() => this.scheduler(), this.SCHEDULE_INTERVAL);
  }

  private static scheduleLoopSegment(time: number) {
    const ctx = this.getContext();
    if (!this.bgmGain) return;

    // 1. ベース・パルス (重厚なサブベース)
    const oscBase = ctx.createOscillator();
    const gainBase = ctx.createGain();
    oscBase.type = 'sine';
    oscBase.frequency.setValueAtTime(41.2, time); // E1
    
    // わずかにオーバーラップさせる (BEAT_DURATIONより長く再生)
    gainBase.gain.setValueAtTime(0, time);
    gainBase.gain.linearRampToValueAtTime(0.6, time + 0.1);
    gainBase.gain.linearRampToValueAtTime(0.4, time + this.BEAT_DURATION);
    gainBase.gain.linearRampToValueAtTime(0, time + this.BEAT_DURATION + 0.1);

    oscBase.connect(gainBase);
    gainBase.connect(this.bgmGain);
    oscBase.start(time);
    oscBase.stop(time + this.BEAT_DURATION + 0.1);

    // 2. ノイズ・テクスチャ (グリッチ感)
    if (Math.random() > 0.4) {
      const bufferSize = ctx.sampleRate * 0.2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000 + Math.random() * 2000, time);
      
      noiseGain.gain.setValueAtTime(0, time);
      noiseGain.gain.linearRampToValueAtTime(0.05, time + 0.05);
      noiseGain.gain.linearRampToValueAtTime(0, time + 0.2);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.bgmGain);
      noise.start(time + Math.random() * this.BEAT_DURATION);
    }

    // 3. リード・ドローン (不穏な響き)
    const oscLead = ctx.createOscillator();
    const gainLead = ctx.createGain();
    oscLead.type = 'sawtooth';
    oscLead.frequency.setValueAtTime(82.4, time); // E2
    oscLead.frequency.exponentialRampToValueAtTime(85, time + this.BEAT_DURATION); // わずかにピッチを揺らす
    
    const filterLead = ctx.createBiquadFilter();
    filterLead.type = 'lowpass';
    filterLead.frequency.setValueAtTime(200, time);
    filterLead.frequency.exponentialRampToValueAtTime(800, time + this.BEAT_DURATION);

    gainLead.gain.setValueAtTime(0, time);
    gainLead.gain.linearRampToValueAtTime(0.15, time + 0.5);
    gainLead.gain.linearRampToValueAtTime(0, time + this.BEAT_DURATION + 0.1);

    oscLead.connect(filterLead);
    filterLead.connect(gainLead);
    gainLead.connect(this.bgmGain);
    oscLead.start(time);
    oscLead.stop(time + this.BEAT_DURATION + 0.1);
  }

  static stopBGM() {
    this.isBgmPlaying = false;
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.bgmGain) {
      const ctx = this.getContext();
      this.bgmGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => {
        this.bgmGain?.disconnect();
        this.bgmGain = null;
      }, 600);
    }
  }

  static playPuchun() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(12000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  static playClick() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  static playFlip() {
    const ctx = this.getContext();
    for (let i = 0; i < 3; i++) {
      const time = ctx.currentTime + i * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500 + i * 300, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.04);
    }
  }

  static playGameOver(win: boolean) {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    if (win) {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 2.0);
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2.5);
    }
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  }
}
