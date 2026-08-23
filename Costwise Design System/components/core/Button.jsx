import React from 'react';
const CSS=`
.cw-btn{--h:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:var(--h);padding:0 18px;border:1px solid transparent;border-radius:var(--radius-control);font:var(--weight-bold) var(--text-base)/1 var(--font-body);letter-spacing:var(--tracking-snug);cursor:pointer;white-space:nowrap;transition:var(--transition-control);text-decoration:none}
.cw-btn:active:not(:disabled){transform:scale(var(--press-scale))}
.cw-btn:disabled{opacity:.42;cursor:not-allowed;box-shadow:none}
.cw-btn--sm{--h:36px;padding:0 14px;font-size:var(--text-sm)}
.cw-btn--lg{--h:52px;padding:0 24px;font-size:var(--text-md)}
.cw-btn--pill{border-radius:var(--radius-pill)}
.cw-btn--block{width:100%}
.cw-btn--primary{background:var(--green-800);color:var(--text-on-brand);box-shadow:var(--shadow-brand)}
.cw-btn--primary:hover:not(:disabled){background:var(--green-700);transform:translateY(var(--lift-hover))}
.cw-btn--primary:active:not(:disabled){background:var(--green-900);transform:scale(var(--press-scale))}
.cw-btn--accent{background:var(--gold-500);color:var(--text-on-accent);box-shadow:var(--shadow-sm)}
.cw-btn--accent:hover:not(:disabled){background:var(--gold-400);transform:translateY(var(--lift-hover))}
.cw-btn--secondary{background:var(--surface-card);color:var(--text-strong);border-color:var(--border-default);box-shadow:var(--shadow-xs)}
.cw-btn--secondary:hover:not(:disabled){background:var(--cream-100);border-color:var(--border-strong)}
.cw-btn--ghost{background:transparent;color:var(--text-brand)}
.cw-btn--ghost:hover:not(:disabled){background:var(--surface-brand-soft)}
.cw-btn--danger{background:var(--over);color:#fff}
.cw-btn--danger:hover:not(:disabled){background:var(--tomato-700)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','button');s.textContent=CSS;document.head.appendChild(s)}
export function Button({variant='primary',size='md',pill=false,block=false,iconLeft,iconRight,children,as='button',...rest}){
  inject();
  const Tag=as;
  const cls=['cw-btn','cw-btn--'+variant,size!=='md'&&'cw-btn--'+size,pill&&'cw-btn--pill',block&&'cw-btn--block'].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{iconLeft}{children}{iconRight}</Tag>;
}
