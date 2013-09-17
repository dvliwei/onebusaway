(function(){var B={availableDocuments:"$msg.get('core.importer.availableDocuments')",importHistoryLabel:"$msg.get('core.importer.importHistory')",selectionEmpty:"$msg.get('core.importer.selectionEmptyWarning')","import":"$msg.get('core.importer.import')","package":"$msg.get('core.importer.package')",description:"$msg.get('core.importer.package.description')",version:"$msg.get('core.importer.package.version')",licence:"$msg.get('core.importer.package.licence')",author:"$msg.get('core.importer.package.author')",documentSelected:"$msg.get('core.importer.documentSelected')",whenDocumentAlreadyExists:"$msg.get('core.importer.whenDocumentAlreadyExists')",addNewVersion:"$msg.get('core.importer.addNewVersion')",replaceDocumentHistory:"$msg.get('core.importer.replaceDocumentHistory')",resetHistory:"$msg.get('core.importer.resetHistory')",importAsBackup:"$msg.get('core.importer.importAsBackup')",select:"$msg.get('core.importer.select')",all:"$msg.get('core.importer.selectAll')",none:"$msg.get('core.importer.selectNone')"};
var A="$xwiki.getSkinFile('js/smartclient/skins/Enterprise/images/TreeGrid/opener_closed.png')";
var C="$xwiki.getSkinFile('js/smartclient/skins/Enterprise/images/TreeGrid/opener_opened.png')";
if(!browser.isIE6x){document.observe("dom:loaded",function(){$$("#packagelistcontainer ul.xlist li.xitem a.package").invoke("observe","click",function(F){var D=F.element(),E=D.href.substring(D.href.indexOf("&file=")+6);
F.stop();
$$("div#packagelistcontainer div.active").invoke("removeClassName","active");
F.element().up("div.package").addClassName("active");
new PackageExplorer("packagecontainer",decodeURIComponent(E))
})
})
}Element.addMethods("input",{uncheck:function(D){D=$(D);
D.checked=false;
return D
},check:function(D){D=$(D);
D.checked=true;
return D
}});
PackageInformationRequest=Class.create({initialize:function(G,F){this.name=decodeURIComponent(G);
this.successCallback=F.onSuccess||function(){};
this.failureCallback=F.onFailure||function(){};
var E=window.docgeturl+"?xpage=packageinfo&package="+G;
var D=new Ajax.Request(E,{onSuccess:this.onSuccess.bindAsEventListener(this),on1223:this.on1223.bindAsEventListener(this),on0:this.on0.bindAsEventListener(this),onFailure:this.onFailure.bind(this)})
},on1223:function(D){D.request.options.onSuccess(D)
},on0:function(D){D.request.options.onFailure(D)
},onSuccess:function(D){this.successCallback(D)
},onFailure:function(D){this.failureCallback(D)
}});
PackageExplorer=Class.create({initialize:function(F,E){this.node=$(F);
this.name=E;
this.ignore={};
this.documentCount={};
this.node.addClassName("loading");
var D=new PackageInformationRequest(E,{onSuccess:this.onPackageInfosAvailable.bind(this),onFailure:this.onPackageInfosRequestFailed.bind(this)})
},onPackageInfosAvailable:function(G){this.node.removeClassName("loading");
this.node.update();
if(this.node.empty()){this.node.insert(new Element("h4",{"class":"legend"}).update(B.availableDocuments))
}var E=G.responseText.evalJSON();
this.infos=E.infos;
this.packageDocuments=E.files;
this.container=new Element("div",{id:"packageDescription"});
this.node.insert(this.container);
this.container.insert(this.createPackageHeader(E.infos));
var D=new Element("span").update(B.none);
D.observe("click",this.onIgnoreAllDocuments.bind(this));
var F=new Element("span").update(B.all);
F.observe("click",this.onRestoreAllDocuments.bind(this));
this.container.insert(new Element("div",{"class":"selectLinks"}).insert(B.select).insert(D).insert(", ").insert(F));
this.list=new Element("ul",{"class":"xlist package"});
this.container.insert(new Element("div",{id:"package"}).update(this.list));
Object.keys(this.packageDocuments).sort().each(this.addSpaceToPackage.bind(this));
this.container.insert(this.createPackageFormSubmit(E.infos));
this.container.down("div.packagesubmit input[type=radio]").checked=true
},onIgnoreAllDocuments:function(){this.container.select("input[type=checkbox][class=space]").invoke("uncheck");
this.container.select("input[type=checkbox][class=space]").invoke("fire","custom:click")
},onRestoreAllDocuments:function(){this.container.select("input[type=checkbox][class=space]").invoke("check");
this.container.select("input[type=checkbox][class=space]").invoke("fire","custom:click")
},onPackageInfosRequestFailed:function(E){this.node.update();
var D="Failed to retrieve package information. Reason: ";
if(E.statusText==""||response.status==12031){D+="Server not responding"
}else{D+=E.statusText
}this.node.removeClassName("loading");
this.node.update(new Element("div",{"class":"errormessage"}).update(D))
},createPackageFormSubmit:function(I){var H=new Element("div",{"class":"packagesubmit"});
H.insert(new Element("em").update(B.whenDocumentAlreadyExists));
var F=new Element("input",{type:"radio",name:"historyStrategy",checked:"checked",value:"add"});
H.insert(new Element("div",{"class":"historyStrategyOption"}).insert(F).insert(B.addNewVersion));
H.insert(new Element("div",{"class":"historyStrategyOption"}).insert(new Element("input",{type:"radio",name:"historyStrategy",value:"replace"})).insert(B.replaceDocumentHistory));
H.insert(new Element("div",{"class":"historyStrategyOption"}).insert(new Element("input",{type:"radio",name:"historyStrategy",value:"reset"})).insert(B.resetHistory));
if(XWiki.hasProgramming){var D=new Element("input",{type:"checkbox",name:"importAsBackup",value:"true"});
if(I.backup){D.checked=true
}H.insert(new Element("div",{"class":"importOption"}).insert(D).insert(B.importAsBackup))
}var G=new Element("div").update(new Element("span",{"class":"buttonwrapper"}));
var E=new Element("input",{type:"submit",value:B["import"],"class":"button"});
E.observe("click",this.onPackageSubmit.bind(this));
G.insert(E);
H.insert(G);
return H
},onPackageSubmit:function(){if(this.countSelectedDocuments()==0){var J=new Element("span",{"class":"warningmessage"}).update(B.selectionEmpty);
if(!$("packagecontainer").down("div.packagesubmit span.warningmessage")){$("packagecontainer").select("div.packagesubmit input").last().insert({after:J});
Element.remove.delay(5,J)
}return 
}var L={};
L.action="import";
L.name=this.name;
L.historyStrategy=$("packageDescription").down("input[type=radio][value='add']").checked?"add":($("packageDescription").down("input[type=radio][value='replace']").checked?"replace":"reset");
L.ajax="1";
var E=[];
var H=Object.keys(this.packageDocuments);
for(var G=0;
G<H.length;
G++){var D=this.packageDocuments[H[G]];
var I=Object.keys(D);
for(var F=0;
F<I.length;
F++){var K=D[I[F]];
K.each(function(N){if(!this.isIgnored(H[G],I[F],N.language)){var M=N.fullName+":"+N.language;
E.push(M);
L["language_"+M]=N.language
}}.bind(this))
}}L.pages=E;
this.node.update();
this.node.addClassName("loading");
this.node.setStyle("min-height:200px");
new Ajax.Request(window.location,{method:"post",parameters:L,onSuccess:function(M){$("packagecontainer").removeClassName("loading");
$("packagecontainer").update(M.responseText)
},onFailure:function(N){var M="Failed to import documents. Reason: ";
if(N.statusText==""||response.status==12031){M+="Server not responding"
}else{M+=N.statusText
}$("packagecontainer").removeClassName("loading");
$("packagecontainer").update(new Element("div",{"class":"errormessage"}).update(M))
}})
},createPackageHeader:function(E){var D=new Element("div",{"class":"packageinfos"});
D.insert(new Element("div").insert(new Element("span",{"class":"label"}).update(B["package"])).insert(new Element("span",{"class":"filename"}).update(this.name)));
if(E.name!==""){D.insert(new Element("div").insert(new Element("span",{"class":"label"}).update(B.description)).insert(new Element("span",{"class":"name"}).update(E.name)))
}if(E.version!==""){D.insert(new Element("div").insert(new Element("span",{"class":"label"}).update(B.version)).insert(new Element("span",{"class":"version"}).update(E.version)))
}if(E.author!==""){D.insert(new Element("div").insert(new Element("span",{"class":"label"}).update(B.author)).insert(new Element("span",{"class":"author"}).update(E.author)))
}if(E.licence!==""){D.insert(new Element("div").insert(new Element("span",{"class":"label"}).update(B.licence)).insert(new Element("span",{"class":"licence"}).update(E.licence)))
}return D
},addSpaceToPackage:function(D){var L=Object.keys(this.packageDocuments[D]).length;
var N=L+" / "+L+" "+B.documentSelected;
var F=new Element("li",{"class":"xitem xunderline"});
var G=new Element("div",{"class":"xitemcontainer"});
var J=new Element("input",{type:"checkbox",checked:"checked","class":"space"});
J.observe("click",function(P){J.fire("custom:click",P.memo)
}.bind(this));
J.observe("custom:click",this.spaceCheckboxClicked.bind(this));
G.insert(J);
var H=new Element("img",{src:A});
G.insert(H);
var I=new Element("div",{"class":"spacename"}).update(D);
G.insert(I);
var K=function(P){P.element().up("li").down("div.pages").toggleClassName("hidden");
P.element().up("li").down("img").src=P.element().up("li").down("div.pages").hasClassName("hidden")?A:C
};
H.observe("click",K);
I.observe("click",K);
G.insert(new Element("div",{"class":"selection"}).update(N));
G.insert(new Element("div",{"class":"clearfloats"}));
var E=new Element("div",{"class":"pages hidden"});
var M=new Element("ul",{"class":"xlist pages"});
var O=this;
Object.keys(this.packageDocuments[D]).sort().each(function(P){O.addDocumentToSpace(M,D,P)
});
E.update(M);
G.insert(E);
F.insert(G);
this.list.insert(F);
J.checked=true
},addDocumentToSpace:function(H,G,F){var E=this.packageDocuments[G][F],D=this;
E.each(function(M){var I=F+(M.language==""?"":(" - "+M.language));
var K=new Element("li",{"class":"xitem xhighlight"});
var J=new Element("div",{"class":"xitemcontainer xpagecontainer"});
var L=new Element("input",{type:"checkbox",checked:"checked"});
L.observe("click",D.documentCheckboxClicked.bind(D));
J.insert(new Element("span",{"class":"checkbox"}).update(L));
J.insert(new Element("span",{"class":"documentName"}).update(I));
J.insert(new Element("div",{"class":"clearfloats"}));
K.insert(new Element("div",{"class":"fullName hidden"}).update(M.fullName));
K.insert(new Element("div",{"class":"language hidden"}).update(M.language));
K.insert(J);
H.insert(K);
L.checked=true
})
},countDocumentsInSpace:function(E){var D=this;
if(typeof this.documentCount[E]=="undefined"){this.documentCount[E]=Object.keys(this.packageDocuments[E]).inject(0,function(G,F){return G+D.packageDocuments[E][F].length
})
}delete D;
return this.documentCount[E]
},countSelectedDocumentsInSpace:function(E){var F;
if(typeof this.ignore[E]=="undefined"){return this.countDocumentsInSpace(E)
}else{var D=this;
return(this.countDocumentsInSpace(E)-Object.keys(this.ignore[E]).inject(0,function(H,G){return H+D.ignore[E][G].length
}))
}},countSelectedDocuments:function(){var D=this;
return Object.keys(this.packageDocuments).inject(0,function(F,E){return F+D.countSelectedDocumentsInSpace(E)
})
},updateSelection:function(D,E){var G=this.countDocumentsInSpace(E);
var F=this.countSelectedDocumentsInSpace(E);
D.down(".selection").update(F+" / "+G+" "+B.documentSelected);
if(F==0){D.down("input.space").uncheck()
}else{D.down("input.space").check()
}},spaceCheckboxClicked:function(G){var F=G.element().checked;
var E=G.element().up(".xitemcontainer").down(".spacename").innerHTML;
var D=G.element().up(".xitemcontainer").down("div.pages");
if(!F){this.ignoreSpace(E);
D.select("input[type='checkbox']").invoke("uncheck")
}else{this.restoreSpace(E);
D.select("input[type='checkbox']").invoke("check")
}this.updateSelection(G.element().up(".xitemcontainer"),E)
},documentCheckboxClicked:function(E){var G=E.element().up("div").down("span.documentName").innerHTML.stripTags().strip();
var F=E.element().up("li").up("div.xitemcontainer").down(".spacename").innerHTML;
var H=E.element().up("li").down(".language").innerHTML;
var D=E.element().checked;
if(!D){this.ignoreDocument(F,G,H)
}else{this.restoreDocument(F,G,H)
}this.updateSelection(E.element().up("li").up("div.xitemcontainer"),F)
},isIgnored:function(E,F,G){if(typeof this.ignore[E]=="undefined"){return false
}if(typeof this.ignore[E][F]=="undefined"){return false
}for(var D=0;
D<this.ignore[E][F].length;
D++){if(this.ignore[E][F][D].language==G){return true
}}return false
},ignoreSpace:function(D){this.ignore[D]=Object.toJSON(this.packageDocuments[D]).evalJSON()
},restoreSpace:function(D){if(typeof this.ignore[D]!="undefined"){delete this.ignore[D]
}},ignoreDocument:function(D,E,F){if(typeof this.ignore[D]=="undefined"){this.ignore[D]=new Object()
}if(typeof this.ignore[D][E]=="undefined"){this.ignore[D][E]=[]
}this.ignore[D][E][this.ignore[D][E].length]={language:F}
},restoreDocument:function(D,F,G){if(typeof this.ignore[D]!="undefined"&&typeof this.ignore[D][F]!="undefined"){for(var E=0;
E<this.ignore[D][F].length;
E++){if(this.ignore[D][F][E].language===G){delete this.ignore[D][F][E];
this.ignore[D][F]=this.ignore[D][F].compact()
}}}}})
})();