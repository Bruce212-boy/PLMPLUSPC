//#region 本地
var api_yuming = "http://127.0.0.1:1901/";
// var api_yuming = "http://10.168.1.102:1901/";
var file_yuming = "http://10.168.1.102:1902/";
//#endregion

//#region 网上
// var api_yuming = "http://124.71.47.225:4001/";
// var file_yuming="http://124.71.47.225:4002/"
//#endregion

var gd_zf_length = 30;

//#region 文本显示
function wbxs(temp) {
    if (temp == "" || temp == null) { return ""; }
    temp = temp.replace(/\r\n/g, '<br/>'); //IE9、FF、chrome
    temp = temp.replace(/\n/g, '<br/>'); //IE7-8
    temp = temp.replace(/\s/g, '&nbsp;');
    return temp;
}
function get_wenben(cellvalue, options, rowdata) {
    return wbxs(cellvalue);
}
//#endregion

//#region 登录时长
var expiresDate = new Date();
expiresDate.setTime(expiresDate.getTime() + (6 * 60 * 60 * 1000));
//#endregion 

//#region 数据请求
function login(JsonPara, apiurl) {
    var re_obj = { flag: 0, msg: "请求失败" };
    $.ajax({
        type: "post",
        url: api_yuming + apiurl,
        data: JSON.stringify(JsonPara),
        dataType: "json",
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(data) {

            if (data.flag == 1) {
                $.cookie("token", data.data, { expires: expiresDate, path: '/' });
                re_obj.flag = 1;
                re_obj.msg = "登录成功！";
            } else {
                re_obj.flag = 0;
                re_obj.msg = "用户名或密码错误！";
            }

        },
        error: function(data) {
            re_obj.flag = 2;
            re_obj.msg = "网络或服务器内部错误";
        }
    });
    return re_obj;
}

function tf_ajax(JsonPara, apiurl) {
    var re_obj = null;
    var token = $.cookie("token");
    if (token == null||token=="null") {
        var tzurl = "";
        var tzpage = "login.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../login.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {
            location.href = tzurl;
        }
        return;
    }
    $.ajax({
        type: "post",
        url: api_yuming + apiurl,
        data: JSON.stringify(JsonPara),
        dataType: "json",
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function(XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function(data) {
            re_obj = data;
        },
        error: function(data) {
            re_obj = data;
        }
    });
    return re_obj;
}


function aj_login(param, apiurl) {
    var JsonPara = { param: param };
    var re_obj = null;
    $.ajax({
        type: "POST",
        url: api_yuming + apiurl,
        data: JSON.stringify(JsonPara),
        dataType: "json",
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            re_obj = data.d;
        },
        error: function (data) {
            re_obj = data.d;
        }
    });
    if (re_obj != null) {
        delete re_obj.__type;
        if (re_obj.data.hasOwnProperty("__type") == true) {
            re_obj.data.forEach(item => {
                delete item.__type;
            });
        }
    }
    return re_obj;
}

// function tf_ajax(param, apiurl) {
//     var JsonPara = null; JsonPara = { param: param };
//     var token = $.cookie("token");
//     if (token == null || token == "null") {
//         var tzurl = "";
//         var tzpage = "index.html";
//         var bdpage = window.location.pathname;
//         bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
//         if (bdpage == "login.html") { tzurl = tzpage; } else { tzurl = "../login.html"; }
//         if (window != top) {
//             top.location.href = tzurl;
//         } else {
//             location.href = tzurl;
//         }
//         return;
//     }
//     var re_obj = null;
//     $.ajax({
//         type: "POST",
//         url: api_yuming + apiurl,
//         data: JSON.stringify(JsonPara),
//         dataType: "json",
//         traditional: true,
//         async: false,
//         contentType: "application/json; charset=utf-8",
//         beforeSend: function (XMLHttpRequest) {
//             XMLHttpRequest.setRequestHeader("token", token);
//         },
//         success: function (data) {
//             re_obj = data.d;
//         },
//         error: function (data) {
//             re_obj = data.d;
//         }
//     });

//     if (re_obj != null) {
//         // delete re_obj.__type;
//         // if (re_obj.data != null) {
//         //     re_obj.data.forEach(item => {
//         //         delete item.__type;
//         //     });
//         // }
//     }
//     return re_obj;
// }

function my_ajax_post_promise(JsonPara, apiurl) {
    var token = $.cookie("token");
    if (token == null || token == "null") {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "main.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {
            location.href = tzurl;
        }
        return;
    }
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: api_yuming + apiurl,
            data: JSON.stringify(JsonPara),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
            },
            success: function (data) {
                resolve(data);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

function tf_ajax_get(JsonPara, apiurl) {
    var re_obj = null;
    var token = $.cookie("token");
    if (token == null || token == "null") {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "main.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    $.ajax({
        type: "get",
        url: api_yuming + apiurl,
        data: JSON.stringify(JsonPara),
        dataType: "json",
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);

        },
        success: function (data) {
            re_obj = data;

        },
        error: function (data) {
            re_obj = data;
        }
    });
    return re_obj;
}

function tf_ajax_bd(JsonPara, apiurl) {
    var re_obj = null;
    $.ajax({
        type: "get",
        url: apiurl,
        data: JSON.stringify(JsonPara),
        dataType: "json",
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            re_obj = data;
        },
        error: function (data) {
            re_obj = data;
        }
    });
    return re_obj;
}

function tf_ajax_wtk(JsonPara, apiurl) {
    var re_obj = null;
    $.ajax({
        type: "post",
        url: api_yuming + apiurl,
        data: JSON.stringify(JsonPara),
        dataType: "json",
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            re_obj = data;

        },
        error: function (data) {
            re_obj = data;
        }
    });
    return re_obj;
}
//#endregion 

//#region 操作滚动条
function move_left() {
    $("#div_move_con").animate({ scrollLeft: "+=80" }, 1000);
}
function move_right() {
    $("#div_move_con").animate({ scrollLeft: "-=80" }, 1000);
}

function move_left_2() {
    $("#div_move_con_2").animate({ scrollLeft: "+=80" }, 1000);
}
function move_right_2() {
    $("#div_move_con_2").animate({ scrollLeft: "-=80" }, 1000);
}
//#endregion

//#region 格式化日期
function convertDotNetDate(dotNetDate) {
    if(isUndefine(dotNetDate)) { return ""; }
    try {
        var timestamp = dotNetDate.match(/\d+/)[0];
        var date = new Date(parseInt(timestamp, 10));
        date.setTime(date.getTime() + (8 * 60) * 60 * 1000);
        // var formattedDate = date.toLocaleString(); // 根据本地时间格式化
        // 或者使用其他格式化方法，例如：
        var formattedDate = date.toISOString(); // ISO 8601 格式
        return formartTime("yyyy-MM-dd HH:mm:ss", formattedDate);
    }
    catch {
        return dotNetDate;
    }
}
//#endregion

//#region 编辑数据弹框
function tk_ss() {
    $("#tc_ss_pg").css("display", "block");
    $("#tc_ss_zz").css("display", "block");
    // cdw_tf_box_list();
}
function un_tk_ss() {
    $("#tc_ss_pg").css("display", "none");
    $("#tc_ss_zz").css("display", "none");
    //    close_tf_box_list();
}

function tk_ss_2() {
    $("#tc_ss_pg_2").css("display", "block");
    $("#tc_ss_zz_2").css("display", "block");
}
function un_tk_ss_2() {
    $("#tc_ss_pg_2").css("display", "none");
    $("#tc_ss_zz_2").css("display", "none");
}

function tk_ss_3() {
    $("#tc_ss_pg_3").css("display", "block");
    $("#tc_ss_zz_3").css("display", "block");
}
function un_tk_ss_3() {
    $("#tc_ss_pg_3").css("display", "none");
    $("#tc_ss_zz_3").css("display", "none");
}

function tk_mini(html) {
    var m = document.createElement('div');
    m.id = "tc_pg_mini";
    m.innerHTML = html;
    m.className = "tc_pg_mini";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_zz_mini";
    z.className = "tc_zz_mini";
    document.body.appendChild(z);
}
function un_tk_mini() {
    $("#tc_pg_mini").remove();
    $("#tc_zz_mini").remove();
}

function tk_1(html) {
    var m = document.createElement('div');
    m.id = "tc_pg_1";
    m.innerHTML = html;
    m.className = "tc_pg_1";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_zz_1";
    z.className = "tc_zz_1";
    document.body.appendChild(z);
}
function un_tk_1() {
    $("#tc_pg_1").remove();
    $("#tc_zz_1").remove();
}

