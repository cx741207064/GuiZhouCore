<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Video.aspx.cs" Inherits="JlueTaxSystemBeiJing.Vedio.Vedio" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,8" />
    <title></title>
    <link href="css/video.css" rel="stylesheet" />
    <script src="js/jquery-1.12.4.min.js"></script>
    <script src="../js/jquery.cookie.js"></script>
    <script src="js/video.js"></script>
    <script src="../js/common.js"></script>
    <script src="../js/dump_src.js"></script>
    <script src="../js/database.js"></script>
    <script src='//player.polyv.net/script/polyvplayer.min.js'></script>
</head>
<body>
    <script>
        var CourseId = getQueryString("CourseId");
        var VideoID = getQueryString("VideoID");
        var Id = getQueryString("Id");
        var ClassId = getQueryString("ClassId");
        var userId = getQueryString("userId");
        var model = getQueryString("model");
        var json;
        function video(VideoID, Name, Description, obj) {
            $("#title").text(Name + ":" + Description);
            if ($(obj).hasClass('video_item_active')) return false;
            $('div.video_item_active').removeClass('video_item_active');
            $('div#V' + VideoID).addClass('video_item_active');
            $("#videomain").empty();
            var selectVideo;
            if (model == 0) {
                selectVideo = VideoID.split(',')[0];
            }
            if (model == 1) {
                selectVideo = VideoID.split(',')[1];
            }
            var h = "<div id='plv_" + selectVideo + "'></div><script>var player = polyvObject('#plv_" + selectVideo + "').videoPlayer({'height': '600px','width':'970px','vid': '" + selectVideo + "','session_id': 'TEST_POLYV'});<\/script>";
            $("#videomain").append(h);
            //if (obj) {
            //    $("div.video_item_active").removeClass("video_item_active");
            //    $(obj).addClass("video_item_active");
            //}
        }
        $(document).ready(function () {
            var selectedName;
            var selectedDescription;
            $("#VideoName").text(model == 0 ? "国税" : "地税");
            $.ajax(
             {
                 url: '<%=System.Web.Configuration.WebConfigurationManager.AppSettings["tikupath"]%>' + GetUserQuestion,
                     type: "post",
                     dataType: "jsonp",
                     data:
                              {
                                  classid: ClassId,
                                  userid: userId,
                                  questionid: Id
                              },
                     async: false,
                     success: function (result) {
                         json = JSON.parse("["+result.Data+"]");
                         $("#divcourse").empty();
                         $.each(json, function (i, v) {
                             var videocheck;
                             if (model == 0) {
                                 videocheck = v.VideoID.split(',')[0];
                             }
                             if (model == 1) {
                                 videocheck = v.VideoID.split(',')[1];
                             }
                             $("#hidVedio").val($("#hidVedio").val() + v.Name + "@" + v.Description + "@" + videocheck + ",");
                             var bb;
                             if (v.QuestionId == Id) {
                                 bb = "<div class='video_item video_item_active' id='V" + videocheck + "'  onclick='javscript:video(\"" + v.VideoID + "\",\"" + v.Name + "\",\"" + v.Description + "\",this);'>" + v.Name + ":" + v.Description + "</div>";
                                 $("#title").text(v.Name + ":" + v.Description);
                                 selectedName = v.Name
                                 selectedDescription = v.Description;
                             }
                             else {
                                 bb = "<div class='video_item' id='V" + videocheck + "' onclick='javscript:video(\"" + v.VideoID + "\",\"" + v.Name + "\",\"" + v.Description + "\",this);'>" + v.Name + ":" + v.Description + "</div>";
                             }
                             $("#divcourse").append(bb);
                             
                         });
                     },
                     error: function (xhr, textStatus) {

                     }
                 }
               );
            if (VideoID != "") {
                video(VideoID, selectedName, selectedDescription);
            }
        });

        function s2j_onPlayOver() {
            var nav = false;
            $('div.video_item').each(function (i) {
                if ($(this).hasClass('video_item_active')) {
                    nav = true;
                    return true;
                }
                if (nav) {
                    $(this).click();
                    return false;
                }
            });
        }
    </script>
    <div class="outer">
        <div class="title_bar">
            <div class="video_title" id="title">
            </div>
            <div class="video_class">
                <span class="class_name" id="VideoName">国税地税</span>
                <span class="class_type">(视频讲解)</span>
            </div>
        </div>
        <div class="video_body">
            <div class="video_main_area">
                <div class="video_player">
                    <div class="video_form" id="videomain">
                    </div>

                </div>
                <div class="video_menu_area">
                    <div class="video_menu_bg"></div>
                    <div class="video_menu_name">课程目录</div>
                    <div class="video_float_btn" id="video_float_btn"></div>
                    <div class="video_menu_list" id="divcourse">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="hidVedio" style="display: none"></div>
</body>
</html>
