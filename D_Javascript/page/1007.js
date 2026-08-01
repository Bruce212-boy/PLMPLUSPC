$(document).ready(function () {
    csh_skin();
    csh_UI_word();
    get_para();
    csh_wode();
});


//#region 初始化界面文本
function csh_UI_word() {
    $('[data-word]').each(function () {
        var node = $(this);
        var old_str = node.attr('data-word');
        var new_str = get_lan_new_str(old_str);
        node.text(new_str);
    });
    $('[data-word-title]').each(function () {
        var node = $(this);
        var old_str = node.attr('data-word-title');
        var new_str = get_lan_new_str(old_str);
        node.attr('title', new_str);
    });
    $('[data-word-in-btn]').each(function () {
        var node = $(this);
        var old_str = node.attr('data-word-in-btn');
        var new_str = get_lan_new_str(old_str);
        node.attr('value', new_str);
    });
}
//#endregion

//#region get_para
var zw_zt_json = [{ "para_title": "可用", "para_value": "1" }, { "para_title": "废弃", "para_value": "0" }];
var zw_zt_flag_select = null;
var zw_json = null;
var zw_json_select = null;
function get_para() {
    var JsonPara = {};
    var apiurl = "api.aspx/qx_get_qx";
    var re_obj = tf_ajax(JsonPara, apiurl)
    zw_json = re_obj.data;
    zw_json_select = Create_select("sel_qx_id", zw_json, "qx_id", "qx_name", -1, { title: '请选择职位', value: -1 });

}
function get_zw_zt_name(temp) {
    var result = "";
    var temp_int = parseInt(temp);
    var p_obj = zw_zt_json.find(p => p.para_value == temp_int);
    if (p_obj != null) { result = p_obj.para_title; }
    return result;
}
function get_zw_name(temp) {
    var result = "";
    var temp_int = parseInt(temp);
    var p_obj = zw_json.find(p => p.qx_id == temp_int);
    if (p_obj != null) { result = p_obj.qx_name; }
    return result;
}
//#endregion

//#region 初始化
var yh_obj = null;
function csh_wode() {
    var apiurl = "api.aspx/get_caidan"
    var re_obj = tf_ajax({}, apiurl);
    if (re_obj.flag == 1) {
        yh_obj = re_obj.data.yh_obj;
        wode_str();
    }
}
function wode_str() {
    $("#td_username").html(yh_obj.username);
    $("#td_password").html("********");
    $("#td_yh_name").html(yh_obj.yh_name);
    $("#txt_tel").val(yh_obj.tel);
    $("#td_yh_zt").html(get_zw_zt_name(yh_obj.zt_flag));
    $("#td_qx_title").html(yh_obj.qx_name);
    $("#td_wx_openid").html(yh_obj.wx_openid);
    $("#td_wx_nickname").html(yh_obj.wx_nickname);
    $("#my_img").attr("src", yh_obj.wx_headimgurl)
    $("#my_img").attr("data-original", yh_obj.wx_headimgurl)
    $("#my_img").on("click", function() {
        if(yh_obj.wx_headimgurl == undefined) {
            $("#my_img").attr("src", "../../E_image/moren.png")
            show_big_img("../../E_image/moren.png");
        }
        else {
            show_big_img(yh_obj.wx_headimgurl)
        }
    })
}
//#endregion

//#region 修改手机号
function update_tel() {
    var tel = $("#txt_tel").val();
    var JsonPara = { tel: tel }
    var apiurl = 'api.aspx/up_me_tel';
    var re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        csh_wode();
        Toast(re_obj.msg);
    }
    else {
        alert(re_obj.msg);
    }
}
//#endregion

//#region 修改登录密码
function csh_update_pwd() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_title"><span>修改密码</span><i class="tk_del_img"  onclick="un_tk_1();"></i></div>\r\n`);
    html.Append(`   <div class="cz_con">\r\n`);
    html.Append(`        <table class="grid" style="width:100%">\r\n`);
    html.Append(`            <tr><td class="l" style="width: 85px">原始密码</td><td class="r" id="yanshi_pwd">********</td><td style="width: 2rem"><i id="eyes" class="layui-icon layui-icon-eye" style="cursor: pointer"></td></tr>\r\n`);
    html.Append(`            <tr><td class="l" style="width: 85px">新密码</td><td><input type="text" id="txt_new_pwd" /></td><td></td></tr>\r\n`);
    html.Append(`            <tr><td class="l" style="width: 85px">重复新密码</td><td><input type="text" id="txt_check_pwd" /></td><td></td></tr>\r\n`);
    html.Append(`            <tr>\r\n`);
    html.Append(`               <td colspan="3"><input type="button" value="确定修改" onclick="update_pwd()"></td>\r\n`);
    html.Append(`            </tr>\r\n`);
    html.Append(`           </table>\r\n`);
    html.Append(`</div>\r\n`);
    tk_1(html.ToString());
    $("#eyes").on("mousedown", function () {
        $("#yanshi_pwd").html(yh_obj.password);
    })
    $("#eyes").on("mouseup", function () {
        $("#yanshi_pwd").html("********");
    })
}
function update_pwd() {
    var password = $("#txt_new_pwd").val(); if (password == "") { Toast("密码不能为空"); return; }
    var rePwd = $("#txt_check_pwd").val(); if (rePwd == "") { Toast("密码不能为空"); return; }
    if(password != rePwd) { Toast("两次输入的密码必须相同"); return; }
    var JsonPara = { password: password }
    var apiurl = 'api.aspx/up_me_password';
    var re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        un_tk_1();
        $.cookie('token', null,{ expires: -1, path: '/' });
        alert(re_obj.msg + "点击确定返回登录页面");
        setTimeout(function(){
            top.location.href = "../login.html"
        }, 1000);
    }
    else {
        alert(re_obj.msg);
    }
}
//#endregion
