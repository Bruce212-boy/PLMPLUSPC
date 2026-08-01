$(document).ready(function () {
    get_para();
    // getdata(1);
    csh_skin();
    csh_getdata_1();
    getdata_1(1);
    get_all_qx_menu();
});

$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($("#con_kh").width() - 10);
    });
});

//#region 参数查询
var zt_json = null; var zt_flag_select = null;
var zw_json = null; var zw_id_select = null; // 职位
var bm_json = null; var bm_id_select = null; // 部门
var sp_json = null; var sp_id_select = null; // 水平
var qx_json = null; var qx_id_select = null;
let user_info = null;
function get_para() {
    // 公司架构信息
    let obj = get_me_obj();
    csh_company_struct(obj);
    user_info = obj;

    let JsonPara = { list_id: [CONSTANS.CTS_SYS_PARAM.BM_ID, CONSTANS.CTS_SYS_PARAM.ZW_ID, CONSTANS.CTS_SYS_PARAM.SP_ID] }
    let apiurl = APIS.APIS_USER_INFO.getYhzdParaByIDS;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let temp_list = re_obj.data;
    bm_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.BM_ID);
    zw_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.ZW_ID);
    sp_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.SP_ID);

    bm_id_select = Create_select("sel_bm_id", bm_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    zw_id_select = Create_select("sel_zw_id", zw_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    sp_id_select = Create_select("sel_sp_id", sp_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });

    // var re_obj = tf_ajax({ "": "" }, "api/zhiwei/get_list");
    // zw_json = re_obj.data;
    // zt_flag_select = Create_select("sel_zt_flag", zt_json, "para_title", "para_title", -1, { title: '请选择状态', value: -1 });
    // zw_id_select = Create_select("sel_zw_id", zw_json, "zw_id", "zw_name", -1, { title: '请选择职位', value: -1 });

    zt_json = [{ "para_title": "在职", "para_value": "1" }, { "para_title": "离职", "para_value": "0" }];
    zt_flag_select = Create_select("sel_zt_flag", zt_json, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });

    JsonPara = {};
    apiurl = APIS.APIS_PERMISSION.getPermsRoleList;
    re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    qx_json = re_obj.data;
    qx_id_select = Create_select("sel_qx_id", qx_json, "qx_id", "qx_title", -1, { title: get_lan_new_str("请选择"), value: -1 });
}
function get_select_name(temp, list, key_val, key_title) {
    if (isUndefine(list) || list.length == 0) { return temp; }
    let result = "";
    let temp_int = parseInt(temp);
    var p_obj = list.find(p => p[key_val] == temp_int);
    if (p_obj != null) { result = p_obj[key_title]; }
    return result;
}
function get_dd_zt_name(temp) {
    var result = "";
    var temp_int = parseInt(temp);
    var p_obj = dd_zt_json.find(p => p.para_value == temp_int);
    if (p_obj != null) { result = p_obj.para_title; }
    return result;
}

//#endregion

//#region 获取用户信息
function get_me_obj() {
    let JsonPara = {}
    let apiurl = APIS.getUserInfo;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    return re_obj.data;
}
//#endregion

//#region 根据权限信息 展示公司结构
let company_struct_data = null;
let origin_company_data = null;
function csh_company_struct(obj) {
    let qx_id = obj.qx_id;

    let JsonPara = {}
    let apiurl = APIS.APIS_COMPANY_STRUCT.getCompanyList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    let temp_list = re_obj.data;
    temp_list.forEach(p => {
        p.children = [];
        p.spread = true;
    });
    if (CONSTANS.NORMAL_VAL.SENIOR_MANAGER_LIST.includes(qx_id)) {
        origin_company_data = temp_list;
        company_struct_data = pre_process_tree_data(origin_company_data, CONSTANS.NORMAL_VAL.ZERO);
    }
    else if (qx_id == CONSTANS.NORMAL_VAL.LEVEL_TWO_MANAGER) {
        origin_company_data = temp_list.filter(p => p.Lv > CONSTANS.NORMAL_VAL.PERM_TREE_LEVEL_ZERO);

        company_struct_data = pre_process_tree_data(origin_company_data, CONSTANS.NORMAL_VAL.ONE);
    }
    else if (qx_id == CONSTANS.NORMAL_VAL.LEVEL_THREE_MANAGER) {
        origin_company_data = temp_list.filter(p => p.Lv > CONSTANS.NORMAL_VAL.PERM_TREE_LEVEL_ONE);
        company_struct_data = pre_process_tree_data(origin_company_data, CONSTANS.NORMAL_VAL.TWO);
    }
    else {
        layer.alert("您不是管理员, 不具备该页面权限");
        location.href = '../main.html';
    }
}
function get_company_jc(temp) {
    if(isUndefine(temp)) { return ""; } 
    let obj = origin_company_data.find(p => p.gs_id == temp);
    if(isUndefine(obj)) { return ""; } 
    return obj.gs_jc;
}
//#endregion

