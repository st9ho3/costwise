import React from 'react';
const CSS=`
.cw-bub{display:flex;gap:10px;max-width:100%;align-items:flex-end}
.cw-bub--me{flex-direction:row-reverse}
.cw-bub__body{max-width:min(560px,86%);display:flex;flex-direction:column;gap:6px}
.cw-bub__msg{padding:12px 15px;border-radius:var(--radius-bubble);font:var(--type-body);color:var(--text-body);background:var(--surface-card);border:1px solid var(--border-subtle);box-shadow:var(--shadow-xs);border-bottom-left-radius:8px}
.cw-bub--me .cw-bub__msg{background:var(--green-800);color:var(--cream-50);border-color:transparent;box-shadow:var(--shadow-brand);border-bottom-left-radius:var(--radius-bubble);border-bottom-right-radius:8px}
.cw-bub--note .cw-bub__msg{background:var(--surface-accent-soft);border-color:#F0E3BE;box-shadow:none;color:var(--ink-800)}
.cw-bub__msg strong{font-weight:var(--weight-bold);color:inherit}
.cw-bub__meta{display:flex;align-items:center;gap:7px;font:var(--type-caption);color:var(--text-muted);padding:0 4px}
.cw-bub--me .cw-bub__meta{justify-content:flex-end}
.cw-bub__typing{display:inline-flex;gap:4px;align-items:center;padding:4px 2px}
.cw-bub__typing i{width:6px;height:6px;border-radius:50%;background:var(--green-400);animation:cw-bounce 1.1s var(--ease-in-out-soft) infinite}
.cw-bub__typing i:nth-child(2){animation-delay:.14s}
.cw-bub__typing i:nth-child(3){animation-delay:.28s}
@keyframes cw-bounce{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}
.cw-bub__slot{margin-top:2px}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','bubble');s.textContent=CSS;document.head.appendChild(s)}
export function ChatBubble({from='agent',children,avatar,meta,typing=false,tone='default',attachment,...rest}){
  inject();
  const cls=['cw-bub',from==='me'&&'cw-bub--me',tone==='note'&&'cw-bub--note'].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>
    {avatar}
    <div className="cw-bub__body">
      <div className="cw-bub__msg">{typing?<span className="cw-bub__typing"><i/><i/><i/></span>:children}</div>
      {attachment&&<div className="cw-bub__slot">{attachment}</div>}
      {meta&&<span className="cw-bub__meta">{meta}</span>}
    </div>
  </div>;
}
