import React from 'react';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {
  AbsoluteFill, Composition, Sequence, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing
} from 'remotion';

const {fontFamily:OSWALD} = loadOswald();

const C = {
  bg: '#030303', panel: '#101113', panelSoft: '#0b0c0e',
  white: '#f5f5f7', muted: '#86858d', dim: '#39383f',
  purple: '#a47aff', blue: '#13baf7', green: '#31e4ae',
  amber: '#ffbd31', coral: '#ff654f'
};
const CLAMP = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const TITLE_FONT = OSWALD;
const UI_FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';

function Reveal({children, delay=0, y=16, duration=14, style={}}:{
  children: React.ReactNode; delay?: number; y?: number; duration?: number;
  style?: React.CSSProperties;
}) {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame:f-delay, fps, config:{damping:19, stiffness:118, mass:.72}});
  const opacity = interpolate(f, [delay, delay+duration], [0,1], CLAMP);
  const blur = interpolate(progress,[0,1],[7,0]);
  const scale = interpolate(progress,[0,1],[.976,1]);
  return <div style={{
    opacity,
    filter:'blur('+blur+'px)',
    transform:'translate3d(0,'+interpolate(progress,[0,1],[y,0])+'px,0) scale('+scale+')',
    transformOrigin:'center center',
    willChange:'transform,opacity,filter',
    ...style
  }}>{children}</div>;
}

function Background({accent=C.purple}:{accent?:string}) {
  return <AbsoluteFill style={{background:C.bg, overflow:'hidden'}}>
    <AbsoluteFill style={{
      backgroundImage:'linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)',
      backgroundSize:'80px 80px',
      maskImage:'linear-gradient(to bottom,transparent 5%,black 18%,black 82%,transparent 95%)'
    }}/>
    <div style={{position:'absolute',left:'50%',top:590,width:890,height:360,transform:'translateX(-50%)',borderRadius:'50%',background:'radial-gradient(ellipse, '+accent+'14 0%, '+accent+'07 36%, transparent 70%)',filter:'blur(32px)'}}/>
    <div style={{position:'absolute',left:66,right:66,top:151,height:1,background:'#ffffff12'}}/>
    <div style={{position:'absolute',left:66,right:66,bottom:151,height:1,background:'#ffffff12'}}/>
  </AbsoluteFill>;
}

function LightSweep({accent}:{accent:string}) {
  const f=useCurrentFrame();
  const left=interpolate(f,[3,76],[-42,142],CLAMP);
  const opacity=interpolate(f,[2,16,64,83],[0,.78,.52,0],CLAMP);
  return <div style={{
    position:'absolute',top:178,bottom:145,left:left+'%',width:'22%',
    transform:'skewX(-17deg)',
    background:'linear-gradient(90deg,transparent 0%,'+accent+'07 24%,'+accent+'13 50%,'+accent+'05 72%,transparent 100%)',
    filter:'blur(15px)',opacity,pointerEvents:'none'
  }}/>;
}

function SceneBase({index, accent=C.purple, children}:{
  index:number; accent?:string; children:React.ReactNode;
}) {
  const f=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const fadeIn=interpolate(f,[0,9],[0,1],CLAMP);
  const fadeOut=interpolate(f,[durationInFrames-10,durationInFrames-1],[1,0],CLAMP);
  const opacity=Math.min(fadeIn,fadeOut);
  const scale=interpolate(f,[0,durationInFrames-1],[1.018,1.0],CLAMP);
  const footerProgress=interpolate(f,[7,32],[0,1],CLAMP);
  return <AbsoluteFill style={{opacity,transform:'scale('+scale+')',transformOrigin:'center center',color:C.white,fontFamily:UI_FONT,background:C.bg}}>
    <Background accent={accent}/>
    <LightSweep accent={accent}/>
    <div style={{position:'absolute',left:78,top:65,fontFamily:'ui-monospace,monospace',fontSize:12,letterSpacing:3,color:'#7e6bb1',fontWeight:600}}>{String(index).padStart(2,'0')} <span style={{color:'#37323f'}}>/ 12</span></div>
    <div style={{position:'absolute',right:78,top:65,fontFamily:'ui-monospace,monospace',fontSize:10,letterSpacing:3,color:'#55535d'}}>ZYNTRIX OS / ZETTINGS</div>
    <div style={{position:'absolute',left:78,top:100,width:Math.max(0,footerProgress*118),height:2,background:accent,boxShadow:'0 0 12px '+accent+'80'}}/>
    {children}
    <div style={{position:'absolute',left:78,right:78,bottom:64,display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'ui-monospace,monospace',fontSize:10,letterSpacing:2,color:'#4f4d55'}}>
      <span>SYSTEM SETTINGS, RECONSIDERED.</span><span style={{color:accent+'99'}}>Z / ZETTINGS</span>
    </div>
  </AbsoluteFill>;
}

