import{c as y}from"./createLucideIcon-BqrRab70.js";import{r as e,j as t}from"./app-Btb3J5Uj.js";import{S as k}from"./search-Bb43WGUr.js";import{X as j}from"./x-DmCpJgE2.js";const g=[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]],z=y("list",g),C=({value:o="",onChange:a,onSubmit:c,placeholder:d="Search...",className:p="",inputClassName:h="",autoFocus:i=!1,disabled:f=!1})=>{const[r,l]=e.useState(o),s=e.useRef(null);e.useEffect(()=>{l(o)},[o]),e.useEffect(()=>{i&&s.current&&s.current.focus()},[i]);const m=e.useCallback(()=>{l(""),a?.(""),s.current?.focus()},[a]),b=e.useCallback(n=>{const u=n.target.value;l(u),a?.(u)},[a]),x=e.useCallback(n=>{n.preventDefault(),c?.(r.trim())},[r,c]);return t.jsx("div",{className:`relative ${p}`,children:t.jsxs("form",{onSubmit:x,children:[t.jsx(k,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",size:18,"aria-hidden":"true"}),t.jsx("input",{ref:s,type:"text",value:r,onChange:b,placeholder:d,disabled:f,className:`
                        w-full bg-[#0F1A18] border border-[#1E2826] 
                        text-white placeholder-gray-500
                        pl-10 pr-8 py-2.5
                        rounded-lg
                        focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${h}
                    `,"aria-label":"Search input"}),r&&t.jsx("button",{type:"button",onClick:m,className:"absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors rounded","aria-label":"Clear search input",children:t.jsx(j,{size:14})})]})})};export{z as L,C as S};
