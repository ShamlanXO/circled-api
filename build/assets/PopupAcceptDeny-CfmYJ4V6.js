import{aB as M,r as p,aC as $,ac as z,j as e,ad as F,bJ as j,e as H,a as R,u as N,s as I,B as d,T as y,bK as O,R as S,bL as Y,bM as W,A as L,bN as q,E as J,p as v}from"./index-Cb4UtI10.js";import{u as K}from"./useControlled-De64zSaL.js";import{h as U}from"./moment-G82_0lEo.js";import{A}from"./Avatar-CFfCiX22.js";import{f as X,a as G,r as Q}from"./invite-DDI1zNnD.js";function Z(n){const{checked:a,defaultChecked:t,disabled:c,onBlur:l,onChange:s,onFocus:i,onFocusVisible:x,readOnly:f,required:g}=n,[u,k]=K({controlled:a,default:!!t,name:"Switch",state:"checked"}),T=r=>o=>{var h;o.nativeEvent.defaultPrevented||(k(o.target.checked),s==null||s(o),(h=r.onChange)==null||h.call(r,o))},{isFocusVisibleRef:b,onBlur:D,onFocus:V,ref:P}=M(),[m,w]=p.useState(!1);c&&m&&w(!1),p.useEffect(()=>{b.current=m},[m,b]);const C=p.useRef(null),_=r=>o=>{var h;C.current||(C.current=o.currentTarget),V(o),b.current===!0&&(w(!0),x==null||x(o)),i==null||i(o),(h=r.onFocus)==null||h.call(r,o)},E=r=>o=>{var h;D(o),b.current===!1&&w(!1),l==null||l(o),(h=r.onBlur)==null||h.call(r,o)},B=$(P,C);return{checked:u,disabled:!!c,focusVisible:m,getInputProps:(r={})=>z({checked:a,defaultChecked:t,disabled:c,readOnly:f,ref:B,required:g,type:"checkbox",role:"switch","aria-checked":a},r,{onChange:T(r),onFocus:_(r),onBlur:E(r)}),inputRef:B,readOnly:!!f}}const ee=j("span")`
  display: inline-block;
  position: relative;
  width: 54px;
  height: 27px;
`,te=j("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`,se=j("span")`
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
`,ne=j("span",{shouldForwardProp:n=>n!=="color"&&n!=="checked"})(({color:n,checked:a,theme:t})=>({backgroundColor:t.palette.grey[400],borderRadius:36,width:"100%",height:"100%",display:"block",...a&&{backgroundColor:t.palette[n].main}}));function ae(n){const{getInputProps:a,checked:t,disabled:c,focusVisible:l}=Z(n),{color:s="primary"}=n,i={checked:t,disabled:c,focusVisible:l};return e.jsxs(ee,{className:F(i),children:[e.jsx(ne,{color:s,checked:t,children:e.jsx(se,{className:F(i)})}),e.jsx(te,{...a(),"aria-label":"Demo switch"})]})}function oe(n){let[a,t]=p.useState(!1);return p.useEffect(()=>{t(n.checked)},[n.checked]),e.jsx(ae,{...n})}const re=I(d)(()=>({display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 0 32px 0",width:"100%",borderRadius:4,cursor:"pointer",":hover":{boxShadow:"0px 4px 54px rgba(225, 231, 240, 1)"}})),ce=I(d)(()=>({}));I(d)(()=>({position:"absolute",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",paddingTop:52,paddingBottom:24,zIndex:100,top:0}));function fe({programs:n}){const a=H(),t=R(),c=N(s=>s.AtheletePlan.currentPlan),l=[...n].sort((s,i)=>s._id===c?-1:i._id===c?1:0);return e.jsx(ce,{children:l.map(s=>e.jsx(re,{children:e.jsxs(d,{display:"flex",alignItems:"center",width:"100%",onClick:()=>a("/client/my-program"),children:[e.jsx(A,{variant:"rounded",style:{width:"132px",height:"88px",backgroundColor:"#F3F5F8"},src:s.BannerImage||"/images/DefaultThumbnail.png"}),e.jsxs(d,{width:"100%",marginLeft:1,children:[e.jsx(y,{variant:"h5",color:"text.primary",sx:{wordBreak:"break-word"},children:s==null?void 0:s.Title})," ",e.jsxs(d,{display:"flex",justifyContent:"space-between",alignItems:"flex-end",children:[e.jsxs(d,{children:[e.jsx(y,{variant:"body2",color:"text.secondary",flexWrap:"wrap",children:"Subscribed"}),e.jsx(y,{variant:"body2",color:"text.secondary",flexWrap:"wrap",children:U(s.createdAt).format("DD MMM YYYY")})]}),e.jsx(d,{children:e.jsx(oe,{checked:s._id==c,color:"primary",onChange:i=>t(O({...s,isActive:i.target.checked}))})})]})]})]})}))})}function xe(){var f,g;const[n,a]=S.useState(!1),[t,c]=S.useState(null),l=R();p.useEffect(()=>{setTimeout(()=>{l(X()).then(u=>{u.length>0&&(c(u[0]),a(!0))})},1e3)},[]);const s=u=>{a(!1),l(G(u)).then(k=>{a(!1)})},i=u=>{a(!1),l(Q(u)).then(k=>{a(!1)})},x=()=>{a(!1)};return e.jsxs(Y,{open:n,onClose:x,children:[e.jsx(W,{id:"alert-dialog-title",children:"Invitation"}),e.jsxs(L,{children:[e.jsxs(d,{display:"flex",alignItems:"center",my:2,children:[e.jsx(A,{src:(f=t==null?void 0:t.invitedBy)==null?void 0:f.profilePic,sx:{mr:1}}),e.jsx(y,{variant:"h6",sx:{textTransform:"capitalize"},children:(g=t==null?void 0:t.invitedBy)==null?void 0:g.name})]}),e.jsx(q,{id:"alert-dialog-description",color:"text.primary",children:"Wants you to be on his client list. Accepting will allow the trainer to view your fitness information."})]}),e.jsxs(J,{children:[e.jsx(v,{onClick:()=>{i(t._id)},variant:"outlined",children:"Reject"}),e.jsx(v,{variant:"contained",onClick:()=>{s(t._id)},autoFocus:!0,children:"Accept"})]})]})}export{xe as A,fe as C};