//#region jqgrid 多选框
function set_jqg_select(json, para_title, para_value) {
    var val_t = json.map(item => item[para_title] + ":" + item[para_value]);
    var str = ``;
    val_t.forEach(e => {
        str += e + ";";
    });
    var res = str.slice(0, -1);
    return res;
}
//#endregion

//#region csh_getdata_1 
var yh_json = null;
function csh_getdata_1() {
    var colname_temp = ["ID", "所属公司", "用户名", "密码", "工号", "名字", "电话", "电脑授权码", "手机授权码",  "部门", "职位", "水平", "权限", "在职状态"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $("#con_kh").width(),
        height: $("#con_kh").height() - 20,
        colNames: colnames,
        colModel: [
            { name: "yh_id", width: 60, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "gs_id", width: 100, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: function(val) { return get_company_jc(val); }, hidden: false },
            { name: "username", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "password", width: 100, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "gonghao", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "name", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "tel", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "pc_code", width: 180, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "tel_code", width: 180, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "bm_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(bm_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return rowData.bm_title; } },
            { name: "zw_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(zw_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return rowData.zw_title; } },
            { name: "sp_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(sp_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return rowData.sp_title; } },
            { name: "qx_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(qx_json, "qx_title", "qx_id") }, formatter: function (val, a, b, rowData) { return get_quanxian_title(val, rowData); } },
            { name: "zt_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(zt_json, "para_title", "para_value") }, formatter: function (val, a, b, rowData) { return get_select_name(val, zt_json, "para_value", "para_title"); } },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
        },
        addRowCallback: function (dom_tr_id, dom_list_id) {
        },
        serNumber: true,
        all_row_edit: false,
        allow_drag_sel_con: true,
    }
    $("#list_1").xwgrid(json_th);
    $("#list_1").addGridHead("input_quary_getdata_1");
}
function getdata_1(pageindex) {
    var yh_id = $("#txt_head_list_1_yh_id").val();
    var username = $("#txt_head_list_1_username").val();
    var gonghao = $("#txt_head_list_1_gonghao").val();
    var name = $("#txt_head_list_1_name").val();
    var bm_id = $("#sel_head_list_1_bm_id").val();
    var zw_id = $("#sel_head_list_1_zw_id").val();
    var sp_id = $("#sel_head_list_1_sp_id").val();
    var qx_id = $("#sel_head_list_1_qx_id").val();
    var zt_id = $("#sel_head_list_1_zt_id").val();
    debugger
    var gs_id = $("#hid_add_head_query_gs_id").val(); if(isUndefine(gs_id)) { gs_id = 0; };

    var JsonPara = {
        pageindex: pageindex, yh_id: yh_id, username: username, gonghao: gonghao
        , name: name, bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, gs_id: gs_id, pagesize: 20
    };
    var apiurl = APIS.APIS_USER_INFO.getUserList;
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        yh_json = re_obj.data;
    }
    if (yh_json != null && yh_json.length > 0) {
        var pager_str = get_pager(pageindex, 20, re_obj.totle, "getdata");
        $("#pager").html(pager_str);
    }
    getdata_1_str(yh_json);
}
function getdata_1_str(json) {
    $("#list_1").gridUnload();
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            $("#list_1").addRowData(i + 1, json[i]);
        }
    }
}
function input_quary_getdata_1() {
    $(`input[id^="txt_head_list_1_"]`).on('keyup', function (e) {
        if ($(this).val() == "") {
            getdata_1(1);
            return;
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            getdata_1(1);
        }
    });

    $(`select[id^="sel_head_list_1"]`).on('change', function (e) {
        getdata_1(1);
    });


    let my_gs_obj = origin_company_data.find(p => p.gs_id == user_info.gs_id);
    let my_gs_jc = "";
    let my_gs_id = "";
    let Lv = "";
    if(isUndefine(my_gs_obj)) {
        layer.alert(get_lan_new_str("未找到本人公司,请联系管理员"));
        // return;
    }
    else {
        my_gs_jc = my_gs_obj.gs_jc;
        my_gs_id = my_gs_obj.gs_id;
        Lv = my_gs_obj.Lv;
    }
    $("#div_head_list_1_gs_id").css("cursor", "default")
    var html = new StringBuffer();
    html.Append(`<span id="span_query_gs_jc" aria-seled="false" style="border: 1px solid #000; cursor: pointer; user-select: none; padding: 0 3px;">${my_gs_jc}</span>\r\n`);
    html.Append(`<input type="hidden" id="hid_add_head_query_gs_id" value="${my_gs_id}">\r\n`);
    $("#div_head_list_1_gs_id").html(html.ToString());
    $("#span_query_gs_jc").on("click", function () {
        if(Lv >= CONSTANS.NORMAL_VAL.TWO) {
            return;
        }
        open_company_struct_tree(getdata_by_sel_gs_id);
    });

}
function get_touxiang(cellvalue, options, rowdata) {
    var img = "";
    if (cellvalue == "" || cellvalue == null) { img = "<img src=\"../../E_image/morentouxiang.png\" style=\"width:30px;height:30px;\">"; }
    else {
        var img_url = cellvalue;
        img = "<img src=\"" + img_url + "\" onclick=\"show_big_img('" + img_url + "')\" style=\"width:30px;height:30px;cursor:pointer;\">";
    }
    return img;
}

// gs_id 的公司树查询
function getdata_by_sel_gs_id(tk_index) {
    let gs_id = xw_get_layer_tree("list_company_detail");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_company_data.find(p => p.gs_id == gs_id);
    debugger
    $("#hid_add_head_query_gs_id").val(`${obj.gs_id}`);
    $("#span_query_gs_jc").text(`${obj.gs_jc}`);
    layer.close(tk_index);
    getdata_1(1);
}
//#endregion

//#region 添加用户
function csh_add_user() {
    let qx_id = user_info.qx_id;
    let gs_id = user_info.gs_id;
    let gs_jc = user_info.gs_jc;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("用户名")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_username" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("密码")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_password" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("工号")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_gonghao" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("名字")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_name" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("电话")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_tel" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("部门")}</td>\r\n`);
    html.Append(`           <td colspan="2">${bm_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("职位")}</td>\r\n`);
    html.Append(`           <td colspan="2">${zw_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("水平")}</td>\r\n`);
    html.Append(`           <td colspan="2">${sp_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("权限")}</td>\r\n`);
    html.Append(`           <td colspan="2">${qx_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("状态")}</td>\r\n`);
    html.Append(`           <td colspan="2">${zt_flag_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);

    if(qx_id >= CONSTANS.NORMAL_VAL.LEVEL_THREE_MANAGER) {
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width: 85px">${get_lan_new_str("设置公司")}</td>\r\n`);
        html.Append(`           <td colspan="2"><div id="li_company_info" class="txt-left pdl5">${gs_jc}</div><input type="hidden" id="txt_li_company_info" value="${gs_id}"></td>\r\n`);
        // html.Append(`           <td id="btn_sel_company_tree" class="td_inner_selcon">选择</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`   </table>\r\n`);
    }
    else {
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width: 85px">${get_lan_new_str("设置公司")}</td>\r\n`);
        html.Append(`           <td><div id="li_company_info" class="txt-left pdl5"></div><input type="hidden" id="txt_li_company_info"></td>\r\n`);
        html.Append(`           <td id="btn_sel_company_tree" class="td_inner_selcon">选择</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`   </table>\r\n`);
    }

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("添加用户"),
        area: ["500px", "470px"], // 初始宽高
        // maxmin: true,
        success: function (layero, index) {
            // layer.full(index); // 最大化
            // $(".layui-layer-min").before(`<span onclick="csh_getdata_gd_discuss(); layer.msg('刷新成功');" class="layui-icon layui-icon-refresh" style="font-size: 12px"></span>`)
            $("#btn_submit").on('click', function () {
                add_user(tk_index);
            });
            $("#btn_sel_company_tree").on('click', function() {
                open_company_struct_tree(set_li_company);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function add_user(tk_index) {

    let username = $("#txt_username").val(); if (isUndefine(username)) { layer.msg(get_lan_new_str("请输入"));emit_required_input(); return; }
    let password = $("#txt_password").val(); if (isUndefine(password)) { layer.msg(get_lan_new_str("请输入"));emit_required_input(); return; }
    let gonghao = $("#txt_gonghao").val(); if (isUndefine(gonghao)) { layer.msg(get_lan_new_str("请输入"));emit_required_input(); return; }
    let name = $("#txt_name").val(); if (isUndefine(name)) { layer.msg(get_lan_new_str("请输入"));emit_required_input(); return; }
    let tel = $("#txt_tel").val();
    let bm_id = $("#sel_bm_id").val(); if (bm_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let zw_id = $("#sel_zw_id").val(); if (zw_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let sp_id = $("#sel_sp_id").val(); if (sp_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let qx_id = $("#sel_qx_id").val(); if (qx_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let zt_id = $("#sel_zt_flag").val(); if (zt_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }

    let gs_id = $("#txt_li_company_info").val(); if(isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选择公司")); return; }
    

    let JsonPara = {
        username: username, password: password, gonghao: gonghao, name: name, tel: tel, bm_id: bm_id,
        zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, gs_id: gs_id
    }
    let apiurl = APIS.APIS_USER_INFO.addUser;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_1(1);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 修改用户
function csh_update_user() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    let qx_id = user_info.qx_id;
    let gs_id = user_info.gs_id;
    let gs_jc = user_info.gs_jc;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("用户名")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_username" value="${obj.username}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("密码")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_password" value="${obj.password}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("工号")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_gonghao" value="${obj.gonghao}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("名字")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_name" value="${obj.name}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("电话")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" id="txt_tel" value="${obj.tel}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("部门")}</td>\r\n`);
    html.Append(`           <td colspan="2">${bm_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("职位")}</td>\r\n`);
    html.Append(`           <td colspan="2">${zw_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("水平")}</td>\r\n`);
    html.Append(`           <td colspan="2">${sp_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("权限")}</td>\r\n`);
    html.Append(`           <td colspan="2">${qx_id_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("状态")}</td>\r\n`);
    html.Append(`           <td colspan="2">${zt_flag_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);

    if(qx_id >= CONSTANS.NORMAL_VAL.LEVEL_THREE_MANAGER) {
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width: 85px">${get_lan_new_str("设置公司")}</td>\r\n`);
        html.Append(`           <td colspan="2"><div id="li_company_info" class="txt-left pdl5">${gs_jc}</div><input type="hidden" id="txt_li_company_info" value="${gs_id}"></td>\r\n`);
        // html.Append(`           <td id="btn_sel_company_tree" class="td_inner_selcon">选择</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`   </table>\r\n`);
    }
    else {
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width: 85px">${get_lan_new_str("设置公司")}</td>\r\n`);
        html.Append(`           <td><div id="li_company_info" class="txt-left">${get_company_jc(obj.gs_id)}</div><input type="hidden" id="txt_li_company_info" value="${obj.gs_id}"></td>\r\n`);
        html.Append(`           <td id="btn_sel_company_tree" class="td_inner_selcon">选择</td>\r\n`);
        html.Append(`       </tr>\r\n`);
    }
    html.Append(`   </table>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("修改用户"),
        area: ["500px", "470px"], // 初始宽高
        success: function (layero, index) {

            $("#sel_bm_id").val(obj.bm_id);
            $("#sel_zw_id").val(obj.zw_id);
            $("#sel_sp_id").val(obj.sp_id);
            $("#sel_qx_id").val(obj.qx_id);
            $("#sel_zt_flag").val(obj.zt_id);

            $("#btn_submit").on('click', function () {
                update_user(tk_index);
            });

            $("#btn_sel_company_tree").on('click', function() {

                open_company_struct_tree(set_li_company);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function update_user(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    let username = $("#txt_username").val(); if (isUndefine(username)) { layer.msg(get_lan_new_str("请输入")); return; }
    let password = $("#txt_password").val(); if (isUndefine(password)) { layer.msg(get_lan_new_str("请输入")); return; }
    let gonghao = $("#txt_gonghao").val(); if (isUndefine(gonghao)) { layer.msg(get_lan_new_str("请输入")); return; }
    let name = $("#txt_name").val(); if (isUndefine(name)) { layer.msg(get_lan_new_str("请输入")); return; }
    let tel = $("#txt_tel").val();
    let bm_id = $("#sel_bm_id").val(); if (bm_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let zw_id = $("#sel_zw_id").val(); if (zw_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let sp_id = $("#sel_sp_id").val(); if (sp_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let qx_id = $("#sel_qx_id").val(); if (qx_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let zt_id = $("#sel_zt_flag").val(); if (zt_id == "-1") { layer.msg(get_lan_new_str("请选择")); return; }
    let gs_id = $("#txt_li_company_info").val(); if (isUndefine(gs_id) || gs_id == 0 || gs_id == '0') { layer.msg(get_lan_new_str("请选择所属公司")); return; }

    let JsonPara = {
        username: username, password: password, gonghao: gonghao, name: name, tel: tel, bm_id: bm_id,
        zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, yh_id: obj.yh_id, gs_id: gs_id
    }
    let apiurl = APIS.APIS_USER_INFO.updateUser;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_1(1);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除用户
function csh_del_user() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.username} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { yh_id: obj.yh_id }
            let apiurl = APIS.APIS_USER_INFO.delUser;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                getdata_1(1);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion

//#region 清除pc授权码
function csh_clean_pc_code() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    layer.confirm(`${get_lan_new_str("确认清除")} ${obj.username} ${get_lan_new_str("授权码")}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { yh_id: obj.yh_id }
            let apiurl = APIS.APIS_USER_INFO.delPcCode;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                getdata_1(1);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion

//#region 清除tel授权码
function csh_clean_tel_code() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    layer.confirm(`${get_lan_new_str("确认清除")} ${obj.username} ${get_lan_new_str("授权码")}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { yh_id: obj.yh_id }
            let apiurl = APIS.APIS_USER_INFO.delTelCode;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                getdata_1(1);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion

//#region 查看权限弹框
let all_qx_list = [];
function get_all_qx_menu() {
    let apiurl = APIS.APIS_PERMISSION.getPermisMenu;
    let re_obj = tf_ajax({}, apiurl);
    if (re_obj.flag != 1) { layer.alert(get_lan_new_str(re_obj.msg)); return; }
    all_qx_list = re_obj.data;
}
function get_quanxian_title(val, rowData) {
    let qx_title = rowData.qx_title;
    return `<div onclick="csh_user_permison(${val})">${qx_title}</div>`
}
function csh_user_permison(val) {
    debugger
    var JsonPara = { qx_id: val };
    var apiurl = APIS.APIS_PERMISSION.getPermisDetail;
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag != 1) { layer.alert(get_lan_new_str(re_obj.msg)); return; }
    let id_list = re_obj.data;
    let qx_list = [];
    for (let i = 0; i < id_list.length; i++) {
        let id = id_list[i];
        let obj = all_qx_list.find(p => p.cd_id == id);
        if (isUndefine(obj)) {
            continue;
        }
        qx_list.push(obj);
    }
    console.log("123", qx_list)

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px; background-color: #e1e1e1">${get_lan_new_str('菜单ID')}</td>\r\n`);
    html.Append(`           <td style="background-color: #e1e1e1">${get_lan_new_str('菜单名称')}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    for (let i = 0; i < qx_list.length; i++) {
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>${qx_list[i].cd_id}</td>\r\n`);
        html.Append(`           <td style="text-align: left; padding-left: 5px;">${qx_list[i].cd_title}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
    }
    html.Append(`   </table>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("职位权限"),
        area: ["400px", "400px"], // 初始宽高
        success: function (layero, index) {

        },
        end: function () {
        }
    });


}
//#endregion

//#region 树回调
function set_li_company(tk_index) {
    let gs_id = xw_get_layer_tree("list_company_detail");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_company_data.find(p => p.gs_id == gs_id);

    $("#txt_li_company_info").val(obj.gs_id);
    $("#li_company_info").text(obj.gs_jc);
    layer.close(tk_index);
}
//#endregion