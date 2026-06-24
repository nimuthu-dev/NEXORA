'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

class AudioSynthManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  // Lofi elements
  private vinylBufferSource: AudioBufferSourceNode | null = null;
  private currentBeat = 0;
  private nextBeatTime = 0;
  private tempo = 75; // 75 BPM chill lofi tempo
  private schedulerIntervalId: any = null;

  // Jazzy Rhodes chords progression
  private chords = [
    [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9 (C3, E3, G3, B3, D4)
    [87.31, 130.81, 174.61, 220.00, 261.63, 329.63], // Fmaj7 (F2, C3, F3, A3, C4, E4)
    [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9 (D3, F3, A3, C4, E4)
    [98.00, 146.83, 246.94, 293.66, 349.23, 329.63]  // G13 (G2, D3, B3, D4, F4, E4)
  ];
  private currentChordIndex = 0;

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Start the vinyl crackle background noise
      this.initVinylCrackle();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Audio Context initialization failed', e);
    }
  }

  // Generate vinyl crackle procedurally
  private initVinylCrackle() {
    if (!this.ctx) return;

    // Create a 2-second buffer of white noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Play noise loop
    this.vinylBufferSource = this.ctx.createBufferSource();
    this.vinylBufferSource.buffer = noiseBuffer;
    this.vinylBufferSource.loop = true;

    // Filter white noise to make it sound like record hiss (bandpass + lowpass)
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1000, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.5, this.ctx.currentTime);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2500, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.008, this.ctx.currentTime); // very quiet hiss

    this.vinylBufferSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(vinylGain);
    vinylGain.connect(this.masterGain!);

    this.vinylBufferSource.start();
  }

  // Synthesize kick drum
  private playKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Deep sub sweep from 110Hz to 45Hz
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.09);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Synthesize snare/rimshot
  private playSnare(time: number) {
    if (!this.ctx) return;
    
    // Snare tone body
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(180, time);
    bodyOsc.frequency.linearRampToValueAtTime(120, time + 0.05);
    
    bodyGain.gain.setValueAtTime(0.12, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
    
    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.masterGain!);
    bodyOsc.start(time);
    bodyOsc.stop(time + 0.07);

    // Snare wire snap (using procedural white noise generator)
    const bufferSize = this.ctx.sampleRate * 0.15; // 0.15s duration
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.045, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    
    noiseSource.start(time);
    noiseSource.stop(time + 0.15);
  }

  // Synthesize hi-hat (soft click)
  private playHihat(time: number) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.03; // very short click
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.005, time); // extremely soft click
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noiseSource.start(time);
    noiseSource.stop(time + 0.03);
  }

  // Synthesize Rhodes jazzy electric chords
  private playRhodesChord(freqs: number[], time: number, duration: number) {
    if (!this.ctx) return;

    // Warm lowpass filter for Rhodes sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, time);
    filter.Q.setValueAtTime(0.7, time);
    filter.connect(this.masterGain!);

    // Slight chorus effect via LFO pitch vibrato
    const vibratoLfo = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibratoLfo.frequency.setValueAtTime(4.5, time); // 4.5Hz vibrato rate
    vibratoGain.gain.setValueAtTime(1.5, time); // subtle pitch detune
    vibratoLfo.connect(vibratoGain);
    vibratoLfo.start(time);
    vibratoLfo.stop(time + duration);

    // Synthesize notes in chord
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      // Rhodes keys are triangle-wave based for warm tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);
      vibratoGain.connect(osc.frequency);

      // Volume envelope: Rhodes has a quick attack, slow decay
      oscGain.gain.setValueAtTime(0, time);
      oscGain.gain.linearRampToValueAtTime(0.04, time + 0.15); // soft Rhodes velocity
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(time);
      osc.stop(time + duration);
    });
  }

  // Play a random vinyl pop sound
  private playVinylPop(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    // Very low, dry pop
    osc.frequency.setValueAtTime(Math.random() * 400 + 100, time);
    
    gain.gain.setValueAtTime(Math.random() * 0.006 + 0.002, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.015);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.02);
  }

  // Lookahead Scheduler
  private scheduler() {
    if (!this.ctx) return;
    const lookahead = 0.2; // schedule 200ms ahead
    const scheduleWindow = 0.1; // check every 100ms
    
    while (this.nextBeatTime < this.ctx.currentTime + lookahead) {
      this.scheduleStep(this.currentBeat, this.nextBeatTime);
      
      // Step length = quarter note at 75 BPM divided by 2 (Eighth note)
      const beatLength = (60 / this.tempo) / 2; // 0.4s
      this.nextBeatTime += beatLength;
      this.currentBeat = (this.currentBeat + 1) % 16;
    }
  }

  // Schedule elements per step
  private scheduleStep(step: number, time: number) {
    // 1. Drum Loop: Boom Bap
    const isHat = step % 2 === 0;
    const isKick = step === 0 || step === 8 || step === 10;
    const isSnare = step === 4 || step === 12;

    if (isHat) this.playHihat(time);
    if (isKick) this.playKick(time);
    if (isSnare) this.playSnare(time);

    // 2. Chord Progression: Loop chords every 8 beats = 3.2s
    if (step === 0 || step === 8) {
      const chord = this.chords[this.currentChordIndex];
      this.playRhodesChord(chord, time, 3.0);
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
    }

    // 3. Random Vinyl crackle/dust pops
    if (Math.random() < 0.25) {
      this.playVinylPop(time + Math.random() * 0.4);
    }
  }

  play() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.24, this.ctx.currentTime + 1.5);
    }

    // Start sequencer loop
    this.nextBeatTime = this.ctx.currentTime + 0.1;
    this.currentBeat = 0;
    this.currentChordIndex = 0;
    
    this.schedulerIntervalId = setInterval(() => this.scheduler(), 100);
  }

  stop() {
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
    }
  }

  triggerTick() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.015);
      
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {}
  }

  triggerPop() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}

