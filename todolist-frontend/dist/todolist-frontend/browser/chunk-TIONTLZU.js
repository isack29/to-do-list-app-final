import{a as _}from"./chunk-NUJ6HCB5.js";import{a as T,b as K,c as v,d as Q,e as W,f as X,g as Y,h as Z,j as ee,k as te,l as re}from"./chunk-UWLG3XMK.js";import{$ as k,B as E,E as m,G as a,H as s,I as $,J as B,K as g,L as x,M as o,N as c,O,Q as j,R as U,X as R,Y as z,Z as V,_ as q,aa as L,ba as H,c as b,f as D,fa as G,g as A,ia as J,j as P,m as u,o as S,p as w,u as l,w as I,x as N}from"./chunk-UUAKNBKM.js";import{a as M,b as F}from"./chunk-2NFLSA4Y.js";var y=class n{_http=u(H);_storage=u(J);constructor(){}findAllTaskByUserId(t,e,r){let i=JSON.parse(localStorage.getItem("session")||"{}")?.accessToken;if(!i)return console.error("\u26A0\uFE0F No hay token disponible"),b(()=>new Error("No token available"));let f={params:new L().set("page",e.toString()).set("pageSize",r.toString()),headers:new k({Authorization:`Bearer ${i}`,"Content-Type":"application/json"})};return this._http.get(`${T.API_URL}/users/${t}/tasks`,f).pipe(D(p=>(console.error("\u274C Error obteniendo tareas:",p),b(()=>p))))}addTask(t,e,r,i){let d=JSON.parse(localStorage.getItem("session")||"{}")?.accessToken;if(!d)return console.error("\u26A0\uFE0F No hay token disponible"),b(()=>new Error("No token available"));let f={title:t,description:r,date:e},p={headers:new k({Authorization:`Bearer ${d}`,"Content-Type":"application/json"})};return this._http.post(`${T.API_URL}/users/${i}/tasks`,f,p).pipe(A(h=>console.log("\u2705 Tareas creada:",h)),D(h=>(console.error("\u274C Error creando tareas:",h),b(()=>h))))}deleteTask(t,e){let r=JSON.parse(localStorage.getItem("session")||"{}")?.accessToken,i={headers:new k({Authorization:`Bearer ${r}`,"Content-Type":"application/json"})};return this._http.delete(`${T.API_URL}/users/${t}/tasks/${e}`,i)}updateTask(t,e,r,i,d){let f={title:r,description:d,date:i},p=JSON.parse(localStorage.getItem("session")||"{}")?.accessToken,h={headers:new k({Authorization:`Bearer ${p}`,"Content-Type":"application/json"})};return this._http.patch(`${T.API_URL}/users/${t}/tasks/${e}`,f,h)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=P({token:n,factory:n.\u0275fac,providedIn:"root"})};function se(n,t){if(n&1&&(a(0,"div",19),o(1),s()),n&2){let e=x();l(),c(" ",e.successMessage," ")}}function oe(n,t){if(n&1&&(a(0,"div",20),o(1),s()),n&2){let e=x();l(),c(" ",e.errorMessage," ")}}function ne(n,t){if(n&1){let e=B();a(0,"li",21)(1,"div",22)(2,"h3",23),o(3),s(),a(4,"p",24),o(5),s(),a(6,"p",25),o(7),j(8,"date"),s()(),a(9,"div",26)(10,"button",27),g("click",function(){let i=S(e).$implicit,d=x();return w(d.editTask(i))}),o(11," \u270F\uFE0F Editar "),s(),a(12,"button",28),g("click",function(){let i=S(e).$implicit,d=x();return w(d.deleteTask(i.id))}),o(13," \u{1F5D1}\uFE0F Eliminar "),s()()()}if(n&2){let e=t.$implicit;l(3),c(" \u{1F4DD} ",e.title," "),l(2),c(" ",e.description," "),l(2),c(" \u{1F4C5} ",U(8,3,e.date,"yyyy-MM-dd HH:mm")," ")}}var C=class n{constructor(t,e){this.tasksService=t;this.authService=e}_authStateService=u(_);errorMessage=null;successMessage=null;editingTaskId=null;isEditing=!1;userId;tasks=[];currentPage=1;pageSize=4;totalPages=1;_router=u(G);_formBuilder=u(te);ngOnInit(){this.userId=this.authService.getUserId(),console.log("Usuario logueado con ID:",this.userId),this.findAllTaskByUserId()}form=this._formBuilder.group({title:this._formBuilder.nonNullable.control("",v.required),date:this._formBuilder.nonNullable.control(null,v.required),description:this._formBuilder.nonNullable.control("",[v.required,v.maxLength(100)])});findAllTaskByUserId(){this.tasksService.findAllTaskByUserId(this.userId,this.currentPage,this.pageSize).subscribe(t=>{this.tasks=t.data,this.totalPages=t.totalPages,console.log(`\u{1F4CC} Mostrando p\xE1gina ${this.currentPage} de ${this.totalPages}`)})}addTask(){if(this.form.invalid){this.errorMessage="\u26A0\uFE0F Todos los campos son obligatorios.",setTimeout(()=>{this.errorMessage=null},3e3);return}let{title:t,date:e,description:r}=this.form.getRawValue();if(!e){this.errorMessage="\u26A0\uFE0F Debes seleccionar una fecha.",setTimeout(()=>{this.errorMessage=null},3e3);return}this.errorMessage=null,this.tasksService.addTask(t,e,r,this.userId).subscribe({next:i=>{console.log("\u2705 Tarea creada:",i),this.successMessage="\u2705 Tarea creada con \xE9xito.",this.form.reset(),this.findAllTaskByUserId(),setTimeout(()=>{this.successMessage=null},3e3)},error:i=>{console.error("\u274C Error creando tarea:",i),i.error&&i.error.message?this.errorMessage=i.error.message:this.errorMessage="\u274C Ocurri\xF3 un error inesperado. Int\xE9ntalo de nuevo.",setTimeout(()=>{this.errorMessage=null},3e3)}})}deleteTask(t){confirm("\u274C \xBFSeguro que deseas eliminar esta tarea?")&&this.tasksService.deleteTask(this.userId,t).subscribe({next:()=>{console.log(`\u{1F5D1}\uFE0F Tarea con ID ${t} eliminada`),this.successMessage="\u2705 Tarea eliminada con \xE9xito.",this.tasks=this.tasks.filter(e=>e.id!==t),setTimeout(()=>{this.successMessage=null},3e3)},error:e=>{console.error("\u274C Error eliminando tarea:",e),this.errorMessage="\u274C Ocurri\xF3 un error al eliminar la tarea.",setTimeout(()=>{this.errorMessage=null},3e3)}})}editTask(t){this.isEditing=!0,this.editingTaskId=t.id;let e=t.date?new Date(t.date).toISOString().slice(0,16):"";this.form.setValue({title:t.title,date:new Date(e),description:t.description}),console.log(`\u270F\uFE0F Editando tarea con ID: ${t.id}`)}updateTask(){if(this.form.invalid||this.editingTaskId===null){this.errorMessage="\u26A0\uFE0F Todos los campos son obligatorios.",setTimeout(()=>{this.errorMessage=null},3e3);return}let{title:t,date:e,description:r}=this.form.getRawValue();if(!e){this.errorMessage="\u26A0\uFE0F Debes seleccionar una fecha.",setTimeout(()=>{this.errorMessage=null},3e3);return}this.tasksService.updateTask(this.userId,this.editingTaskId,t,e,r).subscribe({next:()=>{console.log(`\u{1F504} Tarea con ID ${this.editingTaskId} actualizada`),this.successMessage="\u2705 Tarea actualizada con \xE9xito.",this.tasks=this.tasks.map(i=>i.id===this.editingTaskId?F(M({},i),{title:t,date:e,description:r}):i),this.form.reset(),this.isEditing=!1,this.editingTaskId=null,setTimeout(()=>{this.successMessage=null},3e3)},error:i=>{console.error("\u274C Error actualizando tarea:",i),this.errorMessage="\u274C Ocurri\xF3 un error al actualizar la tarea.",setTimeout(()=>{this.errorMessage=null},3e3)}})}changePage(t){t>=1&&t<=this.totalPages&&(this.currentPage=t,this.findAllTaskByUserId())}logout(){this._authStateService.singOut(),this._router.navigateByUrl("/auth/log-in")}static \u0275fac=function(e){return new(e||n)(I(y),I(_))};static \u0275cmp=N({type:n,selectors:[["app-dashboard"]],decls:29,vars:10,consts:[[1,"bg-[#fefefe]","min-h-screen","flex","flex-col","items-center","p-4","md:p-6"],[1,"w-full","max-w-4xl","flex","flex-col","md:flex-row","justify-between","items-center","mb-6"],[1,"text-2xl","md:text-3xl","font-extrabold","text-gray-800","mb-4","md:mb-0"],[1,"text-white","bg-[#d67272]","hover:bg-[#c06060]","transition-all","px-4","py-2","rounded-lg","shadow-md","focus:outline-none","w-full","md:w-auto",3,"click"],[1,"w-full","max-w-4xl","bg-[#f8f9fa]","p-6","rounded-xl","shadow-lg"],[1,"text-lg","md:text-xl","font-semibold","text-gray-900","mb-4"],["class","text-green-700 bg-green-100 p-3 rounded-lg mb-4",4,"ngIf"],["class","text-red-700 bg-red-100 p-3 rounded-lg mb-4",4,"ngIf"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4",3,"formGroup"],["type","text","placeholder","T\xEDtulo","formControlName","title",1,"w-full","p-3","border","border-gray-300","rounded-lg","focus:ring-2","focus:ring-[#5e81ac]","shadow-sm","bg-white"],["type","datetime-local","formControlName","date",1,"w-full","p-3","border","border-gray-300","rounded-lg","focus:ring-2","focus:ring-[#5e81ac]","shadow-sm","bg-white"],["placeholder","Descripci\xF3n (m\xE1x. 100 caracteres)","maxlength","100","formControlName","description",1,"w-full","col-span-1","md:col-span-2","p-3","border","border-gray-300","rounded-lg","focus:ring-2","focus:ring-[#5e81ac]","shadow-sm","bg-white"],["type","submit",1,"w-full","col-span-1","md:col-span-2","bg-[#5e81ac]","text-white","p-3","rounded-lg","hover:bg-[#4a6b91]","transition-all","shadow-md",3,"click"],[1,"w-full","max-w-4xl","bg-[#f8f9fa]","p-6","rounded-xl","shadow-lg","mt-6"],[1,"space-y-4"],["class","flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-300 rounded-lg bg-[#dfe3e6] shadow-md",4,"ngFor","ngForOf"],[1,"flex","justify-center","items-center","space-x-2","mt-6"],[1,"px-4","py-2","bg-gray-300","rounded-lg","shadow-md","disabled:opacity-50",3,"click","disabled"],[1,"text-lg","font-semibold"],[1,"text-green-700","bg-green-100","p-3","rounded-lg","mb-4"],[1,"text-red-700","bg-red-100","p-3","rounded-lg","mb-4"],[1,"flex","flex-col","md:flex-row","justify-between","items-start","md:items-center","p-4","border","border-gray-300","rounded-lg","bg-[#dfe3e6]","shadow-md"],[1,"flex-1"],[1,"text-base","md:text-lg","font-medium","text-gray-900"],[1,"text-sm","text-gray-600"],[1,"text-xs","text-gray-500"],[1,"flex","space-x-2","mt-2","md:mt-0"],[1,"text-white","bg-[#5e81ac]","hover:bg-[#4a6b91]","px-4","py-2","rounded-lg","transition-all","shadow-md",3,"click"],[1,"text-white","bg-[#d67272]","hover:bg-[#c06060]","px-4","py-2","rounded-lg","transition-all","shadow-md",3,"click"]],template:function(e,r){e&1&&(a(0,"section",0)(1,"div",1)(2,"h1",2),o(3," \u{1F4CC} Mis Tareas "),s(),a(4,"button",3),g("click",function(){return r.logout()}),o(5," \u{1F6AA} Cerrar sesi\xF3n "),s()(),a(6,"div",4)(7,"h2",5),o(8),s(),E(9,se,2,1,"div",6)(10,oe,2,1,"div",7),a(11,"form",8),$(12,"input",9)(13,"input",10)(14,"textarea",11),a(15,"button",12),g("click",function(){return r.isEditing?r.updateTask():r.addTask()}),o(16),s()()(),a(17,"div",13)(18,"h2",5),o(19," \u2705 Tareas pendientes "),s(),a(20,"ul",14),E(21,ne,14,6,"li",15),s()(),a(22,"div",16)(23,"button",17),g("click",function(){return r.changePage(r.currentPage-1)}),o(24," \u2B05\uFE0F Anterior "),s(),a(25,"span",18),o(26),s(),a(27,"button",17),g("click",function(){return r.changePage(r.currentPage+1)}),o(28," Siguiente \u27A1\uFE0F "),s()()()),e&2&&(l(8),c(" ",r.isEditing?"\u270F\uFE0F Editar tarea":"\u270D\uFE0F Nueva tarea"," "),l(),m("ngIf",r.successMessage),l(),m("ngIf",r.errorMessage),l(),m("formGroup",r.form),l(5),c(" ",r.isEditing?"\u{1F504} Actualizar":"\u2795 Agregar Tarea"," "),l(5),m("ngForOf",r.tasks),l(2),m("disabled",r.currentPage===1),l(3),O("P\xE1gina ",r.currentPage," de ",r.totalPages,""),l(),m("disabled",r.currentPage===r.totalPages))},dependencies:[q,R,z,V,re,X,K,Q,W,ee,Y,Z],encapsulation:2})};export{C as default};
