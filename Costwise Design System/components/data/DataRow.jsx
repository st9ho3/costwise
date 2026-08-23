import React from 'react';
const CSS=`
.cw-row{display:flex;align-items:center;gap:12px;padding:12px 4px;border-bottom:1px solid var(--border-subtle);text-align:left;background:none;border-left:0;border-right:0;border-top:0;width:100%;transition:var(--transition-control)}
.cw-row:last-child{border-bottom:0}
.cw-row--card{padding:14px 16px;border:1px solid var(--border-subtle);border-radius:var(--radius-card);background:var(--surface-card);box-shadow:var(--shadow-xs);margin-bottom:0}
.cw-row--interactive{cursor:pointer}
.cw-row--interactive:hover{background:var(--cream-100)}
.cw-row--card.cw-row--interactive:hover{background:var(--surface-card);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.cw-row__thumb{flex:0 0 auto;width:40px;height:40px;border-radius:var(--radius-md);background:var(--surface-brand-soft);display:inline-flex;align-items:center;justify-content:center;color:var(--green-700);overflow:hidden}
.cw-row__thumb img{width:100%;height:100%;object-fit:cover}
.cw-row__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.cw-row__title{font:var(--weight-semibold) var(--text-base)/1.3 var(--font-body);color:var(--text-strong);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-row__sub{font:var(--type-caption);color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-row__end{display:flex;align-items:center;gap:10px;flex:0 0 auto}
.cw-row__amount{font:var(--weight-bold) var(--text-base)/1.2 var(--font-mono);font-variant-numeric:tabular-nums;color:var(--text-strong);text-align:right}
.cw-row__amount small{display:block;font:var(--type-caption);font-family:var(--font-body);color:var(--text-muted);font-weight:400}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','datarow');s.textContent=CSS;document.head.appendChild(s)}
export function DataRow({thumb,title,subtitle,amount,amountNote,end,card=false,onClick,...rest}){
  inject();
  const Tag=onClick?'button':'div';
  const cls=['cw-row',card&&'cw-row--card',onClick&&'cw-row--interactive'].filter(Boolean).join(' ');
  return <Tag className={cls} onClick={onClick} {...rest}>
    {thumb&&<span className="cw-row__thumb">{thumb}</span>}
    <span className="cw-row__body"><span className="cw-row__title">{title}</span>{subtitle&&<span className="cw-row__sub">{subtitle}</span>}</span>
    <span className="cw-row__end">{amount!=null&&<span className="cw-row__amount">{amount}{amountNote&&<small>{amountNote}</small>}</span>}{end}</span>
  </Tag>;
}
