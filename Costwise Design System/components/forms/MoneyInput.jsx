import React from 'react';
const CSS=`
.cw-money-field{display:flex;flex-direction:column;gap:6px}
.cw-money-field__label{font:var(--type-label);color:var(--text-strong)}
.cw-money-box{display:flex;align-items:center;height:var(--height-control);padding:0 14px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-control);transition:var(--transition-control)}
.cw-money-box:hover{border-color:var(--border-strong)}
.cw-money-box:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus)}
.cw-money-box--lg{height:56px;padding:0 16px}
.cw-money-box__cur{font:var(--weight-bold) var(--text-md)/1 var(--font-display);color:var(--text-muted);margin-right:8px}
.cw-money-box--lg .cw-money-box__cur{font-size:var(--text-xl)}
.cw-money-box input{flex:1;min-width:0;border:0;outline:none;background:transparent;font:var(--weight-semibold) var(--text-md)/1 var(--font-mono);font-variant-numeric:tabular-nums;color:var(--text-strong)}
.cw-money-box--lg input{font-size:var(--text-2xl);font-family:var(--font-display);font-weight:700}
.cw-money-box__per{font:var(--type-caption);color:var(--text-muted);margin-left:8px;white-space:nowrap}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','money');s.textContent=CSS;document.head.appendChild(s)}
export function MoneyInput({label,currency='€',per,size='md',value,onChange,...rest}){
  inject();
  return <div className="cw-money-field">
    {label&&<label className="cw-money-field__label">{label}</label>}
    <div className={'cw-money-box'+(size==='lg'?' cw-money-box--lg':'')}>
      <span className="cw-money-box__cur">{currency}</span>
      <input inputMode="decimal" value={value} onChange={onChange} {...rest}/>
      {per&&<span className="cw-money-box__per">/ {per}</span>}
    </div>
  </div>;
}
