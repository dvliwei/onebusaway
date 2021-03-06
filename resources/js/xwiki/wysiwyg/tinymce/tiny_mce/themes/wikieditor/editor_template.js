tinyMCE.importThemeLanguagePack("wikieditor");
var TinyMCE_WikieditorTheme={getControlHTML:function(A){return wikiEditor.getControlHTML(A)
},execCommand:function(editor_id,element,command,user_interface,value){switch(command){case"mceLink":var inst=tinyMCE.getInstanceById(editor_id);
var doc=inst.getDoc();
var selectedText="";
if(tinyMCE.isMSIE){var rng=doc.selection.createRange();
selectedText=rng.text
}else{selectedText=inst.getSel().toString()
}if(!tinyMCE.linkElement){if((tinyMCE.selectedElement.nodeName.toLowerCase()!="img")&&(selectedText.length<=0)){return true
}}var href="",target="",title="",onclick="",action="insert",style_class="";
var text="";
if((tinyMCE.selectedElement.nodeName.toLowerCase()!="img")&&(selectedText.length>0)){text=selectedText
}if(tinyMCE.selectedElement.nodeName.toLowerCase()=="a"){tinyMCE.linkElement=tinyMCE.selectedElement
}if(tinyMCE.linkElement!=null&&tinyMCE.getAttrib(tinyMCE.linkElement,"href")==""){tinyMCE.linkElement=null
}if(tinyMCE.linkElement){if(tinyMCE.isMSIE){text=tinyMCE.linkElement.innerHTML
}else{text=tinyMCE.linkElement.text
}href=tinyMCE.getAttrib(tinyMCE.linkElement,"href");
target=tinyMCE.getAttrib(tinyMCE.linkElement,"target");
title=tinyMCE.getAttrib(tinyMCE.linkElement,"title");
onclick=tinyMCE.getAttrib(tinyMCE.linkElement,"onclick");
style_class=tinyMCE.getAttrib(tinyMCE.linkElement,"class");
if(onclick==""){onclick=tinyMCE.getAttrib(tinyMCE.linkElement,"onclick")
}onclick=tinyMCE.cleanupEventStr(onclick);
href=eval(tinyMCE.settings.urlconverter_callback+"(href, tinyMCE.linkElement, true);");
mceRealHref=tinyMCE.getAttrib(tinyMCE.linkElement,"mce_href");
if(mceRealHref!=""){href=mceRealHref;
if(tinyMCE.getParam("convert_urls")){href=eval(tinyMCE.settings.urlconverter_callback+"(href, tinyMCE.linkElement, true);")
}}action="update"
}var template=new Array();
template.file="link.htm";
template.width=600;
if(tinyMCE.isMSIE){template.height=570
}else{template.height=550
}template.width+=tinyMCE.getLang("lang_insert_link_delta_width",0);
template.height+=tinyMCE.getLang("lang_insert_link_delta_height",0);
if(inst.settings.insertlink_callback){var returnVal=eval(inst.settings.insertlink_callback+"(href, target, title, onclick, action, style_class);");
if(returnVal&&returnVal.href){TinyMCE_WikieditorTheme._insertLink(returnVal.href,returnVal.target,returnVal.title,returnVal.onclick,returnVal.style_class)
}}else{tinyMCE.openWindow(template,{editor_id:editor_id,action:action,text:text,href:href,target:target,title:title,onclick:onclick,action:action,className:style_class,inline:"yes",scrollbars:"yes",resizable:"no",mce_windowresize:false})
}return true;
case"mceImage":var src="",alt="",border="",hspace="",vspace="",width="",height="",align="",halign="";
var title="",onmouseover="",onmouseout="",action="insert";
var img=tinyMCE.imgElement;
var inst=tinyMCE.getInstanceById(editor_id);
if(tinyMCE.selectedElement!=null&&tinyMCE.selectedElement.nodeName.toLowerCase()=="img"){img=tinyMCE.selectedElement;
tinyMCE.imgElement=img;
var parent=tinyMCE.selectedElement.parentNode;
var parentClassName=parent.className;
if(parent.nodeName.toLowerCase()=="div"){halign=parentClassName.substring(3,parentClassName.length)
}}if(img){if(tinyMCE.getAttrib(img,"name").indexOf("mce_")==0){return true
}src=tinyMCE.getAttrib(img,"src");
alt=tinyMCE.getAttrib(img,"alt");
if(alt==""){alt=tinyMCE.getAttrib(img,"title")
}if(tinyMCE.isGecko){var w=img.style.width;
if(w!=null&&w!=""){img.setAttribute("width",w)
}var h=img.style.height;
if(h!=null&&h!=""){img.setAttribute("height",h)
}}border=tinyMCE.getAttrib(img,"border");
hspace=tinyMCE.getAttrib(img,"hspace");
vspace=tinyMCE.getAttrib(img,"vspace");
width=tinyMCE.getAttrib(img,"width");
height=tinyMCE.getAttrib(img,"height");
align=tinyMCE.getAttrib(img,"align");
onmouseover=tinyMCE.getAttrib(img,"onmouseover");
onmouseout=tinyMCE.getAttrib(img,"onmouseout");
title=tinyMCE.getAttrib(img,"title");
if(tinyMCE.isMSIE){width=img.attributes.width.specified?width:"";
height=img.attributes.height.specified?height:""
}src=eval(tinyMCE.settings.urlconverter_callback+"(src, img, true);");
src=src.substring(src.lastIndexOf("/")+1,src.length);
mceRealSrc=tinyMCE.getAttrib(img,"mce_src");
if(mceRealSrc!=""){src=mceRealSrc;
if(tinyMCE.getParam("convert_urls")){src=eval(tinyMCE.settings.urlconverter_callback+"(src, img, true);")
}src=src.substring(src.lastIndexOf("/")+1,src.length)
}action="update"
}var template=new Array();
template.file="image.htm";
template.width=550;
template.height=400+(tinyMCE.isMSIE?25:0);
if(inst.settings.insertimage_callback){var returnVal=eval(inst.settings.insertimage_callback+"(src, alt, border, hspace, vspace, width, height, align, title, onmouseover, onmouseout, action);");
if(returnVal&&returnVal.src){TinyMCE_WikieditorTheme.insertImage(returnVal.src,returnVal.width,returnVal.height,returnVal.align)
}}else{tinyMCE.openWindow(template,{editor_id:editor_id,scrollbars:"yes",resizable:"no",mce_windowresize:false,src:src,alt:alt,border:border,hspace:hspace,vspace:vspace,width:width,height:height,align:align,halign:halign,title:title,onmouseover:onmouseover,onmouseout:onmouseout,action:action,inline:"yes"})
}return true;
case"wikiAttachment":var href="",action="insert";
var template=new Array();
template.file="attachment.htm";
template.width=550;
template.height=400+(tinyMCE.isMSIE?25:0);
tinyMCE.openWindow(template,{editor_id:editor_id,href:href,action:action,inline:"yes",scrollbars:"yes",resizable:"no",mce_windowresize:false});
return true;
case"wikiMacro":var template=new Array();
template.file="macro.htm";
template.width=520;
template.height=300;
tinyMCE.openWindow(template,{editor_id:editor_id,inline:"yes",command:"insert",scrollbars:"yes",resizable:"no",mce_windowresize:false});
return true;
case"mceForeColor":var template=new Array();
var elm=tinyMCE.selectedInstance.getFocusElement();
var inputColor=tinyMCE.getAttrib(elm,"color");
if(inputColor==""){inputColor=elm.style.color
}if(!inputColor){inputColor="#000000"
}template.file="color_picker.htm";
template.width=220;
template.height=190;
tinyMCE.openWindow(template,{editor_id:editor_id,inline:"yes",command:"forecolor",input_color:inputColor});
return true;
case"mceBackColor":var template=new Array();
var elm=tinyMCE.selectedInstance.getFocusElement();
var inputColor=elm.style.backgroundColor;
if(!inputColor){inputColor="#000000"
}template.file="color_picker.htm";
template.width=220;
template.height=190;
template.width+=tinyMCE.getLang("lang_theme_advanced_backcolor_delta_width",0);
template.height+=tinyMCE.getLang("lang_theme_advanced_backcolor_delta_height",0);
tinyMCE.openWindow(template,{editor_id:editor_id,inline:"yes",command:"HiliteColor",input_color:inputColor});
return true;
case"mceCharMap":var template=new Array();
template.file="charmap.htm";
template.width=550+(tinyMCE.isOpera?40:0);
template.height=250;
tinyMCE.openWindow(template,{editor_id:editor_id,inline:"yes"});
return true;
case"JustifyLeft":var focusElm=tinyMCE.selectedInstance.getFocusElement();
if(focusElm&&(focusElm.nodeName=="P")){tinyMCE.execInstanceCommand(editor_id,"FormatBlock",false,"<div>");
var selectedElm=tinyMCE.selectedInstance.selection.getFocusElement();
selectedElm.setAttribute("align","left")
}else{return wikiEditor.execCommand(editor_id,element,"justifyLeft",user_interface,value)
}tinyMCE.triggerNodeChange();
return true;
case"JustifyCenter":var focusElm=tinyMCE.selectedInstance.getFocusElement();
if(focusElm&&(focusElm.nodeName=="P")){tinyMCE.execInstanceCommand(editor_id,"FormatBlock",false,"<div>");
var selectedElm=tinyMCE.selectedInstance.selection.getFocusElement();
selectedElm.setAttribute("align","center")
}else{return wikiEditor.execCommand(editor_id,element,"justifyCenter",user_interface,value)
}tinyMCE.triggerNodeChange();
return true;
case"JustifyRight":var focusElm=tinyMCE.selectedInstance.getFocusElement();
if(focusElm&&(focusElm.nodeName=="P")){tinyMCE.execInstanceCommand(editor_id,"FormatBlock",false,"<div>");
var selectedElm=tinyMCE.selectedInstance.selection.getFocusElement();
selectedElm.setAttribute("align","right")
}else{return wikiEditor.execCommand(editor_id,element,"justifyRight",user_interface,value)
}tinyMCE.triggerNodeChange();
return true;
case"JustifyFull":var focusElm=tinyMCE.selectedInstance.getFocusElement();
if(focusElm&&(focusElm.nodeName=="P")){tinyMCE.execInstanceCommand(editor_id,"FormatBlock",false,"<div>");
var selectedElm=tinyMCE.selectedInstance.selection.getFocusElement();
selectedElm.setAttribute("align","justify")
}else{return wikiEditor.execCommand(editor_id,element,"justifyFull",user_interface,value)
}tinyMCE.triggerNodeChange();
return true;
case"mceToggleEditor":var ins=tinyMCE.selectedInstance;
var tid=ins.editorId+"_content";
var insDisplay=document.getElementById(ins.editorId).style.display;
if(!insDisplay||(insDisplay=="block")){document.getElementById(tid).value=tinyMCE.getContent(tinyMCE.getWindowArg("editor_id"));
document.getElementById(ins.editorId).style.display="none";
if(window.ActiveXObject){document.getElementById(ins.editorId).parentNode.style.display="none";
document.getElementById(ins.editorId).parentNode.parentNode.style.display="none"
}document.getElementById(tid).style.display="block";
if(window.ActiveXObject){document.getElementById(tid).parentNode.style.display="block";
document.getElementById(tid).parentNode.parentNode.style.display="block"
}wikiEditor.disableButtonsInWikiMode(editor_id)
}else{document.getElementById(ins.editorId).style.display="block";
if(window.ActiveXObject){document.getElementById(ins.editorId).parentNode.style.display="block";
document.getElementById(ins.editorId).parentNode.parentNode.style.display="block"
}tinyMCE.setContent(document.getElementById(tid).value);
if(tinyMCE.isGecko){ins._setUseCSS(false)
}document.getElementById(tid).style.display="none";
if(window.ActiveXObject){document.getElementById(tid).parentNode.style.display="none";
document.getElementById(tid).parentNode.parentNode.style.display="none"
}wikiEditor.showButtonsInWywisygMode(editor_id)
}return true;
default:return wikiEditor.execCommand(editor_id,element,command,user_interface,value)
}},getEditorTemplate:function(B,A){return wikiEditor.getEditorTemplate(B,A)
},handleNodeChange:function(F,D,E,C,A,B){wikiEditor.handleNodeChange(F,D,E,C,A,B);
return true
},insertImage:function(D,B,A,E,C){this._insertImage(wikiEditor.getImagePath()+D,"","","","",B,A,E,C,"","","")
},_insertImage:function(src,alt,border,hspace,vspace,width,height,align,halign,title,onmouseover,onmouseout){tinyMCE.execCommand("mceBeginUndoLevel");
if(src==""){return 
}if(!tinyMCE.imgElement&&tinyMCE.isSafari){var html="";
if(halign!=null&&(halign!="none")){html+='<div class="img'+halign+'">'
}html+='<img class="wikiimage" src="'+src+'" alt="'+alt+'"';
html+=' border="'+border+'" hspace="'+hspace+'"';
html+=' vspace="'+vspace+'" width="'+width+'"';
html+=' height="'+height+'" align="'+align+'" title="'+title+'" onmouseover="'+onmouseover+'" onmouseout="'+onmouseout;
html+='" />';
if(halign!=null&&(halign!="none")){html+="</div>"
}tinyMCE.execCommand("mceInsertContent",false,html)
}else{if(!tinyMCE.imgElement&&tinyMCE.selectedInstance){if(tinyMCE.isSafari){tinyMCE.execCommand("mceInsertContent",false,'<img src="'+tinyMCE.uniqueURL+'" />')
}else{var html="";
if(halign!=null&&(halign!="none")&&(halign!="")){html+='<div class="img'+halign+'">'
}html+='<img class="wikiimage" src="'+src+'" alt="'+alt+'"';
html+=' border="'+border+'" hspace="'+hspace+'"';
html+=' vspace="'+vspace+'"';
if(width!=""){html+=' width="'+width+'"'
}if(height!=""){html+=' height="'+height+'"'
}html+='" align="'+align+'" title="'+title;
html+='" />';
if(halign!=null&&(halign!="none")){html+="</div>"
}tinyMCE.execCommand("mceInsertContent",false,html)
}tinyMCE.imgElement=tinyMCE.getElementByAttributeValue(tinyMCE.selectedInstance.contentDocument.body,"img","src",tinyMCE.uniqueURL)
}}if(tinyMCE.imgElement){var needsRepaint=false;
var msrc=src;
src=eval(tinyMCE.settings.urlconverter_callback+"(src, tinyMCE.imgElement);");
if(tinyMCE.getParam("convert_urls")){msrc=src
}if(onmouseover&&onmouseover!=""){onmouseover="this.src='"+eval(tinyMCE.settings.urlconverter_callback+"(onmouseover, tinyMCE.imgElement);")+"';"
}if(onmouseout&&onmouseout!=""){onmouseout="this.src='"+eval(tinyMCE.settings.urlconverter_callback+"(onmouseout, tinyMCE.imgElement);")+"';"
}if(typeof (title)=="undefined"){title=alt
}if(width!=tinyMCE.imgElement.getAttribute("width")||height!=tinyMCE.imgElement.getAttribute("height")||align!=tinyMCE.imgElement.getAttribute("align")){needsRepaint=true
}tinyMCE.setAttrib(tinyMCE.imgElement,"src",src);
tinyMCE.setAttrib(tinyMCE.imgElement,"class","wikiimage");
tinyMCE.setAttrib(tinyMCE.imgElement,"mce_src",msrc);
tinyMCE.setAttrib(tinyMCE.imgElement,"alt",alt);
tinyMCE.setAttrib(tinyMCE.imgElement,"title",title);
tinyMCE.setAttrib(tinyMCE.imgElement,"align",align);
tinyMCE.setAttrib(tinyMCE.imgElement,"border",border,true);
tinyMCE.setAttrib(tinyMCE.imgElement,"hspace",hspace,true);
tinyMCE.setAttrib(tinyMCE.imgElement,"vspace",vspace,true);
tinyMCE.setAttrib(tinyMCE.imgElement,"width",width,true);
tinyMCE.setAttrib(tinyMCE.imgElement,"height",height,true);
tinyMCE.setAttrib(tinyMCE.imgElement,"onmouseover",onmouseover);
tinyMCE.setAttrib(tinyMCE.imgElement,"onmouseout",onmouseout);
var parent=tinyMCE.imgElement.parentNode;
if((parent.nodeName.toLowerCase()=="div")&&(halign!="")){parent.className="img"+halign
}else{if(halign!=""){var divNode=tinyMCE.selectedInstance.getDoc().createElement("div");
var imgNode=tinyMCE.imgElement;
divNode.appendChild(imgNode.cloneNode(true));
divNode.className="img"+halign;
parent.insertBefore(divNode,imgNode);
parent.removeChild(imgNode)
}}if(width&&width!=""){tinyMCE.imgElement.style.pixelWidth=width
}if(height&&height!=""){tinyMCE.imgElement.style.pixelHeight=height
}if(needsRepaint){tinyMCE.selectedInstance.repaint()
}}tinyMCE.execCommand("mceEndUndoLevel")
},insertLink:function(B,E,I,A,G,C,H){var D;
var F;
if(wikiEditor.isExternalLink(B)){D=wikiEditor.LINK_EXTERNAL_CLASS_NAME;
F=B
}else{D=wikiEditor.LINK_INTERNAL_CLASS_NAME
}this._insertLink(B,E,I,A,F,C,D)
},_insertLink:function(href,target,text,space,title,onclick,style_class){tinyMCE.execCommand("mceBeginUndoLevel");
if(space!=null&&space!=""){href=space+"."+href
}if(href==null||href==""){return 
}if(tinyMCE.selectedInstance&&tinyMCE.selectedElement&&tinyMCE.selectedElement.nodeName.toLowerCase()=="img"){var doc=tinyMCE.selectedInstance.getDoc();
var linkElement=tinyMCE.getParentElement(tinyMCE.selectedElement,"a");
var newLink=false;
if(!linkElement){linkElement=doc.createElement("a");
newLink=true
}var mhref=href;
var thref=eval(tinyMCE.settings.urlconverter_callback+"(href, linkElement);");
mhref=tinyMCE.getParam("convert_urls")?href:mhref;
tinyMCE.setAttrib(linkElement,"href",thref);
tinyMCE.setAttrib(linkElement,"mce_href",mhref);
tinyMCE.setAttrib(linkElement,"target",target);
tinyMCE.setAttrib(linkElement,"title",title);
tinyMCE.setAttrib(linkElement,"onclick",onclick);
tinyMCE.setAttrib(linkElement,"class",style_class);
if(newLink){linkElement.appendChild(tinyMCE.selectedElement.cloneNode(true));
tinyMCE.selectedElement.parentNode.replaceChild(linkElement,tinyMCE.selectedElement)
}return 
}if(!tinyMCE.linkElement&&tinyMCE.selectedInstance){if(tinyMCE.isSafari){tinyMCE.execCommand("mceInsertContent",false,'<a href="'+tinyMCE.uniqueURL+'">'+tinyMCE.selectedInstance.selection.getSelectedHTML()+"</a>")
}else{tinyMCE.selectedInstance.contentDocument.execCommand("createlink",false,tinyMCE.uniqueURL)
}tinyMCE.linkElement=tinyMCE.getElementByAttributeValue(tinyMCE.selectedInstance.contentDocument.body,"a","href",tinyMCE.uniqueURL);
var elementArray=tinyMCE.getElementsByAttributeValue(tinyMCE.selectedInstance.contentDocument.body,"a","href",tinyMCE.uniqueURL);
for(var i=0;
i<elementArray.length;
i++){var mhref=href;
var thref=eval(tinyMCE.settings.urlconverter_callback+"(href, elementArray[i]);");
mhref=tinyMCE.getParam("convert_urls")?href:mhref;
tinyMCE.setAttrib(elementArray[i],"href",thref);
tinyMCE.setAttrib(elementArray[i],"mce_href",mhref);
tinyMCE.setAttrib(elementArray[i],"target",target);
tinyMCE.setAttrib(elementArray[i],"title",title);
tinyMCE.setAttrib(elementArray[i],"onclick",onclick);
tinyMCE.setAttrib(elementArray[i],"class",style_class)
}tinyMCE.linkElement=elementArray[0]
}if(tinyMCE.linkElement){var mhref=href;
href=eval(tinyMCE.settings.urlconverter_callback+"(href, tinyMCE.linkElement);");
mhref=tinyMCE.getParam("convert_urls")?href:mhref;
tinyMCE.linkElement.innerHTML=text;
tinyMCE.setAttrib(tinyMCE.linkElement,"href",href);
tinyMCE.setAttrib(tinyMCE.linkElement,"mce_href",mhref);
tinyMCE.setAttrib(tinyMCE.linkElement,"target",target);
tinyMCE.setAttrib(tinyMCE.linkElement,"title",title);
tinyMCE.setAttrib(tinyMCE.linkElement,"onclick",onclick);
tinyMCE.setAttrib(tinyMCE.linkElement,"class",style_class)
}tinyMCE.execCommand("mceEndUndoLevel")
}};
tinyMCE.addTheme("wikieditor",TinyMCE_WikieditorTheme);