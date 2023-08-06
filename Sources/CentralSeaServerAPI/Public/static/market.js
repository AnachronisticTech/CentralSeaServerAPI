(()=>{"use strict";var t={66:(t,e)=>{function n(t,e){for(var n=t.length;n--;)t[n].removeEventListener("load",e),t[n].removeEventListener("error",e)}var i="[@fristys/masonry]",s={containerDoesNotExist:i+" Masonry container element not found or provided.",resizeObserverNotSupported:i+" Looks like ResizeObserver was not detected in this browser. If you want to support it, add a polyfill: https://github.com/juggle/resize-observer"},o=function(){function t(t,e){if(this.masonryContainer=t,this.columns=4,this.gutter=10,this.gutterUnit="px",this.loadingClass="masonry-loading",this.initOnImageLoad=!1,this.loadedClass="masonry-loaded",this.bindOnScroll=!0,this.useContainerWidth=!1,this.trackItemSizeChanges=!1,this.initDebounced=function(t,e){void 0===e&&(e=25);var n=0;return function(){for(var i=[],s=0;s<arguments.length;s++)i[s]=arguments[s];clearTimeout(n),n=setTimeout((function(){return t.apply(void 0,i)}),e)}}(this.init.bind(this)),!this.masonryContainer)throw new Error(s.containerDoesNotExist);this.setOptions(e),this.initOnImageLoad?this.initOnAllImagesLoaded():this.init(),this.bindEvents()}return t.prototype.init=function(){this.resetAllPositions(),this.setItemPositions(),this.masonryContainer.classList.remove(this.loadingClass),this.masonryContainer.classList.add(this.loadedClass)},t.prototype.dispose=function(){this.bindOnScroll&&window.removeEventListener("resize",this.initDebounced.bind(this)),this.trackItemSizeChanges&&this.unbindItemSizeTracking()},t.prototype.setOptions=function(t){this.setOptionIfExists(t,"columns"),this.setOptionIfExists(t,"columnBreakpoints"),this.setOptionIfExists(t,"gutter"),this.setOptionIfExists(t,"gutterUnit"),this.setOptionIfExists(t,"loadingClass"),this.setOptionIfExists(t,"initOnImageLoad"),this.setOptionIfExists(t,"loadedClass"),this.setOptionIfExists(t,"onInit"),this.setOptionIfExists(t,"bindOnScroll"),this.setOptionIfExists(t,"useContainerWidth"),this.setOptionIfExists(t,"trackItemSizeChanges")},t.prototype.setOptionIfExists=function(t,e){t&&t.hasOwnProperty(e)&&(this[e]=t[e])},t.prototype.bindEvents=function(){this.bindOnScroll&&window.addEventListener("resize",this.initDebounced.bind(this)),this.trackItemSizeChanges&&this.bindItemSizeTracking()},t.prototype.initOnAllImagesLoaded=function(){var t=this;this.masonryContainer.classList.remove(this.loadedClass),this.masonryContainer.classList.add(this.loadingClass),function(t,e){var i=t.getElementsByTagName("img"),s=i.length;if(s){for(var o=0,r=function(){++o===s&&(n(i,r),e())},a=s;a--;){var l=i[a];!l.getAttribute("src")||l.complete?o++:(l.addEventListener("load",r),l.addEventListener("error",r))}o===s&&(n(i,r),e())}else e()}(this.masonryContainer,(function(){t.init(),t.masonryContainer.classList.remove(t.loadingClass),t.masonryContainer.classList.add(t.loadedClass)}))},t.prototype.setItemPositions=function(){var t=this.getColumnsForViewportSize(),e="calc("+100/t+"% - "+this.gutter+this.gutterUnit+")";this.masonryContainer.style.position="relative";for(var n=this.masonryContainer.children,i=[],s=n.length,o=0;o<s;){var r=o+t;i.push([].slice.call(n,o,r)),o=r}for(var a=i.length,l=0,d=0;l<a;){for(var c=i[l],u=c.length,h=0;h<u;){var p,m,f=c[h];f.style.position="absolute",f.style.width=e,0===l?f.style.top=0:(m=i[l-1][h])&&(p=parseInt(getComputedStyle(m).top,10),f.style.top="calc("+(p+m.offsetHeight)+"px + "+this.gutter+this.gutterUnit+")"),0===h?f.style.left=0:(m=c[h-1],f.style.left="calc("+parseInt(getComputedStyle(m).width,10)*h+"px + "+this.gutter*h+this.gutterUnit),d<(f=f.getBoundingClientRect().top+f.offsetHeight)&&(d=f),h++}l++}0<=this.masonryContainer.getBoundingClientRect().top&&(this.masonryContainer.style.height="calc("+(d-this.masonryContainer.getBoundingClientRect().top)+"px + "+this.gutter+this.gutterUnit+")"),this.onInit&&this.onInit()},t.prototype.resetAllPositions=function(){this.masonryContainer.style.position="",this.masonryContainer.style.height="";for(var t=this.masonryContainer.children,e=t.length;e--;){var n=t[e];n.style.top="",n.style.left="",n.style.width="",n.style.position=""}},t.prototype.getColumnsForViewportSize=function(){if(!this.columnBreakpoints)return this.columns;for(var t=this.useContainerWidth?this.masonryContainer.offsetWidth:window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,e=Object.keys(this.columnBreakpoints).sort((function(t,e){return t-e})),n=e.length,i=0;i<n;){var s=parseInt(e[i],10),o=this.columnBreakpoints[e[i]];if(t<s)return o;i++}return this.columns},t.prototype.bindItemSizeTracking=function(){if("ResizeObserver"in window){this.sizeObservers||(this.sizeObservers=[]);for(var t=this.masonryContainer.children,e=t.length;e--;){var n=t[e],i=new ResizeObserver(this.initDebounced.bind(this));i.observe(t[e]),this.sizeObservers.push({observer:i,target:n})}}else console.warn(s.resizeObserverNotSupported)},t.prototype.unbindItemSizeTracking=function(){if("ResizeObserver"in window)for(var t=this.sizeObservers.length;t--;){var e=(n=this.sizeObservers[t]).observer,n=n.target;e.unobserve(n)}else console.warn(s.resizeObserverNotSupported)},t}();e.R=o}},e={};function n(i){var s=e[i];if(void 0!==s)return s.exports;var o=e[i]={exports:{}};return t[i](o,o.exports,n),o.exports}(()=>{var t=n(66);const e={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let i;const s=new Uint8Array(16);function o(){if(!i&&(i="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!i))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return i(s)}const r=[];for(let t=0;t<256;++t)r.push((t+256).toString(16).slice(1));const a=function(t,n,i){if(e.randomUUID&&!n&&!t)return e.randomUUID();const s=(t=t||{}).random||(t.rng||o)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,n){i=i||0;for(let t=0;t<16;++t)n[i+t]=s[t];return n}return function(t,e=0){return(r[t[e+0]]+r[t[e+1]]+r[t[e+2]]+r[t[e+3]]+"-"+r[t[e+4]]+r[t[e+5]]+"-"+r[t[e+6]]+r[t[e+7]]+"-"+r[t[e+8]]+r[t[e+9]]+"-"+r[t[e+10]]+r[t[e+11]]+r[t[e+12]]+r[t[e+13]]+r[t[e+14]]+r[t[e+15]]).toLowerCase()}(s)};var l;!function(t){t.Home="",t.Maps="maps",t.Market="market",t.Info="info"}(l||(l={}));class d{static mode="";static get baseURL(){return`${this.mode}`}static URLFor(t){return""!=this.mode&&""!=`${t}`?`/${t}.html`:`/CentralSeaServer/${t}`}}class c{id;isLimitedTime;name;trades;uuid;constructor(t,e,n,i,s=a()){this.uuid=s,this.id=t,this.isLimitedTime=e,this.name=n,this.trades=i.map((t=>u.init(t)))}static init(t){return new c(t.id,t.isLimitedTime,t.name,t.trades,t.uuid)}}class u{buy;buyB;sell;uuid;constructor(t,e,n,i=a()){this.uuid=i,this.buy=new h(t.id,t.count,t.tag),this.sell=new h(n.id,n.count,n.tag),this.buyB=null!=e?new h(e.id,e.count,e.tag):null}static init(t){return new u(t.buy,t.buyB,t.sell,t.uuid)}}class h{id;count;tag;constructor(t,e=1,n=null){this.id=t,this.count=e,this.tag=n}get name(){return this.tag?.display?.name.text??this.tag?.potion?.replace("minecraft:","").replaceAll("_"," ").replace(/^/,"Potion of ")??this.id.replace("minecraft:","").replaceAll("_"," ")}get nameColor(){return this.tag?.display?.name.color?.replace("_","-")??null}get enchantments(){return this.tag?.enchantments??[]}get customModelData(){return void 0!==this.tag&&null!==this.tag&&void 0!==this.tag.customModelData&&null!==this.tag.customModelData?this.tag.customModelData:null}}let p=new Map,m=[],f=new Map,g=new Map;const y=document.getElementById("trade-container"),C=new t.R(y,{columns:4,columnBreakpoints:{1835:3,1545:2,655:1}}),v=document.getElementById("search");v.addEventListener("input",w);const b=document.getElementById("invisible-container");function I(t){const e=document.createElement("div");e.id=t.uuid;const n=document.createElement("h1");n.innerHTML=t.name,e.appendChild(n);for(const n of t.trades)g.set(n.uuid,e.appendChild(L(n)));return e}function L(t){const e=document.createElement("div");e.id=t.uuid,e.classList.add("minecraft-row"),e.appendChild(E(t.buy)),null!=t.buyB&&e.appendChild(E(t.buyB));const n=document.createElement("img");return n.className="trade-arrow",e.appendChild(n),e.appendChild(E(t.sell)),e}function E(t){const e=document.createElement("div");if(e.classList.add("trade-item"),null!=t.customModelData){const n=document.createElement("img");n.src=`${d.baseURL}/css-api/shopping/customItems/${t.id.replace("minecraft:","")}/${t.customModelData}`,e.appendChild(n)}else{const n=document.createElement("img"),i=t.id.replace("minecraft:",""),s=p.get(i);n.src="potion"==i?"https://minecraft-api.vercel.app/images/items/potion_of_fire_resistance.gif":null!=s?s:"https://minecraft-api.vercel.app/images/items/barrier.png",e.appendChild(n)}if(t.count>1){const n=document.createElement("p");n.innerText=t.count.toString(),e.appendChild(n)}return e.appendChild(function(t){const e=document.createElement("div");e.classList.add("tooltip");const n=document.createElement("div");e.appendChild(n);const i=document.createElement("p");i.innerText=t.name,null!=t.nameColor&&i.classList.add(`chat-${t.nameColor}`),n.appendChild(i);for(const e of t.enchantments){if(0==e.level)continue;const t=document.createElement("p");t.classList.add("tooltip-enchantment"),t.innerText=`${e.id.replace("minecraft:","").replaceAll("_"," ")} ${O(e.level)}`,n.appendChild(t)}const s=document.createElement("p");return s.classList.add("tooltip-item-id"),s.innerText=t.id,n.appendChild(s),e}(t)),e}function w(){g.forEach(((t,e,n)=>t.classList.add("hidden"))),f.forEach(((t,e,n)=>{b.appendChild(t),t.classList.add("hidden")}));for(const t of function(t){return""==t?m:(t=t.toLowerCase(),m.map(c.init).filter((e=>{let n=e;return n.name.toLowerCase().includes(t)?n:(n.trades=n.trades.filter((e=>e.buy.name.toLowerCase().includes(t)||e.buyB?.name.toLowerCase().includes(t)||e.sell.name.toLowerCase().includes(t)||e.buy.id.includes(t)||e.buyB?.id.includes(t)||e.sell.id.includes(t)||e.buy.enchantments.some((e=>e.id.includes(t)))||e.buyB?.enchantments.some((e=>e.id.includes(t)))||e.sell.enchantments.some((e=>e.id.includes(t))))),n.trades.length>0?n:null)})))}(v.value)){const e=f.get(t.uuid);if(null!=e){e.classList.remove("hidden"),y.appendChild(e);for(const e of t.trades)g.get(e.uuid)?.classList.remove("hidden")}}C.init()}function O(t){if(isNaN(t))return"NaN";let e=String(+t).split("");const n=["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"];let i="",s=3;for(;s--;)i=(n[Number(e.pop())+10*s]||"")+i;return Array(+e.join("")+1).join("M")+i}document.getElementById("clear-search").addEventListener("click",(t=>{v.value="",w()})),function(){const t=new XMLHttpRequest;t.open("GET","https://minecraft-api.vercel.app/api/items",!0),t.onload=function(){for(const t of JSON.parse(this.responseText))p.set(t.namespacedId,t.image);!function(){const t=new XMLHttpRequest;t.open("GET",`${d.baseURL}/css-api/shopping`,!0),t.onload=function(){m=[],y.innerHTML="";for(const t of JSON.parse(this.responseText)){if("Black Market"==t.name)continue;const e=c.init(t);m.push(e),f.set(e.uuid,y.appendChild(I(e)))}w()},t.send()}()},t.send()}()})()})();