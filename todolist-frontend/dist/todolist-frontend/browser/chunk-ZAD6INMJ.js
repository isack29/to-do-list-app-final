import{a as p}from"./chunk-UWLG3XMK.js";import{ba as g,g as n,ia as m,j as c,m as a}from"./chunk-UUAKNBKM.js";var f=class s{_http=a(g);_storage=a(m);constructor(){}logIn(t,r){return this._http.post(`${p.API_URL}/auth/log-in`,{email:t,password:r}).pipe(n(i=>{let e=i?.data;e&&e.accessToken&&this._storage.set("session",JSON.stringify(e))}))}signUp(t,r,i){return this._http.post(`${p.API_URL}/auth/sign-up`,{name:t,email:r,password:i}).pipe(n(e=>{let o=e?.data;o&&o.accessToken&&this._storage.set("session",JSON.stringify(o))}))}getUserId(){return JSON.parse(localStorage.getItem("user")||"{}").id}static \u0275fac=function(r){return new(r||s)};static \u0275prov=c({token:s,factory:s.\u0275fac,providedIn:"root"})};export{f as a};
