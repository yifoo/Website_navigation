$(function() {
    $("#biyedabian").click(function() {
        var hover_con;
        hover(".hover_con");
    })

    $(".search_btn").click(function() {
        hover(".index_open");
    });

    function hover(className) {
        var _left = ($(window).width() - $(className).width()) / 2;
        var _top = ($(window).height() - $(className).height()) / 2;
        $("body").append($("<div class='hover'></div>"));
        $(".hover").width($(document).width()).height($(document).height()).click(function() {
            $(this).hide();
            $(className).hide();
        });
        $(className).css({
            left: _left,
            top: _top
        });
        $(className).fadeIn();
        $(".close,.btn_alert").click(function() {
            $(".hover").hide();
            $(className).hide();
        });
    }

    $(".no_alert,.close").click(function() {
        $.cookie("index_open","yes",{expires:15});
    });
    $(".next_alert").click(function() {
        $.cookie("index_open",null);
    });

    //打开首页提示框
/*    if ($.cookie("index_open")==null || $.cookie("index_open")=="null") {
        hover(".index_open");
    }*/

})