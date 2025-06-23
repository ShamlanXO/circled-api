import{bi as E,bl as P,r,bk as _,ah as $,j as i,ai as m,bP as b}from"./index-BnX2JhPI.js";function H(s){const{checked:o,defaultChecked:t,disabled:l,onBlur:u,onChange:d,onFocus:a,onFocusVisible:x,readOnly:g,required:C}=s,[F,S]=E({controlled:o,default:!!t,name:"Switch",state:"checked"}),y=c=>e=>{var n;e.nativeEvent.defaultPrevented||(S(e.target.checked),d==null||d(e),(n=c.onChange)==null||n.call(c,e))},{isFocusVisibleRef:h,onBlur:B,onFocus:R,ref:V}=P(),[f,p]=r.useState(!1);l&&f&&p(!1),r.useEffect(()=>{h.current=f},[f,h]);const k=r.useRef(null),I=c=>e=>{var n;k.current||(k.current=e.currentTarget),R(e),h.current===!0&&(p(!0),x==null||x(e)),a==null||a(e),(n=c.onFocus)==null||n.call(c,e)},j=c=>e=>{var n;B(e),h.current===!1&&p(!1),u==null||u(e),(n=c.onBlur)==null||n.call(c,e)},w=_(V,k);return{checked:F,disabled:!!l,focusVisible:f,getInputProps:(c={})=>$({checked:o,defaultChecked:t,disabled:l,readOnly:g,ref:w,required:C,type:"checkbox",role:"switch","aria-checked":o},c,{onChange:y(c),onFocus:I(c),onBlur:j(c)}),inputRef:w,readOnly:!!g}}const T=b("span")`
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
`,O=b("span",{shouldForwardProp:s=>s!=="color"&&s!=="checked"})(({color:s,checked:o,theme:t})=>({backgroundColor:t.palette.grey[400],borderRadius:36,width:"100%",height:"100%",display:"block",...o&&{backgroundColor:t.palette[s].main}}));function q(s){const{getInputProps:o,checked:t,disabled:l,focusVisible:u}=H(s),{color:d="primary"}=s,a={checked:t,disabled:l,focusVisible:u};return i.jsxs(T,{className:m(a),children:[i.jsx(O,{color:d,checked:t,children:i.jsx(N,{className:m(a)})}),i.jsx(z,{...o(),"aria-label":"Demo switch"})]})}function U(s){let[o,t]=r.useState(!1);return r.useEffect(()=>{t(s.checked)},[s.checked]),i.jsx(q,{...s})}export{U as S};