// Global Synth Manager Singleton
export const audioManager = typeof window !== 'undefined' ? new AudioSynthManager() : null;

// Expose handlers to global window for easy access in non-React contexts or external listeners
if (typeof window !== 'undefined') {
  (window as any).playHoverSound = () => audioManager?.triggerTick();
  (window as any).playClickSound = () => audioManager?.triggerPop();
}

export function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check local storage for persistent preference
    const savedSound = localStorage.getItem('ambient-sound') === 'true';
    if (savedSound) {
      setIsPlaying(true);
      audioManager?.play();
    }
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      audioManager?.stop();
      localStorage.setItem('ambient-sound', 'false');
      setIsPlaying(false);
    } else {
      audioManager?.play();
      audioManager?.triggerPop(); // Play confirmation pop
      localStorage.setItem('ambient-sound', 'true');
      setIsPlaying(true);
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-10 h-10 rounded-full bg-background border border-border hover:border-primary/40 hover:bg-muted/80 text-primary flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer select-none group"
          title="Open Audio Controls"
        >
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3 w-4 overflow-hidden">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className="w-0.5 bg-primary rounded-full animate-equalizer-bar"
                  style={{
                    animationDelay: `${bar * 0.15}s`,
                    animationDuration: `${0.6 + bar * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-foreground/75 group-hover:text-primary transition-colors">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          )}
        </button>
        
        {/* Equalizer CSS Rules */}
        <style>{`
          @keyframes equalizer {
            0%, 100% { height: 3px; }
            50% { height: 12px; }
          }
          .animate-equalizer-bar {
            animation: equalizer ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in-50 slide-in-from-right-4 duration-200">
      {/* Collapse Button */}
      <button
        onClick={() => setIsExpanded(false)}
        className="w-8 h-8 rounded-full bg-background border border-border hover:border-primary/40 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shadow-lg transition-all"
        title="Collapse Audio Controls"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Spotify Playlist Link Button */}
      <a
        href="https://open.spotify.com/playlist/6zCID88oNjNv9zx6puDHKj?si=86c4550d461c4024"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-[#1DB954] hover:bg-[#1ed760] text-white p-2.5 rounded-full shadow-xl transition-all duration-300 cursor-pointer select-none"
        title="Open Lofi Playlist on Spotify"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.978-.336.077-.67-.133-.747-.47-.077-.337.133-.67.47-.747 3.856-.88 7.15-.509 9.822 1.13.295.178.387.563.208.858zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.666-1.112 8.232-.575 11.345 1.34.367.227.487.708.26 1.076zm.105-2.832C14.782 8.924 9.61 8.75 6.617 9.66a1 1 0 1 1-.58-1.914c3.428-1.04 9.13-.843 12.728 1.293a1 1 0 1 1-1.008 1.73z"/>
        </svg>
      </a>

      {/* Main Procedural Sound Toggle Button */}
      <div
        onClick={handleToggle}
        className="flex items-center gap-3 bg-background/60 dark:bg-black/60 border border-foreground/10 hover:border-primary/30 px-4 py-2.5 rounded-full backdrop-blur-xl shadow-xl transition-all duration-300 cursor-pointer select-none group"
        title={isPlaying ? "Mute Study Lofi Music" : "Unmute Study Lofi Music"}
      >
        {/* Dynamic Sound Equalizer Visualizer */}
        <div className="flex items-end gap-0.5 h-3 w-4 overflow-hidden">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-0.5 bg-primary rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-equalizer-bar' : 'h-1'
              }`}
              style={{
                animationDelay: `${bar * 0.15}s`,
                animationDuration: `${0.6 + bar * 0.1}s`,
              }}
            />
          ))}
        </div>

        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/70 group-hover:text-foreground transition-colors hidden sm:inline">
          Lofi Stream
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-primary" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-foreground/50 group-hover:text-foreground/80" />
        )}
      </div>
      
      {/* Equalizer CSS Rules */}
      <style>{`
        @keyframes equalizer {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
        .animate-equalizer-bar {
          animation: equalizer ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
