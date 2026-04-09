import{r as t,j as i,H as n}from"./app-Btb3J5Uj.js";import s from"./Invoice-DBR-vxDf.js";import"./helpers-i040BXjZ.js";import"./format-w_1USgEm.js";import"./en-US-C8ut0f5H.js";function g({orders:r}){return t.useEffect(()=>{window.print()},[]),i.jsxs("div",{className:"bg-gray-100 min-h-screen print:bg-white",children:[i.jsx(n,{title:"Print Invoices"}),i.jsxs("style",{children:[`
                @media print {
                    @page { margin: 0; }
                    body { margin: 0; }
                    .page-break { page-break-after: always; }
                    .print-container { padding: 0; margin: 0; }
                }
            `," "]}),r.map((a,e)=>i.jsx("div",{className:`print-container ${e<r.length-1?"page-break mb-8 print:mb-0":""}`,children:i.jsx(s,{order:a})},a.id))]})}export{g as default};
