class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      // @ts-expect-error - compatibility for old webkit browsers
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuteStatus(): boolean {
    return this.isMuted;
  }

  public playSound(type: 'start' | 'click' | 'jump' | 'coin' | 'powerup' | 'select') {
    if (this.isMuted) return;

    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'jump') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'coin') {
        osc.type = 'sine';
        // Classic coin sound: short high pitch beep, followed by higher pitch beep
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.setValueAtTime(0.08, now + 0.08);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'start') {
        // Retro game start melody: C4 -> E4 -> G4 -> C5
        const notes = [261.63, 329.63, 392.00, 523.25];
        const noteDuration = 0.1;

        osc.type = 'square';
        gainNode.gain.setValueAtTime(0.08, now);

        notes.forEach((freq, index) => {
          const time = now + index * noteDuration;
          osc.frequency.setValueAtTime(freq, time);
          if (index === notes.length - 1) {
            gainNode.gain.setValueAtTime(0.08, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
          }
        });

        osc.start(now);
        osc.stop(now + notes.length * noteDuration + 0.2);
      } else if (type === 'powerup') {
        // High pitch rising arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const noteDuration = 0.06;

        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0.1, now);

        notes.forEach((freq, index) => {
          const time = now + index * noteDuration;
          osc.frequency.setValueAtTime(freq, time);
          if (index === notes.length - 1) {
            gainNode.gain.setValueAtTime(0.1, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
          }
        });

        osc.start(now);
        osc.stop(now + notes.length * noteDuration + 0.15);
      }
    } catch (e) {
      console.warn("Failed to play sound: ", e);
    }
  }

  // Play a background custom ambient chord loop
  public playMusicLoop() {
    // If we want a mini music loops, we can implement it, but sound effects are usually safer and less annoying.
  }
}

export const audioEngine = new AudioEngine();
