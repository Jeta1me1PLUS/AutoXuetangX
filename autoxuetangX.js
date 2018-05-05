// ==UserScript==
// @name     学堂在线小助手注释版
// @version    0.0.7
// @description  解放双手，自动播放
// @author     1xin.1
// require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @noframes
// @match    *://*.xuetangx.com/courses/*/courseware/*
// @grant    GM_addStyle
// @grant    GM.getValue
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#next_video_btn{color:#fa7d3c;}');
    //获取下一个视频地址
    //getUrl()获取下一个视频地址
    var getNextVideoUrl = {
        getUrl:function(){
            var next_video,next_video_url,next_unit,next_unit_ul;
            var active_video=$("li.active ");
            if (active_video.next().length > 0 ) {
                next_video=active_video.next().find("a");
                next_video_url=next_video.attr('href');
            }else{
                next_unit=$("div.chapter.is-open").next();
                if(next_unit.length>0){
                    next_unit_ul=next_unit.find('ul').children(":first").find("a");
                    next_video_url=next_unit_ul.attr('href');
                }else{
                    return false;
                }
            }
            return next_video_url;
        }
    };

    //增加下一个按钮，防止程序出错
    //addNextButton()增加下一个视频按钮
    //toNextButton()转到下一个视频地址
    var addNextButton={
        addButton:function(next_video_url){
            var next_btn_html = '<li class="tonextvideo">';
            next_btn_html += '<a href="';
            next_btn_html +=next_video_url;
            next_btn_html += '">';
            next_btn_html += '<span class="sr">下一个视频</span>Next';
            next_btn_html += '</a>';
            next_btn_html += '</li>';
            //增加下一个视频按钮
            var ul_tag = $("nav.sequence-bottom>ul");
            if (ul_tag) {
                ul_tag.addClass("nextvideo").append(next_btn_html);
            }
        },
        toNextButton:function(){
            if(getNextVideoUrl.getUrl()!=false){
                window.location.href=getNextVideoUrl.getUrl();
            }else{
                return 0;
            }
        }
    };
    //视频播放
    //myVideo        video DOM 对象
    //playVideo()    自动播放
    //stopVideo()    监测是否结束，到下一个视频
    //isVideoPage()  是否是视频页
    var autoPlayVideo={
        myVideo:null,
        playVideo:function(){
            setTimeout(function(){
                var m=autoPlayVideo.isVideoPage();
                //alert(m);
                if(m){
                    try
                    {
                        autoPlayVideo.myVideo = document.getElementsByTagName('video')[0];
                        autoPlayVideo.myVideo.play();
                        autoPlayVideo.stopVideo();
                    }
                    catch(e)
                    {
                        location.reload();
                    }
                }else{
                    addNextButton.toNextButton();
                }
            },2000);
        },
        stopVideo:function(){
            this.myVideo.addEventListener('ended',function(){
            //alert('stop');
            addNextButton.toNextButton();
            });
        },
        isVideoPage:function(){
            if(document.getElementsByTagName('video').length > 0){
                return true;
            }else{
                return false;
            }
        }
    };
    autoPlayVideo.playVideo();
    var t=getNextVideoUrl.getUrl();
    addNextButton.addButton(t);
})();