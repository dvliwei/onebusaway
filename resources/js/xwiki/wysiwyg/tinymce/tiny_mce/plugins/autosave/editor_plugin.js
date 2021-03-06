tinyMCE.importPluginLanguagePack("autosave","en,tr,sv,cs,he,nb,hu,de,da,ru,ru_KOI8-R,ru_UTF-8,nn,fi,cy,es,is,pl,pt_br");
var TinyMCE_AutoSavePlugin={getInfo:function(){return{longname:"Auto save",author:"Moxiecode Systems",authorurl:"http://tinymce.moxiecode.com",infourl:"http://tinymce.moxiecode.com/tinymce/docs/plugin_autosave.html",version:tinyMCE.majorVersion+"."+tinyMCE.minorVersion}
},_beforeUnloadHandler:function(){var D,B,A=false,C=tinyMCE.getLang("lang_autosave_unload_msg");
if(tinyMCE.getParam("fullscreen_is_enabled")){return 
}for(D in tinyMCE.instances){B=tinyMCE.instances[D];
if(!tinyMCE.isInstance(B)){continue
}if(B.isDirty()){return C
}}return 
}};
window.onbeforeunload=TinyMCE_AutoSavePlugin._beforeUnloadHandler;
tinyMCE.addPlugin("autosave",TinyMCE_AutoSavePlugin);