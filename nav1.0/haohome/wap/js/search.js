var Search=function(){this.header=$(".header");this.inputText=this.header.find(".search-input");
this.closeBtn=this.header.find(".close-btn");this.searchBtn=this.header.find(".search-btn");
this.searchSpan=this.searchBtn.find("span");this.baiduSearchBtn=this.searchBtn.find(".baidu-search");
this.biyingSearchBtn=this.searchBtn.find(".biying-search");this.sougouSearchBtn=this.searchBtn.find(".sougou-search");
this.haosouSearchBtn=this.searchBtn.find(".haosou-search");this.init()};
Search.prototype={init:function(){if(localStorage.getItem("curWebsites")){var curSites=localStorage.getItem("curWebsites");
for(var i=0;i<this.searchSpan.length;i++){var curSpanSite=this.searchSpan.eq(i).attr("site");
if(curSpanSite==curSites){this.searchSpan.eq(i).addClass("active")}}}else{this.searchSpan.eq(0).addClass("active");
localStorage.setItem("curWebsites","https://www.baidu.com/s?wd=guanjian")}this.bindEvents();this.enterSearch()},
bindEvents:function(){var that=this;var searchSites=this.searchSpan;
for(var i=0;i<searchSites.length;i++){$(searchSites[i]).on("tap",function(){var site=$(this).attr("site");
localStorage.setItem("curWebsites",site);searchSites.removeClass("active");$(this).addClass("active");
that.clickSearchBtn(this,site)})}this.closeBtn.on("tap",function(){that.inputText.val("");that.inputText.focus()})},
clickSearchBtn:function(ele,site){var $ele=$(ele);
var btnValue=$ele.html();var searchWords=this.inputText.val();if(searchWords==""){this.inputText.focus();
this.inputText.attr("placeholder",btnValue+"- 请输入搜索词")}else{this.openWindow(searchWords,site)}},
openWindow:function(keyWords,sitesInfo){var sitesInfos=sitesInfo;var curkeyWords=keyWords;
var reg=/BIANMA/g;if(reg.test(sitesInfos)){curkeyWords=encode(keyWords);sitesInfos=sitesInfos.replace("BIANMA","");
sitesInfos=sitesInfos.replace("guanjian",curkeyWords);window.open(sitesInfos)}else{sitesInfos=sitesInfos.replace("guanjian",curkeyWords);
window.open(sitesInfos)}},enterSearch:function(){var that=this;$(document).on("keydown",function(event){var keywords=that.inputText.val();
var cursite=localStorage.getItem("curWebsites");
if(event.keyCode=="13"){if(keywords==""){that.inputText.attr("placeholder","请输入搜索内容")}
else{that.openWindow(keywords,cursite)}}})}};var search=new Search();