function Headline({line1,line2,accent=C.purple,eyebrow,top=286,size=67}:{
  line1:string; line2?:string; accent?:string; eyebrow?:string; top?:number; size?:number;
}) {
  return <div style={{position:'absolute',top,left:120,right:120,textAlign:'center'}}>
    <Reveal y={13}><div style={{fontFamily:TITLE_FONT,fontSize:size,fontWeight:800,letterSpacing:1.1,lineHeight:1.1,textTransform:'uppercase',color:C.white}}>{line1}</div></Reveal>
    {line2 && <Reveal delay={5} y={15}><div style={{fontFamily:TITLE_FONT,fontSize:size,fontWeight:800,letterSpacing:1,lineHeight:1.1,textTransform:'uppercase',color:accent,marginTop:5,textShadow:'0 0 34px '+accent+'1c'}}>{line2}</div></Reveal>}
    {eyebrow && <Reveal delay={10} y={7}><div style={{fontFamily:'ui-monospace,monospace',fontSize:12,fontWeight:600,letterSpacing:4,color:accent,marginTop:21}}>{eyebrow}</div></Reveal>}
  </div>;
}

function Glyph({children,color=C.purple,size=22}:{children:React.ReactNode;color?:string;size?:number}) {
  const key=String(children);
  const art:Record<string,React.ReactNode>={
    '⌁':<><path d="M3.5 8.5a12.4 12.4 0 0 1 17 0"/><path d="M6.7 12a7.7 7.7 0 0 1 10.6 0"/><path d="M9.9 15.5a3.1 3.1 0 0 1 4.2 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></>,
    'ᛒ':<><path d="M12 2.5v19l6-5-6-4.5 6-4.5-6-5Z"/><path d="m5 7 13 10M5 17 18 7"/></>,
    '◐':<><path d="M19.5 14.2A8 8 0 0 1 9.8 4.5a8 8 0 1 0 9.7 9.7Z"/><path d="M16 3.5v4M14 5.5h4"/></>,
    '▤':<><rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    '◉':<><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/></>,
    '●':<><circle cx="12" cy="8" r="3.2"/><path d="M5 20c.3-3.5 2.8-5.5 7-5.5s6.7 2 7 5.5"/></>,
    '⌑':<><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m8.5 12 2.3 2.3 4.7-5"/></>,
    '▣':<><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8v8H8z"/></>,
    '↻':<><path d="M20 7v5h-5"/><path d="M19 12a7.5 7.5 0 1 0 1 4"/></>,
    '⌘':<><rect x="8" y="2.5" width="8" height="8" rx="3"/><rect x="8" y="13.5" width="8" height="8" rx="3"/><rect x="2.5" y="8" width="8" height="8" rx="3"/><rect x="13.5" y="8" width="8" height="8" rx="3"/></>,
    '⌕':<><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/></>,
    '☾':<><path d="M19.5 14.2A8 8 0 0 1 9.8 4.5a8 8 0 1 0 9.7 9.7Z"/></>,
    '☼':<><circle cx="12" cy="12" r="4"/><path d="M12 2v2.3M12 19.7V22M4.9 4.9l1.6 1.6m11 11 1.6 1.6M2 12h2.3m15.4 0H22M4.9 19.1l1.6-1.6m11-11 1.6-1.6"/></>
  };
  return <div style={{width:50,height:50,borderRadius:13,background:color+'19',border:'1px solid '+color+'25',display:'grid',placeItems:'center',color,flexShrink:0}}>
    <svg width={size+5} height={size+5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{art[key]||<text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="13">{key}</text>}</svg>
  </div>;
}

function Switch({on=true,color=C.blue}:{on?:boolean;color?:string}) {
  const f=useCurrentFrame();
  const p=spring({frame:f-17,fps:30,config:{damping:16,stiffness:125}});
  const x=on?interpolate(p,[0,1],[4,35],CLAMP):4;
  const glow=interpolate(p,[0,1],[0,.48],CLAMP);
  return <div style={{width:69,height:36,borderRadius:22,background:on?color:'#33343a',border:'1px solid '+(on?color+'aa':'#494950'),boxShadow:on?'0 0 25px '+color+Math.round(glow*100).toString(16).padStart(2,'0'):'none',position:'relative',flexShrink:0}}>
    <div style={{position:'absolute',left:x,top:3,width:28,height:28,borderRadius:20,background:'#fff',boxShadow:'0 1px 5px #0008'}}/>
  </div>;
}

function SettingRow({icon,title,detail,color=C.blue,on=true,tag}:{icon:string;title:string;detail:string;color?:string;on?:boolean;tag?:string}) {
  const f=useCurrentFrame();
  const breathe=.5+.5*Math.sin(f/8.5);
  const entering=interpolate(f,[3,22],[0,1],CLAMP);
  return <div style={{
    width:875,height:126,border:'1px solid '+color+'88',borderRadius:16,boxSizing:'border-box',
    background:'linear-gradient(105deg,#141518,#09090b)',
    boxShadow:'0 0 '+(27+breathe*15)+'px '+color+(Math.round(12+breathe*11).toString(16))+',inset 0 1px #ffffff0a',
    display:'flex',alignItems:'center',padding:'0 36px',gap:24,
    transform:'translateY('+interpolate(entering,[0,1],[8,0])+'px)',
    opacity:entering
  }}>
    <Glyph color={color} size={23}>{icon}</Glyph>
    <div style={{flex:1,textAlign:'left'}}>
      <div style={{fontSize:22,fontWeight:650,letterSpacing:-.5,color:'#f4f4f8'}}>{title}</div>
      <div style={{fontFamily:'ui-monospace,monospace',fontSize:11,fontWeight:600,letterSpacing:2,color,marginTop:7}}>{detail}</div>
    </div>
    {tag&&<div style={{fontFamily:'ui-monospace,monospace',fontSize:10,letterSpacing:2,color:C.muted,marginRight:10}}>{tag}</div>}
    <Switch on={on} color={color}/>
  </div>;
}

function CenterRow({children,top=526}:{children:React.ReactNode;top?:number}) {
 return <div style={{position:'absolute',top,left:0,right:0,display:'flex',justifyContent:'center'}}><Reveal y={22}>{children}</Reveal></div>;
}

function Slider({color=C.amber,value=82,label='BRIGHTNESS',icon='☼',leftLabel='0%',rightLabel='100%',width=660}:{
 color?:string;value?:number;label?:string;icon?:string;leftLabel?:string;rightLabel?:string;width?:number;
}) {
 const f=useCurrentFrame();
 const p=interpolate(f,[12,76],[Math.max(12,value-35),value],CLAMP);
 return <div style={{width,margin:'0 auto',color,fontFamily:'ui-monospace,monospace'}}>
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:13,fontSize:13,fontWeight:700,letterSpacing:3,marginBottom:30}}><span style={{fontSize:23}}>{icon}</span><span>{label}</span><span style={{color:C.white,marginLeft:9}}>{Math.round(p)}%</span></div>
  <div style={{display:'flex',alignItems:'center',gap:18}}>
    <span style={{fontSize:11,color:'#8b8991'}}>{leftLabel}</span>
    <div style={{height:4,background:'#333237',borderRadius:10,position:'relative',flex:1,boxShadow:'inset 0 1px 2px #000'}}>
      <div style={{position:'absolute',inset:'0 auto 0 0',width:p+'%',background:'linear-gradient(90deg,'+color+'99,'+color+')',borderRadius:8,boxShadow:'0 0 18px '+color+'65'}}/>
      <div style={{position:'absolute',left:p+'%',top:'50%',width:17,height:17,borderRadius:20,background:'#fff',transform:'translate(-50%,-50%)',boxShadow:'0 0 20px '+color+',0 0 3px #fff'}}/>
      {Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:(i+1)*9.09+'%',top:-3,width:1,height:10,background:'#ffffff42'}}/>)}
    </div>
    <span style={{fontSize:11,color:'#8b8991'}}>{rightLabel}</span>
  </div>
 </div>;
}

