import{r as d,R as o,j as g}from"./app-Btb3J5Uj.js";const b=d.forwardRef(({id:a,type:s="text",name:n,value:u,className:f="",autoComplete:c,placeholder:l,isFocused:e=!1,required:p=!1,step:i,disabled:t=!1,min:E,max:R,onChange:x},m)=>{const r=o.useRef(null);return o.useEffect(()=>{e&&r.current&&r.current.focus()},[e]),g.jsx("input",{id:a,ref:m||r,type:s,name:n,value:u,placeholder:l,required:p,className:`
                    w-full px-4 py-3 
                    bg-[#0F1A18] border border-[#1E2826] 
                    rounded-lg 
                    text-gray-100 placeholder-gray-500
                    focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                    transition-all duration-200 ease-in-out
                    ${t?"opacity-50 cursor-not-allowed":"cursor-pointer"}
                    ${f}
                `,autoComplete:c??"off",onChange:x,step:i,disabled:t})});export{b as T};
