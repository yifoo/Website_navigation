$(function(){

    $("#input_text").focus();

    var _indList = new Array(
        ["百度搜索","谷歌搜索","健康搜","购物搜索", "职位搜索","http://www.baidu.com/s?wd=","https://gfsoso.8090st.com/webhp?hl=zh-CN#hl=zh-CN&q=","http://so.39.net/s?words=", "http://gouwu.sogou.com/shop?query=","http://cn.indeed.com/工作?q="], 
        ["微信搜索","知乎搜索","果壳搜索","贴吧搜索","微博搜索","http://weixin.sogou.com/weixin?p=41351200&type=2&query=","http://zhihu.sogou.com/zhihu?ie=utf8&query=","http://www.guokr.com/search/all/?wd=","http://tieba.baidu.com/f?ie=utf-8&kw=","微博搜索"], 
		["百度搜图","搜狗搜图","高清大图" ,"千图网","","http://image.baidu.com/search/index?tn=baiduimage&word=","http://pic.sogou.com/pics?query=","https://pixabay.com/zh/photos/?q=",""],
		["电影首发","特百度","BT樱桃","胖次搜索", "西林街","电影首发站", "http://www.tebaidu.com/search.asp?r=0&wd=","http://www.btcherry.org/search?keyword=","http://www.panc.cc/s/","http://www.xilinjie.com/s?q=",],
        ["QQ音乐","网易云音乐", "虾米音乐","LRC歌词","音悦台MV", "http://y.qq.com/portal/search.html#t=song&w=","http://music.163.com/#/search/m/?s=","http://www.xiami.com/search?key=","歌词搜索","http://so.yinyuetai.com/mv?keyword="],
        ["吾爱破解","ZD423","PC6", "","","吾爱破解","http://www.zdfans.com/?s=","http://s.pc6.com/cse/search?s=12026392560237532321&q="],  
        ["百度学术" ,"谷歌学术","Pubmed","化工搜索","知网知识","http://xueshu.baidu.com/s?wd=","https://ggso.in/scholar?q=","http://www.medlive.cn/pubmed/pubmed_search.do?q=","化工搜索","知网搜索"], 
        ["佰腾专利","Soopat","","","","http://so.baiten.cn/results?q=","http://www.soopat.com/Home/Result?searchword="],
        ["百度文库","360DOC","Kindle书","","","http://wenku.baidu.com/search?word=","http://www.360doc.com/search.html?type=0&word=","http://www.zoudupai.com/book/share?kw="],
		["美食杰","美食天下", "花瓣", "" ,  "" , "http://so.meishi.cc/?q=","http://home.meishichina.com/search/","http://huaban.com/search/?q="],
        ["搜狗素材" ,"ZCOOL搜", "搜素材", "求字体","","搜狗素材","http://sucai.zcool.com.cn/search.do?k=","http://so.ui001.com/index.php?keys=","http://www.qiuziti.com/fontlist.aspx?fn="]
        	
		);

    var _usrslt = 0;
    $("span[id$='search']").click(function() {  
        $("span[id$='search']").attr("class", "");
        $(this).attr("class", "active");

        _usrslt = $(this).attr("num");

        for (var i = 0; i < $("span[id$='search']").length; i++) {  //设置cookie
            $.cookie(i,null);
        }
        $.cookie(_usrslt,"true",{expires:30});

        for (var i = 0; i < 5; i++) { 
            var searchBtni= "#searchBtn" + i;
            $(searchBtni).attr('num', _usrslt*10+10+i);
            if (_indList[_usrslt][i] == "") {
                $(searchBtni).hide()  
            } else {
                $(searchBtni).show();
                $(searchBtni).html(_indList[_usrslt][i]) 
            }
        }

        $("#input_text").focus().attr('placeholder', $(this).attr('title'));

        for (var i = 0; i < 10; i++) {
          if (_usrslt==i) {
            for (var j = _usrslt*10+10; j < _usrslt*10+10+5; j++) {
              if ($.cookie(''+j)=="true") {
                  $("#searchBtn"+(j-i*10-10)).addClass('active').siblings().removeClass("active");
              }
            }
          }
        } 
    });

    function HTMLDeCode(str) {
        var s = "";
        if (str.length == 0) {
            return ""
        }
        s = str.replace("&", "%26");
        return s
    }
     /* usrslt为标题num数值，idstr第一位是5，第二位是6，第三位7，依次。。。 */
    function openTag(_idstr, _srhstr) {  //_usrslt分类；_idstr数组中的网址；_srhstr内容
        _srhstr = encodeURI(_srhstr);
        if (_idstr==9&_usrslt==1){  //微博搜索
            _indList[_usrslt][_idstr]="http://s.weibo.com/weibo/"+ HTMLDeCode(_srhstr) +"&Refer=index";
            window.open(_indList[_usrslt][_idstr], "_blank")
		}else if(_idstr==8&_usrslt==2){  //千图网
            _indList[_usrslt][_idstr]="http://www.58pic.com/tupian/0-0-0-default-0-0-"+ HTMLDeCode(_srhstr) +"-0-.html?";
            window.open(_indList[_usrslt][_idstr], "_blank")
        }else if(_idstr==5&_usrslt==3){  //电影首发站
            _indList[_usrslt][_idstr]="http://www.dysfz.net/key/"+ HTMLDeCode(_srhstr) +"/";
            window.open(_indList[_usrslt][_idstr], "_blank")
        }else if(_idstr==8&_usrslt==4){  //LRC歌词
            _indList[_usrslt][_idstr]="http://www.lrc123.com/?keyword="+ HTMLDeCode(_srhstr) +"&field=all";
            window.open(_indList[_usrslt][_idstr], "_blank")			
        }else if(_idstr==5&_usrslt==5){  //吾爱破解
            _indList[_usrslt][_idstr]="http://so.52pojie.cn/cse/search?q="+ HTMLDeCode(_srhstr) +"&click=1&s=14525262514411293706";
            window.open(_indList[_usrslt][_idstr], "_blank")  
        }else if(_idstr==8&_usrslt==6){  //化工搜索
            _indList[_usrslt][_idstr]="http://www.anychem.com/dict/search/"+ HTMLDeCode(_srhstr) +"/";
            window.open(_indList[_usrslt][_idstr], "_blank")
		}else if(_idstr==9&_usrslt==6) {  //知网搜索
            _indList[_usrslt][_idstr]="http://search.cnki.com.cn/search.aspx?q=qw:"+ HTMLDeCode(_srhstr) +"&cluster=all&val=&p=0";
            window.open(_indList[_usrslt][_idstr], "_blank")			
        }else if(_idstr==7&_usrslt==9){  //西林街
            _indList[_usrslt][_idstr]="http://www.xilinjie.com/s?q="+ HTMLDeCode(_srhstr) +"&ft=ALL";
            window.open(_indList[_usrslt][_idstr], "_blank") 
        }else if(_idstr==5&_usrslt==10){  //搜狗素材
            _indList[_usrslt][_idstr]="http://www.sogou.com/web?query="+ HTMLDeCode(_srhstr) +"&_asf=www.sogou.com&_ast=1470659310&w=01029901&interation=196629&chuidq=21&ie=utf8&p=40040100&sut=1162&sst0=1470659310191";
            window.open(_indList[_usrslt][_idstr], "_blank")			
        }else{
            window.open(_indList[_usrslt][_idstr] + HTMLDeCode(_srhstr), "_blank")
        }
    }

    $("button[id^='searchBtn']").click(function() {
        $(this).addClass('active').siblings().removeClass("active");
        var _idstr = $(this).attr("id"); 
        var _srhstr = $("#input_text").val(); 
        _idstr = parseInt(_idstr.charAt(_idstr.length - 1)) + $("button[id^='searchBtn']").length; 

        if (!_srhstr=="") {
            openTag(_idstr, _srhstr)
        }else{
            $("#input_text").attr('placeholder', '输入搜索内容');
            $("#input_text").focus();
        }

        btn_num = $(this).attr("num");

        for (var i = 0; i < 10; i++) {
          if (_usrslt==i) {
            for (var j = _usrslt*10+10; j < _usrslt*10+10+5; j++) {
              $.cookie(j,null);
            }
          }
        }
        
        $.cookie(btn_num,"true",{expires:30});
    });


    $(document).keydown(function(event) {

          var opennum=5;
            for (var i = 0; i < 10; i++) {
              if (_usrslt==i) {
                for (var j = 0; j < 5; j++) {
                  if ($.cookie(''+(_usrslt*10+10+j))=="true") {
                   opennum=j+5;
                  }
                }
              }
            } 
            
        if (event.keyCode == 13) {
            console.log(opennum);
            var _srhstr = $("#input_text").val();
            if (_srhstr != "") {
                openTag(opennum,_srhstr)
            }else{
                $("#input_text").attr('placeholder', '这里输入搜索内容');
                $("#input_text").focus();
            }
        }
    });

    // 读取分类cookie
    if ($.cookie("0")=="true") {
        $("#wangyesearch").trigger("click");
	  }else if($.cookie("1")=="true"){
        $("#ideasearch").trigger("click");
      }else if($.cookie("2")=="true"){
        $("#imagesearch").trigger("click");
      }else if($.cookie("3")=="true"){
        $("#moviesearch").trigger("click");
	  }else if($.cookie("4")=="true"){
        $("#musicsearch").trigger("click");
	  }else if($.cookie("5")=="true"){
        $("#softsearch").trigger("click");
	  }else if($.cookie("6")=="true"){
        $("#acsearch").trigger("click");
	  }else if($.cookie("7")=="true"){
        $("#patentsearch").trigger("click");
	  }else if($.cookie("8")=="true"){
        $("#libsearch").trigger("click");	
      }else if($.cookie("9")=="true"){
        $("#lifesearch").trigger("click");
      }else if($.cookie("10")=="true"){
        $("#sucaisearch").trigger("click");
      }

})






