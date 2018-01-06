/**
 * 请求新闻分类列表
 */


$(document).ready(function() {
    var categoryName = "国内";
    var searchContent;
    var sort_mode = 0;
    var page = 0;
    var count = 10;


    //获取分类列表
    $("ul.category_list li a").on("click", function() {
        $(this).parent().parent().children().children().css("color", "#080808");
        $(this).css("color", "#6392C6");

        // 获取分类关键词
        categoryName = $(this).text();
        var params = {
            key_word: categoryName,
            sort_mode:sort_mode,
            page_num: page + "",
            count: count + ""
        };

        netUtil(params, GET_CATEGORY_LIST, "post", getNewsList);
    });

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
            key_word: categoryName,
            sort_mode:sort_mode,
            page_num: (index - 1) + "",
            count: count + ""
        };
        netUtil(params, GET_CATEGORY_LIST, "post", getNewsList);

    });

    //搜索新闻
    $("#search-form").submit(function() {
        searchContent = $("#search_input").val();

        var params = {
            query_text: searchContent,
            page_num: page + "",
            count: count + "",
            sort_mode: sort_mode
        };
        netUtil(params, GET_SEARCH_LIST, "post", getNewsList);

        return false;

    });

    //按照不同排序方式查询
    $("div.rank_type a").on("click", function() {
        var params = {
            query_text: searchContent,
            page_num: page + "",
            count: count + "",
            sort_mode: $(this).index()
        };
        netUtil(params, GET_SEARCH_LIST, "post", getNewsList);

    });

    queryHotNews();
    /**
     * 热点新闻推荐
     */
    function queryHotNews() {
        var params = {
            page_num: page + "",
            count: count + "",
            sort_mode: 0
        };
        netUtil(params, GET_RECOMMEND_LIST, "post", getRecommendNews);
    }

    //相似新闻查询
    var similarityIndex = 0;
    $("#news_list").on("click",".faq-icon, .faq-question", function (e) {
        similarityIndex = $(this).parent().parent().parent().index();
        var news_id = $(this).attr("title");
        var params = {
            news_id: news_id,
            count: 5 + "",
            sort_mode: 0
        };

        netUtil(params, GET_SIMILARITY_LIST, "post", getSimilarityList);

        //加载动画
        e.preventDefault();
        var $this = $(this);
        var $parent = $this.parent('.faq-item');

        if( $parent.hasClass('active') )
        {
            $parent.removeClass('active').find('.faq-answer').slideUp('slow');
        }
        else
        {
            $parent.addClass('active').find('.faq-answer').slideDown('slow');
        }
    });


    /**
     * 回调函数，解析返回的列表数据
     */
    function getNewsList(data) {
        if(data.status == "success") {
            //清除之前的数据
            $("#news_list").empty();

            var newsList = data.news_list;

            //检索时返回检索时间
            var runTime = data.run_time;
            if(runTime != null) {
                $("#search-error-container").text("本次检索耗时" + runTime);
            }

            for (var index = 0; index < newsList.length; index++) {
                generateItem(newsList[index]);
            }
        } else if(data.status == "fail") {
            //请求失败

        }
    }

    /**
     * 回调函数，解析返回的热点新闻
     * @param data
     */
    function getRecommendNews(data) {
        //向新闻列表添加数据
        getNewsList(data);

        //向热点新闻模块添加数据
        if(data.status == "success") {
            //清除之前的数据
            $("#hot_news").empty();

            var newsList = data.news_list;
            for (var index = 0; index < newsList.length; index++) {
                generateHotItem(newsList[index]);
            }
        } else if(data.status == "fail") {
            //请求失败

        }
    }

    /**
     * 回调函数，解析返回的相似新闻
     * @param data
     */
    function getSimilarityList(data) {
        if(data.status == "success") {
            //清除之前的数据
            $(".faq-answer ul").empty();

            var newsList = data.news_list;
            for (var index = 0; index < newsList.length; index++) {
                generateSimilarityNews(newsList[index]);
            }
        } else if(data.status == "fail") {
            //请求失败

        }
    }


    /**
     * 向html页面中插入新闻
     * @param item
     */
    function generateItem(item) {
        var news_id = item.news_id;
        var title = item.title;
        var newsUrl = item.url;
        var time = item.time;
        var commentNum = item.comment_num;
        var content = item.content;
        var keywords = item.keywords;
        var preview = item.preview;
        var source = item.source;

        time = time.substr(0, time.length - 3);
        keywords.join("&amp ;");
        content = content.join("");
        if(content.length > 140) {
            content = content.substr(0, 140) + "...";
        }

        //对来源网站进行中文转换
        switch(source) {
            case "wangyi": {
                source = "网易新闻";
                break;
            }
            case "sina": {
                source = "新浪新闻";
                break;
            }
            case "sohu": {
                source = "搜狐新闻";
                break;
            }
            case "cctv": {
                source = "央视新闻";
                break;
            }
            default:{
                break;
            }
        }

        var article = "<article class=\"format-standard type-post hentry clearfix\">" +
            "<header class=\"clearfix\"><h3 class=\"post-title\">" +
            "<a href=\"{0}\" target=\"_Blank\">{1}</a></h3>" +
            "<div class=\"post-meta clearfix\"><span class=\"date\">{2}</span>" +
            "<span class=\"category\"><a>{3}</a></span>" +
            "<span class=\"comments\"><a>{4} 评论</a></span>" +
            "<span class=\"source_website\">{5}</span>" +
            "</div></header>" +
            "<p title=\"{6}\">{7}</p>" +
            "<div><div class=\"faq-item\"><span class=\"faq-icon\" title=\"{8}\"></span>" +
            "<h3 class=\"faq-question\"><a>相似新闻推荐</a></h3>" +
            "<div class=\"faq-answer\"><ul></ul></div>" +
            "</div></div>";
        var articleHtml = stringFormat(article, newsUrl, title, time, keywords, commentNum, source, content, content, news_id);
        $("#news_list").append(articleHtml);
    }

    /**
     * 向html页面中插入热点新闻标题
     * @param item
     */
    function generateHotItem(item) {
        var title = item.title;
        var newsUrl = item.url;
        var time = item.time;
        time = time.substr(0, time.length - 3);
        var article = "<li class=\"article-entry image\">" +
            "<h5><a href=\"{0}\" class=\"news_title\">{1}</a></h5>" +
            "<span class=\"article-meta\">{2}</span>" +
            "</li>";
        var articleHtml = stringFormat(article, newsUrl, title, time);
        $("#hot_news").append(articleHtml);
    }

    /**
     * 向html页面中插入相似新闻标题
     * @param item
     */
    function generateSimilarityNews(item) {
        var title = item.title;
        var newsUrl = item.url;
        var article = "<li><h5><a href=\"{0}\" target=\"_Blank\">{1}</a></h5></li>";
        var articleHtml = stringFormat(article, newsUrl, title);
        $("#news_list").find("article").eq(similarityIndex).find(".faq-answer ul").append(articleHtml);
    }


});