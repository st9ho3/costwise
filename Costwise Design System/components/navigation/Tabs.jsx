import React from 'react';
const CSS=`
.cw-tabs{display:inline-flex;align-items:center;gap:4px;padding:4px;background:var(--surface-sunken);border-radius:var(--radius-pill)}
.cw-tabs--block{display:flex;width:100%}
.cw-tab{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:7px;height:36px;padding:0 16px;border:0;border-radius:var(--radius-pill);background:transparent;color:var(--text-muted);font:var(--weight-bold) var(--text-sm)/1 var(--font-body);cursor:pointer;white-space:nowrap;transition:var(--transition-control)}
.cw-tab:hover{color:var(--text-strong)}
.cw-tab--active{background:var(--surface-card);color:var(--text-strong);box-shadow:var(--shadow-sm)}
.cw-tab__count{font:var(--weight-bold) var(--text-2xs)/1 var(--font-body);padding:3px 6px;border-radius:var(--radius-pill);background:var(--cream-200);color:var(--text-muted)}
.cw-tab--active .cw-tab__count{background:var(--green-100);color:var(--green-800)}
.cw-tabs--underline{background:transparent;padding:0;gap:22px;border-bottom:1px solid var(--border-subtle);border-radius:0}
.cw-tabs--underline .cw-tab{flex:0 0 auto;height:42px;padding:0;border-radius:0;box-shadow:none;background:transparent;position:relative}
.cw-tabs--underline .cw-tab--active{color:var(--text-strong);background:transparent;box-shadow:none}
.cw-tabs--underline .cw-tab--active::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2.5px;border-radius:2px;background:var(--green-700)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','tabs');s.textContent=CSS;document.head.appendChild(s)}
export function Tabs({items=[],value,onChange,variant='pill',block=false,...rest}){
  inject();
  return <div className={['cw-tabs',variant==='underline'&&'cw-tabs--underline',block&&'cw-tabs--block'].filter(Boolean).join(' ')} role="tablist" {...rest}>
    {items.map(it=>{const id=typeof it==='string'?it:it.value,label=typeof it==='string'?it:it.label;
      const active=id===value;
      return <button key={id} role="tab" aria-selected={active} className={'cw-tab'+(active?' cw-tab--active':'')} onClick={()=>onChange&&onChange(id)}>{typeof it!=='string'&&it.icon}{label}{typeof it!=='string'&&it.count!=null&&<span className="cw-tab__count">{it.count}</span>}</button>;})}
  </div>;
}
