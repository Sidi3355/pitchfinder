(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function sv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var tm={exports:{}},wl={},nm={exports:{}},Oe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ba=Symbol.for("react.element"),av=Symbol.for("react.portal"),ov=Symbol.for("react.fragment"),lv=Symbol.for("react.strict_mode"),uv=Symbol.for("react.profiler"),cv=Symbol.for("react.provider"),dv=Symbol.for("react.context"),fv=Symbol.for("react.forward_ref"),hv=Symbol.for("react.suspense"),pv=Symbol.for("react.memo"),mv=Symbol.for("react.lazy"),Vf=Symbol.iterator;function gv(t){return t===null||typeof t!="object"?null:(t=Vf&&t[Vf]||t["@@iterator"],typeof t=="function"?t:null)}var im={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},rm=Object.assign,sm={};function Cs(t,e,n){this.props=t,this.context=e,this.refs=sm,this.updater=n||im}Cs.prototype.isReactComponent={};Cs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Cs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function am(){}am.prototype=Cs.prototype;function Ed(t,e,n){this.props=t,this.context=e,this.refs=sm,this.updater=n||im}var wd=Ed.prototype=new am;wd.constructor=Ed;rm(wd,Cs.prototype);wd.isPureReactComponent=!0;var Gf=Array.isArray,om=Object.prototype.hasOwnProperty,Td={current:null},lm={key:!0,ref:!0,__self:!0,__source:!0};function um(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)om.call(e,i)&&!lm.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),u=0;u<o;u++)l[u]=arguments[u+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:ba,type:t,key:s,ref:a,props:r,_owner:Td.current}}function vv(t,e){return{$$typeof:ba,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Ad(t){return typeof t=="object"&&t!==null&&t.$$typeof===ba}function _v(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Wf=/\/+/g;function Kl(t,e){return typeof t=="object"&&t!==null&&t.key!=null?_v(""+t.key):e.toString(36)}function bo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case ba:case av:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Kl(a,0):i,Gf(r)?(n="",t!=null&&(n=t.replace(Wf,"$&/")+"/"),bo(r,e,n,"",function(u){return u})):r!=null&&(Ad(r)&&(r=vv(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Wf,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Gf(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Kl(s,o);a+=bo(s,e,n,l,r)}else if(l=gv(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Kl(s,o++),a+=bo(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function Va(t,e,n){if(t==null)return t;var i=[],r=0;return bo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function xv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var jt={current:null},Po={transition:null},yv={ReactCurrentDispatcher:jt,ReactCurrentBatchConfig:Po,ReactCurrentOwner:Td};function cm(){throw Error("act(...) is not supported in production builds of React.")}Oe.Children={map:Va,forEach:function(t,e,n){Va(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Va(t,function(){e++}),e},toArray:function(t){return Va(t,function(e){return e})||[]},only:function(t){if(!Ad(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Oe.Component=Cs;Oe.Fragment=ov;Oe.Profiler=uv;Oe.PureComponent=Ed;Oe.StrictMode=lv;Oe.Suspense=hv;Oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yv;Oe.act=cm;Oe.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=rm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Td.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)om.call(e,l)&&!lm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var u=0;u<l;u++)o[u]=arguments[u+2];i.children=o}return{$$typeof:ba,type:t.type,key:r,ref:s,props:i,_owner:a}};Oe.createContext=function(t){return t={$$typeof:dv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:cv,_context:t},t.Consumer=t};Oe.createElement=um;Oe.createFactory=function(t){var e=um.bind(null,t);return e.type=t,e};Oe.createRef=function(){return{current:null}};Oe.forwardRef=function(t){return{$$typeof:fv,render:t}};Oe.isValidElement=Ad;Oe.lazy=function(t){return{$$typeof:mv,_payload:{_status:-1,_result:t},_init:xv}};Oe.memo=function(t,e){return{$$typeof:pv,type:t,compare:e===void 0?null:e}};Oe.startTransition=function(t){var e=Po.transition;Po.transition={};try{t()}finally{Po.transition=e}};Oe.unstable_act=cm;Oe.useCallback=function(t,e){return jt.current.useCallback(t,e)};Oe.useContext=function(t){return jt.current.useContext(t)};Oe.useDebugValue=function(){};Oe.useDeferredValue=function(t){return jt.current.useDeferredValue(t)};Oe.useEffect=function(t,e){return jt.current.useEffect(t,e)};Oe.useId=function(){return jt.current.useId()};Oe.useImperativeHandle=function(t,e,n){return jt.current.useImperativeHandle(t,e,n)};Oe.useInsertionEffect=function(t,e){return jt.current.useInsertionEffect(t,e)};Oe.useLayoutEffect=function(t,e){return jt.current.useLayoutEffect(t,e)};Oe.useMemo=function(t,e){return jt.current.useMemo(t,e)};Oe.useReducer=function(t,e,n){return jt.current.useReducer(t,e,n)};Oe.useRef=function(t){return jt.current.useRef(t)};Oe.useState=function(t){return jt.current.useState(t)};Oe.useSyncExternalStore=function(t,e,n){return jt.current.useSyncExternalStore(t,e,n)};Oe.useTransition=function(){return jt.current.useTransition()};Oe.version="18.3.1";nm.exports=Oe;var ke=nm.exports;const Sv=sv(ke);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Mv=ke,Ev=Symbol.for("react.element"),wv=Symbol.for("react.fragment"),Tv=Object.prototype.hasOwnProperty,Av=Mv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Cv={key:!0,ref:!0,__self:!0,__source:!0};function dm(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)Tv.call(e,i)&&!Cv.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Ev,type:t,key:s,ref:a,props:r,_owner:Av.current}}wl.Fragment=wv;wl.jsx=dm;wl.jsxs=dm;tm.exports=wl;var w=tm.exports,fm={exports:{}},cn={},hm={exports:{}},pm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(D,X){var Q=D.length;D.push(X);e:for(;0<Q;){var ae=Q-1>>>1,Se=D[ae];if(0<r(Se,X))D[ae]=X,D[Q]=Se,Q=ae;else break e}}function n(D){return D.length===0?null:D[0]}function i(D){if(D.length===0)return null;var X=D[0],Q=D.pop();if(Q!==X){D[0]=Q;e:for(var ae=0,Se=D.length,Ve=Se>>>1;ae<Ve;){var V=2*(ae+1)-1,ne=D[V],fe=V+1,ce=D[fe];if(0>r(ne,Q))fe<Se&&0>r(ce,ne)?(D[ae]=ce,D[fe]=Q,ae=fe):(D[ae]=ne,D[V]=Q,ae=V);else if(fe<Se&&0>r(ce,Q))D[ae]=ce,D[fe]=Q,ae=fe;else break e}}return X}function r(D,X){var Q=D.sortIndex-X.sortIndex;return Q!==0?Q:D.id-X.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],u=[],d=1,h=null,f=3,p=!1,x=!1,_=!1,m=typeof setTimeout=="function"?setTimeout:null,c=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(D){for(var X=n(u);X!==null;){if(X.callback===null)i(u);else if(X.startTime<=D)i(u),X.sortIndex=X.expirationTime,e(l,X);else break;X=n(u)}}function y(D){if(_=!1,g(D),!x)if(n(l)!==null)x=!0,W(b);else{var X=n(u);X!==null&&K(y,X.startTime-D)}}function b(D,X){x=!1,_&&(_=!1,c(L),L=-1),p=!0;var Q=f;try{for(g(X),h=n(l);h!==null&&(!(h.expirationTime>X)||D&&!N());){var ae=h.callback;if(typeof ae=="function"){h.callback=null,f=h.priorityLevel;var Se=ae(h.expirationTime<=X);X=t.unstable_now(),typeof Se=="function"?h.callback=Se:h===n(l)&&i(l),g(X)}else i(l);h=n(l)}if(h!==null)var Ve=!0;else{var V=n(u);V!==null&&K(y,V.startTime-X),Ve=!1}return Ve}finally{h=null,f=Q,p=!1}}var C=!1,A=null,L=-1,T=5,M=-1;function N(){return!(t.unstable_now()-M<T)}function G(){if(A!==null){var D=t.unstable_now();M=D;var X=!0;try{X=A(!0,D)}finally{X?H():(C=!1,A=null)}}else C=!1}var H;if(typeof v=="function")H=function(){v(G)};else if(typeof MessageChannel<"u"){var $=new MessageChannel,Y=$.port2;$.port1.onmessage=G,H=function(){Y.postMessage(null)}}else H=function(){m(G,0)};function W(D){A=D,C||(C=!0,H())}function K(D,X){L=m(function(){D(t.unstable_now())},X)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(D){D.callback=null},t.unstable_continueExecution=function(){x||p||(x=!0,W(b))},t.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<D?Math.floor(1e3/D):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(D){switch(f){case 1:case 2:case 3:var X=3;break;default:X=f}var Q=f;f=X;try{return D()}finally{f=Q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(D,X){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var Q=f;f=D;try{return X()}finally{f=Q}},t.unstable_scheduleCallback=function(D,X,Q){var ae=t.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?ae+Q:ae):Q=ae,D){case 1:var Se=-1;break;case 2:Se=250;break;case 5:Se=1073741823;break;case 4:Se=1e4;break;default:Se=5e3}return Se=Q+Se,D={id:d++,callback:X,priorityLevel:D,startTime:Q,expirationTime:Se,sortIndex:-1},Q>ae?(D.sortIndex=Q,e(u,D),n(l)===null&&D===n(u)&&(_?(c(L),L=-1):_=!0,K(y,Q-ae))):(D.sortIndex=Se,e(l,D),x||p||(x=!0,W(b))),D},t.unstable_shouldYield=N,t.unstable_wrapCallback=function(D){var X=f;return function(){var Q=f;f=X;try{return D.apply(this,arguments)}finally{f=Q}}}})(pm);hm.exports=pm;var Rv=hm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bv=ke,un=Rv;function te(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var mm=new Set,ca={};function Ar(t,e){ms(t,e),ms(t+"Capture",e)}function ms(t,e){for(ca[t]=e,t=0;t<e.length;t++)mm.add(e[t])}var pi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Zu=Object.prototype.hasOwnProperty,Pv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,jf={},Xf={};function Lv(t){return Zu.call(Xf,t)?!0:Zu.call(jf,t)?!1:Pv.test(t)?Xf[t]=!0:(jf[t]=!0,!1)}function Nv(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Dv(t,e,n,i){if(e===null||typeof e>"u"||Nv(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Xt(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Ut={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ut[t]=new Xt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ut[e]=new Xt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ut[t]=new Xt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ut[t]=new Xt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ut[t]=new Xt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ut[t]=new Xt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ut[t]=new Xt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ut[t]=new Xt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ut[t]=new Xt(t,5,!1,t.toLowerCase(),null,!1,!1)});var Cd=/[\-:]([a-z])/g;function Rd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Cd,Rd);Ut[e]=new Xt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Cd,Rd);Ut[e]=new Xt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Cd,Rd);Ut[e]=new Xt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ut[t]=new Xt(t,1,!1,t.toLowerCase(),null,!1,!1)});Ut.xlinkHref=new Xt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ut[t]=new Xt(t,1,!1,t.toLowerCase(),null,!0,!0)});function bd(t,e,n,i){var r=Ut.hasOwnProperty(e)?Ut[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Dv(e,n,r,i)&&(n=null),i||r===null?Lv(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var xi=bv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ga=Symbol.for("react.element"),qr=Symbol.for("react.portal"),$r=Symbol.for("react.fragment"),Pd=Symbol.for("react.strict_mode"),Qu=Symbol.for("react.profiler"),gm=Symbol.for("react.provider"),vm=Symbol.for("react.context"),Ld=Symbol.for("react.forward_ref"),Ju=Symbol.for("react.suspense"),ec=Symbol.for("react.suspense_list"),Nd=Symbol.for("react.memo"),Ri=Symbol.for("react.lazy"),_m=Symbol.for("react.offscreen"),qf=Symbol.iterator;function Ds(t){return t===null||typeof t!="object"?null:(t=qf&&t[qf]||t["@@iterator"],typeof t=="function"?t:null)}var lt=Object.assign,Zl;function $s(t){if(Zl===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Zl=e&&e[1]||""}return`
`+Zl+t}var Ql=!1;function Jl(t,e){if(!t||Ql)return"";Ql=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Ql=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?$s(t):""}function Uv(t){switch(t.tag){case 5:return $s(t.type);case 16:return $s("Lazy");case 13:return $s("Suspense");case 19:return $s("SuspenseList");case 0:case 2:case 15:return t=Jl(t.type,!1),t;case 11:return t=Jl(t.type.render,!1),t;case 1:return t=Jl(t.type,!0),t;default:return""}}function tc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case $r:return"Fragment";case qr:return"Portal";case Qu:return"Profiler";case Pd:return"StrictMode";case Ju:return"Suspense";case ec:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case vm:return(t.displayName||"Context")+".Consumer";case gm:return(t._context.displayName||"Context")+".Provider";case Ld:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Nd:return e=t.displayName||null,e!==null?e:tc(t.type)||"Memo";case Ri:e=t._payload,t=t._init;try{return tc(t(e))}catch{}}return null}function Iv(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return tc(e);case 8:return e===Pd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ji(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function xm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Fv(t){var e=xm(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Wa(t){t._valueTracker||(t._valueTracker=Fv(t))}function ym(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=xm(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function qo(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function nc(t,e){var n=e.checked;return lt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function $f(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=ji(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Sm(t,e){e=e.checked,e!=null&&bd(t,"checked",e,!1)}function ic(t,e){Sm(t,e);var n=ji(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?rc(t,e.type,n):e.hasOwnProperty("defaultValue")&&rc(t,e.type,ji(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Yf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function rc(t,e,n){(e!=="number"||qo(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ys=Array.isArray;function as(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+ji(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function sc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(te(91));return lt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Kf(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(te(92));if(Ys(n)){if(1<n.length)throw Error(te(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:ji(n)}}function Mm(t,e){var n=ji(e.value),i=ji(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Zf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Em(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ac(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Em(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var ja,wm=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(ja=ja||document.createElement("div"),ja.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ja.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function da(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var ea={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},kv=["Webkit","ms","Moz","O"];Object.keys(ea).forEach(function(t){kv.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ea[e]=ea[t]})});function Tm(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||ea.hasOwnProperty(t)&&ea[t]?(""+e).trim():e+"px"}function Am(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Tm(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Ov=lt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function oc(t,e){if(e){if(Ov[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(te(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(te(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(te(61))}if(e.style!=null&&typeof e.style!="object")throw Error(te(62))}}function lc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var uc=null;function Dd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var cc=null,os=null,ls=null;function Qf(t){if(t=Na(t)){if(typeof cc!="function")throw Error(te(280));var e=t.stateNode;e&&(e=bl(e),cc(t.stateNode,t.type,e))}}function Cm(t){os?ls?ls.push(t):ls=[t]:os=t}function Rm(){if(os){var t=os,e=ls;if(ls=os=null,Qf(t),e)for(t=0;t<e.length;t++)Qf(e[t])}}function bm(t,e){return t(e)}function Pm(){}var eu=!1;function Lm(t,e,n){if(eu)return t(e,n);eu=!0;try{return bm(t,e,n)}finally{eu=!1,(os!==null||ls!==null)&&(Pm(),Rm())}}function fa(t,e){var n=t.stateNode;if(n===null)return null;var i=bl(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(te(231,e,typeof n));return n}var dc=!1;if(pi)try{var Us={};Object.defineProperty(Us,"passive",{get:function(){dc=!0}}),window.addEventListener("test",Us,Us),window.removeEventListener("test",Us,Us)}catch{dc=!1}function Bv(t,e,n,i,r,s,a,o,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(d){this.onError(d)}}var ta=!1,$o=null,Yo=!1,fc=null,zv={onError:function(t){ta=!0,$o=t}};function Hv(t,e,n,i,r,s,a,o,l){ta=!1,$o=null,Bv.apply(zv,arguments)}function Vv(t,e,n,i,r,s,a,o,l){if(Hv.apply(this,arguments),ta){if(ta){var u=$o;ta=!1,$o=null}else throw Error(te(198));Yo||(Yo=!0,fc=u)}}function Cr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Nm(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Jf(t){if(Cr(t)!==t)throw Error(te(188))}function Gv(t){var e=t.alternate;if(!e){if(e=Cr(t),e===null)throw Error(te(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Jf(r),t;if(s===i)return Jf(r),e;s=s.sibling}throw Error(te(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(te(189))}}if(n.alternate!==i)throw Error(te(190))}if(n.tag!==3)throw Error(te(188));return n.stateNode.current===n?t:e}function Dm(t){return t=Gv(t),t!==null?Um(t):null}function Um(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Um(t);if(e!==null)return e;t=t.sibling}return null}var Im=un.unstable_scheduleCallback,eh=un.unstable_cancelCallback,Wv=un.unstable_shouldYield,jv=un.unstable_requestPaint,ht=un.unstable_now,Xv=un.unstable_getCurrentPriorityLevel,Ud=un.unstable_ImmediatePriority,Fm=un.unstable_UserBlockingPriority,Ko=un.unstable_NormalPriority,qv=un.unstable_LowPriority,km=un.unstable_IdlePriority,Tl=null,jn=null;function $v(t){if(jn&&typeof jn.onCommitFiberRoot=="function")try{jn.onCommitFiberRoot(Tl,t,void 0,(t.current.flags&128)===128)}catch{}}var Un=Math.clz32?Math.clz32:Zv,Yv=Math.log,Kv=Math.LN2;function Zv(t){return t>>>=0,t===0?32:31-(Yv(t)/Kv|0)|0}var Xa=64,qa=4194304;function Ks(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Zo(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=Ks(o):(s&=a,s!==0&&(i=Ks(s)))}else a=n&~r,a!==0?i=Ks(a):s!==0&&(i=Ks(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Un(e),r=1<<n,i|=t[n],e&=~r;return i}function Qv(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Jv(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Un(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=Qv(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function hc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Om(){var t=Xa;return Xa<<=1,!(Xa&4194240)&&(Xa=64),t}function tu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Pa(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Un(e),t[e]=n}function e_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Un(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Id(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Un(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var Qe=0;function Bm(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var zm,Fd,Hm,Vm,Gm,pc=!1,$a=[],Ii=null,Fi=null,ki=null,ha=new Map,pa=new Map,Pi=[],t_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function th(t,e){switch(t){case"focusin":case"focusout":Ii=null;break;case"dragenter":case"dragleave":Fi=null;break;case"mouseover":case"mouseout":ki=null;break;case"pointerover":case"pointerout":ha.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":pa.delete(e.pointerId)}}function Is(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Na(e),e!==null&&Fd(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function n_(t,e,n,i,r){switch(e){case"focusin":return Ii=Is(Ii,t,e,n,i,r),!0;case"dragenter":return Fi=Is(Fi,t,e,n,i,r),!0;case"mouseover":return ki=Is(ki,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return ha.set(s,Is(ha.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,pa.set(s,Is(pa.get(s)||null,t,e,n,i,r)),!0}return!1}function Wm(t){var e=fr(t.target);if(e!==null){var n=Cr(e);if(n!==null){if(e=n.tag,e===13){if(e=Nm(n),e!==null){t.blockedOn=e,Gm(t.priority,function(){Hm(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Lo(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=mc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);uc=i,n.target.dispatchEvent(i),uc=null}else return e=Na(n),e!==null&&Fd(e),t.blockedOn=n,!1;e.shift()}return!0}function nh(t,e,n){Lo(t)&&n.delete(e)}function i_(){pc=!1,Ii!==null&&Lo(Ii)&&(Ii=null),Fi!==null&&Lo(Fi)&&(Fi=null),ki!==null&&Lo(ki)&&(ki=null),ha.forEach(nh),pa.forEach(nh)}function Fs(t,e){t.blockedOn===e&&(t.blockedOn=null,pc||(pc=!0,un.unstable_scheduleCallback(un.unstable_NormalPriority,i_)))}function ma(t){function e(r){return Fs(r,t)}if(0<$a.length){Fs($a[0],t);for(var n=1;n<$a.length;n++){var i=$a[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Ii!==null&&Fs(Ii,t),Fi!==null&&Fs(Fi,t),ki!==null&&Fs(ki,t),ha.forEach(e),pa.forEach(e),n=0;n<Pi.length;n++)i=Pi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Pi.length&&(n=Pi[0],n.blockedOn===null);)Wm(n),n.blockedOn===null&&Pi.shift()}var us=xi.ReactCurrentBatchConfig,Qo=!0;function r_(t,e,n,i){var r=Qe,s=us.transition;us.transition=null;try{Qe=1,kd(t,e,n,i)}finally{Qe=r,us.transition=s}}function s_(t,e,n,i){var r=Qe,s=us.transition;us.transition=null;try{Qe=4,kd(t,e,n,i)}finally{Qe=r,us.transition=s}}function kd(t,e,n,i){if(Qo){var r=mc(t,e,n,i);if(r===null)du(t,e,i,Jo,n),th(t,i);else if(n_(r,t,e,n,i))i.stopPropagation();else if(th(t,i),e&4&&-1<t_.indexOf(t)){for(;r!==null;){var s=Na(r);if(s!==null&&zm(s),s=mc(t,e,n,i),s===null&&du(t,e,i,Jo,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else du(t,e,i,null,n)}}var Jo=null;function mc(t,e,n,i){if(Jo=null,t=Dd(i),t=fr(t),t!==null)if(e=Cr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Nm(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Jo=t,null}function jm(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Xv()){case Ud:return 1;case Fm:return 4;case Ko:case qv:return 16;case km:return 536870912;default:return 16}default:return 16}}var Di=null,Od=null,No=null;function Xm(){if(No)return No;var t,e=Od,n=e.length,i,r="value"in Di?Di.value:Di.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return No=r.slice(t,1<i?1-i:void 0)}function Do(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Ya(){return!0}function ih(){return!1}function dn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ya:ih,this.isPropagationStopped=ih,this}return lt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ya)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ya)},persist:function(){},isPersistent:Ya}),e}var Rs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Bd=dn(Rs),La=lt({},Rs,{view:0,detail:0}),a_=dn(La),nu,iu,ks,Al=lt({},La,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ks&&(ks&&t.type==="mousemove"?(nu=t.screenX-ks.screenX,iu=t.screenY-ks.screenY):iu=nu=0,ks=t),nu)},movementY:function(t){return"movementY"in t?t.movementY:iu}}),rh=dn(Al),o_=lt({},Al,{dataTransfer:0}),l_=dn(o_),u_=lt({},La,{relatedTarget:0}),ru=dn(u_),c_=lt({},Rs,{animationName:0,elapsedTime:0,pseudoElement:0}),d_=dn(c_),f_=lt({},Rs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),h_=dn(f_),p_=lt({},Rs,{data:0}),sh=dn(p_),m_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},g_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},v_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function __(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=v_[t])?!!e[t]:!1}function zd(){return __}var x_=lt({},La,{key:function(t){if(t.key){var e=m_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Do(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?g_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(t){return t.type==="keypress"?Do(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Do(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),y_=dn(x_),S_=lt({},Al,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ah=dn(S_),M_=lt({},La,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),E_=dn(M_),w_=lt({},Rs,{propertyName:0,elapsedTime:0,pseudoElement:0}),T_=dn(w_),A_=lt({},Al,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),C_=dn(A_),R_=[9,13,27,32],Hd=pi&&"CompositionEvent"in window,na=null;pi&&"documentMode"in document&&(na=document.documentMode);var b_=pi&&"TextEvent"in window&&!na,qm=pi&&(!Hd||na&&8<na&&11>=na),oh=" ",lh=!1;function $m(t,e){switch(t){case"keyup":return R_.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ym(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Yr=!1;function P_(t,e){switch(t){case"compositionend":return Ym(e);case"keypress":return e.which!==32?null:(lh=!0,oh);case"textInput":return t=e.data,t===oh&&lh?null:t;default:return null}}function L_(t,e){if(Yr)return t==="compositionend"||!Hd&&$m(t,e)?(t=Xm(),No=Od=Di=null,Yr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return qm&&e.locale!=="ko"?null:e.data;default:return null}}var N_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function uh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!N_[t.type]:e==="textarea"}function Km(t,e,n,i){Cm(i),e=el(e,"onChange"),0<e.length&&(n=new Bd("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var ia=null,ga=null;function D_(t){og(t,0)}function Cl(t){var e=Qr(t);if(ym(e))return t}function U_(t,e){if(t==="change")return e}var Zm=!1;if(pi){var su;if(pi){var au="oninput"in document;if(!au){var ch=document.createElement("div");ch.setAttribute("oninput","return;"),au=typeof ch.oninput=="function"}su=au}else su=!1;Zm=su&&(!document.documentMode||9<document.documentMode)}function dh(){ia&&(ia.detachEvent("onpropertychange",Qm),ga=ia=null)}function Qm(t){if(t.propertyName==="value"&&Cl(ga)){var e=[];Km(e,ga,t,Dd(t)),Lm(D_,e)}}function I_(t,e,n){t==="focusin"?(dh(),ia=e,ga=n,ia.attachEvent("onpropertychange",Qm)):t==="focusout"&&dh()}function F_(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Cl(ga)}function k_(t,e){if(t==="click")return Cl(e)}function O_(t,e){if(t==="input"||t==="change")return Cl(e)}function B_(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Fn=typeof Object.is=="function"?Object.is:B_;function va(t,e){if(Fn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Zu.call(e,r)||!Fn(t[r],e[r]))return!1}return!0}function fh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function hh(t,e){var n=fh(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=fh(n)}}function Jm(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Jm(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function eg(){for(var t=window,e=qo();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=qo(t.document)}return e}function Vd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function z_(t){var e=eg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Jm(n.ownerDocument.documentElement,n)){if(i!==null&&Vd(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=hh(n,s);var a=hh(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var H_=pi&&"documentMode"in document&&11>=document.documentMode,Kr=null,gc=null,ra=null,vc=!1;function ph(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;vc||Kr==null||Kr!==qo(i)||(i=Kr,"selectionStart"in i&&Vd(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ra&&va(ra,i)||(ra=i,i=el(gc,"onSelect"),0<i.length&&(e=new Bd("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Kr)))}function Ka(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Zr={animationend:Ka("Animation","AnimationEnd"),animationiteration:Ka("Animation","AnimationIteration"),animationstart:Ka("Animation","AnimationStart"),transitionend:Ka("Transition","TransitionEnd")},ou={},tg={};pi&&(tg=document.createElement("div").style,"AnimationEvent"in window||(delete Zr.animationend.animation,delete Zr.animationiteration.animation,delete Zr.animationstart.animation),"TransitionEvent"in window||delete Zr.transitionend.transition);function Rl(t){if(ou[t])return ou[t];if(!Zr[t])return t;var e=Zr[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in tg)return ou[t]=e[n];return t}var ng=Rl("animationend"),ig=Rl("animationiteration"),rg=Rl("animationstart"),sg=Rl("transitionend"),ag=new Map,mh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function $i(t,e){ag.set(t,e),Ar(e,[t])}for(var lu=0;lu<mh.length;lu++){var uu=mh[lu],V_=uu.toLowerCase(),G_=uu[0].toUpperCase()+uu.slice(1);$i(V_,"on"+G_)}$i(ng,"onAnimationEnd");$i(ig,"onAnimationIteration");$i(rg,"onAnimationStart");$i("dblclick","onDoubleClick");$i("focusin","onFocus");$i("focusout","onBlur");$i(sg,"onTransitionEnd");ms("onMouseEnter",["mouseout","mouseover"]);ms("onMouseLeave",["mouseout","mouseover"]);ms("onPointerEnter",["pointerout","pointerover"]);ms("onPointerLeave",["pointerout","pointerover"]);Ar("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ar("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ar("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ar("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ar("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ar("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),W_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Zs));function gh(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Vv(i,e,void 0,t),t.currentTarget=null}function og(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,u=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;gh(r,o,u),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,u=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;gh(r,o,u),s=l}}}if(Yo)throw t=fc,Yo=!1,fc=null,t}function tt(t,e){var n=e[Mc];n===void 0&&(n=e[Mc]=new Set);var i=t+"__bubble";n.has(i)||(lg(e,t,2,!1),n.add(i))}function cu(t,e,n){var i=0;e&&(i|=4),lg(n,t,i,e)}var Za="_reactListening"+Math.random().toString(36).slice(2);function _a(t){if(!t[Za]){t[Za]=!0,mm.forEach(function(n){n!=="selectionchange"&&(W_.has(n)||cu(n,!1,t),cu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Za]||(e[Za]=!0,cu("selectionchange",!1,e))}}function lg(t,e,n,i){switch(jm(e)){case 1:var r=r_;break;case 4:r=s_;break;default:r=kd}n=r.bind(null,e,n,t),r=void 0,!dc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function du(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=fr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Lm(function(){var u=s,d=Dd(n),h=[];e:{var f=ag.get(t);if(f!==void 0){var p=Bd,x=t;switch(t){case"keypress":if(Do(n)===0)break e;case"keydown":case"keyup":p=y_;break;case"focusin":x="focus",p=ru;break;case"focusout":x="blur",p=ru;break;case"beforeblur":case"afterblur":p=ru;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=rh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=l_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=E_;break;case ng:case ig:case rg:p=d_;break;case sg:p=T_;break;case"scroll":p=a_;break;case"wheel":p=C_;break;case"copy":case"cut":case"paste":p=h_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ah}var _=(e&4)!==0,m=!_&&t==="scroll",c=_?f!==null?f+"Capture":null:f;_=[];for(var v=u,g;v!==null;){g=v;var y=g.stateNode;if(g.tag===5&&y!==null&&(g=y,c!==null&&(y=fa(v,c),y!=null&&_.push(xa(v,y,g)))),m)break;v=v.return}0<_.length&&(f=new p(f,x,null,n,d),h.push({event:f,listeners:_}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==uc&&(x=n.relatedTarget||n.fromElement)&&(fr(x)||x[mi]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(x=n.relatedTarget||n.toElement,p=u,x=x?fr(x):null,x!==null&&(m=Cr(x),x!==m||x.tag!==5&&x.tag!==6)&&(x=null)):(p=null,x=u),p!==x)){if(_=rh,y="onMouseLeave",c="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(_=ah,y="onPointerLeave",c="onPointerEnter",v="pointer"),m=p==null?f:Qr(p),g=x==null?f:Qr(x),f=new _(y,v+"leave",p,n,d),f.target=m,f.relatedTarget=g,y=null,fr(d)===u&&(_=new _(c,v+"enter",x,n,d),_.target=g,_.relatedTarget=m,y=_),m=y,p&&x)t:{for(_=p,c=x,v=0,g=_;g;g=br(g))v++;for(g=0,y=c;y;y=br(y))g++;for(;0<v-g;)_=br(_),v--;for(;0<g-v;)c=br(c),g--;for(;v--;){if(_===c||c!==null&&_===c.alternate)break t;_=br(_),c=br(c)}_=null}else _=null;p!==null&&vh(h,f,p,_,!1),x!==null&&m!==null&&vh(h,m,x,_,!0)}}e:{if(f=u?Qr(u):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var b=U_;else if(uh(f))if(Zm)b=O_;else{b=F_;var C=I_}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(b=k_);if(b&&(b=b(t,u))){Km(h,b,n,d);break e}C&&C(t,f,u),t==="focusout"&&(C=f._wrapperState)&&C.controlled&&f.type==="number"&&rc(f,"number",f.value)}switch(C=u?Qr(u):window,t){case"focusin":(uh(C)||C.contentEditable==="true")&&(Kr=C,gc=u,ra=null);break;case"focusout":ra=gc=Kr=null;break;case"mousedown":vc=!0;break;case"contextmenu":case"mouseup":case"dragend":vc=!1,ph(h,n,d);break;case"selectionchange":if(H_)break;case"keydown":case"keyup":ph(h,n,d)}var A;if(Hd)e:{switch(t){case"compositionstart":var L="onCompositionStart";break e;case"compositionend":L="onCompositionEnd";break e;case"compositionupdate":L="onCompositionUpdate";break e}L=void 0}else Yr?$m(t,n)&&(L="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(L="onCompositionStart");L&&(qm&&n.locale!=="ko"&&(Yr||L!=="onCompositionStart"?L==="onCompositionEnd"&&Yr&&(A=Xm()):(Di=d,Od="value"in Di?Di.value:Di.textContent,Yr=!0)),C=el(u,L),0<C.length&&(L=new sh(L,t,null,n,d),h.push({event:L,listeners:C}),A?L.data=A:(A=Ym(n),A!==null&&(L.data=A)))),(A=b_?P_(t,n):L_(t,n))&&(u=el(u,"onBeforeInput"),0<u.length&&(d=new sh("onBeforeInput","beforeinput",null,n,d),h.push({event:d,listeners:u}),d.data=A))}og(h,e)})}function xa(t,e,n){return{instance:t,listener:e,currentTarget:n}}function el(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=fa(t,n),s!=null&&i.unshift(xa(t,s,r)),s=fa(t,e),s!=null&&i.push(xa(t,s,r))),t=t.return}return i}function br(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function vh(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,u=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&u!==null&&(o=u,r?(l=fa(n,s),l!=null&&a.unshift(xa(n,l,o))):r||(l=fa(n,s),l!=null&&a.push(xa(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var j_=/\r\n?/g,X_=/\u0000|\uFFFD/g;function _h(t){return(typeof t=="string"?t:""+t).replace(j_,`
`).replace(X_,"")}function Qa(t,e,n){if(e=_h(e),_h(t)!==e&&n)throw Error(te(425))}function tl(){}var _c=null,xc=null;function yc(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Sc=typeof setTimeout=="function"?setTimeout:void 0,q_=typeof clearTimeout=="function"?clearTimeout:void 0,xh=typeof Promise=="function"?Promise:void 0,$_=typeof queueMicrotask=="function"?queueMicrotask:typeof xh<"u"?function(t){return xh.resolve(null).then(t).catch(Y_)}:Sc;function Y_(t){setTimeout(function(){throw t})}function fu(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),ma(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ma(e)}function Oi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function yh(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var bs=Math.random().toString(36).slice(2),Gn="__reactFiber$"+bs,ya="__reactProps$"+bs,mi="__reactContainer$"+bs,Mc="__reactEvents$"+bs,K_="__reactListeners$"+bs,Z_="__reactHandles$"+bs;function fr(t){var e=t[Gn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[mi]||n[Gn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=yh(t);t!==null;){if(n=t[Gn])return n;t=yh(t)}return e}t=n,n=t.parentNode}return null}function Na(t){return t=t[Gn]||t[mi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Qr(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(te(33))}function bl(t){return t[ya]||null}var Ec=[],Jr=-1;function Yi(t){return{current:t}}function it(t){0>Jr||(t.current=Ec[Jr],Ec[Jr]=null,Jr--)}function et(t,e){Jr++,Ec[Jr]=t.current,t.current=e}var Xi={},zt=Yi(Xi),Zt=Yi(!1),xr=Xi;function gs(t,e){var n=t.type.contextTypes;if(!n)return Xi;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function Qt(t){return t=t.childContextTypes,t!=null}function nl(){it(Zt),it(zt)}function Sh(t,e,n){if(zt.current!==Xi)throw Error(te(168));et(zt,e),et(Zt,n)}function ug(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(te(108,Iv(t)||"Unknown",r));return lt({},n,i)}function il(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Xi,xr=zt.current,et(zt,t),et(Zt,Zt.current),!0}function Mh(t,e,n){var i=t.stateNode;if(!i)throw Error(te(169));n?(t=ug(t,e,xr),i.__reactInternalMemoizedMergedChildContext=t,it(Zt),it(zt),et(zt,t)):it(Zt),et(Zt,n)}var ai=null,Pl=!1,hu=!1;function cg(t){ai===null?ai=[t]:ai.push(t)}function Q_(t){Pl=!0,cg(t)}function Ki(){if(!hu&&ai!==null){hu=!0;var t=0,e=Qe;try{var n=ai;for(Qe=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}ai=null,Pl=!1}catch(r){throw ai!==null&&(ai=ai.slice(t+1)),Im(Ud,Ki),r}finally{Qe=e,hu=!1}}return null}var es=[],ts=0,rl=null,sl=0,pn=[],mn=0,yr=null,li=1,ui="";function ar(t,e){es[ts++]=sl,es[ts++]=rl,rl=t,sl=e}function dg(t,e,n){pn[mn++]=li,pn[mn++]=ui,pn[mn++]=yr,yr=t;var i=li;t=ui;var r=32-Un(i)-1;i&=~(1<<r),n+=1;var s=32-Un(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,li=1<<32-Un(e)+r|n<<r|i,ui=s+t}else li=1<<s|n<<r|i,ui=t}function Gd(t){t.return!==null&&(ar(t,1),dg(t,1,0))}function Wd(t){for(;t===rl;)rl=es[--ts],es[ts]=null,sl=es[--ts],es[ts]=null;for(;t===yr;)yr=pn[--mn],pn[mn]=null,ui=pn[--mn],pn[mn]=null,li=pn[--mn],pn[mn]=null}var ln=null,on=null,rt=!1,Ln=null;function fg(t,e){var n=vn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Eh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,ln=t,on=Oi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,ln=t,on=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=yr!==null?{id:li,overflow:ui}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=vn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,ln=t,on=null,!0):!1;default:return!1}}function wc(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Tc(t){if(rt){var e=on;if(e){var n=e;if(!Eh(t,e)){if(wc(t))throw Error(te(418));e=Oi(n.nextSibling);var i=ln;e&&Eh(t,e)?fg(i,n):(t.flags=t.flags&-4097|2,rt=!1,ln=t)}}else{if(wc(t))throw Error(te(418));t.flags=t.flags&-4097|2,rt=!1,ln=t}}}function wh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;ln=t}function Ja(t){if(t!==ln)return!1;if(!rt)return wh(t),rt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!yc(t.type,t.memoizedProps)),e&&(e=on)){if(wc(t))throw hg(),Error(te(418));for(;e;)fg(t,e),e=Oi(e.nextSibling)}if(wh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(te(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){on=Oi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}on=null}}else on=ln?Oi(t.stateNode.nextSibling):null;return!0}function hg(){for(var t=on;t;)t=Oi(t.nextSibling)}function vs(){on=ln=null,rt=!1}function jd(t){Ln===null?Ln=[t]:Ln.push(t)}var J_=xi.ReactCurrentBatchConfig;function Os(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(te(309));var i=n.stateNode}if(!i)throw Error(te(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(te(284));if(!n._owner)throw Error(te(290,t))}return t}function eo(t,e){throw t=Object.prototype.toString.call(e),Error(te(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Th(t){var e=t._init;return e(t._payload)}function pg(t){function e(c,v){if(t){var g=c.deletions;g===null?(c.deletions=[v],c.flags|=16):g.push(v)}}function n(c,v){if(!t)return null;for(;v!==null;)e(c,v),v=v.sibling;return null}function i(c,v){for(c=new Map;v!==null;)v.key!==null?c.set(v.key,v):c.set(v.index,v),v=v.sibling;return c}function r(c,v){return c=Vi(c,v),c.index=0,c.sibling=null,c}function s(c,v,g){return c.index=g,t?(g=c.alternate,g!==null?(g=g.index,g<v?(c.flags|=2,v):g):(c.flags|=2,v)):(c.flags|=1048576,v)}function a(c){return t&&c.alternate===null&&(c.flags|=2),c}function o(c,v,g,y){return v===null||v.tag!==6?(v=yu(g,c.mode,y),v.return=c,v):(v=r(v,g),v.return=c,v)}function l(c,v,g,y){var b=g.type;return b===$r?d(c,v,g.props.children,y,g.key):v!==null&&(v.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Ri&&Th(b)===v.type)?(y=r(v,g.props),y.ref=Os(c,v,g),y.return=c,y):(y=zo(g.type,g.key,g.props,null,c.mode,y),y.ref=Os(c,v,g),y.return=c,y)}function u(c,v,g,y){return v===null||v.tag!==4||v.stateNode.containerInfo!==g.containerInfo||v.stateNode.implementation!==g.implementation?(v=Su(g,c.mode,y),v.return=c,v):(v=r(v,g.children||[]),v.return=c,v)}function d(c,v,g,y,b){return v===null||v.tag!==7?(v=_r(g,c.mode,y,b),v.return=c,v):(v=r(v,g),v.return=c,v)}function h(c,v,g){if(typeof v=="string"&&v!==""||typeof v=="number")return v=yu(""+v,c.mode,g),v.return=c,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Ga:return g=zo(v.type,v.key,v.props,null,c.mode,g),g.ref=Os(c,null,v),g.return=c,g;case qr:return v=Su(v,c.mode,g),v.return=c,v;case Ri:var y=v._init;return h(c,y(v._payload),g)}if(Ys(v)||Ds(v))return v=_r(v,c.mode,g,null),v.return=c,v;eo(c,v)}return null}function f(c,v,g,y){var b=v!==null?v.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return b!==null?null:o(c,v,""+g,y);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Ga:return g.key===b?l(c,v,g,y):null;case qr:return g.key===b?u(c,v,g,y):null;case Ri:return b=g._init,f(c,v,b(g._payload),y)}if(Ys(g)||Ds(g))return b!==null?null:d(c,v,g,y,null);eo(c,g)}return null}function p(c,v,g,y,b){if(typeof y=="string"&&y!==""||typeof y=="number")return c=c.get(g)||null,o(v,c,""+y,b);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Ga:return c=c.get(y.key===null?g:y.key)||null,l(v,c,y,b);case qr:return c=c.get(y.key===null?g:y.key)||null,u(v,c,y,b);case Ri:var C=y._init;return p(c,v,g,C(y._payload),b)}if(Ys(y)||Ds(y))return c=c.get(g)||null,d(v,c,y,b,null);eo(v,y)}return null}function x(c,v,g,y){for(var b=null,C=null,A=v,L=v=0,T=null;A!==null&&L<g.length;L++){A.index>L?(T=A,A=null):T=A.sibling;var M=f(c,A,g[L],y);if(M===null){A===null&&(A=T);break}t&&A&&M.alternate===null&&e(c,A),v=s(M,v,L),C===null?b=M:C.sibling=M,C=M,A=T}if(L===g.length)return n(c,A),rt&&ar(c,L),b;if(A===null){for(;L<g.length;L++)A=h(c,g[L],y),A!==null&&(v=s(A,v,L),C===null?b=A:C.sibling=A,C=A);return rt&&ar(c,L),b}for(A=i(c,A);L<g.length;L++)T=p(A,c,L,g[L],y),T!==null&&(t&&T.alternate!==null&&A.delete(T.key===null?L:T.key),v=s(T,v,L),C===null?b=T:C.sibling=T,C=T);return t&&A.forEach(function(N){return e(c,N)}),rt&&ar(c,L),b}function _(c,v,g,y){var b=Ds(g);if(typeof b!="function")throw Error(te(150));if(g=b.call(g),g==null)throw Error(te(151));for(var C=b=null,A=v,L=v=0,T=null,M=g.next();A!==null&&!M.done;L++,M=g.next()){A.index>L?(T=A,A=null):T=A.sibling;var N=f(c,A,M.value,y);if(N===null){A===null&&(A=T);break}t&&A&&N.alternate===null&&e(c,A),v=s(N,v,L),C===null?b=N:C.sibling=N,C=N,A=T}if(M.done)return n(c,A),rt&&ar(c,L),b;if(A===null){for(;!M.done;L++,M=g.next())M=h(c,M.value,y),M!==null&&(v=s(M,v,L),C===null?b=M:C.sibling=M,C=M);return rt&&ar(c,L),b}for(A=i(c,A);!M.done;L++,M=g.next())M=p(A,c,L,M.value,y),M!==null&&(t&&M.alternate!==null&&A.delete(M.key===null?L:M.key),v=s(M,v,L),C===null?b=M:C.sibling=M,C=M);return t&&A.forEach(function(G){return e(c,G)}),rt&&ar(c,L),b}function m(c,v,g,y){if(typeof g=="object"&&g!==null&&g.type===$r&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case Ga:e:{for(var b=g.key,C=v;C!==null;){if(C.key===b){if(b=g.type,b===$r){if(C.tag===7){n(c,C.sibling),v=r(C,g.props.children),v.return=c,c=v;break e}}else if(C.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Ri&&Th(b)===C.type){n(c,C.sibling),v=r(C,g.props),v.ref=Os(c,C,g),v.return=c,c=v;break e}n(c,C);break}else e(c,C);C=C.sibling}g.type===$r?(v=_r(g.props.children,c.mode,y,g.key),v.return=c,c=v):(y=zo(g.type,g.key,g.props,null,c.mode,y),y.ref=Os(c,v,g),y.return=c,c=y)}return a(c);case qr:e:{for(C=g.key;v!==null;){if(v.key===C)if(v.tag===4&&v.stateNode.containerInfo===g.containerInfo&&v.stateNode.implementation===g.implementation){n(c,v.sibling),v=r(v,g.children||[]),v.return=c,c=v;break e}else{n(c,v);break}else e(c,v);v=v.sibling}v=Su(g,c.mode,y),v.return=c,c=v}return a(c);case Ri:return C=g._init,m(c,v,C(g._payload),y)}if(Ys(g))return x(c,v,g,y);if(Ds(g))return _(c,v,g,y);eo(c,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,v!==null&&v.tag===6?(n(c,v.sibling),v=r(v,g),v.return=c,c=v):(n(c,v),v=yu(g,c.mode,y),v.return=c,c=v),a(c)):n(c,v)}return m}var _s=pg(!0),mg=pg(!1),al=Yi(null),ol=null,ns=null,Xd=null;function qd(){Xd=ns=ol=null}function $d(t){var e=al.current;it(al),t._currentValue=e}function Ac(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function cs(t,e){ol=t,Xd=ns=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(Kt=!0),t.firstContext=null)}function Sn(t){var e=t._currentValue;if(Xd!==t)if(t={context:t,memoizedValue:e,next:null},ns===null){if(ol===null)throw Error(te(308));ns=t,ol.dependencies={lanes:0,firstContext:t}}else ns=ns.next=t;return e}var hr=null;function Yd(t){hr===null?hr=[t]:hr.push(t)}function gg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Yd(e)):(n.next=r.next,r.next=n),e.interleaved=n,gi(t,i)}function gi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var bi=!1;function Kd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function vg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function fi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Bi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,je&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,gi(t,n)}return r=i.interleaved,r===null?(e.next=e,Yd(i)):(e.next=r.next,r.next=e),i.interleaved=e,gi(t,n)}function Uo(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Id(t,n)}}function Ah(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function ll(t,e,n,i){var r=t.updateQueue;bi=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,u=l.next;l.next=null,a===null?s=u:a.next=u,a=l;var d=t.alternate;d!==null&&(d=d.updateQueue,o=d.lastBaseUpdate,o!==a&&(o===null?d.firstBaseUpdate=u:o.next=u,d.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;a=0,d=u=l=null,o=s;do{var f=o.lane,p=o.eventTime;if((i&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var x=t,_=o;switch(f=e,p=n,_.tag){case 1:if(x=_.payload,typeof x=="function"){h=x.call(p,h,f);break e}h=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=_.payload,f=typeof x=="function"?x.call(p,h,f):x,f==null)break e;h=lt({},h,f);break e;case 2:bi=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[o]:f.push(o))}else p={eventTime:p,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},d===null?(u=d=p,l=h):d=d.next=p,a|=f;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;f=o,o=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(d===null&&(l=h),r.baseState=l,r.firstBaseUpdate=u,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Mr|=a,t.lanes=a,t.memoizedState=h}}function Ch(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(te(191,r));r.call(i)}}}var Da={},Xn=Yi(Da),Sa=Yi(Da),Ma=Yi(Da);function pr(t){if(t===Da)throw Error(te(174));return t}function Zd(t,e){switch(et(Ma,e),et(Sa,t),et(Xn,Da),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:ac(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=ac(e,t)}it(Xn),et(Xn,e)}function xs(){it(Xn),it(Sa),it(Ma)}function _g(t){pr(Ma.current);var e=pr(Xn.current),n=ac(e,t.type);e!==n&&(et(Sa,t),et(Xn,n))}function Qd(t){Sa.current===t&&(it(Xn),it(Sa))}var at=Yi(0);function ul(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var pu=[];function Jd(){for(var t=0;t<pu.length;t++)pu[t]._workInProgressVersionPrimary=null;pu.length=0}var Io=xi.ReactCurrentDispatcher,mu=xi.ReactCurrentBatchConfig,Sr=0,ot=null,St=null,Ct=null,cl=!1,sa=!1,Ea=0,ex=0;function It(){throw Error(te(321))}function ef(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Fn(t[n],e[n]))return!1;return!0}function tf(t,e,n,i,r,s){if(Sr=s,ot=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Io.current=t===null||t.memoizedState===null?rx:sx,t=n(i,r),sa){s=0;do{if(sa=!1,Ea=0,25<=s)throw Error(te(301));s+=1,Ct=St=null,e.updateQueue=null,Io.current=ax,t=n(i,r)}while(sa)}if(Io.current=dl,e=St!==null&&St.next!==null,Sr=0,Ct=St=ot=null,cl=!1,e)throw Error(te(300));return t}function nf(){var t=Ea!==0;return Ea=0,t}function Hn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ct===null?ot.memoizedState=Ct=t:Ct=Ct.next=t,Ct}function Mn(){if(St===null){var t=ot.alternate;t=t!==null?t.memoizedState:null}else t=St.next;var e=Ct===null?ot.memoizedState:Ct.next;if(e!==null)Ct=e,St=t;else{if(t===null)throw Error(te(310));St=t,t={memoizedState:St.memoizedState,baseState:St.baseState,baseQueue:St.baseQueue,queue:St.queue,next:null},Ct===null?ot.memoizedState=Ct=t:Ct=Ct.next=t}return Ct}function wa(t,e){return typeof e=="function"?e(t):e}function gu(t){var e=Mn(),n=e.queue;if(n===null)throw Error(te(311));n.lastRenderedReducer=t;var i=St,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,u=s;do{var d=u.lane;if((Sr&d)===d)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var h={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(o=l=h,a=i):l=l.next=h,ot.lanes|=d,Mr|=d}u=u.next}while(u!==null&&u!==s);l===null?a=i:l.next=o,Fn(i,e.memoizedState)||(Kt=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,ot.lanes|=s,Mr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function vu(t){var e=Mn(),n=e.queue;if(n===null)throw Error(te(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Fn(s,e.memoizedState)||(Kt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function xg(){}function yg(t,e){var n=ot,i=Mn(),r=e(),s=!Fn(i.memoizedState,r);if(s&&(i.memoizedState=r,Kt=!0),i=i.queue,rf(Eg.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ct!==null&&Ct.memoizedState.tag&1){if(n.flags|=2048,Ta(9,Mg.bind(null,n,i,r,e),void 0,null),Rt===null)throw Error(te(349));Sr&30||Sg(n,e,r)}return r}function Sg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=ot.updateQueue,e===null?(e={lastEffect:null,stores:null},ot.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Mg(t,e,n,i){e.value=n,e.getSnapshot=i,wg(e)&&Tg(t)}function Eg(t,e,n){return n(function(){wg(e)&&Tg(t)})}function wg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Fn(t,n)}catch{return!0}}function Tg(t){var e=gi(t,1);e!==null&&In(e,t,1,-1)}function Rh(t){var e=Hn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:wa,lastRenderedState:t},e.queue=t,t=t.dispatch=ix.bind(null,ot,t),[e.memoizedState,t]}function Ta(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=ot.updateQueue,e===null?(e={lastEffect:null,stores:null},ot.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Ag(){return Mn().memoizedState}function Fo(t,e,n,i){var r=Hn();ot.flags|=t,r.memoizedState=Ta(1|e,n,void 0,i===void 0?null:i)}function Ll(t,e,n,i){var r=Mn();i=i===void 0?null:i;var s=void 0;if(St!==null){var a=St.memoizedState;if(s=a.destroy,i!==null&&ef(i,a.deps)){r.memoizedState=Ta(e,n,s,i);return}}ot.flags|=t,r.memoizedState=Ta(1|e,n,s,i)}function bh(t,e){return Fo(8390656,8,t,e)}function rf(t,e){return Ll(2048,8,t,e)}function Cg(t,e){return Ll(4,2,t,e)}function Rg(t,e){return Ll(4,4,t,e)}function bg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Pg(t,e,n){return n=n!=null?n.concat([t]):null,Ll(4,4,bg.bind(null,e,t),n)}function sf(){}function Lg(t,e){var n=Mn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&ef(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Ng(t,e){var n=Mn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&ef(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Dg(t,e,n){return Sr&21?(Fn(n,e)||(n=Om(),ot.lanes|=n,Mr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,Kt=!0),t.memoizedState=n)}function tx(t,e){var n=Qe;Qe=n!==0&&4>n?n:4,t(!0);var i=mu.transition;mu.transition={};try{t(!1),e()}finally{Qe=n,mu.transition=i}}function Ug(){return Mn().memoizedState}function nx(t,e,n){var i=Hi(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Ig(t))Fg(e,n);else if(n=gg(t,e,n,i),n!==null){var r=Gt();In(n,t,i,r),kg(n,e,i)}}function ix(t,e,n){var i=Hi(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ig(t))Fg(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Fn(o,a)){var l=e.interleaved;l===null?(r.next=r,Yd(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=gg(t,e,r,i),n!==null&&(r=Gt(),In(n,t,i,r),kg(n,e,i))}}function Ig(t){var e=t.alternate;return t===ot||e!==null&&e===ot}function Fg(t,e){sa=cl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function kg(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Id(t,n)}}var dl={readContext:Sn,useCallback:It,useContext:It,useEffect:It,useImperativeHandle:It,useInsertionEffect:It,useLayoutEffect:It,useMemo:It,useReducer:It,useRef:It,useState:It,useDebugValue:It,useDeferredValue:It,useTransition:It,useMutableSource:It,useSyncExternalStore:It,useId:It,unstable_isNewReconciler:!1},rx={readContext:Sn,useCallback:function(t,e){return Hn().memoizedState=[t,e===void 0?null:e],t},useContext:Sn,useEffect:bh,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Fo(4194308,4,bg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Fo(4194308,4,t,e)},useInsertionEffect:function(t,e){return Fo(4,2,t,e)},useMemo:function(t,e){var n=Hn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Hn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=nx.bind(null,ot,t),[i.memoizedState,t]},useRef:function(t){var e=Hn();return t={current:t},e.memoizedState=t},useState:Rh,useDebugValue:sf,useDeferredValue:function(t){return Hn().memoizedState=t},useTransition:function(){var t=Rh(!1),e=t[0];return t=tx.bind(null,t[1]),Hn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=ot,r=Hn();if(rt){if(n===void 0)throw Error(te(407));n=n()}else{if(n=e(),Rt===null)throw Error(te(349));Sr&30||Sg(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,bh(Eg.bind(null,i,s,t),[t]),i.flags|=2048,Ta(9,Mg.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Hn(),e=Rt.identifierPrefix;if(rt){var n=ui,i=li;n=(i&~(1<<32-Un(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ea++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=ex++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},sx={readContext:Sn,useCallback:Lg,useContext:Sn,useEffect:rf,useImperativeHandle:Pg,useInsertionEffect:Cg,useLayoutEffect:Rg,useMemo:Ng,useReducer:gu,useRef:Ag,useState:function(){return gu(wa)},useDebugValue:sf,useDeferredValue:function(t){var e=Mn();return Dg(e,St.memoizedState,t)},useTransition:function(){var t=gu(wa)[0],e=Mn().memoizedState;return[t,e]},useMutableSource:xg,useSyncExternalStore:yg,useId:Ug,unstable_isNewReconciler:!1},ax={readContext:Sn,useCallback:Lg,useContext:Sn,useEffect:rf,useImperativeHandle:Pg,useInsertionEffect:Cg,useLayoutEffect:Rg,useMemo:Ng,useReducer:vu,useRef:Ag,useState:function(){return vu(wa)},useDebugValue:sf,useDeferredValue:function(t){var e=Mn();return St===null?e.memoizedState=t:Dg(e,St.memoizedState,t)},useTransition:function(){var t=vu(wa)[0],e=Mn().memoizedState;return[t,e]},useMutableSource:xg,useSyncExternalStore:yg,useId:Ug,unstable_isNewReconciler:!1};function Rn(t,e){if(t&&t.defaultProps){e=lt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Cc(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:lt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Nl={isMounted:function(t){return(t=t._reactInternals)?Cr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=Gt(),r=Hi(t),s=fi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Bi(t,s,r),e!==null&&(In(e,t,r,i),Uo(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=Gt(),r=Hi(t),s=fi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Bi(t,s,r),e!==null&&(In(e,t,r,i),Uo(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Gt(),i=Hi(t),r=fi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Bi(t,r,i),e!==null&&(In(e,t,i,n),Uo(e,t,i))}};function Ph(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!va(n,i)||!va(r,s):!0}function Og(t,e,n){var i=!1,r=Xi,s=e.contextType;return typeof s=="object"&&s!==null?s=Sn(s):(r=Qt(e)?xr:zt.current,i=e.contextTypes,s=(i=i!=null)?gs(t,r):Xi),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Nl,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Lh(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Nl.enqueueReplaceState(e,e.state,null)}function Rc(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Kd(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Sn(s):(s=Qt(e)?xr:zt.current,r.context=gs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Cc(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Nl.enqueueReplaceState(r,r.state,null),ll(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function ys(t,e){try{var n="",i=e;do n+=Uv(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function _u(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function bc(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var ox=typeof WeakMap=="function"?WeakMap:Map;function Bg(t,e,n){n=fi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){hl||(hl=!0,Bc=i),bc(t,e)},n}function zg(t,e,n){n=fi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){bc(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){bc(t,e),typeof i!="function"&&(zi===null?zi=new Set([this]):zi.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Nh(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new ox;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Sx.bind(null,t,e,n),e.then(t,t))}function Dh(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Uh(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=fi(-1,1),e.tag=2,Bi(n,e,1))),n.lanes|=1),t)}var lx=xi.ReactCurrentOwner,Kt=!1;function Vt(t,e,n,i){e.child=t===null?mg(e,null,n,i):_s(e,t.child,n,i)}function Ih(t,e,n,i,r){n=n.render;var s=e.ref;return cs(e,r),i=tf(t,e,n,i,s,r),n=nf(),t!==null&&!Kt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,vi(t,e,r)):(rt&&n&&Gd(e),e.flags|=1,Vt(t,e,i,r),e.child)}function Fh(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!hf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Hg(t,e,s,i,r)):(t=zo(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:va,n(a,i)&&t.ref===e.ref)return vi(t,e,r)}return e.flags|=1,t=Vi(s,i),t.ref=e.ref,t.return=e,e.child=t}function Hg(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(va(s,i)&&t.ref===e.ref)if(Kt=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(Kt=!0);else return e.lanes=t.lanes,vi(t,e,r)}return Pc(t,e,n,i,r)}function Vg(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},et(rs,an),an|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,et(rs,an),an|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,et(rs,an),an|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,et(rs,an),an|=i;return Vt(t,e,r,n),e.child}function Gg(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Pc(t,e,n,i,r){var s=Qt(n)?xr:zt.current;return s=gs(e,s),cs(e,r),n=tf(t,e,n,i,s,r),i=nf(),t!==null&&!Kt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,vi(t,e,r)):(rt&&i&&Gd(e),e.flags|=1,Vt(t,e,n,r),e.child)}function kh(t,e,n,i,r){if(Qt(n)){var s=!0;il(e)}else s=!1;if(cs(e,r),e.stateNode===null)ko(t,e),Og(e,n,i),Rc(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,u=n.contextType;typeof u=="object"&&u!==null?u=Sn(u):(u=Qt(n)?xr:zt.current,u=gs(e,u));var d=n.getDerivedStateFromProps,h=typeof d=="function"||typeof a.getSnapshotBeforeUpdate=="function";h||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==u)&&Lh(e,a,i,u),bi=!1;var f=e.memoizedState;a.state=f,ll(e,i,a,r),l=e.memoizedState,o!==i||f!==l||Zt.current||bi?(typeof d=="function"&&(Cc(e,n,d,i),l=e.memoizedState),(o=bi||Ph(e,n,o,i,f,l,u))?(h||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=u,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,vg(t,e),o=e.memoizedProps,u=e.type===e.elementType?o:Rn(e.type,o),a.props=u,h=e.pendingProps,f=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Sn(l):(l=Qt(n)?xr:zt.current,l=gs(e,l));var p=n.getDerivedStateFromProps;(d=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==h||f!==l)&&Lh(e,a,i,l),bi=!1,f=e.memoizedState,a.state=f,ll(e,i,a,r);var x=e.memoizedState;o!==h||f!==x||Zt.current||bi?(typeof p=="function"&&(Cc(e,n,p,i),x=e.memoizedState),(u=bi||Ph(e,n,u,i,f,x,l)||!1)?(d||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,x,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,x,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),a.props=i,a.state=x,a.context=l,i=u):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return Lc(t,e,n,i,s,r)}function Lc(t,e,n,i,r,s){Gg(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Mh(e,n,!1),vi(t,e,s);i=e.stateNode,lx.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=_s(e,t.child,null,s),e.child=_s(e,null,o,s)):Vt(t,e,o,s),e.memoizedState=i.state,r&&Mh(e,n,!0),e.child}function Wg(t){var e=t.stateNode;e.pendingContext?Sh(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Sh(t,e.context,!1),Zd(t,e.containerInfo)}function Oh(t,e,n,i,r){return vs(),jd(r),e.flags|=256,Vt(t,e,n,i),e.child}var Nc={dehydrated:null,treeContext:null,retryLane:0};function Dc(t){return{baseLanes:t,cachePool:null,transitions:null}}function jg(t,e,n){var i=e.pendingProps,r=at.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),et(at,r&1),t===null)return Tc(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=Il(a,i,0,null),t=_r(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Dc(n),e.memoizedState=Nc,t):af(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return ux(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Vi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Vi(o,s):(s=_r(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Dc(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=Nc,i}return s=t.child,t=s.sibling,i=Vi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function af(t,e){return e=Il({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function to(t,e,n,i){return i!==null&&jd(i),_s(e,t.child,null,n),t=af(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function ux(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=_u(Error(te(422))),to(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Il({mode:"visible",children:i.children},r,0,null),s=_r(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&_s(e,t.child,null,a),e.child.memoizedState=Dc(a),e.memoizedState=Nc,s);if(!(e.mode&1))return to(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(te(419)),i=_u(s,i,void 0),to(t,e,a,i)}if(o=(a&t.childLanes)!==0,Kt||o){if(i=Rt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,gi(t,r),In(i,t,r,-1))}return ff(),i=_u(Error(te(421))),to(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Mx.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,on=Oi(r.nextSibling),ln=e,rt=!0,Ln=null,t!==null&&(pn[mn++]=li,pn[mn++]=ui,pn[mn++]=yr,li=t.id,ui=t.overflow,yr=e),e=af(e,i.children),e.flags|=4096,e)}function Bh(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Ac(t.return,e,n)}function xu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function Xg(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Vt(t,e,i.children,n),i=at.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Bh(t,n,e);else if(t.tag===19)Bh(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(et(at,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&ul(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),xu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&ul(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}xu(e,!0,n,null,s);break;case"together":xu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ko(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function vi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Mr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(te(153));if(e.child!==null){for(t=e.child,n=Vi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Vi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function cx(t,e,n){switch(e.tag){case 3:Wg(e),vs();break;case 5:_g(e);break;case 1:Qt(e.type)&&il(e);break;case 4:Zd(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;et(al,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(et(at,at.current&1),e.flags|=128,null):n&e.child.childLanes?jg(t,e,n):(et(at,at.current&1),t=vi(t,e,n),t!==null?t.sibling:null);et(at,at.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return Xg(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),et(at,at.current),i)break;return null;case 22:case 23:return e.lanes=0,Vg(t,e,n)}return vi(t,e,n)}var qg,Uc,$g,Yg;qg=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Uc=function(){};$g=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,pr(Xn.current);var s=null;switch(n){case"input":r=nc(t,r),i=nc(t,i),s=[];break;case"select":r=lt({},r,{value:void 0}),i=lt({},i,{value:void 0}),s=[];break;case"textarea":r=sc(t,r),i=sc(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=tl)}oc(n,i);var a;n=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var o=r[u];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(ca.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var l=i[u];if(o=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&l!==o&&(l!=null||o!=null))if(u==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(u,n)),n=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(ca.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&tt("scroll",t),s||o===l||(s=[])):(s=s||[]).push(u,l))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};Yg=function(t,e,n,i){n!==i&&(e.flags|=4)};function Bs(t,e){if(!rt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Ft(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function dx(t,e,n){var i=e.pendingProps;switch(Wd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ft(e),null;case 1:return Qt(e.type)&&nl(),Ft(e),null;case 3:return i=e.stateNode,xs(),it(Zt),it(zt),Jd(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Ja(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Ln!==null&&(Vc(Ln),Ln=null))),Uc(t,e),Ft(e),null;case 5:Qd(e);var r=pr(Ma.current);if(n=e.type,t!==null&&e.stateNode!=null)$g(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(te(166));return Ft(e),null}if(t=pr(Xn.current),Ja(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Gn]=e,i[ya]=s,t=(e.mode&1)!==0,n){case"dialog":tt("cancel",i),tt("close",i);break;case"iframe":case"object":case"embed":tt("load",i);break;case"video":case"audio":for(r=0;r<Zs.length;r++)tt(Zs[r],i);break;case"source":tt("error",i);break;case"img":case"image":case"link":tt("error",i),tt("load",i);break;case"details":tt("toggle",i);break;case"input":$f(i,s),tt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},tt("invalid",i);break;case"textarea":Kf(i,s),tt("invalid",i)}oc(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&Qa(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&Qa(i.textContent,o,t),r=["children",""+o]):ca.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&tt("scroll",i)}switch(n){case"input":Wa(i),Yf(i,s,!0);break;case"textarea":Wa(i),Zf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=tl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Em(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Gn]=e,t[ya]=i,qg(t,e,!1,!1),e.stateNode=t;e:{switch(a=lc(n,i),n){case"dialog":tt("cancel",t),tt("close",t),r=i;break;case"iframe":case"object":case"embed":tt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Zs.length;r++)tt(Zs[r],t);r=i;break;case"source":tt("error",t),r=i;break;case"img":case"image":case"link":tt("error",t),tt("load",t),r=i;break;case"details":tt("toggle",t),r=i;break;case"input":$f(t,i),r=nc(t,i),tt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=lt({},i,{value:void 0}),tt("invalid",t);break;case"textarea":Kf(t,i),r=sc(t,i),tt("invalid",t);break;default:r=i}oc(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?Am(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&wm(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&da(t,l):typeof l=="number"&&da(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ca.hasOwnProperty(s)?l!=null&&s==="onScroll"&&tt("scroll",t):l!=null&&bd(t,s,l,a))}switch(n){case"input":Wa(t),Yf(t,i,!1);break;case"textarea":Wa(t),Zf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+ji(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?as(t,!!i.multiple,s,!1):i.defaultValue!=null&&as(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=tl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Ft(e),null;case 6:if(t&&e.stateNode!=null)Yg(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(te(166));if(n=pr(Ma.current),pr(Xn.current),Ja(e)){if(i=e.stateNode,n=e.memoizedProps,i[Gn]=e,(s=i.nodeValue!==n)&&(t=ln,t!==null))switch(t.tag){case 3:Qa(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Qa(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Gn]=e,e.stateNode=i}return Ft(e),null;case 13:if(it(at),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(rt&&on!==null&&e.mode&1&&!(e.flags&128))hg(),vs(),e.flags|=98560,s=!1;else if(s=Ja(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(te(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(te(317));s[Gn]=e}else vs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Ft(e),s=!1}else Ln!==null&&(Vc(Ln),Ln=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||at.current&1?Et===0&&(Et=3):ff())),e.updateQueue!==null&&(e.flags|=4),Ft(e),null);case 4:return xs(),Uc(t,e),t===null&&_a(e.stateNode.containerInfo),Ft(e),null;case 10:return $d(e.type._context),Ft(e),null;case 17:return Qt(e.type)&&nl(),Ft(e),null;case 19:if(it(at),s=e.memoizedState,s===null)return Ft(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Bs(s,!1);else{if(Et!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=ul(t),a!==null){for(e.flags|=128,Bs(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return et(at,at.current&1|2),e.child}t=t.sibling}s.tail!==null&&ht()>Ss&&(e.flags|=128,i=!0,Bs(s,!1),e.lanes=4194304)}else{if(!i)if(t=ul(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Bs(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!rt)return Ft(e),null}else 2*ht()-s.renderingStartTime>Ss&&n!==1073741824&&(e.flags|=128,i=!0,Bs(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=ht(),e.sibling=null,n=at.current,et(at,i?n&1|2:n&1),e):(Ft(e),null);case 22:case 23:return df(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?an&1073741824&&(Ft(e),e.subtreeFlags&6&&(e.flags|=8192)):Ft(e),null;case 24:return null;case 25:return null}throw Error(te(156,e.tag))}function fx(t,e){switch(Wd(e),e.tag){case 1:return Qt(e.type)&&nl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return xs(),it(Zt),it(zt),Jd(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Qd(e),null;case 13:if(it(at),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(te(340));vs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return it(at),null;case 4:return xs(),null;case 10:return $d(e.type._context),null;case 22:case 23:return df(),null;case 24:return null;default:return null}}var no=!1,Bt=!1,hx=typeof WeakSet=="function"?WeakSet:Set,he=null;function is(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){ft(t,e,i)}else n.current=null}function Ic(t,e,n){try{n()}catch(i){ft(t,e,i)}}var zh=!1;function px(t,e){if(_c=Qo,t=eg(),Vd(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,u=0,d=0,h=t,f=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(o=a+r),h!==s||i!==0&&h.nodeType!==3||(l=a+i),h.nodeType===3&&(a+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===n&&++u===r&&(o=a),f===s&&++d===i&&(l=a),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(xc={focusedElem:t,selectionRange:n},Qo=!1,he=e;he!==null;)if(e=he,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,he=t;else for(;he!==null;){e=he;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var _=x.memoizedProps,m=x.memoizedState,c=e.stateNode,v=c.getSnapshotBeforeUpdate(e.elementType===e.type?_:Rn(e.type,_),m);c.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var g=e.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(te(163))}}catch(y){ft(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,he=t;break}he=e.return}return x=zh,zh=!1,x}function aa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Ic(e,n,s)}r=r.next}while(r!==i)}}function Dl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Fc(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function Kg(t){var e=t.alternate;e!==null&&(t.alternate=null,Kg(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Gn],delete e[ya],delete e[Mc],delete e[K_],delete e[Z_])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Zg(t){return t.tag===5||t.tag===3||t.tag===4}function Hh(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Zg(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function kc(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=tl));else if(i!==4&&(t=t.child,t!==null))for(kc(t,e,n),t=t.sibling;t!==null;)kc(t,e,n),t=t.sibling}function Oc(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Oc(t,e,n),t=t.sibling;t!==null;)Oc(t,e,n),t=t.sibling}var Lt=null,bn=!1;function Si(t,e,n){for(n=n.child;n!==null;)Qg(t,e,n),n=n.sibling}function Qg(t,e,n){if(jn&&typeof jn.onCommitFiberUnmount=="function")try{jn.onCommitFiberUnmount(Tl,n)}catch{}switch(n.tag){case 5:Bt||is(n,e);case 6:var i=Lt,r=bn;Lt=null,Si(t,e,n),Lt=i,bn=r,Lt!==null&&(bn?(t=Lt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Lt.removeChild(n.stateNode));break;case 18:Lt!==null&&(bn?(t=Lt,n=n.stateNode,t.nodeType===8?fu(t.parentNode,n):t.nodeType===1&&fu(t,n),ma(t)):fu(Lt,n.stateNode));break;case 4:i=Lt,r=bn,Lt=n.stateNode.containerInfo,bn=!0,Si(t,e,n),Lt=i,bn=r;break;case 0:case 11:case 14:case 15:if(!Bt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Ic(n,e,a),r=r.next}while(r!==i)}Si(t,e,n);break;case 1:if(!Bt&&(is(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){ft(n,e,o)}Si(t,e,n);break;case 21:Si(t,e,n);break;case 22:n.mode&1?(Bt=(i=Bt)||n.memoizedState!==null,Si(t,e,n),Bt=i):Si(t,e,n);break;default:Si(t,e,n)}}function Vh(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new hx),e.forEach(function(i){var r=Ex.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function wn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Lt=o.stateNode,bn=!1;break e;case 3:Lt=o.stateNode.containerInfo,bn=!0;break e;case 4:Lt=o.stateNode.containerInfo,bn=!0;break e}o=o.return}if(Lt===null)throw Error(te(160));Qg(s,a,r),Lt=null,bn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(u){ft(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Jg(e,t),e=e.sibling}function Jg(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(wn(e,t),Bn(t),i&4){try{aa(3,t,t.return),Dl(3,t)}catch(_){ft(t,t.return,_)}try{aa(5,t,t.return)}catch(_){ft(t,t.return,_)}}break;case 1:wn(e,t),Bn(t),i&512&&n!==null&&is(n,n.return);break;case 5:if(wn(e,t),Bn(t),i&512&&n!==null&&is(n,n.return),t.flags&32){var r=t.stateNode;try{da(r,"")}catch(_){ft(t,t.return,_)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Sm(r,s),lc(o,a);var u=lc(o,s);for(a=0;a<l.length;a+=2){var d=l[a],h=l[a+1];d==="style"?Am(r,h):d==="dangerouslySetInnerHTML"?wm(r,h):d==="children"?da(r,h):bd(r,d,h,u)}switch(o){case"input":ic(r,s);break;case"textarea":Mm(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?as(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?as(r,!!s.multiple,s.defaultValue,!0):as(r,!!s.multiple,s.multiple?[]:"",!1))}r[ya]=s}catch(_){ft(t,t.return,_)}}break;case 6:if(wn(e,t),Bn(t),i&4){if(t.stateNode===null)throw Error(te(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(_){ft(t,t.return,_)}}break;case 3:if(wn(e,t),Bn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ma(e.containerInfo)}catch(_){ft(t,t.return,_)}break;case 4:wn(e,t),Bn(t);break;case 13:wn(e,t),Bn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(uf=ht())),i&4&&Vh(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(Bt=(u=Bt)||d,wn(e,t),Bt=u):wn(e,t),Bn(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!d&&t.mode&1)for(he=t,d=t.child;d!==null;){for(h=he=d;he!==null;){switch(f=he,p=f.child,f.tag){case 0:case 11:case 14:case 15:aa(4,f,f.return);break;case 1:is(f,f.return);var x=f.stateNode;if(typeof x.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(_){ft(i,n,_)}}break;case 5:is(f,f.return);break;case 22:if(f.memoizedState!==null){Wh(h);continue}}p!==null?(p.return=f,he=p):Wh(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{r=h.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=h.stateNode,l=h.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=Tm("display",a))}catch(_){ft(t,t.return,_)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(_){ft(t,t.return,_)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:wn(e,t),Bn(t),i&4&&Vh(t);break;case 21:break;default:wn(e,t),Bn(t)}}function Bn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(Zg(n)){var i=n;break e}n=n.return}throw Error(te(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(da(r,""),i.flags&=-33);var s=Hh(t);Oc(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Hh(t);kc(t,o,a);break;default:throw Error(te(161))}}catch(l){ft(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function mx(t,e,n){he=t,e0(t)}function e0(t,e,n){for(var i=(t.mode&1)!==0;he!==null;){var r=he,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||no;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||Bt;o=no;var u=Bt;if(no=a,(Bt=l)&&!u)for(he=r;he!==null;)a=he,l=a.child,a.tag===22&&a.memoizedState!==null?jh(r):l!==null?(l.return=a,he=l):jh(r);for(;s!==null;)he=s,e0(s),s=s.sibling;he=r,no=o,Bt=u}Gh(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,he=s):Gh(t)}}function Gh(t){for(;he!==null;){var e=he;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Bt||Dl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Bt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Rn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Ch(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Ch(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&ma(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(te(163))}Bt||e.flags&512&&Fc(e)}catch(f){ft(e,e.return,f)}}if(e===t){he=null;break}if(n=e.sibling,n!==null){n.return=e.return,he=n;break}he=e.return}}function Wh(t){for(;he!==null;){var e=he;if(e===t){he=null;break}var n=e.sibling;if(n!==null){n.return=e.return,he=n;break}he=e.return}}function jh(t){for(;he!==null;){var e=he;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Dl(4,e)}catch(l){ft(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){ft(e,r,l)}}var s=e.return;try{Fc(e)}catch(l){ft(e,s,l)}break;case 5:var a=e.return;try{Fc(e)}catch(l){ft(e,a,l)}}}catch(l){ft(e,e.return,l)}if(e===t){he=null;break}var o=e.sibling;if(o!==null){o.return=e.return,he=o;break}he=e.return}}var gx=Math.ceil,fl=xi.ReactCurrentDispatcher,of=xi.ReactCurrentOwner,yn=xi.ReactCurrentBatchConfig,je=0,Rt=null,yt=null,Nt=0,an=0,rs=Yi(0),Et=0,Aa=null,Mr=0,Ul=0,lf=0,oa=null,$t=null,uf=0,Ss=1/0,si=null,hl=!1,Bc=null,zi=null,io=!1,Ui=null,pl=0,la=0,zc=null,Oo=-1,Bo=0;function Gt(){return je&6?ht():Oo!==-1?Oo:Oo=ht()}function Hi(t){return t.mode&1?je&2&&Nt!==0?Nt&-Nt:J_.transition!==null?(Bo===0&&(Bo=Om()),Bo):(t=Qe,t!==0||(t=window.event,t=t===void 0?16:jm(t.type)),t):1}function In(t,e,n,i){if(50<la)throw la=0,zc=null,Error(te(185));Pa(t,n,i),(!(je&2)||t!==Rt)&&(t===Rt&&(!(je&2)&&(Ul|=n),Et===4&&Li(t,Nt)),Jt(t,i),n===1&&je===0&&!(e.mode&1)&&(Ss=ht()+500,Pl&&Ki()))}function Jt(t,e){var n=t.callbackNode;Jv(t,e);var i=Zo(t,t===Rt?Nt:0);if(i===0)n!==null&&eh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&eh(n),e===1)t.tag===0?Q_(Xh.bind(null,t)):cg(Xh.bind(null,t)),$_(function(){!(je&6)&&Ki()}),n=null;else{switch(Bm(i)){case 1:n=Ud;break;case 4:n=Fm;break;case 16:n=Ko;break;case 536870912:n=km;break;default:n=Ko}n=l0(n,t0.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function t0(t,e){if(Oo=-1,Bo=0,je&6)throw Error(te(327));var n=t.callbackNode;if(ds()&&t.callbackNode!==n)return null;var i=Zo(t,t===Rt?Nt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=ml(t,i);else{e=i;var r=je;je|=2;var s=i0();(Rt!==t||Nt!==e)&&(si=null,Ss=ht()+500,vr(t,e));do try{xx();break}catch(o){n0(t,o)}while(!0);qd(),fl.current=s,je=r,yt!==null?e=0:(Rt=null,Nt=0,e=Et)}if(e!==0){if(e===2&&(r=hc(t),r!==0&&(i=r,e=Hc(t,r))),e===1)throw n=Aa,vr(t,0),Li(t,i),Jt(t,ht()),n;if(e===6)Li(t,i);else{if(r=t.current.alternate,!(i&30)&&!vx(r)&&(e=ml(t,i),e===2&&(s=hc(t),s!==0&&(i=s,e=Hc(t,s))),e===1))throw n=Aa,vr(t,0),Li(t,i),Jt(t,ht()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(te(345));case 2:or(t,$t,si);break;case 3:if(Li(t,i),(i&130023424)===i&&(e=uf+500-ht(),10<e)){if(Zo(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){Gt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Sc(or.bind(null,t,$t,si),e);break}or(t,$t,si);break;case 4:if(Li(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Un(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=ht()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*gx(i/1960))-i,10<i){t.timeoutHandle=Sc(or.bind(null,t,$t,si),i);break}or(t,$t,si);break;case 5:or(t,$t,si);break;default:throw Error(te(329))}}}return Jt(t,ht()),t.callbackNode===n?t0.bind(null,t):null}function Hc(t,e){var n=oa;return t.current.memoizedState.isDehydrated&&(vr(t,e).flags|=256),t=ml(t,e),t!==2&&(e=$t,$t=n,e!==null&&Vc(e)),t}function Vc(t){$t===null?$t=t:$t.push.apply($t,t)}function vx(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Fn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Li(t,e){for(e&=~lf,e&=~Ul,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Un(e),i=1<<n;t[n]=-1,e&=~i}}function Xh(t){if(je&6)throw Error(te(327));ds();var e=Zo(t,0);if(!(e&1))return Jt(t,ht()),null;var n=ml(t,e);if(t.tag!==0&&n===2){var i=hc(t);i!==0&&(e=i,n=Hc(t,i))}if(n===1)throw n=Aa,vr(t,0),Li(t,e),Jt(t,ht()),n;if(n===6)throw Error(te(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,or(t,$t,si),Jt(t,ht()),null}function cf(t,e){var n=je;je|=1;try{return t(e)}finally{je=n,je===0&&(Ss=ht()+500,Pl&&Ki())}}function Er(t){Ui!==null&&Ui.tag===0&&!(je&6)&&ds();var e=je;je|=1;var n=yn.transition,i=Qe;try{if(yn.transition=null,Qe=1,t)return t()}finally{Qe=i,yn.transition=n,je=e,!(je&6)&&Ki()}}function df(){an=rs.current,it(rs)}function vr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,q_(n)),yt!==null)for(n=yt.return;n!==null;){var i=n;switch(Wd(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&nl();break;case 3:xs(),it(Zt),it(zt),Jd();break;case 5:Qd(i);break;case 4:xs();break;case 13:it(at);break;case 19:it(at);break;case 10:$d(i.type._context);break;case 22:case 23:df()}n=n.return}if(Rt=t,yt=t=Vi(t.current,null),Nt=an=e,Et=0,Aa=null,lf=Ul=Mr=0,$t=oa=null,hr!==null){for(e=0;e<hr.length;e++)if(n=hr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}hr=null}return t}function n0(t,e){do{var n=yt;try{if(qd(),Io.current=dl,cl){for(var i=ot.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}cl=!1}if(Sr=0,Ct=St=ot=null,sa=!1,Ea=0,of.current=null,n===null||n.return===null){Et=1,Aa=e,yt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=Nt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,d=o,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=Dh(a);if(p!==null){p.flags&=-257,Uh(p,a,o,s,e),p.mode&1&&Nh(s,u,e),e=p,l=u;var x=e.updateQueue;if(x===null){var _=new Set;_.add(l),e.updateQueue=_}else x.add(l);break e}else{if(!(e&1)){Nh(s,u,e),ff();break e}l=Error(te(426))}}else if(rt&&o.mode&1){var m=Dh(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),Uh(m,a,o,s,e),jd(ys(l,o));break e}}s=l=ys(l,o),Et!==4&&(Et=2),oa===null?oa=[s]:oa.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var c=Bg(s,l,e);Ah(s,c);break e;case 1:o=l;var v=s.type,g=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(zi===null||!zi.has(g)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=zg(s,o,e);Ah(s,y);break e}}s=s.return}while(s!==null)}s0(n)}catch(b){e=b,yt===n&&n!==null&&(yt=n=n.return);continue}break}while(!0)}function i0(){var t=fl.current;return fl.current=dl,t===null?dl:t}function ff(){(Et===0||Et===3||Et===2)&&(Et=4),Rt===null||!(Mr&268435455)&&!(Ul&268435455)||Li(Rt,Nt)}function ml(t,e){var n=je;je|=2;var i=i0();(Rt!==t||Nt!==e)&&(si=null,vr(t,e));do try{_x();break}catch(r){n0(t,r)}while(!0);if(qd(),je=n,fl.current=i,yt!==null)throw Error(te(261));return Rt=null,Nt=0,Et}function _x(){for(;yt!==null;)r0(yt)}function xx(){for(;yt!==null&&!Wv();)r0(yt)}function r0(t){var e=o0(t.alternate,t,an);t.memoizedProps=t.pendingProps,e===null?s0(t):yt=e,of.current=null}function s0(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=fx(n,e),n!==null){n.flags&=32767,yt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Et=6,yt=null;return}}else if(n=dx(n,e,an),n!==null){yt=n;return}if(e=e.sibling,e!==null){yt=e;return}yt=e=t}while(e!==null);Et===0&&(Et=5)}function or(t,e,n){var i=Qe,r=yn.transition;try{yn.transition=null,Qe=1,yx(t,e,n,i)}finally{yn.transition=r,Qe=i}return null}function yx(t,e,n,i){do ds();while(Ui!==null);if(je&6)throw Error(te(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(te(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(e_(t,s),t===Rt&&(yt=Rt=null,Nt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||io||(io=!0,l0(Ko,function(){return ds(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=yn.transition,yn.transition=null;var a=Qe;Qe=1;var o=je;je|=4,of.current=null,px(t,n),Jg(n,t),z_(xc),Qo=!!_c,xc=_c=null,t.current=n,mx(n),jv(),je=o,Qe=a,yn.transition=s}else t.current=n;if(io&&(io=!1,Ui=t,pl=r),s=t.pendingLanes,s===0&&(zi=null),$v(n.stateNode),Jt(t,ht()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(hl)throw hl=!1,t=Bc,Bc=null,t;return pl&1&&t.tag!==0&&ds(),s=t.pendingLanes,s&1?t===zc?la++:(la=0,zc=t):la=0,Ki(),null}function ds(){if(Ui!==null){var t=Bm(pl),e=yn.transition,n=Qe;try{if(yn.transition=null,Qe=16>t?16:t,Ui===null)var i=!1;else{if(t=Ui,Ui=null,pl=0,je&6)throw Error(te(331));var r=je;for(je|=4,he=t.current;he!==null;){var s=he,a=s.child;if(he.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var u=o[l];for(he=u;he!==null;){var d=he;switch(d.tag){case 0:case 11:case 15:aa(8,d,s)}var h=d.child;if(h!==null)h.return=d,he=h;else for(;he!==null;){d=he;var f=d.sibling,p=d.return;if(Kg(d),d===u){he=null;break}if(f!==null){f.return=p,he=f;break}he=p}}}var x=s.alternate;if(x!==null){var _=x.child;if(_!==null){x.child=null;do{var m=_.sibling;_.sibling=null,_=m}while(_!==null)}}he=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,he=a;else e:for(;he!==null;){if(s=he,s.flags&2048)switch(s.tag){case 0:case 11:case 15:aa(9,s,s.return)}var c=s.sibling;if(c!==null){c.return=s.return,he=c;break e}he=s.return}}var v=t.current;for(he=v;he!==null;){a=he;var g=a.child;if(a.subtreeFlags&2064&&g!==null)g.return=a,he=g;else e:for(a=v;he!==null;){if(o=he,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:Dl(9,o)}}catch(b){ft(o,o.return,b)}if(o===a){he=null;break e}var y=o.sibling;if(y!==null){y.return=o.return,he=y;break e}he=o.return}}if(je=r,Ki(),jn&&typeof jn.onPostCommitFiberRoot=="function")try{jn.onPostCommitFiberRoot(Tl,t)}catch{}i=!0}return i}finally{Qe=n,yn.transition=e}}return!1}function qh(t,e,n){e=ys(n,e),e=Bg(t,e,1),t=Bi(t,e,1),e=Gt(),t!==null&&(Pa(t,1,e),Jt(t,e))}function ft(t,e,n){if(t.tag===3)qh(t,t,n);else for(;e!==null;){if(e.tag===3){qh(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(zi===null||!zi.has(i))){t=ys(n,t),t=zg(e,t,1),e=Bi(e,t,1),t=Gt(),e!==null&&(Pa(e,1,t),Jt(e,t));break}}e=e.return}}function Sx(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=Gt(),t.pingedLanes|=t.suspendedLanes&n,Rt===t&&(Nt&n)===n&&(Et===4||Et===3&&(Nt&130023424)===Nt&&500>ht()-uf?vr(t,0):lf|=n),Jt(t,e)}function a0(t,e){e===0&&(t.mode&1?(e=qa,qa<<=1,!(qa&130023424)&&(qa=4194304)):e=1);var n=Gt();t=gi(t,e),t!==null&&(Pa(t,e,n),Jt(t,n))}function Mx(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),a0(t,n)}function Ex(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(te(314))}i!==null&&i.delete(e),a0(t,n)}var o0;o0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Zt.current)Kt=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return Kt=!1,cx(t,e,n);Kt=!!(t.flags&131072)}else Kt=!1,rt&&e.flags&1048576&&dg(e,sl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;ko(t,e),t=e.pendingProps;var r=gs(e,zt.current);cs(e,n),r=tf(null,e,i,t,r,n);var s=nf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Qt(i)?(s=!0,il(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Kd(e),r.updater=Nl,e.stateNode=r,r._reactInternals=e,Rc(e,i,t,n),e=Lc(null,e,i,!0,s,n)):(e.tag=0,rt&&s&&Gd(e),Vt(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(ko(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Tx(i),t=Rn(i,t),r){case 0:e=Pc(null,e,i,t,n);break e;case 1:e=kh(null,e,i,t,n);break e;case 11:e=Ih(null,e,i,t,n);break e;case 14:e=Fh(null,e,i,Rn(i.type,t),n);break e}throw Error(te(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Rn(i,r),Pc(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Rn(i,r),kh(t,e,i,r,n);case 3:e:{if(Wg(e),t===null)throw Error(te(387));i=e.pendingProps,s=e.memoizedState,r=s.element,vg(t,e),ll(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=ys(Error(te(423)),e),e=Oh(t,e,i,n,r);break e}else if(i!==r){r=ys(Error(te(424)),e),e=Oh(t,e,i,n,r);break e}else for(on=Oi(e.stateNode.containerInfo.firstChild),ln=e,rt=!0,Ln=null,n=mg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(vs(),i===r){e=vi(t,e,n);break e}Vt(t,e,i,n)}e=e.child}return e;case 5:return _g(e),t===null&&Tc(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,yc(i,r)?a=null:s!==null&&yc(i,s)&&(e.flags|=32),Gg(t,e),Vt(t,e,a,n),e.child;case 6:return t===null&&Tc(e),null;case 13:return jg(t,e,n);case 4:return Zd(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=_s(e,null,i,n):Vt(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Rn(i,r),Ih(t,e,i,r,n);case 7:return Vt(t,e,e.pendingProps,n),e.child;case 8:return Vt(t,e,e.pendingProps.children,n),e.child;case 12:return Vt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,et(al,i._currentValue),i._currentValue=a,s!==null)if(Fn(s.value,a)){if(s.children===r.children&&!Zt.current){e=vi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=fi(-1,n&-n),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?l.next=l:(l.next=d.next,d.next=l),u.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Ac(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(te(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Ac(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}Vt(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,cs(e,n),r=Sn(r),i=i(r),e.flags|=1,Vt(t,e,i,n),e.child;case 14:return i=e.type,r=Rn(i,e.pendingProps),r=Rn(i.type,r),Fh(t,e,i,r,n);case 15:return Hg(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Rn(i,r),ko(t,e),e.tag=1,Qt(i)?(t=!0,il(e)):t=!1,cs(e,n),Og(e,i,r),Rc(e,i,r,n),Lc(null,e,i,!0,t,n);case 19:return Xg(t,e,n);case 22:return Vg(t,e,n)}throw Error(te(156,e.tag))};function l0(t,e){return Im(t,e)}function wx(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vn(t,e,n,i){return new wx(t,e,n,i)}function hf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Tx(t){if(typeof t=="function")return hf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Ld)return 11;if(t===Nd)return 14}return 2}function Vi(t,e){var n=t.alternate;return n===null?(n=vn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function zo(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")hf(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case $r:return _r(n.children,r,s,e);case Pd:a=8,r|=8;break;case Qu:return t=vn(12,n,e,r|2),t.elementType=Qu,t.lanes=s,t;case Ju:return t=vn(13,n,e,r),t.elementType=Ju,t.lanes=s,t;case ec:return t=vn(19,n,e,r),t.elementType=ec,t.lanes=s,t;case _m:return Il(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case gm:a=10;break e;case vm:a=9;break e;case Ld:a=11;break e;case Nd:a=14;break e;case Ri:a=16,i=null;break e}throw Error(te(130,t==null?t:typeof t,""))}return e=vn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function _r(t,e,n,i){return t=vn(7,t,i,e),t.lanes=n,t}function Il(t,e,n,i){return t=vn(22,t,i,e),t.elementType=_m,t.lanes=n,t.stateNode={isHidden:!1},t}function yu(t,e,n){return t=vn(6,t,null,e),t.lanes=n,t}function Su(t,e,n){return e=vn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Ax(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=tu(0),this.expirationTimes=tu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=tu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function pf(t,e,n,i,r,s,a,o,l){return t=new Ax(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=vn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Kd(s),t}function Cx(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:qr,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function u0(t){if(!t)return Xi;t=t._reactInternals;e:{if(Cr(t)!==t||t.tag!==1)throw Error(te(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Qt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(te(171))}if(t.tag===1){var n=t.type;if(Qt(n))return ug(t,n,e)}return e}function c0(t,e,n,i,r,s,a,o,l){return t=pf(n,i,!0,t,r,s,a,o,l),t.context=u0(null),n=t.current,i=Gt(),r=Hi(n),s=fi(i,r),s.callback=e??null,Bi(n,s,r),t.current.lanes=r,Pa(t,r,i),Jt(t,i),t}function Fl(t,e,n,i){var r=e.current,s=Gt(),a=Hi(r);return n=u0(n),e.context===null?e.context=n:e.pendingContext=n,e=fi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Bi(r,e,a),t!==null&&(In(t,r,a,s),Uo(t,r,a)),a}function gl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function $h(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function mf(t,e){$h(t,e),(t=t.alternate)&&$h(t,e)}function Rx(){return null}var d0=typeof reportError=="function"?reportError:function(t){console.error(t)};function gf(t){this._internalRoot=t}kl.prototype.render=gf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(te(409));Fl(t,e,null,null)};kl.prototype.unmount=gf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Er(function(){Fl(null,t,null,null)}),e[mi]=null}};function kl(t){this._internalRoot=t}kl.prototype.unstable_scheduleHydration=function(t){if(t){var e=Vm();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Pi.length&&e!==0&&e<Pi[n].priority;n++);Pi.splice(n,0,t),n===0&&Wm(t)}};function vf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Ol(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Yh(){}function bx(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=gl(a);s.call(u)}}var a=c0(e,i,t,0,null,!1,!1,"",Yh);return t._reactRootContainer=a,t[mi]=a.current,_a(t.nodeType===8?t.parentNode:t),Er(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var u=gl(l);o.call(u)}}var l=pf(t,0,!1,null,null,!1,!1,"",Yh);return t._reactRootContainer=l,t[mi]=l.current,_a(t.nodeType===8?t.parentNode:t),Er(function(){Fl(e,l,n,i)}),l}function Bl(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=gl(a);o.call(l)}}Fl(e,a,t,r)}else a=bx(n,e,t,r,i);return gl(a)}zm=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ks(e.pendingLanes);n!==0&&(Id(e,n|1),Jt(e,ht()),!(je&6)&&(Ss=ht()+500,Ki()))}break;case 13:Er(function(){var i=gi(t,1);if(i!==null){var r=Gt();In(i,t,1,r)}}),mf(t,1)}};Fd=function(t){if(t.tag===13){var e=gi(t,134217728);if(e!==null){var n=Gt();In(e,t,134217728,n)}mf(t,134217728)}};Hm=function(t){if(t.tag===13){var e=Hi(t),n=gi(t,e);if(n!==null){var i=Gt();In(n,t,e,i)}mf(t,e)}};Vm=function(){return Qe};Gm=function(t,e){var n=Qe;try{return Qe=t,e()}finally{Qe=n}};cc=function(t,e,n){switch(e){case"input":if(ic(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=bl(i);if(!r)throw Error(te(90));ym(i),ic(i,r)}}}break;case"textarea":Mm(t,n);break;case"select":e=n.value,e!=null&&as(t,!!n.multiple,e,!1)}};bm=cf;Pm=Er;var Px={usingClientEntryPoint:!1,Events:[Na,Qr,bl,Cm,Rm,cf]},zs={findFiberByHostInstance:fr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Lx={bundleType:zs.bundleType,version:zs.version,rendererPackageName:zs.rendererPackageName,rendererConfig:zs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:xi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Dm(t),t===null?null:t.stateNode},findFiberByHostInstance:zs.findFiberByHostInstance||Rx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ro=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ro.isDisabled&&ro.supportsFiber)try{Tl=ro.inject(Lx),jn=ro}catch{}}cn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Px;cn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!vf(e))throw Error(te(200));return Cx(t,e,null,n)};cn.createRoot=function(t,e){if(!vf(t))throw Error(te(299));var n=!1,i="",r=d0;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=pf(t,1,!1,null,null,n,!1,i,r),t[mi]=e.current,_a(t.nodeType===8?t.parentNode:t),new gf(e)};cn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(te(188)):(t=Object.keys(t).join(","),Error(te(268,t)));return t=Dm(e),t=t===null?null:t.stateNode,t};cn.flushSync=function(t){return Er(t)};cn.hydrate=function(t,e,n){if(!Ol(e))throw Error(te(200));return Bl(null,t,e,!0,n)};cn.hydrateRoot=function(t,e,n){if(!vf(t))throw Error(te(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=d0;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=c0(e,null,t,1,n??null,r,!1,s,a),t[mi]=e.current,_a(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new kl(e)};cn.render=function(t,e,n){if(!Ol(e))throw Error(te(200));return Bl(null,t,e,!1,n)};cn.unmountComponentAtNode=function(t){if(!Ol(t))throw Error(te(40));return t._reactRootContainer?(Er(function(){Bl(null,null,t,!1,function(){t._reactRootContainer=null,t[mi]=null})}),!0):!1};cn.unstable_batchedUpdates=cf;cn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Ol(n))throw Error(te(200));if(t==null||t._reactInternals===void 0)throw Error(te(38));return Bl(t,e,n,!1,i)};cn.version="18.3.1-next-f1338f8080-20240426";function f0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f0)}catch(t){console.error(t)}}f0(),fm.exports=cn;var Nx=fm.exports,h0,Kh=Nx;h0=Kh.createRoot,Kh.hydrateRoot;const p0="topbins:users",zl="topbins:session";function Hl(){try{return JSON.parse(localStorage.getItem(p0))||{}}catch{return{}}}function m0(t){localStorage.setItem(p0,JSON.stringify(t))}async function g0(t,e){const n=new TextEncoder().encode(`${e}:${t}`),i=await crypto.subtle.digest("SHA-256",n);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}function Dx(){const t=crypto.getRandomValues(new Uint8Array(16));return Array.from(t).map(e=>e.toString(16).padStart(2,"0")).join("")}function Vl(t){const{passwordHash:e,salt:n,...i}=t;return i}async function Ux({username:t,displayName:e,password:n}){const i=String(t||"").trim().toLowerCase();if(!/^[a-z0-9_]{3,20}$/.test(i))throw new Error("Username: 3–20 letters, numbers or underscores.");if(String(n||"").length<6)throw new Error("Password needs at least 6 characters.");const r=Hl();if(r[i])throw new Error("That username is taken — try another.");const s=Dx(),a={username:i,displayName:String(e||"").trim()||i,salt:s,passwordHash:await g0(n,s),createdAt:Date.now(),savedPitchIds:[],kickabouts:[],squads:[]};return r[i]=a,m0(r),localStorage.setItem(zl,i),Vl(a)}async function Ix({username:t,password:e}){const n=String(t||"").trim().toLowerCase(),r=Hl()[n];if(!r)throw new Error("No account with that username.");if(await g0(e,r.salt)!==r.passwordHash)throw new Error("Wrong password.");return localStorage.setItem(zl,n),Vl(r)}function Fx(){localStorage.removeItem(zl)}function Zh(){const t=localStorage.getItem(zl);if(!t)return null;const e=Hl()[t];return e?Vl(e):null}function Hs(t,e){const n=Hl(),i=n[t];return i?(Object.assign(i,e),m0(n),Vl(i)):null}const hi={powerleague:{label:"Powerleague",emoji:"🏟️",color:"#16a34a",blurb:"Commercial 5/7-a-side centres. Caged, floodlit, bookable by the hour."},goals:{label:"Goals",emoji:"🥅",color:"#0284c7",blurb:"Goals Football centres — arena pitches, leagues and casual hire."},park:{label:"Park pitch",emoji:"🌳",color:"#65a30d",blurb:"Open grass and astro in London parks. Often free, first come first served."},cage:{label:"Cage / MUGA",emoji:"🔩",color:"#d97706",blurb:"Free caged courts and multi-use games areas. Small-sided street football."},leisure:{label:"Leisure centre",emoji:"🏢",color:"#7c3aed",blurb:"Council leisure-centre pitches — bookable astro and sports halls."},community:{label:"Community hub",emoji:"🤝",color:"#db2777",blurb:"Foundation and community club hubs with bookable pitches."}},_f=[{id:"pl-shoreditch",name:"Powerleague Shoreditch",type:"powerleague",area:"Shoreditch",borough:"Hackney",lat:51.5262,lng:-.0817,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:78,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["rooftop pitches","leagues","bar on site"]},{id:"pl-vauxhall",name:"Powerleague Vauxhall",type:"powerleague",area:"Vauxhall",borough:"Lambeth",lat:51.4832,lng:-.1223,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:75,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["under the arches","central","leagues"]},{id:"pl-wembley",name:"Powerleague Wembley",type:"powerleague",area:"Wembley",borough:"Brent",lat:51.5567,lng:-.2818,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:68,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["in the shadow of the arch","parking"]},{id:"pl-millhill",name:"Powerleague Mill Hill",type:"powerleague",area:"Mill Hill",borough:"Barnet",lat:51.6113,lng:-.2452,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:62,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["parking","leagues"]},{id:"pl-barnet",name:"Powerleague Barnet",type:"powerleague",area:"New Barnet",borough:"Barnet",lat:51.6444,lng:-.1743,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:60,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["parking","kids parties"]},{id:"pl-croydon",name:"Powerleague Croydon",type:"powerleague",area:"Purley Way",borough:"Croydon",lat:51.3629,lng:-.1183,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:58,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["parking","leagues"]},{id:"pl-canarywharf",name:"Powerleague Canary Wharf",type:"powerleague",area:"Canary Wharf",borough:"Tower Hamlets",lat:51.4986,lng:-.0184,enclosure:"bounded",surface:"3G turf",formats:[5],pricePerHour:80,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["after-work games","city views"]},{id:"go-beckenham",name:"Goals Beckenham",type:"goals",area:"Beckenham",borough:"Bromley",lat:51.3987,lng:-.0256,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:60,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking","clubhouse"]},{id:"go-bexleyheath",name:"Goals Bexleyheath",type:"goals",area:"Bexleyheath",borough:"Bexley",lat:51.4638,lng:.1462,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:56,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking"]},{id:"go-dagenham",name:"Goals Dagenham",type:"goals",area:"Dagenham",borough:"Barking & Dagenham",lat:51.5606,lng:.1487,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:54,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking"]},{id:"go-ruislip",name:"Goals Ruislip",type:"goals",area:"Ruislip",borough:"Hillingdon",lat:51.5732,lng:-.4211,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:55,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking"]},{id:"go-hayes",name:"Goals Hayes",type:"goals",area:"Hayes",borough:"Hillingdon",lat:51.5027,lng:-.4194,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:54,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking"]},{id:"go-gillettecorner",name:"Goals Gillette Corner",type:"goals",area:"Isleworth",borough:"Hounslow",lat:51.4826,lng:-.3282,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:58,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking","west London"]},{id:"go-chingford",name:"Goals Chingford",type:"goals",area:"Chingford",borough:"Waltham Forest",lat:51.6156,lng:.0092,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:55,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking"]},{id:"go-sutton",name:"Goals Sutton",type:"goals",area:"Sutton",borough:"Sutton",lat:51.3664,lng:-.2076,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:54,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["leagues","parking"]},{id:"pk-hackneymarshes",name:"Hackney Marshes",type:"park",area:"Hackney Wick",borough:"Hackney",lat:51.5566,lng:-.0295,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!0,bookable:!0,tags:["spiritual home of Sunday league","80+ pitches","legendary"]},{id:"pk-regents",name:"Regent's Park Hub",type:"park",area:"Regent's Park",borough:"Camden",lat:51.5313,lng:-.157,enclosure:"unbounded",surface:"Grass",formats:[5,7,11],pricePerHour:12,floodlit:!1,indoor:!1,changingRooms:!0,bookable:!0,tags:["central","beautiful setting","the Hub café"]},{id:"pk-victoria",name:"Victoria Park pitches",type:"park",area:"Victoria Park",borough:"Tower Hamlets",lat:51.5362,lng:-.043,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["east London classic","jumpers for goalposts"]},{id:"pk-clapham",name:"Clapham Common pitches",type:"park",area:"Clapham",borough:"Lambeth",lat:51.4577,lng:-.15,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["casual kickabouts everywhere","summer classic"]},{id:"pk-wormwood",name:"Wormwood Scrubs pitches",type:"park",area:"East Acton",borough:"Hammersmith & Fulham",lat:51.5183,lng:-.2385,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!0,bookable:!0,tags:["huge open space","Sunday league"]},{id:"pk-finsbury",name:"Finsbury Park pitches",type:"park",area:"Finsbury Park",borough:"Haringey",lat:51.5687,lng:-.1044,enclosure:"unbounded",surface:"Grass + astro",formats:[5,7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!0,tags:["north London staple"]},{id:"pk-burgess",name:"Burgess Park pitches",type:"park",area:"Walworth",borough:"Southwark",lat:51.4839,lng:-.0817,enclosure:"unbounded",surface:"Grass + astro",formats:[5,7],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["BMX track next door","casual games"]},{id:"pk-tootingbec",name:"Tooting Bec Common",type:"park",area:"Tooting",borough:"Wandsworth",lat:51.4324,lng:-.1512,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["south London Sundays"]},{id:"pk-southwark",name:"Southwark Park pitches",type:"park",area:"Rotherhithe",borough:"Southwark",lat:51.4934,lng:-.051,enclosure:"unbounded",surface:"Astro",formats:[5,7],pricePerHour:10,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["floodlit astro","cheap"]},{id:"pk-mableygreen",name:"Mabley Green",type:"park",area:"Homerton",borough:"Hackney",lat:51.551,lng:-.0367,enclosure:"unbounded",surface:"3G turf",formats:[7,11],pricePerHour:15,floodlit:!0,indoor:!1,changingRooms:!1,bookable:!0,tags:["full-size 3G","floodlit"]},{id:"pk-wandsworth",name:"Wandsworth Common pitches",type:"park",area:"Wandsworth",borough:"Wandsworth",lat:51.4487,lng:-.1745,enclosure:"unbounded",surface:"Grass",formats:[7],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["casual kickabouts"]},{id:"pk-hampstead",name:"Hampstead Heath Extension",type:"park",area:"Hampstead",borough:"Camden",lat:51.568,lng:-.183,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["scenic","weekend games"]},{id:"pk-greenwich",name:"Greenwich Park pitches",type:"park",area:"Greenwich",borough:"Greenwich",lat:51.4769,lng:5e-4,enclosure:"unbounded",surface:"Grass",formats:[5,7],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["views from the hill"]},{id:"cg-marketroad",name:"Market Road Football Cages",type:"cage",area:"Caledonian Road",borough:"Islington",lat:51.5461,lng:-.1198,enclosure:"bounded",surface:"Astro",formats:[5,7],pricePerHour:0,floodlit:!0,indoor:!1,changingRooms:!1,bookable:!0,tags:["famous pickup scene","winner stays on"]},{id:"cg-haggerston",name:"Haggerston Park MUGA",type:"cage",area:"Haggerston",borough:"Hackney",lat:51.5325,lng:-.0703,enclosure:"bounded",surface:"Tarmac",formats:[5],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["street football","free"]},{id:"cg-shoreditchpark",name:"Shoreditch Park cage",type:"cage",area:"Hoxton",borough:"Hackney",lat:51.5355,lng:-.085,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["classic cage","winner stays on"]},{id:"cg-kennington",name:"Kennington Park MUGA",type:"cage",area:"Kennington",borough:"Lambeth",lat:51.4835,lng:-.1077,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:0,floodlit:!0,indoor:!1,changingRooms:!1,bookable:!1,tags:["floodlit","pickup games"]},{id:"cg-meathgardens",name:"Meath Gardens cage",type:"cage",area:"Bethnal Green",borough:"Tower Hamlets",lat:51.5263,lng:-.0447,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["east London cage culture"]},{id:"cg-paradisepark",name:"Paradise Park cage",type:"cage",area:"Holloway",borough:"Islington",lat:51.5527,lng:-.112,enclosure:"bounded",surface:"Tarmac",formats:[5],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["street football"]},{id:"cg-brixton",name:"Brockwell Park MUGA",type:"cage",area:"Brixton",borough:"Lambeth",lat:51.452,lng:-.109,enclosure:"bounded",surface:"Tarmac",formats:[5],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["free","south London"]},{id:"cg-mileend-cage",name:"Mile End Park cage",type:"cage",area:"Mile End",borough:"Tower Hamlets",lat:51.5203,lng:-.0345,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:0,floodlit:!1,indoor:!1,changingRooms:!1,bookable:!1,tags:["canal-side","free"]},{id:"lc-westway",name:"Westway Sports Centre",type:"leisure",area:"Ladbroke Grove",borough:"Kensington & Chelsea",lat:51.5202,lng:-.2135,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:50,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["under the flyover","iconic west London"]},{id:"lc-mileend",name:"Mile End Leisure Centre",type:"leisure",area:"Mile End",borough:"Tower Hamlets",lat:51.5187,lng:-.0331,enclosure:"unbounded",surface:"Astro",formats:[5,7,11],pricePerHour:45,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["athletics stadium","full-size astro"]},{id:"lc-batterseamillennium",name:"Battersea Park Millennium Arena",type:"leisure",area:"Battersea",borough:"Wandsworth",lat:51.4805,lng:-.15,enclosure:"unbounded",surface:"Astro",formats:[5,7],pricePerHour:48,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["riverside park","floodlit"]},{id:"lc-paddingtonrec",name:"Paddington Recreation Ground",type:"leisure",area:"Maida Vale",borough:"Westminster",lat:51.5292,lng:-.1868,enclosure:"unbounded",surface:"Astro + grass",formats:[5,7,11],pricePerHour:46,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["historic ground","well kept"]},{id:"lc-talacre",name:"Talacre Community Sports Centre",type:"leisure",area:"Kentish Town",borough:"Camden",lat:51.5461,lng:-.1466,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:40,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["neighbourhood favourite"]},{id:"lc-crystalpalace",name:"Crystal Palace National Sports Centre",type:"leisure",area:"Crystal Palace",borough:"Bromley",lat:51.42,lng:-.0685,enclosure:"unbounded",surface:"Astro + grass",formats:[5,7,11],pricePerHour:44,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["historic athletics venue"]},{id:"lc-leevalley",name:"Lee Valley Hockey & Tennis Centre pitches",type:"leisure",area:"Stratford",borough:"Waltham Forest",lat:51.5533,lng:-.0166,enclosure:"unbounded",surface:"Astro",formats:[5,7],pricePerHour:42,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["Olympic park","quality surfaces"]},{id:"lc-morden",name:"Morden Park Playing Fields",type:"leisure",area:"Morden",borough:"Merton",lat:51.3898,lng:-.207,enclosure:"unbounded",surface:"Grass",formats:[7,11],pricePerHour:30,floodlit:!1,indoor:!1,changingRooms:!0,bookable:!0,tags:["Sunday league","parking"]},{id:"cm-blackprince",name:"Black Prince Trust Hub",type:"community",area:"Kennington",borough:"Lambeth",lat:51.49,lng:-.113,enclosure:"bounded",surface:"3G turf",formats:[5,7],pricePerHour:35,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["community trust","great value"]},{id:"cm-salmon",name:"Salmon Youth Centre",type:"community",area:"Bermondsey",borough:"Southwark",lat:51.498,lng:-.064,enclosure:"bounded",surface:"Sports hall + astro",formats:[5],pricePerHour:30,floodlit:!0,indoor:!0,changingRooms:!0,bookable:!0,tags:["indoor option","youth focused"]},{id:"cm-bromleybow",name:"Bromley by Bow Centre pitch",type:"community",area:"Bromley-by-Bow",borough:"Tower Hamlets",lat:51.523,lng:-.0117,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:28,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["community centre","great value"]},{id:"cm-stowefc",name:"The Stowe Centre pitch",type:"community",area:"Westbourne Park",borough:"Westminster",lat:51.5218,lng:-.201,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:32,floodlit:!0,indoor:!1,changingRooms:!0,bookable:!0,tags:["community centre"]},{id:"cm-coram",name:"Coram's Fields pitches",type:"community",area:"Bloomsbury",borough:"Camden",lat:51.5237,lng:-.12,enclosure:"bounded",surface:"Astro",formats:[5],pricePerHour:25,floodlit:!0,indoor:!1,changingRooms:!1,bookable:!0,tags:["central","historic charity"]}];function xf(t){return _f.find(e=>e.id===t)||null}const kx=6371;function Ox(t,e){const n=l=>l*Math.PI/180,i=n(e.lat-t.lat),r=n(e.lng-t.lng),s=n(t.lat),a=n(e.lat),o=Math.sin(i/2)**2+Math.cos(s)*Math.cos(a)*Math.sin(r/2)**2;return 2*kx*Math.asin(Math.sqrt(o))}const Bx=1.35,Ca={walk:{label:"Walk",emoji:"🚶",speedKmh:4.8,overheadMin:0},cycle:{label:"Cycle",emoji:"🚴",speedKmh:14,overheadMin:4},transit:{label:"Tube / Bus",emoji:"🚇",speedKmh:19,overheadMin:9},drive:{label:"Drive",emoji:"🚗",speedKmh:21,overheadMin:6}};function v0(t,e,n="transit"){const i=Ca[n]||Ca.transit,r=Ox(t,e)*Bx;return Math.round(r/i.speedKmh*60+i.overheadMin)}function zx(t){if(!t.length)return null;const e=t.reduce((i,r)=>i+r.lat,0)/t.length,n=t.reduce((i,r)=>i+r.lng,0)/t.length;return{lat:e,lng:n}}const Hx={minLat:51.32,maxLat:51.68,minLng:-.51,maxLng:.25};function Vx(t,e,n=Hx){const i=(n.minLat+n.maxLat)/2,r=Math.cos(i*Math.PI/180),s=(n.maxLng-n.minLng)*r,a=n.maxLat-n.minLat,o=Math.min(t/s,e/a),l=(t-s*o)/2,u=(e-a*o)/2;return{toXY({lat:d,lng:h}){const f=l+(h-n.minLng)*r*o,p=u+(n.maxLat-d)*o;return{x:f,y:p}}}}const Gx=[{lat:51.4448,lng:-.33},{lat:51.459,lng:-.308},{lat:51.471,lng:-.268},{lat:51.487,lng:-.246},{lat:51.47,lng:-.221},{lat:51.4675,lng:-.192},{lat:51.48,lng:-.175},{lat:51.4855,lng:-.149},{lat:51.4835,lng:-.133},{lat:51.49,lng:-.122},{lat:51.5075,lng:-.118},{lat:51.5085,lng:-.099},{lat:51.505,lng:-.075},{lat:51.5015,lng:-.06},{lat:51.492,lng:-.045},{lat:51.489,lng:-.028},{lat:51.504,lng:-.023},{lat:51.51,lng:-.008},{lat:51.5,lng:.002},{lat:51.486,lng:.01},{lat:51.493,lng:.035},{lat:51.497,lng:.053},{lat:51.49,lng:.075},{lat:51.483,lng:.105},{lat:51.465,lng:.15},{lat:51.456,lng:.19}],yf={types:[],enclosure:"any",maxPricePerHead:null,format:null,maxEta:null,needsFloodlights:!1,freeOnly:!1};function Wx(t,e=yf){const n=Math.max(t.length,1);return _f.map(a=>{const o=t.map(p=>({friend:p,minutes:v0({lat:p.lat,lng:p.lng},a,p.mode)})),l=o.map(p=>p.minutes),u=l.length?Math.round(l.reduce((p,x)=>p+x,0)/l.length):0,d=l.length?Math.max(...l):0,h=l.length?d-Math.min(...l):0,f=a.pricePerHour/n;return{pitch:a,etas:o,avgEta:u,maxEta:d,spreadEta:h,pricePerHead:f}}).filter(({pitch:a,maxEta:o,pricePerHead:l})=>!(e.types.length&&!e.types.includes(a.type)||e.enclosure!=="any"&&a.enclosure!==e.enclosure||e.freeOnly&&a.pricePerHour>0||e.maxPricePerHead!=null&&l>e.maxPricePerHead||e.format!=null&&!a.formats.includes(e.format)||e.maxEta!=null&&t.length&&o>e.maxEta||e.needsFloodlights&&!a.floodlit)).map(a=>{const{pitch:o,avgEta:l,maxEta:u,spreadEta:d,pricePerHead:h}=a,f=Qs(1-l/60),p=Qs(1-u/75),x=Qs(1-d/45),_=e.freeOnly||o.pricePerHour===0?1:Qs(1-h/15),m=(o.floodlit?.35:0)+(o.changingRooms?.25:0)+(o.bookable?.25:0)+(o.surface.toLowerCase().includes("3g")?.15:0),c=a.etas.length?1:0,v=c*(.3*f+.25*p+.15*x)+.18*_+.12*m+(c===0?.7*(.5*_+.5*m):0),g=[];return a.etas.length&&(u<=25?g.push(`everyone inside ${u} min`):l<=30&&g.push(`~${l} min average journey`),d<=10&&a.etas.length>1&&g.push("fair for the whole squad")),o.pricePerHour===0?g.push("free to play"):h<=8&&g.push(`~£${h.toFixed(2)}/head`),o.floodlit&&g.push("floodlit"),o.enclosure==="bounded"&&g.push("ball stays in play"),o.surface.toLowerCase().includes("3g")&&g.push("3G surface"),{...a,score:v,reasons:g.slice(0,4)}}).sort((a,o)=>o.score-a.score)}function Qs(t){return Math.max(0,Math.min(1,t))}function jx(t){return Math.round(Qs(t)*100)}const _0=ke.createContext(null),Xx={view:"home",user:null,squad:[],filters:{...yf},selectedPitchId:null,authModal:null};function qx(t,e){switch(e.type){case"view":return{...t,view:e.view,selectedPitchId:null};case"user":return{...t,user:e.user,authModal:null};case"authModal":return{...t,authModal:e.mode};case"squad:add":{const n=`f${Date.now()}${Math.floor(Math.random()*1e4)}`;return{...t,squad:[...t.squad,{id:n,...e.friend}]}}case"squad:remove":return{...t,squad:t.squad.filter(n=>n.id!==e.id)};case"squad:mode":return{...t,squad:t.squad.map(n=>n.id===e.id?{...n,mode:e.mode}:n)};case"squad:set":return{...t,squad:e.squad};case"filters":return{...t,filters:{...t.filters,...e.patch}};case"filters:reset":return{...t,filters:{...yf}};case"select":return{...t,selectedPitchId:e.id};default:return t}}function $x({children:t}){const[e,n]=ke.useReducer(qx,Xx,a=>({...a,user:Zh()})),i=ke.useMemo(()=>Wx(e.squad,e.filters),[e.squad,e.filters]),r=ke.useMemo(()=>({go:a=>n({type:"view",view:a}),openAuth:a=>n({type:"authModal",mode:a}),closeAuth:()=>n({type:"authModal",mode:null}),async register(a){const o=await Ux(a);n({type:"user",user:o})},async login(a){const o=await Ix(a);n({type:"user",user:o})},logout(){Fx(),n({type:"user",user:null})},addFriend:a=>n({type:"squad:add",friend:a}),removeFriend:a=>n({type:"squad:remove",id:a}),setFriendMode:(a,o)=>n({type:"squad:mode",id:a,mode:o}),setFilters:a=>n({type:"filters",patch:a}),resetFilters:()=>n({type:"filters:reset"}),selectPitch:a=>n({type:"select",id:a}),toggleSave(a){const{user:o}=e;if(!o){n({type:"authModal",mode:"login"});return}const l=o.savedPitchIds.includes(a)?o.savedPitchIds.filter(d=>d!==a):[...o.savedPitchIds,a],u=Hs(o.username,{savedPitchIds:l});n({type:"user",user:u})},createKickabout(a){const{user:o}=e;if(!o){n({type:"authModal",mode:"login"});return}const l={id:`k${Date.now()}`,createdAt:Date.now(),rsvps:{},...a},u=Hs(o.username,{kickabouts:[...o.kickabouts,l]});return n({type:"user",user:u}),l},setRsvp(a,o,l){const{user:u}=e;if(!u)return;const d=u.kickabouts.map(h=>h.id===a?{...h,rsvps:{...h.rsvps,[o]:l}}:h);n({type:"user",user:Hs(u.username,{kickabouts:d})})},deleteKickabout(a){const{user:o}=e;if(!o)return;const l=o.kickabouts.filter(u=>u.id!==a);n({type:"user",user:Hs(o.username,{kickabouts:l})})},saveSquad(){const{user:a,squad:o}=e;!a||!o.length||n({type:"user",user:Hs(a.username,{squads:[o]})})},loadSquad(){var o;const{user:a}=e;(o=a==null?void 0:a.squads)!=null&&o[0]&&n({type:"squad:set",squad:a.squads[0]})}}),[e]);ke.useEffect(()=>{const a=()=>n({type:"user",user:Zh()});return window.addEventListener("storage",a),()=>window.removeEventListener("storage",a)},[]);const s=ke.useMemo(()=>({state:e,results:i,actions:r}),[e,i,r]);return w.jsx(_0.Provider,{value:s,children:t})}function kn(){const t=ke.useContext(_0);if(!t)throw new Error("useStore must be used inside <StoreProvider>");return t}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sf="168",Yx=0,Qh=1,Kx=2,x0=1,Zx=2,ri=3,qi=0,en=1,oi=2,Gi=0,fs=1,Jh=2,ep=3,tp=4,Qx=5,cr=100,Jx=101,ey=102,ty=103,ny=104,iy=200,ry=201,sy=202,ay=203,Gc=204,Wc=205,oy=206,ly=207,uy=208,cy=209,dy=210,fy=211,hy=212,py=213,my=214,gy=0,vy=1,_y=2,vl=3,xy=4,yy=5,Sy=6,My=7,y0=0,Ey=1,wy=2,Wi=0,Ty=1,Ay=2,Cy=3,Ry=4,by=5,Py=6,Ly=7,S0=300,Ms=301,Es=302,jc=303,Xc=304,Gl=306,_l=1e3,mr=1001,qc=1002,_n=1003,Ny=1004,so=1005,Nn=1006,Mu=1007,gr=1008,_i=1009,M0=1010,E0=1011,Ra=1012,Mf=1013,wr=1014,ci=1015,Ua=1016,Ef=1017,wf=1018,ws=1020,w0=35902,T0=1021,A0=1022,Dn=1023,C0=1024,R0=1025,hs=1026,Ts=1027,b0=1028,Tf=1029,P0=1030,Af=1031,Cf=1033,Ho=33776,Vo=33777,Go=33778,Wo=33779,$c=35840,Yc=35841,Kc=35842,Zc=35843,Qc=36196,Jc=37492,ed=37496,td=37808,nd=37809,id=37810,rd=37811,sd=37812,ad=37813,od=37814,ld=37815,ud=37816,cd=37817,dd=37818,fd=37819,hd=37820,pd=37821,jo=36492,md=36494,gd=36495,L0=36283,vd=36284,_d=36285,xd=36286,Dy=3200,Uy=3201,N0=0,Iy=1,Ni="",Pn="srgb",Zi="srgb-linear",Rf="display-p3",Wl="display-p3-linear",xl="linear",nt="srgb",yl="rec709",Sl="p3",Pr=7680,np=519,Fy=512,ky=513,Oy=514,D0=515,By=516,zy=517,Hy=518,Vy=519,ip=35044,rp="300 es",di=2e3,Ml=2001;class Ps{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Eu=Math.PI/180,yd=180/Math.PI;function Ia(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(kt[t&255]+kt[t>>8&255]+kt[t>>16&255]+kt[t>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[n&63|128]+kt[n>>8&255]+"-"+kt[n>>16&255]+kt[n>>24&255]+kt[i&255]+kt[i>>8&255]+kt[i>>16&255]+kt[i>>24&255]).toLowerCase()}function Yt(t,e,n){return Math.max(e,Math.min(n,t))}function Gy(t,e){return(t%e+e)%e}function wu(t,e,n){return(1-n)*t+n*e}function Vs(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function qt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class He{constructor(e=0,n=0){He.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ie{constructor(e,n,i,r,s,a,o,l,u){Ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,u)}set(e,n,i,r,s,a,o,l,u){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=n,d[4]=s,d[5]=l,d[6]=i,d[7]=a,d[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],u=i[1],d=i[4],h=i[7],f=i[2],p=i[5],x=i[8],_=r[0],m=r[3],c=r[6],v=r[1],g=r[4],y=r[7],b=r[2],C=r[5],A=r[8];return s[0]=a*_+o*v+l*b,s[3]=a*m+o*g+l*C,s[6]=a*c+o*y+l*A,s[1]=u*_+d*v+h*b,s[4]=u*m+d*g+h*C,s[7]=u*c+d*y+h*A,s[2]=f*_+p*v+x*b,s[5]=f*m+p*g+x*C,s[8]=f*c+p*y+x*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],d=e[8];return n*a*d-n*o*u-i*s*d+i*o*l+r*s*u-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],d=e[8],h=d*a-o*u,f=o*l-d*s,p=u*s-a*l,x=n*h+i*f+r*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=h*_,e[1]=(r*u-d*i)*_,e[2]=(o*i-r*a)*_,e[3]=f*_,e[4]=(d*n-r*l)*_,e[5]=(r*s-o*n)*_,e[6]=p*_,e[7]=(i*l-u*n)*_,e[8]=(a*n-i*s)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),u=Math.sin(s);return this.set(i*l,i*u,-i*(l*a+u*o)+a+e,-r*u,r*l,-r*(-u*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Tu.makeScale(e,n)),this}rotate(e){return this.premultiply(Tu.makeRotation(-e)),this}translate(e,n){return this.premultiply(Tu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Tu=new Ie;function U0(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function El(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Wy(){const t=El("canvas");return t.style.display="block",t}const sp={};function ua(t){t in sp||(sp[t]=!0,console.warn(t))}function jy(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const ap=new Ie().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),op=new Ie().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Gs={[Zi]:{transfer:xl,primaries:yl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[Pn]:{transfer:nt,primaries:yl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[Wl]:{transfer:xl,primaries:Sl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(op),fromReference:t=>t.applyMatrix3(ap)},[Rf]:{transfer:nt,primaries:Sl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(op),fromReference:t=>t.applyMatrix3(ap).convertLinearToSRGB()}},Xy=new Set([Zi,Wl]),Ke={enabled:!0,_workingColorSpace:Zi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!Xy.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=Gs[e].toReference,r=Gs[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return Gs[t].primaries},getTransfer:function(t){return t===Ni?xl:Gs[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(Gs[e].luminanceCoefficients)}};function ps(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Au(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Lr;class qy{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Lr===void 0&&(Lr=El("canvas")),Lr.width=e.width,Lr.height=e.height;const i=Lr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Lr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=El("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ps(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(ps(n[i]/255)*255):n[i]=ps(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $y=0;class I0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$y++}),this.uuid=Ia(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Cu(r[a].image)):s.push(Cu(r[a]))}else s=Cu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Cu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?qy.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Yy=0;class Wt extends Ps{constructor(e=Wt.DEFAULT_IMAGE,n=Wt.DEFAULT_MAPPING,i=mr,r=mr,s=Nn,a=gr,o=Dn,l=_i,u=Wt.DEFAULT_ANISOTROPY,d=Ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yy++}),this.uuid=Ia(),this.name="",this.source=new I0(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=u,this.format=o,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==S0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _l:e.x=e.x-Math.floor(e.x);break;case mr:e.x=e.x<0?0:1;break;case qc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _l:e.y=e.y-Math.floor(e.y);break;case mr:e.y=e.y<0?0:1;break;case qc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=S0;Wt.DEFAULT_ANISOTROPY=1;class Mt{constructor(e=0,n=0,i=0,r=1){Mt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,u=l[0],d=l[4],h=l[8],f=l[1],p=l[5],x=l[9],_=l[2],m=l[6],c=l[10];if(Math.abs(d-f)<.01&&Math.abs(h-_)<.01&&Math.abs(x-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+_)<.1&&Math.abs(x+m)<.1&&Math.abs(u+p+c-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const g=(u+1)/2,y=(p+1)/2,b=(c+1)/2,C=(d+f)/4,A=(h+_)/4,L=(x+m)/4;return g>y&&g>b?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=C/i,s=A/i):y>b?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=C/r,s=L/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=A/s,r=L/s),this.set(i,r,s,n),this}let v=Math.sqrt((m-x)*(m-x)+(h-_)*(h-_)+(f-d)*(f-d));return Math.abs(v)<.001&&(v=1),this.x=(m-x)/v,this.y=(h-_)/v,this.z=(f-d)/v,this.w=Math.acos((u+p+c-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ky extends Ps{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Mt(0,0,e,n),this.scissorTest=!1,this.viewport=new Mt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Wt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new I0(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tr extends Ky{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class F0 extends Wt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=_n,this.minFilter=_n,this.wrapR=mr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Zy extends Wt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=_n,this.minFilter=_n,this.wrapR=mr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fa{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],u=i[r+1],d=i[r+2],h=i[r+3];const f=s[a+0],p=s[a+1],x=s[a+2],_=s[a+3];if(o===0){e[n+0]=l,e[n+1]=u,e[n+2]=d,e[n+3]=h;return}if(o===1){e[n+0]=f,e[n+1]=p,e[n+2]=x,e[n+3]=_;return}if(h!==_||l!==f||u!==p||d!==x){let m=1-o;const c=l*f+u*p+d*x+h*_,v=c>=0?1:-1,g=1-c*c;if(g>Number.EPSILON){const b=Math.sqrt(g),C=Math.atan2(b,c*v);m=Math.sin(m*C)/b,o=Math.sin(o*C)/b}const y=o*v;if(l=l*m+f*y,u=u*m+p*y,d=d*m+x*y,h=h*m+_*y,m===1-o){const b=1/Math.sqrt(l*l+u*u+d*d+h*h);l*=b,u*=b,d*=b,h*=b}}e[n]=l,e[n+1]=u,e[n+2]=d,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],u=i[r+2],d=i[r+3],h=s[a],f=s[a+1],p=s[a+2],x=s[a+3];return e[n]=o*x+d*h+l*p-u*f,e[n+1]=l*x+d*f+u*h-o*p,e[n+2]=u*x+d*p+o*f-l*h,e[n+3]=d*x-o*h-l*f-u*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,u=o(i/2),d=o(r/2),h=o(s/2),f=l(i/2),p=l(r/2),x=l(s/2);switch(a){case"XYZ":this._x=f*d*h+u*p*x,this._y=u*p*h-f*d*x,this._z=u*d*x+f*p*h,this._w=u*d*h-f*p*x;break;case"YXZ":this._x=f*d*h+u*p*x,this._y=u*p*h-f*d*x,this._z=u*d*x-f*p*h,this._w=u*d*h+f*p*x;break;case"ZXY":this._x=f*d*h-u*p*x,this._y=u*p*h+f*d*x,this._z=u*d*x+f*p*h,this._w=u*d*h-f*p*x;break;case"ZYX":this._x=f*d*h-u*p*x,this._y=u*p*h+f*d*x,this._z=u*d*x-f*p*h,this._w=u*d*h+f*p*x;break;case"YZX":this._x=f*d*h+u*p*x,this._y=u*p*h+f*d*x,this._z=u*d*x-f*p*h,this._w=u*d*h-f*p*x;break;case"XZY":this._x=f*d*h-u*p*x,this._y=u*p*h-f*d*x,this._z=u*d*x+f*p*h,this._w=u*d*h+f*p*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],u=n[2],d=n[6],h=n[10],f=i+o+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-u)*p,this._z=(a-r)*p}else if(i>o&&i>h){const p=2*Math.sqrt(1+i-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+u)/p}else if(o>h){const p=2*Math.sqrt(1+o-i-h);this._w=(s-u)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-o);this._w=(a-r)/p,this._x=(s+u)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Yt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,u=n._z,d=n._w;return this._x=i*d+a*o+r*u-s*l,this._y=r*d+a*l+s*o-i*u,this._z=s*d+a*u+i*l-r*o,this._w=a*d-i*o-r*l-s*u,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-n;return this._w=p*a+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const u=Math.sqrt(l),d=Math.atan2(u,o),h=Math.sin((1-n)*d)/u,f=Math.sin(n*d)/u;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(e=0,n=0,i=0){B.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(lp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(lp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,u=2*(a*r-o*i),d=2*(o*n-s*r),h=2*(s*i-a*n);return this.x=n+l*u+a*h-o*d,this.y=i+l*d+o*u-s*h,this.z=r+l*h+s*d-a*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ru.copy(this).projectOnVector(e),this.sub(Ru)}reflect(e){return this.sub(Ru.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ru=new B,lp=new Fa;class ka{constructor(e=new B(1/0,1/0,1/0),n=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Tn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Tn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Tn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Tn):Tn.fromBufferAttribute(s,a),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ao.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ao.copy(i.boundingBox)),ao.applyMatrix4(e.matrixWorld),this.union(ao)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ws),oo.subVectors(this.max,Ws),Nr.subVectors(e.a,Ws),Dr.subVectors(e.b,Ws),Ur.subVectors(e.c,Ws),Mi.subVectors(Dr,Nr),Ei.subVectors(Ur,Dr),er.subVectors(Nr,Ur);let n=[0,-Mi.z,Mi.y,0,-Ei.z,Ei.y,0,-er.z,er.y,Mi.z,0,-Mi.x,Ei.z,0,-Ei.x,er.z,0,-er.x,-Mi.y,Mi.x,0,-Ei.y,Ei.x,0,-er.y,er.x,0];return!bu(n,Nr,Dr,Ur,oo)||(n=[1,0,0,0,1,0,0,0,1],!bu(n,Nr,Dr,Ur,oo))?!1:(lo.crossVectors(Mi,Ei),n=[lo.x,lo.y,lo.z],bu(n,Nr,Dr,Ur,oo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Qn=[new B,new B,new B,new B,new B,new B,new B,new B],Tn=new B,ao=new ka,Nr=new B,Dr=new B,Ur=new B,Mi=new B,Ei=new B,er=new B,Ws=new B,oo=new B,lo=new B,tr=new B;function bu(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){tr.fromArray(t,s);const o=r.x*Math.abs(tr.x)+r.y*Math.abs(tr.y)+r.z*Math.abs(tr.z),l=e.dot(tr),u=n.dot(tr),d=i.dot(tr);if(Math.max(-Math.max(l,u,d),Math.min(l,u,d))>o)return!1}return!0}const Qy=new ka,js=new B,Pu=new B;class bf{constructor(e=new B,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):Qy.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;js.subVectors(e,this.center);const n=js.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(js,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Pu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(js.copy(e.center).add(Pu)),this.expandByPoint(js.copy(e.center).sub(Pu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Jn=new B,Lu=new B,uo=new B,wi=new B,Nu=new B,co=new B,Du=new B;class Jy{constructor(e=new B,n=new B(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Jn)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Jn.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Jn.copy(this.origin).addScaledVector(this.direction,n),Jn.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Lu.copy(e).add(n).multiplyScalar(.5),uo.copy(n).sub(e).normalize(),wi.copy(this.origin).sub(Lu);const s=e.distanceTo(n)*.5,a=-this.direction.dot(uo),o=wi.dot(this.direction),l=-wi.dot(uo),u=wi.lengthSq(),d=Math.abs(1-a*a);let h,f,p,x;if(d>0)if(h=a*l-o,f=a*o-l,x=s*d,h>=0)if(f>=-x)if(f<=x){const _=1/d;h*=_,f*=_,p=h*(h+a*f+2*o)+f*(a*h+f+2*l)+u}else f=s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+u;else f=-s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+u;else f<=-x?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+u):f<=x?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+u):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+u);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Lu).addScaledVector(uo,f),p}intersectSphere(e,n){Jn.subVectors(e.center,this.origin);const i=Jn.dot(this.direction),r=Jn.dot(Jn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const u=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return u>=0?(i=(e.min.x-f.x)*u,r=(e.max.x-f.x)*u):(i=(e.max.x-f.x)*u,r=(e.min.x-f.x)*u),d>=0?(s=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(s=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Jn)!==null}intersectTriangle(e,n,i,r,s){Nu.subVectors(n,e),co.subVectors(i,e),Du.crossVectors(Nu,co);let a=this.direction.dot(Du),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;wi.subVectors(this.origin,e);const l=o*this.direction.dot(co.crossVectors(wi,co));if(l<0)return null;const u=o*this.direction.dot(Nu.cross(wi));if(u<0||l+u>a)return null;const d=-o*wi.dot(Du);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pt{constructor(e,n,i,r,s,a,o,l,u,d,h,f,p,x,_,m){pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,u,d,h,f,p,x,_,m)}set(e,n,i,r,s,a,o,l,u,d,h,f,p,x,_,m){const c=this.elements;return c[0]=e,c[4]=n,c[8]=i,c[12]=r,c[1]=s,c[5]=a,c[9]=o,c[13]=l,c[2]=u,c[6]=d,c[10]=h,c[14]=f,c[3]=p,c[7]=x,c[11]=_,c[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Ir.setFromMatrixColumn(e,0).length(),s=1/Ir.setFromMatrixColumn(e,1).length(),a=1/Ir.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),u=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*d,p=a*h,x=o*d,_=o*h;n[0]=l*d,n[4]=-l*h,n[8]=u,n[1]=p+x*u,n[5]=f-_*u,n[9]=-o*l,n[2]=_-f*u,n[6]=x+p*u,n[10]=a*l}else if(e.order==="YXZ"){const f=l*d,p=l*h,x=u*d,_=u*h;n[0]=f+_*o,n[4]=x*o-p,n[8]=a*u,n[1]=a*h,n[5]=a*d,n[9]=-o,n[2]=p*o-x,n[6]=_+f*o,n[10]=a*l}else if(e.order==="ZXY"){const f=l*d,p=l*h,x=u*d,_=u*h;n[0]=f-_*o,n[4]=-a*h,n[8]=x+p*o,n[1]=p+x*o,n[5]=a*d,n[9]=_-f*o,n[2]=-a*u,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const f=a*d,p=a*h,x=o*d,_=o*h;n[0]=l*d,n[4]=x*u-p,n[8]=f*u+_,n[1]=l*h,n[5]=_*u+f,n[9]=p*u-x,n[2]=-u,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const f=a*l,p=a*u,x=o*l,_=o*u;n[0]=l*d,n[4]=_-f*h,n[8]=x*h+p,n[1]=h,n[5]=a*d,n[9]=-o*d,n[2]=-u*d,n[6]=p*h+x,n[10]=f-_*h}else if(e.order==="XZY"){const f=a*l,p=a*u,x=o*l,_=o*u;n[0]=l*d,n[4]=-h,n[8]=u*d,n[1]=f*h+_,n[5]=a*d,n[9]=p*h-x,n[2]=x*h-p,n[6]=o*d,n[10]=_*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(eS,e,tS)}lookAt(e,n,i){const r=this.elements;return rn.subVectors(e,n),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),Ti.crossVectors(i,rn),Ti.lengthSq()===0&&(Math.abs(i.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),Ti.crossVectors(i,rn)),Ti.normalize(),fo.crossVectors(rn,Ti),r[0]=Ti.x,r[4]=fo.x,r[8]=rn.x,r[1]=Ti.y,r[5]=fo.y,r[9]=rn.y,r[2]=Ti.z,r[6]=fo.z,r[10]=rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],u=i[12],d=i[1],h=i[5],f=i[9],p=i[13],x=i[2],_=i[6],m=i[10],c=i[14],v=i[3],g=i[7],y=i[11],b=i[15],C=r[0],A=r[4],L=r[8],T=r[12],M=r[1],N=r[5],G=r[9],H=r[13],$=r[2],Y=r[6],W=r[10],K=r[14],D=r[3],X=r[7],Q=r[11],ae=r[15];return s[0]=a*C+o*M+l*$+u*D,s[4]=a*A+o*N+l*Y+u*X,s[8]=a*L+o*G+l*W+u*Q,s[12]=a*T+o*H+l*K+u*ae,s[1]=d*C+h*M+f*$+p*D,s[5]=d*A+h*N+f*Y+p*X,s[9]=d*L+h*G+f*W+p*Q,s[13]=d*T+h*H+f*K+p*ae,s[2]=x*C+_*M+m*$+c*D,s[6]=x*A+_*N+m*Y+c*X,s[10]=x*L+_*G+m*W+c*Q,s[14]=x*T+_*H+m*K+c*ae,s[3]=v*C+g*M+y*$+b*D,s[7]=v*A+g*N+y*Y+b*X,s[11]=v*L+g*G+y*W+b*Q,s[15]=v*T+g*H+y*K+b*ae,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],u=e[13],d=e[2],h=e[6],f=e[10],p=e[14],x=e[3],_=e[7],m=e[11],c=e[15];return x*(+s*l*h-r*u*h-s*o*f+i*u*f+r*o*p-i*l*p)+_*(+n*l*p-n*u*f+s*a*f-r*a*p+r*u*d-s*l*d)+m*(+n*u*h-n*o*p-s*a*h+i*a*p+s*o*d-i*u*d)+c*(-r*o*d-n*l*h+n*o*f+r*a*h-i*a*f+i*l*d)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],d=e[8],h=e[9],f=e[10],p=e[11],x=e[12],_=e[13],m=e[14],c=e[15],v=h*m*u-_*f*u+_*l*p-o*m*p-h*l*c+o*f*c,g=x*f*u-d*m*u-x*l*p+a*m*p+d*l*c-a*f*c,y=d*_*u-x*h*u+x*o*p-a*_*p-d*o*c+a*h*c,b=x*h*l-d*_*l-x*o*f+a*_*f+d*o*m-a*h*m,C=n*v+i*g+r*y+s*b;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return e[0]=v*A,e[1]=(_*f*s-h*m*s-_*r*p+i*m*p+h*r*c-i*f*c)*A,e[2]=(o*m*s-_*l*s+_*r*u-i*m*u-o*r*c+i*l*c)*A,e[3]=(h*l*s-o*f*s-h*r*u+i*f*u+o*r*p-i*l*p)*A,e[4]=g*A,e[5]=(d*m*s-x*f*s+x*r*p-n*m*p-d*r*c+n*f*c)*A,e[6]=(x*l*s-a*m*s-x*r*u+n*m*u+a*r*c-n*l*c)*A,e[7]=(a*f*s-d*l*s+d*r*u-n*f*u-a*r*p+n*l*p)*A,e[8]=y*A,e[9]=(x*h*s-d*_*s-x*i*p+n*_*p+d*i*c-n*h*c)*A,e[10]=(a*_*s-x*o*s+x*i*u-n*_*u-a*i*c+n*o*c)*A,e[11]=(d*o*s-a*h*s-d*i*u+n*h*u+a*i*p-n*o*p)*A,e[12]=b*A,e[13]=(d*_*r-x*h*r+x*i*f-n*_*f-d*i*m+n*h*m)*A,e[14]=(x*o*r-a*_*r-x*i*l+n*_*l+a*i*m-n*o*m)*A,e[15]=(a*h*r-d*o*r+d*i*l-n*h*l-a*i*f+n*o*f)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,u=s*a,d=s*o;return this.set(u*a+i,u*o-r*l,u*l+r*o,0,u*o+r*l,d*o+i,d*l-r*a,0,u*l-r*o,d*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,u=s+s,d=a+a,h=o+o,f=s*u,p=s*d,x=s*h,_=a*d,m=a*h,c=o*h,v=l*u,g=l*d,y=l*h,b=i.x,C=i.y,A=i.z;return r[0]=(1-(_+c))*b,r[1]=(p+y)*b,r[2]=(x-g)*b,r[3]=0,r[4]=(p-y)*C,r[5]=(1-(f+c))*C,r[6]=(m+v)*C,r[7]=0,r[8]=(x+g)*A,r[9]=(m-v)*A,r[10]=(1-(f+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Ir.set(r[0],r[1],r[2]).length();const a=Ir.set(r[4],r[5],r[6]).length(),o=Ir.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],An.copy(this);const u=1/s,d=1/a,h=1/o;return An.elements[0]*=u,An.elements[1]*=u,An.elements[2]*=u,An.elements[4]*=d,An.elements[5]*=d,An.elements[6]*=d,An.elements[8]*=h,An.elements[9]*=h,An.elements[10]*=h,n.setFromRotationMatrix(An),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=di){const l=this.elements,u=2*s/(n-e),d=2*s/(i-r),h=(n+e)/(n-e),f=(i+r)/(i-r);let p,x;if(o===di)p=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Ml)p=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=di){const l=this.elements,u=1/(n-e),d=1/(i-r),h=1/(a-s),f=(n+e)*u,p=(i+r)*d;let x,_;if(o===di)x=(a+s)*h,_=-2*h;else if(o===Ml)x=s*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*u,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Ir=new B,An=new pt,eS=new B(0,0,0),tS=new B(1,1,1),Ti=new B,fo=new B,rn=new B,up=new pt,cp=new Fa;class Yn{constructor(e=0,n=0,i=0,r=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],u=r[5],d=r[9],h=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Yt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,u));break;case"YZX":this._z=Math.asin(Yt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,u),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,u),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return up.makeRotationFromQuaternion(e),this.setFromRotationMatrix(up,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return cp.setFromEuler(this),this.setFromQuaternion(cp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class k0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let nS=0;const dp=new B,Fr=new Fa,ei=new pt,ho=new B,Xs=new B,iS=new B,rS=new Fa,fp=new B(1,0,0),hp=new B(0,1,0),pp=new B(0,0,1),mp={type:"added"},sS={type:"removed"},kr={type:"childadded",child:null},Uu={type:"childremoved",child:null};class Dt extends Ps{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nS++}),this.uuid=Ia(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dt.DEFAULT_UP.clone();const e=new B,n=new Yn,i=new Fa,r=new B(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pt},normalMatrix:{value:new Ie}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new k0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Fr.setFromAxisAngle(e,n),this.quaternion.multiply(Fr),this}rotateOnWorldAxis(e,n){return Fr.setFromAxisAngle(e,n),this.quaternion.premultiply(Fr),this}rotateX(e){return this.rotateOnAxis(fp,e)}rotateY(e){return this.rotateOnAxis(hp,e)}rotateZ(e){return this.rotateOnAxis(pp,e)}translateOnAxis(e,n){return dp.copy(e).applyQuaternion(this.quaternion),this.position.add(dp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(fp,e)}translateY(e){return this.translateOnAxis(hp,e)}translateZ(e){return this.translateOnAxis(pp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?ho.copy(e):ho.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(Xs,ho,this.up):ei.lookAt(ho,Xs,this.up),this.quaternion.setFromRotationMatrix(ei),r&&(ei.extractRotation(r.matrixWorld),Fr.setFromRotationMatrix(ei),this.quaternion.premultiply(Fr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(mp),kr.child=e,this.dispatchEvent(kr),kr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(sS),Uu.child=e,this.dispatchEvent(Uu),Uu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(mp),kr.child=e,this.dispatchEvent(kr),kr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,e,iS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,rS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let u=0,d=l.length;u<d;u++){const h=l[u];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,u=this.material.length;l<u;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),u=a(e.textures),d=a(e.images),h=a(e.shapes),f=a(e.skeletons),p=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),u.length>0&&(i.textures=u),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=r,i;function a(o){const l=[];for(const u in o){const d=o[u];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Dt.DEFAULT_UP=new B(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Cn=new B,ti=new B,Iu=new B,ni=new B,Or=new B,Br=new B,gp=new B,Fu=new B,ku=new B,Ou=new B;class Wn{constructor(e=new B,n=new B,i=new B){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Cn.subVectors(e,n),r.cross(Cn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Cn.subVectors(r,n),ti.subVectors(i,n),Iu.subVectors(e,n);const a=Cn.dot(Cn),o=Cn.dot(ti),l=Cn.dot(Iu),u=ti.dot(ti),d=ti.dot(Iu),h=a*u-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(u*l-o*d)*f,x=(a*d-o*l)*f;return s.set(1-p-x,x,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ni.x),l.addScaledVector(a,ni.y),l.addScaledVector(o,ni.z),l)}static isFrontFacing(e,n,i,r){return Cn.subVectors(i,n),ti.subVectors(e,n),Cn.cross(ti).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Cn.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Cn.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Wn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Wn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Wn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Wn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Wn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Or.subVectors(r,i),Br.subVectors(s,i),Fu.subVectors(e,i);const l=Or.dot(Fu),u=Br.dot(Fu);if(l<=0&&u<=0)return n.copy(i);ku.subVectors(e,r);const d=Or.dot(ku),h=Br.dot(ku);if(d>=0&&h<=d)return n.copy(r);const f=l*h-d*u;if(f<=0&&l>=0&&d<=0)return a=l/(l-d),n.copy(i).addScaledVector(Or,a);Ou.subVectors(e,s);const p=Or.dot(Ou),x=Br.dot(Ou);if(x>=0&&p<=x)return n.copy(s);const _=p*u-l*x;if(_<=0&&u>=0&&x<=0)return o=u/(u-x),n.copy(i).addScaledVector(Br,o);const m=d*x-p*h;if(m<=0&&h-d>=0&&p-x>=0)return gp.subVectors(s,r),o=(h-d)/(h-d+(p-x)),n.copy(r).addScaledVector(gp,o);const c=1/(m+_+f);return a=_*c,o=f*c,n.copy(i).addScaledVector(Or,a).addScaledVector(Br,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const O0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},po={h:0,s:0,l:0};function Bu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class We{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Pn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Ke.workingColorSpace){return this.r=e,this.g=n,this.b=i,Ke.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Ke.workingColorSpace){if(e=Gy(e,1),n=Yt(n,0,1),i=Yt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=Bu(a,s,e+1/3),this.g=Bu(a,s,e),this.b=Bu(a,s,e-1/3)}return Ke.toWorkingColorSpace(this,r),this}setStyle(e,n=Pn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Pn){const i=O0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ps(e.r),this.g=ps(e.g),this.b=ps(e.b),this}copyLinearToSRGB(e){return this.r=Au(e.r),this.g=Au(e.g),this.b=Au(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pn){return Ke.fromWorkingColorSpace(Ot.copy(this),e),Math.round(Yt(Ot.r*255,0,255))*65536+Math.round(Yt(Ot.g*255,0,255))*256+Math.round(Yt(Ot.b*255,0,255))}getHexString(e=Pn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Ke.workingColorSpace){Ke.fromWorkingColorSpace(Ot.copy(this),n);const i=Ot.r,r=Ot.g,s=Ot.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,u;const d=(o+a)/2;if(o===a)l=0,u=0;else{const h=a-o;switch(u=d<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=u,e.l=d,e}getRGB(e,n=Ke.workingColorSpace){return Ke.fromWorkingColorSpace(Ot.copy(this),n),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=Pn){Ke.fromWorkingColorSpace(Ot.copy(this),e);const n=Ot.r,i=Ot.g,r=Ot.b;return e!==Pn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Ai),this.setHSL(Ai.h+e,Ai.s+n,Ai.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Ai),e.getHSL(po);const i=wu(Ai.h,po.h,n),r=wu(Ai.s,po.s,n),s=wu(Ai.l,po.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ot=new We;We.NAMES=O0;let aS=0;class Oa extends Ps{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:aS++}),this.uuid=Ia(),this.name="",this.type="Material",this.blending=fs,this.side=qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gc,this.blendDst=Wc,this.blendEquation=cr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=vl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=np,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pr,this.stencilZFail=Pr,this.stencilZPass=Pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==fs&&(i.blending=this.blending),this.side!==qi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Gc&&(i.blendSrc=this.blendSrc),this.blendDst!==Wc&&(i.blendDst=this.blendDst),this.blendEquation!==cr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==vl&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==np&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class B0 extends Oa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=y0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const xt=new B,mo=new He;class qn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=ip,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ci,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return ua("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)mo.fromBufferAttribute(this,n),mo.applyMatrix3(e),this.setXY(n,mo.x,mo.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)xt.fromBufferAttribute(this,n),xt.applyMatrix3(e),this.setXYZ(n,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)xt.fromBufferAttribute(this,n),xt.applyMatrix4(e),this.setXYZ(n,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)xt.fromBufferAttribute(this,n),xt.applyNormalMatrix(e),this.setXYZ(n,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)xt.fromBufferAttribute(this,n),xt.transformDirection(e),this.setXYZ(n,xt.x,xt.y,xt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Vs(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Vs(n,this.array)),n}setX(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Vs(n,this.array)),n}setY(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Vs(n,this.array)),n}setZ(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Vs(n,this.array)),n}setW(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array),r=qt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array),r=qt(r,this.array),s=qt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ip&&(e.usage=this.usage),e}}class z0 extends qn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class H0 extends qn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class $n extends qn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let oS=0;const hn=new pt,zu=new Dt,zr=new B,sn=new ka,qs=new ka,At=new B;class Qi extends Ps{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:oS++}),this.uuid=Ia(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(U0(e)?H0:z0)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ie().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,n,i){return hn.makeTranslation(e,n,i),this.applyMatrix4(hn),this}scale(e,n,i){return hn.makeScale(e,n,i),this.applyMatrix4(hn),this}lookAt(e){return zu.lookAt(e),zu.updateMatrix(),this.applyMatrix4(zu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zr).negate(),this.translate(zr.x,zr.y,zr.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new $n(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ka);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];sn.setFromBufferAttribute(s),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bf);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const i=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];qs.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(sn.min,qs.min),sn.expandByPoint(At),At.addVectors(sn.max,qs.max),sn.expandByPoint(At)):(sn.expandByPoint(qs.min),sn.expandByPoint(qs.max))}sn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)At.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(At));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let u=0,d=o.count;u<d;u++)At.fromBufferAttribute(o,u),l&&(zr.fromBufferAttribute(e,u),At.add(zr)),r=Math.max(r,i.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<i.count;L++)o[L]=new B,l[L]=new B;const u=new B,d=new B,h=new B,f=new He,p=new He,x=new He,_=new B,m=new B;function c(L,T,M){u.fromBufferAttribute(i,L),d.fromBufferAttribute(i,T),h.fromBufferAttribute(i,M),f.fromBufferAttribute(s,L),p.fromBufferAttribute(s,T),x.fromBufferAttribute(s,M),d.sub(u),h.sub(u),p.sub(f),x.sub(f);const N=1/(p.x*x.y-x.x*p.y);isFinite(N)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(h,-p.y).multiplyScalar(N),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-x.x).multiplyScalar(N),o[L].add(_),o[T].add(_),o[M].add(_),l[L].add(m),l[T].add(m),l[M].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let L=0,T=v.length;L<T;++L){const M=v[L],N=M.start,G=M.count;for(let H=N,$=N+G;H<$;H+=3)c(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const g=new B,y=new B,b=new B,C=new B;function A(L){b.fromBufferAttribute(r,L),C.copy(b);const T=o[L];g.copy(T),g.sub(b.multiplyScalar(b.dot(T))).normalize(),y.crossVectors(C,T);const N=y.dot(l[L])<0?-1:1;a.setXYZW(L,g.x,g.y,g.z,N)}for(let L=0,T=v.length;L<T;++L){const M=v[L],N=M.start,G=M.count;for(let H=N,$=N+G;H<$;H+=3)A(e.getX(H+0)),A(e.getX(H+1)),A(e.getX(H+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new qn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new B,s=new B,a=new B,o=new B,l=new B,u=new B,d=new B,h=new B;if(e)for(let f=0,p=e.count;f<p;f+=3){const x=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,_),a.fromBufferAttribute(n,m),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,_),u.fromBufferAttribute(i,m),o.add(d),l.add(d),u.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,u.x,u.y,u.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),a.fromBufferAttribute(n,f+2),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)At.fromBufferAttribute(e,n),At.normalize(),e.setXYZ(n,At.x,At.y,At.z)}toNonIndexed(){function e(o,l){const u=o.array,d=o.itemSize,h=o.normalized,f=new u.constructor(l.length*d);let p=0,x=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*d;for(let c=0;c<d;c++)f[x++]=u[p++]}return new qn(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Qi,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],u=e(l,i);n.setAttribute(o,u)}const s=this.morphAttributes;for(const o in s){const l=[],u=s[o];for(let d=0,h=u.length;d<h;d++){const f=u[d],p=e(f,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const u=a[o];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const u=i[l];e.data.attributes[l]=u.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],d=[];for(let h=0,f=u.length;h<f;h++){const p=u[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const u in r){const d=r[u];this.setAttribute(u,d.clone(n))}const s=e.morphAttributes;for(const u in s){const d=[],h=s[u];for(let f=0,p=h.length;f<p;f++)d.push(h[f].clone(n));this.morphAttributes[u]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let u=0,d=a.length;u<d;u++){const h=a[u];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const vp=new pt,nr=new Jy,go=new bf,_p=new B,Hr=new B,Vr=new B,Gr=new B,Hu=new B,vo=new B,_o=new He,xo=new He,yo=new He,xp=new B,yp=new B,Sp=new B,So=new B,Mo=new B;class xn extends Dt{constructor(e=new Qi,n=new B0){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){vo.set(0,0,0);for(let l=0,u=s.length;l<u;l++){const d=o[l],h=s[l];d!==0&&(Hu.fromBufferAttribute(h,e),a?vo.addScaledVector(Hu,d):vo.addScaledVector(Hu.sub(n),d))}n.add(vo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),go.copy(i.boundingSphere),go.applyMatrix4(s),nr.copy(e.ray).recast(e.near),!(go.containsPoint(nr.origin)===!1&&(nr.intersectSphere(go,_p)===null||nr.origin.distanceToSquared(_p)>(e.far-e.near)**2))&&(vp.copy(s).invert(),nr.copy(e.ray).applyMatrix4(vp),!(i.boundingBox!==null&&nr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,nr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,u=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=f.length;x<_;x++){const m=f[x],c=a[m.materialIndex],v=Math.max(m.start,p.start),g=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,b=g;y<b;y+=3){const C=o.getX(y),A=o.getX(y+1),L=o.getX(y+2);r=Eo(this,c,e,i,u,d,h,C,A,L),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=x,c=_;m<c;m+=3){const v=o.getX(m),g=o.getX(m+1),y=o.getX(m+2);r=Eo(this,a,e,i,u,d,h,v,g,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,_=f.length;x<_;x++){const m=f[x],c=a[m.materialIndex],v=Math.max(m.start,p.start),g=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,b=g;y<b;y+=3){const C=y,A=y+1,L=y+2;r=Eo(this,c,e,i,u,d,h,C,A,L),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const x=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=x,c=_;m<c;m+=3){const v=m,g=m+1,y=m+2;r=Eo(this,a,e,i,u,d,h,v,g,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function lS(t,e,n,i,r,s,a,o){let l;if(e.side===en?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===qi,o),l===null)return null;Mo.copy(o),Mo.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(Mo);return u<n.near||u>n.far?null:{distance:u,point:Mo.clone(),object:t}}function Eo(t,e,n,i,r,s,a,o,l,u){t.getVertexPosition(o,Hr),t.getVertexPosition(l,Vr),t.getVertexPosition(u,Gr);const d=lS(t,e,n,i,Hr,Vr,Gr,So);if(d){r&&(_o.fromBufferAttribute(r,o),xo.fromBufferAttribute(r,l),yo.fromBufferAttribute(r,u),d.uv=Wn.getInterpolation(So,Hr,Vr,Gr,_o,xo,yo,new He)),s&&(_o.fromBufferAttribute(s,o),xo.fromBufferAttribute(s,l),yo.fromBufferAttribute(s,u),d.uv1=Wn.getInterpolation(So,Hr,Vr,Gr,_o,xo,yo,new He)),a&&(xp.fromBufferAttribute(a,o),yp.fromBufferAttribute(a,l),Sp.fromBufferAttribute(a,u),d.normal=Wn.getInterpolation(So,Hr,Vr,Gr,xp,yp,Sp,new B),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c:u,normal:new B,materialIndex:0};Wn.getNormal(Hr,Vr,Gr,h.normal),d.face=h}return d}class Ba extends Qi{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],u=[],d=[],h=[];let f=0,p=0;x("z","y","x",-1,-1,i,n,e,a,s,0),x("z","y","x",1,-1,i,n,-e,a,s,1),x("x","z","y",1,1,e,i,n,r,a,2),x("x","z","y",1,-1,e,i,-n,r,a,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new $n(u,3)),this.setAttribute("normal",new $n(d,3)),this.setAttribute("uv",new $n(h,2));function x(_,m,c,v,g,y,b,C,A,L,T){const M=y/A,N=b/L,G=y/2,H=b/2,$=C/2,Y=A+1,W=L+1;let K=0,D=0;const X=new B;for(let Q=0;Q<W;Q++){const ae=Q*N-H;for(let Se=0;Se<Y;Se++){const Ve=Se*M-G;X[_]=Ve*v,X[m]=ae*g,X[c]=$,u.push(X.x,X.y,X.z),X[_]=0,X[m]=0,X[c]=C>0?1:-1,d.push(X.x,X.y,X.z),h.push(Se/A),h.push(1-Q/L),K+=1}}for(let Q=0;Q<L;Q++)for(let ae=0;ae<A;ae++){const Se=f+ae+Y*Q,Ve=f+ae+Y*(Q+1),V=f+(ae+1)+Y*(Q+1),ne=f+(ae+1)+Y*Q;l.push(Se,Ve,ne),l.push(Ve,V,ne),D+=6}o.addGroup(p,D,T),p+=D,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ba(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function As(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Ht(t){const e={};for(let n=0;n<t.length;n++){const i=As(t[n]);for(const r in i)e[r]=i[r]}return e}function uS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function V0(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}const cS={clone:As,merge:Ht};var dS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kn extends Oa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dS,this.fragmentShader=fS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=As(e.uniforms),this.uniformsGroups=uS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class G0 extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=di}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ci=new B,Mp=new He,Ep=new He;class gn extends G0{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=yd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Eu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return yd*2*Math.atan(Math.tan(Eu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z)}getViewSize(e,n){return this.getViewBounds(e,Mp,Ep),n.subVectors(Ep,Mp)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Eu*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,u=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/u,r*=a.width/l,i*=a.height/u}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Wr=-90,jr=1;class hS extends Dt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new gn(Wr,jr,e,n);r.layers=this.layers,this.add(r);const s=new gn(Wr,jr,e,n);s.layers=this.layers,this.add(s);const a=new gn(Wr,jr,e,n);a.layers=this.layers,this.add(a);const o=new gn(Wr,jr,e,n);o.layers=this.layers,this.add(o);const l=new gn(Wr,jr,e,n);l.layers=this.layers,this.add(l);const u=new gn(Wr,jr,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const u of n)this.remove(u);if(e===di)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ml)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,u,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,u),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(n,d),e.setRenderTarget(h,f,p),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class W0 extends Wt{constructor(e,n,i,r,s,a,o,l,u,d){e=e!==void 0?e:[],n=n!==void 0?n:Ms,super(e,n,i,r,s,a,o,l,u,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class pS extends Tr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new W0(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Nn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ba(5,5,5),s=new Kn({name:"CubemapFromEquirect",uniforms:As(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:en,blending:Gi});s.uniforms.tEquirect.value=n;const a=new xn(r,s),o=n.minFilter;return n.minFilter===gr&&(n.minFilter=Nn),new hS(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const Vu=new B,mS=new B,gS=new Ie;class lr{constructor(e=new B(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Vu.subVectors(i,n).cross(mS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Vu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||gS.getNormalMatrix(e),r=this.coplanarPoint(Vu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ir=new bf,wo=new B;class Pf{constructor(e=new lr,n=new lr,i=new lr,r=new lr,s=new lr,a=new lr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=di){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],u=r[4],d=r[5],h=r[6],f=r[7],p=r[8],x=r[9],_=r[10],m=r[11],c=r[12],v=r[13],g=r[14],y=r[15];if(i[0].setComponents(l-s,f-u,m-p,y-c).normalize(),i[1].setComponents(l+s,f+u,m+p,y+c).normalize(),i[2].setComponents(l+a,f+d,m+x,y+v).normalize(),i[3].setComponents(l-a,f-d,m-x,y-v).normalize(),i[4].setComponents(l-o,f-h,m-_,y-g).normalize(),n===di)i[5].setComponents(l+o,f+h,m+_,y+g).normalize();else if(n===Ml)i[5].setComponents(o,h,_,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ir.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ir)}intersectsSprite(e){return ir.center.set(0,0,0),ir.radius=.7071067811865476,ir.applyMatrix4(e.matrixWorld),this.intersectsSphere(ir)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(wo.x=r.normal.x>0?e.max.x:e.min.x,wo.y=r.normal.y>0?e.max.y:e.min.y,wo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(wo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function j0(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function vS(t){const e=new WeakMap;function n(o,l){const u=o.array,d=o.usage,h=u.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,u,d),o.onUploadCallback();let p;if(u instanceof Float32Array)p=t.FLOAT;else if(u instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(u instanceof Int16Array)p=t.SHORT;else if(u instanceof Uint32Array)p=t.UNSIGNED_INT;else if(u instanceof Int32Array)p=t.INT;else if(u instanceof Int8Array)p=t.BYTE;else if(u instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:f,type:p,bytesPerElement:u.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,u){const d=l.array,h=l._updateRange,f=l.updateRanges;if(t.bindBuffer(u,o),h.count===-1&&f.length===0&&t.bufferSubData(u,0,d),f.length!==0){for(let p=0,x=f.length;p<x;p++){const _=f[p];t.bufferSubData(u,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}h.count!==-1&&(t.bufferSubData(u,h.offset*d.BYTES_PER_ELEMENT,d,h.offset,h.count),h.count=-1),l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const u=e.get(o);if(u===void 0)e.set(o,n(o,l));else if(u.version<o.version){if(u.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,o,l),u.version=o.version}}return{get:r,remove:s,update:a}}class Ls extends Qi{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),u=o+1,d=l+1,h=e/o,f=n/l,p=[],x=[],_=[],m=[];for(let c=0;c<d;c++){const v=c*f-a;for(let g=0;g<u;g++){const y=g*h-s;x.push(y,-v,0),_.push(0,0,1),m.push(g/o),m.push(1-c/l)}}for(let c=0;c<l;c++)for(let v=0;v<o;v++){const g=v+u*c,y=v+u*(c+1),b=v+1+u*(c+1),C=v+1+u*c;p.push(g,y,C),p.push(y,b,C)}this.setIndex(p),this.setAttribute("position",new $n(x,3)),this.setAttribute("normal",new $n(_,3)),this.setAttribute("uv",new $n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ls(e.width,e.height,e.widthSegments,e.heightSegments)}}var _S=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,SS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,MS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ES=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,TS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,AS=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,CS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,RS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,PS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,LS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,NS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,DS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,US=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,IS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,FS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,OS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,BS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,HS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,VS=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,GS=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,WS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,XS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$S="gl_FragColor = linearToOutputTexel( gl_FragColor );",YS=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,KS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ZS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,QS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,JS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,eM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,tM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,nM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,iM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,aM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,oM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,cM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,dM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,gM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_M=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,xM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,SM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,MM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,EM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,TM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,AM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,CM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,RM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,PM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,LM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,NM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,DM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,UM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,IM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,FM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,OM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,BM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,HM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,VM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,GM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,WM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,XM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,qM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$M=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,YM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,KM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ZM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,QM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,JM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,eE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,tE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,nE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,iE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,sE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,aE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,oE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,uE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,dE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,fE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,hE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,gE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_E=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,SE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ME=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,EE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,wE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,TE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,AE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,CE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,RE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,PE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,NE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,UE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,FE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,OE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,BE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,VE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,GE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,WE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,XE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$E=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,YE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,KE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:_S,alphahash_pars_fragment:xS,alphamap_fragment:yS,alphamap_pars_fragment:SS,alphatest_fragment:MS,alphatest_pars_fragment:ES,aomap_fragment:wS,aomap_pars_fragment:TS,batching_pars_vertex:AS,batching_vertex:CS,begin_vertex:RS,beginnormal_vertex:bS,bsdfs:PS,iridescence_fragment:LS,bumpmap_pars_fragment:NS,clipping_planes_fragment:DS,clipping_planes_pars_fragment:US,clipping_planes_pars_vertex:IS,clipping_planes_vertex:FS,color_fragment:kS,color_pars_fragment:OS,color_pars_vertex:BS,color_vertex:zS,common:HS,cube_uv_reflection_fragment:VS,defaultnormal_vertex:GS,displacementmap_pars_vertex:WS,displacementmap_vertex:jS,emissivemap_fragment:XS,emissivemap_pars_fragment:qS,colorspace_fragment:$S,colorspace_pars_fragment:YS,envmap_fragment:KS,envmap_common_pars_fragment:ZS,envmap_pars_fragment:QS,envmap_pars_vertex:JS,envmap_physical_pars_fragment:cM,envmap_vertex:eM,fog_vertex:tM,fog_pars_vertex:nM,fog_fragment:iM,fog_pars_fragment:rM,gradientmap_pars_fragment:sM,lightmap_pars_fragment:aM,lights_lambert_fragment:oM,lights_lambert_pars_fragment:lM,lights_pars_begin:uM,lights_toon_fragment:dM,lights_toon_pars_fragment:fM,lights_phong_fragment:hM,lights_phong_pars_fragment:pM,lights_physical_fragment:mM,lights_physical_pars_fragment:gM,lights_fragment_begin:vM,lights_fragment_maps:_M,lights_fragment_end:xM,logdepthbuf_fragment:yM,logdepthbuf_pars_fragment:SM,logdepthbuf_pars_vertex:MM,logdepthbuf_vertex:EM,map_fragment:wM,map_pars_fragment:TM,map_particle_fragment:AM,map_particle_pars_fragment:CM,metalnessmap_fragment:RM,metalnessmap_pars_fragment:bM,morphinstance_vertex:PM,morphcolor_vertex:LM,morphnormal_vertex:NM,morphtarget_pars_vertex:DM,morphtarget_vertex:UM,normal_fragment_begin:IM,normal_fragment_maps:FM,normal_pars_fragment:kM,normal_pars_vertex:OM,normal_vertex:BM,normalmap_pars_fragment:zM,clearcoat_normal_fragment_begin:HM,clearcoat_normal_fragment_maps:VM,clearcoat_pars_fragment:GM,iridescence_pars_fragment:WM,opaque_fragment:jM,packing:XM,premultiplied_alpha_fragment:qM,project_vertex:$M,dithering_fragment:YM,dithering_pars_fragment:KM,roughnessmap_fragment:ZM,roughnessmap_pars_fragment:QM,shadowmap_pars_fragment:JM,shadowmap_pars_vertex:eE,shadowmap_vertex:tE,shadowmask_pars_fragment:nE,skinbase_vertex:iE,skinning_pars_vertex:rE,skinning_vertex:sE,skinnormal_vertex:aE,specularmap_fragment:oE,specularmap_pars_fragment:lE,tonemapping_fragment:uE,tonemapping_pars_fragment:cE,transmission_fragment:dE,transmission_pars_fragment:fE,uv_pars_fragment:hE,uv_pars_vertex:pE,uv_vertex:mE,worldpos_vertex:gE,background_vert:vE,background_frag:_E,backgroundCube_vert:xE,backgroundCube_frag:yE,cube_vert:SE,cube_frag:ME,depth_vert:EE,depth_frag:wE,distanceRGBA_vert:TE,distanceRGBA_frag:AE,equirect_vert:CE,equirect_frag:RE,linedashed_vert:bE,linedashed_frag:PE,meshbasic_vert:LE,meshbasic_frag:NE,meshlambert_vert:DE,meshlambert_frag:UE,meshmatcap_vert:IE,meshmatcap_frag:FE,meshnormal_vert:kE,meshnormal_frag:OE,meshphong_vert:BE,meshphong_frag:zE,meshphysical_vert:HE,meshphysical_frag:VE,meshtoon_vert:GE,meshtoon_frag:WE,points_vert:jE,points_frag:XE,shadow_vert:qE,shadow_frag:$E,sprite_vert:YE,sprite_frag:KE},le={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},Vn={basic:{uniforms:Ht([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Ht([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new We(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Ht([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Ht([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Ht([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new We(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Ht([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Ht([le.points,le.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Ht([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Ht([le.common,le.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Ht([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Ht([le.sprite,le.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:Ht([le.common,le.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:Ht([le.lights,le.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};Vn.physical={uniforms:Ht([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const To={r:0,b:0,g:0},rr=new Yn,ZE=new pt;function QE(t,e,n,i,r,s,a){const o=new We(0);let l=s===!0?0:1,u,d,h=null,f=0,p=null;function x(v){let g=v.isScene===!0?v.background:null;return g&&g.isTexture&&(g=(v.backgroundBlurriness>0?n:e).get(g)),g}function _(v){let g=!1;const y=x(v);y===null?c(o,l):y&&y.isColor&&(c(y,1),g=!0);const b=t.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(v,g){const y=x(g);y&&(y.isCubeTexture||y.mapping===Gl)?(d===void 0&&(d=new xn(new Ba(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:As(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(b,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),rr.copy(g.backgroundRotation),rr.x*=-1,rr.y*=-1,rr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(rr.y*=-1,rr.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(ZE.makeRotationFromEuler(rr)),d.material.toneMapped=Ke.getTransfer(y.colorSpace)!==nt,(h!==y||f!==y.version||p!==t.toneMapping)&&(d.material.needsUpdate=!0,h=y,f=y.version,p=t.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(u===void 0&&(u=new xn(new Ls(2,2),new Kn({name:"BackgroundMaterial",uniforms:As(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:qi,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(u)),u.material.uniforms.t2D.value=y,u.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,u.material.toneMapped=Ke.getTransfer(y.colorSpace)!==nt,y.matrixAutoUpdate===!0&&y.updateMatrix(),u.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,h=y,f=y.version,p=t.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null))}function c(v,g){v.getRGB(To,V0(t)),i.buffers.color.setClear(To.r,To.g,To.b,g,a)}return{getClearColor:function(){return o},setClearColor:function(v,g=1){o.set(v),l=g,c(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,c(o,l)},render:_,addToRenderList:m}}function JE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(M,N,G,H,$){let Y=!1;const W=h(H,G,N);s!==W&&(s=W,u(s.object)),Y=p(M,H,G,$),Y&&x(M,H,G,$),$!==null&&e.update($,t.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,y(M,N,G,H),$!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function l(){return t.createVertexArray()}function u(M){return t.bindVertexArray(M)}function d(M){return t.deleteVertexArray(M)}function h(M,N,G){const H=G.wireframe===!0;let $=i[M.id];$===void 0&&($={},i[M.id]=$);let Y=$[N.id];Y===void 0&&(Y={},$[N.id]=Y);let W=Y[H];return W===void 0&&(W=f(l()),Y[H]=W),W}function f(M){const N=[],G=[],H=[];for(let $=0;$<n;$++)N[$]=0,G[$]=0,H[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:G,attributeDivisors:H,object:M,attributes:{},index:null}}function p(M,N,G,H){const $=s.attributes,Y=N.attributes;let W=0;const K=G.getAttributes();for(const D in K)if(K[D].location>=0){const Q=$[D];let ae=Y[D];if(ae===void 0&&(D==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),D==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor)),Q===void 0||Q.attribute!==ae||ae&&Q.data!==ae.data)return!0;W++}return s.attributesNum!==W||s.index!==H}function x(M,N,G,H){const $={},Y=N.attributes;let W=0;const K=G.getAttributes();for(const D in K)if(K[D].location>=0){let Q=Y[D];Q===void 0&&(D==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),D==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const ae={};ae.attribute=Q,Q&&Q.data&&(ae.data=Q.data),$[D]=ae,W++}s.attributes=$,s.attributesNum=W,s.index=H}function _(){const M=s.newAttributes;for(let N=0,G=M.length;N<G;N++)M[N]=0}function m(M){c(M,0)}function c(M,N){const G=s.newAttributes,H=s.enabledAttributes,$=s.attributeDivisors;G[M]=1,H[M]===0&&(t.enableVertexAttribArray(M),H[M]=1),$[M]!==N&&(t.vertexAttribDivisor(M,N),$[M]=N)}function v(){const M=s.newAttributes,N=s.enabledAttributes;for(let G=0,H=N.length;G<H;G++)N[G]!==M[G]&&(t.disableVertexAttribArray(G),N[G]=0)}function g(M,N,G,H,$,Y,W){W===!0?t.vertexAttribIPointer(M,N,G,$,Y):t.vertexAttribPointer(M,N,G,H,$,Y)}function y(M,N,G,H){_();const $=H.attributes,Y=G.getAttributes(),W=N.defaultAttributeValues;for(const K in Y){const D=Y[K];if(D.location>=0){let X=$[K];if(X===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(X=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(X=M.instanceColor)),X!==void 0){const Q=X.normalized,ae=X.itemSize,Se=e.get(X);if(Se===void 0)continue;const Ve=Se.buffer,V=Se.type,ne=Se.bytesPerElement,fe=V===t.INT||V===t.UNSIGNED_INT||X.gpuType===Mf;if(X.isInterleavedBufferAttribute){const ce=X.data,Ae=ce.stride,Le=X.offset;if(ce.isInstancedInterleavedBuffer){for(let Be=0;Be<D.locationSize;Be++)c(D.location+Be,ce.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Be=0;Be<D.locationSize;Be++)m(D.location+Be);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let Be=0;Be<D.locationSize;Be++)g(D.location+Be,ae/D.locationSize,V,Q,Ae*ne,(Le+ae/D.locationSize*Be)*ne,fe)}else{if(X.isInstancedBufferAttribute){for(let ce=0;ce<D.locationSize;ce++)c(D.location+ce,X.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let ce=0;ce<D.locationSize;ce++)m(D.location+ce);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let ce=0;ce<D.locationSize;ce++)g(D.location+ce,ae/D.locationSize,V,Q,ae*ne,ae/D.locationSize*ce*ne,fe)}}else if(W!==void 0){const Q=W[K];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(D.location,Q);break;case 3:t.vertexAttrib3fv(D.location,Q);break;case 4:t.vertexAttrib4fv(D.location,Q);break;default:t.vertexAttrib1fv(D.location,Q)}}}}v()}function b(){L();for(const M in i){const N=i[M];for(const G in N){const H=N[G];for(const $ in H)d(H[$].object),delete H[$];delete N[G]}delete i[M]}}function C(M){if(i[M.id]===void 0)return;const N=i[M.id];for(const G in N){const H=N[G];for(const $ in H)d(H[$].object),delete H[$];delete N[G]}delete i[M.id]}function A(M){for(const N in i){const G=i[N];if(G[M.id]===void 0)continue;const H=G[M.id];for(const $ in H)d(H[$].object),delete H[$];delete G[M.id]}}function L(){T(),a=!0,s!==r&&(s=r,u(s.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:L,resetDefaultState:T,dispose:b,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function e1(t,e,n){let i;function r(u){i=u}function s(u,d){t.drawArrays(i,u,d),n.update(d,i,1)}function a(u,d,h){h!==0&&(t.drawArraysInstanced(i,u,d,h),n.update(d,i,h))}function o(u,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,u,0,d,0,h);let p=0;for(let x=0;x<h;x++)p+=d[x];n.update(p,i,1)}function l(u,d,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<u.length;x++)a(u[x],d[x],f[x]);else{p.multiDrawArraysInstancedWEBGL(i,u,0,d,0,f,0,h);let x=0;for(let _=0;_<h;_++)x+=d[_];for(let _=0;_<f.length;_++)n.update(x,i,f[_])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function t1(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==Dn&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const A=C===Ua&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==_i&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ci&&!A)}function l(C){if(C==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=n.precision!==void 0?n.precision:"highp";const d=l(u);d!==u&&(console.warn("THREE.WebGLRenderer:",u,"not supported, using",d,"instead."),u=d);const h=n.logarithmicDepthBuffer===!0,f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_TEXTURE_SIZE),_=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),m=t.getParameter(t.MAX_VERTEX_ATTRIBS),c=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),v=t.getParameter(t.MAX_VARYING_VECTORS),g=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),y=p>0,b=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:u,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:_,maxAttributes:m,maxVertexUniforms:c,maxVaryings:v,maxFragmentUniforms:g,vertexTextures:y,maxSamples:b}}function n1(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new lr,o=new Ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){n=d(h,f,0)},this.setState=function(h,f,p){const x=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,c=t.get(h);if(!r||x===null||x.length===0||s&&!m)s?d(null):u();else{const v=s?0:i,g=v*4;let y=c.clippingState||null;l.value=y,y=d(x,f,g,p);for(let b=0;b!==g;++b)y[b]=n[b];c.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function u(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,f,p,x){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,x!==!0||m===null){const c=p+_*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<c)&&(m=new Float32Array(c));for(let g=0,y=p;g!==_;++g,y+=4)a.copy(h[g]).applyMatrix4(v,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function i1(t){let e=new WeakMap;function n(a,o){return o===jc?a.mapping=Ms:o===Xc&&(a.mapping=Es),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===jc||o===Xc)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const u=new pS(l.height);return u.fromEquirectangularTexture(t,a),e.set(a,u),a.addEventListener("dispose",r),n(u.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Lf extends G0{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,a=s+u*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const ss=4,wp=[.125,.215,.35,.446,.526,.582],dr=20,Gu=new Lf,Tp=new We;let Wu=null,ju=0,Xu=0,qu=!1;const ur=(1+Math.sqrt(5))/2,Xr=1/ur,Ap=[new B(-ur,Xr,0),new B(ur,Xr,0),new B(-Xr,0,ur),new B(Xr,0,ur),new B(0,ur,-Xr),new B(0,ur,Xr),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)];class Cp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Wu=this._renderer.getRenderTarget(),ju=this._renderer.getActiveCubeFace(),Xu=this._renderer.getActiveMipmapLevel(),qu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Wu,ju,Xu),this._renderer.xr.enabled=qu,e.scissorTest=!1,Ao(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ms||e.mapping===Es?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wu=this._renderer.getRenderTarget(),ju=this._renderer.getActiveCubeFace(),Xu=this._renderer.getActiveMipmapLevel(),qu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Nn,minFilter:Nn,generateMipmaps:!1,type:Ua,format:Dn,colorSpace:Zi,depthBuffer:!1},r=Rp(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rp(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=r1(s)),this._blurMaterial=s1(s,e,n)}return r}_compileMaterial(e){const n=new xn(this._lodPlanes[0],e);this._renderer.compile(n,Gu)}_sceneToCubeUV(e,n,i,r){const o=new gn(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Tp),d.toneMapping=Wi,d.autoClear=!1;const p=new B0({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),x=new xn(new Ba,p);let _=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Tp),_=!0);for(let c=0;c<6;c++){const v=c%3;v===0?(o.up.set(0,l[c],0),o.lookAt(u[c],0,0)):v===1?(o.up.set(0,0,l[c]),o.lookAt(0,u[c],0)):(o.up.set(0,l[c],0),o.lookAt(0,0,u[c]));const g=this._cubeSize;Ao(r,v*g,c>2?g:0,g,g),d.setRenderTarget(r),_&&d.render(x,o),d.render(e,o)}x.geometry.dispose(),x.material.dispose(),d.toneMapping=f,d.autoClear=h,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Ms||e.mapping===Es;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bp());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new xn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Ao(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,Gu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ap[(r-s-1)%Ap.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,u=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new xn(this._lodPlanes[r],u),f=u.uniforms,p=this._sizeLods[i]-1,x=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*dr-1),_=s/x,m=isFinite(s)?1+Math.floor(d*_):dr;m>dr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${dr}`);const c=[];let v=0;for(let A=0;A<dr;++A){const L=A/_,T=Math.exp(-L*L/2);c.push(T),A===0?v+=T:A<m&&(v+=2*T)}for(let A=0;A<c.length;A++)c[A]=c[A]/v;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=c,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:g}=this;f.dTheta.value=x,f.mipInt.value=g-i;const y=this._sizeLods[r],b=3*y*(r>g-ss?r-g+ss:0),C=4*(this._cubeSize-y);Ao(n,b,C,3*y,2*y),l.setRenderTarget(n),l.render(h,Gu)}}function r1(t){const e=[],n=[],i=[];let r=t;const s=t-ss+1+wp.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-ss?l=wp[a-t+ss-1]:a===0&&(l=0),i.push(l);const u=1/(o-2),d=-u,h=1+u,f=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,x=6,_=3,m=2,c=1,v=new Float32Array(_*x*p),g=new Float32Array(m*x*p),y=new Float32Array(c*x*p);for(let C=0;C<p;C++){const A=C%3*2/3-1,L=C>2?0:-1,T=[A,L,0,A+2/3,L,0,A+2/3,L+1,0,A,L,0,A+2/3,L+1,0,A,L+1,0];v.set(T,_*x*C),g.set(f,m*x*C);const M=[C,C,C,C,C,C];y.set(M,c*x*C)}const b=new Qi;b.setAttribute("position",new qn(v,_)),b.setAttribute("uv",new qn(g,m)),b.setAttribute("faceIndex",new qn(y,c)),e.push(b),r>ss&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Rp(t,e,n){const i=new Tr(t,e,n);return i.texture.mapping=Gl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ao(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function s1(t,e,n){const i=new Float32Array(dr),r=new B(0,1,0);return new Kn({name:"SphericalGaussianBlur",defines:{n:dr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Nf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Gi,depthTest:!1,depthWrite:!1})}function bp(){return new Kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Gi,depthTest:!1,depthWrite:!1})}function Pp(){return new Kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gi,depthTest:!1,depthWrite:!1})}function Nf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function a1(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,u=l===jc||l===Xc,d=l===Ms||l===Es;if(u||d){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new Cp(t)),h=u?n.fromEquirectangular(o,h):n.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return u&&p&&p.height>0||d&&p&&r(p)?(n===null&&(n=new Cp(t)),h=u?n.fromEquirectangular(o):n.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const u=6;for(let d=0;d<u;d++)o[d]!==void 0&&l++;return l===u}function s(o){const l=o.target;l.removeEventListener("dispose",s);const u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function o1(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&ua("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function l1(t,e,n,i){const r={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);for(const x in f.morphAttributes){const _=f.morphAttributes[x];for(let m=0,c=_.length;m<c;m++)e.remove(_[m])}f.removeEventListener("dispose",a),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,n.memory.geometries++),f}function l(h){const f=h.attributes;for(const x in f)e.update(f[x],t.ARRAY_BUFFER);const p=h.morphAttributes;for(const x in p){const _=p[x];for(let m=0,c=_.length;m<c;m++)e.update(_[m],t.ARRAY_BUFFER)}}function u(h){const f=[],p=h.index,x=h.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let g=0,y=v.length;g<y;g+=3){const b=v[g+0],C=v[g+1],A=v[g+2];f.push(b,C,C,A,A,b)}}else if(x!==void 0){const v=x.array;_=x.version;for(let g=0,y=v.length/3-1;g<y;g+=3){const b=g+0,C=g+1,A=g+2;f.push(b,C,C,A,A,b)}}else return;const m=new(U0(f)?H0:z0)(f,1);m.version=_;const c=s.get(h);c&&e.remove(c),s.set(h,m)}function d(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&u(h)}else u(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function u1(t,e,n){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*a),n.update(p,i,1)}function u(f,p,x){x!==0&&(t.drawElementsInstanced(i,p,s,f*a,x),n.update(p,i,x))}function d(f,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,x);let m=0;for(let c=0;c<x;c++)m+=p[c];n.update(m,i,1)}function h(f,p,x,_){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let c=0;c<f.length;c++)u(f[c]/a,p[c],_[c]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,_,0,x);let c=0;for(let v=0;v<x;v++)c+=p[v];for(let v=0;v<_.length;v++)n.update(c,i,_[v])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function c1(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function d1(t,e,n){const i=new WeakMap,r=new Mt;function s(a,o,l){const u=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let f=i.get(o);if(f===void 0||f.count!==h){let M=function(){L.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var p=M;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,c=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],g=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let b=o.attributes.position.count*y,C=1;b>e.maxTextureSize&&(C=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const A=new Float32Array(b*C*4*h),L=new F0(A,b,C,h);L.type=ci,L.needsUpdate=!0;const T=y*4;for(let N=0;N<h;N++){const G=c[N],H=v[N],$=g[N],Y=b*C*4*N;for(let W=0;W<G.count;W++){const K=W*T;x===!0&&(r.fromBufferAttribute(G,W),A[Y+K+0]=r.x,A[Y+K+1]=r.y,A[Y+K+2]=r.z,A[Y+K+3]=0),_===!0&&(r.fromBufferAttribute(H,W),A[Y+K+4]=r.x,A[Y+K+5]=r.y,A[Y+K+6]=r.z,A[Y+K+7]=0),m===!0&&(r.fromBufferAttribute($,W),A[Y+K+8]=r.x,A[Y+K+9]=r.y,A[Y+K+10]=r.z,A[Y+K+11]=$.itemSize===4?r.w:1)}}f={count:h,texture:L,size:new He(b,C)},i.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let x=0;for(let m=0;m<u.length;m++)x+=u[m];const _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(t,"morphTargetBaseInfluence",_),l.getUniforms().setValue(t,"morphTargetInfluences",u)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function f1(t,e,n,i){let r=new WeakMap;function s(l){const u=i.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==u&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function o(l){const u=l.target;u.removeEventListener("dispose",o),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:s,dispose:a}}class X0 extends Wt{constructor(e,n,i,r,s,a,o,l,u,d=hs){if(d!==hs&&d!==Ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===hs&&(i=wr),i===void 0&&d===Ts&&(i=ws),super(null,r,s,a,o,l,d,i,u),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:_n,this.minFilter=l!==void 0?l:_n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const q0=new Wt,Lp=new X0(1,1),$0=new F0,Y0=new Zy,K0=new W0,Np=[],Dp=[],Up=new Float32Array(16),Ip=new Float32Array(9),Fp=new Float32Array(4);function Ns(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Np[r];if(s===void 0&&(s=new Float32Array(r),Np[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function wt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Tt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function jl(t,e){let n=Dp[e];n===void 0&&(n=new Int32Array(e),Dp[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function h1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function p1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(wt(n,e))return;t.uniform2fv(this.addr,e),Tt(n,e)}}function m1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(wt(n,e))return;t.uniform3fv(this.addr,e),Tt(n,e)}}function g1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(wt(n,e))return;t.uniform4fv(this.addr,e),Tt(n,e)}}function v1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(wt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Tt(n,e)}else{if(wt(n,i))return;Fp.set(i),t.uniformMatrix2fv(this.addr,!1,Fp),Tt(n,i)}}function _1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(wt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Tt(n,e)}else{if(wt(n,i))return;Ip.set(i),t.uniformMatrix3fv(this.addr,!1,Ip),Tt(n,i)}}function x1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(wt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Tt(n,e)}else{if(wt(n,i))return;Up.set(i),t.uniformMatrix4fv(this.addr,!1,Up),Tt(n,i)}}function y1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function S1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(wt(n,e))return;t.uniform2iv(this.addr,e),Tt(n,e)}}function M1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(wt(n,e))return;t.uniform3iv(this.addr,e),Tt(n,e)}}function E1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(wt(n,e))return;t.uniform4iv(this.addr,e),Tt(n,e)}}function w1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function T1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(wt(n,e))return;t.uniform2uiv(this.addr,e),Tt(n,e)}}function A1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(wt(n,e))return;t.uniform3uiv(this.addr,e),Tt(n,e)}}function C1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(wt(n,e))return;t.uniform4uiv(this.addr,e),Tt(n,e)}}function R1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Lp.compareFunction=D0,s=Lp):s=q0,n.setTexture2D(e||s,r)}function b1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Y0,r)}function P1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||K0,r)}function L1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||$0,r)}function N1(t){switch(t){case 5126:return h1;case 35664:return p1;case 35665:return m1;case 35666:return g1;case 35674:return v1;case 35675:return _1;case 35676:return x1;case 5124:case 35670:return y1;case 35667:case 35671:return S1;case 35668:case 35672:return M1;case 35669:case 35673:return E1;case 5125:return w1;case 36294:return T1;case 36295:return A1;case 36296:return C1;case 35678:case 36198:case 36298:case 36306:case 35682:return R1;case 35679:case 36299:case 36307:return b1;case 35680:case 36300:case 36308:case 36293:return P1;case 36289:case 36303:case 36311:case 36292:return L1}}function D1(t,e){t.uniform1fv(this.addr,e)}function U1(t,e){const n=Ns(e,this.size,2);t.uniform2fv(this.addr,n)}function I1(t,e){const n=Ns(e,this.size,3);t.uniform3fv(this.addr,n)}function F1(t,e){const n=Ns(e,this.size,4);t.uniform4fv(this.addr,n)}function k1(t,e){const n=Ns(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function O1(t,e){const n=Ns(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function B1(t,e){const n=Ns(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function z1(t,e){t.uniform1iv(this.addr,e)}function H1(t,e){t.uniform2iv(this.addr,e)}function V1(t,e){t.uniform3iv(this.addr,e)}function G1(t,e){t.uniform4iv(this.addr,e)}function W1(t,e){t.uniform1uiv(this.addr,e)}function j1(t,e){t.uniform2uiv(this.addr,e)}function X1(t,e){t.uniform3uiv(this.addr,e)}function q1(t,e){t.uniform4uiv(this.addr,e)}function $1(t,e,n){const i=this.cache,r=e.length,s=jl(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||q0,s[a])}function Y1(t,e,n){const i=this.cache,r=e.length,s=jl(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||Y0,s[a])}function K1(t,e,n){const i=this.cache,r=e.length,s=jl(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||K0,s[a])}function Z1(t,e,n){const i=this.cache,r=e.length,s=jl(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||$0,s[a])}function Q1(t){switch(t){case 5126:return D1;case 35664:return U1;case 35665:return I1;case 35666:return F1;case 35674:return k1;case 35675:return O1;case 35676:return B1;case 5124:case 35670:return z1;case 35667:case 35671:return H1;case 35668:case 35672:return V1;case 35669:case 35673:return G1;case 5125:return W1;case 36294:return j1;case 36295:return X1;case 36296:return q1;case 35678:case 36198:case 36298:case 36306:case 35682:return $1;case 35679:case 36299:case 36307:return Y1;case 35680:case 36300:case 36308:case 36293:return K1;case 36289:case 36303:case 36311:case 36292:return Z1}}class J1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=N1(n.type)}}class ew{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=Q1(n.type)}}class tw{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const $u=/(\w+)(\])?(\[|\.)?/g;function kp(t,e){t.seq.push(e),t.map[e.id]=e}function nw(t,e,n){const i=t.name,r=i.length;for($u.lastIndex=0;;){const s=$u.exec(i),a=$u.lastIndex;let o=s[1];const l=s[2]==="]",u=s[3];if(l&&(o=o|0),u===void 0||u==="["&&a+2===r){kp(n,u===void 0?new J1(o,t,e):new ew(o,t,e));break}else{let h=n.map[o];h===void 0&&(h=new tw(o),kp(n,h)),n=h}}}class Xo{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);nw(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function Op(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const iw=37297;let rw=0;function sw(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function aw(t){const e=Ke.getPrimaries(Ke.workingColorSpace),n=Ke.getPrimaries(t);let i;switch(e===n?i="":e===Sl&&n===yl?i="LinearDisplayP3ToLinearSRGB":e===yl&&n===Sl&&(i="LinearSRGBToLinearDisplayP3"),t){case Zi:case Wl:return[i,"LinearTransferOETF"];case Pn:case Rf:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Bp(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+sw(t.getShaderSource(e),a)}else return r}function ow(t,e){const n=aw(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function lw(t,e){let n;switch(e){case Ty:n="Linear";break;case Ay:n="Reinhard";break;case Cy:n="Cineon";break;case Ry:n="ACESFilmic";break;case Py:n="AgX";break;case Ly:n="Neutral";break;case by:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Co=new B;function uw(){Ke.getLuminanceCoefficients(Co);const t=Co.x.toFixed(4),e=Co.y.toFixed(4),n=Co.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function cw(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Js).join(`
`)}function dw(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function fw(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Js(t){return t!==""}function zp(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Hp(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const hw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sd(t){return t.replace(hw,mw)}const pw=new Map;function mw(t,e){let n=Ue[e];if(n===void 0){const i=pw.get(e);if(i!==void 0)n=Ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Sd(n)}const gw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vp(t){return t.replace(gw,vw)}function vw(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Gp(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function _w(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===x0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Zx?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===ri&&(e="SHADOWMAP_TYPE_VSM"),e}function xw(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ms:case Es:e="ENVMAP_TYPE_CUBE";break;case Gl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function yw(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Es:e="ENVMAP_MODE_REFRACTION";break}return e}function Sw(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case y0:e="ENVMAP_BLENDING_MULTIPLY";break;case Ey:e="ENVMAP_BLENDING_MIX";break;case wy:e="ENVMAP_BLENDING_ADD";break}return e}function Mw(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function Ew(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=_w(n),u=xw(n),d=yw(n),h=Sw(n),f=Mw(n),p=cw(n),x=dw(s),_=r.createProgram();let m,c,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(Js).join(`
`),m.length>0&&(m+=`
`),c=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(Js).join(`
`),c.length>0&&(c+=`
`)):(m=[Gp(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Js).join(`
`),c=[Gp(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Wi?"#define TONE_MAPPING":"",n.toneMapping!==Wi?Ue.tonemapping_pars_fragment:"",n.toneMapping!==Wi?lw("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,ow("linearToOutputTexel",n.outputColorSpace),uw(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Js).join(`
`)),a=Sd(a),a=zp(a,n),a=Hp(a,n),o=Sd(o),o=zp(o,n),o=Hp(o,n),a=Vp(a),o=Vp(o),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,c=["#define varying in",n.glslVersion===rp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===rp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+c);const g=v+m+a,y=v+c+o,b=Op(r,r.VERTEX_SHADER,g),C=Op(r,r.FRAGMENT_SHADER,y);r.attachShader(_,b),r.attachShader(_,C),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(N){if(t.debug.checkShaderErrors){const G=r.getProgramInfoLog(_).trim(),H=r.getShaderInfoLog(b).trim(),$=r.getShaderInfoLog(C).trim();let Y=!0,W=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(Y=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,_,b,C);else{const K=Bp(r,b,"vertex"),D=Bp(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+G+`
`+K+`
`+D)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(H===""||$==="")&&(W=!1);W&&(N.diagnostics={runnable:Y,programLog:G,vertexShader:{log:H,prefix:m},fragmentShader:{log:$,prefix:c}})}r.deleteShader(b),r.deleteShader(C),L=new Xo(r,_),T=fw(r,_)}let L;this.getUniforms=function(){return L===void 0&&A(this),L};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,iw)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=rw++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=C,this}let ww=0;class Tw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new Aw(e),n.set(e,i)),i}}class Aw{constructor(e){this.id=ww++,this.code=e,this.usedTimes=0}}function Cw(t,e,n,i,r,s,a){const o=new k0,l=new Tw,u=new Set,d=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(T){return u.add(T),T===0?"uv":`uv${T}`}function m(T,M,N,G,H){const $=G.fog,Y=H.geometry,W=T.isMeshStandardMaterial?G.environment:null,K=(T.isMeshStandardMaterial?n:e).get(T.envMap||W),D=K&&K.mapping===Gl?K.image.height:null,X=x[T.type];T.precision!==null&&(p=r.getMaxPrecision(T.precision),p!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",p,"instead."));const Q=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ae=Q!==void 0?Q.length:0;let Se=0;Y.morphAttributes.position!==void 0&&(Se=1),Y.morphAttributes.normal!==void 0&&(Se=2),Y.morphAttributes.color!==void 0&&(Se=3);let Ve,V,ne,fe;if(X){const Xe=Vn[X];Ve=Xe.vertexShader,V=Xe.fragmentShader}else Ve=T.vertexShader,V=T.fragmentShader,l.update(T),ne=l.getVertexShaderID(T),fe=l.getFragmentShaderID(T);const ce=t.getRenderTarget(),Ae=H.isInstancedMesh===!0,Le=H.isBatchedMesh===!0,Be=!!T.map,ut=!!T.matcap,P=!!K,mt=!!T.aoMap,Ze=!!T.lightMap,Je=!!T.bumpMap,Me=!!T.normalMap,gt=!!T.displacementMap,be=!!T.emissiveMap,Ne=!!T.metalnessMap,R=!!T.roughnessMap,S=T.anisotropy>0,z=T.clearcoat>0,Z=T.dispersion>0,ee=T.iridescence>0,J=T.sheen>0,Ee=T.transmission>0,ue=S&&!!T.anisotropyMap,me=z&&!!T.clearcoatMap,De=z&&!!T.clearcoatNormalMap,ie=z&&!!T.clearcoatRoughnessMap,pe=ee&&!!T.iridescenceMap,ze=ee&&!!T.iridescenceThicknessMap,Re=J&&!!T.sheenColorMap,ge=J&&!!T.sheenRoughnessMap,Pe=!!T.specularMap,Fe=!!T.specularColorMap,st=!!T.specularIntensityMap,U=Ee&&!!T.transmissionMap,re=Ee&&!!T.thicknessMap,j=!!T.gradientMap,q=!!T.alphaMap,oe=T.alphaTest>0,we=!!T.alphaHash,Ge=!!T.extensions;let vt=Wi;T.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(vt=t.toneMapping);const bt={shaderID:X,shaderType:T.type,shaderName:T.name,vertexShader:Ve,fragmentShader:V,defines:T.defines,customVertexShaderID:ne,customFragmentShaderID:fe,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:p,batching:Le,batchingColor:Le&&H._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&H.instanceColor!==null,instancingMorph:Ae&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ce===null?t.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Zi,alphaToCoverage:!!T.alphaToCoverage,map:Be,matcap:ut,envMap:P,envMapMode:P&&K.mapping,envMapCubeUVHeight:D,aoMap:mt,lightMap:Ze,bumpMap:Je,normalMap:Me,displacementMap:f&&gt,emissiveMap:be,normalMapObjectSpace:Me&&T.normalMapType===Iy,normalMapTangentSpace:Me&&T.normalMapType===N0,metalnessMap:Ne,roughnessMap:R,anisotropy:S,anisotropyMap:ue,clearcoat:z,clearcoatMap:me,clearcoatNormalMap:De,clearcoatRoughnessMap:ie,dispersion:Z,iridescence:ee,iridescenceMap:pe,iridescenceThicknessMap:ze,sheen:J,sheenColorMap:Re,sheenRoughnessMap:ge,specularMap:Pe,specularColorMap:Fe,specularIntensityMap:st,transmission:Ee,transmissionMap:U,thicknessMap:re,gradientMap:j,opaque:T.transparent===!1&&T.blending===fs&&T.alphaToCoverage===!1,alphaMap:q,alphaTest:oe,alphaHash:we,combine:T.combine,mapUv:Be&&_(T.map.channel),aoMapUv:mt&&_(T.aoMap.channel),lightMapUv:Ze&&_(T.lightMap.channel),bumpMapUv:Je&&_(T.bumpMap.channel),normalMapUv:Me&&_(T.normalMap.channel),displacementMapUv:gt&&_(T.displacementMap.channel),emissiveMapUv:be&&_(T.emissiveMap.channel),metalnessMapUv:Ne&&_(T.metalnessMap.channel),roughnessMapUv:R&&_(T.roughnessMap.channel),anisotropyMapUv:ue&&_(T.anisotropyMap.channel),clearcoatMapUv:me&&_(T.clearcoatMap.channel),clearcoatNormalMapUv:De&&_(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&_(T.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&_(T.iridescenceMap.channel),iridescenceThicknessMapUv:ze&&_(T.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&_(T.sheenColorMap.channel),sheenRoughnessMapUv:ge&&_(T.sheenRoughnessMap.channel),specularMapUv:Pe&&_(T.specularMap.channel),specularColorMapUv:Fe&&_(T.specularColorMap.channel),specularIntensityMapUv:st&&_(T.specularIntensityMap.channel),transmissionMapUv:U&&_(T.transmissionMap.channel),thicknessMapUv:re&&_(T.thicknessMap.channel),alphaMapUv:q&&_(T.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(Me||S),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!Y.attributes.uv&&(Be||q),fog:!!$,useFog:T.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:H.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Se,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:T.dithering,shadowMapEnabled:t.shadowMap.enabled&&N.length>0,shadowMapType:t.shadowMap.type,toneMapping:vt,decodeVideoTexture:Be&&T.map.isVideoTexture===!0&&Ke.getTransfer(T.map.colorSpace)===nt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===oi,flipSided:T.side===en,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Ge&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&T.extensions.multiDraw===!0||Le)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return bt.vertexUv1s=u.has(1),bt.vertexUv2s=u.has(2),bt.vertexUv3s=u.has(3),u.clear(),bt}function c(T){const M=[];if(T.shaderID?M.push(T.shaderID):(M.push(T.customVertexShaderID),M.push(T.customFragmentShaderID)),T.defines!==void 0)for(const N in T.defines)M.push(N),M.push(T.defines[N]);return T.isRawShaderMaterial===!1&&(v(M,T),g(M,T),M.push(t.outputColorSpace)),M.push(T.customProgramCacheKey),M.join()}function v(T,M){T.push(M.precision),T.push(M.outputColorSpace),T.push(M.envMapMode),T.push(M.envMapCubeUVHeight),T.push(M.mapUv),T.push(M.alphaMapUv),T.push(M.lightMapUv),T.push(M.aoMapUv),T.push(M.bumpMapUv),T.push(M.normalMapUv),T.push(M.displacementMapUv),T.push(M.emissiveMapUv),T.push(M.metalnessMapUv),T.push(M.roughnessMapUv),T.push(M.anisotropyMapUv),T.push(M.clearcoatMapUv),T.push(M.clearcoatNormalMapUv),T.push(M.clearcoatRoughnessMapUv),T.push(M.iridescenceMapUv),T.push(M.iridescenceThicknessMapUv),T.push(M.sheenColorMapUv),T.push(M.sheenRoughnessMapUv),T.push(M.specularMapUv),T.push(M.specularColorMapUv),T.push(M.specularIntensityMapUv),T.push(M.transmissionMapUv),T.push(M.thicknessMapUv),T.push(M.combine),T.push(M.fogExp2),T.push(M.sizeAttenuation),T.push(M.morphTargetsCount),T.push(M.morphAttributeCount),T.push(M.numDirLights),T.push(M.numPointLights),T.push(M.numSpotLights),T.push(M.numSpotLightMaps),T.push(M.numHemiLights),T.push(M.numRectAreaLights),T.push(M.numDirLightShadows),T.push(M.numPointLightShadows),T.push(M.numSpotLightShadows),T.push(M.numSpotLightShadowsWithMaps),T.push(M.numLightProbes),T.push(M.shadowMapType),T.push(M.toneMapping),T.push(M.numClippingPlanes),T.push(M.numClipIntersection),T.push(M.depthPacking)}function g(T,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),T.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.skinning&&o.enable(4),M.morphTargets&&o.enable(5),M.morphNormals&&o.enable(6),M.morphColors&&o.enable(7),M.premultipliedAlpha&&o.enable(8),M.shadowMapEnabled&&o.enable(9),M.doubleSided&&o.enable(10),M.flipSided&&o.enable(11),M.useDepthPacking&&o.enable(12),M.dithering&&o.enable(13),M.transmission&&o.enable(14),M.sheen&&o.enable(15),M.opaque&&o.enable(16),M.pointsUvs&&o.enable(17),M.decodeVideoTexture&&o.enable(18),M.alphaToCoverage&&o.enable(19),T.push(o.mask)}function y(T){const M=x[T.type];let N;if(M){const G=Vn[M];N=cS.clone(G.uniforms)}else N=T.uniforms;return N}function b(T,M){let N;for(let G=0,H=d.length;G<H;G++){const $=d[G];if($.cacheKey===M){N=$,++N.usedTimes;break}}return N===void 0&&(N=new Ew(t,M,T,s),d.push(N)),N}function C(T){if(--T.usedTimes===0){const M=d.indexOf(T);d[M]=d[d.length-1],d.pop(),T.destroy()}}function A(T){l.remove(T)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:c,getUniforms:y,acquireProgram:b,releaseProgram:C,releaseShaderCache:A,programs:d,dispose:L}}function Rw(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function bw(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Wp(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function jp(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(h,f,p,x,_,m){let c=t[e];return c===void 0?(c={id:h.id,object:h,geometry:f,material:p,groupOrder:x,renderOrder:h.renderOrder,z:_,group:m},t[e]=c):(c.id=h.id,c.object=h,c.geometry=f,c.material=p,c.groupOrder=x,c.renderOrder=h.renderOrder,c.z=_,c.group=m),e++,c}function o(h,f,p,x,_,m){const c=a(h,f,p,x,_,m);p.transmission>0?i.push(c):p.transparent===!0?r.push(c):n.push(c)}function l(h,f,p,x,_,m){const c=a(h,f,p,x,_,m);p.transmission>0?i.unshift(c):p.transparent===!0?r.unshift(c):n.unshift(c)}function u(h,f){n.length>1&&n.sort(h||bw),i.length>1&&i.sort(f||Wp),r.length>1&&r.sort(f||Wp)}function d(){for(let h=e,f=t.length;h<f;h++){const p=t[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:d,sort:u}}function Pw(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new jp,t.set(i,[a])):r>=s.length?(a=new jp,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function Lw(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new B,color:new We};break;case"SpotLight":n={position:new B,direction:new B,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new B,color:new We,distance:0,decay:0};break;case"HemisphereLight":n={direction:new B,skyColor:new We,groundColor:new We};break;case"RectAreaLight":n={color:new We,position:new B,halfWidth:new B,halfHeight:new B};break}return t[e.id]=n,n}}}function Nw(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let Dw=0;function Uw(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function Iw(t){const e=new Lw,n=Nw(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new B);const r=new B,s=new pt,a=new pt;function o(u){let d=0,h=0,f=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let p=0,x=0,_=0,m=0,c=0,v=0,g=0,y=0,b=0,C=0,A=0;u.sort(Uw);for(let T=0,M=u.length;T<M;T++){const N=u[T],G=N.color,H=N.intensity,$=N.distance,Y=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)d+=G.r*H,h+=G.g*H,f+=G.b*H;else if(N.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(N.sh.coefficients[W],H);A++}else if(N.isDirectionalLight){const W=e.get(N);if(W.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const K=N.shadow,D=n.get(N);D.shadowIntensity=K.intensity,D.shadowBias=K.bias,D.shadowNormalBias=K.normalBias,D.shadowRadius=K.radius,D.shadowMapSize=K.mapSize,i.directionalShadow[p]=D,i.directionalShadowMap[p]=Y,i.directionalShadowMatrix[p]=N.shadow.matrix,v++}i.directional[p]=W,p++}else if(N.isSpotLight){const W=e.get(N);W.position.setFromMatrixPosition(N.matrixWorld),W.color.copy(G).multiplyScalar(H),W.distance=$,W.coneCos=Math.cos(N.angle),W.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),W.decay=N.decay,i.spot[_]=W;const K=N.shadow;if(N.map&&(i.spotLightMap[b]=N.map,b++,K.updateMatrices(N),N.castShadow&&C++),i.spotLightMatrix[_]=K.matrix,N.castShadow){const D=n.get(N);D.shadowIntensity=K.intensity,D.shadowBias=K.bias,D.shadowNormalBias=K.normalBias,D.shadowRadius=K.radius,D.shadowMapSize=K.mapSize,i.spotShadow[_]=D,i.spotShadowMap[_]=Y,y++}_++}else if(N.isRectAreaLight){const W=e.get(N);W.color.copy(G).multiplyScalar(H),W.halfWidth.set(N.width*.5,0,0),W.halfHeight.set(0,N.height*.5,0),i.rectArea[m]=W,m++}else if(N.isPointLight){const W=e.get(N);if(W.color.copy(N.color).multiplyScalar(N.intensity),W.distance=N.distance,W.decay=N.decay,N.castShadow){const K=N.shadow,D=n.get(N);D.shadowIntensity=K.intensity,D.shadowBias=K.bias,D.shadowNormalBias=K.normalBias,D.shadowRadius=K.radius,D.shadowMapSize=K.mapSize,D.shadowCameraNear=K.camera.near,D.shadowCameraFar=K.camera.far,i.pointShadow[x]=D,i.pointShadowMap[x]=Y,i.pointShadowMatrix[x]=N.shadow.matrix,g++}i.point[x]=W,x++}else if(N.isHemisphereLight){const W=e.get(N);W.skyColor.copy(N.color).multiplyScalar(H),W.groundColor.copy(N.groundColor).multiplyScalar(H),i.hemi[c]=W,c++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=f;const L=i.hash;(L.directionalLength!==p||L.pointLength!==x||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==c||L.numDirectionalShadows!==v||L.numPointShadows!==g||L.numSpotShadows!==y||L.numSpotMaps!==b||L.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=x,i.hemi.length=c,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=g,i.pointShadowMap.length=g,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=g,i.spotLightMatrix.length=y+b-C,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,L.directionalLength=p,L.pointLength=x,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=c,L.numDirectionalShadows=v,L.numPointShadows=g,L.numSpotShadows=y,L.numSpotMaps=b,L.numLightProbes=A,i.version=Dw++)}function l(u,d){let h=0,f=0,p=0,x=0,_=0;const m=d.matrixWorldInverse;for(let c=0,v=u.length;c<v;c++){const g=u[c];if(g.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(g.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(g.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),p++}else if(g.isRectAreaLight){const y=i.rectArea[x];y.position.setFromMatrixPosition(g.matrixWorld),y.position.applyMatrix4(m),a.identity(),s.copy(g.matrixWorld),s.premultiply(m),a.extractRotation(s),y.halfWidth.set(g.width*.5,0,0),y.halfHeight.set(0,g.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(g.isPointLight){const y=i.point[f];y.position.setFromMatrixPosition(g.matrixWorld),y.position.applyMatrix4(m),f++}else if(g.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(g.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function Xp(t){const e=new Iw(t),n=[],i=[];function r(d){u.camera=d,n.length=0,i.length=0}function s(d){n.push(d)}function a(d){i.push(d)}function o(){e.setup(n)}function l(d){e.setupView(n,d)}const u={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:u,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function Fw(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Xp(t),e.set(r,[o])):s>=a.length?(o=new Xp(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class kw extends Oa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ow extends Oa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Bw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,zw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Hw(t,e,n){let i=new Pf;const r=new He,s=new He,a=new Mt,o=new kw({depthPacking:Uy}),l=new Ow,u={},d=n.maxTextureSize,h={[qi]:en,[en]:qi,[oi]:oi},f=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Bw,fragmentShader:zw}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const x=new Qi;x.setAttribute("position",new qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new xn(x,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=x0;let c=this.type;this.render=function(C,A,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const T=t.getRenderTarget(),M=t.getActiveCubeFace(),N=t.getActiveMipmapLevel(),G=t.state;G.setBlending(Gi),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const H=c!==ri&&this.type===ri,$=c===ri&&this.type!==ri;for(let Y=0,W=C.length;Y<W;Y++){const K=C[Y],D=K.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);const X=D.getFrameExtents();if(r.multiply(X),s.copy(D.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/X.x),r.x=s.x*X.x,D.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/X.y),r.y=s.y*X.y,D.mapSize.y=s.y)),D.map===null||H===!0||$===!0){const ae=this.type!==ri?{minFilter:_n,magFilter:_n}:{};D.map!==null&&D.map.dispose(),D.map=new Tr(r.x,r.y,ae),D.map.texture.name=K.name+".shadowMap",D.camera.updateProjectionMatrix()}t.setRenderTarget(D.map),t.clear();const Q=D.getViewportCount();for(let ae=0;ae<Q;ae++){const Se=D.getViewport(ae);a.set(s.x*Se.x,s.y*Se.y,s.x*Se.z,s.y*Se.w),G.viewport(a),D.updateMatrices(K,ae),i=D.getFrustum(),y(A,L,D.camera,K,this.type)}D.isPointLightShadow!==!0&&this.type===ri&&v(D,L),D.needsUpdate=!1}c=this.type,m.needsUpdate=!1,t.setRenderTarget(T,M,N)};function v(C,A){const L=e.update(_);f.defines.VSM_SAMPLES!==C.blurSamples&&(f.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Tr(r.x,r.y)),f.uniforms.shadow_pass.value=C.map.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,t.setRenderTarget(C.mapPass),t.clear(),t.renderBufferDirect(A,null,L,f,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,t.setRenderTarget(C.map),t.clear(),t.renderBufferDirect(A,null,L,p,_,null)}function g(C,A,L,T){let M=null;const N=L.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(N!==void 0)M=N;else if(M=L.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=M.uuid,H=A.uuid;let $=u[G];$===void 0&&($={},u[G]=$);let Y=$[H];Y===void 0&&(Y=M.clone(),$[H]=Y,A.addEventListener("dispose",b)),M=Y}if(M.visible=A.visible,M.wireframe=A.wireframe,T===ri?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:h[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,L.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const G=t.properties.get(M);G.light=L}return M}function y(C,A,L,T,M){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&M===ri)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,C.matrixWorld);const H=e.update(C),$=C.material;if(Array.isArray($)){const Y=H.groups;for(let W=0,K=Y.length;W<K;W++){const D=Y[W],X=$[D.materialIndex];if(X&&X.visible){const Q=g(C,X,T,M);C.onBeforeShadow(t,C,A,L,H,Q,D),t.renderBufferDirect(L,null,H,Q,C,D),C.onAfterShadow(t,C,A,L,H,Q,D)}}}else if($.visible){const Y=g(C,$,T,M);C.onBeforeShadow(t,C,A,L,H,Y,null),t.renderBufferDirect(L,null,H,Y,C,null),C.onAfterShadow(t,C,A,L,H,Y,null)}}const G=C.children;for(let H=0,$=G.length;H<$;H++)y(G[H],A,L,T,M)}function b(C){C.target.removeEventListener("dispose",b);for(const L in u){const T=u[L],M=C.target.uuid;M in T&&(T[M].dispose(),delete T[M])}}}function Vw(t){function e(){let U=!1;const re=new Mt;let j=null;const q=new Mt(0,0,0,0);return{setMask:function(oe){j!==oe&&!U&&(t.colorMask(oe,oe,oe,oe),j=oe)},setLocked:function(oe){U=oe},setClear:function(oe,we,Ge,vt,bt){bt===!0&&(oe*=vt,we*=vt,Ge*=vt),re.set(oe,we,Ge,vt),q.equals(re)===!1&&(t.clearColor(oe,we,Ge,vt),q.copy(re))},reset:function(){U=!1,j=null,q.set(-1,0,0,0)}}}function n(){let U=!1,re=null,j=null,q=null;return{setTest:function(oe){oe?fe(t.DEPTH_TEST):ce(t.DEPTH_TEST)},setMask:function(oe){re!==oe&&!U&&(t.depthMask(oe),re=oe)},setFunc:function(oe){if(j!==oe){switch(oe){case gy:t.depthFunc(t.NEVER);break;case vy:t.depthFunc(t.ALWAYS);break;case _y:t.depthFunc(t.LESS);break;case vl:t.depthFunc(t.LEQUAL);break;case xy:t.depthFunc(t.EQUAL);break;case yy:t.depthFunc(t.GEQUAL);break;case Sy:t.depthFunc(t.GREATER);break;case My:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}j=oe}},setLocked:function(oe){U=oe},setClear:function(oe){q!==oe&&(t.clearDepth(oe),q=oe)},reset:function(){U=!1,re=null,j=null,q=null}}}function i(){let U=!1,re=null,j=null,q=null,oe=null,we=null,Ge=null,vt=null,bt=null;return{setTest:function(Xe){U||(Xe?fe(t.STENCIL_TEST):ce(t.STENCIL_TEST))},setMask:function(Xe){re!==Xe&&!U&&(t.stencilMask(Xe),re=Xe)},setFunc:function(Xe,Zn,On){(j!==Xe||q!==Zn||oe!==On)&&(t.stencilFunc(Xe,Zn,On),j=Xe,q=Zn,oe=On)},setOp:function(Xe,Zn,On){(we!==Xe||Ge!==Zn||vt!==On)&&(t.stencilOp(Xe,Zn,On),we=Xe,Ge=Zn,vt=On)},setLocked:function(Xe){U=Xe},setClear:function(Xe){bt!==Xe&&(t.clearStencil(Xe),bt=Xe)},reset:function(){U=!1,re=null,j=null,q=null,oe=null,we=null,Ge=null,vt=null,bt=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,l=new WeakMap;let u={},d={},h=new WeakMap,f=[],p=null,x=!1,_=null,m=null,c=null,v=null,g=null,y=null,b=null,C=new We(0,0,0),A=0,L=!1,T=null,M=null,N=null,G=null,H=null;const $=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,W=0;const K=t.getParameter(t.VERSION);K.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(K)[1]),Y=W>=1):K.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),Y=W>=2);let D=null,X={};const Q=t.getParameter(t.SCISSOR_BOX),ae=t.getParameter(t.VIEWPORT),Se=new Mt().fromArray(Q),Ve=new Mt().fromArray(ae);function V(U,re,j,q){const oe=new Uint8Array(4),we=t.createTexture();t.bindTexture(U,we),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ge=0;Ge<j;Ge++)U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY?t.texImage3D(re,0,t.RGBA,1,1,q,0,t.RGBA,t.UNSIGNED_BYTE,oe):t.texImage2D(re+Ge,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,oe);return we}const ne={};ne[t.TEXTURE_2D]=V(t.TEXTURE_2D,t.TEXTURE_2D,1),ne[t.TEXTURE_CUBE_MAP]=V(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[t.TEXTURE_2D_ARRAY]=V(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ne[t.TEXTURE_3D]=V(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),fe(t.DEPTH_TEST),s.setFunc(vl),Je(!1),Me(Qh),fe(t.CULL_FACE),mt(Gi);function fe(U){u[U]!==!0&&(t.enable(U),u[U]=!0)}function ce(U){u[U]!==!1&&(t.disable(U),u[U]=!1)}function Ae(U,re){return d[U]!==re?(t.bindFramebuffer(U,re),d[U]=re,U===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=re),U===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=re),!0):!1}function Le(U,re){let j=f,q=!1;if(U){j=h.get(re),j===void 0&&(j=[],h.set(re,j));const oe=U.textures;if(j.length!==oe.length||j[0]!==t.COLOR_ATTACHMENT0){for(let we=0,Ge=oe.length;we<Ge;we++)j[we]=t.COLOR_ATTACHMENT0+we;j.length=oe.length,q=!0}}else j[0]!==t.BACK&&(j[0]=t.BACK,q=!0);q&&t.drawBuffers(j)}function Be(U){return p!==U?(t.useProgram(U),p=U,!0):!1}const ut={[cr]:t.FUNC_ADD,[Jx]:t.FUNC_SUBTRACT,[ey]:t.FUNC_REVERSE_SUBTRACT};ut[ty]=t.MIN,ut[ny]=t.MAX;const P={[iy]:t.ZERO,[ry]:t.ONE,[sy]:t.SRC_COLOR,[Gc]:t.SRC_ALPHA,[dy]:t.SRC_ALPHA_SATURATE,[uy]:t.DST_COLOR,[oy]:t.DST_ALPHA,[ay]:t.ONE_MINUS_SRC_COLOR,[Wc]:t.ONE_MINUS_SRC_ALPHA,[cy]:t.ONE_MINUS_DST_COLOR,[ly]:t.ONE_MINUS_DST_ALPHA,[fy]:t.CONSTANT_COLOR,[hy]:t.ONE_MINUS_CONSTANT_COLOR,[py]:t.CONSTANT_ALPHA,[my]:t.ONE_MINUS_CONSTANT_ALPHA};function mt(U,re,j,q,oe,we,Ge,vt,bt,Xe){if(U===Gi){x===!0&&(ce(t.BLEND),x=!1);return}if(x===!1&&(fe(t.BLEND),x=!0),U!==Qx){if(U!==_||Xe!==L){if((m!==cr||g!==cr)&&(t.blendEquation(t.FUNC_ADD),m=cr,g=cr),Xe)switch(U){case fs:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Jh:t.blendFunc(t.ONE,t.ONE);break;case ep:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case tp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case fs:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Jh:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case ep:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case tp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}c=null,v=null,y=null,b=null,C.set(0,0,0),A=0,_=U,L=Xe}return}oe=oe||re,we=we||j,Ge=Ge||q,(re!==m||oe!==g)&&(t.blendEquationSeparate(ut[re],ut[oe]),m=re,g=oe),(j!==c||q!==v||we!==y||Ge!==b)&&(t.blendFuncSeparate(P[j],P[q],P[we],P[Ge]),c=j,v=q,y=we,b=Ge),(vt.equals(C)===!1||bt!==A)&&(t.blendColor(vt.r,vt.g,vt.b,bt),C.copy(vt),A=bt),_=U,L=!1}function Ze(U,re){U.side===oi?ce(t.CULL_FACE):fe(t.CULL_FACE);let j=U.side===en;re&&(j=!j),Je(j),U.blending===fs&&U.transparent===!1?mt(Gi):mt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),r.setMask(U.colorWrite);const q=U.stencilWrite;a.setTest(q),q&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),be(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?fe(t.SAMPLE_ALPHA_TO_COVERAGE):ce(t.SAMPLE_ALPHA_TO_COVERAGE)}function Je(U){T!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),T=U)}function Me(U){U!==Yx?(fe(t.CULL_FACE),U!==M&&(U===Qh?t.cullFace(t.BACK):U===Kx?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ce(t.CULL_FACE),M=U}function gt(U){U!==N&&(Y&&t.lineWidth(U),N=U)}function be(U,re,j){U?(fe(t.POLYGON_OFFSET_FILL),(G!==re||H!==j)&&(t.polygonOffset(re,j),G=re,H=j)):ce(t.POLYGON_OFFSET_FILL)}function Ne(U){U?fe(t.SCISSOR_TEST):ce(t.SCISSOR_TEST)}function R(U){U===void 0&&(U=t.TEXTURE0+$-1),D!==U&&(t.activeTexture(U),D=U)}function S(U,re,j){j===void 0&&(D===null?j=t.TEXTURE0+$-1:j=D);let q=X[j];q===void 0&&(q={type:void 0,texture:void 0},X[j]=q),(q.type!==U||q.texture!==re)&&(D!==j&&(t.activeTexture(j),D=j),t.bindTexture(U,re||ne[U]),q.type=U,q.texture=re)}function z(){const U=X[D];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Z(){try{t.compressedTexImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ee(){try{t.compressedTexImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{t.texSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ee(){try{t.texSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function De(){try{t.texStorage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{t.texStorage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function pe(){try{t.texImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ze(){try{t.texImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Re(U){Se.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),Se.copy(U))}function ge(U){Ve.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),Ve.copy(U))}function Pe(U,re){let j=l.get(re);j===void 0&&(j=new WeakMap,l.set(re,j));let q=j.get(U);q===void 0&&(q=t.getUniformBlockIndex(re,U.name),j.set(U,q))}function Fe(U,re){const q=l.get(re).get(U);o.get(re)!==q&&(t.uniformBlockBinding(re,q,U.__bindingPointIndex),o.set(re,q))}function st(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},D=null,X={},d={},h=new WeakMap,f=[],p=null,x=!1,_=null,m=null,c=null,v=null,g=null,y=null,b=null,C=new We(0,0,0),A=0,L=!1,T=null,M=null,N=null,G=null,H=null,Se.set(0,0,t.canvas.width,t.canvas.height),Ve.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:fe,disable:ce,bindFramebuffer:Ae,drawBuffers:Le,useProgram:Be,setBlending:mt,setMaterial:Ze,setFlipSided:Je,setCullFace:Me,setLineWidth:gt,setPolygonOffset:be,setScissorTest:Ne,activeTexture:R,bindTexture:S,unbindTexture:z,compressedTexImage2D:Z,compressedTexImage3D:ee,texImage2D:pe,texImage3D:ze,updateUBOMapping:Pe,uniformBlockBinding:Fe,texStorage2D:De,texStorage3D:ie,texSubImage2D:J,texSubImage3D:Ee,compressedTexSubImage2D:ue,compressedTexSubImage3D:me,scissor:Re,viewport:ge,reset:st}}function qp(t,e,n,i){const r=Gw(i);switch(n){case T0:return t*e;case C0:return t*e;case R0:return t*e*2;case b0:return t*e/r.components*r.byteLength;case Tf:return t*e/r.components*r.byteLength;case P0:return t*e*2/r.components*r.byteLength;case Af:return t*e*2/r.components*r.byteLength;case A0:return t*e*3/r.components*r.byteLength;case Dn:return t*e*4/r.components*r.byteLength;case Cf:return t*e*4/r.components*r.byteLength;case Ho:case Vo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Go:case Wo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Yc:case Zc:return Math.max(t,16)*Math.max(e,8)/4;case $c:case Kc:return Math.max(t,8)*Math.max(e,8)/2;case Qc:case Jc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case ed:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case td:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case nd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case id:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case rd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case sd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case ad:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case od:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case ld:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case ud:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case cd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case dd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case fd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case hd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case pd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case jo:case md:case gd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case L0:case vd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case _d:case xd:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function Gw(t){switch(t){case _i:case M0:return{byteLength:1,components:1};case Ra:case E0:case Ua:return{byteLength:2,components:1};case Ef:case wf:return{byteLength:2,components:4};case wr:case Mf:case ci:return{byteLength:4,components:1};case w0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function Ww(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new He,d=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,S){return p?new OffscreenCanvas(R,S):El("canvas")}function _(R,S,z){let Z=1;const ee=Ne(R);if((ee.width>z||ee.height>z)&&(Z=z/Math.max(ee.width,ee.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const J=Math.floor(Z*ee.width),Ee=Math.floor(Z*ee.height);h===void 0&&(h=x(J,Ee));const ue=S?x(J,Ee):h;return ue.width=J,ue.height=Ee,ue.getContext("2d").drawImage(R,0,0,J,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+J+"x"+Ee+")."),ue}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==_n&&R.minFilter!==Nn}function c(R){t.generateMipmap(R)}function v(R,S,z,Z,ee=!1){if(R!==null){if(t[R]!==void 0)return t[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let J=S;if(S===t.RED&&(z===t.FLOAT&&(J=t.R32F),z===t.HALF_FLOAT&&(J=t.R16F),z===t.UNSIGNED_BYTE&&(J=t.R8)),S===t.RED_INTEGER&&(z===t.UNSIGNED_BYTE&&(J=t.R8UI),z===t.UNSIGNED_SHORT&&(J=t.R16UI),z===t.UNSIGNED_INT&&(J=t.R32UI),z===t.BYTE&&(J=t.R8I),z===t.SHORT&&(J=t.R16I),z===t.INT&&(J=t.R32I)),S===t.RG&&(z===t.FLOAT&&(J=t.RG32F),z===t.HALF_FLOAT&&(J=t.RG16F),z===t.UNSIGNED_BYTE&&(J=t.RG8)),S===t.RG_INTEGER&&(z===t.UNSIGNED_BYTE&&(J=t.RG8UI),z===t.UNSIGNED_SHORT&&(J=t.RG16UI),z===t.UNSIGNED_INT&&(J=t.RG32UI),z===t.BYTE&&(J=t.RG8I),z===t.SHORT&&(J=t.RG16I),z===t.INT&&(J=t.RG32I)),S===t.RGB&&z===t.UNSIGNED_INT_5_9_9_9_REV&&(J=t.RGB9_E5),S===t.RGBA){const Ee=ee?xl:Ke.getTransfer(Z);z===t.FLOAT&&(J=t.RGBA32F),z===t.HALF_FLOAT&&(J=t.RGBA16F),z===t.UNSIGNED_BYTE&&(J=Ee===nt?t.SRGB8_ALPHA8:t.RGBA8),z===t.UNSIGNED_SHORT_4_4_4_4&&(J=t.RGBA4),z===t.UNSIGNED_SHORT_5_5_5_1&&(J=t.RGB5_A1)}return(J===t.R16F||J===t.R32F||J===t.RG16F||J===t.RG32F||J===t.RGBA16F||J===t.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function g(R,S){let z;return R?S===null||S===wr||S===ws?z=t.DEPTH24_STENCIL8:S===ci?z=t.DEPTH32F_STENCIL8:S===Ra&&(z=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===wr||S===ws?z=t.DEPTH_COMPONENT24:S===ci?z=t.DEPTH_COMPONENT32F:S===Ra&&(z=t.DEPTH_COMPONENT16),z}function y(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==_n&&R.minFilter!==Nn?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function b(R){const S=R.target;S.removeEventListener("dispose",b),A(S),S.isVideoTexture&&d.delete(S)}function C(R){const S=R.target;S.removeEventListener("dispose",C),T(S)}function A(R){const S=i.get(R);if(S.__webglInit===void 0)return;const z=R.source,Z=f.get(z);if(Z){const ee=Z[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&L(R),Object.keys(Z).length===0&&f.delete(z)}i.remove(R)}function L(R){const S=i.get(R);t.deleteTexture(S.__webglTexture);const z=R.source,Z=f.get(z);delete Z[S.__cacheKey],a.memory.textures--}function T(R){const S=i.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let ee=0;ee<S.__webglFramebuffer[Z].length;ee++)t.deleteFramebuffer(S.__webglFramebuffer[Z][ee]);else t.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)t.deleteFramebuffer(S.__webglFramebuffer[Z]);else t.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&t.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&t.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&t.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=R.textures;for(let Z=0,ee=z.length;Z<ee;Z++){const J=i.get(z[Z]);J.__webglTexture&&(t.deleteTexture(J.__webglTexture),a.memory.textures--),i.remove(z[Z])}i.remove(R)}let M=0;function N(){M=0}function G(){const R=M;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),M+=1,R}function H(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function $(R,S){const z=i.get(R);if(R.isVideoTexture&&gt(R),R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){const Z=R.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ve(z,R,S);return}}n.bindTexture(t.TEXTURE_2D,z.__webglTexture,t.TEXTURE0+S)}function Y(R,S){const z=i.get(R);if(R.version>0&&z.__version!==R.version){Ve(z,R,S);return}n.bindTexture(t.TEXTURE_2D_ARRAY,z.__webglTexture,t.TEXTURE0+S)}function W(R,S){const z=i.get(R);if(R.version>0&&z.__version!==R.version){Ve(z,R,S);return}n.bindTexture(t.TEXTURE_3D,z.__webglTexture,t.TEXTURE0+S)}function K(R,S){const z=i.get(R);if(R.version>0&&z.__version!==R.version){V(z,R,S);return}n.bindTexture(t.TEXTURE_CUBE_MAP,z.__webglTexture,t.TEXTURE0+S)}const D={[_l]:t.REPEAT,[mr]:t.CLAMP_TO_EDGE,[qc]:t.MIRRORED_REPEAT},X={[_n]:t.NEAREST,[Ny]:t.NEAREST_MIPMAP_NEAREST,[so]:t.NEAREST_MIPMAP_LINEAR,[Nn]:t.LINEAR,[Mu]:t.LINEAR_MIPMAP_NEAREST,[gr]:t.LINEAR_MIPMAP_LINEAR},Q={[Fy]:t.NEVER,[Vy]:t.ALWAYS,[ky]:t.LESS,[D0]:t.LEQUAL,[Oy]:t.EQUAL,[Hy]:t.GEQUAL,[By]:t.GREATER,[zy]:t.NOTEQUAL};function ae(R,S){if(S.type===ci&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Nn||S.magFilter===Mu||S.magFilter===so||S.magFilter===gr||S.minFilter===Nn||S.minFilter===Mu||S.minFilter===so||S.minFilter===gr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,D[S.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,D[S.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,D[S.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,X[S.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,X[S.minFilter]),S.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,Q[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===_n||S.minFilter!==so&&S.minFilter!==gr||S.type===ci&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Se(R,S){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",b));const Z=S.source;let ee=f.get(Z);ee===void 0&&(ee={},f.set(Z,ee));const J=H(S);if(J!==R.__cacheKey){ee[J]===void 0&&(ee[J]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ee[J].usedTimes++;const Ee=ee[R.__cacheKey];Ee!==void 0&&(ee[R.__cacheKey].usedTimes--,Ee.usedTimes===0&&L(S)),R.__cacheKey=J,R.__webglTexture=ee[J].texture}return z}function Ve(R,S,z){let Z=t.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=t.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=t.TEXTURE_3D);const ee=Se(R,S),J=S.source;n.bindTexture(Z,R.__webglTexture,t.TEXTURE0+z);const Ee=i.get(J);if(J.version!==Ee.__version||ee===!0){n.activeTexture(t.TEXTURE0+z);const ue=Ke.getPrimaries(Ke.workingColorSpace),me=S.colorSpace===Ni?null:Ke.getPrimaries(S.colorSpace),De=S.colorSpace===Ni||ue===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let ie=_(S.image,!1,r.maxTextureSize);ie=be(S,ie);const pe=s.convert(S.format,S.colorSpace),ze=s.convert(S.type);let Re=v(S.internalFormat,pe,ze,S.colorSpace,S.isVideoTexture);ae(Z,S);let ge;const Pe=S.mipmaps,Fe=S.isVideoTexture!==!0,st=Ee.__version===void 0||ee===!0,U=J.dataReady,re=y(S,ie);if(S.isDepthTexture)Re=g(S.format===Ts,S.type),st&&(Fe?n.texStorage2D(t.TEXTURE_2D,1,Re,ie.width,ie.height):n.texImage2D(t.TEXTURE_2D,0,Re,ie.width,ie.height,0,pe,ze,null));else if(S.isDataTexture)if(Pe.length>0){Fe&&st&&n.texStorage2D(t.TEXTURE_2D,re,Re,Pe[0].width,Pe[0].height);for(let j=0,q=Pe.length;j<q;j++)ge=Pe[j],Fe?U&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,ge.width,ge.height,pe,ze,ge.data):n.texImage2D(t.TEXTURE_2D,j,Re,ge.width,ge.height,0,pe,ze,ge.data);S.generateMipmaps=!1}else Fe?(st&&n.texStorage2D(t.TEXTURE_2D,re,Re,ie.width,ie.height),U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ie.width,ie.height,pe,ze,ie.data)):n.texImage2D(t.TEXTURE_2D,0,Re,ie.width,ie.height,0,pe,ze,ie.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Fe&&st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,re,Re,Pe[0].width,Pe[0].height,ie.depth);for(let j=0,q=Pe.length;j<q;j++)if(ge=Pe[j],S.format!==Dn)if(pe!==null)if(Fe){if(U)if(S.layerUpdates.size>0){const oe=qp(ge.width,ge.height,S.format,S.type);for(const we of S.layerUpdates){const Ge=ge.data.subarray(we*oe/ge.data.BYTES_PER_ELEMENT,(we+1)*oe/ge.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,we,ge.width,ge.height,1,pe,Ge,0,0)}S.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,0,ge.width,ge.height,ie.depth,pe,ge.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,j,Re,ge.width,ge.height,ie.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Fe?U&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,0,ge.width,ge.height,ie.depth,pe,ze,ge.data):n.texImage3D(t.TEXTURE_2D_ARRAY,j,Re,ge.width,ge.height,ie.depth,0,pe,ze,ge.data)}else{Fe&&st&&n.texStorage2D(t.TEXTURE_2D,re,Re,Pe[0].width,Pe[0].height);for(let j=0,q=Pe.length;j<q;j++)ge=Pe[j],S.format!==Dn?pe!==null?Fe?U&&n.compressedTexSubImage2D(t.TEXTURE_2D,j,0,0,ge.width,ge.height,pe,ge.data):n.compressedTexImage2D(t.TEXTURE_2D,j,Re,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Fe?U&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,ge.width,ge.height,pe,ze,ge.data):n.texImage2D(t.TEXTURE_2D,j,Re,ge.width,ge.height,0,pe,ze,ge.data)}else if(S.isDataArrayTexture)if(Fe){if(st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,re,Re,ie.width,ie.height,ie.depth),U)if(S.layerUpdates.size>0){const j=qp(ie.width,ie.height,S.format,S.type);for(const q of S.layerUpdates){const oe=ie.data.subarray(q*j/ie.data.BYTES_PER_ELEMENT,(q+1)*j/ie.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,q,ie.width,ie.height,1,pe,ze,oe)}S.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,pe,ze,ie.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Re,ie.width,ie.height,ie.depth,0,pe,ze,ie.data);else if(S.isData3DTexture)Fe?(st&&n.texStorage3D(t.TEXTURE_3D,re,Re,ie.width,ie.height,ie.depth),U&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,pe,ze,ie.data)):n.texImage3D(t.TEXTURE_3D,0,Re,ie.width,ie.height,ie.depth,0,pe,ze,ie.data);else if(S.isFramebufferTexture){if(st)if(Fe)n.texStorage2D(t.TEXTURE_2D,re,Re,ie.width,ie.height);else{let j=ie.width,q=ie.height;for(let oe=0;oe<re;oe++)n.texImage2D(t.TEXTURE_2D,oe,Re,j,q,0,pe,ze,null),j>>=1,q>>=1}}else if(Pe.length>0){if(Fe&&st){const j=Ne(Pe[0]);n.texStorage2D(t.TEXTURE_2D,re,Re,j.width,j.height)}for(let j=0,q=Pe.length;j<q;j++)ge=Pe[j],Fe?U&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,pe,ze,ge):n.texImage2D(t.TEXTURE_2D,j,Re,pe,ze,ge);S.generateMipmaps=!1}else if(Fe){if(st){const j=Ne(ie);n.texStorage2D(t.TEXTURE_2D,re,Re,j.width,j.height)}U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,pe,ze,ie)}else n.texImage2D(t.TEXTURE_2D,0,Re,pe,ze,ie);m(S)&&c(Z),Ee.__version=J.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function V(R,S,z){if(S.image.length!==6)return;const Z=Se(R,S),ee=S.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+z);const J=i.get(ee);if(ee.version!==J.__version||Z===!0){n.activeTexture(t.TEXTURE0+z);const Ee=Ke.getPrimaries(Ke.workingColorSpace),ue=S.colorSpace===Ni?null:Ke.getPrimaries(S.colorSpace),me=S.colorSpace===Ni||Ee===ue?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const De=S.isCompressedTexture||S.image[0].isCompressedTexture,ie=S.image[0]&&S.image[0].isDataTexture,pe=[];for(let q=0;q<6;q++)!De&&!ie?pe[q]=_(S.image[q],!0,r.maxCubemapSize):pe[q]=ie?S.image[q].image:S.image[q],pe[q]=be(S,pe[q]);const ze=pe[0],Re=s.convert(S.format,S.colorSpace),ge=s.convert(S.type),Pe=v(S.internalFormat,Re,ge,S.colorSpace),Fe=S.isVideoTexture!==!0,st=J.__version===void 0||Z===!0,U=ee.dataReady;let re=y(S,ze);ae(t.TEXTURE_CUBE_MAP,S);let j;if(De){Fe&&st&&n.texStorage2D(t.TEXTURE_CUBE_MAP,re,Pe,ze.width,ze.height);for(let q=0;q<6;q++){j=pe[q].mipmaps;for(let oe=0;oe<j.length;oe++){const we=j[oe];S.format!==Dn?Re!==null?Fe?U&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe,0,0,we.width,we.height,Re,we.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe,Pe,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Fe?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe,0,0,we.width,we.height,Re,ge,we.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe,Pe,we.width,we.height,0,Re,ge,we.data)}}}else{if(j=S.mipmaps,Fe&&st){j.length>0&&re++;const q=Ne(pe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,re,Pe,q.width,q.height)}for(let q=0;q<6;q++)if(ie){Fe?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,pe[q].width,pe[q].height,Re,ge,pe[q].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Pe,pe[q].width,pe[q].height,0,Re,ge,pe[q].data);for(let oe=0;oe<j.length;oe++){const Ge=j[oe].image[q].image;Fe?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe+1,0,0,Ge.width,Ge.height,Re,ge,Ge.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe+1,Pe,Ge.width,Ge.height,0,Re,ge,Ge.data)}}else{Fe?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Re,ge,pe[q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Pe,Re,ge,pe[q]);for(let oe=0;oe<j.length;oe++){const we=j[oe];Fe?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe+1,0,0,Re,ge,we.image[q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,oe+1,Pe,Re,ge,we.image[q])}}}m(S)&&c(t.TEXTURE_CUBE_MAP),J.__version=ee.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function ne(R,S,z,Z,ee,J){const Ee=s.convert(z.format,z.colorSpace),ue=s.convert(z.type),me=v(z.internalFormat,Ee,ue,z.colorSpace);if(!i.get(S).__hasExternalTextures){const ie=Math.max(1,S.width>>J),pe=Math.max(1,S.height>>J);ee===t.TEXTURE_3D||ee===t.TEXTURE_2D_ARRAY?n.texImage3D(ee,J,me,ie,pe,S.depth,0,Ee,ue,null):n.texImage2D(ee,J,me,ie,pe,0,Ee,ue,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Me(S)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Z,ee,i.get(z).__webglTexture,0,Je(S)):(ee===t.TEXTURE_2D||ee>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Z,ee,i.get(z).__webglTexture,J),n.bindFramebuffer(t.FRAMEBUFFER,null)}function fe(R,S,z){if(t.bindRenderbuffer(t.RENDERBUFFER,R),S.depthBuffer){const Z=S.depthTexture,ee=Z&&Z.isDepthTexture?Z.type:null,J=g(S.stencilBuffer,ee),Ee=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=Je(S);Me(S)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ue,J,S.width,S.height):z?t.renderbufferStorageMultisample(t.RENDERBUFFER,ue,J,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,J,S.width,S.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ee,t.RENDERBUFFER,R)}else{const Z=S.textures;for(let ee=0;ee<Z.length;ee++){const J=Z[ee],Ee=s.convert(J.format,J.colorSpace),ue=s.convert(J.type),me=v(J.internalFormat,Ee,ue,J.colorSpace),De=Je(S);z&&Me(S)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,De,me,S.width,S.height):Me(S)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,De,me,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,me,S.width,S.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ce(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),$(S.depthTexture,0);const Z=i.get(S.depthTexture).__webglTexture,ee=Je(S);if(S.depthTexture.format===hs)Me(S)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Z,0,ee):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Z,0);else if(S.depthTexture.format===Ts)Me(S)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Z,0,ee):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Ae(R){const S=i.get(R),z=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){const Z=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){const ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",ee)};Z.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=Z}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");ce(S.__webglFramebuffer,R)}else if(z){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=t.createRenderbuffer(),fe(S.__webglDepthbuffer[Z],R,!1);else{const ee=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,J=S.__webglDepthbuffer[Z];t.bindRenderbuffer(t.RENDERBUFFER,J),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,J)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=t.createRenderbuffer(),fe(S.__webglDepthbuffer,R,!1);else{const Z=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ee),t.framebufferRenderbuffer(t.FRAMEBUFFER,Z,t.RENDERBUFFER,ee)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Le(R,S,z){const Z=i.get(R);S!==void 0&&ne(Z.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),z!==void 0&&Ae(R)}function Be(R){const S=R.texture,z=i.get(R),Z=i.get(S);R.addEventListener("dispose",C);const ee=R.textures,J=R.isWebGLCubeRenderTarget===!0,Ee=ee.length>1;if(Ee||(Z.__webglTexture===void 0&&(Z.__webglTexture=t.createTexture()),Z.__version=S.version,a.memory.textures++),J){z.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[ue]=[];for(let me=0;me<S.mipmaps.length;me++)z.__webglFramebuffer[ue][me]=t.createFramebuffer()}else z.__webglFramebuffer[ue]=t.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let ue=0;ue<S.mipmaps.length;ue++)z.__webglFramebuffer[ue]=t.createFramebuffer()}else z.__webglFramebuffer=t.createFramebuffer();if(Ee)for(let ue=0,me=ee.length;ue<me;ue++){const De=i.get(ee[ue]);De.__webglTexture===void 0&&(De.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Me(R)===!1){z.__webglMultisampledFramebuffer=t.createFramebuffer(),z.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ue=0;ue<ee.length;ue++){const me=ee[ue];z.__webglColorRenderbuffer[ue]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,z.__webglColorRenderbuffer[ue]);const De=s.convert(me.format,me.colorSpace),ie=s.convert(me.type),pe=v(me.internalFormat,De,ie,me.colorSpace,R.isXRRenderTarget===!0),ze=Je(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,ze,pe,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.RENDERBUFFER,z.__webglColorRenderbuffer[ue])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=t.createRenderbuffer(),fe(z.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(J){n.bindTexture(t.TEXTURE_CUBE_MAP,Z.__webglTexture),ae(t.TEXTURE_CUBE_MAP,S);for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0)for(let me=0;me<S.mipmaps.length;me++)ne(z.__webglFramebuffer[ue][me],R,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,me);else ne(z.__webglFramebuffer[ue],R,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(S)&&c(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ee){for(let ue=0,me=ee.length;ue<me;ue++){const De=ee[ue],ie=i.get(De);n.bindTexture(t.TEXTURE_2D,ie.__webglTexture),ae(t.TEXTURE_2D,De),ne(z.__webglFramebuffer,R,De,t.COLOR_ATTACHMENT0+ue,t.TEXTURE_2D,0),m(De)&&c(t.TEXTURE_2D)}n.unbindTexture()}else{let ue=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ue=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ue,Z.__webglTexture),ae(ue,S),S.mipmaps&&S.mipmaps.length>0)for(let me=0;me<S.mipmaps.length;me++)ne(z.__webglFramebuffer[me],R,S,t.COLOR_ATTACHMENT0,ue,me);else ne(z.__webglFramebuffer,R,S,t.COLOR_ATTACHMENT0,ue,0);m(S)&&c(ue),n.unbindTexture()}R.depthBuffer&&Ae(R)}function ut(R){const S=R.textures;for(let z=0,Z=S.length;z<Z;z++){const ee=S[z];if(m(ee)){const J=R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Ee=i.get(ee).__webglTexture;n.bindTexture(J,Ee),c(J),n.unbindTexture()}}}const P=[],mt=[];function Ze(R){if(R.samples>0){if(Me(R)===!1){const S=R.textures,z=R.width,Z=R.height;let ee=t.COLOR_BUFFER_BIT;const J=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=i.get(R),ue=S.length>1;if(ue)for(let me=0;me<S.length;me++)n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let me=0;me<S.length;me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ee|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ee|=t.STENCIL_BUFFER_BIT)),ue){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[me]);const De=i.get(S[me]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,De,0)}t.blitFramebuffer(0,0,z,Z,0,0,z,Z,ee,t.NEAREST),l===!0&&(P.length=0,mt.length=0,P.push(t.COLOR_ATTACHMENT0+me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(P.push(J),mt.push(J),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,mt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,P))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ue)for(let me=0;me<S.length;me++){n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[me]);const De=i.get(S[me]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,De,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const S=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[S])}}}function Je(R){return Math.min(r.maxSamples,R.samples)}function Me(R){const S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function gt(R){const S=a.render.frame;d.get(R)!==S&&(d.set(R,S),R.update())}function be(R,S){const z=R.colorSpace,Z=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==Zi&&z!==Ni&&(Ke.getTransfer(z)===nt?(Z!==Dn||ee!==_i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}function Ne(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(u.width=R.naturalWidth||R.width,u.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(u.width=R.displayWidth,u.height=R.displayHeight):(u.width=R.width,u.height=R.height),u}this.allocateTextureUnit=G,this.resetTextureUnits=N,this.setTexture2D=$,this.setTexture2DArray=Y,this.setTexture3D=W,this.setTextureCube=K,this.rebindTextures=Le,this.setupRenderTarget=Be,this.updateRenderTargetMipmap=ut,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=Me}function jw(t,e){function n(i,r=Ni){let s;const a=Ke.getTransfer(r);if(i===_i)return t.UNSIGNED_BYTE;if(i===Ef)return t.UNSIGNED_SHORT_4_4_4_4;if(i===wf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===w0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===M0)return t.BYTE;if(i===E0)return t.SHORT;if(i===Ra)return t.UNSIGNED_SHORT;if(i===Mf)return t.INT;if(i===wr)return t.UNSIGNED_INT;if(i===ci)return t.FLOAT;if(i===Ua)return t.HALF_FLOAT;if(i===T0)return t.ALPHA;if(i===A0)return t.RGB;if(i===Dn)return t.RGBA;if(i===C0)return t.LUMINANCE;if(i===R0)return t.LUMINANCE_ALPHA;if(i===hs)return t.DEPTH_COMPONENT;if(i===Ts)return t.DEPTH_STENCIL;if(i===b0)return t.RED;if(i===Tf)return t.RED_INTEGER;if(i===P0)return t.RG;if(i===Af)return t.RG_INTEGER;if(i===Cf)return t.RGBA_INTEGER;if(i===Ho||i===Vo||i===Go||i===Wo)if(a===nt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ho)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Vo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Go)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Wo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ho)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Vo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Go)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Wo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===$c||i===Yc||i===Kc||i===Zc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===$c)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Yc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Kc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Zc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Qc||i===Jc||i===ed)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Qc||i===Jc)return a===nt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ed)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===td||i===nd||i===id||i===rd||i===sd||i===ad||i===od||i===ld||i===ud||i===cd||i===dd||i===fd||i===hd||i===pd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===td)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===nd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===id)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===rd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===sd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ad)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===od)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ld)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ud)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===cd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===dd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===fd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===hd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===pd)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===jo||i===md||i===gd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===jo)return a===nt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===md)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===gd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===L0||i===vd||i===_d||i===xd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===jo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===vd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===_d)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===xd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ws?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class Xw extends gn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ro extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qw={type:"move"};class Yu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ro,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ro,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ro,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){a=!0;for(const _ of e.hand.values()){const m=n.getJointPose(_,i),c=this._getHandJoint(u,_);m!==null&&(c.matrix.fromArray(m.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,c.jointRadius=m.radius),c.visible=m!==null}const d=u.joints["index-finger-tip"],h=u.joints["thumb-tip"],f=d.position.distanceTo(h.position),p=.02,x=.005;u.inputState.pinching&&f>p+x?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&f<=p-x&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qw)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ro;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const $w=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Kw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new Wt,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Kn({vertexShader:$w,fragmentShader:Yw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new xn(new Ls(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Zw extends Ps{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,u=null,d=null,h=null,f=null,p=null,x=null;const _=new Kw,m=n.getContextAttributes();let c=null,v=null;const g=[],y=[],b=new He;let C=null;const A=new gn;A.layers.enable(1),A.viewport=new Mt;const L=new gn;L.layers.enable(2),L.viewport=new Mt;const T=[A,L],M=new Xw;M.layers.enable(1),M.layers.enable(2);let N=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let ne=g[V];return ne===void 0&&(ne=new Yu,g[V]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(V){let ne=g[V];return ne===void 0&&(ne=new Yu,g[V]=ne),ne.getGripSpace()},this.getHand=function(V){let ne=g[V];return ne===void 0&&(ne=new Yu,g[V]=ne),ne.getHandSpace()};function H(V){const ne=y.indexOf(V.inputSource);if(ne===-1)return;const fe=g[ne];fe!==void 0&&(fe.update(V.inputSource,V.frame,u||a),fe.dispatchEvent({type:V.type,data:V.inputSource}))}function $(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",Y);for(let V=0;V<g.length;V++){const ne=y[V];ne!==null&&(y[V]=null,g[V].disconnect(ne))}N=null,G=null,_.reset(),e.setRenderTarget(c),p=null,f=null,h=null,r=null,v=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){s=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||a},this.setReferenceSpace=function(V){u=V},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(c=e.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",$),r.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await n.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(b),r.renderState.layers===void 0){const ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Tr(p.framebufferWidth,p.framebufferHeight,{format:Dn,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,fe=null,ce=null;m.depth&&(ce=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=m.stencil?Ts:hs,fe=m.stencil?ws:wr);const Ae={colorFormat:n.RGBA8,depthFormat:ce,scaleFactor:s};h=new XRWebGLBinding(r,n),f=h.createProjectionLayer(Ae),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new Tr(f.textureWidth,f.textureHeight,{format:Dn,type:_i,depthTexture:new X0(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),u=null,a=await r.requestReferenceSpace(o),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Y(V){for(let ne=0;ne<V.removed.length;ne++){const fe=V.removed[ne],ce=y.indexOf(fe);ce>=0&&(y[ce]=null,g[ce].disconnect(fe))}for(let ne=0;ne<V.added.length;ne++){const fe=V.added[ne];let ce=y.indexOf(fe);if(ce===-1){for(let Le=0;Le<g.length;Le++)if(Le>=y.length){y.push(fe),ce=Le;break}else if(y[Le]===null){y[Le]=fe,ce=Le;break}if(ce===-1)break}const Ae=g[ce];Ae&&Ae.connect(fe)}}const W=new B,K=new B;function D(V,ne,fe){W.setFromMatrixPosition(ne.matrixWorld),K.setFromMatrixPosition(fe.matrixWorld);const ce=W.distanceTo(K),Ae=ne.projectionMatrix.elements,Le=fe.projectionMatrix.elements,Be=Ae[14]/(Ae[10]-1),ut=Ae[14]/(Ae[10]+1),P=(Ae[9]+1)/Ae[5],mt=(Ae[9]-1)/Ae[5],Ze=(Ae[8]-1)/Ae[0],Je=(Le[8]+1)/Le[0],Me=Be*Ze,gt=Be*Je,be=ce/(-Ze+Je),Ne=be*-Ze;if(ne.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Ne),V.translateZ(be),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Ae[10]===-1)V.projectionMatrix.copy(ne.projectionMatrix),V.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const R=Be+be,S=ut+be,z=Me-Ne,Z=gt+(ce-Ne),ee=P*ut/S*R,J=mt*ut/S*R;V.projectionMatrix.makePerspective(z,Z,ee,J,R,S),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function X(V,ne){ne===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(ne.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;let ne=V.near,fe=V.far;_.texture!==null&&(_.depthNear>0&&(ne=_.depthNear),_.depthFar>0&&(fe=_.depthFar)),M.near=L.near=A.near=ne,M.far=L.far=A.far=fe,(N!==M.near||G!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),N=M.near,G=M.far);const ce=V.parent,Ae=M.cameras;X(M,ce);for(let Le=0;Le<Ae.length;Le++)X(Ae[Le],ce);Ae.length===2?D(M,A,L):M.projectionMatrix.copy(A.projectionMatrix),Q(V,M,ce)};function Q(V,ne,fe){fe===null?V.matrix.copy(ne.matrixWorld):(V.matrix.copy(fe.matrixWorld),V.matrix.invert(),V.matrix.multiply(ne.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(ne.projectionMatrix),V.projectionMatrixInverse.copy(ne.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=yd*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(V){l=V,f!==null&&(f.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ae=null;function Se(V,ne){if(d=ne.getViewerPose(u||a),x=ne,d!==null){const fe=d.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let ce=!1;fe.length!==M.cameras.length&&(M.cameras.length=0,ce=!0);for(let Le=0;Le<fe.length;Le++){const Be=fe[Le];let ut=null;if(p!==null)ut=p.getViewport(Be);else{const mt=h.getViewSubImage(f,Be);ut=mt.viewport,Le===0&&(e.setRenderTargetTextures(v,mt.colorTexture,f.ignoreDepthValues?void 0:mt.depthStencilTexture),e.setRenderTarget(v))}let P=T[Le];P===void 0&&(P=new gn,P.layers.enable(Le),P.viewport=new Mt,T[Le]=P),P.matrix.fromArray(Be.transform.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale),P.projectionMatrix.fromArray(Be.projectionMatrix),P.projectionMatrixInverse.copy(P.projectionMatrix).invert(),P.viewport.set(ut.x,ut.y,ut.width,ut.height),Le===0&&(M.matrix.copy(P.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ce===!0&&M.cameras.push(P)}const Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Le=h.getDepthInformation(fe[0]);Le&&Le.isValid&&Le.texture&&_.init(e,Le,r.renderState)}}for(let fe=0;fe<g.length;fe++){const ce=y[fe],Ae=g[fe];ce!==null&&Ae!==void 0&&Ae.update(ce,ne,u||a)}ae&&ae(V,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),x=null}const Ve=new j0;Ve.setAnimationLoop(Se),this.setAnimationLoop=function(V){ae=V},this.dispose=function(){}}}const sr=new Yn,Qw=new pt;function Jw(t,e){function n(m,c){m.matrixAutoUpdate===!0&&m.updateMatrix(),c.value.copy(m.matrix)}function i(m,c){c.color.getRGB(m.fogColor.value,V0(t)),c.isFog?(m.fogNear.value=c.near,m.fogFar.value=c.far):c.isFogExp2&&(m.fogDensity.value=c.density)}function r(m,c,v,g,y){c.isMeshBasicMaterial||c.isMeshLambertMaterial?s(m,c):c.isMeshToonMaterial?(s(m,c),h(m,c)):c.isMeshPhongMaterial?(s(m,c),d(m,c)):c.isMeshStandardMaterial?(s(m,c),f(m,c),c.isMeshPhysicalMaterial&&p(m,c,y)):c.isMeshMatcapMaterial?(s(m,c),x(m,c)):c.isMeshDepthMaterial?s(m,c):c.isMeshDistanceMaterial?(s(m,c),_(m,c)):c.isMeshNormalMaterial?s(m,c):c.isLineBasicMaterial?(a(m,c),c.isLineDashedMaterial&&o(m,c)):c.isPointsMaterial?l(m,c,v,g):c.isSpriteMaterial?u(m,c):c.isShadowMaterial?(m.color.value.copy(c.color),m.opacity.value=c.opacity):c.isShaderMaterial&&(c.uniformsNeedUpdate=!1)}function s(m,c){m.opacity.value=c.opacity,c.color&&m.diffuse.value.copy(c.color),c.emissive&&m.emissive.value.copy(c.emissive).multiplyScalar(c.emissiveIntensity),c.map&&(m.map.value=c.map,n(c.map,m.mapTransform)),c.alphaMap&&(m.alphaMap.value=c.alphaMap,n(c.alphaMap,m.alphaMapTransform)),c.bumpMap&&(m.bumpMap.value=c.bumpMap,n(c.bumpMap,m.bumpMapTransform),m.bumpScale.value=c.bumpScale,c.side===en&&(m.bumpScale.value*=-1)),c.normalMap&&(m.normalMap.value=c.normalMap,n(c.normalMap,m.normalMapTransform),m.normalScale.value.copy(c.normalScale),c.side===en&&m.normalScale.value.negate()),c.displacementMap&&(m.displacementMap.value=c.displacementMap,n(c.displacementMap,m.displacementMapTransform),m.displacementScale.value=c.displacementScale,m.displacementBias.value=c.displacementBias),c.emissiveMap&&(m.emissiveMap.value=c.emissiveMap,n(c.emissiveMap,m.emissiveMapTransform)),c.specularMap&&(m.specularMap.value=c.specularMap,n(c.specularMap,m.specularMapTransform)),c.alphaTest>0&&(m.alphaTest.value=c.alphaTest);const v=e.get(c),g=v.envMap,y=v.envMapRotation;g&&(m.envMap.value=g,sr.copy(y),sr.x*=-1,sr.y*=-1,sr.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(sr.y*=-1,sr.z*=-1),m.envMapRotation.value.setFromMatrix4(Qw.makeRotationFromEuler(sr)),m.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=c.reflectivity,m.ior.value=c.ior,m.refractionRatio.value=c.refractionRatio),c.lightMap&&(m.lightMap.value=c.lightMap,m.lightMapIntensity.value=c.lightMapIntensity,n(c.lightMap,m.lightMapTransform)),c.aoMap&&(m.aoMap.value=c.aoMap,m.aoMapIntensity.value=c.aoMapIntensity,n(c.aoMap,m.aoMapTransform))}function a(m,c){m.diffuse.value.copy(c.color),m.opacity.value=c.opacity,c.map&&(m.map.value=c.map,n(c.map,m.mapTransform))}function o(m,c){m.dashSize.value=c.dashSize,m.totalSize.value=c.dashSize+c.gapSize,m.scale.value=c.scale}function l(m,c,v,g){m.diffuse.value.copy(c.color),m.opacity.value=c.opacity,m.size.value=c.size*v,m.scale.value=g*.5,c.map&&(m.map.value=c.map,n(c.map,m.uvTransform)),c.alphaMap&&(m.alphaMap.value=c.alphaMap,n(c.alphaMap,m.alphaMapTransform)),c.alphaTest>0&&(m.alphaTest.value=c.alphaTest)}function u(m,c){m.diffuse.value.copy(c.color),m.opacity.value=c.opacity,m.rotation.value=c.rotation,c.map&&(m.map.value=c.map,n(c.map,m.mapTransform)),c.alphaMap&&(m.alphaMap.value=c.alphaMap,n(c.alphaMap,m.alphaMapTransform)),c.alphaTest>0&&(m.alphaTest.value=c.alphaTest)}function d(m,c){m.specular.value.copy(c.specular),m.shininess.value=Math.max(c.shininess,1e-4)}function h(m,c){c.gradientMap&&(m.gradientMap.value=c.gradientMap)}function f(m,c){m.metalness.value=c.metalness,c.metalnessMap&&(m.metalnessMap.value=c.metalnessMap,n(c.metalnessMap,m.metalnessMapTransform)),m.roughness.value=c.roughness,c.roughnessMap&&(m.roughnessMap.value=c.roughnessMap,n(c.roughnessMap,m.roughnessMapTransform)),c.envMap&&(m.envMapIntensity.value=c.envMapIntensity)}function p(m,c,v){m.ior.value=c.ior,c.sheen>0&&(m.sheenColor.value.copy(c.sheenColor).multiplyScalar(c.sheen),m.sheenRoughness.value=c.sheenRoughness,c.sheenColorMap&&(m.sheenColorMap.value=c.sheenColorMap,n(c.sheenColorMap,m.sheenColorMapTransform)),c.sheenRoughnessMap&&(m.sheenRoughnessMap.value=c.sheenRoughnessMap,n(c.sheenRoughnessMap,m.sheenRoughnessMapTransform))),c.clearcoat>0&&(m.clearcoat.value=c.clearcoat,m.clearcoatRoughness.value=c.clearcoatRoughness,c.clearcoatMap&&(m.clearcoatMap.value=c.clearcoatMap,n(c.clearcoatMap,m.clearcoatMapTransform)),c.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=c.clearcoatRoughnessMap,n(c.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),c.clearcoatNormalMap&&(m.clearcoatNormalMap.value=c.clearcoatNormalMap,n(c.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(c.clearcoatNormalScale),c.side===en&&m.clearcoatNormalScale.value.negate())),c.dispersion>0&&(m.dispersion.value=c.dispersion),c.iridescence>0&&(m.iridescence.value=c.iridescence,m.iridescenceIOR.value=c.iridescenceIOR,m.iridescenceThicknessMinimum.value=c.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=c.iridescenceThicknessRange[1],c.iridescenceMap&&(m.iridescenceMap.value=c.iridescenceMap,n(c.iridescenceMap,m.iridescenceMapTransform)),c.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=c.iridescenceThicknessMap,n(c.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),c.transmission>0&&(m.transmission.value=c.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),c.transmissionMap&&(m.transmissionMap.value=c.transmissionMap,n(c.transmissionMap,m.transmissionMapTransform)),m.thickness.value=c.thickness,c.thicknessMap&&(m.thicknessMap.value=c.thicknessMap,n(c.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=c.attenuationDistance,m.attenuationColor.value.copy(c.attenuationColor)),c.anisotropy>0&&(m.anisotropyVector.value.set(c.anisotropy*Math.cos(c.anisotropyRotation),c.anisotropy*Math.sin(c.anisotropyRotation)),c.anisotropyMap&&(m.anisotropyMap.value=c.anisotropyMap,n(c.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=c.specularIntensity,m.specularColor.value.copy(c.specularColor),c.specularColorMap&&(m.specularColorMap.value=c.specularColorMap,n(c.specularColorMap,m.specularColorMapTransform)),c.specularIntensityMap&&(m.specularIntensityMap.value=c.specularIntensityMap,n(c.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,c){c.matcap&&(m.matcap.value=c.matcap)}function _(m,c){const v=e.get(c).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function eT(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,g){const y=g.program;i.uniformBlockBinding(v,y)}function u(v,g){let y=r[v.id];y===void 0&&(x(v),y=d(v),r[v.id]=y,v.addEventListener("dispose",m));const b=g.program;i.updateUBOMapping(v,b);const C=e.render.frame;s[v.id]!==C&&(f(v),s[v.id]=C)}function d(v){const g=h();v.__bindingPointIndex=g;const y=t.createBuffer(),b=v.__size,C=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,b,C),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,g,y),y}function h(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const g=r[v.id],y=v.uniforms,b=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,g);for(let C=0,A=y.length;C<A;C++){const L=Array.isArray(y[C])?y[C]:[y[C]];for(let T=0,M=L.length;T<M;T++){const N=L[T];if(p(N,C,T,b)===!0){const G=N.__offset,H=Array.isArray(N.value)?N.value:[N.value];let $=0;for(let Y=0;Y<H.length;Y++){const W=H[Y],K=_(W);typeof W=="number"||typeof W=="boolean"?(N.__data[0]=W,t.bufferSubData(t.UNIFORM_BUFFER,G+$,N.__data)):W.isMatrix3?(N.__data[0]=W.elements[0],N.__data[1]=W.elements[1],N.__data[2]=W.elements[2],N.__data[3]=0,N.__data[4]=W.elements[3],N.__data[5]=W.elements[4],N.__data[6]=W.elements[5],N.__data[7]=0,N.__data[8]=W.elements[6],N.__data[9]=W.elements[7],N.__data[10]=W.elements[8],N.__data[11]=0):(W.toArray(N.__data,$),$+=K.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,G,N.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(v,g,y,b){const C=v.value,A=g+"_"+y;if(b[A]===void 0)return typeof C=="number"||typeof C=="boolean"?b[A]=C:b[A]=C.clone(),!0;{const L=b[A];if(typeof C=="number"||typeof C=="boolean"){if(L!==C)return b[A]=C,!0}else if(L.equals(C)===!1)return L.copy(C),!0}return!1}function x(v){const g=v.uniforms;let y=0;const b=16;for(let A=0,L=g.length;A<L;A++){const T=Array.isArray(g[A])?g[A]:[g[A]];for(let M=0,N=T.length;M<N;M++){const G=T[M],H=Array.isArray(G.value)?G.value:[G.value];for(let $=0,Y=H.length;$<Y;$++){const W=H[$],K=_(W),D=y%b,X=D%K.boundary,Q=D+X;y+=X,Q!==0&&b-Q<K.storage&&(y+=b-Q),G.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=y,y+=K.storage}}}const C=y%b;return C>0&&(y+=b-C),v.__size=y,v.__cache={},this}function _(v){const g={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(g.boundary=4,g.storage=4):v.isVector2?(g.boundary=8,g.storage=8):v.isVector3||v.isColor?(g.boundary=16,g.storage=12):v.isVector4?(g.boundary=16,g.storage=16):v.isMatrix3?(g.boundary=48,g.storage=48):v.isMatrix4?(g.boundary=64,g.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),g}function m(v){const g=v.target;g.removeEventListener("dispose",m);const y=a.indexOf(g.__bindingPointIndex);a.splice(y,1),t.deleteBuffer(r[g.id]),delete r[g.id],delete s[g.id]}function c(){for(const v in r)t.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:l,update:u,dispose:c}}class Z0{constructor(e={}){const{canvas:n=Wy(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const p=new Uint32Array(4),x=new Int32Array(4);let _=null,m=null;const c=[],v=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pn,this.toneMapping=Wi,this.toneMappingExposure=1;const g=this;let y=!1,b=0,C=0,A=null,L=-1,T=null;const M=new Mt,N=new Mt;let G=null;const H=new We(0);let $=0,Y=n.width,W=n.height,K=1,D=null,X=null;const Q=new Mt(0,0,Y,W),ae=new Mt(0,0,Y,W);let Se=!1;const Ve=new Pf;let V=!1,ne=!1;const fe=new pt,ce=new B,Ae=new Mt,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Be=!1;function ut(){return A===null?K:1}let P=i;function mt(E,I){return n.getContext(E,I)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Sf}`),n.addEventListener("webglcontextlost",j,!1),n.addEventListener("webglcontextrestored",q,!1),n.addEventListener("webglcontextcreationerror",oe,!1),P===null){const I="webgl2";if(P=mt(I,E),P===null)throw mt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ze,Je,Me,gt,be,Ne,R,S,z,Z,ee,J,Ee,ue,me,De,ie,pe,ze,Re,ge,Pe,Fe,st;function U(){Ze=new o1(P),Ze.init(),Pe=new jw(P,Ze),Je=new t1(P,Ze,e,Pe),Me=new Vw(P),gt=new c1(P),be=new Rw,Ne=new Ww(P,Ze,Me,be,Je,Pe,gt),R=new i1(g),S=new a1(g),z=new vS(P),Fe=new JE(P,z),Z=new l1(P,z,gt,Fe),ee=new f1(P,Z,z,gt),ze=new d1(P,Je,Ne),De=new n1(be),J=new Cw(g,R,S,Ze,Je,Fe,De),Ee=new Jw(g,be),ue=new Pw,me=new Fw(Ze),pe=new QE(g,R,S,Me,ee,f,l),ie=new Hw(g,ee,Je),st=new eT(P,gt,Je,Me),Re=new e1(P,Ze,gt),ge=new u1(P,Ze,gt),gt.programs=J.programs,g.capabilities=Je,g.extensions=Ze,g.properties=be,g.renderLists=ue,g.shadowMap=ie,g.state=Me,g.info=gt}U();const re=new Zw(g,P);this.xr=re,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const E=Ze.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ze.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(E){E!==void 0&&(K=E,this.setSize(Y,W,!1))},this.getSize=function(E){return E.set(Y,W)},this.setSize=function(E,I,k=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=E,W=I,n.width=Math.floor(E*K),n.height=Math.floor(I*K),k===!0&&(n.style.width=E+"px",n.style.height=I+"px"),this.setViewport(0,0,E,I)},this.getDrawingBufferSize=function(E){return E.set(Y*K,W*K).floor()},this.setDrawingBufferSize=function(E,I,k){Y=E,W=I,K=k,n.width=Math.floor(E*k),n.height=Math.floor(I*k),this.setViewport(0,0,E,I)},this.getCurrentViewport=function(E){return E.copy(M)},this.getViewport=function(E){return E.copy(Q)},this.setViewport=function(E,I,k,O){E.isVector4?Q.set(E.x,E.y,E.z,E.w):Q.set(E,I,k,O),Me.viewport(M.copy(Q).multiplyScalar(K).round())},this.getScissor=function(E){return E.copy(ae)},this.setScissor=function(E,I,k,O){E.isVector4?ae.set(E.x,E.y,E.z,E.w):ae.set(E,I,k,O),Me.scissor(N.copy(ae).multiplyScalar(K).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(E){Me.setScissorTest(Se=E)},this.setOpaqueSort=function(E){D=E},this.setTransparentSort=function(E){X=E},this.getClearColor=function(E){return E.copy(pe.getClearColor())},this.setClearColor=function(){pe.setClearColor.apply(pe,arguments)},this.getClearAlpha=function(){return pe.getClearAlpha()},this.setClearAlpha=function(){pe.setClearAlpha.apply(pe,arguments)},this.clear=function(E=!0,I=!0,k=!0){let O=0;if(E){let F=!1;if(A!==null){const se=A.texture.format;F=se===Cf||se===Af||se===Tf}if(F){const se=A.texture.type,de=se===_i||se===wr||se===Ra||se===ws||se===Ef||se===wf,ve=pe.getClearColor(),_e=pe.getClearAlpha(),Te=ve.r,Ce=ve.g,xe=ve.b;de?(p[0]=Te,p[1]=Ce,p[2]=xe,p[3]=_e,P.clearBufferuiv(P.COLOR,0,p)):(x[0]=Te,x[1]=Ce,x[2]=xe,x[3]=_e,P.clearBufferiv(P.COLOR,0,x))}else O|=P.COLOR_BUFFER_BIT}I&&(O|=P.DEPTH_BUFFER_BIT),k&&(O|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",j,!1),n.removeEventListener("webglcontextrestored",q,!1),n.removeEventListener("webglcontextcreationerror",oe,!1),ue.dispose(),me.dispose(),be.dispose(),R.dispose(),S.dispose(),ee.dispose(),Fe.dispose(),st.dispose(),J.dispose(),re.dispose(),re.removeEventListener("sessionstart",On),re.removeEventListener("sessionend",If),Ji.stop()};function j(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function q(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const E=gt.autoReset,I=ie.enabled,k=ie.autoUpdate,O=ie.needsUpdate,F=ie.type;U(),gt.autoReset=E,ie.enabled=I,ie.autoUpdate=k,ie.needsUpdate=O,ie.type=F}function oe(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function we(E){const I=E.target;I.removeEventListener("dispose",we),Ge(I)}function Ge(E){vt(E),be.remove(E)}function vt(E){const I=be.get(E).programs;I!==void 0&&(I.forEach(function(k){J.releaseProgram(k)}),E.isShaderMaterial&&J.releaseShaderCache(E))}this.renderBufferDirect=function(E,I,k,O,F,se){I===null&&(I=Le);const de=F.isMesh&&F.matrixWorld.determinant()<0,ve=tv(E,I,k,O,F);Me.setMaterial(O,de);let _e=k.index,Te=1;if(O.wireframe===!0){if(_e=Z.getWireframeAttribute(k),_e===void 0)return;Te=2}const Ce=k.drawRange,xe=k.attributes.position;let qe=Ce.start*Te,ct=(Ce.start+Ce.count)*Te;se!==null&&(qe=Math.max(qe,se.start*Te),ct=Math.min(ct,(se.start+se.count)*Te)),_e!==null?(qe=Math.max(qe,0),ct=Math.min(ct,_e.count)):xe!=null&&(qe=Math.max(qe,0),ct=Math.min(ct,xe.count));const dt=ct-qe;if(dt<0||dt===1/0)return;Fe.setup(F,O,ve,k,_e);let tn,$e=Re;if(_e!==null&&(tn=z.get(_e),$e=ge,$e.setIndex(tn)),F.isMesh)O.wireframe===!0?(Me.setLineWidth(O.wireframeLinewidth*ut()),$e.setMode(P.LINES)):$e.setMode(P.TRIANGLES);else if(F.isLine){let ye=O.linewidth;ye===void 0&&(ye=1),Me.setLineWidth(ye*ut()),F.isLineSegments?$e.setMode(P.LINES):F.isLineLoop?$e.setMode(P.LINE_LOOP):$e.setMode(P.LINE_STRIP)}else F.isPoints?$e.setMode(P.POINTS):F.isSprite&&$e.setMode(P.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)$e.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Ze.get("WEBGL_multi_draw"))$e.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const ye=F._multiDrawStarts,Pt=F._multiDrawCounts,Ye=F._multiDrawCount,En=_e?z.get(_e).bytesPerElement:1,Rr=be.get(O).currentProgram.getUniforms();for(let nn=0;nn<Ye;nn++)Rr.setValue(P,"_gl_DrawID",nn),$e.render(ye[nn]/En,Pt[nn])}else if(F.isInstancedMesh)$e.renderInstances(qe,dt,F.count);else if(k.isInstancedBufferGeometry){const ye=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Pt=Math.min(k.instanceCount,ye);$e.renderInstances(qe,dt,Pt)}else $e.render(qe,dt)};function bt(E,I,k){E.transparent===!0&&E.side===oi&&E.forceSinglePass===!1?(E.side=en,E.needsUpdate=!0,Ha(E,I,k),E.side=qi,E.needsUpdate=!0,Ha(E,I,k),E.side=oi):Ha(E,I,k)}this.compile=function(E,I,k=null){k===null&&(k=E),m=me.get(k),m.init(I),v.push(m),k.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),E!==k&&E.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),m.setupLights();const O=new Set;return E.traverse(function(F){const se=F.material;if(se)if(Array.isArray(se))for(let de=0;de<se.length;de++){const ve=se[de];bt(ve,k,F),O.add(ve)}else bt(se,k,F),O.add(se)}),v.pop(),m=null,O},this.compileAsync=function(E,I,k=null){const O=this.compile(E,I,k);return new Promise(F=>{function se(){if(O.forEach(function(de){be.get(de).currentProgram.isReady()&&O.delete(de)}),O.size===0){F(E);return}setTimeout(se,10)}Ze.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Xe=null;function Zn(E){Xe&&Xe(E)}function On(){Ji.stop()}function If(){Ji.start()}const Ji=new j0;Ji.setAnimationLoop(Zn),typeof self<"u"&&Ji.setContext(self),this.setAnimationLoop=function(E){Xe=E,re.setAnimationLoop(E),E===null?Ji.stop():Ji.start()},re.addEventListener("sessionstart",On),re.addEventListener("sessionend",If),this.render=function(E,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(I),I=re.getCamera()),E.isScene===!0&&E.onBeforeRender(g,E,I,A),m=me.get(E,v.length),m.init(I),v.push(m),fe.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Ve.setFromProjectionMatrix(fe),ne=this.localClippingEnabled,V=De.init(this.clippingPlanes,ne),_=ue.get(E,c.length),_.init(),c.push(_),re.enabled===!0&&re.isPresenting===!0){const se=g.xr.getDepthSensingMesh();se!==null&&Xl(se,I,-1/0,g.sortObjects)}Xl(E,I,0,g.sortObjects),_.finish(),g.sortObjects===!0&&_.sort(D,X),Be=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,Be&&pe.addToRenderList(_,E),this.info.render.frame++,V===!0&&De.beginShadows();const k=m.state.shadowsArray;ie.render(k,E,I),V===!0&&De.endShadows(),this.info.autoReset===!0&&this.info.reset();const O=_.opaque,F=_.transmissive;if(m.setupLights(),I.isArrayCamera){const se=I.cameras;if(F.length>0)for(let de=0,ve=se.length;de<ve;de++){const _e=se[de];kf(O,F,E,_e)}Be&&pe.render(E);for(let de=0,ve=se.length;de<ve;de++){const _e=se[de];Ff(_,E,_e,_e.viewport)}}else F.length>0&&kf(O,F,E,I),Be&&pe.render(E),Ff(_,E,I);A!==null&&(Ne.updateMultisampleRenderTarget(A),Ne.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(g,E,I),Fe.resetDefaultState(),L=-1,T=null,v.pop(),v.length>0?(m=v[v.length-1],V===!0&&De.setGlobalState(g.clippingPlanes,m.state.camera)):m=null,c.pop(),c.length>0?_=c[c.length-1]:_=null};function Xl(E,I,k,O){if(E.visible===!1)return;if(E.layers.test(I.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(I);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ve.intersectsSprite(E)){O&&Ae.setFromMatrixPosition(E.matrixWorld).applyMatrix4(fe);const de=ee.update(E),ve=E.material;ve.visible&&_.push(E,de,ve,k,Ae.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ve.intersectsObject(E))){const de=ee.update(E),ve=E.material;if(O&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ae.copy(E.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Ae.copy(de.boundingSphere.center)),Ae.applyMatrix4(E.matrixWorld).applyMatrix4(fe)),Array.isArray(ve)){const _e=de.groups;for(let Te=0,Ce=_e.length;Te<Ce;Te++){const xe=_e[Te],qe=ve[xe.materialIndex];qe&&qe.visible&&_.push(E,de,qe,k,Ae.z,xe)}}else ve.visible&&_.push(E,de,ve,k,Ae.z,null)}}const se=E.children;for(let de=0,ve=se.length;de<ve;de++)Xl(se[de],I,k,O)}function Ff(E,I,k,O){const F=E.opaque,se=E.transmissive,de=E.transparent;m.setupLightsView(k),V===!0&&De.setGlobalState(g.clippingPlanes,k),O&&Me.viewport(M.copy(O)),F.length>0&&za(F,I,k),se.length>0&&za(se,I,k),de.length>0&&za(de,I,k),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function kf(E,I,k,O){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[O.id]===void 0&&(m.state.transmissionRenderTarget[O.id]=new Tr(1,1,{generateMipmaps:!0,type:Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float")?Ua:_i,minFilter:gr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));const se=m.state.transmissionRenderTarget[O.id],de=O.viewport||M;se.setSize(de.z,de.w);const ve=g.getRenderTarget();g.setRenderTarget(se),g.getClearColor(H),$=g.getClearAlpha(),$<1&&g.setClearColor(16777215,.5),g.clear(),Be&&pe.render(k);const _e=g.toneMapping;g.toneMapping=Wi;const Te=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),m.setupLightsView(O),V===!0&&De.setGlobalState(g.clippingPlanes,O),za(E,k,O),Ne.updateMultisampleRenderTarget(se),Ne.updateRenderTargetMipmap(se),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let xe=0,qe=I.length;xe<qe;xe++){const ct=I[xe],dt=ct.object,tn=ct.geometry,$e=ct.material,ye=ct.group;if($e.side===oi&&dt.layers.test(O.layers)){const Pt=$e.side;$e.side=en,$e.needsUpdate=!0,Of(dt,k,O,tn,$e,ye),$e.side=Pt,$e.needsUpdate=!0,Ce=!0}}Ce===!0&&(Ne.updateMultisampleRenderTarget(se),Ne.updateRenderTargetMipmap(se))}g.setRenderTarget(ve),g.setClearColor(H,$),Te!==void 0&&(O.viewport=Te),g.toneMapping=_e}function za(E,I,k){const O=I.isScene===!0?I.overrideMaterial:null;for(let F=0,se=E.length;F<se;F++){const de=E[F],ve=de.object,_e=de.geometry,Te=O===null?de.material:O,Ce=de.group;ve.layers.test(k.layers)&&Of(ve,I,k,_e,Te,Ce)}}function Of(E,I,k,O,F,se){E.onBeforeRender(g,I,k,O,F,se),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(g,I,k,O,E,se),F.transparent===!0&&F.side===oi&&F.forceSinglePass===!1?(F.side=en,F.needsUpdate=!0,g.renderBufferDirect(k,I,O,F,E,se),F.side=qi,F.needsUpdate=!0,g.renderBufferDirect(k,I,O,F,E,se),F.side=oi):g.renderBufferDirect(k,I,O,F,E,se),E.onAfterRender(g,I,k,O,F,se)}function Ha(E,I,k){I.isScene!==!0&&(I=Le);const O=be.get(E),F=m.state.lights,se=m.state.shadowsArray,de=F.state.version,ve=J.getParameters(E,F.state,se,I,k),_e=J.getProgramCacheKey(ve);let Te=O.programs;O.environment=E.isMeshStandardMaterial?I.environment:null,O.fog=I.fog,O.envMap=(E.isMeshStandardMaterial?S:R).get(E.envMap||O.environment),O.envMapRotation=O.environment!==null&&E.envMap===null?I.environmentRotation:E.envMapRotation,Te===void 0&&(E.addEventListener("dispose",we),Te=new Map,O.programs=Te);let Ce=Te.get(_e);if(Ce!==void 0){if(O.currentProgram===Ce&&O.lightsStateVersion===de)return zf(E,ve),Ce}else ve.uniforms=J.getUniforms(E),E.onBeforeCompile(ve,g),Ce=J.acquireProgram(ve,_e),Te.set(_e,Ce),O.uniforms=ve.uniforms;const xe=O.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(xe.clippingPlanes=De.uniform),zf(E,ve),O.needsLights=iv(E),O.lightsStateVersion=de,O.needsLights&&(xe.ambientLightColor.value=F.state.ambient,xe.lightProbe.value=F.state.probe,xe.directionalLights.value=F.state.directional,xe.directionalLightShadows.value=F.state.directionalShadow,xe.spotLights.value=F.state.spot,xe.spotLightShadows.value=F.state.spotShadow,xe.rectAreaLights.value=F.state.rectArea,xe.ltc_1.value=F.state.rectAreaLTC1,xe.ltc_2.value=F.state.rectAreaLTC2,xe.pointLights.value=F.state.point,xe.pointLightShadows.value=F.state.pointShadow,xe.hemisphereLights.value=F.state.hemi,xe.directionalShadowMap.value=F.state.directionalShadowMap,xe.directionalShadowMatrix.value=F.state.directionalShadowMatrix,xe.spotShadowMap.value=F.state.spotShadowMap,xe.spotLightMatrix.value=F.state.spotLightMatrix,xe.spotLightMap.value=F.state.spotLightMap,xe.pointShadowMap.value=F.state.pointShadowMap,xe.pointShadowMatrix.value=F.state.pointShadowMatrix),O.currentProgram=Ce,O.uniformsList=null,Ce}function Bf(E){if(E.uniformsList===null){const I=E.currentProgram.getUniforms();E.uniformsList=Xo.seqWithValue(I.seq,E.uniforms)}return E.uniformsList}function zf(E,I){const k=be.get(E);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function tv(E,I,k,O,F){I.isScene!==!0&&(I=Le),Ne.resetTextureUnits();const se=I.fog,de=O.isMeshStandardMaterial?I.environment:null,ve=A===null?g.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Zi,_e=(O.isMeshStandardMaterial?S:R).get(O.envMap||de),Te=O.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ce=!!k.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),xe=!!k.morphAttributes.position,qe=!!k.morphAttributes.normal,ct=!!k.morphAttributes.color;let dt=Wi;O.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(dt=g.toneMapping);const tn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,$e=tn!==void 0?tn.length:0,ye=be.get(O),Pt=m.state.lights;if(V===!0&&(ne===!0||E!==T)){const fn=E===T&&O.id===L;De.setState(O,E,fn)}let Ye=!1;O.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Pt.state.version||ye.outputColorSpace!==ve||F.isBatchedMesh&&ye.batching===!1||!F.isBatchedMesh&&ye.batching===!0||F.isBatchedMesh&&ye.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&ye.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&ye.instancing===!1||!F.isInstancedMesh&&ye.instancing===!0||F.isSkinnedMesh&&ye.skinning===!1||!F.isSkinnedMesh&&ye.skinning===!0||F.isInstancedMesh&&ye.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&ye.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&ye.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&ye.instancingMorph===!1&&F.morphTexture!==null||ye.envMap!==_e||O.fog===!0&&ye.fog!==se||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==De.numPlanes||ye.numIntersection!==De.numIntersection)||ye.vertexAlphas!==Te||ye.vertexTangents!==Ce||ye.morphTargets!==xe||ye.morphNormals!==qe||ye.morphColors!==ct||ye.toneMapping!==dt||ye.morphTargetsCount!==$e)&&(Ye=!0):(Ye=!0,ye.__version=O.version);let En=ye.currentProgram;Ye===!0&&(En=Ha(O,I,F));let Rr=!1,nn=!1,ql=!1;const _t=En.getUniforms(),yi=ye.uniforms;if(Me.useProgram(En.program)&&(Rr=!0,nn=!0,ql=!0),O.id!==L&&(L=O.id,nn=!0),Rr||T!==E){_t.setValue(P,"projectionMatrix",E.projectionMatrix),_t.setValue(P,"viewMatrix",E.matrixWorldInverse);const fn=_t.map.cameraPosition;fn!==void 0&&fn.setValue(P,ce.setFromMatrixPosition(E.matrixWorld)),Je.logarithmicDepthBuffer&&_t.setValue(P,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&_t.setValue(P,"isOrthographic",E.isOrthographicCamera===!0),T!==E&&(T=E,nn=!0,ql=!0)}if(F.isSkinnedMesh){_t.setOptional(P,F,"bindMatrix"),_t.setOptional(P,F,"bindMatrixInverse");const fn=F.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),_t.setValue(P,"boneTexture",fn.boneTexture,Ne))}F.isBatchedMesh&&(_t.setOptional(P,F,"batchingTexture"),_t.setValue(P,"batchingTexture",F._matricesTexture,Ne),_t.setOptional(P,F,"batchingIdTexture"),_t.setValue(P,"batchingIdTexture",F._indirectTexture,Ne),_t.setOptional(P,F,"batchingColorTexture"),F._colorsTexture!==null&&_t.setValue(P,"batchingColorTexture",F._colorsTexture,Ne));const $l=k.morphAttributes;if(($l.position!==void 0||$l.normal!==void 0||$l.color!==void 0)&&ze.update(F,k,En),(nn||ye.receiveShadow!==F.receiveShadow)&&(ye.receiveShadow=F.receiveShadow,_t.setValue(P,"receiveShadow",F.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(yi.envMap.value=_e,yi.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),O.isMeshStandardMaterial&&O.envMap===null&&I.environment!==null&&(yi.envMapIntensity.value=I.environmentIntensity),nn&&(_t.setValue(P,"toneMappingExposure",g.toneMappingExposure),ye.needsLights&&nv(yi,ql),se&&O.fog===!0&&Ee.refreshFogUniforms(yi,se),Ee.refreshMaterialUniforms(yi,O,K,W,m.state.transmissionRenderTarget[E.id]),Xo.upload(P,Bf(ye),yi,Ne)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Xo.upload(P,Bf(ye),yi,Ne),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&_t.setValue(P,"center",F.center),_t.setValue(P,"modelViewMatrix",F.modelViewMatrix),_t.setValue(P,"normalMatrix",F.normalMatrix),_t.setValue(P,"modelMatrix",F.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){const fn=O.uniformsGroups;for(let Yl=0,rv=fn.length;Yl<rv;Yl++){const Hf=fn[Yl];st.update(Hf,En),st.bind(Hf,En)}}return En}function nv(E,I){E.ambientLightColor.needsUpdate=I,E.lightProbe.needsUpdate=I,E.directionalLights.needsUpdate=I,E.directionalLightShadows.needsUpdate=I,E.pointLights.needsUpdate=I,E.pointLightShadows.needsUpdate=I,E.spotLights.needsUpdate=I,E.spotLightShadows.needsUpdate=I,E.rectAreaLights.needsUpdate=I,E.hemisphereLights.needsUpdate=I}function iv(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,I,k){be.get(E.texture).__webglTexture=I,be.get(E.depthTexture).__webglTexture=k;const O=be.get(E);O.__hasExternalTextures=!0,O.__autoAllocateDepthBuffer=k===void 0,O.__autoAllocateDepthBuffer||Ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),O.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,I){const k=be.get(E);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(E,I=0,k=0){A=E,b=I,C=k;let O=!0,F=null,se=!1,de=!1;if(E){const _e=be.get(E);if(_e.__useDefaultFramebuffer!==void 0)Me.bindFramebuffer(P.FRAMEBUFFER,null),O=!1;else if(_e.__webglFramebuffer===void 0)Ne.setupRenderTarget(E);else if(_e.__hasExternalTextures)Ne.rebindTextures(E,be.get(E.texture).__webglTexture,be.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const xe=E.depthTexture;if(_e.__boundDepthTexture!==xe){if(xe!==null&&be.has(xe)&&(E.width!==xe.image.width||E.height!==xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ne.setupDepthRenderbuffer(E)}}const Te=E.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(de=!0);const Ce=be.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ce[I])?F=Ce[I][k]:F=Ce[I],se=!0):E.samples>0&&Ne.useMultisampledRTT(E)===!1?F=be.get(E).__webglMultisampledFramebuffer:Array.isArray(Ce)?F=Ce[k]:F=Ce,M.copy(E.viewport),N.copy(E.scissor),G=E.scissorTest}else M.copy(Q).multiplyScalar(K).floor(),N.copy(ae).multiplyScalar(K).floor(),G=Se;if(Me.bindFramebuffer(P.FRAMEBUFFER,F)&&O&&Me.drawBuffers(E,F),Me.viewport(M),Me.scissor(N),Me.setScissorTest(G),se){const _e=be.get(E.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+I,_e.__webglTexture,k)}else if(de){const _e=be.get(E.texture),Te=I||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,_e.__webglTexture,k||0,Te)}L=-1},this.readRenderTargetPixels=function(E,I,k,O,F,se,de){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=be.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve){Me.bindFramebuffer(P.FRAMEBUFFER,ve);try{const _e=E.texture,Te=_e.format,Ce=_e.type;if(!Je.textureFormatReadable(Te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Je.textureTypeReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=E.width-O&&k>=0&&k<=E.height-F&&P.readPixels(I,k,O,F,Pe.convert(Te),Pe.convert(Ce),se)}finally{const _e=A!==null?be.get(A).__webglFramebuffer:null;Me.bindFramebuffer(P.FRAMEBUFFER,_e)}}},this.readRenderTargetPixelsAsync=async function(E,I,k,O,F,se,de){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=be.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve){Me.bindFramebuffer(P.FRAMEBUFFER,ve);try{const _e=E.texture,Te=_e.format,Ce=_e.type;if(!Je.textureFormatReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Je.textureTypeReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=E.width-O&&k>=0&&k<=E.height-F){const xe=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,xe),P.bufferData(P.PIXEL_PACK_BUFFER,se.byteLength,P.STREAM_READ),P.readPixels(I,k,O,F,Pe.convert(Te),Pe.convert(Ce),0),P.flush();const qe=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);await jy(P,qe,4);try{P.bindBuffer(P.PIXEL_PACK_BUFFER,xe),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,se)}finally{P.deleteBuffer(xe),P.deleteSync(qe)}return se}}finally{const _e=A!==null?be.get(A).__webglFramebuffer:null;Me.bindFramebuffer(P.FRAMEBUFFER,_e)}}},this.copyFramebufferToTexture=function(E,I=null,k=0){E.isTexture!==!0&&(ua("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,E=arguments[1]);const O=Math.pow(2,-k),F=Math.floor(E.image.width*O),se=Math.floor(E.image.height*O),de=I!==null?I.x:0,ve=I!==null?I.y:0;Ne.setTexture2D(E,0),P.copyTexSubImage2D(P.TEXTURE_2D,k,0,0,de,ve,F,se),Me.unbindTexture()},this.copyTextureToTexture=function(E,I,k=null,O=null,F=0){E.isTexture!==!0&&(ua("WebGLRenderer: copyTextureToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1],I=arguments[2],F=arguments[3]||0,k=null);let se,de,ve,_e,Te,Ce;k!==null?(se=k.max.x-k.min.x,de=k.max.y-k.min.y,ve=k.min.x,_e=k.min.y):(se=E.image.width,de=E.image.height,ve=0,_e=0),O!==null?(Te=O.x,Ce=O.y):(Te=0,Ce=0);const xe=Pe.convert(I.format),qe=Pe.convert(I.type);Ne.setTexture2D(I,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,I.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,I.unpackAlignment);const ct=P.getParameter(P.UNPACK_ROW_LENGTH),dt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),tn=P.getParameter(P.UNPACK_SKIP_PIXELS),$e=P.getParameter(P.UNPACK_SKIP_ROWS),ye=P.getParameter(P.UNPACK_SKIP_IMAGES),Pt=E.isCompressedTexture?E.mipmaps[F]:E.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Pt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Pt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ve),P.pixelStorei(P.UNPACK_SKIP_ROWS,_e),E.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,F,Te,Ce,se,de,xe,qe,Pt.data):E.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,F,Te,Ce,Pt.width,Pt.height,xe,Pt.data):P.texSubImage2D(P.TEXTURE_2D,F,Te,Ce,se,de,xe,qe,Pt),P.pixelStorei(P.UNPACK_ROW_LENGTH,ct),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,dt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,tn),P.pixelStorei(P.UNPACK_SKIP_ROWS,$e),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ye),F===0&&I.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),Me.unbindTexture()},this.copyTextureToTexture3D=function(E,I,k=null,O=null,F=0){E.isTexture!==!0&&(ua("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,O=arguments[1]||null,E=arguments[2],I=arguments[3],F=arguments[4]||0);let se,de,ve,_e,Te,Ce,xe,qe,ct;const dt=E.isCompressedTexture?E.mipmaps[F]:E.image;k!==null?(se=k.max.x-k.min.x,de=k.max.y-k.min.y,ve=k.max.z-k.min.z,_e=k.min.x,Te=k.min.y,Ce=k.min.z):(se=dt.width,de=dt.height,ve=dt.depth,_e=0,Te=0,Ce=0),O!==null?(xe=O.x,qe=O.y,ct=O.z):(xe=0,qe=0,ct=0);const tn=Pe.convert(I.format),$e=Pe.convert(I.type);let ye;if(I.isData3DTexture)Ne.setTexture3D(I,0),ye=P.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)Ne.setTexture2DArray(I,0),ye=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,I.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,I.unpackAlignment);const Pt=P.getParameter(P.UNPACK_ROW_LENGTH),Ye=P.getParameter(P.UNPACK_IMAGE_HEIGHT),En=P.getParameter(P.UNPACK_SKIP_PIXELS),Rr=P.getParameter(P.UNPACK_SKIP_ROWS),nn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,dt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,dt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,_e),P.pixelStorei(P.UNPACK_SKIP_ROWS,Te),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ce),E.isDataTexture||E.isData3DTexture?P.texSubImage3D(ye,F,xe,qe,ct,se,de,ve,tn,$e,dt.data):I.isCompressedArrayTexture?P.compressedTexSubImage3D(ye,F,xe,qe,ct,se,de,ve,tn,dt.data):P.texSubImage3D(ye,F,xe,qe,ct,se,de,ve,tn,$e,dt),P.pixelStorei(P.UNPACK_ROW_LENGTH,Pt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ye),P.pixelStorei(P.UNPACK_SKIP_PIXELS,En),P.pixelStorei(P.UNPACK_SKIP_ROWS,Rr),P.pixelStorei(P.UNPACK_SKIP_IMAGES,nn),F===0&&I.generateMipmaps&&P.generateMipmap(ye),Me.unbindTexture()},this.initRenderTarget=function(E){be.get(E).__webglFramebuffer===void 0&&Ne.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Ne.setTextureCube(E,0):E.isData3DTexture?Ne.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Ne.setTexture2DArray(E,0):Ne.setTexture2D(E,0),Me.unbindTexture()},this.resetState=function(){b=0,C=0,A=null,Me.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===Rf?"display-p3":"srgb",n.unpackColorSpace=Ke.workingColorSpace===Wl?"display-p3":"srgb"}}class Df{constructor(e,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new We(e),this.near=n,this.far=i}clone(){return new Df(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Q0 extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class tT extends Wt{constructor(e,n,i,r,s,a,o,l,u){super(e,n,i,r,s,a,o,l,u),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Uf extends Qi{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let u=0;const d=[],h=new B,f=new B,p=[],x=[],_=[],m=[];for(let c=0;c<=i;c++){const v=[],g=c/i;let y=0;c===0&&a===0?y=.5/n:c===i&&l===Math.PI&&(y=-.5/n);for(let b=0;b<=n;b++){const C=b/n;h.x=-e*Math.cos(r+C*s)*Math.sin(a+g*o),h.y=e*Math.cos(a+g*o),h.z=e*Math.sin(r+C*s)*Math.sin(a+g*o),x.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),m.push(C+y,1-g),v.push(u++)}d.push(v)}for(let c=0;c<i;c++)for(let v=0;v<n;v++){const g=d[c][v+1],y=d[c][v],b=d[c+1][v],C=d[c+1][v+1];(c!==0||a>0)&&p.push(g,y,C),(c!==i-1||l<Math.PI)&&p.push(y,b,C)}this.setIndex(p),this.setAttribute("position",new $n(x,3)),this.setAttribute("normal",new $n(_,3)),this.setAttribute("uv",new $n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uf(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class nT extends Oa{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=N0,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class J0 extends Dt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class iT extends J0{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const Ku=new pt,$p=new B,Yp=new B;class rT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pf,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;$p.setFromMatrixPosition(e.matrixWorld),n.position.copy($p),Yp.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Yp),n.updateMatrixWorld(),Ku.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ku),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ku)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class sT extends rT{constructor(){super(new Lf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class aT extends J0{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new sT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ev{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Kp(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=Kp();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function Kp(){return(typeof performance>"u"?Date:performance).now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sf);var Jp;const Zp=typeof window<"u"&&((Jp=window.matchMedia)==null?void 0:Jp.call(window,"(prefers-reduced-motion: reduce)").matches),oT=`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uRes.x / uRes.y;

    // Soft daylight gradient.
    vec3 top = vec3(0.975, 0.985, 0.978);
    vec3 bottom = vec3(0.945, 0.965, 0.950);
    vec3 col = mix(top, bottom, uv.y);

    // Faint giant centre circle and halfway line, off to the side.
    float circle = abs(length(p - vec2(0.55, -0.18)) - 0.5);
    col -= vec3(0.030, 0.014, 0.026) * (1.0 - smoothstep(0.0, 0.012, circle)) * 0.8;
    float halfway = abs(p.x + 0.62);
    col -= vec3(0.030, 0.014, 0.026) * (1.0 - smoothstep(0.0, 0.008, halfway)) * 0.5;

    // Slow drifting brightness, like light through clouds.
    float sweepPos = fract(uTime * 0.015);
    float sweep = exp(-10.0 * abs(uv.x - sweepPos));
    col += vec3(0.015) * sweep;

    // Grain to stop banding.
    col += (hash(uv * uRes + uTime) - 0.5) * 0.006;

    gl_FragColor = vec4(col, 1.0);
  }
`,lT=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;class uT{mount(e){this.container=e,this.renderer=new Z0({antialias:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),this.renderer.setSize(window.innerWidth,window.innerHeight),e.appendChild(this.renderer.domElement),this.scene=new Q0,this.camera=new Lf(-1,1,1,-1,0,1),this.uniforms={uTime:{value:0},uRes:{value:new He(window.innerWidth,window.innerHeight)}},this.scene.add(new xn(new Ls(2,2),new Kn({uniforms:this.uniforms,vertexShader:lT,fragmentShader:oT}))),this.onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.uniforms.uRes.value.set(window.innerWidth,window.innerHeight),Zp&&this.renderer.render(this.scene,this.camera)},window.addEventListener("resize",this.onResize),this.clock=new ev,Zp?this.renderer.render(this.scene,this.camera):this.renderer.setAnimationLoop(()=>{this.uniforms.uTime.value=this.clock.getElapsedTime(),this.renderer.render(this.scene,this.camera)})}unmount(){var e,n,i,r,s;(e=this.renderer)==null||e.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),(n=this.scene)==null||n.traverse(a=>{var o,l,u,d;(l=(o=a.geometry)==null?void 0:o.dispose)==null||l.call(o),(d=(u=a.material)==null?void 0:u.dispose)==null||d.call(u)}),(i=this.renderer)==null||i.dispose(),(s=(r=this.renderer)==null?void 0:r.domElement)==null||s.remove()}}function cT(){const{state:t,actions:e}=kn(),{view:n,user:i}=t;return w.jsxs("header",{className:"nav",children:[w.jsxs("button",{className:"nav-brand",onClick:()=>e.go("home"),children:[w.jsx("span",{className:"nav-ball","aria-hidden":"true",children:"⚽"}),w.jsxs("span",{className:"nav-word",children:["Top",w.jsx("em",{children:"Bins"})]})]}),w.jsxs("nav",{className:"nav-links","aria-label":"Main",children:[w.jsx("button",{className:n==="home"?"active":"",onClick:()=>e.go("home"),children:"Kick off"}),w.jsx("button",{className:n==="find"?"active":"",onClick:()=>e.go("find"),children:"Find a pitch"}),w.jsx("button",{className:n==="game"?"active":"",onClick:()=>e.go("game"),children:"My game"})]}),w.jsx("div",{className:"nav-auth",children:i?w.jsxs(w.Fragment,{children:[w.jsx("span",{className:"nav-user",title:`@${i.username}`,children:i.displayName}),w.jsx("button",{className:"btn ghost small",onClick:e.logout,children:"Log out"})]}):w.jsxs(w.Fragment,{children:[w.jsx("button",{className:"btn ghost small",onClick:()=>e.openAuth("login"),children:"Log in"}),w.jsx("button",{className:"btn primary small",onClick:()=>e.openAuth("register"),children:"Join the squad"})]})})]})}var em;const dT=typeof window<"u"&&((em=window.matchMedia)==null?void 0:em.call(window,"(prefers-reduced-motion: reduce)").matches);function fT(){const e=document.createElement("canvas");e.width=e.height=512;const n=e.getContext("2d");n.fillStyle="#fdfefd",n.fillRect(0,0,512,512);const i=34;n.fillStyle="#1c2622";for(let s=0;s<6;s++)for(let a=0;a<6;a++){const o=a*96+(s%2?48:0)+24,l=s*88+30;n.beginPath();for(let u=0;u<5;u++){const d=Math.PI*2*u/5-Math.PI/2,h=o+Math.cos(d)*i,f=l+Math.sin(d)*i;u===0?n.moveTo(h,f):n.lineTo(h,f)}n.closePath(),n.fill()}const r=new tT(e);return r.colorSpace=Pn,r.wrapS=r.wrapT=_l,r}const hT=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,pT=`
  varying vec2 vUv;
  uniform float uTime;

  float line(float d, float w) { return 1.0 - smoothstep(w * 0.5, w, abs(d)); }

  void main() {
    // Fresh-cut mowing stripes.
    float stripe = step(0.5, fract(vUv.y * 9.0));
    vec3 grassA = vec3(0.36, 0.65, 0.40);
    vec3 grassB = vec3(0.41, 0.70, 0.45);
    vec3 col = mix(grassA, grassB, stripe);

    // Markings: touchlines, halfway line, centre circle & spot.
    vec2 p = vUv - 0.5;
    float marks = 0.0;
    marks = max(marks, line(abs(p.x) - 0.46, 0.006));
    marks = max(marks, line(abs(p.y) - 0.47, 0.006));
    marks = max(marks, line(p.y, 0.006) * step(abs(p.x), 0.46));
    marks = max(marks, line(length(p * vec2(1.0, 1.35)) - 0.12, 0.008));
    marks = max(marks, 1.0 - smoothstep(0.006, 0.012, length(p * vec2(1.0, 1.35))));
    col = mix(col, vec3(0.99, 1.0, 0.99), marks * 0.9);

    // A soft patch of drifting sunlight.
    float sweep = 0.5 + 0.5 * sin(uTime * 0.2);
    vec2 sun = vec2(0.35 + 0.3 * sweep, 0.45);
    col += vec3(0.10, 0.09, 0.06) * exp(-8.0 * dot(vUv - sun, vUv - sun));

    // Fade the far edge into the sky haze.
    float fade = smoothstep(0.0, 0.4, vUv.y);
    col = mix(vec3(0.93, 0.96, 0.94), col, fade);

    gl_FragColor = vec4(col, 1.0);
  }
`;class mT{mount(e){this.container=e;const n=e.clientWidth,i=e.clientHeight;this.renderer=new Z0({antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(n,i),e.appendChild(this.renderer.domElement),this.scene=new Q0,this.scene.fog=new Df(15660271,22,70),this.camera=new gn(52,n/i,.1,120),this.camera.position.set(0,3.2,13),this.pitchUniforms={uTime:{value:0}};const r=new xn(new Ls(70,44),new Kn({uniforms:this.pitchUniforms,vertexShader:hT,fragmentShader:pT}));r.rotation.x=-Math.PI/2,r.position.y=-1.6,this.scene.add(r),this.ball=new xn(new Uf(1.5,48,48),new nT({map:fT(),roughness:.5,metalness:.02})),this.ball.position.set(0,1.4,0),this.scene.add(this.ball),this.scene.add(new iT(15988991,11065010,1.3));const s=new aT(16774365,2.2);s.position.set(-8,14,7),this.scene.add(s),this.pointer={x:0,y:0},this.onPointerMove=a=>{this.pointer.x=a.clientX/window.innerWidth*2-1,this.pointer.y=a.clientY/window.innerHeight*2-1},window.addEventListener("pointermove",this.onPointerMove),this.onResize=()=>{const a=this.container.clientWidth,o=this.container.clientHeight;!a||!o||(this.camera.aspect=a/o,this.camera.updateProjectionMatrix(),this.renderer.setSize(a,o))},window.addEventListener("resize",this.onResize),this.clock=new ev,dT?this.renderer.render(this.scene,this.camera):this.renderer.setAnimationLoop(()=>this.tick())}tick(){const e=this.clock.getElapsedTime();this.pitchUniforms.uTime.value=e,this.ball.rotation.y=e*.5,this.ball.rotation.x=Math.sin(e*.3)*.25,this.ball.position.y=1.4+Math.sin(e*1.1)*.35,this.camera.position.x+=(this.pointer.x*1.6-this.camera.position.x)*.03,this.camera.position.y+=(3.2-this.pointer.y*.8-this.camera.position.y)*.03,this.camera.lookAt(0,1,0),this.renderer.render(this.scene,this.camera)}unmount(){var e,n,i,r,s;(e=this.renderer)==null||e.setAnimationLoop(null),window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("resize",this.onResize),(n=this.scene)==null||n.traverse(a=>{var l,u;(u=(l=a.geometry)==null?void 0:l.dispose)==null||u.call(l),(Array.isArray(a.material)?a.material:[a.material]).forEach(d=>{var h,f,p;(f=(h=d==null?void 0:d.map)==null?void 0:h.dispose)==null||f.call(h),(p=d==null?void 0:d.dispose)==null||p.call(d)})}),(i=this.renderer)==null||i.dispose(),(s=(r=this.renderer)==null?void 0:r.domElement)==null||s.remove()}}function gT(){const{actions:t}=kn(),e=ke.useRef(null);ke.useEffect(()=>{const i=e.current;if(!i)return;const r=new mT;try{r.mount(i)}catch{return}return()=>r.unmount()},[]);const n=Object.fromEntries(Object.keys(hi).map(i=>[i,_f.filter(r=>r.type===i).length]));return w.jsxs("div",{className:"home",children:[w.jsxs("section",{className:"hero",children:[w.jsx("div",{className:"hero-canvas",ref:e,"aria-hidden":"true"}),w.jsxs("div",{className:"hero-copy",children:[w.jsx("p",{className:"hero-kicker",children:"London's pitch finder"}),w.jsxs("h1",{children:["Find the pitch.",w.jsx("br",{}),w.jsx("span",{className:"grad",children:"Hit top bins."})]}),w.jsx("p",{className:"hero-sub",children:"Every Powerleague, Goals, park pitch and cage in London — ranked for your whole friend group by travel time, price and the way you like to play."}),w.jsxs("div",{className:"hero-cta",children:[w.jsx("button",{className:"btn primary big",onClick:()=>t.go("find"),children:"Build your squad →"}),w.jsx("button",{className:"btn ghost big",onClick:()=>t.openAuth("register"),children:"Create an account"})]})]})]}),w.jsxs("section",{className:"types",children:[w.jsx("h2",{className:"section-title",children:"Every way London plays"}),w.jsx("p",{className:"section-sub",children:"Pick your battlefield — from rooftop cages to Hackney Marshes."}),w.jsx("div",{className:"type-grid",children:Object.entries(hi).map(([i,r])=>w.jsxs("button",{className:"type-card",style:{"--accent":r.color},onClick:()=>{t.setFilters({types:[i]}),t.go("find")},children:[w.jsx("span",{className:"type-emoji","aria-hidden":"true",children:r.emoji}),w.jsx("span",{className:"type-name",children:r.label}),w.jsxs("span",{className:"type-count",children:[n[i]," venues"]}),w.jsx("span",{className:"type-blurb",children:r.blurb})]},i))})]}),w.jsxs("section",{className:"how",children:[w.jsx("h2",{className:"section-title",children:"How it works"}),w.jsxs("div",{className:"how-grid",children:[w.jsxs("div",{className:"how-step",children:[w.jsx("span",{className:"how-num",children:"1"}),w.jsx("h3",{children:"Drop your squad on the map"}),w.jsx("p",{children:"Add each friend's home area and how they travel — walk, cycle, tube or drive."})]}),w.jsxs("div",{className:"how-step",children:[w.jsx("span",{className:"how-num",children:"2"}),w.jsx("h3",{children:"Set the vibe"}),w.jsx("p",{children:"Caged or open pitch, budget per head, 5s / 7s / 11s, floodlights for evening games."})]}),w.jsxs("div",{className:"how-step",children:[w.jsx("span",{className:"how-num",children:"3"}),w.jsx("h3",{children:"Get your shortlist"}),w.jsx("p",{children:"The Squad Score ranks every pitch so nobody's schlepping across town while you play."})]})]})]})]})}const Qp=[{name:"Angel",lat:51.5322,lng:-.1058},{name:"Acton",lat:51.5081,lng:-.2733},{name:"Balham",lat:51.4434,lng:-.1525},{name:"Barking",lat:51.5397,lng:.0805},{name:"Barnet",lat:51.6444,lng:-.1997},{name:"Battersea",lat:51.4708,lng:-.1665},{name:"Beckenham",lat:51.4084,lng:-.0263},{name:"Bermondsey",lat:51.4979,lng:-.0638},{name:"Bethnal Green",lat:51.527,lng:-.055},{name:"Bexleyheath",lat:51.459,lng:.138},{name:"Bloomsbury",lat:51.522,lng:-.125},{name:"Bow",lat:51.5271,lng:-.0203},{name:"Brixton",lat:51.4626,lng:-.1159},{name:"Bromley",lat:51.4059,lng:.0145},{name:"Camberwell",lat:51.4741,lng:-.0917},{name:"Camden Town",lat:51.539,lng:-.1426},{name:"Canary Wharf",lat:51.5054,lng:-.0235},{name:"Catford",lat:51.4452,lng:-.0207},{name:"Charlton",lat:51.4867,lng:.03},{name:"Chelsea",lat:51.4875,lng:-.1687},{name:"Chingford",lat:51.6236,lng:.009},{name:"Chiswick",lat:51.4927,lng:-.2588},{name:"Clapham",lat:51.4618,lng:-.1384},{name:"Clapton",lat:51.562,lng:-.056},{name:"Cricklewood",lat:51.559,lng:-.213},{name:"Croydon",lat:51.3762,lng:-.0982},{name:"Crystal Palace",lat:51.4183,lng:-.0729},{name:"Dagenham",lat:51.5397,lng:.1422},{name:"Dalston",lat:51.5461,lng:-.075},{name:"Deptford",lat:51.479,lng:-.025},{name:"Dulwich",lat:51.451,lng:-.0857},{name:"Ealing",lat:51.513,lng:-.3089},{name:"East Ham",lat:51.5323,lng:.0554},{name:"Elephant & Castle",lat:51.4943,lng:-.1005},{name:"Eltham",lat:51.451,lng:.0565},{name:"Enfield",lat:51.6521,lng:-.0807},{name:"Euston",lat:51.5281,lng:-.133},{name:"Finchley",lat:51.599,lng:-.187},{name:"Finsbury Park",lat:51.5642,lng:-.1063},{name:"Forest Hill",lat:51.4394,lng:-.0532},{name:"Fulham",lat:51.478,lng:-.195},{name:"Golders Green",lat:51.5721,lng:-.194},{name:"Greenwich",lat:51.4826,lng:-.0077},{name:"Hackney",lat:51.545,lng:-.0553},{name:"Hackney Wick",lat:51.543,lng:-.025},{name:"Haggerston",lat:51.536,lng:-.076},{name:"Hammersmith",lat:51.4927,lng:-.2229},{name:"Hampstead",lat:51.556,lng:-.178},{name:"Harrow",lat:51.5806,lng:-.342},{name:"Hendon",lat:51.5837,lng:-.2252},{name:"Herne Hill",lat:51.453,lng:-.101},{name:"Highbury",lat:51.552,lng:-.097},{name:"Holloway",lat:51.552,lng:-.116},{name:"Hounslow",lat:51.468,lng:-.361},{name:"Hoxton",lat:51.532,lng:-.079},{name:"Ilford",lat:51.559,lng:.074},{name:"Islington",lat:51.538,lng:-.103},{name:"Kennington",lat:51.488,lng:-.11},{name:"Kensington",lat:51.501,lng:-.191},{name:"Kentish Town",lat:51.55,lng:-.141},{name:"Kilburn",lat:51.547,lng:-.204},{name:"King's Cross",lat:51.531,lng:-.123},{name:"Kingston upon Thames",lat:51.4123,lng:-.3007},{name:"Ladbroke Grove",lat:51.517,lng:-.211},{name:"Lewisham",lat:51.462,lng:-.01},{name:"Leyton",lat:51.561,lng:-.013},{name:"Leytonstone",lat:51.568,lng:.0083},{name:"Maida Vale",lat:51.53,lng:-.186},{name:"Marylebone",lat:51.522,lng:-.152},{name:"Mile End",lat:51.525,lng:-.033},{name:"Mill Hill",lat:51.613,lng:-.243},{name:"Mitcham",lat:51.403,lng:-.168},{name:"Morden",lat:51.402,lng:-.195},{name:"New Cross",lat:51.476,lng:-.033},{name:"Notting Hill",lat:51.509,lng:-.196},{name:"Paddington",lat:51.515,lng:-.175},{name:"Peckham",lat:51.474,lng:-.069},{name:"Plaistow",lat:51.531,lng:.017},{name:"Poplar",lat:51.5077,lng:-.017},{name:"Putney",lat:51.461,lng:-.216},{name:"Richmond",lat:51.4613,lng:-.3037},{name:"Romford",lat:51.5768,lng:.1801},{name:"Rotherhithe",lat:51.501,lng:-.048},{name:"Shepherd's Bush",lat:51.5046,lng:-.2187},{name:"Shoreditch",lat:51.5257,lng:-.0781},{name:"Soho",lat:51.5136,lng:-.1365},{name:"Southwark",lat:51.503,lng:-.09},{name:"Stockwell",lat:51.472,lng:-.123},{name:"Stoke Newington",lat:51.562,lng:-.074},{name:"Stratford",lat:51.5416,lng:-.0031},{name:"Streatham",lat:51.427,lng:-.127},{name:"Surbiton",lat:51.394,lng:-.305},{name:"Sutton",lat:51.3618,lng:-.1945},{name:"Sydenham",lat:51.427,lng:-.054},{name:"Tooting",lat:51.427,lng:-.168},{name:"Tottenham",lat:51.588,lng:-.072},{name:"Twickenham",lat:51.446,lng:-.331},{name:"Uxbridge",lat:51.546,lng:-.479},{name:"Vauxhall",lat:51.486,lng:-.123},{name:"Walthamstow",lat:51.585,lng:-.02},{name:"Wandsworth",lat:51.457,lng:-.192},{name:"Wembley",lat:51.5525,lng:-.296},{name:"West Ham",lat:51.534,lng:.008},{name:"Whitechapel",lat:51.519,lng:-.06},{name:"Willesden",lat:51.546,lng:-.244},{name:"Wimbledon",lat:51.4214,lng:-.2064},{name:"Wood Green",lat:51.598,lng:-.109},{name:"Woolwich",lat:51.489,lng:.064}];function vT(){var p,x;const{state:t,actions:e}=kn(),[n,i]=ke.useState(""),[r,s]=ke.useState(""),[a,o]=ke.useState("transit"),[l,u]=ke.useState(""),d=ke.useMemo(()=>{const _=r.trim().toLowerCase();return _?Qp.filter(m=>m.name.toLowerCase().includes(_)).slice(0,6):[]},[r]),h=ke.useMemo(()=>Qp.find(_=>_.name.toLowerCase()===r.trim().toLowerCase()),[r]);function f(_){const m=_||h;if(!m){u("Pick an area from the list — that's how we work out ETAs.");return}e.addFriend({name:n.trim()||`Player ${t.squad.length+1}`,areaName:m.name,lat:m.lat,lng:m.lng,mode:a}),i(""),s(""),u("")}return w.jsxs("section",{className:"panel",children:[w.jsx("h2",{className:"panel-title",children:"Your squad"}),w.jsx("p",{className:"panel-sub",children:"Add everyone playing and where they set off from."}),w.jsxs("div",{className:"squad-form",children:[w.jsx("input",{className:"input",placeholder:"Name (e.g. Sidi)",value:n,onChange:_=>i(_.target.value),maxLength:24}),w.jsxs("div",{className:"area-picker",children:[w.jsx("input",{className:"input",placeholder:"Home area (e.g. Peckham)",value:r,onChange:_=>{s(_.target.value),u("")},onKeyDown:_=>_.key==="Enter"&&f()}),d.length>0&&!h&&w.jsx("ul",{className:"area-suggestions",children:d.map(_=>w.jsx("li",{children:w.jsx("button",{onClick:()=>{s(_.name),f(_)},children:_.name})},_.name))})]}),w.jsx("div",{className:"mode-row",role:"radiogroup","aria-label":"Travel mode",children:Object.entries(Ca).map(([_,m])=>w.jsxs("button",{role:"radio","aria-checked":a===_,className:`chip ${a===_?"chip-on":""}`,onClick:()=>o(_),title:m.label,children:[m.emoji," ",m.label]},_))}),l&&w.jsx("p",{className:"form-error",children:l}),w.jsx("button",{className:"btn primary",onClick:()=>f(),children:"+ Add to squad"})]}),t.squad.length>0&&w.jsx("ul",{className:"squad-list",children:t.squad.map(_=>w.jsxs("li",{className:"squad-member",children:[w.jsx("span",{className:"squad-name",children:_.name}),w.jsx("span",{className:"squad-area",children:_.areaName}),w.jsx("select",{className:"squad-mode",value:_.mode,onChange:m=>e.setFriendMode(_.id,m.target.value),"aria-label":`${_.name}'s travel mode`,children:Object.entries(Ca).map(([m,c])=>w.jsxs("option",{value:m,children:[c.emoji," ",c.label]},m))}),w.jsx("button",{className:"icon-btn",onClick:()=>e.removeFriend(_.id),"aria-label":`Remove ${_.name}`,children:"✕"})]},_.id))}),t.user&&w.jsxs("div",{className:"squad-save-row",children:[w.jsx("button",{className:"btn ghost small",onClick:e.saveSquad,disabled:!t.squad.length,children:"Save squad"}),w.jsx("button",{className:"btn ghost small",onClick:e.loadSquad,disabled:!((x=(p=t.user.squads)==null?void 0:p[0])!=null&&x.length),children:"Load saved squad"})]}),t.squad.length===0&&w.jsx("p",{className:"squad-empty",children:"No squad yet — pitches are ranked on price and quality alone until you add players."})]})}function _T(){const{state:t,actions:e}=kn(),n=t.filters;function i(r){const s=n.types.includes(r)?n.types.filter(a=>a!==r):[...n.types,r];e.setFilters({types:s})}return w.jsxs("section",{className:"panel",children:[w.jsxs("div",{className:"panel-head-row",children:[w.jsx("h2",{className:"panel-title",children:"The vibe"}),w.jsx("button",{className:"btn ghost small",onClick:e.resetFilters,children:"Reset"})]}),w.jsx("label",{className:"filter-label",children:"Pitch type"}),w.jsx("div",{className:"chip-row",children:Object.entries(hi).map(([r,s])=>w.jsx("button",{className:`chip ${n.types.includes(r)?"chip-on":""}`,style:{"--accent":s.color},onClick:()=>i(r),children:s.label},r))}),w.jsx("label",{className:"filter-label",children:"Caged or open?"}),w.jsx("div",{className:"chip-row",children:[["any","Any"],["bounded","Bounded (caged / walled)"],["unbounded","Unbounded (open)"]].map(([r,s])=>w.jsx("button",{className:`chip ${n.enclosure===r?"chip-on":""}`,onClick:()=>e.setFilters({enclosure:r}),children:s},r))}),w.jsx("label",{className:"filter-label",children:"Game format"}),w.jsx("div",{className:"chip-row",children:[null,5,7,11].map(r=>w.jsx("button",{className:`chip ${n.format===r?"chip-on":""}`,onClick:()=>e.setFilters({format:r}),children:r?`${r}-a-side`:"Any"},String(r)))}),w.jsxs("label",{className:"filter-label",htmlFor:"budget",children:["Budget per head ",n.maxPricePerHead!=null?`— £${n.maxPricePerHead}`:"— any"]}),w.jsx("input",{id:"budget",className:"slider",type:"range",min:"0",max:"15",step:"1",value:n.maxPricePerHead??15,onChange:r=>{const s=Number(r.target.value);e.setFilters({maxPricePerHead:s>=15?null:s})}}),w.jsxs("label",{className:"filter-label",htmlFor:"maxeta",children:["Max travel time ",n.maxEta!=null?`— ${n.maxEta} min`:"— any"]}),w.jsx("input",{id:"maxeta",className:"slider",type:"range",min:"10",max:"75",step:"5",value:n.maxEta??75,onChange:r=>{const s=Number(r.target.value);e.setFilters({maxEta:s>=75?null:s})},disabled:!t.squad.length,title:t.squad.length?"":"Add your squad first"}),w.jsxs("div",{className:"chip-row toggles",children:[w.jsx("button",{className:`chip ${n.needsFloodlights?"chip-on":""}`,onClick:()=>e.setFilters({needsFloodlights:!n.needsFloodlights}),children:"Floodlit (evening games)"}),w.jsx("button",{className:`chip ${n.freeOnly?"chip-on":""}`,onClick:()=>e.setFilters({freeOnly:!n.freeOnly}),children:"Free pitches only"})]})]})}const zn=1e3,ii=640;function xT(){const{state:t,results:e,actions:n}=kn(),i=ke.useMemo(()=>Vx(zn,ii),[]),[r,s]=ke.useState({x:0,y:0,k:1}),[a,o]=ke.useState(null),l=ke.useRef(null),u=ke.useRef(null),d=ke.useMemo(()=>Gx.map((g,y)=>{const{x:b,y:C}=i.toXY(g);return`${y===0?"M":"L"}${b.toFixed(1)},${C.toFixed(1)}`}).join(" "),[i]),h=ke.useMemo(()=>new Set(e.slice(0,5).map(g=>g.pitch.id)),[e]),f=ke.useMemo(()=>new Map(e.map(g=>[g.pitch.id,g])),[e]),p=t.squad.length?zx(t.squad):null;function x(g){l.current={startX:g.clientX,startY:g.clientY,...r},g.currentTarget.setPointerCapture(g.pointerId)}function _(g){if(!l.current)return;const y=u.current.getBoundingClientRect(),b=zn/y.width;s({...r,x:l.current.x+(g.clientX-l.current.startX)*b,y:l.current.y+(g.clientY-l.current.startY)*b})}function m(){l.current=null}function c(g){s(y=>{const b=Math.max(.8,Math.min(5,y.k*g)),C=zn/2,A=ii/2,L=b/y.k;return{k:b,x:C-(C-y.x)*L,y:A-(A-y.y)*L}})}const v=a?f.get(a.id):null;return w.jsxs("section",{className:"map-panel",children:[w.jsxs("div",{className:"map-head",children:[w.jsx("h2",{className:"panel-title",children:"The London board"}),w.jsxs("div",{className:"map-zoom",children:[w.jsx("button",{className:"icon-btn",onClick:()=>c(1.3),"aria-label":"Zoom in",children:"＋"}),w.jsx("button",{className:"icon-btn",onClick:()=>c(1/1.3),"aria-label":"Zoom out",children:"－"}),w.jsx("button",{className:"icon-btn",onClick:()=>s({x:0,y:0,k:1}),"aria-label":"Reset view",children:"⟲"})]})]}),w.jsxs("div",{className:"map-wrap",children:[w.jsxs("svg",{ref:u,viewBox:`0 0 ${zn} ${ii}`,className:"map-svg",onPointerDown:x,onPointerMove:_,onPointerUp:m,onPointerLeave:m,role:"img","aria-label":"Map of football pitches across London",children:[w.jsx("defs",{children:w.jsxs("radialGradient",{id:"mapGlow",cx:"50%",cy:"45%",r:"70%",children:[w.jsx("stop",{offset:"0%",stopColor:"#fbfdfb"}),w.jsx("stop",{offset:"100%",stopColor:"#edf3ee"})]})}),w.jsx("rect",{width:zn,height:ii,fill:"url(#mapGlow)"}),w.jsxs("g",{transform:`translate(${r.x},${r.y}) scale(${r.k})`,children:[w.jsxs("g",{opacity:"0.08",stroke:"#16a34a",strokeWidth:"1",children:[Array.from({length:9},(g,y)=>w.jsx("line",{x1:(y+1)*(zn/10),y1:"0",x2:(y+1)*(zn/10),y2:ii},`v${y}`)),Array.from({length:5},(g,y)=>w.jsx("line",{x1:"0",y1:(y+1)*(ii/6),x2:zn,y2:(y+1)*(ii/6)},`h${y}`)),w.jsx("circle",{cx:zn/2,cy:ii/2,r:"70",fill:"none"})]}),w.jsx("path",{d,fill:"none",stroke:"#d3e7f4",strokeWidth:14/r.k,strokeLinecap:"round",strokeLinejoin:"round"}),w.jsx("path",{d,fill:"none",stroke:"#8fc0e2",strokeWidth:3.5/r.k,strokeLinecap:"round",strokeLinejoin:"round"}),t.squad.map(g=>{const{x:y,y:b}=i.toXY(g);return w.jsxs("g",{transform:`translate(${y},${b})`,children:[w.jsx("circle",{r:10/r.k,fill:"#16241c",opacity:"0.10"}),w.jsx("circle",{r:4.5/r.k,fill:"#16241c",stroke:"#ffffff",strokeWidth:1.5/r.k}),w.jsx("text",{y:-9/r.k,textAnchor:"middle",className:"map-friend-label",fontSize:11/r.k,children:g.name})]},g.id)}),p&&w.jsxs("g",{transform:`translate(${i.toXY(p).x},${i.toXY(p).y})`,"aria-hidden":"true",children:[w.jsx("circle",{r:8/r.k,fill:"none",stroke:"#16241c",strokeWidth:1.5/r.k}),w.jsx("circle",{r:2/r.k,fill:"#16241c"})]}),e.map(({pitch:g})=>{const{x:y,y:b}=i.toXY(g),C=hi[g.type],A=h.has(g.id),L=(A?8:5)/r.k;return w.jsxs("g",{transform:`translate(${y},${b})`,className:"map-marker",onClick:()=>n.selectPitch(g.id),onPointerEnter:()=>o({id:g.id,x:y,y:b}),onPointerLeave:()=>o(null),children:[A&&w.jsx("circle",{r:L*2.1,fill:C.color,opacity:"0.15",className:"marker-pulse"}),w.jsx("circle",{r:L,fill:C.color,stroke:"#ffffff",strokeWidth:1.6/r.k}),A&&w.jsx("text",{y:1.5/r.k,textAnchor:"middle",dominantBaseline:"middle",fontSize:L,fill:"#ffffff",fontWeight:"900",children:"★"})]},g.id)})]})]}),a&&v&&w.jsxs("div",{className:"map-tooltip",style:{left:`${((a.x*r.k+r.x)/zn*100).toFixed(2)}%`,top:`${((a.y*r.k+r.y)/ii*100).toFixed(2)}%`},children:[w.jsx("strong",{children:v.pitch.name}),w.jsxs("span",{children:[hi[v.pitch.type].label,t.squad.length>0&&` · worst ETA ${v.maxEta} min`,v.pitch.pricePerHour===0?" · free":` · £${v.pitch.pricePerHour}/hr`]})]})]}),w.jsxs("div",{className:"map-legend",children:[Object.entries(hi).map(([g,y])=>w.jsxs("span",{className:"legend-item",children:[w.jsx("span",{className:"legend-dot",style:{background:y.color}}),y.label]},g)),w.jsxs("span",{className:"legend-item",children:[w.jsx("span",{className:"legend-dot",style:{background:"#16241c"}}),"Your squad"]}),w.jsxs("span",{className:"legend-item",children:[w.jsx("span",{className:"legend-dot ring"}),"Squad centre"]})]})]})}function Md({row:t,rank:e}){var l,u;const{state:n,actions:i}=kn(),{pitch:r}=t,s=hi[r.type],a=(u=(l=n.user)==null?void 0:l.savedPitchIds)==null?void 0:u.includes(r.id),o=jx(t.score);return w.jsxs("article",{className:`pitch-card ${e?"pitch-card-top":""}`,style:{"--accent":s.color},children:[e&&w.jsxs("span",{className:"pitch-rank",children:["#",e]}),w.jsxs("header",{className:"pitch-card-head",children:[w.jsx("button",{className:"pitch-name",onClick:()=>i.selectPitch(r.id),children:r.name}),w.jsx("button",{className:`save-btn ${a?"saved":""}`,onClick:()=>i.toggleSave(r.id),"aria-label":a?"Remove from saved pitches":"Save pitch",title:n.user?"":"Log in to save pitches",children:a?"♥":"♡"})]}),w.jsxs("p",{className:"pitch-meta",children:[w.jsx("span",{className:"dot",style:{background:s.color},"aria-hidden":"true"}),w.jsx("span",{className:"pitch-type",style:{color:s.color},children:s.label}),w.jsxs("span",{children:["· ",r.area]}),w.jsxs("span",{children:["· ",r.surface]})]}),w.jsxs("div",{className:"pitch-stats",children:[w.jsxs("span",{className:"stat",children:[w.jsx("strong",{children:r.pricePerHour===0?"FREE":`£${r.pricePerHour}`}),r.pricePerHour>0&&w.jsx("small",{children:"/hour"})]}),n.squad.length>0&&w.jsxs("span",{className:"stat",children:[w.jsxs("strong",{children:[t.maxEta,"′"]}),w.jsx("small",{children:"worst ETA"})]}),w.jsxs("span",{className:"stat",children:[w.jsx("strong",{children:r.formats.map(d=>`${d}s`).join(" ")}),w.jsx("small",{children:"formats"})]}),w.jsxs("span",{className:"stat squad-score",title:"Squad Score — fit for your group",children:[w.jsx("strong",{children:o}),w.jsx("small",{children:"score"})]})]}),t.reasons.length>0&&w.jsx("p",{className:"pitch-reasons",children:t.reasons.join(" · ")})]})}function yT(){const{state:t,results:e}=kn(),n=e.slice(0,5),i=e.slice(5);return w.jsxs("section",{className:"results",children:[w.jsxs("div",{className:"results-head",children:[w.jsx("h2",{className:"panel-title",children:t.squad.length?`Best pitches for your ${t.squad.length}-player squad`:"Top-rated pitches"}),w.jsxs("span",{className:"results-count",children:[e.length," pitch",e.length===1?"":"es"," match"]})]}),e.length===0?w.jsxs("div",{className:"results-empty",children:[w.jsx("p",{children:"Nothing gets past those filters — that's a worldie of a save."}),w.jsx("p",{children:"Loosen the budget or travel time and try again."})]}):w.jsxs(w.Fragment,{children:[w.jsx("div",{className:"results-grid",children:n.map((r,s)=>w.jsx(Md,{row:r,rank:s+1},r.pitch.id))}),i.length>0&&w.jsxs("details",{className:"results-more",children:[w.jsxs("summary",{children:["Show ",i.length," more matching pitch",i.length===1?"":"es"]}),w.jsx("div",{className:"results-grid",children:i.map(r=>w.jsx(Md,{row:r},r.pitch.id))})]})]})]})}function ST(){return w.jsxs("div",{className:"finder",children:[w.jsxs("aside",{className:"finder-side",children:[w.jsx(vT,{}),w.jsx(_T,{})]}),w.jsxs("div",{className:"finder-main",children:[w.jsx(xT,{}),w.jsx(yT,{})]})]})}const MT=[["in","In"],["maybe","Maybe"],["out","Out"]];function ET(){const{state:t,results:e,actions:n}=kn(),{user:i}=t;if(!i)return w.jsxs("div",{className:"mygame-signedout",children:[w.jsx("h2",{children:"My game"}),w.jsx("p",{children:"Log in to save pitches, keep your squad and coordinate kickabouts."}),w.jsxs("div",{className:"hero-cta",children:[w.jsx("button",{className:"btn primary big",onClick:()=>n.openAuth("register"),children:"Create an account"}),w.jsx("button",{className:"btn ghost big",onClick:()=>n.openAuth("login"),children:"Log in"})]})]});const r=i.savedPitchIds.map(a=>e.find(o=>o.pitch.id===a)||wT(a)).filter(Boolean),s=[...i.kickabouts].sort((a,o)=>`${a.date}T${a.time}`.localeCompare(`${o.date}T${o.time}`));return w.jsxs("div",{className:"mygame",children:[w.jsxs("header",{className:"mygame-head",children:[w.jsxs("h2",{children:[i.displayName,"'s game"]}),w.jsxs("p",{children:["@",i.username," · ",i.savedPitchIds.length," saved pitch",i.savedPitchIds.length===1?"":"es"," · ",i.kickabouts.length," kickabout",i.kickabouts.length===1?"":"s"]})]}),w.jsxs("section",{className:"panel",children:[w.jsx("h3",{className:"panel-title",children:"Kickabouts"}),s.length===0?w.jsx("p",{className:"panel-sub",children:"Nothing planned yet. Find a pitch, hit “Plan a kickabout”, and coordinate the squad here."}):w.jsx("ul",{className:"kickabout-list",children:s.map(a=>{var h;const o=xf(a.pitchId),l=o?hi[o.type]:null,u=(h=a.squad)!=null&&h.length?a.squad:["You"],d=u.filter(f=>a.rsvps[f]==="in").length;return w.jsxs("li",{className:"kickabout",style:{"--accent":(l==null?void 0:l.color)||"#38e07b"},children:[w.jsxs("div",{className:"kickabout-when",children:[w.jsx("strong",{children:TT(a.date)}),w.jsx("span",{children:a.time})]}),w.jsxs("div",{className:"kickabout-info",children:[w.jsx("button",{className:"pitch-name",onClick:()=>n.selectPitch(a.pitchId),children:a.pitchName}),a.notes&&w.jsxs("p",{className:"kickabout-notes",children:["“",a.notes,"”"]}),w.jsx("div",{className:"rsvp-grid",children:u.map(f=>w.jsxs("div",{className:"rsvp-row",children:[w.jsx("span",{className:"rsvp-name",children:f}),w.jsx("div",{className:"rsvp-buttons",children:MT.map(([p,x])=>w.jsx("button",{className:`chip tiny ${a.rsvps[f]===p?"chip-on":""}`,onClick:()=>n.setRsvp(a.id,f,p),children:x},p))})]},f))}),w.jsxs("p",{className:"kickabout-count",children:[d,"/",u.length," confirmed",d>=2?" — game on":""]})]}),w.jsx("button",{className:"icon-btn",onClick:()=>n.deleteKickabout(a.id),"aria-label":"Delete kickabout",children:"✕"})]},a.id)})})]}),w.jsxs("section",{className:"panel",children:[w.jsx("h3",{className:"panel-title",children:"Saved pitches"}),r.length===0?w.jsx("p",{className:"panel-sub",children:"No saved pitches yet — tap the 🤍 on any pitch to keep it here."}):w.jsx("div",{className:"results-grid",children:r.map(a=>w.jsx(Md,{row:a},a.pitch.id))})]})]})}function wT(t){const e=xf(t);return e?{pitch:e,etas:[],avgEta:0,maxEta:0,spreadEta:0,pricePerHead:e.pricePerHour,score:.5,reasons:[]}:null}function TT(t){try{return new Date(`${t}T12:00:00`).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}catch{return t}}function AT(){const{state:t,actions:e}=kn(),n=t.authModal==="register",[i,r]=ke.useState(""),[s,a]=ke.useState(""),[o,l]=ke.useState(""),[u,d]=ke.useState(""),[h,f]=ke.useState(!1);async function p(x){x.preventDefault(),f(!0),d("");try{n?await e.register({username:i,displayName:s,password:o}):await e.login({username:i,password:o})}catch(_){d(_.message||"Something went wrong.")}finally{f(!1)}}return w.jsx("div",{className:"modal-scrim",onClick:e.closeAuth,children:w.jsxs("div",{className:"modal auth-modal",onClick:x=>x.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":n?"Create account":"Log in",children:[w.jsxs("header",{className:"auth-head",children:[w.jsx("h2",{children:n?"Join the squad":"Welcome back"}),w.jsx("button",{className:"icon-btn big",onClick:e.closeAuth,"aria-label":"Close",children:"✕"})]}),w.jsx("p",{className:"auth-sub",children:n?"Save pitches, keep your squad, and plan kickabouts.":"Log in to your TopBins account."}),w.jsxs("form",{className:"auth-form",onSubmit:p,children:[w.jsx("input",{className:"input",placeholder:"Username",value:i,onChange:x=>r(x.target.value),autoComplete:"username",autoFocus:!0}),n&&w.jsx("input",{className:"input",placeholder:"Display name (what your mates call you)",value:s,onChange:x=>a(x.target.value),maxLength:30}),w.jsx("input",{className:"input",type:"password",placeholder:"Password",value:o,onChange:x=>l(x.target.value),autoComplete:n?"new-password":"current-password"}),u&&w.jsx("p",{className:"form-error",children:u}),w.jsx("button",{className:"btn primary",type:"submit",disabled:h,children:h?"…":n?"Create account":"Log in"})]}),w.jsx("button",{className:"auth-switch",onClick:()=>e.openAuth(n?"login":"register"),children:n?"Already got an account? Log in":"New here? Create an account"}),w.jsx("p",{className:"auth-note",children:"Demo build: accounts live only in this browser. A real backend slots in when the app moves to its own repo."})]})})}function CT(){var x,_,m;const{state:t,actions:e}=kn(),n=xf(t.selectedPitchId),[i,r]=ke.useState(!1),[s,a]=ke.useState(""),[o,l]=ke.useState("19:00"),[u,d]=ke.useState("");if(ke.useEffect(()=>{const c=v=>v.key==="Escape"&&e.selectPitch(null);return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[e]),!n)return null;const h=hi[n.type],f=(_=(x=t.user)==null?void 0:x.savedPitchIds)==null?void 0:_.includes(n.id);function p(){if(!t.user){e.openAuth("login");return}s&&(e.createKickabout({pitchId:n.id,pitchName:n.name,date:s,time:o,notes:u.trim(),squad:t.squad.map(c=>c.name)}),r(!1),e.selectPitch(null),e.go("game"))}return w.jsx("div",{className:"modal-scrim",onClick:()=>e.selectPitch(null),children:w.jsxs("div",{className:"modal pitch-detail",onClick:c=>c.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":n.name,children:[w.jsxs("header",{className:"detail-head",style:{"--accent":h.color},children:[w.jsxs("div",{children:[w.jsxs("p",{className:"detail-type",style:{color:h.color},children:[w.jsx("span",{className:"dot",style:{background:h.color},"aria-hidden":"true"}),h.label," · ",n.borough]}),w.jsx("h2",{children:n.name}),w.jsx("p",{className:"detail-area",children:n.area})]}),w.jsx("button",{className:"icon-btn big",onClick:()=>e.selectPitch(null),"aria-label":"Close",children:"✕"})]}),w.jsxs("div",{className:"detail-facts",children:[w.jsx("span",{className:"fact",children:n.pricePerHour===0?"Free to play":`£${n.pricePerHour}/hour`}),w.jsx("span",{className:"fact",children:n.enclosure==="bounded"?"Bounded — ball stays in":"Open pitch"}),w.jsx("span",{className:"fact",children:n.surface}),w.jsx("span",{className:"fact",children:n.formats.map(c=>`${c}-a-side`).join(", ")}),n.floodlit&&w.jsx("span",{className:"fact",children:"Floodlit"}),n.indoor&&w.jsx("span",{className:"fact",children:"Indoor option"}),n.changingRooms&&w.jsx("span",{className:"fact",children:"Changing rooms"}),w.jsx("span",{className:"fact",children:n.bookable?"Bookable":"First come, first served"})]}),((m=n.tags)==null?void 0:m.length)>0&&w.jsx("p",{className:"detail-tags",children:n.tags.map(c=>`#${c.replace(/\s+/g,"-")}`).join("  ")}),t.squad.length>0&&w.jsxs("div",{className:"detail-etas",children:[w.jsx("h3",{children:"Squad journey times"}),w.jsx("ul",{children:t.squad.map(c=>w.jsxs("li",{children:[w.jsxs("span",{children:[Ca[c.mode].emoji," ",c.name]}),w.jsx("span",{className:"eta-dots","aria-hidden":"true"}),w.jsxs("strong",{children:[v0(c,n,c.mode)," min"]})]},c.id))}),w.jsx("p",{className:"detail-eta-note",children:"Straight-line estimates — check a journey planner before kick-off."})]}),i?w.jsxs("div",{className:"plan-form",children:[w.jsx("h3",{children:"Plan the kickabout"}),w.jsxs("div",{className:"plan-row",children:[w.jsx("input",{className:"input",type:"date",value:s,onChange:c=>a(c.target.value),"aria-label":"Date"}),w.jsx("input",{className:"input",type:"time",value:o,onChange:c=>l(c.target.value),"aria-label":"Kick-off time"})]}),w.jsx("input",{className:"input",placeholder:"Notes (bring bibs, winner stays on…)",value:u,onChange:c=>d(c.target.value),maxLength:120}),w.jsxs("div",{className:"plan-actions",children:[w.jsx("button",{className:"btn primary",onClick:p,disabled:!s,children:"Lock it in"}),w.jsx("button",{className:"btn ghost",onClick:()=>r(!1),children:"Cancel"})]})]}):w.jsxs("div",{className:"detail-actions",children:[w.jsx("button",{className:"btn primary",onClick:()=>r(!0),children:"Plan a kickabout here"}),w.jsx("button",{className:"btn ghost",onClick:()=>e.toggleSave(n.id),children:f?"♥ Saved":"♡ Save pitch"})]})]})})}function RT(){const{state:t}=kn(),e=ke.useRef(null);return ke.useEffect(()=>{const n=e.current;if(!n)return;const i=new uT;try{i.mount(n)}catch{return}return()=>i.unmount()},[]),w.jsxs(w.Fragment,{children:[w.jsx("div",{className:"backdrop",ref:e,"aria-hidden":"true"}),w.jsxs("div",{className:"app",children:[w.jsx(cT,{}),w.jsxs("main",{children:[t.view==="home"&&w.jsx(gT,{}),t.view==="find"&&w.jsx(ST,{}),t.view==="game"&&w.jsx(ET,{})]}),w.jsxs("footer",{className:"footer",children:[w.jsx("span",{children:"TopBins — built for London ballers."}),w.jsx("span",{className:"footer-note",children:"Venue details are indicative — always check with the venue before travelling."})]})]}),t.authModal&&w.jsx(AT,{}),t.selectedPitchId&&w.jsx(CT,{})]})}h0(document.getElementById("root")).render(w.jsx(Sv.StrictMode,{children:w.jsx($x,{children:w.jsx(RT,{})})}));
