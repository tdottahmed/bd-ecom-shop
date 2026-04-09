import{r as l,j as e}from"./app-Btb3J5Uj.js";import{X as m}from"./x-DmCpJgE2.js";const f=({show:t,onClose:s,children:n,maxWidth:a="2xl",closeable:o=!0})=>{const i=l.useRef(null),d={sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg",xl:"max-w-xl","2xl":"max-w-2xl"};return l.useEffect(()=>{const r=c=>{c.key==="Escape"&&t&&s()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[t,s]),l.useEffect(()=>(t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[t]),t?e.jsxs("div",{className:"fixed inset-0 z-50 overflow-y-auto",children:[e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 transition-opacity",onClick:o?s:void 0}),e.jsx("div",{className:"flex min-h-full items-center justify-center p-4",children:e.jsxs("div",{ref:i,className:`
                        relative w-full ${d[a]} 
                        transform overflow-hidden rounded-xl bg-[#0E1614] 
                        border border-[#1E2826] shadow-2xl 
                        transition-all
                    `,onClick:r=>r.stopPropagation(),children:[o&&e.jsx("button",{onClick:s,className:`absolute top-4 right-4 z-10 
                                       p-2 text-gray-400 hover:text-white 
                                       transition-colors rounded-lg 
                                       hover:bg-[#1E2826]`,"aria-label":"Close modal",children:e.jsx(m,{size:20})}),e.jsx("div",{className:"relative",children:n})]})})]}):null};export{f as M};
