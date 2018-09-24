// ==UserScript==
// @name     学堂在线小助手注释版
// @version    0.0.9.0
// @description  解放双手，自动播放
// @author     1xin
// @require     http://code.jquery.com/jquery-latest.js
// @noframes
// @match    *://*.xuetangx.com/courses/*/courseware/*
// @match    *://*.xuetangx.com/newcloud/dashboard*
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
        },
        addVersion:function(){
            var li_tag = $("ul.wrapper-downloads");
            var tips_Version = '';
            tips_Version += '<li class="video-tracks video-download-button">';
            tips_Version += '<a>';
            tips_Version += '<font color="blue">';
            tips_Version += '版本0.0.9.0';
            tips_Version += '</font>';
            tips_Version += '</a>';
            tips_Version += '</li>';
            if (li_tag) {
                li_tag.append(tips_Version);
            }
        }
    };
    //视频播放
    //myVideo        video DOM 对象
    //playVideo()    自动播放
    //stopVideo()    监测是否结束，到下一个视频
    //isVideoPage()  是否是视频页
    //VideoQuality()  自动切换到低清，节省流量
    //changeVideoSpeed() 自动二倍速播放，节省时间
    //changeVideoVolume() 自动静音，节省……耳朵？
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
                        autoPlayVideo.changeVideoSpeed();
                        autoPlayVideo.changeVideoVolume();
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
        changeVideoSpeed:function(){
            var speedDiv=$("div.xt_video_player_speed.xt_video_player_common.fr>ul");
            var speedButton=speedDiv.children(":first");
            speedButton.trigger("click");
        },
        changeVideoVolume:function(){
            var VolumeDiv=$("div.xt_video_player_volume");
            var VolumeButton=VolumeDiv.children(":first");
            VolumeButton.trigger("click");
        }
    };
    //一键
    //addScore() 获取所有成绩
    //addScoreTip（） 提示
    //addScoreTable（） 成绩表
    var addOneShotButton={
        addScore:function(){
            var li_tag = $("div.nav-menu > ul");
            var tips_button = '';
            tips_button += '<li id="mybutton">';
            tips_button += '<a>';
            tips_button += '<font color="red">';
            tips_button += '所有成绩';
            tips_button += '</font>';
            tips_button += '</a>';
            tips_button += '</li>';
            if (li_tag) {
                li_tag.append(tips_button);
            }
            $("#mybutton").click(function(){
                //alert(allScore.scoreArray(apiUrl.getApiUrl())[0][0]);
                //allScore.addTrTd(allScore.scoreArray(apiUrl.getApiUrl()));
                //addOneShotButton.addScoreTip();
                addOneShotButton.addScoreTable(allScore.addTrTd(allScore.scoreArray(apiUrl.getApiUrl())));
            });
        },
        addAutoPlay:function(){
            var li_tag = $("div.nav-menu > ul");
            var tips_button = '';
            tips_button += '<li>';
            tips_button += '<a>';
            tips_button += '<font color="red">';
            tips_button += '一键播放';
            tips_button += '</font>';
            tips_button += '</a>';
            tips_button += '</li>';
            if (li_tag) {
                li_tag.append(tips_button);
            }
        },
        addScoreTip:function(){
            var li_tag=$("div.row.container-search");
            var tips_button = '';
            tips_button +='<div>'
            tips_button +='<h1>提示：获取所有成绩大概需要15秒时间</h1>'
            tips_button += '</div>';
            if (li_tag) {
                li_tag. append(tips_button);
            }
        },
        addScoreTable:function(tdtr){
            var li_tag=$("div.row.container-search");
            var tips_button = '';
            tips_button +='<div class="row container-search">'
            tips_button += '<table align="center" border="5">';
            tips_button += '<tr><th><h3>课程名</h3></th><th><h3>答题总分</h3></th><th><h3><font color="red">答题得分</font></h3></th><th><h3>视频总分</h3></th><th><h3><font color="red">视频得分</font></h3></th></tr>';
            tips_button += tdtr;
            tips_button += '</table>';
            tips_button += '</div>';
            if (li_tag) {
                li_tag. after(tips_button);
            }
        }
    };
    //将所有课程成绩构成数组
    //scoreArray()  返回所有课程成绩构成的数组
    //addTrTd()     将数组构成表格
    var allScore={
        scoreArray:function(apiArray){
            var allScoreArray=new Array;
            for(var i=0;i<apiArray.length ;i++){
                allScoreArray.push(scoreJson.getScoreArray(apiUrl.getApiUrl()[i]));
            }
            return allScoreArray
        },
        addTrTd:function(allScoreArray){
            var stringTrTd='';
            for(var i=0;i<allScoreArray.length;i++){
                stringTrTd+="<tr>";
                for(var j=0;j<allScoreArray[0].length;j++){
                    stringTrTd+="<td";
                    if(j>0){
                        stringTrTd+=" align='right' ";
                    }
                    stringTrTd+=">";
                    stringTrTd+=allScoreArray[i][j];
                    stringTrTd+="</td>";
                }
                stringTrTd+="</tr>";
            }
            //alert(stringTrTd);
            return stringTrTd
        }
    }
    //课程成绩对象
    //getScoreJson()  获取成绩json
    //ecodeJson()     解析json
    //getScoreArray() 返回单个科目成绩数组
    var scoreJson={
        htmlobj:null,//成绩的json数据
        //
        course_name:null,//课程名
        homeworkTotal:null,//题目总分
        homeworkScore:null,//题目得分
        videoTotal:null,//视频总分
        videoScore:null,//视频总分
        //利用ajax获取课程成绩
        getScoreJson:function(scoreUrl){
            this.htmlobj=$.ajax({
                url:scoreUrl,
                async:false
            });
        },
        //解析返回json
        decodeJson:function(){
            //alert(this.htmlobj.responseText);
            var jsonData=JSON.parse(this.htmlobj.responseText);
            this.course_name=jsonData.course_name;
            this.homeworkTotal=jsonData.progress_items[0].total;
            this.homeworkScore=jsonData.progress_items[0].score;
            this.videoTotal=jsonData.progress_items[1].total;
            this.videoScore=jsonData.progress_items[1].score;
            //alert(this.course_name+this.homeworkTotal+this.homeworkScore+this.videoTotal+this.videoScore);
        },
        //返回成绩数组
        getScoreArray:function(scoreUrl){
            var scoreArr = new Array;
            this.getScoreJson(scoreUrl);
            this.decodeJson();
            scoreArr[0]=this.course_name;
            scoreArr[1]=this.homeworkTotal;
            scoreArr[2]=this.homeworkScore;
            scoreArr[3]=this.videoTotal;
            scoreArr[4]=this.videoScore;
            return scoreArr;
        }
    };
    //获取每个课程成绩的api序号
    //getApiUrl()返回所有课程成绩api地址
    //Array  序号api地址
    //
    //
    var apiUrl={
        getApiUrl:function(){
            var valArr = new Array;
            var url=$("li.item-score > div > span > a").each(function(i){
                 valArr[i] = "/newcloud/api/course_score/"+$(this).attr("href").split("termcourse_id=")[1]+"/";
             });
            var priv = valArr.join(',');
            //alert(valArr[1]);
            return valArr;
             //url.css("background-color","red");
            //alert(url.attr("href"));
        }
    };
    var videoSite = window.location.href;
    var reVideo = /courses/i;
    var reScore = /newcloud/i;
    //视频页
    if(reVideo.test(videoSite)){
        autoPlayVideo.playVideo();
        var t=getNextVideoUrl.getUrl();
        addNextButton.addButton(t);
        addNextButton.addTips();
        addNextButton.addVersion();
    }
    //成绩页
    if(reScore.test(videoSite)){
        setTimeout(function(){
                addOneShotButton.addScore();
                //addOneShotButton.addAutoPlay();
                addOneShotButton.addScoreTip()
                //addOneShotButton.addScoreTable();
                //scoreJson.decodeJson();
            },1000)
    }

})();
