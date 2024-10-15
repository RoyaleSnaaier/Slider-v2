(()=>{"use strict";var e;e=function(e,t){if(void 0===t&&(t={}),!e.dataset.initSlider){e.dataset.initSlider="1";var n=e.querySelector('img[data-image="1"]'),a=e.querySelector('img[data-image="2"]'),i=e.querySelector(".acbaslider__labels"),o=Object.assign({step:parseInt(e.dataset.step)||5,startPosition:parseInt(e.dataset.startingposition)||50,mouseFollow:"true"===e.dataset.mousefollow,clickPosition:"true"===e.dataset.clickposition,autoSlide:"true"===e.dataset.autoslide,slideSpeed:parseInt(e.dataset.slidespeed)||3e3},t);if(i&&(i.style.display="none"),n&&a){var s=function(){if(n.naturalWidth&&n.naturalHeight){var t=n.naturalHeight/n.naturalWidth,a=e.clientWidth||n.naturalWidth,i=a*t;e.style.height="".concat(i,"px"),console.log("Responsive size set: ".concat(a,"px width, ").concat(i,"px height"))}else console.log("Images are not fully loaded yet.")};s(),window.addEventListener("resize",s),e.style.borderRadius="15px",e.style.boxShadow="0px 8px 20px rgba(0, 0, 0, 0.2)",a.style.clipPath="inset(0 ".concat(100-o.startPosition,"% 0 0)"),a.style.transition="clip-path 0.3s ease";var d=document.createElement("div");d.className="acbaslider__divider";var l=document.createElement("div");l.className="acbaslider__divider__handle",d.appendChild(l),e.appendChild(d),d.style.left="".concat(o.startPosition,"%");var r,c=!1,u=function(e,t){void 0===t&&(t=!1),t?(d.style.transition="left 0.3s ease",a.style.transition="clip-path 0.3s ease"):(d.style.transition="none",a.style.transition="none"),d.style.left="".concat(e,"%"),a.style.clipPath="inset(0 ".concat(100-e,"% 0 0)")},m=function(t){if(c||o.mouseFollow){var n=e.getBoundingClientRect(),a=t.clientX-n.left,i=(a=Math.max(0,Math.min(a,n.width)))/n.width*100;u(i,!0)}},v=function(){c=!1,d.style.transition="none",a.style.transition="none"};d.addEventListener("mousedown",(function(){c=!0,d.style.transition="none",a.style.transition="none"})),e.addEventListener("mousemove",m),document.addEventListener("mouseup",v),o.clickPosition&&e.addEventListener("click",(function(t){var n=e.getBoundingClientRect(),a=(t.clientX-n.left)/n.width*100;u(a,!0)}));var p=function(){var e=o.startPosition,t=1;r=setInterval((function(){(e+=o.step*t)>=100?t=-1:e<=0&&(t=1),e=Math.max(0,Math.min(e,100)),u(e,!0)}),o.slideSpeed)},h=function(){clearInterval(r)},f=function(){o.autoSlide&&p()};o.autoSlide&&(p(),e.addEventListener("mouseenter",h),e.addEventListener("mouseleave",f),e.addEventListener("mousedown",h),e.addEventListener("mouseup",f),e.addEventListener("touchstart",h),e.addEventListener("touchend",f)),d.addEventListener("touchstart",(function(){c=!0,d.style.transition="none",a.style.transition="none"})),document.addEventListener("touchmove",(function(e){var t=e.touches[0];m(t)})),document.addEventListener("touchend",v),d.tabIndex=0,d.addEventListener("keydown",(function(e){var t=parseFloat(d.style.left)||o.startPosition,n=o.step;"ArrowLeft"===e.key&&t>0&&(t=Math.max(0,t-n)),"ArrowRight"===e.key&&t<100&&(t=Math.min(100,t+n)),u(t,!0)})),n.complete&&a.complete?s():n.onload=a.onload=s,new ResizeObserver(s).observe(e)}}},document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll('[data-component="beforeafterslider"]').forEach((function(t){var n=t.querySelector('img[data-image="1"]'),a=t.querySelector('img[data-image="2"]'),i={};["step","startingPosition","mouseFollow","clickPosition","autoSlide","slideSpeed"].forEach((function(e){t.dataset[e]&&(i[e]=t.dataset[e])})),n.complete&&a.complete?e(t,i):n.onload=a.onload=function(){return e(t,i)}}))}))})();