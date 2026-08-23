import React from 'react';
const CSS=`
.cw-stat{display:flex;flex-direction:column;gap:6px;padding:var(--pad-card-tight) 16px;background:var(--surface-card);border:1px solid var(--border-subtle);border-radius:var(--radius-tile);box-shadow:var(--shadow-xs);min-width:0;transition:var(--transition-surface)}
.cw-stat--sunken{background:var(--surface-sunken);border-color:transparent;box-shadow:none}
.cw-stat--brand{background:var(--surface-brand);border-color:transparent;box-shadow:var(--shadow-brand)}
.cw-stat--brand .cw-stat__label,.cw-stat--brand .cw-stat__value,.cw-stat--brand .cw-stat__unit{color:var(--cream-50)}
.cw-stat--brand .cw-stat__label{opacity:.72}
.cw-stat__label{display:flex;align-items:center;gap:6px;font:var(--type-overline);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-muted)}
.cw-stat__row{display:flex;align-items:baseline;gap:5px;flex-wrap:wrap}
.cw-stat__value{font:var(--weight-bold) var(--text-2xl)/1 var(--font-display);letter-spacing:var(--tracking-tight);color:var(--text-strong);font-variant-numeric:tabular-nums}
.cw-stat--lg .cw-stat__value{font-size:var(--text-3xl)}
.cw-stat__unit{font:var(--weight-semibold) var(--text-base)/1 var(--font-body);color:var(--text-muted)}
.cw-stat__foot{display:flex;align-items:center;gap:6px;font:var(--type-caption);color:var(--text-muted)}
.cw-stat__delta{display:inline-flex;align-items:center;gap:3px;font:var(--weight-bold) var(--text-xs)/1 var(--font-body)}
.cw-stat__delta--good{color:var(--good)}
.cw-stat__delta--over{color:var(--over)}
.cw-stat__delta--flat{color:var(--text-muted)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','stattile');s.textContent=CSS;document.head.appendChild(s)}
export function StatTile({label,value,unit,delta,deltaTone='flat',caption,icon,variant='default',size='md',...rest}){
  inject();
  const cls=['cw-stat',variant!=='default'&&'cw-stat--'+variant,size==='lg'&&'cw-stat--lg'].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>
    <span className="cw-stat__label">{icon}{label}</span>
    <span className="cw-stat__row"><span className="cw-stat__value">{value}</span>{unit&&<span className="cw-stat__unit">{unit}</span>}</span>
    {(delta||caption)&&<span className="cw-stat__foot">{delta&&<span className={'cw-stat__delta cw-stat__delta--'+deltaTone}>{delta}</span>}{caption}</span>}
  </div>;
}
