Event.simulateMouse=function(D,B){var C=Object.extend({pointerX:0,pointerY:0,buttons:0,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},arguments[2]||{});
var A=document.createEvent("MouseEvents");
A.initMouseEvent(B,true,true,document.defaultView,C.buttons,C.pointerX,C.pointerY,C.pointerX,C.pointerY,C.ctrlKey,C.altKey,C.shiftKey,C.metaKey,0,$(D));
if(this.mark){Element.remove(this.mark)
}this.mark=document.createElement("div");
this.mark.appendChild(document.createTextNode(" "));
document.body.appendChild(this.mark);
this.mark.style.position="absolute";
this.mark.style.top=C.pointerY+"px";
this.mark.style.left=C.pointerX+"px";
this.mark.style.width="5px";
this.mark.style.height="5px;";
this.mark.style.borderTop="1px solid red;";
this.mark.style.borderLeft="1px solid red;";
if(this.step){alert("["+new Date().getTime().toString()+"] "+B+"/"+Test.Unit.inspect(C))
}$(D).dispatchEvent(A)
};
Event.simulateKey=function(D,B){var C=Object.extend({ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,keyCode:0,charCode:0},arguments[2]||{});
var A=document.createEvent("KeyEvents");
A.initKeyEvent(B,true,true,window,C.ctrlKey,C.altKey,C.shiftKey,C.metaKey,C.keyCode,C.charCode);
$(D).dispatchEvent(A)
};
Event.simulateKeys=function(B,C){for(var A=0;
A<C.length;
A++){Event.simulateKey(B,"keypress",{charCode:C.charCodeAt(A)})
}};
var Test={};
Test.Unit={};
Test.Unit.inspect=Object.inspect;
Test.Unit.Logger=Class.create();
Test.Unit.Logger.prototype={initialize:function(A){this.log=$(A);
if(this.log){this._createLogTable()
}},start:function(A){if(!this.log){return 
}this.testName=A;
this.lastLogLine=document.createElement("tr");
this.statusCell=document.createElement("td");
this.nameCell=document.createElement("td");
this.nameCell.className="nameCell";
this.nameCell.appendChild(document.createTextNode(A));
this.messageCell=document.createElement("td");
this.lastLogLine.appendChild(this.statusCell);
this.lastLogLine.appendChild(this.nameCell);
this.lastLogLine.appendChild(this.messageCell);
this.loglines.appendChild(this.lastLogLine)
},finish:function(A,B){if(!this.log){return 
}this.lastLogLine.className=A;
this.statusCell.innerHTML=A;
this.messageCell.innerHTML=this._toHTML(B);
this.addLinksToResults()
},message:function(A){if(!this.log){return 
}this.messageCell.innerHTML=this._toHTML(A)
},summary:function(A){if(!this.log){return 
}this.logsummary.innerHTML=this._toHTML(A)
},_createLogTable:function(){this.log.innerHTML='<div id="logsummary"></div><table id="logtable"><thead><tr><th>Status</th><th>Test</th><th>Message</th></tr></thead><tbody id="loglines"></tbody></table>';
this.logsummary=$("logsummary");
this.loglines=$("loglines")
},_toHTML:function(A){return A.escapeHTML().replace(/\n/g,"<br/>")
},addLinksToResults:function(){$$("tr.failed .nameCell").each(function(A){A.title="Run only this test";
Event.observe(A,"click",function(){window.location.search="?tests="+A.innerHTML
})
});
$$("tr.passed .nameCell").each(function(A){A.title="Run all tests";
Event.observe(A,"click",function(){window.location.search=""
})
})
}};
Test.Unit.Runner=Class.create();
Test.Unit.Runner.prototype={initialize:function(A){this.options=Object.extend({testLog:"testlog"},arguments[1]||{});
this.options.resultsURL=this.parseResultsURLQueryParameter();
this.options.tests=this.parseTestsQueryParameter();
if(this.options.testLog){this.options.testLog=$(this.options.testLog)||null
}if(this.options.tests){this.tests=[];
for(var C=0;
C<this.options.tests.length;
C++){if(/^test/.test(this.options.tests[C])){this.tests.push(new Test.Unit.Testcase(this.options.tests[C],A[this.options.tests[C]],A.setup,A.teardown))
}}}else{if(this.options.test){this.tests=[new Test.Unit.Testcase(this.options.test,A[this.options.test],A.setup,A.teardown)]
}else{this.tests=[];
for(var B in A){if(/^test/.test(B)){this.tests.push(new Test.Unit.Testcase(this.options.context?" -> "+this.options.titles[B]:B,A[B],A.setup,A.teardown))
}}}}this.currentTest=0;
this.logger=new Test.Unit.Logger(this.options.testLog);
setTimeout(this.runTests.bind(this),1000)
},parseResultsURLQueryParameter:function(){return window.location.search.parseQuery()["resultsURL"]
},parseTestsQueryParameter:function(){if(window.location.search.parseQuery()["tests"]){return window.location.search.parseQuery()["tests"].split(",")
}},getResult:function(){var B=false;
for(var A=0;
A<this.tests.length;
A++){if(this.tests[A].errors>0){return"ERROR"
}if(this.tests[A].failures>0){B=true
}}if(B){return"FAILURE"
}else{return"SUCCESS"
}},postResults:function(){if(this.options.resultsURL){new Ajax.Request(this.options.resultsURL,{method:"get",parameters:"result="+this.getResult(),asynchronous:false})
}},runTests:function(){var A=this.tests[this.currentTest];
if(!A){this.postResults();
this.logger.summary(this.summary());
return 
}if(!A.isWaiting){this.logger.start(A.name)
}A.run();
if(A.isWaiting){this.logger.message("Waiting for "+A.timeToWait+"ms");
setTimeout(this.runTests.bind(this),A.timeToWait||1000)
}else{this.logger.finish(A.status(),A.summary());
this.currentTest++;
this.runTests()
}},summary:function(){var D=0;
var B=0;
var E=0;
var C=[];
for(var A=0;
A<this.tests.length;
A++){D+=this.tests[A].assertions;
B+=this.tests[A].failures;
E+=this.tests[A].errors
}return((this.options.context?this.options.context+": ":"")+this.tests.length+" tests, "+D+" assertions, "+B+" failures, "+E+" errors")
}};
Test.Unit.Assertions=Class.create();
Test.Unit.Assertions.prototype={initialize:function(){this.assertions=0;
this.failures=0;
this.errors=0;
this.messages=[]
},summary:function(){return(this.assertions+" assertions, "+this.failures+" failures, "+this.errors+" errors\n"+this.messages.join("\n"))
},pass:function(){this.assertions++
},fail:function(A){this.failures++;
this.messages.push("Failure: "+A)
},info:function(A){this.messages.push("Info: "+A)
},error:function(A){this.errors++;
this.messages.push(A.name+": "+A.message+"("+Test.Unit.inspect(A)+")")
},status:function(){if(this.failures>0){return"failed"
}if(this.errors>0){return"error"
}return"passed"
},assert:function(C){var A=arguments[1]||'assert: got "'+Test.Unit.inspect(C)+'"';
try{C?this.pass():this.fail(A)
}catch(B){this.error(B)
}},assertEqual:function(B,D){var A=arguments[2]||"assertEqual";
try{(B==D)?this.pass():this.fail(A+': expected "'+Test.Unit.inspect(B)+'", actual "'+Test.Unit.inspect(D)+'"')
}catch(C){this.error(C)
}},assertInspect:function(B,D){var A=arguments[2]||"assertInspect";
try{(B==D.inspect())?this.pass():this.fail(A+': expected "'+Test.Unit.inspect(B)+'", actual "'+Test.Unit.inspect(D)+'"')
}catch(C){this.error(C)
}},assertEnumEqual:function(B,D){var A=arguments[2]||"assertEnumEqual";
try{$A(B).length==$A(D).length&&B.zip(D).all(function(E){return E[0]==E[1]
})?this.pass():this.fail(A+": expected "+Test.Unit.inspect(B)+", actual "+Test.Unit.inspect(D))
}catch(C){this.error(C)
}},assertNotEqual:function(B,D){var A=arguments[2]||"assertNotEqual";
try{(B!=D)?this.pass():this.fail(A+': got "'+Test.Unit.inspect(D)+'"')
}catch(C){this.error(C)
}},assertIdentical:function(B,D){var A=arguments[2]||"assertIdentical";
try{(B===D)?this.pass():this.fail(A+': expected "'+Test.Unit.inspect(B)+'", actual "'+Test.Unit.inspect(D)+'"')
}catch(C){this.error(C)
}},assertNotIdentical:function(B,D){var A=arguments[2]||"assertNotIdentical";
try{!(B===D)?this.pass():this.fail(A+': expected "'+Test.Unit.inspect(B)+'", actual "'+Test.Unit.inspect(D)+'"')
}catch(C){this.error(C)
}},assertNull:function(C){var A=arguments[1]||"assertNull";
try{(C==null)?this.pass():this.fail(A+': got "'+Test.Unit.inspect(C)+'"')
}catch(B){this.error(B)
}},assertMatch:function(C,E){var B=arguments[2]||"assertMatch";
var A=new RegExp(C);
try{(A.exec(E))?this.pass():this.fail(B+' : regex: "'+Test.Unit.inspect(C)+" did not match: "+Test.Unit.inspect(E)+'"')
}catch(D){this.error(D)
}},assertHidden:function(A){var B=arguments[1]||"assertHidden";
this.assertEqual("none",A.style.display,B)
},assertNotNull:function(A){var B=arguments[1]||"assertNotNull";
this.assert(A!=null,B)
},assertType:function(B,D){var A=arguments[2]||"assertType";
try{(D.constructor==B)?this.pass():this.fail(A+': expected "'+Test.Unit.inspect(B)+'", actual "'+(D.constructor)+'"')
}catch(C){this.error(C)
}},assertNotOfType:function(B,D){var A=arguments[2]||"assertNotOfType";
try{(D.constructor!=B)?this.pass():this.fail(A+': expected "'+Test.Unit.inspect(B)+'", actual "'+(D.constructor)+'"')
}catch(C){this.error(C)
}},assertInstanceOf:function(B,D){var A=arguments[2]||"assertInstanceOf";
try{(D instanceof B)?this.pass():this.fail(A+": object was not an instance of the expected type")
}catch(C){this.error(C)
}},assertNotInstanceOf:function(B,D){var A=arguments[2]||"assertNotInstanceOf";
try{!(D instanceof B)?this.pass():this.fail(A+": object was an instance of the not expected type")
}catch(C){this.error(C)
}},assertRespondsTo:function(D,C){var A=arguments[2]||"assertRespondsTo";
try{(C[D]&&typeof C[D]=="function")?this.pass():this.fail(A+": object doesn't respond to ["+D+"]")
}catch(B){this.error(B)
}},assertReturnsTrue:function(E,D){var B=arguments[2]||"assertReturnsTrue";
try{var A=D[E];
if(!A){A=D["is"+E.charAt(0).toUpperCase()+E.slice(1)]
}A()?this.pass():this.fail(B+": method returned false")
}catch(C){this.error(C)
}},assertReturnsFalse:function(E,D){var B=arguments[2]||"assertReturnsFalse";
try{var A=D[E];
if(!A){A=D["is"+E.charAt(0).toUpperCase()+E.slice(1)]
}!A()?this.pass():this.fail(B+": method returned true")
}catch(C){this.error(C)
}},assertRaise:function(A,D){var B=arguments[2]||"assertRaise";
try{D();
this.fail(B+": exception expected but none was raised")
}catch(C){((A==null)||(C.name==A))?this.pass():this.error(C)
}},assertElementsMatch:function(){var A=$A(arguments),B=$A(A.shift());
if(B.length!=A.length){this.fail("assertElementsMatch: size mismatch: "+B.length+" elements, "+A.length+" expressions");
return false
}B.zip(A).all(function(F,C){var D=$(F.first()),E=F.last();
if(D.match(E)){return true
}this.fail("assertElementsMatch: (in index "+C+") expected "+E.inspect()+" but got "+D.inspect())
}.bind(this))&&this.pass()
},assertElementMatches:function(A,B){this.assertElementsMatch([A],B)
},benchmark:function(C,D){var B=new Date();
(D||1).times(C);
var A=((new Date())-B);
this.info((arguments[2]||"Operation")+" finished "+D+" iterations in "+(A/1000)+"s");
return A
},_isVisible:function(A){A=$(A);
if(!A.parentNode){return true
}this.assertNotNull(A);
if(A.style&&Element.getStyle(A,"display")=="none"){return false
}return this._isVisible(A.parentNode)
},assertNotVisible:function(A){this.assert(!this._isVisible(A),Test.Unit.inspect(A)+" was not hidden and didn't have a hidden parent either. "+(""||arguments[1]))
},assertVisible:function(A){this.assert(this._isVisible(A),Test.Unit.inspect(A)+" was not visible. "+(""||arguments[1]))
},benchmark:function(C,D){var B=new Date();
(D||1).times(C);
var A=((new Date())-B);
this.info((arguments[2]||"Operation")+" finished "+D+" iterations in "+(A/1000)+"s");
return A
}};
Test.Unit.Testcase=Class.create();
Object.extend(Object.extend(Test.Unit.Testcase.prototype,Test.Unit.Assertions.prototype),{initialize:function(name,test,setup,teardown){Test.Unit.Assertions.prototype.initialize.bind(this)();
this.name=name;
if(typeof test=="string"){test=test.gsub(/(\.should[^\(]+\()/,"#{0}this,");
test=test.gsub(/(\.should[^\(]+)\(this,\)/,"#{1}(this)");
this.test=function(){eval("with(this){"+test+"}")
}
}else{this.test=test||function(){}
}this.setup=setup||function(){};
this.teardown=teardown||function(){};
this.isWaiting=false;
this.timeToWait=1000
},wait:function(B,A){this.isWaiting=true;
this.test=A;
this.timeToWait=B
},run:function(){try{try{if(!this.isWaiting){this.setup.bind(this)()
}this.isWaiting=false;
this.test.bind(this)()
}finally{if(!this.isWaiting){this.teardown.bind(this)()
}}}catch(A){this.error(A)
}}});
Test.setupBDDExtensionMethods=function(){var B={shouldEqual:"assertEqual",shouldNotEqual:"assertNotEqual",shouldEqualEnum:"assertEnumEqual",shouldBeA:"assertType",shouldNotBeA:"assertNotOfType",shouldBeAn:"assertType",shouldNotBeAn:"assertNotOfType",shouldBeNull:"assertNull",shouldNotBeNull:"assertNotNull",shouldBe:"assertReturnsTrue",shouldNotBe:"assertReturnsFalse",shouldRespondTo:"assertRespondsTo"};
var A=function(C,E,D){this[C].apply(this,(E||[]).concat([D]))
};
Test.BDDMethods={};
$H(B).each(function(C){Test.BDDMethods[C.key]=function(){var D=$A(arguments);
var E=D.shift();
A.apply(E,[C.value,D,this])
}
});
[Array.prototype,String.prototype,Number.prototype,Boolean.prototype].each(function(C){Object.extend(C,Test.BDDMethods)
})
};
Test.context=function(D,C,F){Test.setupBDDExtensionMethods();
var E={};
var G={};
for(specName in C){switch(specName){case"setup":case"teardown":E[specName]=C[specName];
break;
default:var B="test"+specName.gsub(/\s+/,"-").camelize();
var A=C[specName].toString().split("\n").slice(1);
if(/^\{/.test(A[0])){A=A.slice(1)
}A.pop();
A=A.map(function(H){return H.strip()
});
E[B]=A.join("\n");
G[B]=specName
}}new Test.Unit.Runner(E,{titles:G,testLog:F||"testlog",context:D})
};