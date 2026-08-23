import React from 'react';
const CSS=`
.cw-comp{display:flex;align-items:center;gap:10px;padding:8px 10px 8px 12px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-pill);box-shadow:var(--shadow-md);transition:var(--transition-control)}
.cw-comp:focus-within{border-color:var(--green-400);box-shadow:var(--shadow-lg)}
.cw-comp input{flex:1;min-width:0;height:32px;border:0;outline:none;background:transparent;font:var(--type-body);color:var(--text-strong)}
.cw-comp input::placeholder{color:var(--text-faint)}
.cw-comp__lead{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:var(--surface-brand-soft);color:var(--green-700);flex:0 0 auto}
.cw-comp__send{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border:0;border-radius:50%;background:var(--green-800);color:var(--cream-50);cursor:pointer;flex:0 0 auto;transition:var(--transition-control)}
.cw-comp__send:hover{background:var(--green-700)}
.cw-comp__send:active{transform:scale(var(--press-scale))}
.cw-comp__send:disabled{background:var(--sand-300);color:var(--stone-500);cursor:not-allowed}
.cw-comp__tools{display:flex;align-items:center;gap:2px}
.cw-comp--flat{border-radius:var(--radius-card);box-shadow:var(--shadow-sm)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','composer');s.textContent=CSS;document.head.appendChild(s)}
export function Composer({placeholder='Ask Costwise anything about your numbers…',value,onChange,onSend,lead,tools,sendIcon,flat=false,...rest}){
  inject();
  const submit=e=>{e.preventDefault();onSend&&onSend();};
  return <form className={'cw-comp'+(flat?' cw-comp--flat':'')} onSubmit={submit} {...rest}>
    {lead&&<span className="cw-comp__lead">{lead}</span>}
    <input value={value} onChange={onChange} placeholder={placeholder}/>
    {tools&&<span className="cw-comp__tools">{tools}</span>}
    <button className="cw-comp__send" type="submit" aria-label="Send" disabled={!value}>{sendIcon||'↑'}</button>
  </form>;
}
