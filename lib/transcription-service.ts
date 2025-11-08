const WEBHOOK_URL = 'https://hear-me-out.app.n8n.cloud/webhook-test/a448e16a-c135-49db-8aa3-95d2085f0b03';
const CREATE_CONVERSATION_WEBHOOK = "https://hear-me-out.app.n8n.cloud/webhook/12fb4fbf-2caa-4482-af7a-95fd047d649d";
const END_CONVERSATION_WEBHOOK = "https://hear-me-out.app.n8n.cloud/webhook-test/8ff67b70-9f7c-4e03-9dd1-11c3059e219a";

export class TranscriptionService {
  private listeners: ((text: string) => void)[] = [];
  private errorListeners: ((error: string) => void)[] = [];
  private isActive = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private sendInterval: NodeJS.Timeout | null = null;
  private conversationId: string | null = null;

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

  private async createConversation(): Promise<string | null> {
    try {
      const res = await fetch(CREATE_CONVERSATION_WEBHOOK, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Conversation webhook failed: ${res.status}`);
      const data = await res.json();
      console.log("🆕 Created new conversation:", data);

      // Assuming your webhook returns something like { id: 42 } or { conversation_id: "1234" }
      const id = data.id || data.conversation_id;
      this.conversationId = id?.toString() ?? null;

      return this.conversationId;
    } catch (err) {
      console.error("❌ Failed to create conversation:", err);
      this.notifyError("Could not start a new conversation.");
      return null;
    }
  }

    private async endConversation() {
    if (!this.conversationId) {
      console.warn("⚠️ Tried to end conversation but no ID found.");
      return;
    }

    try {
      const res = await fetch(END_CONVERSATION_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: this.conversationId,
          ended_at: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        console.log(`✅ Conversation ${this.conversationId} ended successfully.`);
      } else {
        console.error("❌ Failed to end conversation:", res.status, res.statusText);
      }
    } catch (err) {
      console.error("❌ Error sending end conversation webhook:", err);
    }
  }

  private async sendAudioToWebhook(audioBlob: Blob) {
    if (!this.conversationId) {
      console.warn("⚠️ No conversationId — skipping audio send");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('timestamp', new Date().toISOString());
      formData.append("conversation_id", this.conversationId);

      console.log('📤 Sending audio chunk to webhook:', audioBlob.size, 'bytes');

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Audio sent successfully:', result);

        if (result.text) {
          this.notifyListeners(result.text);
        }
      } else {
        console.error('❌ Webhook response error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Error sending audio to webhook:', error);
      //this.notifyError('Failed to send audio to webhook');
    }
  }

  async start() {
    if (this.isActive) return;

    const conversationId = await this.createConversation();
    if (!conversationId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 Microphone access granted');

      this.isActive = true;
      this.audioChunks = [];

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          console.log('🎵 Recording stopped, sending final audio:', audioBlob.size, 'bytes');
          await this.sendAudioToWebhook(audioBlob);
          this.audioChunks = [];
        }
      };

      this.mediaRecorder.start();
      console.log('🔴 Recording started, will send audio chunks every 2 seconds');

      this.sendInterval = setInterval(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();

          setTimeout(() => {
            if (this.isActive && this.mediaRecorder) {
              this.mediaRecorder.start();
            }
          }, 100);
        }
      }, 10000);

    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      this.notifyError('Could not access microphone. Please check permissions.');
      this.isActive = false;
    }
  }

  async stop() {
    if (!this.isActive) return;

    this.isActive = false;

    if (this.sendInterval) {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
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

    await this.endConversation();
  }


  getStatus() {
    return this.isActive;
  }

  
}

export const transcriptionService = new TranscriptionService();