function S1(){
 const f=useCurrentFrame();
 return <SceneBase index={1} accent={C.amber}>
  <div style={{position:'absolute',left:0,right:0,top:288,textAlign:'center'}}>
   <Reveal><div style={{fontFamily:TITLE_FONT,fontSize:72,fontWeight:800,letterSpacing:1.5,color:C.white}}>EVERY SETTING.</div></Reveal>
   <Reveal delay={6}><div style={{fontFamily:TITLE_FONT,fontSize:72,fontWeight:800,letterSpacing:1.4,color:C.purple,marginTop:10}}>ONE BEAUTIFUL HOME.</div></Reveal>
   <Reveal delay={14}><div style={{fontFamily:'ui-monospace,monospace',fontSize:12,letterSpacing:5,color:'#81739f',marginTop:24}}>ZYNTRIX OS · SETTINGS REIMAGINED</div></Reveal>
  </div>
  <div style={{position:'absolute',top:625,left:0,right:0,display:'flex',justifyContent:'center'}}><Reveal delay={15} y={12}><Slider color={C.amber} value={83} label="A LITTLE MORE YOU" icon="☼" width={530}/></Reveal></div>
  <div style={{position:'absolute',left:'50%',top:610,width:560,height:160,transform:'translateX(-50%)',borderRadius:'50%',background:'radial-gradient(ellipse,#ffbd3114,transparent 70%)',filter:'blur(22px)'}}/>
  <div style={{opacity:interpolate(f,[0,100],[.22,.55],CLAMP),position:'absolute',left:'50%',top:750,width:2,height:20,background:C.amber}}/>
 </SceneBase>;
}

