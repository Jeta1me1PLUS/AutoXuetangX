// ==UserScript==
// @name     学堂在线小助手注释版
// @version    0.0.8.1
// @description  解放双手，自动播放
// @author     1xin
// @require     http://code.jquery.com/jquery-latest.js
// @noframes
// @match    *://*.xuetangx.com/courses/*/courseware/*
// @grant    GM_addStyle
// @grant    GM.getValue
// @namespace https://greasyfork.org/users/183871
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
    //addTips()提示信息
    var addNextButton={
        addButton:function(next_video_url){
            var next_btn_html = '';
            next_btn_html +='<li class="video-tracks video-download-button">';
            next_btn_html += '<a href="';
            next_btn_html +=next_video_url;
            next_btn_html += '">';
            next_btn_html += '跳转到下一个视频';
            next_btn_html += '</a>';
            next_btn_html +='</li>';
            //增加下一个视频按钮
            var ul_tag = $("ul.wrapper-downloads");
            if (ul_tag) {
                ul_tag.append(next_btn_html);
            }
        },
        toNextButton:function(){
            if(getNextVideoUrl.getUrl()!=false){
                window.location.href=getNextVideoUrl.getUrl();
            }else{
                return 0;
            }
        },
        addTips:function(){
            var li_tag = $("ul.wrapper-downloads");
            var tips_button = '';
            tips_button += '<li class="video-tracks video-download-button">';
            tips_button += '<a>';
            tips_button += '<font color="red">';
            tips_button += '再次强调：答题时请关掉脚本！！';
            tips_button += '</font>';
            tips_button += '</a>';
            tips_button += '</li>';
            if (li_tag) {
                li_tag.append(tips_button);
            }
        }
    };
    //视频播放
    //myVideo        video DOM 对象
    //playVideo()    自动播放
    //stopVideo()    监测是否结束，到下一个视频
    //isVideoPage()  是否是视频页
    //VideoQuality()  自动切换到低清，节省流量
    //changeVideospeed() 自动二倍速播放，节省时间
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
                        //autoPlayVideo.myVideo.play();
                        autoPlayVideo.changeVideoQuality();
                        autoPlayVideo.changeVideospeed();
                        autoPlayVideo.stopVideo();
						$("div.xt_video_player_volume").children().click();
                    }
                    catch(e)
                    {
                        //location.reload();
                        autoPlayVideo.myVideo.play();
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
        },
        changeVideoQuality:function(){
            var qualityDiv=$("div.xt_video_player_quality.xt_video_player_common.fr>ul");
            var qualityButton=qualityDiv.children(":last");
            qualityButton.trigger("click");
        },
        changeVideospeed:function(){
            var speedDiv=$("div.xt_video_player_speed.xt_video_player_common.fr>ul");
            var speedButton=speedDiv.children(":first");
            speedButton.trigger("click");
        }
    };
    autoPlayVideo.playVideo();
    var t=getNextVideoUrl.getUrl();
    addNextButton.addButton(t);
    addNextButton.addTips();
})();
