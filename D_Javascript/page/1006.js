$(document).ready(function () {
    csh_skin();
    csh_UI_word();
    get_para();
    csh_getdata_1();
    getdata_1(1)
});

$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($(window).width() - 14);
        $("#list_2").setGridWid($(window).width() - 14);
        $("#list_3").setGridWid($(window).width() - 14);
    });
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

//#region 初始化信息
var zt_json = [{ "para_title": "可用", "para_value": "1" }, { "para_title": "废弃", "para_value": "0" }];
var zt_flag_select = null;
var zw_json = null;
var zw_json_select = null;
function get_para() {
    zt_flag_select = Create_select("sel_zt_flag", zt_json, "para_value", "para_title", -1, { title: '请选择状态', value: -1 });
    var JsonPara = {};
    var apiurl = "api.aspx/qx_get_qx";
    var re_obj = tf_ajax(JsonPara, apiurl)
    zw_json = re_obj.data;
    zw_json_select = Create_select("sel_qx_id", zw_json, "qx_id", "qx_name", -1, { title: '请选择职位', value: -1 });
}

function get_zt_name(temp) {
    var result = "";
    var temp_int = parseInt(temp);
    var p_obj = zt_json.find(p => p.para_value == temp_int);
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

//#region getdata_1
var yh_json = null;
function csh_getdata_1() {
    var json_opt = {
        height: $("#con_kh").height() - 103,//设置高度
        width: $("#con_kh").width() - 12,//设置宽度

        colNames: ['用户id', "头像", '登录账号', '用户名', '密码', '权限', '状态', "微信昵称", "微信授权码", "手机号"],
        colModel: [
            { name: 'yh_id', width: 40, sortable: false, align: 'center', key: true, hidden: true },
            { name: 'wx_headimgurl', width: 40, sortable: false, img_flag: true, align: 'center' },
            { name: 'username', width: 95, sortable: false, align: 'center' },
            { name: 'yh_name', width: 95, sortable: false, align: 'center' },
            { name: 'password', width: 95, sortable: false, align: 'center' },
            { name: 'qx_id', width: 95, sortable: false, align: 'center', formatter: function (val) { return get_zw_name(val); } },
            { name: 'zt_flag', width: 60, sortable: false, align: 'center', formatter: function (val) { return get_zt_name(val); } },
            { name: 'wx_nickname', width: 125, sortable: false, align: 'center' },
            { name: 'wx_openid', width: 165, sortable: false, align: 'left' },
            { name: 'tel', width: 135, sortable: false, align: 'center' }
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
        },
        serNumber: true,
    }
    $("#list_1").xwgrid(json_opt);
}

function getdata_1(pageindex) {
    $("#list_1").gridUnload();
    var ziduan = $("#ss_sel_ziduan").val();
    var mmkey = $("#ss_txt_key").val();
    var JsonPara = { pageindex: pageindex, ziduan: ziduan, mmkey: mmkey };
    var apiurl = "api.aspx/get_yh_list"
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        yh_json = re_obj.data;
        getdata_1_str(yh_json);
    }
}
function getdata_1_str(json) {
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            $("#list_1").addRowData(i + 1, json[i]);
        }
    }
    $("#list_1").addRowDataComplete();
}
//#endregion

//#region 添加用户
function add_csh() {
    var html = new StringBuffer;
    html.Append("    <div class=\"cz_title\"><span>添加用户</span><i class=\"tk_del_img\" onclick=\"un_tk_1();\"></i></div>\r\n");
    html.Append("    <div class=\"cz_con\" >\r\n");
    html.Append("    <form>")
    html.Append("        <table class=\"grid\" style=\"width:100%\">\r\n");
    html.Append("            <tr><td class=\"l\" style=\"width:85px\">登录账号</td><td><input id=\"txt_username\" type=\"text\"/></td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">用户名</td><td><input id=\"txt_yh_name\" type=\"text\" /></td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">密码</td><td><input id=\"txt_password\" type=\"text\" /></td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">职位</td><td>" + zw_json_select + "</td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">状态</td><td>" + zt_flag_select + "</td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">手机号</td><td><input id=\"txt_tel\" type=\"text\" /></td></tr>\r\n");
    html.Append("            <tr>\r\n");
    html.Append("                <td colspan=\"2\" class=\"c\"><input type=\"button\" value=\"添加用户\" class=\"anniu w80\" onclick=\"add()\"></td>\r\n");
    html.Append("            </tr>\r\n");
    html.Append("        </table>\r\n");
    html.Append("    <form>")
    html.Append("    </div>\r\n");
    tk_1(html.ToString());
}
function add() {
    var username = $("#txt_username").val(); if (username == "") { Toast("登录账号不能为空"); return; }
    var yh_name = $("#txt_password").val(); if (yh_name == "") { Toast("用户名不能为空"); return; }
    var password = $("#txt_password").val(); if (password == "") { Toast("密码不能为空"); return; }
    var qx_id = $("#sel_qx_id").val(); if (qx_id == "-1") { Toast("请选择职位"); return; }
    var zt_flag = $("#sel_zt_flag").val(); if (zt_flag == "") { Toast("请选择状态"); return; }
    var tel = $("#txt_tel").val();

    var JsonPara = { yh_name: yh_name, username: username, password: password, qx_id: qx_id, zt_flag: zt_flag, tel };
    var apiurl = "api.aspx/yh_add_yh";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        un_tk_1();
        Toast(re_obj.msg);
    }
    else {
        Toast(re_obj.msg);
    }
}
//#endregion

