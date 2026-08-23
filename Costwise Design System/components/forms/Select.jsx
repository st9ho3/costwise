import React from 'react';
const CSS=`
.cw-select-wrap{display:flex;flex-direction:column;gap:6px}
.cw-select-wrap__label{font:var(--type-label);color:var(--text-strong)}
.cw-select{position:relative;display:flex;align-items:center;height:var(--height-control);background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-control);transition:var(--transition-control)}
.cw-select:hover{border-color:var(--border-strong)}
.cw-select:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus)}
.cw-select--filled{background:var(--surface-sunken);border-color:transparent}
.cw-select select{appearance:none;width:100%;height:100%;padding:0 38px 0 14px;border:0;background:transparent;outline:none;font:var(--type-body);color:var(--text-strong);cursor:pointer}
.cw-select__chev{position:absolute;right:12px;pointer-events:none;color:var(--text-muted);display:inline-flex}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','select');s.textContent=CSS;document.head.appendChild(s)}
export function Select({label,options=[],filled=false,chevron,...rest}){
  inject();
  return <div className="cw-select-wrap">
    {label&&<label className="cw-select-wrap__label">{label}</label>}
    <div className={'cw-select'+(filled?' cw-select--filled':'')}>
      <select {...rest}>{options.map(o=>{const v=typeof o==='string'?o:o.value,l=typeof o==='string'?o:o.label;return <option key={v} value={v}>{l}</option>;})}</select>
      <span className="cw-select__chev">{chevron||'▾'}</span>
    </div>
  </div>;
}
