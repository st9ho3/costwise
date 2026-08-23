import React from 'react';
const CSS=`
.cw-meter{display:flex;flex-direction:column;gap:7px;min-width:0}
.cw-meter__top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.cw-meter__label{font:var(--type-label);color:var(--text-strong)}
.cw-meter__value{font:var(--weight-bold) var(--text-sm)/1 var(--font-mono);font-variant-numeric:tabular-nums;color:var(--text-body)}
.cw-meter__track{position:relative;height:10px;border-radius:var(--radius-pill);background:var(--viz-track);overflow:hidden}
.cw-meter--thick .cw-meter__track{height:14px}
.cw-meter__fill{position:absolute;inset:0 auto 0 0;border-radius:var(--radius-pill);transition:width var(--dur-slow) var(--ease-out-soft)}
.cw-meter__target{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--ink-800);opacity:.55;border-radius:1px}
.cw-meter__foot{display:flex;align-items:center;gap:6px;font:var(--type-caption);color:var(--text-muted)}
.cw-meter__seg{display:flex;height:100%;width:100%}
.cw-meter__seg>span{height:100%}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','meter');s.textContent=CSS;document.head.appendChild(s)}
const TONES={good:'var(--good)',watch:'var(--watch)',over:'var(--over)',brand:'var(--green-600)',info:'var(--info)'};
export function ProgressMeter({label,value=0,max=100,tone='brand',display,target,caption,segments,thick=false,...rest}){
  inject();
  const pct=Math.max(0,Math.min(100,(value/max)*100));
  return <div className={'cw-meter'+(thick?' cw-meter--thick':'')} {...rest}>
    {(label||display)&&<div className="cw-meter__top">{label&&<span className="cw-meter__label">{label}</span>}{display&&<span className="cw-meter__value">{display}</span>}</div>}
    <div className="cw-meter__track">
      {segments?<div className="cw-meter__seg">{segments.map((s,i)=><span key={i} style={{width:(s.value/max*100)+'%',background:s.color||`var(--viz-${(i%6)+1})`}}/>)}</div>
        :<div className="cw-meter__fill" style={{width:pct+'%',background:TONES[tone]||tone}}/>}
      {target!=null&&<span className="cw-meter__target" style={{left:Math.min(100,(target/max)*100)+'%'}}/>}
    </div>
    {caption&&<span className="cw-meter__foot">{caption}</span>}
  </div>;
}
