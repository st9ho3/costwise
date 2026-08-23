import React from 'react';
const CSS=`
.cw-dlg__scrim{position:fixed;inset:0;background:var(--surface-overlay);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:60;animation:cw-fade var(--dur-base) var(--ease-out-soft)}
.cw-dlg{width:100%;max-width:440px;background:var(--surface-card);border-radius:var(--radius-sheet);box-shadow:var(--shadow-pop);padding:24px;animation:cw-pop var(--dur-base) var(--ease-nudge)}
.cw-dlg--wide{max-width:640px}
.cw-dlg--sheet{max-width:520px;align-self:flex-end;border-bottom-left-radius:0;border-bottom-right-radius:0}
.cw-dlg__head{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
.cw-dlg__title{flex:1;font:var(--type-title);font-size:var(--text-xl);color:var(--text-strong)}
.cw-dlg__body{font:var(--type-body);color:var(--text-body)}
.cw-dlg__foot{display:flex;gap:10px;justify-content:flex-end;margin-top:22px;flex-wrap:wrap}
@keyframes cw-fade{from{opacity:0}to{opacity:1}}
@keyframes cw-pop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','dialog');s.textContent=CSS;document.head.appendChild(s)}
export function Dialog({open=true,title,icon,children,footer,onClose,size='md',...rest}){
  inject();
  if(!open)return null;
  return <div className="cw-dlg__scrim" onClick={onClose}>
    <div className={'cw-dlg'+(size==='wide'?' cw-dlg--wide':'')+(size==='sheet'?' cw-dlg--sheet':'')} role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()} {...rest}>
      <div className="cw-dlg__head">{icon}<div className="cw-dlg__title">{title}</div></div>
      <div className="cw-dlg__body">{children}</div>
      {footer&&<div className="cw-dlg__foot">{footer}</div>}
    </div>
  </div>;
}
