import{r as d,R as a,j as m}from"./app-Btb3J5Uj.js";const g=d.forwardRef(({id:o,name:s,value:f,className:l="",autoComplete:n,placeholder:u,isFocused:r=!1,required:c=!1,rows:i=4,disabled:t=!1,onChange:p},x)=>{const e=a.useRef(null);return a.useEffect(()=>{r&&e.current&&e.current.focus()},[r]),m.jsx("textarea",{id:o,ref:x||e,name:s,value:f,placeholder:u,required:c,rows:i,className:`
                    w-full px-4 py-3 
                    bg-[#0F1A18] border border-[#1E2826] 
                    rounded-lg 
                    text-gray-100 placeholder-gray-500
                    focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                    transition-all duration-200 ease-in-out
                    ${t?"opacity-50 cursor-not-allowed":"cursor-pointer"}
                    resize-vertical
                    min-h-[100px]
                    ${l}
                `,autoComplete:n??"off",onChange:p,disabled:t})});g.displayName="TextArea";export{g as T};
