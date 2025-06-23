import{bj as E,bm as _,r as i,bl as $,ah as H,j as r,ai as w,bQ as b}from"./index-CXFt3BQN.js";function P(s){const{checked:o,defaultChecked:t,disabled:l,onBlur:u,onChange:d,onFocus:a,onFocusVisible:x,readOnly:g,required:C}=s,[F,S]=E({controlled:o,default:!!t,name:"Switch",state:"checked"}),y=c=>e=>{var n;e.nativeEvent.defaultPrevented||(S(e.target.checked),d==null||d(e),(n=c.onChange)==null||n.call(c,e))},{isFocusVisibleRef:h,onBlur:B,onFocus:R,ref:V}=_(),[f,p]=i.useState(!1);l&&f&&p(!1),i.useEffect(()=>{h.current=f},[f,h]);const k=i.useRef(null),j=c=>e=>{var n;k.current||(k.current=e.currentTarget),R(e),h.current===!0&&(p(!0),x==null||x(e)),a==null||a(e),(n=c.onFocus)==null||n.call(c,e)},I=c=>e=>{var n;B(e),h.current===!1&&p(!1),u==null||u(e),(n=c.onBlur)==null||n.call(c,e)},m=$(V,k);return{checked:F,disabled:!!l,focusVisible:f,getInputProps:(c={})=>H({checked:o,defaultChecked:t,disabled:l,readOnly:g,ref:m,required:C,type:"checkbox",role:"switch","aria-checked":o},c,{onChange:y(c),onFocus:j(c),onBlur:I(c)}),inputRef:m,readOnly:!!g}}const T=b("span")`
  display: inline-block;
  position: relative;
  width: 54px;
  height: 27px;
`,z=b("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`,N=b("span")`
  position: absolute;
  display: block;
  background-color: ${"#fff"};
  width: 23px;
  height: 23px;
  border-radius: 30px;
  top: 2px;
  left: 3px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &.focusVisible {
    background-color: #79b;
  }

  &.checked {
    transform: translateX(24px);
  }
`,O=b("span",{shouldForwardProp:s=>s!=="color"&&s!=="checked"})(({color:s,checked:o,theme:t})=>({backgroundColor:t.palette.grey[400],borderRadius:36,width:"100%",height:"100%",display:"block",...o&&{backgroundColor:t.palette[s].main}}));function q(s){const{getInputProps:o,checked:t,disabled:l,focusVisible:u}=P(s),{color:d="primary"}=s,a={checked:t,disabled:l,focusVisible:u};return r.jsxs(T,{className:w(a),children:[r.jsx(O,{color:d,checked:t,children:r.jsx(N,{className:w(a)})}),r.jsx(z,{...o(),"aria-label":"Demo switch"})]})}function Q(s){let[o,t]=i.useState(!1);return i.useEffect(()=>{t(s.checked)},[s.checked]),r.jsx(q,{...s})}export{Q as S};