function tk_5(html) {
    var m = document.createElement('div');
    m.id = "tc_pg_5";
    m.innerHTML = html;
    m.className = "tc_pg_5";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_zz_5";
    z.className = "tc_zz_5";
    document.body.appendChild(z);
}
function un_tk_5() {
    $("#tc_pg_5").remove();
    $("#tc_zz_5").remove();
}

function tk_2(html) {
    var m = document.createElement('div');
    m.id = "tc_pg_2";
    m.innerHTML = html;
    m.className = "tc_pg_2";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_zz_2";
    z.className = "tc_zz_2";
    document.body.appendChild(z);
}
function un_tk_2() {
    $("#tc_pg_2").remove();
    $("#tc_zz_2").remove();
}

function tk_3(html) {
    var m = document.createElement('div');
    m.id = "tc_pg_3";
    m.innerHTML = html;
    m.className = "tc_pg_3";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_zz_3";
    z.className = "tc_zz_3";
    document.body.appendChild(z);
}
function un_tk_3() {
    $("#tc_pg_3").remove();
    $("#tc_zz_3").remove();
}

// 
function tk_6(html) {
    var m = document.createElement('div');
    m.id = "tc_pg_6";
    m.innerHTML = html;
    m.className = "tc_pg_6";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_zz_6";
    z.className = "tc_zz_6";
    document.body.appendChild(z);
}
function un_tk_6() {
    $("#tc_pg_6").remove();
    $("#tc_zz_6").remove();
}

function tk_xq(html) {
    var m = document.createElement('div');
    m.id = "tc_xq_pg";
    m.innerHTML = html;
    m.className = "tc_xq_pg";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_xq_zz";
    z.className = "tc_xq_zz";
    document.body.appendChild(z);
}
function un_tk_xq() {
    $("#tc_xq_zz").remove();
    $("#tc_xq_pg").remove();
}

function tk_xq_2(html) {
    var m = document.createElement('div');
    m.id = "tc_xq_pg_2";
    m.innerHTML = html;
    m.className = "tc_xq_pg_2";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_xq_zz_2";
    z.className = "tc_xq_zz_2";
    document.body.appendChild(z);
}
function un_tk_xq_2() {
    $("#tc_xq_zz_2").remove();
    $("#tc_xq_pg_2").remove();
}

function tk_xq_3(html) {
    var m = document.createElement('div');
    m.id = "tc_xq_pg_3";
    m.innerHTML = html;
    m.className = "tc_xq_pg_3";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_xq_zz_3";
    z.className = "tc_xq_zz_3";
    document.body.appendChild(z);
}
function un_tk_xq_3() {
    $("#tc_xq_zz_3").remove();
    $("#tc_xq_pg_3").remove();
}

function tk_xq_4(html) {
    var m = document.createElement('div');
    m.id = "tc_xq_pg_4";
    m.innerHTML = html;
    m.className = "tc_xq_pg_4";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_xq_zz_4";
    z.className = "tc_xq_zz_4";
    document.body.appendChild(z);
}
function un_tk_xq_4() {
    $("#tc_xq_zz_4").remove();
    $("#tc_xq_pg_4").remove();
}

function tk_xq_5(html) {
    var m = document.createElement('div');
    m.id = "tc_xq_pg_5";
    m.innerHTML = html;
    m.className = "tc_xq_pg_5";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.id = "tc_xq_zz_5";
    z.className = "tc_xq_zz_5";
    document.body.appendChild(z);
}
function un_tk_xq_5() {
    $("#tc_xq_zz_5").remove();
    $("#tc_xq_pg_5").remove();
}
//#endregion 

//#region 控制天
function diffDate(n) {
    var dt = new Date();
    dt.setDate(dt.getDate() + Number(n));
    return dt.Format("yyyy-MM-dd");
}
//#endregion

//#region 控制月份
function diffMonth(n) {
    var dt = new Date();
    dt.setMonth(dt.getMonth() + Number(n));
    return dt.Format("yyyy-MM-dd");
}
//#endregion

//#region 消息提示
function Toast(msg, duration) {
    duration = isNaN(duration) ? 200 : duration;
    duration = 200;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width:90%;min-width:300px;max-width:394px;padding:5px 0px;line-height:24px; color:#fff;text-align: center;border-radius: 5px;position:fixed;top:80%;left:0px;right:0px; z-index: 999999; background-image:-webkit-linear-gradient(top,#000,#2A2A2A,#000);font-size:12px;border:solid 1px #555;";
    document.body.appendChild(m);

    var z = document.createElement('div');
    z.style.cssText = "position:fixed;top:0px;right:0px;left:0px;bottom:0px;margin:auto;z-index:1000";
    document.body.appendChild(z);
    setTimeout(function () {
        var d = 0.2;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m);
            document.body.removeChild(z);
        }, d * 1000);
    }, duration);
}

function tipmsg(msg) {
    var zz = $("<div></div>");
    zz.css({
        "position": "fixed",
        "top": "0",
        "left": "0",
        "right": "0",
        "bottom": "0",
        "margin": "auto",
        "z-index": "1000",
    })
    $("body").append(zz);
    var obj = $("<div>" + msg + "</div>");
    obj.css({
        "position": "fixed",
        "top": "70%",
        "left": "10px",
        "right": "10px",
        "z-index": "9999999",
        "min-width": "300px",
        "max-width": "394px",
        "padding": "5px 0px",
        "line-height": "24px",
        "border": "solid 1px #000",
        "font-size": "12px",
        "text-align": "center",
        "background-image": "-webkit-linear-gradient(top,#000,#2A2A2A,#000)",
        "color": "#8AF276"
    });
    $("body").append(obj);
    obj.animate({ "top": "65%" }, 500);
    setTimeout(function () { obj.animate({ "opacity": 0 }, 500, function () { obj.remove(), zz.remove(); }); }, 1000)
}
//#endregion 

//#region 选项卡 开关 div显示
function change_div(dq, zong, title, con) {
    $("#" + title + dq).addClass("current");
    $("#" + con + dq).css("display", "block");
    for (var i = 1; i <= zong; i++) {
        if (dq != i) {
            $("#" + title + i).removeClass("current");
            $("#" + con + i).css("display", "none");
        }
    }
}

function change_civ(dq, zong, title) {
    $("#" + title + dq).addClass("current");
    for (var i = 1; i <= zong; i++) {
        if (dq != i) {
            $("#" + title + i).removeClass("current");
        }
    }
}

//#endregion 

//#region 控制天
function diffDate(n){
    var dt = new Date();
    dt.setDate(dt.getDate() + Number(n));
    return dt.Format("yyyy-MM-dd");
}
//#endregion

//#region 控制月份
function diffMonth(n){
    var dt = new Date();
    dt.setMonth(dt.getMonth() + Number(n));
    return dt.Format("yyyy-MM-dd");
}
//#endregion

//#region StringBuffer封装
String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

function StringBuffer() { this.__strings__ = []; };

StringBuffer.prototype.Append = function (str) { this.__strings__.push(str); return this; };

StringBuffer.prototype.AppendFormat = function (str) {
    for (var i = 1; i < arguments.length; i++) {
        var parent = "\\{" + (i - 1) + "\\}";
        var reg = new RegExp(parent, "g")
        str = str.replace(reg, arguments[i]);
    }
    this.__strings__.push(str);
    return this;
};

StringBuffer.prototype.ToString = function () { return this.__strings__.join(''); };

StringBuffer.prototype.clear = function () { this.__strings__ = []; };

StringBuffer.prototype.size = function () { return this.__strings__.length; };
//#endregion 

//#region request方法
function request(name) { var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if (r != null) return unescape(r[2]); return null; }

function request_list(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)", "g");
    var r = window.location.search.substr(1).match(reg);
    var result = [];
    if (r != null) {
        for (var i = 0; i < r.length; i++) {
            var value = unescape(r[i].split("=")[1]); result.push(value);
        }
    }
    return result;
}

function getQueryParams(url) {
    var params = {};
    var queryString = url.split('?')[1];
    if (!queryString) {
        return params;
    }

    queryString.split('&').forEach(param => {
        var [key, value] = param.split('=');
        if (params[key]) {
            params[key].push(value);
        } else {
            params[key] = [value];
        }
    });
    return params;
}
//#endregion 

//#region 上传图片
/**
 * 
 * @param {上传控件id} file_id  
 * @param {文件夹名称} lx_wjj      
 * @param {是否放入临时文件夹} ls_flag  
 * @param {回调调函数名称} callback 
 */

