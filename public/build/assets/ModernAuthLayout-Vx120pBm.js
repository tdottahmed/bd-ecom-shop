import{r as i,j as e,b as f}from"./app-Btb3J5Uj.js";import{E as h}from"./eye-off-DCA3WBbH.js";import{E as p}from"./eye-r5_W8siz.js";import{L as b}from"./loader-circle-BAriClKE.js";import{C as g,L as j}from"./CustomerLayout-BPm7VIWo.js";const A=i.forwardRef(function({type:t="text",className:a="",isFocused:s=!1,error:l,...c},m){const r=i.useRef(null),[n,x]=i.useState(!1);i.useImperativeHandle(m,()=>({focus:()=>r.current?.focus()})),i.useEffect(()=>{s&&r.current?.focus()},[s]);const u=t==="password",d=u?n?"text":"password":t;return e.jsxs("div",{className:"w-full relative",children:[e.jsxs("div",{className:"relative flex items-center",children:[e.jsx("input",{...c,type:d,className:`
                        w-full rounded-2xl bg-[#F4F6F8] border-none px-5 py-4 
                        text-gray-900 placeholder-gray-400 font-medium text-sm
                        focus:ring-2 focus:ring-[#2DE3A7]/50 focus:bg-white transition-all
                        ${u?"pr-12":""}
                        ${l?"ring-2 ring-red-500/50 bg-red-50":""}
                        ${a}
                    `,ref:r}),u&&e.jsx("button",{type:"button",onClick:()=>x(!n),className:"absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none",children:n?e.jsx(h,{className:"w-5 h-5"}):e.jsx(p,{className:"w-5 h-5"})})]}),l&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:l})]})});function k({className:o="",disabled:t,processing:a,children:s,...l}){return e.jsx("button",{...l,disabled:t||a,className:`
                w-full inline-flex justify-center items-center px-6 py-4 
                bg-[#0C1311] text-white font-semibold text-base rounded-[1.25rem]
                hover:bg-[#1E2826] focus:bg-[#1E2826] focus:outline-none 
                focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 
                transition-all duration-300 ease-in-out shadow-sm
                disabled:opacity-75 disabled:cursor-not-allowed
                ${o}
            `,children:a?e.jsxs(e.Fragment,{children:[e.jsx(b,{className:"animate-spin -ml-1 mr-2 h-5 w-5 text-current"}),s]}):s})}function C({title:o,subtitle:t,children:a,quote:s,quoteAuthor:l}){const{seo:c,siteDescription:m,authPageImage:r}=f().props,n=s||m||"Empowering your business with seamless and efficient management tools.";return e.jsx(g,{children:e.jsx("div",{className:"flex min-h-screen bg-white p-4 sm:p-6 lg:p-8",children:e.jsxs("div",{className:"flex w-full max-w-[1400px] mx-auto overflow-hidden",children:[e.jsxs("div",{className:"hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-[#0C1311] overflow-hidden flex-col justify-between p-12 rounded-[2.5rem] shadow-lg",children:[e.jsxs("div",{className:"absolute inset-0 z-0 overflow-hidden",children:[r?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:`/storage/${r}`,alt:"Authentication Background",className:"absolute inset-0 w-full h-full object-cover scale-105",style:{animation:"authImgDrift 20s ease-in-out infinite alternate"}}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-tr from-[#0C1311]/95 via-[#0C1311]/50 to-transparent"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-[#0C1311] via-transparent to-transparent"}),e.jsx("div",{className:"absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#2DE3A7]/10 blur-3xl",style:{animation:"authPulse 6s ease-in-out infinite"}})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute inset-0 bg-[#0C1311]"}),e.jsx("div",{className:"absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#2DE3A7]/15 blur-3xl",style:{animation:"authOrb1 12s ease-in-out infinite alternate"}}),e.jsx("div",{className:"absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#2DE3A7]/10 blur-3xl",style:{animation:"authOrb2 15s ease-in-out infinite alternate"}}),e.jsx("div",{className:"absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-[#2DE3A7]/8 blur-3xl",style:{animation:"authOrb3 10s ease-in-out infinite alternate"}}),e.jsx("div",{className:"absolute inset-0 opacity-[0.06]",style:{backgroundImage:"radial-gradient(circle, #ffffff 1px, transparent 1px)",backgroundSize:"28px 28px"}}),e.jsx("div",{className:"absolute inset-0 opacity-[0.04]",style:{backgroundImage:"linear-gradient(135deg, #2DE3A7 25%, transparent 25%, transparent 75%, #2DE3A7 75%)",backgroundSize:"80px 80px"}})]}),e.jsx("div",{className:"absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0C1311]/60 to-transparent"})]}),e.jsx("style",{children:`
                        @keyframes authImgDrift {
                            from { transform: scale(1.05) translate(0, 0); }
                            to   { transform: scale(1.05) translate(-1.5%, -1%); }
                        }
                        @keyframes authPulse {
                            0%, 100% { opacity: 0.6; transform: scale(1); }
                            50%       { opacity: 1;   transform: scale(1.15); }
                        }
                        @keyframes authOrb1 {
                            from { transform: translate(0, 0) scale(1); }
                            to   { transform: translate(40px, 60px) scale(1.2); }
                        }
                        @keyframes authOrb2 {
                            from { transform: translate(0, 0) scale(1); }
                            to   { transform: translate(-50px, -40px) scale(1.15); }
                        }
                        @keyframes authOrb3 {
                            from { transform: translate(0, 0) scale(1); }
                            to   { transform: translate(30px, -50px) scale(1.1); }
                        }
                    `}),e.jsx("div",{className:"relative z-10 flex",children:e.jsx("div",{className:"text-white font-bold text-2xl drop-shadow-md",children:c?.siteName||"True Buy Malaysia"})}),e.jsx("div",{className:"relative z-10 max-w-lg mb-8",children:e.jsx("blockquote",{className:"text-3xl xl:text-4xl font-bold text-white leading-[1.2] mb-6 drop-shadow-lg",children:n})})]}),e.jsx("div",{className:"w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center items-center py-8 px-4 sm:px-12 lg:px-20 xl:px-32",children:e.jsxs("div",{className:"w-full max-w-[420px]",children:[e.jsx("div",{className:"flex justify-center mb-10",children:e.jsx(j,{})}),e.jsxs("div",{className:"mb-10 text-center",children:[e.jsx("h1",{className:"text-3xl sm:text-4xl font-extrabold text-[#0C1311] tracking-tight mb-3",children:o}),t&&e.jsx("p",{className:"text-gray-500 text-[15px] font-medium leading-relaxed",children:t})]}),e.jsx("div",{className:"bg-white",children:a})]})})]})})})}export{A,C as M,k as a};
