import type { EmotionVector } from "../generation/universe";
let context: AudioContext | null=null, master: GainNode | null=null, ambience: OscillatorNode[]=[], breathing: number | null=null, degree=0;
const gain=(value:number)=>{const g=context!.createGain();g.gain.value=value;return g};
export const audioGarden={
  async enable(e:EmotionVector,volume=.26){if(!context){context=new AudioContext();master=gain(volume);const warm=context.createBiquadFilter();warm.type="lowpass";warm.frequency.value=720+e.wonder*650;master.connect(warm);warm.connect(context.destination);const root=92+e.calm*36-e.tension*12;[1,1.25,1.5].forEach((ratio,i)=>{const o=context!.createOscillator(),g=gain([.10,.055,.035][i]);o.type=i===1?"triangle":"sine";o.frequency.value=root*ratio;o.detune.value=(i-1)*5+e.nostalgia*9;o.connect(g);g.connect(master!);o.start();ambience.push(o)});breathing=window.setInterval(()=>this.note(degree++ + Math.round(e.wonder*2),e),6200-Math.round(e.energy*1700));}
    await context.resume();if(master)master.gain.value=volume;},
  note(degree=0,e?:EmotionVector){if(!context||!master||context.state!=="running")return;const o=context.createOscillator(),g=gain(.0001),filter=context.createBiquadFilter();const scale=[196,220,247,294,330,392];o.type=e?.joy&&e.joy>.7?"triangle":"sine";o.frequency.value=scale[degree%scale.length]*(e?.nostalgia?0.75:1);filter.type="lowpass";filter.frequency.value=1500;o.connect(filter);filter.connect(g);g.connect(master);const now=context.currentTime;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.055,now+.09);g.gain.exponentialRampToValueAtTime(.0001,now+1.9+((e?.calm||0)*1.3));o.start(now);o.stop(now+2.5)},
  planet(e:EmotionVector){this.note(Math.round(e.wonder*4+e.joy*2),e);setTimeout(()=>this.note(4,e),110)},
  setVolume(v:number){if(master)master.gain.value=v},
  stop(){if(breathing!==null)window.clearInterval(breathing);breathing=null;ambience.forEach(o=>o.stop());ambience=[];context?.close();context=null;master=null}
};