function tf_ajax_upload_image(file_id, callback) {
    callback = (callback === undefined ? null : callback);
    var re_obj = null;
    var apiurl = "upload.aspx";
    var formData = new FormData();
    var file = $("#" + file_id)[0].files[0]; if (file == null) { Toast("请选择文件"); return; }
    
    var fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
    var allow_extension = ["png", "jpg", "jpeg", "gif", "bmp"];
    if(fileExtension == undefined || !allow_extension.includes(fileExtension)) {
        alert("只能上传图片");
        return;
    }
    
    formData.append("file", file);
    var token = $.cookie("token");
    if (token == null) {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "login.html") { tzurl = tzpage; } else { tzurl = "../login.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    var url = api_yuming + apiurl;
    $.ajax({
        type: "post",
        url: url,
        data: formData,
        dataType: "json",
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
            re_obj = data
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $("#" + file_id).val("");
    if (callback != null) {
        callback(re_obj);
    }
    else { return re_obj; }

}
//#endregion 

//#region 上传附件
/**
 * 
 * @param {上传控件id} file_id  
 * @param {文件夹名称} lx_wjj      
 * @param {是否放入临时文件夹} ls_flag  
 * @param {回调调函数名称} callback 
 */
function tf_ajax_upload_file(file_id, lx_wjj, ls_flag, callback) {
    callback = (callback === undefined ? null : callback);
    var re_obj = null;
    var apiurl = "api/upload/up_file"
    var formData = new FormData();
    var file = $("#" + file_id)[0].files[0]; if (file == null) { Toast("请选择文件"); return; }
    formData.append("file", file);
    formData.append("lx_wjj", lx_wjj);
    formData.append("ls_flag", ls_flag);
    var token = $.cookie("token");
    if (token == null) {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    var url = api_yuming + apiurl;
    $.ajax({
        type: "post",
        url: url,
        data: formData,
        dataType: "json",
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
            re_obj = data
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $("#" + file_id).val("");
    if (callback != null) {
        callback(re_obj);
    }
    else { return re_obj; }
}
//#endregion 

//#region 上传附件指定文件夹文件名，文件后缀名     啥也能上传（用这个作为底单管理上传） /  tubiao
function tf_ajax_upload_zd_wjj_wjm_hzm(file_id, wjj, wjm, hzm, callback) {
    var file_val = $("#" + file_id).val(); if (file_val == "") { return; }

    callback = (callback === undefined ? null : callback);
    var filename = file_val.replace(/.*(\/|\\)/, "");
    var fileExt = filename.substring(filename.indexOf('.') + 1);

    var hzm_sz = hzm.split(',');
    var myindex = hzm_sz.indexOf(fileExt);
    if (myindex == -1) {
        $("#" + file_id).val("");
        alert("上传失败！只能上传后缀名为 " + hzm + " 的文件！");

        return;
    }

    var re_obj = null;
    var apiurl = "api/upload/up_file_zd_wjj_wjm_hzm"
    var formData = new FormData();
    var file = $("#" + file_id)[0].files[0]; if (file == null) { Toast("请选择文件"); return; }

    formData.append("file", file);
    formData.append("wjj", wjj);
    formData.append("wjm", wjm);
    formData.append("hzm", hzm);
    var token = $.cookie("token");
    if (token == null) {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    var url = api_yuming + apiurl;
    $.ajax({
        type: "post",
        url: url,
        data: formData,
        dataType: "json",
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
            re_obj = data
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $("#" + file_id).val("");
    if (callback != null) {
        callback(re_obj);
    }
    else { return re_obj; }
}
//#endregion 

//#region 数据分类excel上传   
function up_file_sjfl(file_id, wjj, hzm, callback) {
    var file_val = $("#" + file_id).val(); if (file_val == "") { return; }

    callback = (callback === undefined ? null : callback);
    var filename = file_val.replace(/.*(\/|\\)/, "");
    var fileExt = filename.substring(filename.indexOf('.') + 1);

    var hzm_sz = hzm.split(',');
    var myindex = hzm_sz.indexOf(fileExt);
    if (myindex == -1) {
        $("#" + file_id).val("");
        alert("上传失败！只能上传后缀名为 " + hzm + " 的文件！");

        return;
    }

    var re_obj = null;
    var apiurl = "api/upload/up_file_sjfl"
    var formData = new FormData();
    var file = $("#" + file_id)[0].files[0]; if (file == null) { Toast("请选择文件"); return; }

    formData.append("file", file);
    formData.append("wjj", wjj);
    formData.append("hzm", hzm);
    var token = $.cookie("token");
    if (token == null) {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    var url = api_yuming + apiurl;
    $.ajax({
        type: "post",
        url: url,
        data: formData,
        dataType: "json",
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
            re_obj = data
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $("#" + file_id).val("");
    if (callback != null) {
        callback(re_obj);
    }
    else { return re_obj; }
}
//#endregion 

//#region 上传附件指定文件夹，文件后缀名
function tf_ajax_upload_zd_wjj_hzm(file_id, wjj, hzm, callback) {
    var file_val = $("#" + file_id).val(); if (file_val == "") { return; }

    callback = (callback === undefined ? null : callback);
    var filename = file_val.replace(/.*(\/|\\)/, "");
    var fileExt = filename.substring(filename.indexOf('.') + 1);

    var hzm_sz = hzm.split(',');
    var myindex = hzm_sz.indexOf(fileExt);
    if (myindex == -1) {
        $("#" + file_id).val("");
        alert("上传失败！只能上传后缀名为 " + hzm + " 的文件！");

        return;
    }

    var re_obj = null;
    var apiurl = "api/upload/up_file_zd_wjj_hzm"
    var formData = new FormData();
    var file = $("#" + file_id)[0].files[0]; if (file == null) { Toast("请选择文件"); return; }

    formData.append("file", file);
    formData.append("wjj", wjj);
    formData.append("hzm", hzm);
    var token = $.cookie("token");
    if (token == null) {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    var url = api_yuming + apiurl;
    $.ajax({
        type: "post",
        url: url,
        data: formData,
        dataType: "json",
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
            re_obj = data
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $("#" + file_id).val("");
    if (callback != null) {
        callback(re_obj);
    }
    else { return re_obj; }
}
//#endregion 

//#region 上传Excel
function tf_ajax_upload_excel(id, type) {
    var re_obj = null;
    var apiurl = "api/upload/up_excel"
    var formData = new FormData();
    var file = $("#" + id)[0].files[0]; if (file == null) { Toast("请选择文件"); return; }
    formData.append("file", file);
    formData.append("fj_type", type);
    var token = $.cookie("token");
    if (token == null) {
        var tzurl = "";
        var tzpage = "index.html";
        var bdpage = window.location.pathname;
        bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
        if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
        if (window != top) {
            top.location.href = tzurl;
        } else {

            location.href = tzurl;
        }
        return;
    }
    var url = api_yuming + apiurl;
    $.ajax({
        type: "post",
        url: url,
        data: formData,
        dataType: "json",
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
            re_obj = data
        },
        error: function (data) {
            alert(data.responseText);
        }
    });

    $("#" + id).val("");
    if (re_obj.flag == 1) {
        $("#lb_" + id).html(re_obj.data.fj_url);
        $("#hid_" + id).val(re_obj.data.fj_url);
        Toast(re_obj.msg);
    }
    else {
        Toast(re_obj.msg);
    }
    return re_obj;
}
//#endregion 

//#region 下拉列表
function Create_select(dom_id, json, value, text, moren, json_zdy, cg_name, param, data_attr) {
    if (json == null) { return ""; }
    moren = (moren === undefined ? -1 : moren);
    json_zdy = (json_zdy === undefined ? null : json_zdy);
    cg_name = (cg_name === undefined ? "" : cg_name);
    param = (param === undefined ? "" : param);

    data_attr = (data_attr === undefined ? "" : data_attr);
    
    var result = "";
    var shijian = "";
    if (cg_name != "") { shijian = " onchange=\"" + cg_name + "(" + param + ")\""; }
    result += "<select " + data_attr + " class='normal-select' id=\"" + dom_id + "\" autocomplete=\"off\"" + shijian + ">";
    if (json_zdy != null) {
        if (moren == -1) { xzzt = " selected=\"selected\""; }
        result += "<option value=\"" + json_zdy.value + "\"" + xzzt + ">" + json_zdy.title + "</option>";
    }
    if (json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            var xzzt = "";
            if (json[i][value] == moren) {
                xzzt = " selected=\"selected\"";
            }
            result += "<option value=\"" + json[i][value] + "\"" + xzzt + ">" + json[i][text] + "</option>";
        }
    }
    result += "</select>";
    return result;
}

function BindSelect(dom_id, json, value, text, moren, json_zdy) {
    if ($("#" + dom_id).length == 0) { return; }
    if (json == null) { return; }
    moren = (moren === undefined ? -1 : moren);
    json_zdy = (json_zdy === undefined ? null : json_zdy);
    $("#" + dom_id).empty();
    if (json_zdy != null) { $("#" + dom_id).append(("<option value=\"" + json_zdy.value + "\">" + json_zdy.title + "</option>")); }
    if (json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            var xzzt = "";
            if (json[i][value] == moren) {
                xzzt = " selected=\"selected\"";
            }
            $("#" + dom_id).append(("<option value=\"" + json[i][value] + "\"" + xzzt + ">" + json[i][text] + "</option>"));
        }
    }
}

function Create_flag_sel(dom_id, json_zdy) {
    return "<select id=\"" + dom_id + "\"><option value=\"" + json_zdy.value + "\">" + json_zdy.title + "</option><option value=\"否\">否</option><option value=\"是\">是</option></select>";
}

function Create_rad_list(dom_id, json, value, text, moren, json_zdy, cg_name, param) {
    moren = (moren === undefined ? -1 : moren);
    json_zdy = (json_zdy === undefined ? null : json_zdy);
    cg_name = (cg_name === undefined ? "" : cg_name);
    param = (param === undefined ? "" : param);

    var result = "";
    var shijian = "";
    if (cg_name != "") { shijian = " onclick=\"" + cg_name + "(" + param + ");\";" }
    if (json_zdy != null) {
        if (moren == -1) { xzzt = " checked=\'checked\'"; }
        result += "<span class=\"radio_lb\"><input id=\"" + dom_id + "_0\" type=\"radio\" name=\"" + dom_id + "\" value=\"" + json_zdy.value + "\"" + xzzt + "><label for=\"" + dom_id + "_0\">" + json_zdy.title + "</label></span>";
    }
    for (var i = 0; i < json.length; i++) {
        var xzzt = "";
        if (json[i][value] == moren) {
            xzzt = " checked=\'checked\'";
        }
        result += "<span class=\"radio_lb\"><input id=\"" + dom_id + "_" + (i + 1) + "\" type=\"radio\" name=\"" + dom_id + "\" value=\"" + json[i][value] + "\" " + xzzt + " " + shijian + "><label for=\"" + dom_id + "_" + (i + 1) + "\">" + json[i][text] + "</label></span>";

    }
    return result;
}
//#endregion 

//#region 判断图片是否存在
function ckimgexists(imgurl) {
    var ImgObj = new Image(); ImgObj.src = imgurl;
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
    } else {
        return false;
    }
}
//#endregion 

//#region 光棒效果
//function guangbang() {
//    $("#mytable tr").mouseover(function () { if ($(this).prop("class") != 'bg3') { $(this).prop('class', 'bg2'); } });
//    $("#mytable tr").mouseout(function () { if ($(this).prop("class") != 'bg3') { $(this).prop('class', 'bg1'); } });
//    $("#mytable tr").click(function () { if ($(this).prop("class") != 'bg3') { $(this).prop('class', 'bg3'); } else { $(this).prop('class', 'bg2'); } });
//}
//#endregion

//#region 表格效果,固定表头，可拖拽 postbackSafe partialRefresh 这2个属性非常重要，当你第二次加载的时候没有这2个属性表格将不在有可拖拽功能
function table_xg(table_id) {
    // 表格列自由拖拽            
    $("#" + table_id).colResizable({
        liveDrag: true,
        draggingClass: "dragging",
        resizeMode: 'fit',
        postbackSafe: true,
        partialRefresh: true
    });
    // 表头固定 
    $('#div_' + table_id).on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        $('#' + table_id).find('thead').css({
            '-webkit-transform': '-webkit-translateY(' + scrollTop + 'px)',
            '-mox-transform': '-moz-translateY(' + scrollTop + 'px)',
            '-ms-transform': '-o-translateY(' + scrollTop + 'px)',
            '-o-transform': '-ms-translateY(' + scrollTop + 'px)',
            transform: 'translateY(' + scrollTop + 'px)',

        });
    });
}
//#endregion

//#region 获取jqgrid所有行
function get_row(tb_id) {
    var list = new Array;
    if ($("#" + tb_id + " tr").length == 0) { return list; }
    var ids = $('#' + tb_id).jqGrid('getGridParam', 'selarrrow');
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var row = $("#" + tb_id).jqGrid('getRowData', id);
        list.push(row);
    }
    return list;
}
//#endregion 

//#region 选择 全选 qx_id table的名字
function sel_checkbox(qx_id) {
    $("#" + qx_id + " input[name='ck_zong_" + qx_id + "']").click(function () {
        if ($(this).prop("checked") == true) { $("#" + qx_id + " input[name='ck_item_" + qx_id + "']").prop("checked", true) } else { $("#" + qx_id + " input[name='ck_item_" + qx_id + "']").prop("checked", false); }
    });
}

function get_sel_value(qx_id) {
    var list_ck_value = new Array();
    $("#" + qx_id + " input[name='ck_item_" + qx_id + "']").each(function () {
        if ($(this).prop("checked") == true) {
            list_ck_value.push($(this).val());
        }
    });
    return list_ck_value;
}


//#endregion

//#region 数组扩展方法
Array.prototype.Remove_2 = function (key, value) {
    var flag = false
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] == value) {
            this.splice(i, 1);
            flag = true
        }
    }
    return flag
};
Array.prototype.Remove_1 = function (b) {
    var a = this.indexOf(b);
    if (a >= 0) {
        this.splice(a, 1);
        return true;
    }
    return false;
};
Array.prototype.Contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
}
Array.prototype.OrderByAsc = function (func) {
    var m = {};
    for (var i = 0; i < this.length; i++) {
        for (var k = 0; k < this.length; k++) {
            if (func(this[i]) < func(this[k])) {
                m = this[k];
                this[k] = this[i];
                this[i] = m;
            }
        }
    }
    return this;
}
Array.prototype.OrderByDesc = function (func) {
    var m = {};
    for (var i = 0; i < this.length; i++) {
        for (var k = 0; k < this.length; k++) {
            if (func(this[i]) > func(this[k])) {
                m = this[k];
                this[k] = this[i];
                this[i] = m;
            }
        }
    }
    return this;
}
Array.prototype.distinct = function (field) {
    return this.reduce((accumulator, currentValue) => {
        if (!accumulator.some(item => item[field] === currentValue[field])) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
};

Array.prototype.Sum = function (field) {
    var result = 0;
    this.forEach(p => {
        if (p[field]) {
            result += parseInt(p[field]);
        }
    });
    return result;
};
//#endregion 

//#region 集合去重
function quchong(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
        }
    }
    return temp;
}
//#endregion

//#region 判断数组中的值是否都相等
function Is_list_p_xd(array) {
    if (array.length > 0) {
        return !array.some(function (value, index) {
            return value !== array[0];
        });
    } else {
        return true;
    }
}
//#endregion

//#region 保留小数位不四舍五入
function get_xiaoshu_1(temp, num) {
    if (temp == null) { return ""; }
    temp = temp.toString();
    var index = temp.indexOf('.');
    if (index !== -1) {
        temp = temp.substring(0, num + index + 1);
    } else {
        temp = temp.substring(0);
    }
    return parseFloat(temp).toFixed(num);
}
//#endregion 

//#region 保留小数位四舍五入
function get_xiaoshu_2(temp, num) {
    if (temp == null) { return ""; }
    // if (temp == 0) {return 0;}
    if (temp === "") { return ""; }
    var f = Math.round(temp * Math.pow(10, num)) / Math.pow(10, num);
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        s += '.';
    }
    for (var i = s.length - s.indexOf('.'); i <= num; i++) {
        s += "0";
    }
    return s;
}
//#endregion 

function get_null(temp) {
    if (temp == null) {
        return "";
    }
    else {
        return temp;
    }
}

function isNumber(value) {
    return typeof value === "number";
}

//#region 保留小数位末位进一
function get_xiaoshu_3(temp, num) {
    var f = Math.ceil(temp * Math.pow(10, num)) / Math.pow(10, num);
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        s += '.';
    }
    for (var i = s.length - s.indexOf('.'); i <= num; i++) {
        s += "0";
    }
    return s;
}
//#endregion 

//#region 有小数加1
function get_xiaoshu_4(temp, num) {
    var result = "";
    var ws0 = "";
    for (var i = 0; i < num; i++) { ws0 += "0"; }
    var sz = temp.toString().split('.');
    if (sz.length == 1) {
        result = sz[0] + "." + ws0;
    }
    else {
        var leftnum = parseInt(sz[0]) + 1;
        result = leftnum.toString() + "." + ws0;
    }
    return result;
}
//#endregion 

//#region 游戏百分比
function get_bfb(num_dq, num_sj) {
    var bfb = 0;
    if (num_dq > 0 && num_sj > 0) {
        bfb = get_xiaoshu_2(num_dq / num_sj * 100, 2);
    }
    if (bfb > 100) { bfb = 100; }
    return bfb;
}
//#endregion

//#region 参考用法Find
function seloneobj(jian, list) {
    var one_obj = list.find(function (x) { return x.jian == jian })
    return one_obj;
}
//#endregion

//#region 参考用法FindAll
function selallobj(jian, list) {
    var x_list = new Array();
    list.find(function (x) { if (x.jian == jian) { x_list.push(x); } });
    return x_list;
}
//#endregion

//#region 后台框架常用方法
function Set_selectValue_By_text(obj_id, text) {
    $("#" + obj_id + " option").each(function () {
        if ($(this).text() == text) {
            $(this).attr('selected', "selected");
        } else {
            $(this).removeAttr('selected');
        }
    });
}

function quanxuan() {
    if ($("#ckzong").is(':checked') == true) { $("#tablelist").find("tr").find("td:first").find("input[type='checkbox']").prop("checked", true); } else { $("#tablelist").find("tr").find("td:first").find("input[type='checkbox']").prop("checked", false); }
}

function go(tf_totlepage) {
    if (document.getElementById("txttf_myindexpage")) {
        var tf_dq_page_num = document.getElementById("txttf_myindexpage").value;
        if (tf_dq_page_num == 0) { tf_dq_page_num = 1; } else if (tf_dq_page_num > tf_totlepage) { tf_dq_page_num = tf_totlepage; }
        if (funExists("getdata")) {
            getdata(tf_dq_page_num);
        } else { alert('请把绑定数据的方法名改为getdata才能正常调用go方法') }
    }
}

function funExists(funName) {
    try {
        if (typeof eval(funName) == "undefined") { return false; }
        if (typeof eval(funName) == "function") { return true; }
    } catch (e) {
        return false;
    }
}

String.prototype.ReplaceAll = function (f, e) { //吧f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象   
    return this.replace(reg, e);
};

function Is_Upload(InputId, list) {
    //获取欲上传的文件路径
    var fullname_temp = $("#" + InputId).val();
    //为了避免转义反斜杠出问题，这里将对其进行转换
    var re = /(\\+)/g;
    var fullname = fullname_temp.replace(re, "#");
    //对路径字符串进行剪切截取
    var files = fullname.split("#");
    //获取数组中最后一个，即文件名
    var file_name = files[files.length - 1];
    //再对文件名进行截取，以取得后缀名
    var names = file_name.split(".");
    //获取截取的最后一个字符串，即为后缀名
    var hz_name = names[names.length - 1];
    var hz_name_xx = hz_name.toLowerCase();
    var result = list.indexOf(hz_name_xx);
    if (result != -1) { return true; } else { return false; }
}

function CanShu_M(name, value) {
    this.name = name;
    this.value = value;
}

function get_sjs(min, max) {
    var result_1 = parseInt(Math.random() * (max - min + 1) + min, 10);
    //var result_2 = Math.floor(Math.random() * (max - min + 1) + min);
    return result_1;
}
//#endregion 

//#region 基础验证
function yz_tel(temp) {
    var reg = /^1[3-9]\d{9}$/;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsPhone(temp) {
    var reg = /^1[34578]\d{9}$/;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsEmail(temp) {
    var reg = /^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsCard(temp) {
    var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsDate(temp) {
    var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/gi;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsFullDate(temp) {
    var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/gi;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZhanghao(temp) {
    var reg = /^[0-9A-Za-z]{5,20}$/; //字母和数字5-20位
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function Isfeifa(temp) {
    var para = temp.toLowerCase();
    if (para == "select") { return false; }
    if (para == "delete") { return false; }
    if (para == "update") { return false; }
    if (para == "admin") { return false; }
    if (para == "administrator") { return false; }
    return true;
}

function IsJueSe(temp) {
    var reg = /^[\u0391-\uFFE5]{2,5}$/; //中文2-5位
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsQianMing(temp) {
    if (temp.trim() == "") { return false; }
    var reg = /^[\u0391-\uFFE5，。]{5,15}$/; //中文2-5位
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function Is_WenBen(temp) {
    if (temp.trim() == "") { return false; }
    var reg = /^[\u4e00-\u9fa5a-zA-Z0-9，。,.？：……\s]{5,200}$/;
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function Isfeifa_juese(temp) {
    if (temp == "管理员" || temp == "管理" || temp == "童丰") { return false; }
    return true;
}

function IsHZandZM_2_15(temp) {
    var reg = /^[\u0391-\uFFE5A-Za-z]{2,15}$/; //中文和字母2-15位
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZM_4_15(temp) {
    var reg = /^[A-Za-z]{4,15}$/; //字母4-15位
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsHZ_2_4(temp) {
    var reg = /^[\u0391-\uFFE5]{2,4}$/; //中文2-4位
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsSZ(temp) {
    if (temp.trim() == "") { return false; }
    var reg = /^[1-9]\d*$/; //数字
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZS(temp) {
    var reg = /^-?\d+$/; //整数
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZZS(temp) {
    if (temp == null) { return false; }
    if (temp.trim() == "") { return false; }
    var reg = /(^[1-9]\d*$)/; //正整数
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZZS_J_0(temp) {
    var reg = /^\d+$/; //正整数加0
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsFZS(temp) {
    var reg = /^-[0-9]*[1-9][0-9]*$/; //负整数
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsFZS_J_0(temp) {
    var reg = /^((-\\d+)|(0+))$/; //负整数加0
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsXS(temp) {
    var reg = /^(-?\d+)(\.\d+)?$/;　 //小数
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZXS(temp) {
    var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$ /;　 //正小数
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsZXS_J_0(temp) {
    var reg = /^\d+(\.\d+)?$/;　 //正小数加0
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsFXS(temp) {
    var reg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;　 //负小数
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}

function IsFXS_J_0(temp) {
    var reg = /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/;　 //负小数加0
    if (reg.test(temp)) {
        return true;
    } else {
        return false;
    }
}
//#endregion 

//#region 时间格式化方法
function formartTime(fmt, date_str) {
    if (date_str == null) { return ""; }
    if (date_str.trim() == "") { return ""; }
    date_str = date_str.replace('T', " ");
    date_str = date_str.replace('上午', "");
    date_str = date_str.replace('下午', "");
    var p_date_str = date_str.replace(/\-/g, "/");
    var d_index = p_date_str.indexOf('.');
    var new_data = p_date_str;
    if (d_index != -1) {
        new_data = p_date_str.substr(0, p_date_str.indexOf('.'));
    }
    var date = new Date(new_data);
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "H+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function formatTime(fmt, date_str) {
    if (date_str == null) { return ""; }
    if (date_str.trim() == "") { return ""; }
    date_str = date_str.replace('T', " ");
    var p_date_str = date_str.replace(/\-/g, "/");
    var d_index = p_date_str.indexOf('.');
    var new_data = p_date_str;
    if (d_index != -1) {
        new_data = p_date_str.substr(0, p_date_str.indexOf('.'));
    }
    var date = new Date(new_data);
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "H+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//function crtTimeFtt(value, row, index) {
//    var crtTime = new Date(value);
//    return top.formartTime("yyyy-MM-dd HH:mm:ss", crtTime);//直接调用公共JS里面的时间类处理的办法
//}
//#endregion 

//#region 计算时间差
//type: day 天
function timespan_day(date_str) {
    date_str = date_str.replace('T', ' ');
    var date_1 = new Date(date_str).getTime();
    var temp = new Date().Format("yyyy-MM-dd");

    var date_2 = new Date(temp).getTime();
    var days = 0;

    var d1 = parseInt(date_1);
    var d2 = parseInt(date_2);
    if (d2 > d1) {
        var d3 = d2 - d1;
        days = Math.floor(d3 / (24 * 3600 * 1000))
    }
    return days;
}
function timespan_day_2(start_time, end_time) {
    start_time = start_time.replace('T', ' ');
    var date_1 = new Date(start_time).getTime();

    end_time = end_time.replace('T', ' ');
    var date_2 = new Date(end_time).getTime();
    var days = 0;

    var d1 = parseInt(date_1);
    var d2 = parseInt(date_2);
    if (d2 > d1) {
        var d3 = d2 - d1;
        days = Math.floor(d3 / (24 * 3600 * 1000))
    }
    return days;
}
//#endregion 

//#region 获取当前时间
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");  
//#endregion 

//#region 获取指定日期
function get_zd_time(day) {
    var dd = new Date();
    dd.setDate(dd.getDate() + day);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
};
//#endregion 

//#region 日期比较
function bj_data(d1, d2) {
    var startTime = new Date(Date.parse(d1));
    var endTime = new Date(Date.parse(d2));
    return (startTime > endTime);
}
//#endregion 

//#region 全局参数变量

//#region 用户状态
function get_yh_zt(temp) {
    if (temp == 1) { return "在职"; }
    if (temp == 0) { return "离职"; }
    return "";
}
//#endregion

//#region 是否
function get_flag(temp) {
    if (temp == 1) { return "是"; }
    if (temp == 0) { return "否"; }
    return "";
}
//#endregion

//#region 为空处理
function get_n(temp) {
    if (temp == null) { return ""; }
    return temp;
}
//#endregion
//#endregion 

//#region 分页
/**
 * 
 * @param {any} PageIndex
 * @param {any} PageSize
 * @param {any} Totle
 * @param {any} FunName
 * @param {any} Number_showflag
 * @param {any} Startandend_showflag
 * @param {any} Upanddown_showflag
 * @param {any} Detail_showflag
 * @param {any} Jump_showflag
 */
function get_pager(PageIndex, PageSize, Totle, FunName, Number_showflag, Startandend_showflag, Upanddown_showflag, Detail_showflag, Jump_showflag) {
    //#region 设置默认值
    FunName = (FunName === undefined ? "getdata" : FunName);
    Detail_showflag = (Detail_showflag === undefined ? 1 : Detail_showflag);
    Number_showflag = (Number_showflag === undefined ? 1 : Number_showflag);
    Startandend_showflag = (Startandend_showflag === undefined ? 1 : Startandend_showflag);
    Upanddown_showflag = (Upanddown_showflag === undefined ? 1 : Upanddown_showflag);
    Jump_showflag = (Jump_showflag === undefined ? 1 : Jump_showflag);
    //#endregion

    //#region 变量
    var pager_str = "";

    var totlepage_temp = Totle % PageSize == 0 ? (Totle / PageSize) : (Totle / PageSize + 1);

    var totlepage = parseInt(totlepage_temp);
    var pager_sy = new StringBuffer(); //首页字符串
    var pager_wy = new StringBuffer(); //尾页字符串
    var pager_up = new StringBuffer(); //上一页字符串
    var pager_down = new StringBuffer(); //下一页字符串
    var pager_num = new StringBuffer(); //中间的数字
    var pager_tz = new StringBuffer(); //跳转字符串
    var pager_count = new StringBuffer(); //计数字符串
    var pagerjs = new StringBuffer(); //javascrit字符串
    var Pagenum = 7;

    var mz_div_left = "<div class=\"tf_pager_div\"><div class=\"tf_pager_div_con\" >\r\n";
    var mz_div_right = "</div>\r\n</div>\r\n";

    if (Totle == 0) {
        return pager_str;
    }
    //#endregion 

    //#region 是否显示数字
    if (Number_showflag == 1) {
        PageIndex = parseInt(PageIndex);
        if (totlepage <= Pagenum) {
            for (var i = 0; i < totlepage; i++) {
                if (PageIndex == (i + 1)) {
                    pager_num.Append("<a class=\"tf_dqpage\" href=\"javascript:" + FunName + "(" + (i + 1) + ")\">" + (i + 1) + "</a>\r\n");
                } else {
                    pager_num.Append("<a href=\"javascript:" + FunName + "(" + (i + 1) + ")\">" + (i + 1) + "</a>\r\n");
                }
            }
        } else {
            if (PageIndex <= 4) {
                for (var i = 0; i < 7; i++) {
                    if (PageIndex == (i + 1)) {
                        pager_num.Append("<a class=\"tf_dqpage\" href=\"javascript:" + FunName + "(" + (i + 1) + ")\">" + (i + 1) + "</a>\r\n");
                    } else {
                        pager_num.Append("<a href=\"javascript:" + FunName + "(" + (i + 1) + ")\">" + (i + 1) + "</a>\r\n");
                    }
                }
            } else if (PageIndex > 4 && PageIndex < totlepage - 4) {
                var dangqian_1 = "";
                var dangqian_2 = "";
                var dangqian_3 = "";
                for (var i = 1; i <= 3; i++) { dangqian_1 += "<a href=\"javascript:" + FunName + "(" + (PageIndex - i) + ")\">" + (PageIndex - i) + "</a>\r\n"; }
                dangqian_2 = "<a class=\"tf_dqpage\" href=\"javascript:" + FunName + "(" + PageIndex + ")\">" + PageIndex + "</a>\r\n";
                for (var i = 1; i <= 3; i++) { dangqian_3 += "<a href=\"javascript:" + FunName + "(" + (PageIndex + i) + ")\">" + (PageIndex + i) + "</a>\r\n"; }

                pager_num.Append(dangqian_1 + dangqian_2 + dangqian_3);
            }
            if (PageIndex >= totlepage - 4) {

                for (var i = totlepage - Pagenum; i < totlepage; i++) {

                    if (PageIndex == (i + 1)) {
                        pager_num.Append("<a  class=\"tf_dqpage\" href=\"javascript:" + FunName + "(" + (i + 1) + ")\">" + (i + 1) + "</a>\r\n");
                    } else {
                        pager_num.Append("<a  href=\"javascript:" + FunName + "(" + (i + 1) + ")\">" + (i + 1) + "</a>\r\n");
                    }
                }
            }
        }
    }
    //#endregion

    //#region 是否显示首页或尾页
    if (Startandend_showflag == 1) {
        pager_sy.Append("<a href=\"javascript:" + FunName + "(1)\">首页</a>\r\n");
        pager_wy.Append("<a href=\"javascript:" + FunName + "(" + totlepage + ")\">尾页</a>\r\n");
    }
    //#endregion

    //#region 是否显示上一页下一页
    if (Upanddown_showflag == 1) {
        if (PageIndex == 1 && totlepage != 1) {
            pager_up.Append("<a>上一页</a>\r\n");
            pager_down.Append("<a href=\"javascript:" + FunName + "(" + (PageIndex + 1) + ")\">下一页</a>\r\n");

        }
        else if (PageIndex == 1 && totlepage == 1) {
            pager_up.Append("<a>上一页</a>\r\n");
            pager_down.Append("<a>下一页</a>\r\n");

        }
        if (PageIndex > 1 && PageIndex < totlepage) {

            pager_up.Append("<a href=\"javascript:" + FunName + "(" + (PageIndex - 1) + ")\">上一页</a>\r\n");
            pager_down.Append("<a href=\"javascript:" + FunName + "(" + (PageIndex + 1) + ")\">下一页</a>\r\n");

        }
        else if (PageIndex > 1 && PageIndex == totlepage) {

            pager_up.Append("<a href=\"javascript:" + FunName + "(" + (PageIndex - 1) + ")\">上一页</a>\r\n");
            pager_down.Append("<a>下一页</a>\r\n");
        }
        else if (PageIndex > 1 && PageIndex > totlepage) {

            pager_up.Append("<a href=\"javascript:" + FunName + "(" + (PageIndex - 1) + ")\">上一页</a>\r\n");
            pager_down.Append("<a href=\"javascript:" + FunName + "(" + totlepage + ")\">下一页</a>\r\n");
        }
    }
    //#endregion

    //#region 是否显示跳转
    if (Jump_showflag == 1) {

        pager_tz.Append("<span>第</span> <input id=\"txttf_myindexpage\" class=\"tf_pager_index\" type=\"text\" value='" + PageIndex + "' onkeyup=\"this.value=this.value.replace(/\\D/g,'1');\" onafterpaste=\"this.value=this.value.replace(/\\D/g,'1')\" /> <span>页</span>\r\n");
        pager_tz.Append("<a class=\"tf_go_to\" href=\"javascript:tf_goto_life(" + totlepage + ");\">Go</a>\r\n");

        pagerjs.Append("<script type=\'text/javascript\'>\r\n");
        pagerjs.Append("    function tf_goto_life(tf_totlepage)\r\n");
        pagerjs.Append("    {\r\n");
        pagerjs.Append("        if (document.getElementById(\'txttf_myindexpage\') != null) {\r\n");
        pagerjs.Append("            var tf_dq_page_num = document.getElementById(\'txttf_myindexpage\').value;\r\n");
        pagerjs.Append("            if (tf_dq_page_num == \'\') { tf_dq_page_num = 1; document.getElementById(\'txttf_myindexpage\').value = \'1\'; " + FunName + "(tf_dq_page_num); return; }\r\n");
        pagerjs.Append("            else if (tf_dq_page_num <= 0) { tf_dq_page_num = 1; document.getElementById(\'txttf_myindexpage\').value = \'1\'; " + FunName + "(tf_dq_page_num); return; }\r\n");
        pagerjs.Append("            else if (tf_dq_page_num > tf_totlepage) { tf_dq_page_num = tf_totlepage; document.getElementById(\'txttf_myindexpage\').value = tf_totlepage; " + FunName + "(tf_dq_page_num); return; }\r\n");
        pagerjs.Append("            else { " + FunName + "(tf_dq_page_num); return; }\r\n");
        pagerjs.Append("        }\r\n");
        pagerjs.Append("    }\r\n");
        pagerjs.Append("</script>\r\n");
    }
    //#endregion

    //#region 是否显示分页信息
    if (Detail_showflag == 1) {
        pager_count.Append("<span>" + ((PageIndex - 1) * PageSize + 1) + " - " + (PageIndex * PageSize) + "</span><span>共 <font>" + Totle + "</font> 条</span>");
        pager_count.Append("<span>共 <font>" + totlepage + "</font> 页</span>\r\n");
    }
    //#endregion
    pager_str = mz_div_left + pager_sy.ToString() + pager_up.ToString() + pager_num.ToString() + pager_down.ToString() + pager_wy.ToString() + pager_tz.ToString() + pager_count.ToString() + mz_div_right + pagerjs.ToString();

    return pager_str;
}
//#endregion

//#region tf_textbox js  可编辑下拉框插件
$(function () {
    load_tf_textbox_dom_1();
});
function load_tf_textbox_dom_1() {   // 只做搜索
    var list = new Array;
    var list_class = $("div.tf_textbox_1");
    if (list_class.length > 0) {
        for (var i = 0; i < list_class.length; i++) {
            list.push($(list_class[i]).attr("id"));
        }
    }
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var tf_textbox = list[i];
            var html_1 = new StringBuffer;
            html_1.Append("<div class=\"tf_box\">\r\n");
            html_1.Append("<input id=\"" + tf_textbox + "_tf_text\" type=\"text\" class=\"tf_text\" onclick=\"show_tf_box_list('" + tf_textbox + "');\"/>\r\n");
            html_1.Append("<div id=\"" + tf_textbox + "_tf_btn\" class=\"tf_btn\"><i class=\"dot\"></i></div>\r\n");
            html_1.Append("</div>\r\n");
            $("#" + tf_textbox).html(html_1.ToString());
        }
    }
}
function load_tf_textbox_dom_2() {
    var list = new Array;
    var list_class = $("div.tf_textbox_2");
    if (list_class.length > 0) {
        for (var i = 0; i < list_class.length; i++) {
            list.push($(list_class[i]).attr("id"));
        }
    }
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var tf_textbox = list[i];
            var html_1 = new StringBuffer;
            html_1.Append("<div class=\"tf_box\">\r\n");
            html_1.Append("<input id=\"" + tf_textbox + "_tf_text\" type=\"text\" class=\"tf_text\" onclick=\"show_tf_box_list('" + tf_textbox + "');\"/>\r\n");
            html_1.Append("<div id=\"" + tf_textbox + "_tf_btn\" class=\"tf_btn\" onclick=\"add_tf_textbox_data('" + tf_textbox + "')\"><i class=\"dot\"></i></div>\r\n");
            html_1.Append("</div>\r\n");
            $("#" + tf_textbox).html(html_1.ToString());
        }
    }
}
function show_tf_box_list(tf_textbox) {
    var width = $("#" + tf_textbox).width() + 2;
    var left = $("#" + tf_textbox).offset().left;
    var top = $("#" + tf_textbox).offset().top + 23;
    var html_1 = new StringBuffer;
    $("#tf_box_list").css({ "width": width, "left": left, "top": top, "display": "block", "border": "solid 1px #ddd" });
    $("#tf_box_list").html("<ul></ul>\r\n");


    var source = $("#" + tf_textbox).attr("source");
    var json = get_tf_textbox_data(source);
    $("#" + tf_textbox).attr("item_count", json.length);
    if (json != null && json.length > 0) {
        var html = new StringBuffer;
        for (var i = 0; i < json.length; i++) {
            html.Append(`<li title="${json[i].zd_value}">${json[i].zd_value}</li>`)
        }
        html.Append("<li>关闭</li>");
        $("#tf_box_list ul").html(html.ToString());

    }
    else {
        $("#tf_box_list ul").html("<li>关闭</li>");
    }

    $("#tf_box_list ul").children().on('click', function () {
        $("#tf_box_list").css("display", "none");
        var value = $(this).html();
        if (value != "关闭") {
            $("#" + tf_textbox + "_tf_text").val(value);
        }
    });
}
function add_tf_textbox_data(tf_textbox) {
    var source = $("#" + tf_textbox).attr("source");
    var tf_box = $("#" + tf_textbox).children().eq(0);
    var input = $(tf_box).children().eq(0);
    var zd_value = $(input).val();
    var px = parseInt($("#" + tf_textbox).attr("item_count")) + 1;

    var JsonPara = { source: source, zd_value: zd_value, px: px };
    var apiurl = "api/zdpara/add";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        Toast("添加选项成功！");
        $("#" + tf_textbox + "_tf_text_").click();
    }
    else {
        alert(re_obj.msg);
    }
}
function get_tf_textbox_data(source) {
    var list_s = [source];
    var JsonPara = { list_s: list_s };
    var apiurl = "api/zdpara/get_list_by_source";
    var re_obj = tf_ajax(JsonPara, apiurl);
    return re_obj.data;
}
function get_tf_textbox_value(id) {
    var tf_box = $("#" + id).children().eq(0);
    var input = $(tf_box).children().eq(0);
    var value = $(input).val();
    return value;
}
function set_tf_textbox_value(id, value) {
    var tf_box = $("#" + id).children().eq(0);
    var input = $(tf_box).children().eq(0);
    $(input).val(value);
}
//#endregion

// #region 获取文件后缀名，通过文件类型下载文件
function extToMimes(ext) {
    var type = undefined;
    switch (ext) {
        case 'jpg': type = 'image/jpeg'; break;
        case 'png': type = 'image/png'; break;
        case 'jpeg': type = 'image/jpeg'; break;
        case 'gif': type = 'image/gif'; break;
        case 'bmp': type = 'image/bmp'; break;
        case 'txt': type = 'text/plain'; break;
        case 'xls': type = 'application/vnd.ms-excel'; break;
        case 'doc': type = 'application/msword'; break;
        case 'pdf': type = 'application/pdf'; break;
        case 'xlsx': type = 'application/vnd.ms-excel'; break;
        case 'csv': type = 'text/csv'; break;
        case 'mp4': type = 'video/mp4'; break;
        case 'avi': type = 'video/x-msvideo'; break;
        case 'WindowsMediaVideo': type = 'video/x-ms-wmv'; break;
        case 'mov': type = 'video/quicktime'; break;
        case 'flash': type = 'video/x-flv'; break;
        case 'mkv': type = 'video/x-matroska'; break;
        case 'mp3': type = 'audio/mpeg'; break;
        case 'wav': type = 'audio/wav'; break;
        case 'flac': type = 'audio/flac'; break;
        case 'aac': type = 'audio/aac'; break;
        case 'wma': type = 'audio/x-ms-wma'; break;
        default: type = 'text/plain'; break;
    }
    return type;
}

function downfile(byte, _type, name) {
    var fileType = this.extToMimes(_type);
    var bytes = new Uint8Array(byte);
    var blob = new Blob([bytes], { type: fileType });
    var eleLink = document.createElement('a');
    eleLink.download = name;
    eleLink.style.display = 'none';
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}
// #endregion

//#region 末尾进一
String.prototype.TrimStart = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(0, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(trimStr.length);
    }
    return temp;
};
String.prototype.TrimEnd = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(0, temp.length - trimStr.length);
    }
    return temp;
};
String.prototype.Trim = function (trimStr) {
    var temp = trimStr;
    if (!trimStr) { temp = " "; }
    return this.trimStart(temp).trimEnd(temp);
}

function get_xiaoshu_j1(num, weishu) {
    var result = 0;
    var re_str = "";
    var number = num.toString();;

    var zhengshu = number.split('.')[0];

    if (number.indexOf(".") == -1) {
        result = num;
    }
    else {
        var xiaoshu = number.split('.')[1];
        if (xiaoshu.Length <= weishu) {
            result = num;
        }
        else {
            var mowei = xiaoshu.substr(weishu);
            if (parseInt(mowei) > 0) {
                var b0 = "";
                if (weishu > 0) {
                    for (var i = 0; i < weishu; i++) {
                        b0 += "0";
                    }
                }
                var jiashu = "0." + b0 + "1";
                var jinshu = parseFloat(jiashu) * 10;
                var new_xiaoshu = xiaoshu.substr(0, weishu);//111111111
                re_str = zhengshu + "." + new_xiaoshu;
                var temp = parseFloat(re_str);
                result = temp + jinshu;
                result = get_xiaoshu_2(result, weishu);

            }
            else {
                re_str = zhengshu + "." + xiaoshu.substr(0, weishu);
                result = parseFloat(re_str);
            }
            var mynum = result.toString().TrimEnd('0').TrimEnd('.');
            result = parseFloat(mynum);

        }
    }
    result = get_xiaoshu_2(result, weishu);
    return result;
}
//#endregion

//#region 常用方法
//后台返回
//int count = 1;
//int num1 = 2;
//int num2 = 3;
//string result = "{\"count\":\"" + count + "\",\"num1\":\"" + num1 + "\",\"num2\":\"" + num2 + "\" }";
//Response.Write(result);

//前台接收
//var obj = eval("{(" + result + ")}");

//后台返回
//result = JsonConvert.SerializeObject(obj);

//前台接收
//var obj = JSON.parse(data.d);
/*常用方法封装 end*/

//SqlConnection con = tfef_db.Database.Connection as SqlConnection;


//json转对象或者集合
//result = JsonConvert.DeserializeObject < SMSResult > (result_temp);

//在集合中筛选集合
// var p_list = json.filter(p => p.p_id == 0);

//valueList.sort(function(a, b){if(a.排序字段< b.排序字段) return -1;if(a.排序字段 > b.排序字段) return 1;return 0;});


//求集合对象的cd_id最大的元素
//max_id =Math.max.apply(Math, json.filter(p => p.p_id == 0).map(function(o) {return o.cd_id}))

//删除集合中的某个字段
//list.map((item) =>{delete item["id"];});
//#endregion

//#region 设置cookie 用于切换页面自动刷新 单机
function setFlushCookie(name, value) {
    $.cookie(name, value, { expires: expiresDate, path: '/' });
}
//#endregion

//#region 初始化皮肤
function csh_skin() {
    var seled_skin = $.cookie('seled_skin');
    if (seled_skin) {
        $('.skin_sel_class').attr('href', `../C_Style/skin_theme/skin_${seled_skin}.css?random=${Math.random()}`);
        $("#skin_drop i").removeClass();
        $("#skin_drop i").addClass("skin_" + seled_skin);
    }
    else if (seled_skin == "undefined" || seled_skin == null) {
        $('.skin_sel_class').attr('href', `../C_Style/skin_theme/skin_1.css?random=${Math.random()}`);
        $("#skin_drop i").removeClass();
        $("#skin_drop i").addClass("skin_1");
    }
}
//#endregion

//#region 判空
function isUndefine(item) {
    if(item === 0 || item === "0") {
        return false;
    }
    if (item == undefined || item == null || item == "undefined" || item == "null" || item == "") {
        return true;
    }
    return false;
}
//#endregion

//#region 国际化1
function get_lan_new_list(xw_list, lan_list, moren_lan_id) {
    var xw_new_list = [];
    if (moren_lan_id == 1) {
        xw_new_list = xw_list;
    }
    else {
        if (xw_list.length > 0) {
            for (var i = 0; i < xw_list.length; i++) {
                var str = xw_list[i];
                var lan_obj = lan_list.find(p => p.Lg_1 == str);
                var str_new = "";
                if (isUndefine(lan_obj)) { str_new = str; }
                else {
                    if (moren_lan_id == 2) {
                        str_new = lan_obj.Lg_2;
                    }
                    else if (moren_lan_id == 3) {
                        str_new = lan_obj.Lg_3;
                    }
                }
                xw_new_list.push(str_new);
            }
        }
    }
    return xw_new_list;
}
//#endregion

//#region 国际化2 侧边栏专用
function get_lan_new_json(xw_json, lan_list, pp_zd, moren_lan_id) {

    if (xw_json.length > 0) {
        for (var i = 0; i < xw_json.length; i++) {

            var xw_obj = xw_json[i];
            var xw_str = xw_obj[pp_zd];

            var lan_obj = lan_list.find(p => p.Lg_1 == xw_str);

            var str_new = "";
            if (isUndefine(lan_obj)) { str_new = xw_str; }
            else {
                if (moren_lan_id == 1) {
                    str_new = lan_obj.Lg_1;
                }
                else if (moren_lan_id == 2) {
                    str_new = lan_obj.Lg_2;
                }
                else if (moren_lan_id == 3) {
                    str_new = lan_obj.Lg_3;
                }
            }
            xw_obj["pp_zd"] = str_new;
        }
    }
    return xw_json;
}
//#endregion

//#region 国际化xw_grid
function get_lan_new_xw_colName(xw_list) {
    try {
        var xw_new_list = [];
        var lan_list = JSON.parse(sessionStorage.getItem('language_list'));
        var moren_lan_id = JSON.parse($.cookie('moren_lan_id'));
    }
    catch {
        return xw_list;
    }

    if (isUndefine(lan_list)) { lan_list = get_lang_list_temp(); }
    if (isUndefine(moren_lan_id)) { moren_lan_id = 1; }

    // console.log("xwgrid", lan_list);
    // debugger;

    if (moren_lan_id == 1) {
        xw_new_list = xw_list;
    }
    else {
        if (xw_list.length > 0) {
            for (var i = 0; i < xw_list.length; i++) {
                var str = xw_list[i];
                var key_orgin = "Lg_1";
                var key = "Lg_" + moren_lan_id;
                var lan_obj = lan_list.find(p => p[key_orgin] == str);
                var str_new = "";
                if (isUndefine(lan_obj)) { str_new = str; }
                else {
                    str_new = lan_obj[key];
                }
                xw_new_list.push(str_new);
            }
        }
    }
    return xw_new_list;
}
//#endregion

//#region 国际化取单个
function get_lan_new_str(xw_str) {
    try {
        var lan_list = JSON.parse(sessionStorage.getItem('language_list'));
        var moren_lan_id = JSON.parse($.cookie('moren_lan_id'));
    }
    catch {
        return xw_str;
    }

    if (isUndefine(lan_list)) {
        lan_list = get_lang_list_temp();
        if (isUndefine(lan_list)) {
            return xw_str;
        }
    }
    if (isUndefine(moren_lan_id)) { moren_lan_id = 1; }

    // console.log("one", lan_list);
    // debugger;

    var new_xw_str = xw_str;
    if (moren_lan_id == 1) {
        new_xw_str = xw_str;
    }
    else if (moren_lan_id == 2) {
        var obj = lan_list.find(p => p.Lg_1 == xw_str);
        if (isUndefine(obj)) { new_xw_str = xw_str; }
        else { new_xw_str = obj.Lg_2; }
    }
    else if (moren_lan_id == 3) {
        var obj = lan_list.find(p => p.Lg_1 == xw_str);
        if (isUndefine(obj)) { new_xw_str = xw_str; }
        else { new_xw_str = obj.Lg_3; }
    }

    if (isUndefine(new_xw_str)) { new_xw_str = xw_str; }
    return new_xw_str;
}
//#endregion

//#region 深拷贝
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        // 如果不是对象或数组，直接返回
        return obj;
    }
    // 创建一个新的对象或数组
    let clone = Array.isArray(obj) ? [] : {};
    // 遍历对象或数组的每个属性
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 如果属性值是对象或数组，递归调用深拷贝
            clone[key] = deepClone(obj[key]);
        }
    }
    return clone;
}
//#endregion

//#region 国际化下拉框
function get_lan_select_para_json(para_json, cust_key) {
    var new_para_json = deepClone(para_json);
    try {
        var lan_list = JSON.parse(sessionStorage.getItem('language_list'));
        var moren_lan_id = JSON.parse($.cookie('moren_lan_id'));
    }
    catch {
        return new_para_json;
    }
    // console.log("select", lan_list);
    // debugger;
    if (isUndefine(lan_list)) {
        lan_list = get_lang_list_temp();
        if (isUndefine(lan_list)) {
            return new_para_json;
        }
    }
    if (isUndefine(moren_lan_id)) { moren_lan_id = 1; }

    for (var i = 0; i < new_para_json.length; i++) {
        var obj = new_para_json[i];
        var old_str = obj[cust_key];
        var key_orgin = "Lg_1";
        var key = "Lg_" + moren_lan_id;
        var new_obj = lan_list.find(p => p[key_orgin] == old_str);
        if (isUndefine(new_obj) || isUndefine(new_obj[key])) { obj[cust_key] = old_str; }
        else { obj[cust_key] = new_obj[key]; }
    }
    return new_para_json;
}
//#endregion

//#region 获取语言表
function get_lang_list_temp() {
    var JsonPara = { list_id: [8] };
    var apiurl = "api/lan_csh/get_list";
    var re_obj = tf_ajax_wtk(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        var lang_list = re_obj.data;
        sessionStorage.setItem('language_list', JSON.stringify(lang_list));
        return lang_list;
    }
}
//#endregion




