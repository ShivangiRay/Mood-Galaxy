import type { EmotionVector } from "../generation/universe";
let context: AudioContext | null=null, master: GainNode | null=null, ambience: OscillatorNode[]=[];
const gain=(value:number)=>{const g=context!.createGain();g.gain.value=value;return g};
export const audioGarden={
  async enable(e:EmotionVector,volume=.16){if(!context){context=new AudioContext();master=gain(volume);const warm=context.createBiquadFilter();warm.type="lowpass";warm.frequency.value=550+e.wonder*500;master.connect(warm);warm.connect(context.destination);const root=110+e.calm*35-e.tension*18;[1,1.25,1.5].forEach((ratio,i)=>{const o=context!.createOscillator(),g=gain(.018/(i+1));o.type=i===1?"triangle":"sine";o.frequency.value=root*ratio;o.detune.value=(i-1)*5+e.nostalgia*9;o.connect(g);g.connect(master!);o.start();ambience.push(o)});}
    await context.resume();if(master)master.gain.value=volume;},
  note(degree=0,e?:EmotionVector){if(!context||!master||context.state!=="running")return;const o=context.createOscillator(),g=gain(.0001),filter=context.createBiquadFilter();const scale=[196,220,247,294,330,392];o.type=e?.joy&&e.joy>.7?"triangle":"sine";o.frequency.value=scale[degree%scale.length]*(e?.nostalgia?0.75:1);filter.type="lowpass";filter.frequency.value=1500;o.connect(filter);filter.connect(g);g.connect(master);const now=context.currentTime;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.055,now+.09);g.gain.exponentialRampToValueAtTime(.0001,now+1.9+((e?.calm||0)*1.3));o.start(now);o.stop(now+2.5)},
  planet(e:EmotionVector){this.note(Math.round(e.wonder*4+e.joy*2),e);setTimeout(()=>this.note(4,e),110)},
  setVolume(v:number){if(master)master.gain.value=v},
  stop(){ambience.forEach(o=>o.stop());ambience=[];context?.close();context=null;master=null}
};
