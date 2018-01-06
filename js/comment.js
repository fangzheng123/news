/**
 * 获取新闻评论
 */

$(document).ready(function() {

    var search = window.location.search;
    var newsId = search.substr(1, search.length);
    var page = 0;
    var count = 20;

    var params = {
        news_id: newsId,
        page_num: page + "",
        count: count + ""
    };

    netUtil(params, GET_COMMENT_LIST, "post", getCommentList);

    //翻页
    $("#pagination a").on("click", function() {
        var indexStr = $(this).text();
        var activeIndex = ($(this).parent().children(".active").index());

        var index;
        if(indexStr != "下一页") {
            index = parseInt(indexStr);
        } else if(activeIndex == 4){
            index = 5;
        } else {
            index = activeIndex + 2;
        }
        $(this).parent().children().removeClass("active");
        $(this).parent().children("a").eq(index-1).addClass("active");

        var params = {
            news_id: newsId,
            page_num: (index - 1) + "",
            count: count + ""
        };

        netUtil(params, GET_COMMENT_LIST, "post", getCommentList);

    });

    /**
     * 回调函数，解析返回的列表数据
     */
    function getCommentList(data) {
        if(data.status == "success") {
            //清除之前的数据
            $("#news_list").empty();

            var commentList = data.comments;

            for (var index = 0; index < commentList.length; index++) {
                generateItem(commentList[index]);
            }
        } else if(data.status == "fail") {
            //请求失败

        }
    }

    /**
     * 向html页面中插入评论
     * @param item
     */
    function generateItem(item) {
        var time = item.comment_time;
        var tag = item.tag;
        var content = item.comment_content;

        //褒贬分析进行转换
        switch(tag) {
            case "Other": {
                tag = "中性";
                break;
            }
            case "Negtive": {
                tag = "贬义";
                break;
            }
            case "Positive": {
                tag = "褒义";
                break;
            }
            default:{
                break;
            }
        }

        time = time.substr(0, time.length - 3);

        var article = "<article class=\"format-standard type-post hentry clearfix\">" +
            "<header class=\"clearfix\">" +
            "<div class=\"post-meta clearfix\"><span class=\"date\">{0}</span>" +
            "<span class=\"comment_like\">{1}</span>" +
            "</div></header>" +
            "<p class=\"comment_content\">{2}</p></article>";
        var articleHtml = stringFormat(article, time, tag, content);
        $("#news_list").append(articleHtml);

    }

});