function S2(){return <SceneBase index={2} accent={C.blue}>
 <Headline line1="INSTANTLY CONNECTED." accent={C.blue} eyebrow="WI-FI · ON ARRIVAL" top={322} size={61}/>
 <CenterRow><SettingRow icon="⌁" title="Wi-Fi" detail="ZYNTRIX-5G · SECURED" color={C.blue} tag="CONNECTED"/></CenterRow>
 <div style={{position:'absolute',top:690,left:0,right:0,textAlign:'center'}}><Reveal delay={25}><div style={{fontFamily:'ui-monospace,monospace',fontSize:11,letterSpacing:3,color:'#4e7181'}}>CONNECTED BEFORE YOU THINK ABOUT IT</div></Reveal></div>
 </SceneBase>}

function S3(){return <SceneBase index={3} accent={C.green}>
 <Headline line1="ALREADY PAIRED." accent={C.green} eyebrow="BLUETOOTH · ZERO STEPS" top={323} size={64}/>
 <CenterRow><SettingRow icon="ᛒ" title="Zyntrix Keyboard" detail="PAIRED · INPUT READY" color={C.green} tag="CONNECTED"/></CenterRow>
 <div style={{position:'absolute',top:692,left:0,right:0,display:'flex',justifyContent:'center',gap:7,alignItems:'center'}}>{Array.from({length:17},(_,i)=><Reveal key={i} delay={i*1.5} y={5}><div style={{width:3,height:7+(i%4)*4,borderRadius:5,background:C.green,opacity:.38+(i%4)*.13}}/></Reveal>)}</div>
 </SceneBase>}

