(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerPolicy&&(t.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?t.credentials="include":o.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(o){if(o.ep)return;o.ep=!0;const t=r(o);fetch(o.href,t)}})();class p extends HTMLElement{constructor(){super()}connectedCallback(){try{const e=this.attachShadow({mode:"open"}),r=document.querySelector("template");if(!r)throw new Error("Template not found");const c=document.createElement("link");c.setAttribute("rel","stylesheet"),c.setAttribute("href","./shadowstyle.css"),e.appendChild(c),e.appendChild(r.content.cloneNode(!0))}catch(e){console.error(e.message)}}}customElements.define("vim-component",p);const h=async n=>{try{const e=await fetch(n);if(!e.ok)throw new Error(e.statusText);const r=await e.json();if(!r)throw new Error("No data");return r}catch(e){return console.error(e.message),e}},y=(n,e)=>Object.values(n).find(o=>typeof o=="object"&&o!==null&&"htmlId"in o?o.htmlId===(e==null?void 0:e.id):!1),w=(n,e)=>{e.textContent=(n==null?void 0:n.title)??""},C=(n,e)=>{const r=["<kbd>","</kbd>"],c=t=>t==null?void 0:t.replace(/</g,"&lt;"),{commands:o}=n;for(const{keyword:t,additional_keyword2:s,additional_keyword3:i,description:a}of o){const u=[t,s,i].map(c).filter(d=>d!==void 0).map((d,f)=>`${f===0?"":" or "}${r[0]}${d}${r[1]}`).join(""),m=document.createElement("li");m.innerHTML=`${u} - ${a}`,e.appendChild(m)}},g=(n,e)=>{e.innerHTML=(n==null?void 0:n.tip)??"",e.innerHTML||(e.style.display="none")},E=async()=>{const n=await h("./data/en_us.json");if(n instanceof Error){const t=document.createElement("p");t.textContent=n.message,document.body.appendChild(t);return}const r=Array.from(document.querySelectorAll("vim-component")).map(t=>y(n,t));for(const t of r){const s=document.querySelector(`#${t.htmlId}`)??document.createElement("vim-component"),i=s.querySelector("[name='heading']")??document.createElement("h2");w(t,i);const a=s.querySelector("[name='list']")??document.createElement("ul");C(t,a);const l=s.querySelector("[name='tip']")??document.createElement("div");g(t,l)}const c=document.querySelector("footer")??document.createElement("footer"),o=document.createElement("a");o.setAttribute("href","https://github.com/sazk07/vim-cheatsheet-web-components"),o.textContent="GitHub",c.textContent=`${n.footer} `,c.appendChild(o)};E();
