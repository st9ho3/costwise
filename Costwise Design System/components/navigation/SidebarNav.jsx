import React from 'react';
const CSS=`
.cw-side{display:flex;flex-direction:column;gap:2px}
.cw-side__group{font:var(--type-overline);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-muted);padding:16px 12px 6px}
.cw-side__item{display:flex;align-items:center;gap:11px;width:100%;min-height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-body);font:var(--weight-semibold) var(--text-base)/1.2 var(--font-body);cursor:pointer;text-align:left;transition:var(--transition-control)}
.cw-side__item:hover{background:var(--cream-100);color:var(--text-strong)}
.cw-side__item--active{background:var(--surface-brand-soft);color:var(--green-800)}
.cw-side__item--active:hover{background:var(--green-100)}
.cw-side__label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-side__badge{font:var(--weight-bold) var(--text-2xs)/1 var(--font-body);padding:4px 7px;border-radius:var(--radius-pill);background:var(--gold-300);color:var(--gold-800)}
.cw-side--collapsed .cw-side__item{justify-content:center;padding:0}
.cw-side--collapsed .cw-side__label,.cw-side--collapsed .cw-side__badge,.cw-side--collapsed .cw-side__group{display:none}
.cw-side--inverse .cw-side__item{color:rgba(253,251,246,.78)}
.cw-side--inverse .cw-side__item:hover{background:rgba(253,251,246,.10);color:var(--cream-50)}
.cw-side--inverse .cw-side__item--active{background:rgba(253,251,246,.14);color:var(--cream-50)}
.cw-side--inverse .cw-side__group{color:rgba(253,251,246,.5)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','sidebar');s.textContent=CSS;document.head.appendChild(s)}
export function SidebarNav({items=[],value,onChange,collapsed=false,inverse=false,...rest}){
  inject();
  return <nav className={['cw-side',collapsed&&'cw-side--collapsed',inverse&&'cw-side--inverse'].filter(Boolean).join(' ')} {...rest}>
    {items.map((it,i)=>it.group?<div key={'g'+i} className="cw-side__group">{it.group}</div>
      :<button key={it.value} className={'cw-side__item'+(it.value===value?' cw-side__item--active':'')} onClick={()=>onChange&&onChange(it.value)} title={it.label}>
        {it.icon}<span className="cw-side__label">{it.label}</span>{it.badge&&<span className="cw-side__badge">{it.badge}</span>}
      </button>)}
  </nav>;
}
