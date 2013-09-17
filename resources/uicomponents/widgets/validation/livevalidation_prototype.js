var LiveValidation=Class.create();
Object.extend(LiveValidation,{VERSION:"1.3 prototype",TEXTAREA:1,TEXT:2,PASSWORD:3,CHECKBOX:4,SELECT:5,FILE:6,massValidate:function(C){var D=true;
for(var B=0,A=C.length;
B<A;
++B){var E=C[B].validate();
if(D){D=E
}}return D
}});
LiveValidation.prototype={validClass:"LV_valid",invalidClass:"LV_invalid",messageClass:"LV_validation_message",validFieldClass:"LV_valid_field",invalidFieldClass:"LV_invalid_field",initialize:function(B,A){if(!B){throw new Error("LiveValidation::initialize - No element reference or element id has been provided!")
}this.element=$(B);
if(!this.element){throw new Error("LiveValidation::initialize - No element with reference or id of '"+B+"' exists!")
}this.elementType=this.getElementType();
this.validations=[];
this.form=this.element.form;
this.options=Object.extend({validMessage:"Thankyou!",onValid:function(){this.insertMessage(this.createMessageSpan());
this.addFieldClass()
},onInvalid:function(){this.insertMessage(this.createMessageSpan());
this.addFieldClass()
},insertAfterWhatNode:this.element,onlyOnBlur:false,wait:0,onlyOnSubmit:false},A||{});
var C=this.options.insertAfterWhatNode||this.element;
this.options.insertAfterWhatNode=$(C);
Object.extend(this,this.options);
if(this.form){this.formObj=LiveValidationForm.getInstance(this.form);
this.formObj.addField(this)
}this.boundFocus=this.doOnFocus.bindAsEventListener(this);
Event.observe(this.element,"focus",this.boundFocus);
if(!this.onlyOnSubmit){switch(this.elementType){case LiveValidation.CHECKBOX:this.boundClick=this.validate.bindAsEventListener(this);
Event.observe(this.element,"click",this.boundClick);
case LiveValidation.SELECT:case LiveValidation.FILE:this.boundChange=this.validate.bindAsEventListener(this);
Event.observe(this.element,"change",this.boundChange);
break;
default:if(!this.onlyOnBlur){this.boundKeyup=this.deferValidation.bindAsEventListener(this);
Event.observe(this.element,"keyup",this.boundKeyup)
}this.boundBlur=this.validate.bindAsEventListener(this);
Event.observe(this.element,"blur",this.boundBlur)
}}},destroy:function(){if(this.formObj){this.formObj.removeField(this);
this.formObj.destroy()
}Event.stopObserving(this.element,"focus",this.boundFocus);
if(!this.onlyOnSubmit){switch(this.elementType){case LiveValidation.CHECKBOX:Event.stopObserving(this.element,"click",this.boundClick);
case LiveValidation.SELECT:case LiveValidation.FILE:Event.stopObserving(this.element,"change",this.boundChange);
break;
default:if(!this.onlyOnBlur){Event.stopObserving(this.element,"keyup",this.boundKeyup)
}Event.stopObserving(this.element,"blur",this.boundBlur)
}}this.validations=[];
this.removeMessageAndFieldClass()
},add:function(A,B){this.validations.push({type:A,params:B||{}});
return this
},remove:function(A,B){this.validations=this.validations.reject(function(C){return(C.type==A&&C.params==B)
});
return this
},deferValidation:function(A){if(this.wait>=300){this.removeMessageAndFieldClass()
}if(this.timeout){clearTimeout(this.timeout)
}this.timeout=setTimeout(this.validate.bind(this),this.wait)
},doOnBlur:function(){this.focused=false;
this.validate()
},doOnFocus:function(){this.focused=true;
this.removeMessageAndFieldClass()
},getElementType:function(){switch(true){case (this.element.nodeName.toUpperCase()=="TEXTAREA"):return LiveValidation.TEXTAREA;
case (this.element.nodeName.toUpperCase()=="INPUT"&&this.element.type.toUpperCase()=="TEXT"):return LiveValidation.TEXT;
case (this.element.nodeName.toUpperCase()=="INPUT"&&this.element.type.toUpperCase()=="PASSWORD"):return LiveValidation.PASSWORD;
case (this.element.nodeName.toUpperCase()=="INPUT"&&this.element.type.toUpperCase()=="CHECKBOX"):return LiveValidation.CHECKBOX;
case (this.element.nodeName.toUpperCase()=="INPUT"&&this.element.type.toUpperCase()=="FILE"):return LiveValidation.FILE;
case (this.element.nodeName.toUpperCase()=="SELECT"):return LiveValidation.SELECT;
case (this.element.nodeName.toUpperCase()=="INPUT"):throw new Error("LiveValidation::getElementType - Cannot use LiveValidation on an "+this.element.type+" input!");
default:throw new Error("LiveValidation::getElementType - Element must be an input, select, or textarea!")
}},doValidations:function(){this.validationFailed=false;
for(var C=0,A=this.validations.length;
C<A;
++C){var B=this.validations[C];
switch(B.type){case Validate.Presence:case Validate.Confirmation:case Validate.Acceptance:this.displayMessageWhenEmpty=true;
this.validationFailed=!this.validateElement(B.type,B.params);
break;
default:this.validationFailed=!this.validateElement(B.type,B.params);
break
}if(this.validationFailed){return false
}}this.message=this.validMessage;
return true
},validateElement:function(A,C){var D=(this.elementType==LiveValidation.SELECT)?this.element.options[this.element.selectedIndex].value:this.element.value;
if(A==Validate.Acceptance){if(this.elementType!=LiveValidation.CHECKBOX){throw new Error("LiveValidation::validateElement - Element to validate acceptance must be a checkbox!")
}D=this.element.checked
}var E=true;
try{A(D,C)
}catch(B){if(B instanceof Validate.Error){if(D!==""||(D===""&&this.displayMessageWhenEmpty)){this.validationFailed=true;
this.message=B.message;
E=false
}}else{throw B
}}finally{return E
}},validate:function(){if(!this.element.disabled){var A=this.doValidations();
if(A){this.onValid();
return true
}else{this.onInvalid();
return false
}}else{return true
}},enable:function(){this.element.disabled=false;
return this
},disable:function(){this.element.disabled=true;
this.removeMessageAndFieldClass();
return this
},createMessageSpan:function(){var A=document.createElement("span");
var B=document.createTextNode(this.message);
A.appendChild(B);
return A
},insertMessage:function(B){this.removeMessage();
var A=this.validationFailed?this.invalidClass:this.validClass;
if((this.displayMessageWhenEmpty&&(this.elementType==LiveValidation.CHECKBOX||this.element.value==""))||this.element.value!=""){$(B).addClassName(this.messageClass+(" "+A));
if(nxtSibling=this.insertAfterWhatNode.nextSibling){this.insertAfterWhatNode.parentNode.insertBefore(B,nxtSibling)
}else{this.insertAfterWhatNode.parentNode.appendChild(B)
}}},addFieldClass:function(){this.removeFieldClass();
if(!this.validationFailed){if(this.displayMessageWhenEmpty||this.element.value!=""){if(!this.element.hasClassName(this.validFieldClass)){this.element.addClassName(this.validFieldClass)
}}}else{if(!this.element.hasClassName(this.invalidFieldClass)){this.element.addClassName(this.invalidFieldClass)
}}},removeMessage:function(){if(nxtEl=this.insertAfterWhatNode.next("."+this.messageClass)){nxtEl.remove()
}},removeFieldClass:function(){this.element.removeClassName(this.invalidFieldClass);
this.element.removeClassName(this.validFieldClass)
},removeMessageAndFieldClass:function(){this.removeMessage();
this.removeFieldClass()
}};
var LiveValidationForm=Class.create();
Object.extend(LiveValidationForm,{instances:{},getInstance:function(A){var B=Math.random()*Math.random();
if(!A.id){A.id="formId_"+B.toString().replace(/\./,"")+new Date().valueOf()
}if(!LiveValidationForm.instances[A.id]){LiveValidationForm.instances[A.id]=new LiveValidationForm(A)
}return LiveValidationForm.instances[A.id]
}});
LiveValidationForm.prototype={initialize:function(A){this.element=$(A);
this.fields=[];
this.oldOnSubmit=this.element.onsubmit||function(){};
this.element.onsubmit=function(C){var B=(LiveValidation.massValidate(this.fields))?this.oldOnSubmit.call(this.element,C)!==false:false;
if(!B){Event.stop(C)
}}.bindAsEventListener(this)
},addField:function(A){this.fields.push(A)
},removeField:function(A){this.fields=this.fields.without(A)
},destroy:function(A){if(this.fields.length!=0&&!A){return false
}this.element.onsubmit=this.oldOnSubmit;
LiveValidationForm.instances[this.element.id]=null;
return true
}};
var Validate={Presence:function(A,B){var C=Object.extend({failureMessage:"Can't be empty!"},B||{});
if(A===""||A===null||A===undefined){Validate.fail(C.failureMessage)
}return true
},Numericality:function(B,C){var A=B;
var B=Number(B);
var C=C||{};
var D={notANumberMessage:C.notANumberMessage||"Must be a number!",notAnIntegerMessage:C.notAnIntegerMessage||"Must be an integer!",wrongNumberMessage:C.wrongNumberMessage||"Must be "+C.is+"!",tooLowMessage:C.tooLowMessage||"Must not be less than "+C.minimum+"!",tooHighMessage:C.tooHighMessage||"Must not be more than "+C.maximum+"!",is:((C.is)||(C.is==0))?C.is:null,minimum:((C.minimum)||(C.minimum==0))?C.minimum:null,maximum:((C.maximum)||(C.maximum==0))?C.maximum:null,onlyInteger:C.onlyInteger||false};
if(!isFinite(B)){Validate.fail(D.notANumberMessage)
}if(D.onlyInteger&&((/\.0+$|\.$/.test(String(A)))||(B!=parseInt(B)))){Validate.fail(D.notAnIntegerMessage)
}switch(true){case (D.is!==null):if(B!=Number(D.is)){Validate.fail(D.wrongNumberMessage)
}break;
case (D.minimum!==null&&D.maximum!==null):Validate.Numericality(B,{tooLowMessage:D.tooLowMessage,minimum:D.minimum});
Validate.Numericality(B,{tooHighMessage:D.tooHighMessage,maximum:D.maximum});
break;
case (D.minimum!==null):if(B<Number(D.minimum)){Validate.fail(D.tooLowMessage)
}break;
case (D.maximum!==null):if(B>Number(D.maximum)){Validate.fail(D.tooHighMessage)
}break
}return true
},Format:function(A,B){var A=String(A);
var C=Object.extend({failureMessage:"Not valid!",pattern:/./,negate:false},B||{});
if(!C.negate&&!C.pattern.test(A)){Validate.fail(C.failureMessage)
}if(C.negate&&C.pattern.test(A)){Validate.fail(C.failureMessage)
}return true
},Email:function(A,B){var C=Object.extend({failureMessage:"Must be a valid email address!"},B||{});
Validate.Format(A,{failureMessage:C.failureMessage,pattern:/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i});
return true
},Length:function(A,B){var A=String(A);
var B=B||{};
var C={wrongLengthMessage:B.wrongLengthMessage||"Must be "+B.is+" characters long!",tooShortMessage:B.tooShortMessage||"Must not be less than "+B.minimum+" characters long!",tooLongMessage:B.tooLongMessage||"Must not be more than "+B.maximum+" characters long!",is:((B.is)||(B.is==0))?B.is:null,minimum:((B.minimum)||(B.minimum==0))?B.minimum:null,maximum:((B.maximum)||(B.maximum==0))?B.maximum:null};
switch(true){case (C.is!==null):if(A.length!=Number(C.is)){Validate.fail(C.wrongLengthMessage)
}break;
case (C.minimum!==null&&C.maximum!==null):Validate.Length(A,{tooShortMessage:C.tooShortMessage,minimum:C.minimum});
Validate.Length(A,{tooLongMessage:C.tooLongMessage,maximum:C.maximum});
break;
case (C.minimum!==null):if(A.length<Number(C.minimum)){Validate.fail(C.tooShortMessage)
}break;
case (C.maximum!==null):if(A.length>Number(C.maximum)){Validate.fail(C.tooLongMessage)
}break;
default:throw new Error("Validate::Length - Length(s) to validate against must be provided!")
}return true
},Inclusion:function(C,D){var E=Object.extend({failureMessage:"Must be included in the list!",within:[],allowNull:false,partialMatch:false,caseSensitive:true,negate:false},D||{});
if(E.allowNull&&C==null){return true
}if(!E.allowNull&&C==null){Validate.fail(E.failureMessage)
}if(!E.caseSensitive){var A=[];
E.within.each(function(F){if(typeof F=="string"){F=F.toLowerCase()
}A.push(F)
});
E.within=A;
if(typeof C=="string"){C=C.toLowerCase()
}}var B=(E.within.indexOf(C)==-1)?false:true;
if(E.partialMatch){B=false;
E.within.each(function(F){if(C.indexOf(F)!=-1){B=true
}})
}if((!E.negate&&!B)||(E.negate&&B)){Validate.fail(E.failureMessage)
}return true
},Exclusion:function(A,B){var C=Object.extend({failureMessage:"Must not be included in the list!",within:[],allowNull:false,partialMatch:false,caseSensitive:true},B||{});
C.negate=true;
Validate.Inclusion(A,C);
return true
},Confirmation:function(A,B){if(!B.match){throw new Error("Validate::Confirmation - Error validating confirmation: Id of element to match must be provided!")
}var C=Object.extend({failureMessage:"Does not match!",match:null},B||{});
C.match=$(B.match);
if(!C.match){throw new Error("Validate::Confirmation - There is no reference with name of, or element with id of '"+C.match+"'!")
}if(A!=C.match.value){Validate.fail(C.failureMessage)
}return true
},Acceptance:function(A,B){var C=Object.extend({failureMessage:"Must be accepted!"},B||{});
if(!A){Validate.fail(C.failureMessage)
}return true
},Custom:function(A,B){var C=Object.extend({against:function(){return true
},args:{},failureMessage:"Not valid!"},B||{});
if(!C.against(A,C.args)){Validate.fail(C.failureMessage)
}return true
},now:function(A,D,C){if(!A){throw new Error("Validate::now - Validation function must be provided!")
}var E=true;
try{A(D,C||{})
}catch(B){if(B instanceof Validate.Error){E=false
}else{throw B
}}finally{return E
}},Error:function(A){this.message=A;
this.name="ValidationError"
},fail:function(A){throw new Validate.Error(A)
}};