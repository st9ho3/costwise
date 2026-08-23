import React from 'react';
const CSS=`
.cw-switch{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font:var(--type-body);color:var(--text-body)}
.cw-switch input{position:absolute;opacity:0;width:0;height:0}
.cw-switch__track{position:relative;flex:0 0 auto;width:46px;height:28px;border-radius:var(--radius-pill);background:var(--sand-300);transition:background-color var(--dur-base) var(--ease-out-soft)}
.cw-switch__knob{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:var(--white);box-shadow:var(--shadow-sm);transition:transform var(--dur-base) var(--ease-nudge)}
.cw-switch input:checked+.cw-switch__track{background:var(--green-600)}
.cw-switch input:checked+.cw-switch__track .cw-switch__knob{transform:translateX(18px)}
.cw-switch input:focus-visible+.cw-switch__track{box-shadow:var(--ring-focus)}
.cw-switch--sm .cw-switch__track{width:38px;height:23px}
.cw-switch--sm .cw-switch__knob{width:18px;height:18px;top:2.5px;left:2.5px}
.cw-switch--sm input:checked+.cw-switch__track .cw-switch__knob{transform:translateX(15px)}
.cw-switch--disabled{opacity:.45;cursor:not-allowed}
.cw-switch__text strong{display:block;font-weight:var(--weight-semibold);color:var(--text-strong)}
.cw-switch__text span{display:block;font:var(--type-caption);color:var(--text-muted)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','switch');s.textContent=CSS;document.head.appendChild(s)}
export function Switch({label,description,size='md',disabled=false,reversed=true,...rest}){
  inject();
  const control=<><input type="checkbox" role="switch" disabled={disabled} {...rest}/><span className="cw-switch__track"><span className="cw-switch__knob"/></span></>;
  const text=label&&<span className="cw-switch__text">{description?<><strong>{label}</strong><span>{description}</span></>:label}</span>;
  return <label className={['cw-switch',size==='sm'&&'cw-switch--sm',disabled&&'cw-switch--disabled'].filter(Boolean).join(' ')} style={reversed?{width:'100%',justifyContent:'space-between'}:undefined}>
    {reversed?<>{text}{control}</>:<>{control}{text}</>}
  </label>;
}