//#region 修改职位
function update_csh() {
    var list = xw_get_row("list_1");
    if (list.length == 0) { Toast("请选择一个用户"); return; }
    else if (list.length > 1) { Toast("只能选择一个用户"); return; }
    var yh_id = list[0].yh_id;
    var obj = yh_json.find(p => p.yh_id == yh_id);

    var html = new StringBuffer;
    html.Append("    <div class=\"cz_title\"><span>修改用户</span><i class=\"tk_del_img\"  onclick=\"un_tk_1();\"></i></div>\r\n");
    html.Append("    <div class=\"cz_con\" >\r\n");
    html.Append("    <form>")
    html.Append("        <table class=\"grid\" style=\"width:100%\">\r\n");
    html.Append("            <tr><td class=\"l\" style=\"width:85px\">登录账号</td><td><input id=\"txt_username\" type=\"text\" value=\"" + obj.username + "\"/></td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">用户名</td><td><input id=\"txt_yh_name\" type=\"text\" value=\"" + obj.yh_name + "\"/></td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">密码</td><td><input id=\"txt_password\" type=\"text\" value=\"" + obj.password + "\"/></td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">职位</td><td>" + zw_json_select + "</td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">状态</td><td>" + zt_flag_select + "</td></tr>\r\n");
    html.Append("            <tr><td class=\"l\">手机号</td><td><input id=\"txt_tel\" type=\"text\" value=\"" + (obj.tel == undefined ? "" : obj.tel) + "\"/></td></tr>\r\n");
    html.Append("            <tr>\r\n");
    html.Append("                <td colspan=\"2\" class=\"c\"><input type=\"button\" value=\"修改用户\" class=\"anniu w80\" onclick=\"update()\"></td>\r\n");
    html.Append("            </tr>\r\n");
    html.Append("        </table>\r\n");
    html.Append("    <form>")
    html.Append("    </div>\r\n");
    tk_1(html.ToString());
    $("#sel_zt_flag").val(obj.zt_flag);
    $("#sel_qx_id").val(obj.qx_id);
}
function update() {
    var list = xw_get_row("list_1");
    if (list.length == 0) { Toast("请选择一个职位"); return; }
    else if (list.length > 1) { Toast("只能选择一个职位"); return; }
    var yh_id = list[0].yh_id;
    var username = $("#txt_username").val(); if (username == "") { Toast("登录账号不能为空"); return; }
    var yh_name = $("#txt_yh_name").val(); if (yh_name == "") { Toast("用户名不能为空"); return; }
    var password = $("#txt_password").val(); if (password == "") { Toast("密码不能为空"); return; }
    var qx_id = $("#sel_qx_id").val(); if (qx_id == "-1") { Toast("请选择职位"); return; }
    var zt_flag = $("#sel_zt_flag").val(); if (zt_flag == "") { Toast("请选择状态"); return; }
    var tel = $("#txt_tel").val();

    var JsonPara = { yh_id: yh_id, yh_name: yh_name, username: username, password: password, qx_id: qx_id, zt_flag: zt_flag, tel: tel };
    var apiurl = "api.aspx/yh_update_yh";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        un_tk_1();
        Toast(re_obj.msg);
    }
    else {
        Toast(re_obj.msg);
    }
}
//#endregion

//#region 清空授权码
function wx_clear() {
    var list = xw_get_row("list_1");
    if (list.length == 0) { Toast("请选择一个职位"); return; }
    var yh_id = list[0].yh_id;

    var JsonPara = { yh_id: yh_id }
    var apiurl = 'api.aspx/yh_clear_wx';
    var re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        getdata_1(1);
        layer.msg(re_obj.msg);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion
