import React from 'react';
const CSS=`
.cw-check{display:inline-flex;align-items:flex-start;gap:10px;cursor:pointer;font:var(--type-body);color:var(--text-body);min-height:24px}
.cw-check input{position:absolute;opacity:0;width:0;height:0}
.cw-check__box{flex:0 0 auto;width:20px;height:20px;margin-top:1px;border:1.5px solid var(--border-strong);border-radius:var(--radius-xs);background:var(--surface-card);display:inline-flex;align-items:center;justify-content:center;transition:var(--transition-control)}
.cw-check:hover .cw-check__box{border-color:var(--green-500)}
.cw-check input:checked+.cw-check__box{background:var(--green-700);border-color:var(--green-700)}
.cw-check input:focus-visible+.cw-check__box{box-shadow:var(--ring-focus)}
.cw-check__tick{width:11px;height:11px;stroke:var(--cream-50);stroke-width:3;fill:none;opacity:0;transform:scale(.6);transition:opacity var(--dur-fast) var(--ease-out-soft),transform var(--dur-fast) var(--ease-nudge)}
.cw-check input:checked+.cw-check__box .cw-check__tick{opacity:1;transform:scale(1)}
.cw-check--disabled{opacity:.45;cursor:not-allowed}
.cw-check__text strong{display:block;font-weight:var(--weight-semibold);color:var(--text-strong)}
.cw-check__text span{display:block;font:var(--type-caption);color:var(--text-muted)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','checkbox');s.textContent=CSS;document.head.appendChild(s)}
export function Checkbox({label,description,disabled=false,...rest}){
  inject();
  return <label className={'cw-check'+(disabled?' cw-check--disabled':'')}>
    <input type="checkbox" disabled={disabled} {...rest}/>
    <span className="cw-check__box"><svg className="cw-check__tick" viewBox="0 0 12 12"><polyline points="1.5,6.5 4.5,9.5 10.5,2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
    <span className="cw-check__text">{description?<><strong>{label}</strong><span>{description}</span></>:label}</span>
  </label>;
}
