var TinyMCE_ZoomPlugin={getInfo:function(){return{longname:"Zoom",author:"Moxiecode Systems",authorurl:"http://tinymce.moxiecode.com",infourl:"http://tinymce.moxiecode.com/tinymce/docs/plugin_zoom.html",version:tinyMCE.majorVersion+"."+tinyMCE.minorVersion}
},getControlHTML:function(A){if(!tinyMCE.isMSIE||tinyMCE.isMSIE5_0||tinyMCE.isOpera){return""
}switch(A){case"zoom":return'<select id="{$editor_id}_zoomSelect" name="{$editor_id}_zoomSelect" onfocus="tinyMCE.addSelectAccessibility(event, this, window);" onchange="tinyMCE.execInstanceCommand(\'{$editor_id}\',\'mceZoom\',false,this.options[this.selectedIndex].value);" class="mceSelectList"><option value="100%">+ 100%</option><option value="150%">+ 150%</option><option value="200%">+ 200%</option><option value="250%">+ 250%</option></select>'
}return""
},execCommand:function(D,A,C,E,B){switch(C){case"mceZoom":tinyMCE.getInstanceById(D).contentDocument.body.style.zoom=B;
tinyMCE.getInstanceById(D).contentDocument.body.style.mozZoom=B;
return true
}return false
}};
tinyMCE.addPlugin("zoom",TinyMCE_ZoomPlugin);