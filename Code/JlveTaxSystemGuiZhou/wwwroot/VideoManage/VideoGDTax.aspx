<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="VideoGDTax.aspx.cs" Inherits="JlueTaxSystemBeiJing.VideoManage.VideoGDTax" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="/VideoManage/videostyle/video.css" rel="stylesheet">
    <script src="/VideoManage/videostyle/jquery-1.8.0.min.js"></script>
    <script src="/VideoManage/videostyle/video.js"></script>
    <script src="/VideoManage/videostyle/memcachecheck.js"></script>
    <script src="/VideoManage/videostyle/polyvplayer.min.js"></script>
    <script src="../js/common.js"></script>
    <script src="../js/dump_src.js"></script>
    <script src="../js/database.js"></script>
    <style type="text/css"></style>
    <script type="text/javascript">
        var CourseId = getQueryString("CourseId");
        var VideoID = getQueryString("VideoID");
        var Id = getQueryString("Id");
        $(function () {
            $.ajax(
             {
                 url: "GetVideo.ashx?CourseId=" + CourseId,
                 type: "GET",
                 dataType: "text",
                 async: false,
                 success: function (result) {
                     json = JSON.parse(JSON.parse(result).Data);
                     var IdSTR;
                     $.each(json, function (i, v) {                         
                         if (v.VideoID != null && v.VideoID != "") {
                             IdSTR +=v.Id+"|"+ v.VideoID + ",";
                             if (v.TaxType == "0") {
                                 var gtxstr = '<li id="' + v.Id + '" class=""><a href="/VideoManage/VideoGDTax.aspx?VideoID=' + v.VideoID + '&Id=' + v.Id + '&CourseId=' + CourseId + '">' + v.VideoName + '</a></li>';
                                 $("#gtxul").append(gtxstr);
                             }
                             if (v.TaxType == "1") {
                                 var dtxstr = '<li id="' + v.Id + '" class=""><a href="/VideoManage/VideoGDTax.aspx?VideoID=' + v.VideoID + '&Id=' + v.Id + '&CourseId=' + CourseId + '">' + v.VideoName + '</a></li>';
                                 $("#dtxul").append(dtxstr);
                             }                            
                         }
                     });
                     $("#hidvalue").val(IdSTR);
                 },
                 error: function (xhr, textStatus) {
                 }
             }
               );
            //添加选中视频点击
            var bb = '<div id="plv_' + VideoID + '">';
            bb += '<object type="application/x-shockwave-flash" data="/VideoManage/videostyle/player.swf" id="' + VideoID + '" width="970" height="546" class="polyvFlashObject">';
            bb += '<param name="allowScriptAccess" value="always">';
            bb += '<param name="allowFullScreen" value="true">';
            bb += '<param name="quality" value="high">';
            bb += '<param name="bgcolor" value="#ffffff">';
            bb += '<param name="wmode" value="transparent">';
            bb += '<param name="flashvars" value="vid=' + VideoID + '&amp;start=-1&amp;end=-1&amp;"></object>';
            bb += '<script>';
            bb += 'var player = polyvObject(\'#plv_'+VideoID+'\').videoPlayer({\'width\': \'970\',\'height\': \'546\',\'vid\': \''+VideoID+'\' });<\/script>';
            $("#playdiv").append(bb);
        });


        $(function () {
            //一开始直接隐藏菜单
            $(".content").hide();
            //给标题添加点击事件
            $(".video_tt").click(function () {
                //当点击的时候,打开菜单,同时其他的菜单隐藏
                $(this).next().slideDown().parent().siblings().children(".content").slideUp();
                $(this).removeClass("video_tt");
                $(this).addClass("video_tt_active");
                $(this).parent().siblings().children(".video_tt_active").removeClass("video_tt_active").addClass("video_tt");
            })//.first().next().slideDown();//默认之后第一个菜单打开
        });

        $(function () {

            var vidid = $('#' + Id);
            vidid.addClass("item_play");
            vidid.parent().parent().show();
            vidid.parent().parent().prev().removeClass("video_tt");
            vidid.parent().parent().prev().addClass("video_tt_active");
            vidid.parent().parent().parent().siblings().children(".video_tt_active").removeClass("video_tt_active").addClass("video_tt");
        })

        $(function () {
            var str = $("#hidvalue").val();

            var vid = VideoID;
            var newstr = str.substring(str.indexOf(vid) + 35, str.length - 1);
            if (newstr.length < 10) {
                $("#hidvalue").val("");

            }
            else {
                $("#hidvalue").val(newstr);

            }
        })

        function s2j_onPlayOver() {

            var hidvalue = $("#hidvalue").val();
            var arry = hidvalue.split(",");
            if (arry[0] != "") {
                $("#hidvalue").val(hidvalue.substring(hidvalue.indexOf(hidvalue) + 35, hidvalue.length));
                //player.changeVid("" + arry[0] + "");
                
                window.location.href = "/VideoManage/VideoGDTax.aspx?VideoID=" + arry[0].split("|")[1] + "&Id=" + arry[0].split("|")[0] + "&CourseId=" + CourseId;
            }
            else {
                alert("已经播放到最后一集！");
            }
        }
    </script>
</head>
<body>

    <div class="outer">

        <div class="video_body">
            <div class="video_main_area">
                <div class="video_player" style="width: 1600px;">
                    <div style="margin: 25px auto; text-align: center;" id="playdiv">
                        <%--<div id="plv_246bb7e7a45f4deee77d3e0ed392828e_2">
                            <object type="application/x-shockwave-flash" data="/VideoManage/videostyle/player.swf" id="246bb7e7a45f4deee77d3e0ed392828e_2" width="970" height="546" class="polyvFlashObject">
                                <param name="allowScriptAccess" value="always">
                                <param name="allowFullScreen" value="true">
                                <param name="quality" value="high">
                                <param name="bgcolor" value="#ffffff">
                                <param name="wmode" value="transparent">
                                <param name="flashvars" value="vid=246bb7e7a45f4deee77d3e0ed392828e_2&amp;start=-1&amp;end=-1&amp;">
                            </object>
                        </div>
                        <script>
                            var player = polyvObject('#plv_246bb7e7a45f4deee77d3e0ed392828e_2').videoPlayer({
                                'width': '970',
                                'height': '546',
                                'vid': '246bb7e7a45f4deee77d3e0ed392828e_2'
                            });
                        </script>--%>



                    </div>

                </div>
                <div class="video_menu_area">
                    <div class="video_menu_bg"></div>
                    <div class="video_menu_name">视频目录</div>
                    <div class="video_float_btn" id="video_float_btn"></div>
                    <div class="video_menu_list">

                        <ul class="video_menu">
                            <li class="video_tt ">纳税视频</li>
                            <li class="content" style="display: none;">
                                <ul class="video_item" id="gtxul">
<%--                                    <li id="4" class=""><a href="/VideoManage/VideoGDTax.aspx?VideoID=246bb7e7a45f4deee77d3e0ed392828e_2&Id=4&CourseId=111">第二节 增值税附加</a></li>
                                    <li id="7" class=""><a href="/VideoManage/VideoGDTax.aspx?VideoID=246bb7e7a4ee61e8b791d5e6bc883cec_2&Id=7&CourseId=111">第三节 增值税实操讲解</a></li>--%>
                                </ul>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <input type="hidden" id="hidvalue" width="500" height="120" value="">
</body>
</html>
