import type { EmotionVector } from "../generation/universe";
let ctx: AudioContext | null = null, master: GainNode | null = null, drone: OscillatorNode | null = null;
export const audioGarden = {
  async enable(emotion: EmotionVector, volume=.22) { if (!ctx) { ctx=new AudioContext(); master=ctx.createGain(); master.gain.value=volume; master.connect(ctx.destination); drone=ctx.createOscillator(); const filter=ctx.createBiquadFilter(); filter.type="lowpass"; filter.frequency.value=380+emotion.wonder*800; drone.type="sine"; drone.frequency.value=90+emotion.joy*80+emotion.calm*25; drone.connect(filter); filter.connect(master); drone.start(); } await ctx.resume(); if(master) master.gain.value=volume; },
  note(degree=0, emotion?:EmotionVector) { if(!ctx||!master||ctx.state!=="running")return; const o=ctx.createOscillator(),g=ctx.createGain(); o.type="sine";o.frequency.value=[196,220,247,294,330,392][degree%6]*(emotion?.nostalgia?0.75:1);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.08,ctx.currentTime+.05);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+1.5);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+1.6); },
  setVolume(v:number){if(master)master.gain.value=v}, stop(){drone?.stop();ctx?.close();ctx=null;master=null;drone=null}
};
