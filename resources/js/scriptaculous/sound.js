Sound={tracks:{},_enabled:true,template:new Template('<embed style="height:0" id="sound_#{track}_#{id}" src="#{url}" loop="false" autostart="true" hidden="true"/>'),enable:function(){Sound._enabled=true
},disable:function(){Sound._enabled=false
},play:function(B){if(!Sound._enabled){return 
}var A=Object.extend({track:"global",url:B,replace:false},arguments[1]||{});
if(A.replace&&this.tracks[A.track]){$R(0,this.tracks[A.track].id).each(function(D){var C=$("sound_"+A.track+"_"+D);
C.Stop&&C.Stop();
C.remove()
});
this.tracks[A.track]=null
}if(!this.tracks[A.track]){this.tracks[A.track]={id:0}
}else{this.tracks[A.track].id++
}A.id=this.tracks[A.track].id;
$$("body")[0].insert(Prototype.Browser.IE?new Element("bgsound",{id:"sound_"+A.track+"_"+A.id,src:A.url,loop:1,autostart:true}):Sound.template.evaluate(A))
}};
if(Prototype.Browser.Gecko&&navigator.userAgent.indexOf("Win")>0){if(navigator.plugins&&$A(navigator.plugins).detect(function(A){return A.name.indexOf("QuickTime")!=-1
})){Sound.template=new Template('<object id="sound_#{track}_#{id}" width="0" height="0" type="audio/mpeg" data="#{url}"/>')
}else{Sound.play=function(){}
}};