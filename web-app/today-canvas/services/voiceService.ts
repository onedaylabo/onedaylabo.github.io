
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    // The supported audio MIME type is 'audio/pcm'.
    mimeType: 'audio/pcm;rate=16000',
  };
}

export class VoiceTranscriber {
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;

  async start(onText: (text: string) => void) {
    // Fix: Create instance right before connection as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          if (!this.audioContext || !this.stream) return;
          const source = this.audioContext.createMediaStreamSource(this.stream);
          const scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            // Fix: Solely rely on sessionPromise resolves
            this.sessionPromise?.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(this.audioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.inputTranscription) {
            onText(message.serverContent.inputTranscription.text);
          }
          // The Live API requires handling model turns even if only using transcription
          if (message.serverContent?.modelTurn) {
            console.debug('Model responded with audio or text parts');
          }
        },
        onerror: (e: any) => console.error('Live API Error:', e),
        onclose: () => console.log('Live API Closed'),
      },
      config: {
        // responseModalities must be exactly [Modality.AUDIO]
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {},
      },
    });
  }

  async stop() {
    if (this.sessionPromise) {
      const session = await this.sessionPromise;
      session.close();
    }
    if (this.audioContext) {
      await this.audioContext.close();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.sessionPromise = null;
    this.audioContext = null;
    this.stream = null;
  }
}
