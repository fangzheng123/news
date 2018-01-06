/**
 * Created by john on 2015/12/1.
 */
/**
 *
 * @param params 传递的参数
 * @param netUrl 请求的url
 * @param requestType  提交方式
 * @param callback 回调函数
 */

//用ajax提交数据
function netUtil(params, netUrl, requestType, callback) {

    $.ajax({
        url: netUrl,
        data:params,
        dataType:"json",      //指定返回时对象为json
        type:requestType,
        timeout:10000,
        success:function(data){
            callback(data);
        },
        error:function(data) {

        }

    });

}

//字符串格式化
function stringFormat() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}