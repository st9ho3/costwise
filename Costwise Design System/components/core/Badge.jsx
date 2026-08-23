import React from 'react';
const CSS=`
.cw-badge{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:var(--radius-pill);font:var(--weight-bold) var(--text-xs)/1 var(--font-body);letter-spacing:var(--tracking-snug);white-space:nowrap}
.cw-badge--lg{height:28px;padding:0 12px;font-size:var(--text-sm)}
.cw-badge--neutral{background:var(--cream-200);color:var(--ink-700)}
.cw-badge--good{background:var(--good-soft);color:var(--good-text)}
.cw-badge--watch{background:var(--watch-soft);color:var(--watch-text)}
.cw-badge--over{background:var(--over-soft);color:var(--over-text)}
.cw-badge--info{background:var(--info-soft);color:var(--info-text)}
.cw-badge--agent{background:var(--agent-soft);color:var(--agent-text)}
.cw-badge--brand{background:var(--green-800);color:var(--text-on-brand)}
.cw-badge--outline{background:transparent;border:1px solid var(--border-default);color:var(--text-body)}
.cw-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.8}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','badge');s.textContent=CSS;document.head.appendChild(s)}
export function Badge({tone='neutral',size='md',dot=false,icon,children,...rest}){
  inject();
  return <span className={['cw-badge','cw-badge--'+tone,size==='lg'&&'cw-badge--lg'].filter(Boolean).join(' ')} {...rest}>{dot&&<span className="cw-badge__dot"/>}{icon}{children}</span>;
}
