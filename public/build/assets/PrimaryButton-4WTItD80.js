import{j as t,L as p}from"./app-Btb3J5Uj.js";const h=({as:o="button",type:c="submit",variant:l="solid",size:f="md",disabled:s=!1,loading:e=!1,children:u,className:d="",fullWidth:b=!1,...r})=>{const x={sm:"px-3 py-2 text-xs sm:px-3 sm:py-2",md:"px-4 py-3 text-sm sm:px-4 sm:py-3",lg:"px-4 py-3 text-base sm:px-6 sm:py-4"},m={solid:`
            bg-[#2DE3A7] border border-transparent 
            text-[#0C1311] 
            hover:bg-[#22c996] 
            focus:bg-[#22c996] focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#1cb583] active:scale-95
            disabled:bg-[#2DE3A7]/50 disabled:text-[#0C1311]/70 disabled:cursor-not-allowed disabled:scale-100
            transition-all duration-200 ease-in-out
        `,outline:`
            bg-transparent border border-[#2DE3A7] 
            text-[#2DE3A7] 
            hover:bg-[#2DE3A7] hover:text-[#0C1311] 
            focus:bg-[#2DE3A7] focus:text-[#0C1311] focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#22c996] active:text-[#0C1311] active:scale-95
            disabled:border-[#2DE3A7]/50 disabled:text-[#2DE3A7]/50 disabled:cursor-not-allowed disabled:scale-100
            transition-all duration-200 ease-in-out
        `,ghost:`
            bg-transparent border border-transparent 
            text-[#2DE3A7] 
            hover:bg-[#2DE3A7]/10 
            focus:bg-[#2DE3A7]/10 focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#2DE3A7]/20 active:scale-95
            disabled:text-[#2DE3A7]/50 disabled:cursor-not-allowed disabled:scale-100
            transition-all duration-200 ease-in-out
        `},n=`
        inline-flex items-center justify-center gap-2
        rounded-lg font-semibold 
        uppercase tracking-widest 
        focus:outline-none
        ${x[f]}
        ${m[l]}
        ${b?"w-full":""}
        ${s||e?"opacity-50 cursor-not-allowed":"cursor-pointer"}
        ${d}
        
        /* Mobile-specific improvements */
        min-h-[44px] /* Minimum touch target size for mobile */
        text-center
        break-words /* Handle long text on mobile */
        whitespace-nowrap /* Prevent text wrapping on mobile */
    `,a=t.jsx(t.Fragment,{children:e?t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"}),t.jsx("span",{className:"text-inherit",children:"Loading..."})]}):u});return o==="link"?t.jsx(p,{href:r.href,className:n,onClick:i=>{(s||e)&&i.preventDefault()},"aria-disabled":s||e,children:a}):o==="a"?t.jsx("a",{href:r.href,className:n,onClick:i=>{if(s||e){i.preventDefault();return}r.onClick?.()},"aria-disabled":s||e,children:a}):t.jsx("button",{type:c,disabled:s||e,className:n,onClick:r.onClick,"aria-busy":e,children:a})};export{h as P};
