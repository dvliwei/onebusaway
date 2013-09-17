Lightbox=Class.create({initialize:function(C,A,B){this.formUrl=C;
this.saveUrl=A;
this.redirectUrl=B;
this.formData="";
this.loadedForms=new Object();
this.lbinit();
this.lbShow();
this.lbLoadForm(C)
},lbShow:function(){this.lbLoading();
toggleClass($("lb-bg"),"hidden");
toggleClass($("lb-align"),"hidden");
this.resizeBackground();
if(browser.isIE6x){$$("select").each(function(A){if(A.up("#lb")){return 
}A._x_originalVisibility=A.style.visibility;
A.setStyle({visibility:"hidden"})
})
}},lbHide:function(){toggleClass($("lb-bg"),"hidden");
toggleClass($("lb-align"),"hidden");
if(browser.isIE6x){$$("select").each(function(A){A.setStyle({visibility:A._x_originalVisibility})
})
}},lbLoading:function(){if(this.currentUrl){this.loadedForms[this.currentUrl]=$("lb-content").firstChild.cloneNode(true)
}$("lb-content").innerHTML=this.getWaiting()
},lbLoadForm:function(A){this.currentUrl=A;
if(this.loadedForms[A]){$("lb-content").innerHTML="";
this.lbPlaceContentInDocument(this.loadedForms[A],$("lb-content"));
this.form=c.getElementsByTagName("form")[0]
}else{new Ajax.Request(A,{onSuccess:this.lbFormDataLoaded.bind(this)})
}},lbFormDataLoaded:function(B){var A=document.createElement("div");
A.innerHTML=B.responseText;
$("lb-content").innerHTML="";
this.lbPlaceContentInDocument(A,$("lb-content"),function(){this.resizeBackground()
}.bind(this));
this.form=$("lb-content").getElementsByTagName("form")[0]
},lbPlaceContentInDocument:function(G,H,A){document.stopObserving("dom:loaded");
var B=Array.from(G.getElementsByTagName("script"));
var J=Array.from(G.getElementsByTagName("link"));
var L=Array.from(G.getElementsByTagName("style"));
var K=J.concat(B,L).flatten();
var I=[];
for(var E=0;
E<K.length;
E++){I[E]=document.createElement(K[E].tagName);
var D=K[E].attributes;
for(var C=0;
C<D.length;
C++){I[E].setAttribute(D[C].name,D[C].value)
}I[E].innerHTML=K[E].innerHTML;
K[E].parentNode.removeChild(K[E])
}H.appendChild(G);
var F=function(P,O,Q,M){var N=0;
if(M){N=M
}while(N<P.length){O.appendChild(P[N]);
if(P[N].tagName=="SCRIPT"&&P[N].src!=""){Event.observe(P[N],"load",function(){F(P,O,Q,N+1)
});
return 
}N++
}Q()
};
F(I,H,function(){if(Object.isFunction(A)){A()
}H.appendChild(new Element("script",{type:"text/javascript"}).update('document.fire("dom:loaded");'))
}.bind(this))
},lbSaveForm:function(){this.lbSaveData();
Form.disable(this.form);
this.lbSaveSync(this.saveUrl);
this.lbHide();
window.location=this.redirectUrl
},lbNext:function(A){this.lbSaveData();
this.lbLoading();
this.lbLoadForm(A)
},lbSaveData:function(){this.formData+="&"+Form.serialize(this.form);
this.formData=this.formData.replace("_segmentChief=&","=&");
this.formData=this.formData.replace("_periodicity=&","=&")
},lbSave:function(A){this.lbSaveData();
new Ajax.Request(A+"?ajax=1",{parameters:this.formData,onSuccess:this.lbSaveDone.bind(this)})
},lbSaveSync:function(A){new Ajax.Request(A+"?ajax=1",{parameters:this.formData,asynchronous:false})
},lbSaveDone:function(A){this.lbHide()
},lbClearData:function(){this.formData=""
},lbClose:function(){this.lbHide();
if(this.redirectUrl!==undefined){window.location=this.redirectUrl
}},lbSetNext:function(A){this.nextURL=A
},getWaiting:function(){var A="$xwiki.getSkinFile('icons/ajax-loader.gif')";
return'<div style="padding: 30px;"><img src="'+A+'"/></div>'
},lbcustominit:function(B,A,E,C){if(!$("lb")){var D=this.insertlbcontent(B,A,E,C);
new Insertion.Top("body",D)
}},lbinit:function(){return this.lbcustominit("#FFF","#FFF","#000","rounded")
},insertlbcontent:function(B,A,E,C){var D='<div id="lb-bg" class="hidden"></div><div id="lb-align" class="hidden"><div id="lb"><div id="lb-top"><div id="close-wrap"><div id="lb-close" onclick="window.lb.lbClose();" title="Cancel and close">&nbsp;</div></div>';
if(C=="lightrounded"){D+=this.roundedlighttop(B,A)
}else{if(C=="rounded"){D+=this.roundedtop(B,A)
}else{D+='<div class="lb-squarred" style="background:'+B+"; border-color:"+A+'"></div></div>'
}}D+='</div><div class="lb-content" style="background:'+B+"; border-color:"+A+"; color:"+E+'" id="lb-content">Lightbox Content</div>';
if(C=="lightrounded"){D+=this.roundedlightbottom(B,A)
}else{if(C=="rounded"){D+=this.roundedbottom(B,A)
}else{D+='<div class="lb-squarred" style="background:'+B+"; border-color:"+A+'"></div></div></div></div>'
}}return D
},resizeBackground:function(){var A=document.body.parentNode.scrollHeight;
if(document.body.scrollHeight>A){A=document.body.scrollHeight
}if(document.body.parentNode.clientHeight>A){A=document.body.parentNode.clientHeight
}$("lb-bg").style.height=A+"px"
},roundedlightbottom:function(A,B){var C='<div class="roundedlight"><b class="top"><b class="b4b" style="background:'+B+';"></b><b class="b3b" style="background:'+A+"; border-color:"+B+';"></b><b class="b3b" style="background:'+A+"; border-color:"+B+';"></b><b class="b1b" style="background:'+A+"; border-color:"+B+';"></b></b> </div>';
return C
},roundedbottom:function(A,B){var C='<div class="rounded"><b class="bottom" style="padding:0px; margin:0px;"><b class="b12b" style="background:'+B+';"></b><b class="b11b" style="background:'+A+"; border-color:"+B+';"></b><b class="b10b" style="background:'+A+"; border-color:"+B+';"></b><b class="b9b" style="background:'+A+"; border-color:"+B+';"></b><b class="b8b" style="background:'+A+"; border-color:"+B+';"></b><b class="b7b" style="background:'+A+"; border-color:"+B+';"></b><b class="b6b" style="background:'+A+"; border-color:"+B+';"></b><b class="b5b" style="background:'+A+"; border-color:"+B+';"></b><b class="b4b" style="background:'+A+"; border-color:"+B+';"></b><b class="b3b" style="background:'+A+"; border-color:"+B+';"></b><b class="b2b" style="background:'+A+"; border-color:"+B+';"></b><b class="b1b" style="background:'+A+"; border-color:"+B+';"></b></b></div>';
return C
},roundedlighttop:function(A,B){var C='<div class="roundedlight"><b class="top"><b class="b1" style="background:'+B+';"></b><b class="b2" style="background:'+A+"; border-color:"+B+';"></b><b class="b3" style="background:'+A+"; border-color:"+B+';"></b><b class="b4" style="background:'+A+"; border-color:"+B+';"></b></b> </div>';
return C
},roundedtop:function(A,B){var C='<div class="rounded"><b class="top"><b class="b1" style="background:'+B+';"></b><b class="b2" style="background:'+A+"; border-color:"+B+';"></b><b class="b3" style="background:'+A+"; border-color:"+B+';"></b><b class="b4" style="background:'+A+"; border-color:"+B+';"></b><b class="b5" style="background:'+A+"; border-color:"+B+';"></b><b class="b6" style="background:'+A+"; border-color:"+B+';"></b><b class="b7" style="background:'+A+"; border-color:"+B+';"></b><b class="b8" style="background:'+A+"; border-color:"+B+';"></b><b class="b9" style="background:'+A+"; border-color:"+B+';"></b><b class="b10" style="background:'+A+"; border-color:"+B+';"></b><b class="b11" style="background:'+A+"; border-color:"+B+';"></b><b class="b12" style="background:'+A+"; border-color:"+B+';"></b></b></div>';
return C
},lightboxlink:function(B,A){var C='<a href="#" onclick="javascript:$(\'lb-content\').innerHTML ='+A+"; toggleClass($('lb-bg'), 'hidden'); toggleClass($('lb-align'), 'hidden');\">"+B+"</a>";
return C
}});