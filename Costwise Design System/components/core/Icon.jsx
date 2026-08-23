import React,{useEffect,useRef} from 'react';
const pascal=n=>n.split(/[-_ ]/).filter(Boolean).map(p=>p[0].toUpperCase()+p.slice(1)).join('');
/** Lucide glyph wrapper. Costwise ships no icon binaries, so Lucide (rounded caps, 1.75 stroke) is the house set. */
export function Icon({name,size=20,strokeWidth=1.75,color='currentColor',style,...rest}){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current,L=typeof window!=='undefined'?window.lucide:null;
    if(!el||!L)return;
    const node=L.icons&&L.icons[pascal(name)];
    el.innerHTML='';
    if(!node)return;
    try{
      const svg=L.createElement(node);
      svg.setAttribute('width',size);svg.setAttribute('height',size);
      svg.setAttribute('stroke-width',strokeWidth);svg.setAttribute('stroke','currentColor');
      el.appendChild(svg);
    }catch(e){}
  },[name,size,strokeWidth]);
  return <span ref={ref} aria-hidden="true" style={{display:'inline-flex',width:size,height:size,flex:'0 0 auto',color,...style}} {...rest}/>;
}
