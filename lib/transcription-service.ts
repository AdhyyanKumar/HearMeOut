export class TranscriptionService {
  private listeners: ((text: string) => void)[] = [];
  private errorListeners: ((error: string) => void)[] = [];
  private isActive = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recognition: any = null;

  subscribe(callback: (text: string) => void) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  subscribeToErrors(callback: (error: string) => void) {
    this.errorListeners.push(callback);

    return () => {
      this.errorListeners = this.errorListeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(text: string) {
    this.listeners.forEach(listener => listener(text));
  }

  private notifyError(error: string) {
    this.errorListeners.forEach(listener => listener(error));
  }

  async start() {
    if (this.isActive) return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        this.notifyError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        console.error('❌ Speech recognition not supported');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isActive = true;
        console.log('🎙️ Speech recognition started');
      };

      this.recognition.onresult = (event: any) => {
        const results = event.results;
        const lastResult = results[results.length - 1];

        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript;
          console.log('📝 Final transcript:', transcript);
          this.notifyListeners(transcript + ' ');
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        this.notifyError(`Recognition error: ${event.error}`);

        if (event.error === 'no-speech') {
          console.log('⚠️ No speech detected, continuing...');
        } else if (event.error === 'not-allowed') {
          this.notifyError('Microphone access denied. Please allow microphone access.');
          this.stop();
        }
      };

      this.recognition.onend = () => {
        console.log('🔄 Recognition ended');
        if (this.isActive) {
          console.log('♻️ Restarting recognition...');
          try {
            this.recognition.start();
          } catch (e) {
            console.log('Recognition already started or stopped by user');
          }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 Microphone access granted');

      this.recognition.start();

      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      console.log('🔴 Recording started');

    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      this.notifyError('Could not access microphone. Please check permissions.');
      this.isActive = false;
    }
  }

  stop() {
    if (!this.isActive) return;

    this.isActive = false;

    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
      console.log('⏹️ Speech recognition stopped');
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();

      this.mediaRecorder.stream.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Microphone track stopped');
      });

      this.mediaRecorder = null;
    }

    console.log('⏹️ Recording stopped');
  }

  getStatus() {
    return this.isActive;
  }
}

export const transcriptionService = new TranscriptionService();
