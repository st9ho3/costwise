import React from 'react';
const CSS=`
.cw-field{display:flex;flex-direction:column;gap:6px}
.cw-field__label{font:var(--type-label);color:var(--text-strong)}
.cw-field__hint{font:var(--type-caption);color:var(--text-muted)}
.cw-field__hint--error{color:var(--over-text)}
.cw-input{display:flex;align-items:center;gap:9px;height:var(--height-control);padding:0 14px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-control);color:var(--text-strong);transition:var(--transition-control)}
.cw-input:hover{border-color:var(--border-strong)}
.cw-input:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus)}
.cw-input--error{border-color:var(--over)}
.cw-input--error:focus-within{box-shadow:var(--ring-danger)}
.cw-input--filled{background:var(--surface-sunken);border-color:transparent}
.cw-input--lg{height:52px;padding:0 16px}
.cw-input input{flex:1;min-width:0;border:0;background:transparent;outline:none;font:var(--type-body);color:var(--text-strong)}
.cw-input input::placeholder{color:var(--text-faint)}
.cw-input--disabled{background:var(--cream-100);opacity:.6}
.cw-input__affix{font:var(--type-label);color:var(--text-muted);white-space:nowrap}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','input');s.textContent=CSS;document.head.appendChild(s)}
export function Input({label,hint,error,icon,suffix,size='md',filled=false,id,...rest}){
  inject();
  const fid=id||'cw-in-'+Math.random().toString(36).slice(2,8);
  const cls=['cw-input',error&&'cw-input--error',filled&&'cw-input--filled',size==='lg'&&'cw-input--lg',rest.disabled&&'cw-input--disabled'].filter(Boolean).join(' ');
  return <div className="cw-field">
    {label&&<label className="cw-field__label" htmlFor={fid}>{label}</label>}
    <div className={cls}>{icon&&<span className="cw-input__affix" style={{display:'inline-flex'}}>{icon}</span>}<input id={fid} {...rest}/>{suffix&&<span className="cw-input__affix">{suffix}</span>}</div>
    {(error||hint)&&<span className={'cw-field__hint'+(error?' cw-field__hint--error':'')}>{error||hint}</span>}
  </div>;
}
