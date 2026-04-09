import{j as d}from"./app-Btb3J5Uj.js";const u=({type:e="button",className:t="",disabled:s=!1,children:o,onClick:r,size:n="md",variant:i="solid"})=>{const a={sm:"px-3 py-2 text-xs",md:"px-4 py-3 text-sm",lg:"px-6 py-4 text-base"},f={solid:`
            bg-[#DC2626] border border-transparent 
            text-white 
            hover:bg-[#B91C1C] 
            focus:bg-[#B91C1C] focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#991B1B]
            disabled:bg-[#FCA5A5] disabled:cursor-not-allowed
        `,outline:`
            bg-transparent border border-[#DC2626] 
            text-[#DC2626] 
            hover:bg-[#DC2626] hover:text-white 
            focus:bg-[#DC2626] focus:text-white focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#B91C1C] active:text-white
            disabled:border-[#FCA5A5] disabled:text-[#FCA5A5] disabled:cursor-not-allowed
        `,ghost:`
            bg-transparent border border-transparent 
            text-[#DC2626] 
            hover:bg-[#DC2626]/10 
            focus:bg-[#DC2626]/10 focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#DC2626]/20
            disabled:text-[#FCA5A5] disabled:cursor-not-allowed
        `};return d.jsx("button",{type:e,onClick:r,disabled:s,className:`
                inline-flex items-center justify-center
                rounded-lg font-semibold 
                uppercase tracking-widest 
                transition-all duration-200 ease-in-out
                focus:outline-none
                ${a[n]}
                ${f[i]}
                ${t}
            `,children:o})};export{u as D};
