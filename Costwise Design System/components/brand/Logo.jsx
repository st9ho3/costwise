import React from 'react';
const CSS=`
.cw-logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none;border:0;color:inherit}
.cw-logo img{display:block;flex:0 0 auto}
.cw-logo__word{font-family:var(--font-logotype);font-weight:800;letter-spacing:-.015em;line-height:1;color:var(--green-800)}
.cw-logo--inverse .cw-logo__word{color:var(--cream-50)}
.cw-logo__plate{display:inline-flex;align-items:center;justify-content:center;background:var(--green-800);border-radius:var(--radius-md);padding:5px}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','logo');s.textContent=CSS;document.head.appendChild(s)}
export function Logo({size=28,variant='full',inverse=false,plate=false,src='assets/logo-mark-transparent.png',...rest}){
  inject();
  const mark=<img src={src} alt="Costwise" width={size} height={size}/>;
  return <span className={'cw-logo'+(inverse?' cw-logo--inverse':'')} {...rest}>
    {plate?<span className="cw-logo__plate">{mark}</span>:mark}
    {variant==='full'&&<span className="cw-logo__word" style={{fontSize:Math.round(size*0.82)}}>Costwise</span>}
  </span>;
}
