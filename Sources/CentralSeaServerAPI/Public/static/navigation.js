(()=>{"use strict";var t;!function(t){t.Home="",t.Maps="maps",t.Market="market",t.Info="info"}(t||(t={}));class e{static mode="";static get baseURL(){return`${this.mode}`}static URLFor(t){return""!=this.mode&&""!=`${t}`?`/${t}.html`:`/CentralSeaServer/${t}`}}const n=document.getElementById("home");function o(){window.location.href=e.URLFor(t.Home)}n.addEventListener("click",o),n.addEventListener("touchstart",o);const c=document.getElementById("maps");function r(){window.location.href=e.URLFor(t.Maps)}c.addEventListener("click",r),c.addEventListener("touchstart",r);const i=document.getElementById("market");function a(){window.location.href=e.URLFor(t.Market)}i.addEventListener("click",a),i.addEventListener("touchstart",a);const d=document.getElementById("info");function s(){window.location.href=e.URLFor(t.Info)}d.addEventListener("click",s),d.addEventListener("touchstart",s)})();