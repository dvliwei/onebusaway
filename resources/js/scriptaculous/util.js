Object.inspect=function(B){var A=[];
if(typeof B=="string"||typeof B=="number"){return B
}else{for(property in B){if(typeof B[property]!="function"){A.push(property+' => "'+B[property]+'"')
}}}return("'"+B+"' #"+typeof B+": {"+A.join(", ")+"}")
};
Array.flatten=function(G,D){if(D===undefined){D=false
}var B=[];
var A=G.length;
for(var C=0;
C<A;
C++){var E=G[C];
if(E instanceof Array){var F=E.flatten(D);
B=B.concat(F)
}else{if(!D||E!=undefined){B.push(E)
}}}return B
};
if(!Array.prototype.flatten){Array.prototype.flatten=function(A){return Array.flatten(this,A)
}
}var Builder={node:function(A){var B=document.createElement(A);
if(arguments[1]){if(this._isStringOrNumber(arguments[1])||(arguments[1] instanceof Array)){this._children(B,arguments[1])
}else{this._attributes(B,arguments[1])
}}if(arguments[2]){this._children(B,arguments[2])
}return B
},_text:function(A){return document.createTextNode(A)
},_attributes:function(B,A){for(attribute in A){var D=A[attribute];
if(attribute=="style"&&typeof D=="object"){var C=B.style;
for(styleProp in D){C[styleProp]=D[styleProp]
}}else{if(this._isStringOrNumber(A[attribute])){B.setAttribute(attribute=="className"?"class":attribute,D)
}}}},_children:function(C,B){if(typeof B=="object"){B=B.flatten();
for(var A=0;
A<B.length;
A++){if(typeof B[A]=="object"){C.appendChild(B[A])
}else{if(this._isStringOrNumber(B[A])){C.appendChild(this._text(B[A]))
}}}}else{if(this._isStringOrNumber(B)){C.appendChild(this._text(B))
}}},_isStringOrNumber:function(A){return(typeof A=="string"||typeof A=="number")
}};
String.prototype.camelize=function(){var D=this.split("-");
if(D.length==1){return D[0]
}var B=this.indexOf("-")==0?D[0].charAt(0).toUpperCase()+D[0].substring(1):D[0];
for(var C=1,A=D.length;
C<A;
C++){var E=D[C];
B+=E.charAt(0).toUpperCase()+E.substring(1)
}return B
};
Element.getStyle=function(B,C){B=$(B);
var D=B.style[C.camelize()];
if(!D){if(document.defaultView&&document.defaultView.getComputedStyle){var A=document.defaultView.getComputedStyle(B,null);
D=(A!=null)?A.getPropertyValue(C):null
}else{if(B.currentStyle){D=B.currentStyle[C.camelize()]
}}}if(D=="auto"){D=null
}return D
};
Element.makePositioned=function(A){A=$(A);
if(Element.getStyle(A,"position")=="static"){A.style.position="relative"
}};
Element.makeClipping=function(A){A=$(A);
A._overflow=Element.getStyle(A,"overflow")||"visible";
if(A._overflow!="hidden"){A.style.overflow="hidden"
}};
Element.undoClipping=function(A){A=$(A);
if(A._overflow!="hidden"){A.style.overflow=A._overflow
}};
Element.collectTextNodesIgnoreClass=function(D,E){var C=$(D).childNodes;
var F="";
var B=new RegExp("^([^ ]+ )*"+E+"( [^ ]+)*$","i");
for(var A=0;
A<C.length;
A++){if(C[A].nodeType==3){F+=C[A].nodeValue
}else{if((!C[A].className.match(B))&&C[A].hasChildNodes()){F+=Element.collectTextNodesIgnoreClass(C[A],E)
}}}return F
};
Position.positionedOffset=function(B){var A=0,C=0;
do{A+=B.offsetTop||0;
C+=B.offsetLeft||0;
B=B.offsetParent;
if(B){p=Element.getStyle(B,"position");
if(p=="relative"||p=="absolute"){break
}}}while(B);
return[C,A]
};
if(navigator.appVersion.indexOf("AppleWebKit")>0){Position.cumulativeOffset=function(B){var A=0,C=0;
do{A+=B.offsetTop||0;
C+=B.offsetLeft||0;
if(B.offsetParent==document.body){if(Element.getStyle(B,"position")=="absolute"){break
}}B=B.offsetParent
}while(B);
return[C,A]
}
}Position.page=function(D){if(B==document.body){return[0,0]
}var A=0,C=0;
var B=D;
do{A+=B.offsetTop||0;
C+=B.offsetLeft||0;
if(B.offsetParent==document.body){if(Element.getStyle(B,"position")=="absolute"){break
}}}while(B=B.offsetParent);
var B=D;
do{A-=B.scrollTop||0;
C-=B.scrollLeft||0
}while(B=B.parentNode);
return[C,A]
};
Position.offsetParent=function(A){if(A.offsetParent){return A.offsetParent
}if(A==document.body){return A
}while((A=A.parentNode)&&A!=document.body){if(Element.getStyle(A,"position")!="static"){return A
}}return document.body
};
Position.clone=function(C,E){var A=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});
C=$(C);
var D=Position.page(C);
E=$(E);
var B=Position.offsetParent(E);
var F=Position.page(B);
if(B==document.body){F[0]-=document.body.offsetLeft;
F[1]-=document.body.offsetTop
}if(A.setLeft){E.style.left=(D[0]-F[0]+A.offsetLeft)+"px"
}if(A.setTop){E.style.top=(D[1]-F[1]+A.offsetTop)+"px"
}if(A.setWidth){E.style.width=C.offsetWidth+"px"
}if(A.setHeight){E.style.height=C.offsetHeight+"px"
}};
Position.absolutize=function(B){B=$(B);
if(B.style.position=="absolute"){return 
}Position.prepare();
var D=Position.positionedOffset(B);
var F=D[1];
var E=D[0];
var C=B.clientWidth;
var A=B.clientHeight;
B._originalLeft=E-parseFloat(B.style.left||0);
B._originalTop=F-parseFloat(B.style.top||0);
B._originalWidth=B.style.width;
B._originalHeight=B.style.height;
B.style.position="absolute";
B.style.top=F+"px";
B.style.left=E+"px";
B.style.width=C+"px";
B.style.height=A+"px"
};
Position.relativize=function(A){A=$(A);
if(A.style.position=="relative"){return 
}Position.prepare();
A.style.position="relative";
var C=parseFloat(A.style.top||0)-(A._originalTop||0);
var B=parseFloat(A.style.left||0)-(A._originalLeft||0);
A.style.top=C+"px";
A.style.left=B+"px";
A.style.height=A._originalHeight;
A.style.width=A._originalWidth
};
Element.Class={toggle:function(A,B){if(Element.Class.has(A,B)){Element.Class.remove(A,B);
if(arguments.length==3){Element.Class.add(A,arguments[2])
}}else{Element.Class.add(A,B);
if(arguments.length==3){Element.Class.remove(A,arguments[2])
}}},get:function(A){A=$(A);
return A.className.split(" ")
},remove:function(B){B=$(B);
var C;
for(var A=1;
A<arguments.length;
A++){C=new RegExp("(^|\\s)"+arguments[A]+"(\\s|$)","g");
B.className=B.className.replace(C,"")
}},add:function(B){B=$(B);
for(var A=1;
A<arguments.length;
A++){Element.Class.remove(B,arguments[A]);
B.className+=(B.className.length>0?" ":"")+arguments[A]
}},has:function(C){C=$(C);
if(!C||!C.className){return false
}var D;
for(var B=1;
B<arguments.length;
B++){if((typeof arguments[B]=="object")&&(arguments[B].constructor==Array)){for(var A=0;
A<arguments[B].length;
A++){D=new RegExp("(^|\\s)"+arguments[B][A]+"(\\s|$)");
if(!D.test(C.className)){return false
}}}else{D=new RegExp("(^|\\s)"+arguments[B]+"(\\s|$)");
if(!D.test(C.className)){return false
}}}return true
},has_any:function(C){C=$(C);
if(!C||!C.className){return false
}var D;
for(var B=1;
B<arguments.length;
B++){if((typeof arguments[B]=="object")&&(arguments[B].constructor==Array)){for(var A=0;
A<arguments[B].length;
A++){D=new RegExp("(^|\\s)"+arguments[B][A]+"(\\s|$)");
if(D.test(C.className)){return true
}}}else{D=new RegExp("(^|\\s)"+arguments[B]+"(\\s|$)");
if(D.test(C.className)){return true
}}}return false
},childrenWith:function(C,D){var B=$(C).getElementsByTagName("*");
var E=new Array();
for(var A=0;
A<B.length;
A++){if(Element.Class.has(B[A],D)){E.push(B[A]);
break
}}return E
}};
String.prototype.parseQuery=function(){var E=this;
if(E.substring(0,1)=="?"){E=this.substring(1)
}var A={};
var C=E.split("&");
for(var B=0;
B<C.length;
B++){var D=C[B].split("=");
A[D[0]]=D[1]
}return A
};