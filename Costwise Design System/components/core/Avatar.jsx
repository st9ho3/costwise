import React from 'react';
const CSS=`
.cw-avatar{--s:36px;position:relative;display:inline-flex;align-items:center;justify-content:center;width:var(--s);height:var(--s);border-radius:var(--radius-pill);background:var(--green-100);color:var(--green-800);font:var(--weight-bold) 13px/1 var(--font-body);overflow:hidden;flex:0 0 auto;user-select:none}
.cw-avatar--sm{--s:28px;font-size:11px}
.cw-avatar--lg{--s:48px;font-size:16px}
.cw-avatar--xl{--s:64px;font-size:20px}
.cw-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.cw-avatar--agent{background:var(--green-800);padding:3px}
.cw-avatar--agent img{object-fit:contain}
.cw-avatar__dot{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:var(--good);box-shadow:0 0 0 2px var(--surface-card)}
.cw-avatar__ring{box-shadow:0 0 0 2px var(--surface-card)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','avatar');s.textContent=CSS;document.head.appendChild(s)}
export function Avatar({name='',src,size='md',agent=false,online=false,style,...rest}){
  inject();
  const initials=name.trim().split(/\s+/).slice(0,2).map(p=>p[0]||'').join('').toUpperCase();
  const cls=['cw-avatar',size!=='md'&&'cw-avatar--'+size,agent&&'cw-avatar--agent'].filter(Boolean).join(' ');
  return <span className={cls} style={style} title={name||undefined} {...rest}>{src?<img src={src} alt={name}/>:initials}{online&&<span className="cw-avatar__dot"/>}</span>;
}
