$(document).ready(function () {
    let flag = safety();
    if (flag) {
        csh_skin();
        csh_UI_word();
        get_me_obj();
        get_para();
        csh_getdata_1();
        getdata_1(1);
    }
});


$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($(".xw_left_con").width() - 14);
        $("#list_2").setGridWid($(".xw_right_con").width() - 14);
    });
});

//#region 获取用户信息
let api_flag = 2;
function get_me_obj() {
    let JsonPara = {}
    let apiurl = APIS.getUserInfo;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let userInfo = re_obj.data;
        if (CONSTANS.CTS_CUST_INFO.MANAGER_LIST.includes(userInfo.qx_id)) {
            api_flag = 1;
            let html = new StringBuffer();
            html.Append(`<div onclick="csh_set_owner();" class="top_box_btn_item"><span class="my-icon layui-icon layui-icon-set-fill"></span><span class="text fcc" data-word="设置归属人">设置归属人</span></div>\r\n`);
            $("div[data-expand]").prepend(html.ToString());
        }
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region get_para
var zt_json = null; var zt_id_select = null;
let kh_phase_json = null; let kh_phase_select = null;
let kh_level_json = null; let kh_level_select = null;
let kh_foreign_json = null; let kh_foreign_select = null;

let kh_industry_json = null; let kh_industry_select = null;
let kh_origin_json = null; let kh_origin_select = null;
let kh_type_json = null; let kh_type_select = null;

let nation_type = null; let nation_type_select = null;
let deal_type = null; let deal_type_select = null;
let city_json = null;

var zw_json = null; var zw_id_select = null; // 职位
var bm_json = null; var bm_id_select = null; // 部门
var sp_json = null; var sp_id_select = null; // 水平
function get_para() {
    city_json = tf_ajax_bd({}, "../D_Javascript/ht_kuangjia/city_code.json");
    BindSelect("sel_qb_sheng", city_json, "name", "name", -1, { title: get_lan_new_str('请选择省'), value: -1 })

    // shen_select = Create_select("sel_sheng", city_json, "name", "name", -1, { title: get_lan_new_str("请选择"), value: -1 });
    // shi_select = Create_select("sel_deal_type", deal_type, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });
    // xian_select = Create_select("sel_deal_type", deal_type, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });


    zt_json = [{ "para_title": "待审核", "para_value": "0" }, { "para_title": "审核通过", "para_value": "1" }, { "para_title": "审核失败", "para_value": "2" }];
    zt_json = get_lan_select_para_json(zt_json, "para_title");
    zt_id_select = Create_select("sel_zt_id", zt_json, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });

    nation_type = [{ "para_title": "国内", "para_value": "1" }, { "para_title": "国外", "para_value": "2" }];
    nation_type = get_lan_select_para_json(nation_type, "para_title");
    nation_type_select = Create_select("sel_nation_type", nation_type, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });

    deal_type = [{ "para_title": "是", "para_value": "1" }, { "para_title": "否", "para_value": "0" }];
    deal_type = get_lan_select_para_json(deal_type, "para_title");
    deal_type_select = Create_select("sel_deal_type", deal_type, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });

    // 获取客户 行业、来源、类型
    let JsonPara = { list_id: [CONSTANS.CTS_CUST_INFO.KH_INDUSTRY, CONSTANS.CTS_CUST_INFO.KH_ORIGIN, CONSTANS.CTS_CUST_INFO.KH_TYPE] }
    let apiurl = APIS.APIS_USER_INFO.getYhzdParaByIDS;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let yhzd_list = re_obj.data;
    kh_industry_json = yhzd_list.filter(p => p.type_id == CONSTANS.CTS_CUST_INFO.KH_INDUSTRY);
    kh_origin_json = yhzd_list.filter(p => p.type_id == CONSTANS.CTS_CUST_INFO.KH_ORIGIN);
    kh_type_json = yhzd_list.filter(p => p.type_id == CONSTANS.CTS_CUST_INFO.KH_TYPE);

    kh_industry_json = get_lan_select_para_json(kh_industry_json, "zd_2");
    kh_origin_json = get_lan_select_para_json(kh_origin_json, "zd_2");
    kh_type_json = get_lan_select_para_json(kh_type_json, "zd_2");

    kh_industry_select = Create_select("sel_kh_industry", kh_industry_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    kh_origin_select = Create_select("sel_kh_origin", kh_origin_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    kh_type_select = Create_select("sel_kh_type", kh_type_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });


    // 阶段、级别、国外区域
    JsonPara = { list_id: [CONSTANS.CTS_CUST_INFO.KH_PHASE, CONSTANS.CTS_CUST_INFO.KH_LEVEL, CONSTANS.CTS_CUST_INFO.KH_FOREIGN] }
    apiurl = APIS.APIS_USER_INFO.getSysParaByIDS;
    re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let sys_list = re_obj.data;
    kh_level_json = sys_list.filter(p => p.type_id == CONSTANS.CTS_CUST_INFO.KH_LEVEL);
    kh_foreign_json = sys_list.filter(p => p.type_id == CONSTANS.CTS_CUST_INFO.KH_FOREIGN);

    kh_level_json = get_lan_select_para_json(kh_level_json, "zd_2");
    kh_foreign_json = get_lan_select_para_json(kh_foreign_json, "zd_2");

    kh_level_select = Create_select("sel_kh_level", kh_level_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    kh_foreign_select = Create_select("sel_kh_foregin", kh_foreign_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });

    // 部门，水平
    JsonPara = { list_id: [CONSTANS.CTS_SYS_PARAM.ZW_ID, CONSTANS.CTS_SYS_PARAM.BM_ID, CONSTANS.CTS_SYS_PARAM.SP_ID] }
    apiurl = APIS.APIS_USER_INFO.getYhzdParaByIDS;
    re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let temp_list = re_obj.data;
    zw_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.ZW_ID);
    bm_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.BM_ID);
    sp_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.SP_ID);

    zw_id_select = Create_select("sel_zw_id", bm_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    bm_id_select = Create_select("sel_bm_id", bm_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    sp_id_select = Create_select("sel_sp_id", sp_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });

    // 客户阶段
    apiurl = APIS.APIS_CUST_INFO.getCustomPhase;
    re_obj = tf_ajax({}, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    kh_phase_json = re_obj.data;
    console.log('阶段', kh_phase_json)
    kh_phase_json = get_lan_select_para_json(kh_phase_json, "jd_name");
    kh_phase_select = Create_select("sel_kh_phase", kh_phase_json, "jd_id", "jd_name", -1, { title: get_lan_new_str("请选择"), value: -1 });

}
function get_tt_shi() {
    var sheng = $("#sel_qb_sheng").val();
    if (sheng == "-1") {
        $("#sel_qb_shi").empty();
        $("#sel_qb_shi").append("<option value=\"-1\">请选择市</option>");

        $("#sel_qb_xian").empty();
        $("#sel_qb_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    if (sheng == null) {
        $("#sel_qb_shi").empty();
        $("#sel_qb_shi").append("<option value=\"-1\">请选择市</option>");

        $("#sel_qb_xian").empty();
        $("#sel_qb_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    $("#sel_qb_xian").empty();
    $("#sel_qb_xian").append("<option value=\"-1\">请选择县</option>");
    var sheng_obj = city_json.find(p => p.name == sheng);
    var shi_list = sheng_obj.city;
    BindSelect("sel_qb_shi", shi_list, "name", "name", -1, { title: '请选择市', value: -1 });
}
function get_tt_xian() {
    var shi = $("#sel_qb_shi").val();
    if (shi == "-1") {
        $("#sel_qb_xian").empty();
        $("#sel_qb_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    if (shi == null) {
        $("#sel_qb_xian").empty();
        $("#sel_qb_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    var sheng = $("#sel_qb_sheng").val();
    if (sheng == "-1") { return; }
    if (sheng == null) { return; }
    var sheng_obj = city_json.find(p => p.name == sheng);
    var shi_list = sheng_obj.city;
    var shi_obj = shi_list.find(p => p.name == shi);
    var xian_list = shi_obj.area;
    if (xian_list.length > 0) {
        BindSelect("sel_qb_xian", xian_list, "name", "name", -1, { title: '请选择县', value: -1 });
    }
    else {
        $("#sel_qb_xian").empty();
        $("#sel_qb_xian").append("<option value=\"-1\">请选择县</option>");
    }
}
function get_select_name(temp, list, key_val, key_title) {
    if (isUndefine(list) || list.length == 0) { return temp; }
    let result = "";
    let temp_int = parseInt(temp);
    var p_obj = list.find(p => p[key_val] == temp_int);
    if (p_obj != null) { result = p_obj[key_title]; }
    return result;
}
function set_format_time(val) {
    var ftime = formartTime("yyyy-MM-dd", val)
    return ftime;
}
function set_format_time_2(val) {
    var ftime = formartTime("yyyy-MM-dd HH:mm:ss", val)
    return ftime;
}
function set_ok(val) {
    if (val == 1) {
        return `<div class="sh_pass_1" style="height: var(--xw-grid-tr-height); line-height: var(--xw-grid-tr-height); color: #000; width: 100%; border: none">${get_select_name(val, zt_json, "para_value", "para_title")}</div>`;
    }
    else {
        return `<div class="sh_pass_2" style="height: var(--xw-grid-tr-height); line-height: var(--xw-grid-tr-height); color: #000; width: 100%; border: none">${get_select_name(val, zt_json, "para_value", "para_title")}</div>`;
    }
}
//#endregion

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

//#region 截取
function substr_num(str, num) {
    try {
        if ((str + "").length > num) {
            return str.substring(0, num - 1);
        }
        return str;
    }
    catch {
        return str;
    }
}
//#endregion

//#region getdata_1
let kh_json = null;
function csh_getdata_1() {
    var colname_temp = ["客户ID", "客户编号", "客户简称", "国家类型", "国家名称", "省", "市", "县", "国内地址", "国外区域", "国外地址", "客户阶段", "客户级别"
        , "客户行业", "客户来源", "客户类型", "信用代码", "客户备注", "联系人", "联系电话", "归属人", "是否成交", "录入时间"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_left_con").width(),
        height: $(".xw_left_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "kh_id", width: 50, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "kh_bh", width: 65, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "kh_jc", width: 90, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "gj_type", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(nation_type, "para_title", "para_value") }, formatter: function (val, a, b, rowData) { return get_select_name(val, nation_type, "para_value", "para_title"); } },
            // { name: "shen", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", hidden: false, editoptions: { values: set_jqg_select(zt_json, "para_title", "para_value") }, formatter: function (val, a, b, rowData) { return set_ok(val); } },
            { name: "gj_name", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "sheng", width: 60, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "shi", width: 60, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "xian", width: 60, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "gn_xxdz", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },

            { name: "gw_qy", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(kh_foreign_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return get_select_name(val, kh_foreign_json, "zd_1", "zd_2"); }, hidden: false },
            { name: "gw_xxdz", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },

            { name: "kh_jd", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(kh_phase_json, "jd_name", "jd_id") }, formatter: function (val, a, b, rowData) { return get_select_name(val, kh_phase_json, "jd_id", "jd_name"); }, hidden: false },
            { name: "kh_jb", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(kh_level_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return get_select_name(val, kh_level_json, "zd_1", "zd_2"); }, hidden: false },
            { name: "kh_hy", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(kh_industry_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return get_select_name(val, kh_industry_json, "zd_1", "zd_2"); }, hidden: false },
            { name: "kh_ly", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(kh_origin_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return get_select_name(val, kh_origin_json, "zd_1", "zd_2"); }, hidden: false },
            { name: "kh_lx", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(kh_type_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return get_select_name(val, kh_type_json, "zd_1", "zd_2"); }, hidden: false },

            { name: "xydm", width: 80, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "kh_bz", width: 80, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cy_lxr", width: 80, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cy_lxr_tel", width: 80, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "gsr_id", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: function (val, a, b, rowData) { return rowData.gsr_name; }, hidden: api_flag != 1, },
            { name: "cj_flag", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(deal_type, "para_title", "para_value") }, formatter: function (val, a, b, rowData) { return get_select_name(val, deal_type, "para_value", "para_title"); } },
            { name: "time", width: 90, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: function (val) { return set_format_time(val); }, hidden: false },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
            // getdata_2();
        },
        addRowCallback: function (dom_tr_id, dom_list_id) {
            // $(`#${dom_tr_id}`).dblclick(function (e) {
            //     dbclick_open_page(e);
            // });
        },
        serNumber: true,
        all_row_edit: false,
        allow_drag_sel_con: true,
    }
    $("#list_1").xwgrid(json_th);
    $("#list_1").addGridHead("input_quary_getdata_1");
}
function getdata_1(pageindex) {
    let kh_id = $("#txt_head_list_1_kh_id").val();
    let kh_bh = $("#txt_head_list_1_kh_bh").val();
    let kh_jc = $("#txt_head_list_1_kh_jc").val();
    let gj_type = $("#sel_head_list_1_gj_type").val();
    let sheng = $("#sel_qb_sheng").val(); if (isUndefine(sheng)) { sheng = "-1"; }
    let shi = $("#sel_qb_shi").val(); if (isUndefine(shi)) { shi = "-1"; }
    let xian = $("#sel_qb_xian").val(); if (isUndefine(xian)) { xian = "-1"; }
    let gw_qy = $("#sel_head_list_1_gw_qy").val();
    let kh_jd = $("#sel_head_list_1_kh_jd").val();
    let kh_jb = $("#sel_head_list_1_kh_jb").val();
    let kh_hy = $("#sel_head_list_1_kh_hy").val();
    let kh_ly = $("#sel_head_list_1_kh_ly").val();
    let kh_lx = $("#sel_head_list_1_kh_lx").val();

    let xydm = $("#txt_head_list_1_xydm").val();
    let kh_bz = $("#txt_head_list_1_kh_bz").val();
    let cy_lxr = $("#txt_head_list_1_cy_lxr").val();

    let gsr_id = $("#hid_add_head_query_cz_gsr_id").val();
    let cj_flag = $("#sel_head_list_1_cj_flag").val();

    let start_time = $("#txt_qb_kh_start_time").val();
    let end_time = $("#txt_qb_kh_end_time").val();

    let JsonPara = {};
    let apiurl = "";
    JsonPara = {
        pageindex: pageindex, kh_id: kh_id, kh_bh: kh_bh, kh_jc: kh_jc, gj_type: gj_type, sheng: sheng
        , shi: shi, xian: xian, gw_qy: gw_qy, kh_jd: kh_jd, kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, xydm: xydm
        , kh_bz: kh_bz, cy_lxr: cy_lxr, cj_flag: cj_flag, start_time: start_time, end_time: end_time, pagesize: 20
    }
    apiurl = APIS.APIS_CUST_INFO.getListCustom3;

    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let json = re_obj.data;
        kh_json = json;
        getdata_1_str(json);
        if (json.length > 0) {
            var pager_str = get_pager(pageindex, 20, re_obj.totle, "getdata_1");
            $("#pager_1").html(pager_str);
        }
    }
    else {
        layer.alert("查询失败: " + re_obj.msg);
    }
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
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            getdata_1(1);
        }
    });

    $(`select[id^="sel_head_list_1_"]`).on('change', function (e) {
        getdata_1(1);
    });

    // if (api_flag == 1) {
    //     $("#div_head_list_1_gsr_id").css("cursor", "default")
    //     var html = new StringBuffer();
    //     html.Append(`<span id="span_query_cz_gsr" aria-seled="false" style="border: 1px solid #000; cursor: pointer; user-select: none; padding: 0 3px;">${get_lan_new_str("选择")}</span>\r\n`);
    //     html.Append(`<input type="hidden" id="hid_add_head_query_cz_gsr_id">\r\n`);
    //     $("#div_head_list_1_gsr_id").html(html.ToString());
    //     $("#span_query_cz_gsr").on("click", function () {
    //         var sel_yh_flag = $("#span_query_cz_gsr").attr("aria-seled");
    //         if (sel_yh_flag == "false") {
    //             xz_yh_layer(yyhgsr_query);
    //         }
    //         else if (sel_yh_flag == "true") {
    //             $("#hid_add_head_query_cz_gsr_id").val("");
    //             $("#span_query_cz_gsr").text("选择");
    //             $("#span_query_cz_gsr").attr("aria-seled", "false");
    //             getdata_1(1);
    //         }
    //     });
    // }
}
//#endregion

//#region 审核通过/不通过
function aduit_pass() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let sq_id = list_1[0].sq_id;

    let JsonPara = { sq_id: sq_id, zt_id: 1 }
    let apiurl = APIS.APIS_ADUIT_MACHINE.setAduitMachine;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        flush_return_now_page("pager_1", getdata_1, "list_1", "sq_id", sq_id);
        layer.msg(re_obj.msg);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
function aduit_rej() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let sq_id = list_1[0].sq_id;

    let JsonPara = { sq_id: sq_id, zt_id: 2 }
    let apiurl = APIS.APIS_ADUIT_MACHINE.setAduitMachine;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        flush_return_now_page("pager_1", getdata_1, "list_1", "sq_id", sq_id);
        layer.msg(re_obj.msg);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除申请
function csh_del_aduit() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let sq_id = list_1[0].sq_id;

    layer.confirm(`${get_lan_new_str("确认删除该申请")}: ${sq_id}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { sq_id: sq_id }
            let apiurl = APIS.APIS_ADUIT_MACHINE.delMachine;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                flush_return_now_page("pager_1", getdata_1);
                layer.msg(re_obj.msg);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );
}
//#endregion

//#region 刷新回到当前页面
function flush_return_now_page(pager_dom, _fun, list_dom, repeat_item, repeat_val) {
    var dq_pageindex = $(`#${pager_dom} .tf_dqpage`).html();
    if (isUndefine(dq_pageindex)) { _fun(1); return; }
    else { _fun(dq_pageindex); };
    if (!isUndefine(repeat_item) && !isUndefine(repeat_val) && !isUndefine(list_dom)) {
        var need_repeat = xw_get_repeat_sel(`${list_dom}`, `${repeat_item}`, repeat_val)
        xw_grid_td_click(need_repeat, `${list_dom}`);
    }
}
//#endregion

//#region 选择归属人 搜索或设置
let xzyh_lay_tk_index = null;
function xz_yh_layer(callback, mode_id) {
    let t_w_t = ["搜索客户"]
    let t_w_g = get_lan_new_xw_colName(t_w_t);
    var html = new StringBuffer;
    html.Append(`<div class="cz_con cust-cz-con ">\r\n`);

    let sstyle = "tk_con_height95";
    // if(!isUndefine(mode_id) && mode_id == CONSTANS.CTS_CUST_INFO.SET_OWNER_MODE) {
    //     html.Append(`    <div class="content">\r\n`);
    //     html.Append(`       <div class="top_box bbt_none">\r\n`);
    //     html.Append(`        <div class="top_box_btn_group">\r\n`);
    //     html.Append(`            <div id="btn_set_no_owner" class="top_box_btn_item add mgr5"><span class="my-icon layui-icon layui-icon-edit"></span><span class="text">${get_lan_new_str("设置公海")}</span></div>\r\n`);
    //     html.Append(`        </div>\r\n`);
    //     html.Append(`       </div>\r\n`);
    //     html.Append(`    </div>\r\n`);
    //     sstyle = "tk_con_height95-40";
    // }
    html.Append(`    <div class="clearfix ${sstyle}">\r\n`);
    html.Append(`       <div id='xzyh_con_lay' class="xw_grid_main xw_grid_main_style tk_con_height99-10"><div id="list_xzyh_lay" class='xw_grid_con'></div></div>\r\n`);
    html.Append(`       <div id="xzyh_pager_lay" class="pager pager-border bt-none"></div>`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    xzyh_lay_tk_index = layer.open({
        type: 1,
        title: get_lan_new_str(`选择归属人`),
        content: html.ToString(),
        area: [`500px`, `500px`],
        skin: "cust-open-page-skin",
        success: () => {
            $("#search_yyhkh").on("click", () => {
                get_data_xzyh_lay(1);
            });
            $("#txt_xz_kehu_yyh").on("input", () => {
                get_data_xzyh_lay(1);
            })

            if (!isUndefine(mode_id) && mode_id == CONSTANS.CTS_CUST_INFO.SET_OWNER_MODE) {
                $("#btn_set_no_owner").on("click", () => {
                    set_no_owner();
                })
            }

            csh_getdata_xzyh(callback);
        },
        end: () => {
            $("#search_yyhkh").off();
            $("#txt_xz_kehu_yyh").off();
            $("#btn_set_no_owner").off();
            xzyh_lay_tk_index = null;
        }
    });
}
function csh_getdata_xzyh(callback) {
    var colname_temp = ["ID", "名字", "职位", "部门", "水平"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $("#xzyh_con_lay").width() - 100,//设置宽度
        height: $("#xzyh_con_lay").height(),
        colNames: colnames,
        colModel: [
            { name: "yh_id", width: 60, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: true },
            { name: "name", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "zw_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(zw_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return rowData.zw_title; } },
            { name: "bm_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(bm_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return rowData.bm_title; } },
            { name: "sp_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(sp_json, "zd_2", "zd_1") }, formatter: function (val, a, b, rowData) { return rowData.sp_title; } },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
            if (!isUndefine(callback)) {
                callback();
            }
        },
        serNumber: true,
        all_row_edit: false,
    }
    $("#list_xzyh_lay").xwgrid(json_th);
    $("#list_xzyh_lay").addGridHead("input_quary_list_xzyh_lay");
    get_data_xzyh_lay(1);

}
function get_data_xzyh_lay(pageindex) {
    var yh_id = "";
    var username = "";
    var gonghao = "";
    var name = $("#txt_head_list_xzyh_lay_name").val();
    var bm_id = $("#sel_head_list_xzyh_lay_bm_id").val();
    var zw_id = $("#sel_head_list_xzyh_lay_zw_id").val();
    var sp_id = $("#sel_head_list_xzyh_lay_sp_id").val();
    var qx_id = "-1";
    var zt_id = "-1";

    var JsonPara = {
        pageindex: pageindex, yh_id: yh_id, username: username, gonghao: gonghao
        , name: name, bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, pagesize: 20
    };
    var apiurl = APIS.APIS_USER_INFO.getUserList;
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        let kh_list = re_obj.data;
        if (isUndefine(kh_list) || kh_list.length == 0) {
            layer.msg(get_lan_new_str("暂无数据"));
            get_data_xzyh_lay_str([]);
            return;
        }
        get_data_xzyh_lay_str(kh_list);
        var pager_str = get_pager(pageindex, 20, re_obj.totle, "get_data_xzyh_lay", 1, 1, 1, 0, 0);
        $("#xzyh_pager_lay").html(pager_str);
    }
}
function get_data_xzyh_lay_str(json) {
    $('#list_xzyh_lay').gridUnload();
    for (var i = 0; i < json.length; i++) {
        $("#list_xzyh_lay").addRowData(i + 1, json[i]);
    }
}
function input_quary_list_xzyh_lay() {
    $(`input[id^="txt_head_list_xzyh_lay_"]`).on('keyup', function (e) {
        if ($(this).val() == "") {
            get_data_xzyh_lay(1);
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            get_data_xzyh_lay(1);
        }
    });

    $(`select[id^="sel_head_list_xzyh_lay_"]`).on('change', function (e) {
        get_data_xzyh_lay(1);
    });
}
function yyhgsr_query() {
    let list_yyhkh = xw_get_row("list_xzyh_lay");
    if (list_yyhkh.length != 1) { layer.msg("请选一个归属人"); return; }
    let khobj = list_yyhkh[0];
    $("#hid_add_head_query_cz_gsr_id").val(khobj.yh_id);
    $("#span_query_cz_gsr").text(khobj.name);
    $("#span_query_cz_gsr").attr("aria-seled", "true");
    layer.close(xzyh_lay_tk_index)
    csh_getdata_xzyh(1);
}
//#endregion

//#region 添加客户
function csh_add_kh() {
    var sheng = new StringBuffer;
    sheng.Append("<select id=\"sel_sheng\" onchange=\"get_shi();\">")
    sheng.Append("<option value='-1'>请选择</option>\r\n");
    sheng.Append("</select>")

    var shi = "<select id=\"sel_shi\" onchange=\"get_xian();\"><option value='-1'>请选择</option></select>";
    var xian = "<select id=\"sel_xian\" ><option value='-1'>请选择</option></select>";

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('客户简称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_kh_jc"/></td>\r\n`);

    html.Append(`           <td style="width: 85px">${get_lan_new_str('客户全称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_kh_qc"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('国家类型')}</td>\r\n`);
    html.Append(`           <td>${nation_type_select}</td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('国家名称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_gj_name"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr data-china="1">\r\n`);
    html.Append(`           <td>${get_lan_new_str('省')}</td>\r\n`);
    html.Append(`           <td>${sheng.ToString()}</td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('市')}</td>\r\n`);
    html.Append(`           <td>${shi}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr data-china="1">\r\n`);
    html.Append(`           <td>${get_lan_new_str('县')}</td>\r\n`);
    html.Append(`           <td>${xian}</td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('国内地址')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_gn_xxdz"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr data-china="2">\r\n`);
    html.Append(`           <td>${get_lan_new_str('国外区域')}</td>\r\n`);
    html.Append(`           <td>${kh_foreign_select}</td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('国外地址')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_gw_xxdz"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户阶段')}</td>\r\n`);
    html.Append(`           <td>${kh_phase_select}</td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户级别')}</td>\r\n`);
    html.Append(`           <td>${kh_level_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户行业')}</td>\r\n`);
    html.Append(`           <td>${kh_industry_select}</td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户来源')}</td>\r\n`);
    html.Append(`           <td>${kh_origin_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户类型')}</td>\r\n`);
    html.Append(`           <td>${kh_type_select}</td>\r\n`);
    html.Append(`           <td colspan="2"></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('银行卡号')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_bankcard"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('银行名')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_bankname"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('银行行号')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_hanghao"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('信用代码')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_xydm"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('联系人')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_cy_lxr"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('联系电话')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_cy_lxr_tel"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户备注')}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" id="txt_edit_kh_bz"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('是否成交')}</td>\r\n`);
    html.Append(`           <td>${deal_type_select}</td>\r\n`);
    html.Append(`           <td colspan="2"></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`   </table>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("添加客户"),
        area: ["600px", "540px"], // 初始宽高
        success: function (layero, index) {

            $(`input[data-enter]`).on('keyup', function (e) {
                let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if (key == 13) {
                    e.preventDefault();
                    var currentInput = $(this);
                    var inputs = $('input[data-enter]:not([readonly])');
                    var currentIndex = inputs.index(currentInput);
                    var nextIndex = currentIndex + 1;

                    if (nextIndex < inputs.length) {
                        inputs.eq(nextIndex).focus();
                        inputs.eq(nextIndex).select();
                    } else {
                        inputs.eq(0).focus();
                        inputs.eq(nextIndex).select();
                    }
                }
            });

            csh_edit_dom();

            $("#btn_submit").on('click', function () {
                add_kh(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
            $("#sel_nation_type").off();
        }
    });
}
function add_kh(tk_index) {
    let kh_jc = $("#txt_edit_kh_jc").val();
    let kh_qc = $("#txt_edit_kh_qc").val();
    let gj_name = $("#txt_edit_gj_name").val();

    if (isUndefine(kh_jc) || isUndefine(kh_qc) || isUndefine(gj_name)) {
        emit_required_input();
        layer.msg(get_lan_new_str('请输入必选项'));
        return;
    }
    let gj_type = $("#sel_nation_type").val(); if (isMins1OrUndef(gj_type)) { layer.msg(get_lan_new_str('请选择国家类型')); return; }


    let sheng = $("#sel_sheng").val();
    let shi = $("#sel_shi").val();
    let xian = $("#sel_xian").val();
    let gn_xxdz = $("#txt_edit_gn_xxdz").val();

    let gw_qy = $("#sel_kh_foregin").val();
    let gw_xxdz = $("#txt_edit_gw_xxdz").val();

    if (gj_type == 1) {
        if (isUndefine(sheng) || sheng == "-1") {
            layer.msg(get_lan_new_str("省份必须选择"));
            return;
        }
        if (have_shi && (isUndefine(shi) || shi == "-1")) {
            layer.msg(get_lan_new_str("市必须选择"));
            return;
        }
        if (have_xian && (isUndefine(xian) || xian == "-1")) {
            layer.msg(get_lan_new_str("县必须选择"));
            return;
        }
        if (isUndefine(gn_xxdz)) {
            emit_required_input();
            layer.msg(get_lan_new_str("请输入必填项"));
            return;
        }
        gw_qy = "";
        gw_xxdz = "";
    }

    if (gj_type == 2) {
        if (isMins1OrUndef(gw_qy) || gw_qy == "-1") {
            layer.msg(get_lan_new_str("国外区域必须选择"));
            return;
        }
        if (isUndefine(gw_xxdz)) {
            emit_required_input();
            layer.msg(get_lan_new_str("请输入必填项"));
            return;
        }
    }

    let kh_jd = $("#sel_kh_phase").val();
    let kh_jb = $("#sel_kh_level").val();
    let kh_hy = $("#sel_kh_industry").val();
    let kh_ly = $("#sel_kh_origin").val();
    let kh_lx = $("#sel_kh_type").val();
    if (isMins1OrUndef(kh_jb) || isMins1OrUndef(kh_jd) || isMins1OrUndef(kh_hy)
        || isMins1OrUndef(kh_ly) || isMins1OrUndef(kh_lx)) {
        layer.msg(get_lan_new_str("请选择必选项"));
        return;
    }

    let bankcard = $("#txt_edit_bankcard").val();
    let bankname = $("#txt_edit_bankname").val();
    let hanghao = $("#txt_edit_hanghao").val();
    let xydm = $("#txt_edit_xydm").val();
    let cy_lxr = $("#txt_edit_cy_lxr").val();
    let cy_lxr_tel = $("#txt_edit_cy_lxr_tel").val();
    let kh_bz = $("#txt_edit_kh_bz").val();
    if (isUndefine(bankcard) || isUndefine(bankname) || isUndefine(xydm) || isUndefine(hanghao)
        || isUndefine(cy_lxr) || isUndefine(cy_lxr_tel)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请输入必填项"));
        return;
    }
    let cj_flag = $("#sel_deal_type").val();
    if (isMins1OrUndef(cj_flag)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请选择必选项"));
        return;
    }

    let JsonPara = {
        kh_jc: kh_jc, kh_qc: kh_qc, gj_type: gj_type, gj_name: gj_name, sheng: sheng,
        shi: shi, xian: xian, gn_xxdz: gn_xxdz, gw_qy: gw_qy, gw_xxdz: gw_xxdz, kh_jd: kh_jd,
        kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, bankcard: bankcard, bankname: bankname,
        hanghao: hanghao, xydm: xydm, cy_lxr: cy_lxr, cy_lxr_tel: cy_lxr_tel, kh_bz: kh_bz, cj_flag: cj_flag
    }
    let apiurl = APIS.APIS_CUST_INFO.addCustom;
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
function csh_edit_dom() {
    $("#sel_nation_type").on("change", function (e) {
        let val = $(this).val();
        if (val == CONSTANS.CTS_CUST_INFO.CHINA_FLAG) {
            $(`tr[data-china="2"]`).find('input').attr("placeholder", "");
            $(`tr[data-china="2"]`).find('input').removeClass("require_color");

            $(`tr[data-china="2"]`).find('input').prop('readonly', true);
            $(`tr[data-china='2']`).find('select').prop('disabled', true);
            $(`tr[data-china="2"]`).find('input').addClass('bg_ccc');
            $(`tr[data-china="2"]`).find('input').addClass('cor-notallow');

            $(`tr[data-china="1"]`).find('input').prop('readonly', false);
            $(`tr[data-china='1']`).find('select').prop('disabled', false);
            $(`tr[data-china="1"]`).find('input').removeClass('bg_ccc');
            $(`tr[data-china="1"]`).find('input').removeClass('cor-notallow');

            $(`#txt_edit_gj_name`).val("中国");
        }
        else if (val == CONSTANS.CTS_CUST_INFO.FOREGIN_FLAG) {
            $(`tr[data-china="1"]`).find('input').attr("placeholder", "");
            $(`tr[data-china="1"]`).find('input').removeClass("require_color");

            $(`tr[data-china="1"]`).find('input').prop('readonly', true);
            $(`tr[data-china='1']`).find('select').prop('disabled', true);
            $(`tr[data-china="1"]`).find('input').addClass('bg_ccc');
            $(`tr[data-china="1"]`).find('input').addClass('cor-notallow');

            $(`tr[data-china="2"]`).find('input').prop('readonly', false);
            $(`tr[data-china='2']`).find('select').prop('disabled', false);
            $(`tr[data-china="2"]`).find('input').removeClass('bg_ccc');
            $(`tr[data-china="2"]`).find('input').removeClass('cor-notallow');

            $(`#txt_edit_gj_name`).val("");
        }
        else {
            $(`tr[data-china="1"]`).find('input').prop('readonly', false);
            $(`tr[data-china='1']`).find('select').prop('disabled', false);
            $(`tr[data-china="1"]`).find('input').removeClass('bg_ccc');
            $(`tr[data-china="1"]`).find('input').removeClass('cor-notallow');

            $(`tr[data-china="2"]`).find('input').prop('readonly', false);
            $(`tr[data-china='2']`).find('select').prop('disabled', false);
            $(`tr[data-china="2"]`).find('input').removeClass('bg_ccc');
            $(`tr[data-china="2"]`).find('input').removeClass('cor-notallow');

            $(`#txt_edit_gj_name`).val("");
        }
        get_sheng(val);
    });

    $(`input[id^="txt_edit_"][required="true"]`).on("blur", function () {
        let readonly = $(this).prop('readonly');
        let disabled = $(this).prop('disabled');
        if (readonly == true || disabled == true) {
            return;
        }

        let val = $(this).val();
        if (isUndefine(val)) {
            $(this).attr("placeholder", get_lan_new_str("请输入必填项"));
            $(this).addClass("require_color");
        }
        else {
            $(this).attr("placeholder", "");
            $(this).removeClass("require_color");
        }
    });
}
// 设置禁用
function edit_not_allow_sel(val) {
    if (val == CONSTANS.CTS_CUST_INFO.CHINA_FLAG) {
        $(`tr[data-china="2"]`).find('input').attr("placeholder", "");
        $(`tr[data-china="2"]`).find('input').removeClass("require_color");

        $(`tr[data-china="2"]`).find('input').prop('readonly', true);
        $(`tr[data-china='2']`).find('select').prop('disabled', true);
        $(`tr[data-china="2"]`).find('input').addClass('bg_ccc');
        $(`tr[data-china="2"]`).find('input').addClass('cor-notallow');

        $(`tr[data-china="1"]`).find('input').prop('readonly', false);
        $(`tr[data-china='1']`).find('select').prop('disabled', false);
        $(`tr[data-china="1"]`).find('input').removeClass('bg_ccc');
        $(`tr[data-china="1"]`).find('input').removeClass('cor-notallow');
    }
    else if (val == CONSTANS.CTS_CUST_INFO.FOREGIN_FLAG) {
        $(`tr[data-china="1"]`).find('input').attr("placeholder", "");
        $(`tr[data-china="1"]`).find('input').removeClass("require_color");

        $(`tr[data-china="1"]`).find('input').prop('readonly', true);
        $(`tr[data-china='1']`).find('select').prop('disabled', true);
        $(`tr[data-china="1"]`).find('input').addClass('bg_ccc');
        $(`tr[data-china="1"]`).find('input').addClass('cor-notallow');

        $(`tr[data-china="2"]`).find('input').prop('readonly', false);
        $(`tr[data-china='2']`).find('select').prop('disabled', false);
        $(`tr[data-china="2"]`).find('input').removeClass('bg_ccc');
        $(`tr[data-china="2"]`).find('input').removeClass('cor-notallow');
    }
    else {
        $(`tr[data-china="1"]`).find('input').prop('readonly', false);
        $(`tr[data-china='1']`).find('select').prop('disabled', false);
        $(`tr[data-china="1"]`).find('input').removeClass('bg_ccc');
        $(`tr[data-china="1"]`).find('input').removeClass('cor-notallow');

        $(`tr[data-china="2"]`).find('input').prop('readonly', false);
        $(`tr[data-china='2']`).find('select').prop('disabled', false);
        $(`tr[data-china="2"]`).find('input').removeClass('bg_ccc');
        $(`tr[data-china="2"]`).find('input').removeClass('cor-notallow');
    }
}
function emit_required_input() {
    $(`input[id^="txt_edit_"][required="true"]`).each(function () {
        debugger
        let val = $(this).val();
        if (isUndefine(val)) {
            $(this).attr("placeholder", get_lan_new_str("请输入必填项"));
            $(this).addClass("require_color");
        }
    });
}
function get_sheng(gj_type) {
    $("#sel_sheng").empty();
    $("#sel_sheng").append("<option value=\"-1\">请选择省</option>");
    $("#sel_shi").empty();
    $("#sel_shi").append("<option value=\"-1\">请选择市</option>");
    $("#sel_xian").empty();
    $("#sel_xian").append("<option value=\"-1\">请选择县</option>");

    if (gj_type == CONSTANS.CTS_CUST_INFO.CHINA_FLAG) {
        debugger
        var sheng_list = city_json.map(function (e) {
            let obj = { "name": e.name };
            return obj;
        });
        BindSelect("sel_sheng", sheng_list, "name", "name", -1, { title: '请选择省', value: -1 });
    }
}
let have_shi = false;
function get_shi() {
    var sheng = $("#sel_sheng").val();
    $("#sel_xian").empty();
    $("#sel_xian").append("<option value=\"-1\">请选择县</option>");
    if (sheng == "-1") {
        $("#sel_shi").empty();
        $("#sel_shi").append("<option value=\"-1\">请选择市</option>");
        $("#sel_xian").empty();
        $("#sel_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    if (sheng == null) {
        $("#sel_shi").empty();
        $("#sel_shi").append("<option value=\"-1\">请选择市</option>");
        $("#sel_xian").empty();
        $("#sel_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    var sheng_obj = city_json.find(p => p.name == sheng);
    var shi_list = sheng_obj.city;
    if (!isUndefine(shi_list) && shi_list.length > 0) {
        have_shi = true;
    }
    BindSelect("sel_shi", shi_list, "name", "name", -1, { title: '请选择市', value: -1 });
}
let have_xian = false;
function get_xian() {
    var shi = $("#sel_shi").val();
    if (shi == "-1") {
        $("#sel_xian").empty();
        $("#sel_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    if (shi == null) {
        $("#sel_xian").empty();
        $("#sel_xian").append("<option value=\"-1\">请选择县</option>");
        return;
    }
    var sheng = $("#sel_sheng").val();
    if (sheng == "-1") { return; }
    if (sheng == null) { return; }
    var sheng_obj = city_json.find(p => p.name == sheng);
    var shi_list = sheng_obj.city;
    var shi_obj = shi_list.find(p => p.name == shi);
    var xian_list = shi_obj.area;
    var xian_list = sheng_obj.city;
    if (!isUndefine(xian_list) && xian_list.length > 0) {
        have_xian = true;
    }
    if (xian_list.length > 0) {
        BindSelect("sel_xian", xian_list, "name", "name", -1, { title: '请选择县', value: -1 });
    }
    else {
        $("#sel_xian").empty();
        $("#sel_xian").append("<option value=\"-1\">请选择县</option>");
    }
}
function isMins1OrUndef(item) {
    if (item == 0 || item == "0") {
        return false;
    }
    if (item == undefined || item == null || item == "undefined" || item == "null" || item == "" || item == "-1" || item == -1) {
        return true;
    }
    return false;
}
//#endregion

//#region 更新客户
function csh_update_kh() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = kh_json.find(p => p.kh_id == list_1[0].kh_id);

    var sheng = new StringBuffer;
    sheng.Append("<select id=\"sel_sheng\" onchange=\"get_shi();\">")
    sheng.Append("<option value='-1'>请选择</option>\r\n");
    $.each(city_json, function (i, val) {
        sheng.Append("<option value='" + val.name + "'>" + val.name + "</option>\r\n");
    });
    sheng.Append("</select>")

    var shi = "<select id=\"sel_shi\" onchange=\"get_xian();\"><option value='-1'>请选择</option></select>";
    var xian = "<select id=\"sel_xian\" ><option value='-1'>请选择</option></select>";

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con cz_middle">\r\n`);
    html.Append(`   <table name="mytable" class="grid cz_middle" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('客户简称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_kh_jc" value="${obj.kh_jc}"/></td>\r\n`);

    html.Append(`           <td style="width: 85px">${get_lan_new_str('客户全称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_kh_qc" value="${obj.kh_qc}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('国家类型')}</td>\r\n`);
    html.Append(`           <td>${nation_type_select}</td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('国家名称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_gj_name" value="${obj.gj_name}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr data-china="1">\r\n`);
    html.Append(`           <td>${get_lan_new_str('省')}</td>\r\n`);
    html.Append(`           <td>${sheng.ToString()}</td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('市')}</td>\r\n`);
    html.Append(`           <td>${shi}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr data-china="1">\r\n`);
    html.Append(`           <td>${get_lan_new_str('县')}</td>\r\n`);
    html.Append(`           <td>${xian}</td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('国内地址')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_gn_xxdz" value="${obj.gn_xxdz}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr data-china="2">\r\n`);
    html.Append(`           <td>${get_lan_new_str('国外区域')}</td>\r\n`);
    html.Append(`           <td>${kh_foreign_select}</td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('国外地址')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_gw_xxdz" value="${obj.gw_xxdz}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户阶段')}</td>\r\n`);
    html.Append(`           <td>${kh_phase_select}</td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户级别')}</td>\r\n`);
    html.Append(`           <td>${kh_level_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户行业')}</td>\r\n`);
    html.Append(`           <td>${kh_industry_select}</td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户来源')}</td>\r\n`);
    html.Append(`           <td>${kh_origin_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户类型')}</td>\r\n`);
    html.Append(`           <td>${kh_type_select}</td>\r\n`);
    html.Append(`           <td colspan="2"></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('银行卡号')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_bankcard" value="${obj.bankcard}"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('银行名')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_bankname" value="${obj.bankname}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('银行行号')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_hanghao" value="${obj.hanghao}"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('信用代码')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_xydm" value="${obj.xydm}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('联系人')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_cy_lxr" value="${obj.cy_lxr}"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('联系电话')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_cy_lxr_tel" value="${obj.cy_lxr_tel}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户备注')}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" id="txt_edit_kh_bz" value="${obj.kh_bz}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('是否成交')}</td>\r\n`);
    html.Append(`           <td>${deal_type_select}</td>\r\n`);
    html.Append(`           <td colspan="2"></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`   </table>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("更新客户"),
        area: ["600px", "540px"], // 初始宽高
        success: function (layero, index) {
            // 绑定选项卡
            $("#sel_nation_type").val(obj.gj_type);
            $("#sel_sheng").val(obj.sheng);
            get_shi();
            $("#sel_shi").val(obj.shi);
            get_xian();
            $("#sel_xian").val(obj.xian);
            $("#sel_kh_foregin").val(obj.gw_qy);
            $("#sel_kh_phase").val(obj.kh_jd);
            $("#sel_kh_level").val(obj.kh_jb);
            $("#sel_kh_industry").val(obj.kh_hy);
            $("#sel_kh_origin").val(obj.kh_ly);
            $("#sel_kh_type").val(obj.kh_lx);
            $("#sel_deal_type").val(obj.cj_flag);
            if (isUndefine(obj.gw_qy)) {
                $("#sel_kh_foregin").val("-1");
            }
            edit_not_allow_sel(obj.gj_type);

            $(`input[data-enter]`).on('keyup', function (e) {
                let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if (key == 13) {
                    e.preventDefault();
                    var currentInput = $(this);
                    var inputs = $('input[data-enter]').filter(function () {
                        return !$(this).attr('readonly') || $(this).attr('readonly') === 'false';
                    });
                    var currentIndex = inputs.index(currentInput);
                    var nextIndex = currentIndex + 1;

                    if (nextIndex < inputs.length) {
                        inputs.eq(nextIndex).focus();
                        inputs.eq(nextIndex).select();
                    } else {
                        inputs.eq(0).focus();
                        inputs.eq(nextIndex).select();
                    }
                }
            });

            csh_edit_dom();

            $("#btn_submit").on('click', function () {
                update_kh(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
            $("#sel_nation_type").off();
        }
    });
}
function update_kh(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = kh_json.find(p => p.kh_id == list_1[0].kh_id);
    let kh_id = obj.kh_id;

    let kh_jc = $("#txt_edit_kh_jc").val();
    let kh_qc = $("#txt_edit_kh_qc").val();
    let gj_type = $("#sel_nation_type").val(); if (isMins1OrUndef(gj_type)) { layer.msg(get_lan_new_str('请选择国家类型')); return; }
    let gj_name = $("#txt_edit_gj_name").val();

    if (isUndefine(kh_jc) || isUndefine(kh_qc) || isUndefine(gj_name)) {
        emit_required_input();
        layer.msg(get_lan_new_str('请输入必选项'));
        return;
    }

    let sheng = $("#sel_sheng").val();
    let shi = $("#sel_shi").val();
    let xian = $("#sel_xian").val();
    let gn_xxdz = $("#txt_edit_gn_xxdz").val();

    let gw_qy = $("#sel_kh_foregin").val();
    let gw_xxdz = $("#txt_edit_gw_xxdz").val();

    if (gj_type == 1) {
        if (isUndefine(sheng) || sheng == "-1") {
            layer.msg(get_lan_new_str("省份必须选择"));
            return;
        }
        if (have_shi && (isUndefine(shi) || shi == "-1")) {
            layer.msg(get_lan_new_str("市必须选择"));
            return;
        }
        if (have_xian && (isUndefine(xian) || xian == "-1")) {
            layer.msg(get_lan_new_str("县必须选择"));
            return;
        }
        if (isUndefine(gn_xxdz)) {
            layer.msg(get_lan_new_str("请输入必填项"));
            return;
        }
        gw_qy = "";
        gw_xxdz = "";
    }

    if (gj_type == 2) {
        if (isMins1OrUndef(gw_qy) || gw_qy == "-1") {
            layer.msg(get_lan_new_str("国外区域必须选择"));
            return;
        }
        if (isUndefine(gw_xxdz)) {
            emit_required_input();
            layer.msg(get_lan_new_str("请输入必填项"));
            return;
        }
        sheng = "";
        shi = "";
        xian = "";
        gn_xxdz = ""
    }

    let kh_jd = $("#sel_kh_phase").val();
    let kh_jb = $("#sel_kh_level").val();
    let kh_hy = $("#sel_kh_industry").val();
    let kh_ly = $("#sel_kh_origin").val();
    let kh_lx = $("#sel_kh_type").val();
    if (isMins1OrUndef(kh_jb) || isMins1OrUndef(kh_jd) || isMins1OrUndef(kh_hy)
        || isMins1OrUndef(kh_ly) || isMins1OrUndef(kh_lx)) {
        layer.msg(get_lan_new_str("请选择必选项"));
        return;
    }

    let bankcard = $("#txt_edit_bankcard").val();
    let bankname = $("#txt_edit_bankname").val();
    let hanghao = $("#txt_edit_hanghao").val();
    let xydm = $("#txt_edit_xydm").val();
    let cy_lxr = $("#txt_edit_cy_lxr").val();
    let cy_lxr_tel = $("#txt_edit_cy_lxr_tel").val();
    let kh_bz = $("#txt_edit_kh_bz").val();
    if (isUndefine(bankcard) || isUndefine(bankname) || isUndefine(xydm) || isUndefine(hanghao)
        || isUndefine(cy_lxr) || isUndefine(cy_lxr_tel)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请输入必填项"));
        return;
    }
    let cj_flag = $("#sel_deal_type").val();
    if (isMins1OrUndef(cj_flag)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请选择必选项"));
        return;
    }

    let JsonPara = {
        kh_id: kh_id,
        kh_jc: kh_jc, kh_qc: kh_qc, gj_type: gj_type, gj_name: gj_name, sheng: sheng,
        shi: shi, xian: xian, gn_xxdz: gn_xxdz, gw_qy: gw_qy, gw_xxdz: gw_xxdz, kh_jd: kh_jd,
        kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, bankcard: bankcard, bankname: bankname,
        hanghao: hanghao, xydm: xydm, cy_lxr: cy_lxr, cy_lxr_tel: cy_lxr_tel, kh_bz: kh_bz, cj_flag: cj_flag
    }
    let apiurl = APIS.APIS_CUST_INFO.updateCustom;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        flush_return_now_page("pager_1", getdata_1, "list_1", "kh_id", kh_id);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除客户
function csh_del_kh() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = list_1[0];

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.kh_jc} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { kh_id: obj.kh_id }
            let apiurl = APIS.APIS_CUST_INFO.delCustom;
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

//#region 设置归属人
function csh_set_owner() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = list_1[0];
    xz_yh_layer(set_owner, CONSTANS.CTS_CUST_INFO.SET_OWNER_MODE);
}
function set_owner() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项客户")); return; }
    let obj = list_1[0];
    let kh_id = obj.kh_id;

    let list_gsr = xw_get_row("list_xzyh_lay");
    if (list_gsr.length != 1) { layer.msg(get_lan_new_str("请选一项归属人")); return; }
    let obj2 = list_gsr[0];
    let gsr_id = obj2.yh_id;
    let gsr_name = obj2.name;

    layer.confirm(`${get_lan_new_str("确认设置")}: ${gsr_name} 为 ${obj.kh_jc} 的归属人 ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { kh_id: kh_id, gsr_id: gsr_id, gsr_name: gsr_name }
            let apiurl = APIS.APIS_CUST_INFO.setCustomOwner;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                layer.close(xzyh_lay_tk_index);
                flush_return_now_page("pager_1", getdata_1, "list_1", "kh_id", kh_id);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );

}
function set_no_owner() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项客户")); return; }
    let obj = list_1[0];
    let kh_id = obj.kh_id;

    layer.confirm(`${get_lan_new_str("确认设置为公海(无归属人)")} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { kh_id: kh_id, gsr_id: "", gsr_name: "" }
            let apiurl = APIS.APIS_CUST_INFO.setCustomOwner;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                layer.close(xzyh_lay_tk_index);
                flush_return_now_page("pager_1", getdata_1, "list_1", "kh_id", kh_id);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );

}
//#endregion 

//#region 导出Excel
function csh_export_excel() {
    let kh_id = $("#txt_head_list_1_kh_id").val();
    let kh_bh = $("#txt_head_list_1_kh_bh").val();
    let kh_jc = $("#txt_head_list_1_kh_jc").val();
    let gj_type = $("#sel_head_list_1_gj_type").val();
    let sheng = $("#sel_qb_sheng").val(); if (isUndefine(sheng)) { sheng = "-1"; }
    let shi = $("#sel_qb_shi").val(); if (isUndefine(shi)) { shi = "-1"; }
    let xian = $("#sel_qb_xian").val(); if (isUndefine(xian)) { xian = "-1"; }
    let gw_qy = $("#sel_head_list_1_gw_qy").val();
    let kh_jd = $("#sel_head_list_1_kh_jd").val();
    let kh_jb = $("#sel_head_list_1_kh_jb").val();
    let kh_hy = $("#sel_head_list_1_kh_hy").val();
    let kh_ly = $("#sel_head_list_1_kh_ly").val();
    let kh_lx = $("#sel_head_list_1_kh_lx").val();

    let xydm = $("#txt_head_list_1_xydm").val();
    let kh_bz = $("#txt_head_list_1_kh_bz").val();
    let cy_lxr = $("#txt_head_list_1_cy_lxr").val();

    let cj_flag = $("#sel_head_list_1_cj_flag").val();

    let start_time = $("#txt_qb_kh_start_time").val();
    let end_time = $("#txt_qb_kh_end_time").val();

    JsonPara = {
        kh_id: kh_id, kh_bh: kh_bh, kh_jc: kh_jc, gj_type: gj_type, sheng: sheng
        , shi: shi, xian: xian, gw_qy: gw_qy, kh_jd: kh_jd, kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, xydm: xydm
        , kh_bz: kh_bz, cy_lxr: cy_lxr, cj_flag: cj_flag, start_time: start_time, end_time: end_time
    }
    let apiurl = APIS.APIS_CUST_INFO.getListCustomAll3;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        export_excel(re_obj.data);
    }
    else {
        layer.alert(re_obj.msg);
    }

}
function export_excel(data_list) {
    var wb = XLSX.utils.book_new();
    var sub_info = [["客户ID", "客户编号", "客户简称", "国家类型", "国家名称", "省", "市", "县", "国内地址", "国外区域", "国外地址", "客户阶段", "客户级别"
        , "客户行业", "客户来源", "客户类型", "信用代码", "客户备注", "联系人", "联系电话", "归属人", "是否成交", "录入时间"]];

    var main_data = [];
    for (var i = 0; i < data_list.length; i++) {
        let obj = data_list[i];

        let gj_type = get_select_name(obj.gj_type, nation_type, "para_value", "para_title")
        let gw_qy = get_select_name(obj.gw_qy, kh_foreign_json, "zd_1", "zd_2");
        let kh_jd = get_select_name(obj.kh_jd, kh_phase_json, "jd_id", "jd_name");
        let kh_jb = get_select_name(obj.kh_jb, kh_level_json, "zd_1", "zd_2");
        let kh_hy = get_select_name(obj.kh_hy, kh_industry_json, "zd_1", "zd_2");
        let kh_ly = get_select_name(obj.kh_ly, kh_origin_json, "zd_1", "zd_2");
        let kh_lx = get_select_name(obj.kh_lx, kh_type_json, "zd_1", "zd_2");
        let cj_flag = get_select_name(obj.cj_flag, deal_type, "para_value", "para_title");
        let time = set_format_time(obj.time);

        var list_obj = [obj.kh_id, obj.kh_bh, obj.kh_jc,
            gj_type,
        obj.gj_name, obj.sheng, obj.shi, obj.xian, obj.gn_xxdz,
            gw_qy,
        obj.gw_xxdz
            , kh_jd, kh_jb, kh_hy, kh_ly, kh_lx,
        obj.xydm, obj.kh_bz, obj.cy_lxr, obj.cy_lxr_tel, obj.gsr_name,
            cj_flag,
            time]
        main_data.push(list_obj);
    }

    var tail_data = [["合计", "", "", "", "", "", "", "", "", "", ""]]

    var ws_options = {
        sheet: "Sheet1",
        raw: true
    };
    var ws = XLSX.utils.aoa_to_sheet(sub_info.concat(main_data), ws_options);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // 导出工作簿为Excel文件
    let day = diffDate(0);
    XLSX.writeFile(wb, `${day}_客户Excel.xlsx`);
}
//#endregion
