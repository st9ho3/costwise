import React,{useState} from 'react';
const CSS=`
.cw-tip-wrap{position:relative;display:inline-flex}
.cw-tip{position:absolute;z-index:40;padding:7px 10px;background:var(--ink-900);color:var(--cream-50);border-radius:var(--radius-sm);font:var(--weight-semibold) var(--text-xs)/1.35 var(--font-body);white-space:nowrap;box-shadow:var(--shadow-md);pointer-events:none;animation:cw-tipin var(--dur-fast) var(--ease-out-soft)}
.cw-tip--wrap{white-space:normal;width:220px}
.cw-tip--top{bottom:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.cw-tip--bottom{top:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.cw-tip--right{left:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.cw-tip--left{right:calc(100% + 8px);top:50%;transform:translateY(-50%)}
@keyframes cw-tipin{from{opacity:0}to{opacity:1}}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','tooltip');s.textContent=CSS;document.head.appendChild(s)}
export function Tooltip({label,side='top',wrap=false,children,...rest}){
  inject();
  const [on,setOn]=useState(false);
  return <span className="cw-tip-wrap" onMouseEnter={()=>setOn(true)} onMouseLeave={()=>setOn(false)} onFocus={()=>setOn(true)} onBlur={()=>setOn(false)} {...rest}>
    {children}
    {on&&<span className={'cw-tip cw-tip--'+side+(wrap?' cw-tip--wrap':'')} role="tooltip">{label}</span>}
  </span>;
}