function S4(){return <SceneBase index={4} accent={C.purple}>
 <Headline line1="SILENCE, ON CUE." accent={C.purple} eyebrow="DO NOT DISTURB" top={326} size={64}/>
 <CenterRow><SettingRow icon="◐" title="Do not disturb" detail="FOCUS MODE · ACTIVE" color={C.purple} tag="ON"/></CenterRow>
 <div style={{position:'absolute',top:690,left:0,right:0,textAlign:'center'}}><Reveal delay={18}><div style={{fontFamily:TITLE_FONT,fontWeight:700,fontSize:18,letterSpacing:3,color:'#8b8893'}}>KEEP THE IMPORTANT THINGS LOUD.</div></Reveal></div>
 </SceneBase>}

function QuickTile({icon,title,detail,color,delay}:{icon:string;title:string;detail:string;color:string;delay:number}){
 const f=useCurrentFrame();const p=spring({frame:f-delay,fps:30,config:{damping:18,stiffness:115}});
 return <div style={{opacity:interpolate(f,[delay,delay+12],[0,1],CLAMP),transform:'translateY('+interpolate(p,[0,1],[16,0])+'px)',width:315,height:100,boxSizing:'border-box',border:'1px solid '+color+'50',borderRadius:15,background:'#101113',display:'flex',alignItems:'center',padding:'0 23px',gap:17,boxShadow:'0 0 28px '+color+'0b'}}>
  <Glyph color={color} size={19}>{icon}</Glyph><div style={{textAlign:'left'}}><div style={{fontSize:17,fontWeight:650}}>{title}</div><div style={{fontFamily:'ui-monospace,monospace',fontSize:9,letterSpacing:2,color,marginTop:7}}>{detail}</div></div>
 </div>;
}
function S5(){return <SceneBase index={5} accent={C.purple}>
 <Headline line1="ONE TAP AWAY." accent={C.purple} eyebrow="QUICK SETTINGS" top={236} size={65}/>
 <div style={{position:'absolute',top:430,left:0,right:0,display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap',padding:'0 250px',boxSizing:'border-box'}}>
  <QuickTile icon="⌁" title="Wi-Fi" detail="CONNECTED" color={C.blue} delay={4}/>
  <QuickTile icon="ᛒ" title="Bluetooth" detail="PAIRED" color={C.green} delay={8}/>
  <QuickTile icon="◐" title="Do not disturb" detail="ON" color={C.purple} delay={12}/>
  <QuickTile icon="☾" title="Night light" detail="SUNSET MODE" color={C.amber} delay={16}/>
 </div>
 </SceneBase>}

function S6(){const labels=[['◈','System'],['⌁','Network'],['ᛒ','Bluetooth & devices'],['▤','Personalization'],['◉','Accessibility'],['●','Accounts'],['⌑','Privacy & security'],['▣','Applications'],['↻','Updates'],['⌘','Developer']];
 return <SceneBase index={6} accent={C.purple}>
 <Headline line1="TEN CATEGORIES." accent={C.purple} eyebrow="ONE SEARCHABLE HOME" top={245} size={64}/>
 <div style={{position:'absolute',top:428,left:170,right:170,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:13}}>
 {labels.map(([icon,label],i)=><Reveal key={label} delay={i*2.2} y={12}><div style={{height:67,borderRadius:12,border:'1px solid #28282d',background:'#101113',display:'flex',alignItems:'center',gap:12,padding:'0 17px',boxSizing:'border-box',boxShadow:'inset 0 1px #ffffff05'}}><div style={{width:27,height:27,borderRadius:7,background:'#a47aff19',display:'grid',placeItems:'center',color:C.purple,fontSize:14}}>{icon}</div><div style={{fontSize:13,color:'#d7d5dd',fontWeight:600,whiteSpace:'nowrap'}}>{label}</div></div></Reveal>)}
 </div>
 </SceneBase>}

function S7(){const f=useCurrentFrame();const w=interpolate(f,[12,42],[0,100],CLAMP);
 const words=['','n','ni','nig','nigh','night'];const typed=words[Math.min(words.length-1,Math.floor(Math.max(0,f-5)/3))];
 const match=interpolate(f,[18,33],[0,1],CLAMP);
 return <SceneBase index={7} accent={C.amber}>
 <Headline line1="FIND IT INSTANTLY." accent={C.amber} eyebrow="TYPE · MATCH · GO" top={260} size={65}/>
 <div style={{position:'absolute',left:0,right:0,top:452,display:'flex',justifyContent:'center'}}><Reveal y={18}><div style={{width:660,height:55,border:'1px solid #3a3730',borderRadius:13,background:'#101113',display:'flex',alignItems:'center',padding:'0 19px',boxSizing:'border-box',gap:13,boxShadow:'0 0 25px #ffbd310a'}}><Glyph color={C.amber} size={19}>⌕</Glyph><span style={{fontSize:17,color:C.white,letterSpacing:.1,minWidth:70,textAlign:'left'}}>{typed}</span><span style={{width:2,height:20,background:C.amber,opacity:Math.sin(f/3)>0?1:0}}/><span style={{marginLeft:'auto',fontFamily:'ui-monospace,monospace',fontSize:9,letterSpacing:2,color:'#6c675d'}}>SEARCH SETTINGS</span></div></Reveal></div>
 <div style={{position:'absolute',top:523,left:0,right:0,display:'flex',justifyContent:'center',opacity:match}}><Reveal delay={7} y={14}><div style={{width:660,height:84,border:'1px solid #ffbd315d',borderRadius:14,background:'#101113',boxSizing:'border-box',padding:'0 23px',display:'flex',alignItems:'center',gap:17,boxShadow:'0 0 38px #ffbd3114'}}><Glyph color={C.amber} size={20}>☾</Glyph><div style={{flex:1,textAlign:'left'}}><div style={{fontSize:16,fontWeight:650}}>Night light</div><div style={{fontSize:11,color:C.muted,marginTop:6}}>Warmer display after dark</div></div><span style={{fontFamily:'ui-monospace,monospace',fontSize:10,color:C.amber,letterSpacing:2}}>MATCH FOUND</span><div style={{width:26,height:26,borderRadius:20,background:C.amber,color:'#1b1404',display:'grid',placeItems:'center',fontSize:17}}>✓</div></div></Reveal></div>
 <div style={{position:'absolute',top:636,left:'50%',width:660,height:2,background:'#ffbd3129',transform:'translateX(-50%)'}}><div style={{height:2,width:w+'%',background:C.amber,boxShadow:'0 0 9px '+C.amber}}/></div>
 </SceneBase>}

function S8(){return <SceneBase index={8} accent={C.amber}>
 <Headline line1="EVERY LEVEL OF LIGHT." accent={C.amber} eyebrow="BRIGHTNESS · YOUR TERMS" top={296} size={60}/>
 <div style={{position:'absolute',top:535,left:0,right:0}}><Reveal delay={7} y={12}><Slider color={C.purple} value={91} label="DISPLAY BRIGHTNESS" icon="☼" width={725}/></Reveal></div>
 <div style={{position:'absolute',top:682,left:0,right:0,textAlign:'center'}}><Reveal delay={20}><div style={{fontFamily:'ui-monospace,monospace',fontSize:10,color:'#6a596e',letterSpacing:3}}>PRECISE CONTROL · ZERO FRICTION</div></Reveal></div>
 </SceneBase>}

function S9(){const f=useCurrentFrame();const selected=Math.min(2,Math.floor(Math.max(0,f-18)/17));
 const options=[['LIGHT','#e7e7e9'],['DARK','#5a5862'],['OLED','#060608']];
 return <SceneBase index={9} accent={C.purple}>
 <Headline line1="THREE MOODS." accent={C.purple} eyebrow="LIGHT · DARK · OLED" top={235} size={66}/>
 <div style={{position:'absolute',top:418,left:0,right:0,display:'flex',justifyContent:'center'}}><Reveal delay={7} y={13}><div style={{width:630,height:220,border:'1px solid #28282d',borderRadius:15,background:'#101113',padding:18,boxSizing:'border-box',boxShadow:'0 0 40px #a47aff0a'}}>
  <div style={{display:'flex',justifyContent:'space-between',marginBottom:17}}>{['—','—','—'].map((x,i)=><div key={i} style={{height:5,width:65,borderRadius:4,background:i===selected?C.purple:'#34323a'}}/>)}</div>
  <div style={{display:'flex',gap:12,height:130}}>{['#eeeef0','#25242a','#030304'].map((bg,i)=><div key={bg} style={{flex:1,borderRadius:9,background:bg,border:'1px solid '+(i===selected?C.purple:'#36343c'),boxShadow:i===selected?'0 0 20px #a47aff20':'none',padding:12,boxSizing:'border-box'}}><div style={{height:6,width:'65%',borderRadius:4,background:i===0?'#b8b8bf':i===1?'#777480':'#33313a'}}/><div style={{height:6,width:'42%',borderRadius:4,background:i===0?'#c9c9ce':i===1?'#56535f':'#242228',marginTop:10}}/><div style={{height:24,width:'100%',borderRadius:5,background:i===0?'#dbdbe0':i===1?'#38363f':'#121114',marginTop:18}}/></div>)}</div>
 </div></Reveal></div>
 <div style={{position:'absolute',top:676,left:0,right:0,display:'flex',justifyContent:'center',gap:9}}>{options.map(([name,bg],i)=><div key={name} style={{width:104,height:35,borderRadius:19,border:'1px solid '+(selected===i?C.purple:'#35333a'),background:selected===i?'#a47aff20':'#0c0c0e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,letterSpacing:2,color:selected===i?C.purple:C.muted}}>{name}</div>)}</div>
 </SceneBase>}

function S10(){const f=useCurrentFrame();const swatches=[C.blue,C.purple,C.green,C.coral,C.amber,'#e2e3e7','#00d7c1','#fa65b4'];
 const chosen=f<21?0:f<35?1:3;
 return <SceneBase index={10} accent={C.coral}>
 <Headline line1="MAKE IT YOURS." accent={C.purple} eyebrow="7 ACCENT SEEDS · ONE TAP" top={285} size={65}/>
 <div style={{position:'absolute',top:482,left:0,right:0,display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>{swatches.map((color,i)=><Reveal key={color} delay={i*2} y={12}><div style={{width:31,height:31,borderRadius:30,background:color,border:i===chosen?'3px solid #fff':'2px solid #242329',boxSizing:'border-box',boxShadow:i===chosen?'0 0 25px '+color+'90,0 0 50px '+color+'30':'0 2px 6px #000',transform:i===chosen?'scale(1.16)':'scale(1)'}}/></Reveal>)}</div>
 <Reveal delay={22} y={9}><div style={{position:'absolute',top:560,left:'50%',transform:'translateX(-50%)',height:42,padding:'0 27px',border:'1px solid #ff654f7a',borderRadius:24,background:'#ff654f16',display:'flex',alignItems:'center',fontSize:11,fontWeight:700,letterSpacing:3,color:C.coral,boxShadow:'0 0 28px #ff654f12',whiteSpace:'nowrap'}}>SUNSET CORAL</div></Reveal>
 <div style={{position:'absolute',top:657,left:0,right:0,textAlign:'center'}}><Reveal delay={27}><div style={{fontFamily:'ui-monospace,monospace',fontSize:10,letterSpacing:3,color:'#75606a'}}>YOUR PALETTE. YOUR SYSTEM.</div></Reveal></div>
 </SceneBase>}

function S11(){return <SceneBase index={11} accent={C.amber}>
 <Headline line1="NIGHT LIGHT, ON." accent={C.amber} eyebrow="SUNSET → SUNRISE" top={318} size={64}/>
 <CenterRow><SettingRow icon="☾" title="Night light" detail="WARMER DISPLAY AFTER DARK" color={C.amber} tag="ENABLED"/></CenterRow>
 <div style={{position:'absolute',top:695,left:0,right:0,textAlign:'center'}}><Reveal delay={19}><div style={{fontFamily:TITLE_FONT,fontSize:19,letterSpacing:3,fontWeight:700,color:'#bab6be'}}>EASIER ON THE EYES. BUILT INTO YOUR FLOW.</div></Reveal></div>
 </SceneBase>}

function S12(){const f=useCurrentFrame(),{fps}=useVideoConfig();const p=spring({frame:f-6,fps,config:{damping:15,stiffness:80}});const pulse=.25+.15*(Math.sin(f/11)+1);
 return <SceneBase index={12} accent={C.purple}>
 <div style={{position:'absolute',left:0,right:0,top:284,textAlign:'center'}}>
  <Reveal y={10} delay={3}><div style={{fontFamily:TITLE_FONT,fontSize:92,fontWeight:900,letterSpacing:5,color:C.white,textShadow:'0 0 45px #a47aff20'}}>ZETTINGS<span style={{color:C.purple}}>.</span></div></Reveal>
  <Reveal y={10} delay={12}><div style={{fontFamily:'ui-monospace,monospace',fontSize:14,letterSpacing:5,color:C.purple,marginTop:25}}>SYSTEM SETTINGS, RECONSIDERED.</div></Reveal>
  <Reveal y={8} delay={23}><div style={{fontSize:15,letterSpacing:1,color:'#88858f',marginTop:29}}>A Zyntrix OS experience.</div></Reveal>
 </div>
 <div style={{position:'absolute',left:'50%',top:590,transform:'translateX(-50%) scale('+(.96+.04*p)+')',filter:'drop-shadow(0 0 30px rgba(164,122,255,'+pulse+'))'}}>
  <svg width="84" height="84" viewBox="0 0 84 84" fill="none"><circle cx="42" cy="42" r="34" stroke={C.purple} strokeOpacity=".32"/><path d="M23 27H61L25 57H61" stroke={C.purple} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="61" cy="27" r="2.5" fill="white"/><circle cx="25" cy="57" r="2.5" fill="white"/></svg>
 </div>
 <div style={{position:'absolute',top:720,left:0,right:0,textAlign:'center'}}><Reveal delay={29}><div style={{fontFamily:'ui-monospace,monospace',fontSize:10,color:'#5f596a',letterSpacing:4}}>MADE FOR THE WAY YOU WORK.</div></Reveal></div>
 </SceneBase>}

const SCENES=[S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S12];
const DURATIONS=[121,121,121,121,122,122,122,122,122,122,122,122];
const SceneAt:React.FC<{index:number}>=({index})=>{const Component=SCENES[index];return <Component/>};

export const Trailer:React.FC=()=>{
 let start=0;
 const seq=SCENES.map((_,i)=>{
   const item={index:i,from:start,duration:DURATIONS[i]};
   start+=DURATIONS[i]-10;
   return item;
 });
 return <AbsoluteFill style={{background:C.bg,fontFamily:UI_FONT}}>
   {seq.map(s=><Sequence key={s.index} from={s.from} durationInFrames={s.duration}><SceneAt index={s.index}/></Sequence>)}
 </AbsoluteFill>;
};
export const TrailerRoot:React.FC=()=> <Composition id="Trailer" component={Trailer} durationInFrames={1350} fps={30} width={1920} height={1080}/>;
