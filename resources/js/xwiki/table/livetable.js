(function(){if(typeof XWiki=="undefined"){XWiki=new Object()
}if(typeof XWiki.widgets=="undefined"){XWiki.widgets=new Object()
}XWiki.widgets.LiveTable=Class.create({initialize:function(url,domNodeName,handler,options){if(!options){var options={}
}this.domNodeName=domNodeName;
if($(this.domNodeName).down("tr.xwiki-livetable-initial-message")){$(this.domNodeName).down("tr.xwiki-livetable-initial-message").remove()
}this.displayNode=$(domNodeName+"-display")||$("display1");
this.filtersNodes=[options.filterNodes||$(options.filtersNode)||$(domNodeName).down(".xwiki-livetable-display-filters")].flatten().compact();
this.paginationNodes=options.paginationNodes||$(this.domNodeName).select(".xwiki-livetable-pagination");
if(typeof options=="undefined"){options={}
}this.limit=options.limit||10;
this.action=options.action||"view";
this.permalinks=(typeof options.permalinks=="undefined"||options.permalinks);
if(typeof this.paginationNodes!="undefined"){this.paginator=new LiveTablePagination(this,this.paginationNodes,options.maxPages||10)
}if(this.filtersNodes.length>0){var initialFilters=this.permalinks?this.getFiltersFromHash():new Object();
this.filter=new LiveTableFilter(this,this.filtersNodes,initialFilters)
}if($(domNodeName+"-tagcloud")){this.tagCloud=new LiveTableTagCloud(this,domNodeName+"-tagcloud")
}this.loadingStatus=$(this.domNodeName+"-ajax-loader")||$("ajax-loader");
this.limitsDisplay=$(this.domNodeName+"-limits")||new Element("div");
this.filters="";
this.handler=handler||function(){};
this.totalRows=-1;
this.fetchedRows=new Array();
this.getUrl=url;
this.lastOffset=1;
this.sendReqNo=0;
this.recvReqNo=0;
this.observeSortableColumns();
var initialPage=this.permalinks?this.getPageFromHash():1;
this.currentOffset=(initialPage-1)*this.limit+1;
this.showRows(this.currentOffset,this.limit)
},updateLocationHash:function(){var currentHash=window.location.hash.substring(1);
var filterString=this.filter?this.filter.serializeFilters():"";
var shouldUpdate=this.lastOffset!=1||!currentHash.blank()||!filterString.blank();
if(shouldUpdate){var tables=currentHash.split("|"),newHash="";
for(var i=0;
i<tables.length;
i++){var params=tables[i].toQueryParams();
if(params.t!=this.domNodeName){newHash+=(tables[i]+"|")
}}newHash+="t=#{table}&p=#{page}".interpolate({table:this.domNodeName,page:((this.lastOffset-1)/this.limit)+1});
newHash+=filterString;
window.location.hash="#"+newHash
}},getPageFromHash:function(){var hashString=window.location.hash.substring(1);
if(!hashString.blank()){var tables=hashString.split("|");
for(var i=0;
i<tables.length;
i++){var params=tables[i].toQueryParams();
if(params.t==this.domNodeName&&parseInt(params.p)){return parseInt(params.p)
}}}return 1
},getFiltersFromHash:function(){var hashString=window.location.hash.substring(1);
if(!hashString.blank()){var tables=hashString.split("|");
for(var i=0;
i<tables.length;
i++){var params=tables[i].toQueryParams();
if(params.t==this.domNodeName){var parameterNames=Object.keys(params),result=new Object();
for(var j=0;
j<parameterNames.length;
j++){if(parameterNames[j]!="t"&&parameterNames[j]!="p"){result[parameterNames[j]]=params[parameterNames[j]]
}}return result
}}}return new Object()
},getRows:function(reqOffset,reqLimit,displayOffset,displayLimit){var url=this.getUrl+"&offset="+reqOffset+"&limit="+reqLimit+"&reqNo="+(++this.sendReqNo);
if(this.filter){this.filters=this.filter.serializeFilters();
if(this.filters!=undefined&&this.filters!=""){url+=this.filters
}}if(typeof this.tags!="undefined"&&this.tags.length>0){this.tags.each(function(tag){url+=("&tag="+encodeURIComponent(tag.unescapeHTML()))
})
}url+=this.getSortURLFragment();
var self=this;
this.loadingStatus.removeClassName("hidden");
document.fire("xwiki:livetable:"+this.domNodeName+":loadingEntries");
document.fire("xwiki:livetable:loadingEntries",{tableId:this.domNodeName});
var ajx=new Ajax.Request(url,{method:"get",onComplete:function(transport){self.loadingStatus.addClassName("hidden")
},onSuccess:function(transport){var res=eval("("+transport.responseText+")");
if(res.reqNo<self.sendReqNo){return 
}self.recvReqNo=res.reqNo;
self.loadingStatus.addClassName("hidden");
if(self.tagCloud&&res.matchingtags){self.tagCloud.updateTagCloud(res.tags,res.matchingtags)
}document.fire("xwiki:livetable:"+this.domNodeName+":receivedEntries",{data:res});
document.fire("xwiki:livetable:receivedEntries",{data:res,tableId:self.domNodeName});
self.updateFetchedRows(res);
self.displayRows(displayOffset,displayLimit)
}})
},updateFetchedRows:function(json){this.json=json;
this.totalRows=json.totalrows;
for(var i=json.offset;
i<json.offset+json.returnedrows;
++i){this.fetchedRows[i]=json.rows[i-json.offset]
}},clearDisplay:function(){var object=this.displayNode;
while(object.hasChildNodes()){object.removeChild(object.firstChild)
}},displayRows:function(offset,limit){var f=offset+limit-1;
if(f>this.totalRows){f=this.totalRows
}var off=(this.totalRows>0)?offset:0;
var msg="<strong>"+off+"</strong> - <strong>"+f+"</strong> $msg.get('xe.pagination.results.of') <strong>"+this.totalRows+"</strong>";
var msg=msg.toLowerCase();
this.limitsDisplay.innerHTML="$msg.get('xe.pagination.results') "+msg;
this.clearDisplay();
for(var i=off;
i<=f;
i++){if(this.fetchedRows[i]){var elem=this.handler(this.fetchedRows[i],i,this);
this.displayNode.appendChild(elem);
var memo={data:this.fetchedRows[i],row:elem,table:this,tableId:this.domNodeName};
document.fire("xwiki:livetable:"+this.domNodeName+":newrow",memo);
document.fire("xwiki:livetable:newrow",memo)
}}if(this.paginator){this.paginator.refreshPagination()
}},showRows:function(offset,limit){this.lastOffset=offset;
if(this.permalinks){this.updateLocationHash()
}var buff="request to display rows "+offset+" to "+(offset+limit)+" <br />\n";
if(this.totalRows==-1){this.getRows(offset,limit,offset,limit);
buff+="table is empty so we get all rows";
return buff
}var min=-1;
var max=-1;
for(var i=offset;
i<(offset+limit);
++i){if(this.fetchedRows[i]==undefined){if(min==-1){min=i
}max=i
}}if(min==-1){buff+="no need to get new rows <br />\n";
this.displayRows(offset,limit)
}else{buff+="we need to get rows "+min+" to "+(max+1)+" <br />\n";
this.getRows(min,max-min+1,offset,limit)
}if(this.paginator){this.paginator.refreshPagination()
}return buff
},deleteAndShiftRows:function(indx){for(i in this.fetchedRows){if(i>=indx){this.fetchedRows[i]=this.fetchedRows[""+(parseInt(i)+1)]
}}},debugFetchedRows:function(){var buf="";
for(i in this.fetchedRows){if(this.fetchedRows[i]!=undefined){buf+=i+" "
}}return buf
},deleteRow:function(indx){this.deleteAndShiftRows(indx);
var newoffset=this.lastOffset;
if(indx>this.totalRows-this.limit-1){newoffset-=1
}if(newoffset<=0){newoffset=1
}this.totalRows-=1;
if(this.totalRows<this.limit){this.showRows(newoffset,this.totalRows)
}else{this.showRows(newoffset,this.limit)
}if(this.paginator){this.paginator.refreshPagination()
}},getSortURLFragment:function(){var fragment="&sort=";
if(typeof $(this.domNodeName).down("th.selected a")!="undefined"){fragment+=$(this.domNodeName).down("th.selected a").getAttribute("rel")
}fragment+="&dir=";
if(typeof $(this.domNodeName).down("th.selected")!="undefined"){fragment+=($(this.domNodeName).down("th.selected").hasClassName("desc")?"desc":"asc")
}return fragment
},clearCache:function(){this.fetchedRows.clear();
this.totalRows=-1
},observeSortableColumns:function(){var self=this;
$(this.domNodeName).select("th.sortable").each(function(el){if(el.hasClassName("selected")){self.selectedColumn=el
}if(!el.hasClassName("desc")&&!el.hasClassName("asc")){el.addClassName("desc")
}Event.observe(el,"click",function(event){var elem=event.element();
if(!elem.hasClassName("sortable")){elem=elem.up("th.sortable")
}if(elem==null){return 
}if(elem.hasClassName("selected")){var direction=elem.hasClassName("asc")?"asc":"desc";
var newDirection=direction=="asc"?"desc":"asc";
elem.removeClassName(direction);
elem.addClassName(newDirection)
}else{if(self.selectedColumn){self.selectedColumn.removeClassName("selected")
}elem.addClassName("selected");
self.selectedColumn=elem
}self.clearCache();
self.showRows(1,self.limit)
})
})
}});
var LiveTablePagination=Class.create({initialize:function(table,domNodes,max){this.table=table;
var self=this;
this.pagesNodes=[];
domNodes.each(function(elem){self.pagesNodes.push(elem.down(".xwiki-livetable-pagination-content"))
});
this.max=max;
$(this.table.domNodeName).select("span.prevPagination").invoke("observe","click",this.gotoPrevPage.bind(this));
$(this.table.domNodeName).select("span.nextPagination").invoke("observe","click",this.gotoNextPage.bind(this))
},refreshPagination:function(){var self=this;
this.pagesNodes.each(function(elem){elem.innerHTML=""
});
var pages=Math.ceil(this.table.totalRows/this.table.limit);
var currentMax=(!this.max)?pages:this.max;
var currentPage=Math.floor(this.table.lastOffset/this.table.limit)+1;
var startPage=Math.floor(currentPage/currentMax)*currentMax-1;
if(startPage>1){this.pagesNodes.each(function(elem){elem.insert(self.createPageLink(1,false))
});
if(startPage>2){this.pagesNodes.invoke("insert"," ... ")
}}var i;
for(i=(startPage<=0)?1:startPage;
i<=Math.min(startPage+currentMax+1,pages);
i++){var selected=(currentPage==i)?true:false;
this.pagesNodes.each(function(elem){elem.insert(self.createPageLink(i,selected))
});
this.pagesNodes.invoke("insert"," ")
}if(i<pages){if(i+1<pages){this.pagesNodes.invoke("insert"," ... ")
}this.pagesNodes.each(function(elem){elem.insert(self.createPageLink(pages,false))
})
}},createPageLink:function(page,selected){var pageSpan=new Element("span",{"class":"pagenumber"}).update(page);
if(selected){pageSpan.addClassName("selected")
}var self=this;
pageSpan.observe("click",function(ev){self.gotoPage(ev.element().innerHTML)
});
return pageSpan
},gotoPage:function(page){this.table.showRows(((parseInt(page)-1)*this.table.limit)+1,this.table.limit)
},gotoPrevPage:function(){var currentPage=Math.floor(this.table.lastOffset/this.table.limit)+1;
var prevPage=currentPage-1;
if(prevPage>0){this.table.showRows(((parseInt(prevPage)-1)*this.table.limit)+1,this.table.limit)
}},gotoNextPage:function(){var currentPage=Math.floor(this.table.lastOffset/this.table.limit)+1;
var pages=Math.ceil(this.table.totalRows/this.table.limit);
var nextPage=currentPage+1;
if(nextPage<=pages){this.table.showRows(((parseInt(nextPage)-1)*this.table.limit)+1,this.table.limit)
}}});
var LiveTableFilter=Class.create({initialize:function(table,filterNodes,filters){this.table=table;
this.filterNodes=filterNodes;
this.filters=new Object();
this.filters=filters;
this.inputs=this.filterNodes.invoke("select","input").flatten();
this.selects=this.filterNodes.invoke("select","select").flatten();
this.initializeFilters();
this.attachEventHandlers()
},makeRefreshHandler:function(self){return function(){self.refreshContent()
}
},initializeFilters:function(){for(var i=0;
i<this.inputs.length;
++i){var key=this.inputs[i].name;
if((this.inputs[i].type=="radio")||(this.inputs[i].type=="checkbox")){var filter=this.filters[key];
if(filter){if(Object.isArray(filter)){this.inputs[i].checked=(filter.indexOf(this.inputs[i].value.strip())!=-1)
}else{this.inputs[i].checked=(filter==this.inputs[i].value.strip())
}}}else{if(this.filters[key]){this.inputs[i].value=this.filters[key]
}}}for(var i=0;
i<this.selects.length;
++i){var filter=this.filters[this.selects[i].name];
if(filter){for(var j=0;
j<this.selects[i].options.length;
++j){if(Object.isArray(filter)){this.selects[i].options[j].selected=(filter.indexOf(this.selects[i].options[j].value)!=-1)
}else{this.selects[i].options[j].selected=(this.selects[i].options[j].value==filter)
}}}}},serializeFilters:function(){var result="";
var filters=[this.inputs,this.selects].flatten();
for(var i=0;
i<filters.length;
i++){if(!filters[i].value.blank()){if((filters[i].type!="radio"&&filters[i].type!="checkbox")||filters[i].checked){result+=("&"+filters[i].serialize())
}}}return result
},attachEventHandlers:function(){for(var i=0;
i<this.inputs.length;
i++){if(this.inputs[i].type=="text"){Event.observe(this.inputs[i],"keyup",this.makeRefreshHandler(this))
}else{Event.observe(this.inputs[i],"click",this.makeRefreshHandler(this))
}}for(var i=0;
i<this.selects.length;
i++){Event.observe(this.selects[i],"change",this.makeRefreshHandler(this))
}document.observe("xwiki:livetable:"+this.table.domNodeName+":filtersChanged",this.makeRefreshHandler(this))
},refreshContent:function(){var newFilters=this.serializeFilters();
if(newFilters==this.table.filters){return 
}this.table.totalRows=-1;
this.table.fetchedRows=new Array();
this.table.filters=newFilters;
this.table.showRows(1,this.table.limit)
}});
var LiveTableTagCloud=Class.create({initialize:function(table,domNodeName,tags){this.table=table;
this.domNode=$(domNodeName);
this.cloudFilter=false;
if(typeof tags=="array"){this.tags=tags;
if(tags.length>0){this.updateTagCloud(tags)
}}},tags:[],matchingTags:[],selectedTags:{},popularityLevels:["notPopular","notVeryPopular","somewhatPopular","popular","veryPopular","ultraPopular"],updateTagCloud:function(tags,matchingTags){if(!this.hasTags&&tags.length>0){this.tags=tags;
this.map=this.buildPopularityMap(this.tags);
this.hasTags=true;
this.domNode.removeClassName("hidden")
}this.matchingTags=matchingTags;
this.displayTagCloud()
},displayTagCloud:function(){this.domNode.down(".xwiki-livetable-tagcloud").innerHTML="";
var cloud=new Element("ol",{"class":"tagCloud"});
var liClass;
for(var i=0;
i<this.tags.length;
i++){liClass="";
var levels=this.map.keys().reverse();
for(var j=0;
j<levels.length;
j++){if(this.tags[i].count>=levels[j]||(j==(levels.length-1))){liClass=this.map.get(levels[j]);
break
}}var tagLabel=this.tags[i].tag;
var tagSpan=new Element("span").update(tagLabel.escapeHTML());
var tag=new Element("li",{"class":liClass}).update(tagSpan);
if(typeof this.matchingTags[tagLabel]!="undefined"){tag.addClassName("selectable");
Event.observe(tagSpan,"click",function(event){var tag=event.element().up("li").down("span").innerHTML.unescapeHTML();
event.element().up("li").toggleClassName("selected");
if(event.element().up("li").hasClassName("selected")){self.selectedTags[tag]={}
}else{delete self.selectedTags[tag]
}self.table.tags=self.getSelectedTags();
self.table.totalRows=-1;
self.table.fetchedRows=new Array();
self.table.showRows(1,self.table.limit)
})
}if(this.selectedTags[tagLabel]!=undefined){tag.addClassName("selected")
}var self=this;
tag.appendChild(document.createTextNode(" "));
cloud.appendChild(tag)
}this.domNode.down(".xwiki-livetable-tagcloud").appendChild(cloud)
},getSelectedTags:function(){var result=new Array();
this.domNode.select("li.selected").each(function(tag){result.push(tag.down("span").innerHTML)
});
return result
},buildPopularityMap:function(tags){var totalCount=0;
var minCount=0;
var maxCount=-1;
tags.each(function(tag){totalCount+=tag.count;
if(tag.count<minCount||minCount===0){minCount=tag.count
}if(tag.count>maxCount||maxCount===-1){maxCount=tag.count
}});
var countAverage=totalCount/tags.length;
var levelsHalf=this.popularityLevels.length/2;
var firstHalfCountDelta=countAverage-minCount;
var secondHalfCountDelta=maxCount-countAverage;
var firstHalfIntervalSize=firstHalfCountDelta/levelsHalf;
var secondHalfIntervalSize=secondHalfCountDelta/levelsHalf;
var previousPopularityMax=minCount;
var intervalSize=firstHalfIntervalSize;
var halfPassed=false;
var count=0;
var currentPopularityMax;
var popularityMap=new Hash();
this.popularityLevels.each(function(level){count++;
if(count>levelsHalf&&!halfPassed){intervalSize=secondHalfIntervalSize;
halfPassed=true
}currentPopularityMax=previousPopularityMax+intervalSize;
popularityMap.set(currentPopularityMax,level);
previousPopularityMax=currentPopularityMax
});
return popularityMap
}});
if(browser.isIE6x){document.observe("xwiki:livetable:newrow",function(ev){Event.observe(ev.memo.row,"mouseover",function(event){event.element().up("tr").addClassName("rowHover")
});
Event.observe(ev.memo.row,"mouseout",function(event){event.element().up("tr").removeClassName("rowHover")
})
})
}})();