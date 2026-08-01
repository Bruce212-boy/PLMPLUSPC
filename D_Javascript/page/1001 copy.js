$(document).ready(function () {
    // let flag = safety();
    // if (flag) {
    //     csh_skin();
    //     csh_UI_word();
    //     get_para();
    //     get_me_obj_2();
    //     // get_para_2();
    //     csh_getdata_1();
    //     getdata_1(1);
    //     senior_search_data_1();
    // }
    test();
    let permObject = XWUTILS.getSafety();
    if (permObject.flag == 1) {
        initCustomerManagerPageInfo();
    }
});

$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($(".xw_left_con").width() - 14);
        $("#list_2").setGridWid($(".xw_right_con").width() - 14);
    });
});

let PERMS_CUST_INFO = {
    "ALL_MY_INFO_UP": 1,
    "ALL_MY_INFO_DOWN": 2,
    "ADD_CUST": 3,
    "UPDATE_CUST": 4,
    "DEL_CUST": 5,
    "EXPORT_EXCEL": 6,
    "SET_OWNER": 7,
    "SET_PUB_SEA": 8,
    "SALE_WORK_ORD": 9,
    "QUTATION_INFO": 10,
    "CONTRACT_INFO": 11,
    "PROJECT_INFO": 12,
    "SENIOR_CONTACT": 13,
    "ADD_SALE_WORK": 14,
    "UPDATE_SALE_WORK": 15,
    "DEL_SALE_WORK": 16,
    "ADD_QUTATION": 17,
    "UPDATE_QUTATION": 18,
    "DEL_QUTATION": 19,
    "ADD_CONTRACT": 20,
    "UPDATE_CONTRACT": 21,
    "DEL_CONTRACT": 22,
    "ADD_PROJECT": 23,
    "UPDATE_PROJECT": 24,
    "DEL_PROJECT": 25,
    "ADD_PROJ_WORK_ORD": 26,
    "UPDATE_PROJ_WORK_ORD": 27,
    "DEL_PROJ_WORK_ORD": 28
}

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
//#endregion

//#region 初始化权限按钮
function get_button_permission(btn_list) {
    if (isUndefine(btn_list) && btn_list.length == 0) { return; }
    let now_page_perms = new Set(btn_list);
    let dynamic_list = [
        {
            title: get_lan_new_str("导出Excel"),
            icon: 'export',
            callback: csh_export_excel,
            params: "",
            btncss: "",
            txtcss: "fcc",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.EXPORT_EXCEL,
            dom: "[data-area='one_box_qb']"
        },
        {
            title: get_lan_new_str("添加"),
            icon: 'addition',
            callback: csh_add_kh,
            params: "",
            btncss: "add_auto",
            txtcss: "",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.ADD_CUST,
            dom: "[data-area='one_box'].top_box .top_box_btn_group.mgl_left"
        },
        {
            title: get_lan_new_str("修改"),
            icon: 'edit',
            callback: csh_update_kh,
            params: "",
            btncss: "",
            txtcss: "fcc",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.UPDATE_CUST,
            dom: "[data-area='one_box'].top_box .top_box_btn_group.mgl_auto"
        },
        {
            title: get_lan_new_str("删除"),
            icon: 'delete',
            callback: csh_del_kh,
            params: "",
            btncss: "",
            txtcss: "fcc",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.DEL_CUST,
            dom: "[data-area='one_box'].top_box .top_box_btn_group.mgl_auto"
        },
    ]
    for (let i = 0; i < dynamic_list.length; i++) {
        let obj = dynamic_list[i];
        if (now_page_perms.has(obj.gn_id)) {
            renender_button(obj);
        }
    }

    let tab_dynamic_list = [
        {
            title: get_lan_new_str("高级联系人"),
            icon: '',
            callback: '',
            params: "",
            btncss: "",
            txtcss: "",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.SENIOR_CONTACT,
            position: CONSTANS.NORMAL_VAL.PRE_PEND,
            dom: `[data-area="two_box"] .top_box_tab_group`
        },
        {
            title: get_lan_new_str("项目信息"),
            icon: '',
            callback: '',
            params: "",
            btncss: "",
            txtcss: "",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.PROJECT_INFO,
            position: CONSTANS.NORMAL_VAL.PRE_PEND,
            dom: `[data-area="two_box"] .top_box_tab_group`
        },
        {
            title: get_lan_new_str("合同信息"),
            icon: '',
            callback: '',
            params: "",
            btncss: "",
            txtcss: "",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.CONTRACT_INFO,
            position: CONSTANS.NORMAL_VAL.PRE_PEND,
            dom: `[data-area="two_box"] .top_box_tab_group`
        },
        {
            title: get_lan_new_str("报价单"),
            icon: '',
            callback: '',
            params: "",
            btncss: "",
            txtcss: "",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.QUTATION_INFO,
            position: CONSTANS.NORMAL_VAL.PRE_PEND,
            dom: `[data-area="two_box"] .top_box_tab_group`
        },
        {
            title: get_lan_new_str("销售工单"),
            icon: '',
            callback: '',
            params: "",
            btncss: "active",
            txtcss: "",
            gn_id: BTN_PERMS.PERMS_CUST_INFO.SALE_WORK_ORD,
            position: CONSTANS.NORMAL_VAL.PRE_PEND,
            dom: `[data-area="two_box"] .top_box_tab_group`
        },
    ];
    for (let i = 0; i < tab_dynamic_list.length; i++) {
        let obj = tab_dynamic_list[i];
        if (now_page_perms.has(obj.gn_id)) {
            renender_tab_button(obj);
        }
    }
    bind_tab_btn();
}
function get_xwme_obj() {
    let JsonPara = {}
    let apiurl = APIS.getUserInfo;
    let re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let qx_id = re_obj.data.qx_id;
    let cd_id = CONSTANS.MENU_PERMS_ID.CUST_INFT;

    JsonPara = { cd_id: cd_id, qx_id: qx_id }
    apiurl = APIS.APIS_PERMISSION.getButtionPermisDetail;
    re_obj = tf_ajax(JsonPara, apiurl);

    return re_obj.data;
}

// 初始化下方按钮
let PAGE_CODE = CONSTANS.CTS_CUST_INFO.TAB_SALE_CODE;
function bind_tab_btn() {
    $("div[data-now-tab]").on('click', function () {
        let val = $(this).attr('data-now-tab');
        console.log(val);
        $("div[data-now-tab]").each((index, ele) => {
            $(ele).removeClass('active')
        });
        $(this).addClass('active');
        PAGE_CODE = val;
    });
}
function bind_tab_btn_add_class() {
    $("div[data-tab-btn-item='add']").on('click', function () {
        console.log(PAGE_CODE);
    });
    $("div[data-tab-btn-item='update']").on('click', function () {
        console.log(PAGE_CODE);
    });
    $("div[data-tab-btn-item='delete']").on('click', function () {
        console.log(PAGE_CODE);
    });
}
//#endregion

//#region 获取用户信息
let api_flag = 2;
function get_me_obj_2() {
    let JsonPara = {}
    let apiurl = APIS.getUserInfo;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let userInfo = re_obj.data;
        if (CONSTANS.CTS_CUST_INFO.MANAGER_LIST.includes(userInfo.qx_id)) {
            api_flag = 1;
            let html = new StringBuffer();
            html.Append(`<div onclick="csh_set_owner();" class="top_box_btn_item"><span class="my-icon layui-icon layui-icon-set-fill"></span><span class="text fcc" data-word="设置归属人">设置归属人</span></div>\r\n`);
            html.Append(`<div onclick="set_no_owner();" class="top_box_btn_item"><span class="my-icon layui-icon layui-icon-set"></span><span class="text fcc" data-word="设置公海">设置公海</span></div>\r\n`);
            $("div[data-expand]").prepend(html.ToString());
        }
    }
    else {
        layer.alert(re_obj.msg);
    }
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
let user_info;
function get_para() {
    // 公司架构信息
    let obj = get_me_obj();
    csh_company_struct(obj);
    user_info = obj;

    let btn_list = get_xwme_obj();
    get_button_permission(btn_list);

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
    let JsonPara = {
        list_id: [CONSTANS.CTS_CUST_INFO.KH_INDUSTRY, CONSTANS.CTS_CUST_INFO.KH_ORIGIN, CONSTANS.CTS_CUST_INFO.KH_TYPE
            , CONSTANS.CTS_SYS_PARAM.ZW_ID, CONSTANS.CTS_SYS_PARAM.BM_ID, CONSTANS.CTS_SYS_PARAM.SP_ID]
    }
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
    // 部门，水平
    zw_json = yhzd_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.ZW_ID);
    bm_json = yhzd_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.BM_ID);
    sp_json = yhzd_list.filter(p => p.type_id == CONSTANS.CTS_SYS_PARAM.SP_ID);

    zw_id_select = Create_select("sel_zw_id", bm_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    bm_id_select = Create_select("sel_bm_id", bm_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });
    sp_id_select = Create_select("sel_sp_id", sp_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });


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
    var colname_temp = ["客户ID", "公司", "所属公司", "客户编号", "客户简称", "国家类型", "国家名称", "省", "市", "县", "国内地址", "国外区域", "国外地址", "客户阶段", "客户级别"
        , "客户行业", "客户来源", "客户类型", "信用代码", "客户备注", "联系人", "联系电话", "E-mail", "归属人", "是否成交", "录入时间"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_left_con").width(),
        height: $(".xw_left_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "kh_id", width: 50, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "gs_id", width: 90, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "gs_jc", width: 80, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: true },
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
            { name: "cy_Email", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "gsr_id", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: function (val, a, b, rowData) { return isUndefine(rowData.gsr_name) ? CONSTANS.CTS_CUST_INFO.PUBLIC_SEA : rowData.gsr_name; }, hidden: api_flag != 1, },
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
    // let sheng = $("#sel_qb_sheng").val(); if (isUndefine(sheng)) { sheng = "-1"; }
    // let shi = $("#sel_qb_shi").val();     if (isUndefine(shi)) { shi = "-1"; }
    // let xian = $("#sel_qb_xian").val();   if (isUndefine(xian)) { xian = "-1"; }

    let sheng = $("#div_head_list_1_sheng").get_xwsle_val(); if (isUndefine(sheng)) { sheng = "-1"; }
    let shi = $("#div_head_list_1_shi").get_xwsle_val(); if (isUndefine(shi)) { shi = "-1"; }
    let xian = $("#div_head_list_1_xian").get_xwsle_val(); if (isUndefine(xian)) { xian = "-1"; }

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
    if (api_flag == 1) {
        JsonPara = {
            gsr_id: gsr_id,
            pageindex: pageindex, kh_id: kh_id, kh_bh: kh_bh, kh_jc: kh_jc, gj_type: gj_type, sheng: sheng
            , shi: shi, xian: xian, gw_qy: gw_qy, kh_jd: kh_jd, kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, xydm: xydm
            , kh_bz: kh_bz, cy_lxr: cy_lxr, cj_flag: cj_flag, start_time: start_time, end_time: end_time
        }
        apiurl = APIS.APIS_CUST_INFO.getListCustom1;
    }
    else if (api_flag == 2) {
        JsonPara = {
            pageindex: pageindex, kh_id: kh_id, kh_bh: kh_bh, kh_jc: kh_jc, gj_type: gj_type, sheng: sheng
            , shi: shi, xian: xian, gw_qy: gw_qy, kh_jd: kh_jd, kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, xydm: xydm
            , kh_bz: kh_bz, cy_lxr: cy_lxr, cj_flag: cj_flag, start_time: start_time, end_time: end_time
        }
        apiurl = APIS.APIS_CUST_INFO.getListCustom2;
    }

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

    let my_gs_obj = origin_company_data.find(p => p.gs_id == user_info.gs_id);
    let my_gs_jc = "";
    let my_gs_id = "";
    let Lv = "";
    if (isUndefine(my_gs_obj)) {
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
        if (Lv >= CONSTANS.NORMAL_VAL.TWO) {
            return;
        }
        open_company_struct_tree(set_list_1_li_company);
    });


    let sheng_dd_items = city_json.map(function (item) {
        let obj = {
            value: item.name,
            title: item.name,
        }
        return obj;
    });
    $("#div_head_list_1_sheng").xw_search_sel({
        dd_items: sheng_dd_items,
        correct_top: 23,
        correct_left: 0,
        dl_wid: 150,
        dl_hei: 150,
        input_hei: 26,
        placeholder: get_lan_new_str("请选择"),
        callback: set_xwsel_shi,
        parent_dom: "list_1",
        readonly: true,
        pure_sel_str: "全部",
        pure_sel_flag: true,
        pure_sel_val: "-1",
    });
    $("#div_head_list_1_shi").clear_xw_search_sel({
        placeholder: get_lan_new_str("请选择"),
        input_hei: 26,
        parent_dom: "list_1",
    });
    $("#div_head_list_1_xian").clear_xw_search_sel({
        placeholder: get_lan_new_str("请选择"),
        input_hei: 26,
        parent_dom: "list_1",
    });

    if (api_flag == 1) {
        $("#div_head_list_1_gsr_id").css("cursor", "default")
        var html = new StringBuffer();
        html.Append(`<span id="span_query_cz_gsr" aria-seled="false" style="border: 1px solid #000; cursor: pointer; user-select: none; padding: 0 3px;">${get_lan_new_str("选择")}</span>\r\n`);
        html.Append(`<input type="hidden" id="hid_add_head_query_cz_gsr_id">\r\n`);
        $("#div_head_list_1_gsr_id").html(html.ToString());
        $("#span_query_cz_gsr").on("click", function () {
            var sel_yh_flag = $("#span_query_cz_gsr").attr("aria-seled");
            if (sel_yh_flag == "false") {
                xz_yh_layer(yyhgsr_query);
            }
            else if (sel_yh_flag == "true") {
                $("#hid_add_head_query_cz_gsr_id").val("");
                $("#span_query_cz_gsr").text("选择");
                $("#span_query_cz_gsr").attr("aria-seled", "false");
                getdata_1(1);
            }
        });
    }
}
function set_list_1_li_company(tk_index) {
    let gs_id = xw_get_layer_tree("list_company_detail");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_company_data.find(p => p.gs_id == gs_id);

    $("#hid_add_head_query_gs_id").val(obj.gs_id);
    $("#span_query_gs_jc").text(obj.gs_jc);
    layer.close(tk_index);
}

function set_xwsel_shi() {
    $("#div_head_list_1_shi").unmount_xw_search_sel();
    $("#div_head_list_1_xian").unmount_xw_search_sel();
    $("#div_head_list_1_xian").clear_xw_search_sel({
        placeholder: get_lan_new_str("请选择"),
        input_hei: 26,
        parent_dom: "list_1",
    });

    let sheng = $("#div_head_list_1_sheng").get_xwsle_val();
    var sheng_obj;
    let shi_list;
    let srch_dd_items;
    if (!isUndefine(sheng) && sheng != "-1") {
        sheng_obj = city_json.find(p => p.name == sheng);
        shi_list = sheng_obj.city;
        srch_dd_items = shi_list.map(function (item) {
            let obj = {
                value: item.name,
                title: item.name,
            }
            return obj;
        });
        $("#div_head_list_1_shi").xw_search_sel({
            dd_items: srch_dd_items,
            correct_top: 23,
            correct_left: 0,
            dl_wid: 150,
            dl_hei: 150,
            input_hei: 26,
            placeholder: get_lan_new_str("请选择"),
            callback: set_xwsel_xian,
            parent_dom: "list_1",
            readonly: true,
            pure_sel_str: "全部",
            pure_sel_flag: true,
            pure_sel_val: "-1",
        });
    }
    else {
        $("#div_head_list_1_shi").clear_xw_search_sel({
            placeholder: get_lan_new_str("请选择"),
            input_hei: 26,
            parent_dom: "list_1",
        });
    }
    getdata_1(1);

}
function set_xwsel_xian() {
    $("#div_head_list_1_xian").unmount_xw_search_sel();

    let sheng = $("#div_head_list_1_sheng").get_xwsle_val();
    let shi = $("#div_head_list_1_shi").get_xwsle_val();
    let sheng_obj;
    let shi_list;
    let shi_obj;
    let xian_list;
    let srch_dd_items;
    if (!isUndefine(sheng) && sheng != "-1" && !isUndefine(shi) && shi != "-1") {
        sheng_obj = city_json.find(p => p.name == sheng);
        shi_list = sheng_obj.city;
        shi_obj = shi_list.find(p => p.name == shi);
        xian_list = shi_obj.area;

        srch_dd_items = xian_list.map(function (item) {
            let obj = {
                value: item.name,
                title: item.name,
            }
            return obj;
        });
        $("#div_head_list_1_xian").xw_search_sel({
            dd_items: srch_dd_items,
            correct_top: 23,
            correct_left: 0,
            dl_wid: 150,
            dl_hei: 150,
            input_hei: 26,
            placeholder: get_lan_new_str("请选择"),
            callback: getdata_1,
            callback_param: [1],
            parent_dom: "list_1",
            readonly: true,
            pure_sel_str: "全部",
            pure_sel_flag: true,
            pure_sel_val: "-1",
        });
    }
    else {
        $("#div_head_list_1_xian").clear_xw_search_sel({
            placeholder: get_lan_new_str("请选择"),
            input_hei: 26,
            parent_dom: "list_1",
        });
    }
    getdata_1(1);
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
        , name: name, bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id
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
    html.Append(`           <td><input data-enter type="text" id="txt_edit_bankcard"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('银行名称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_edit_bankname"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('银行行号')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_edit_hanghao"/></td>\r\n`);

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
    html.Append(`           <td>${get_lan_new_str('邮箱')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_cy_Email"/></td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('是否成交')}</td>\r\n`);
    html.Append(`           <td>${deal_type_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户备注')}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" id="txt_edit_kh_bz"/></td>\r\n`);
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

    let cy_Email = $("#txt_edit_cy_Email").val();

    let JsonPara = {
        kh_jc: kh_jc, kh_qc: kh_qc, gj_type: gj_type, gj_name: gj_name, sheng: sheng,
        shi: shi, xian: xian, gn_xxdz: gn_xxdz, gw_qy: gw_qy, gw_xxdz: gw_xxdz, kh_jd: kh_jd,
        kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, bankcard: bankcard, bankname: bankname,
        hanghao: hanghao, xydm: xydm, cy_lxr: cy_lxr, cy_lxr_tel: cy_lxr_tel, kh_bz: kh_bz, cj_flag: cj_flag,
        cy_Email: cy_Email
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
    html.Append(`           <td><input data-enter type="text" id="txt_edit_bankcard" value="${obj.bankcard}"/></td>\r\n`);

    html.Append(`           <td>${get_lan_new_str('银行名称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_edit_bankname" value="${obj.bankname}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('银行行号')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_edit_hanghao" value="${obj.hanghao}"/></td>\r\n`);

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
    html.Append(`           <td>${get_lan_new_str('邮箱')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required="true" id="txt_edit_kh_bz" value="${obj.cy_Email}"/></td>\r\n`);
    html.Append(`           <td>${get_lan_new_str('是否成交')}</td>\r\n`);
    html.Append(`           <td>${deal_type_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str('客户备注')}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" id="txt_edit_kh_bz" value="${obj.kh_bz}"/></td>\r\n`);
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

    let cy_Email = $("#txt_edit_kh_bz").val();

    let JsonPara = {
        kh_id: kh_id,
        kh_jc: kh_jc, kh_qc: kh_qc, gj_type: gj_type, gj_name: gj_name, sheng: sheng,
        shi: shi, xian: xian, gn_xxdz: gn_xxdz, gw_qy: gw_qy, gw_xxdz: gw_xxdz, kh_jd: kh_jd,
        kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx, bankcard: bankcard, bankname: bankname,
        hanghao: hanghao, xydm: xydm, cy_lxr: cy_lxr, cy_lxr_tel: cy_lxr_tel, kh_bz: kh_bz, cj_flag: cj_flag,
        cy_Email: cy_Email
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
    let apiurl = APIS.APIS_CUST_INFO.getListCustomAll;
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
        let kh_jd = get_select_name(obj.kh_jd, kh_phase_json, "zd_1", "zd_2");
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

//#region 复合多重查询
function senior_search_data_1() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("省")}</td>\r\n`);
    html.Append(`           <td></td>\r\n`);
    html.Append(`           <td class="td_inner_selcon" onclick="csh_muli_sel_sheng();">选择</td>\r\n`);
    html.Append(`           <td class="td_inner_selcon">清空</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>已选省份</td>\r\n`);
    html.Append(`           <td colspan="3"><div id="div_seled_sheng_area" class="div_seled_mul_area">123</div></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("区域")}</td>\r\n`);
    html.Append(`           <td><div id="li_cp_xl" class="pdl5 txt-left"></div></td>\r\n`);
    html.Append(`           <td class="td_inner_selcon" onclick="csh_sel_cp_xl();">选择</td>\r\n`);
    html.Append(`           <td class="td_inner_selcon">清空</td>\r\n`);
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
        title: get_lan_new_str("复合查询"),
        area: ["500px", "470px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_submit").on('click', function () {
                // add_prod(tk_index);
            });
        },
        end: function () {
        }
    });
}
//#endregion

//#region 选择多个省系列
function csh_muli_sel_sheng() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <div class="content">\r\n`);
    html.Append(`       <div class="top_box">\r\n`);
    html.Append(`           <div class="top_box_title">\r\n`);
    html.Append(`               全部省份\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`           <div class="top_box_btn_group">\r\n`);
    html.Append(`               <input id="txt_search_muli_sel_sheng" type="text" style="width: 85px; margin-right: 5px; background: #fff; height: 26px; line-height: 26px; font-size: 14px;">\r\n`);
    html.Append(`               <div id="btn_search_muli_sel_sheng" class="top_box_btn_item"><span class="my-icon layui-icon layui-icon-search"></span><span class="text fcc">搜索</span></div>\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`       </div>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`   <div id="div_muli_sel_sheng_area" class="div_file_area">\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_sumbit_mul" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    let tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("多选省份"),
        area: ["400px", "380px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_sumbit_mul").on('click', function () {
                set_mul_sel_sheng(tk_index);
            });
        },
        end: function () {
        }
    });

    $("#btn_search_muli_sel_sheng").on('click', function () {
        search_mul_sel_sheng();
    })
    $("#txt_search_muli_sel_sheng").on('keyup', function (e) {
        if ($(this).val() == "") {
            search_mul_sel_sheng();
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            search_mul_sel_sheng();
        }
    });
    get_muli_sel_sheng(tk_index);
}
function get_muli_sel_sheng(tk_index) {
    let html = new StringBuffer();
    // let sheng = city_json.filter(p => p.name);
    let sheng_list = city_json.map(p => p.name);

    for (let i = 0; i < sheng_list.length; i++) {
        let obj = sheng_list[i];
        html.Append(`       <div class="div_file_area_item" aria-item='${i}' sel-flag="false">\r\n`);
        html.Append(`           <div class="div_file_area_item2_text" mul-val="${obj}">${obj}</div>\r\n`);
        html.Append(`       </div>\r\n`);
    }
    $("#div_muli_sel_sheng_area").html(html.ToString());

    $("#div_muli_sel_sheng_area .div_file_area_item").on('click', function () {
        let ii = $(this).attr('aria-item');
        let obj = sheng_list[ii];
        let flag = $(this).attr("sel-flag");
        if (flag == "true") {
            $(this).find('.div_file_area_item2_text').removeClass('active')
            $(this).attr("sel-flag", "false");
        }
        else {
            $(this).find('.div_file_area_item2_text').addClass('active')
            $(this).attr("sel-flag", "true");
        }
    });
}
function search_mul_sel_sheng() {
    let val = $("#txt_search_muli_sel_sheng").val();
    let sheng_list = city_json.map(p => p.name);
    let filter_list = [];
    for (let i = 0; i < sheng_list.length; i++) {
        let obj = sheng_list[i];
        if (obj.includes(val)) {
            filter_list.push(obj);
        }
    }
    $("#div_muli_sel_sheng_area .div_file_area_item").each(function () {
        $(this).hide();
        let val = $(this).find(`.div_file_area_item2_text`).attr(`mul-val`);
        if (filter_list.includes(val)) {
            $(this).show();
        }
    });
}
function set_mul_sel_sheng(tk_index) {
    // $("#txt_search_muli_sel_sheng").val('');
    // search_mul_sel_sheng()
    let dom_list = $(`#div_muli_sel_sheng_area .div_file_area_item[sel-flag="true"]`);
    for (let i = 0; i < dom_list.length; i++) {
        let dom = dom_list[i];
        let a = $(dom).find(`.div_file_area_item2_text`).attr(`mul-val`);
        console.log(a, dom)
    }
}
//#endregion


// ----------------------------------------------

//#region generate 初始化下方事件
function get_para_2() {
    // bind_tab_btn();
    // bind_tab_btn_add_class();
}

//#endregion




// 重写，新的

//#region 异步初始化
async function initCustomerManagerPageInfo() {
    await getDataCustomerBaseParamsInfo();
    await initGetDataCustomerManagerList();
}
//#endregion

//#region 初始化客户全局信息
let customerBaseParamsInfo = {
    customerGrade: [],
    customerIndustry: [],
    customerSource: [],
    customerType: [],
    dealStatus: [],
    nationType: [],

    customerGradeSelect: null,
    customerIndustrySelect: null,
    customerSourceSelect: null,
    customerTypeSelect: null,
    dealStatusSelect: null,
    nationTypeSelect: null,
}
let userBaseParamsInfo = {
    loginUserInfo: {},
    loginUserCompanyList: [],
    loginUserCompanySelect: null,
}
async function getDataCustomerBaseParamsInfo() {
    let list_id = [
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_GRADE,
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_INDUSTRY,
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_SOURCE,
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_TYPE
    ];

    let JsonPara = { list_id: list_id }
    let apiurl = APIS.APIS_USER_PARAM.getListByTypeIDs;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_USER_BASE_FAIL);
        return;
    }
    let dataList = [...re_obj.data];
    let configs = [
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_GRADE,
            dataKey: 'customerGrade',
            selectKey: 'customerGradeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET // 1-从后端获取
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_INDUSTRY,
            dataKey: 'customerIndustry',
            selectKey: 'customerIndustrySelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_SOURCE,
            dataKey: 'customerSource',
            selectKey: 'customerSourceSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_TYPE,
            dataKey: 'customerType',
            selectKey: 'customerTypeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET
        },
        {
            dataKey: 'dealStatus',
            selectKey: 'dealStatusSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: [
                { "zd_1": CONSTANS.NORMAL_VAL.VAL_YES, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_DEAL_COMPLETED}` },
                { "zd_1": CONSTANS.NORMAL_VAL.VAL_NO, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_DEAL_PENDING}` }
            ]
        },
        {
            dataKey: 'nationType',
            selectKey: 'nationTypeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: [
                { "zd_1": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_DOMESTIC}` },
                { "zd_1": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_FOREIGN}` }
            ]
        }
    ];

    configs.forEach(config => {
        if (config.sourceType === 1) {
            customerBaseParamsInfo[config.dataKey] = dataList.filter(p => p.type_id == config.typeId);
        } else if (config.sourceType === 2) {
            customerBaseParamsInfo[config.dataKey] = config.staticData;
        }
        
        customerBaseParamsInfo[config.selectKey] = Create_select(
            config.selectKey,
            customerBaseParamsInfo[config.dataKey],
            "zd_1",
            "zd_2",
            -1,
            { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 }
        );
    });

    JsonPara = {}
    apiurl = APIS.getUserInfo;
    re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    userBaseParamsInfo.loginUserInfo = {...re_obj.data};
    console.log(userBaseParamsInfo.loginUserInfo)

    JsonPara = {}
    apiurl = APIS.APIS_USER_MANAGER.getLoginUserCompanyInfo;
    re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    let list = [...re_obj.data];
    // 公司
    
    // 如果权限是管理员可以看所有公司, 否则只能看自己所属公司
    let qx_id = 1;
    if(qx_id == CONSTANS.NORMAL_VAL.SYS_ADMIN_PERM) {
        userBaseParamsInfo.loginUserCompanyList = list;
        userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", list[0].gs_id, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: list[0].gs_id });
    }
    else {
        userBaseParamsInfo.loginUserCompanyList = list[0];
        userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", list[0].gs_id, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: list[0].gs_id });
    }
}
//#endregion

//#region 顶部 客户信息
async function test() {
    let kh_id = "";
    let kh_bh = "";
    let kh_jc = "";
    let kh_qc = "";
    let gs_id = "1";
    let gj_type = "-1";
    let list_gj_name = [];
    let list_sheng = [];
    let list_shi = [];
    let list_xian = [];
    let list_gw_qy = [];
    let gn_xxdz = "";
    // let kh_jd = "-1";
    let kh_jb = "-1";
    let kh_hy = "-1";
    let kh_ly = "-1";
    let kh_lx = "-1";
    let bankcard = "";
    let bankname = "";
    let hanghao = "";
    let xydm = "";
    let cy_lxr = "";
    let kh_bz = "";
    let gsr_id = "";
    let cj_flag = "-1";
    let start_time = "";
    let end_time = "";
    let pageindex = 1;

    let json = {
        kh_id: kh_id,
        kh_bh: kh_bh,
        kh_jc: kh_jc,
        kh_qc: kh_qc,
        gs_id: gs_id,
        gj_type: gj_type,
        list_gj_name: list_gj_name,
        list_sheng: list_sheng,
        list_shi: list_shi,
        list_xian: list_xian,
        list_gw_qy: list_gw_qy,
        gn_xxdz: gn_xxdz,
        // kh_jd: kh_jd,
        kh_jb: kh_jb,
        kh_hy: kh_hy,
        kh_ly: kh_ly,
        kh_lx: kh_lx,
        bankcard: bankcard,
        bankname: bankname,
        hanghao: hanghao,
        xydm: xydm,
        cy_lxr: cy_lxr,
        kh_bz: kh_bz,
        gsr_id: gsr_id,
        cj_flag: cj_flag,
        start_time: start_time,
        end_time: end_time,
        pageindex: pageindex
    }

    let JsonPara = json;
    let apiurl = 'api/kehu/get_list_kh_1';
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    console.log(re_obj.data)

}

//#region 获取客户信息
let listCustomerManager;
async function initGetDataCustomerManagerList() {
    let list = [];
    let origionList = [];
    let jExcelObj = getCustomerManagerOptions(list);
    listCustomerManager = $("#listCustomerManager").jexcel({
        data: jExcelObj.data,
        columns: jExcelObj.columns,
        originData: origionList,
        allowContextMenu: false,
    });
    listCustomerManager.createCustomHeader();
    $("#listCustomerManager [data-input-sign]").on("keyup", function (e) {
        if ($(this).val() == "") {
            getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.stopPropagation();
            getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
    });
    $("#listCustomerManager [data-select-sign]").on("change", function (e) {
        getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
    });
    await getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
    initCustomerManagerPager();
}
function getCustomerManagerOptions(list) {
    let columns = [
        { title: '客户ID', name: "kh_id", type: 'text', width: 50, readOnly: true },
        { title: '公司', name: "gs_id", type: 'text_select', width: 90, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", userBaseParamsInfo.loginUserCompanyList[0].gs_id, userBaseParamsInfo.loginUserCompanyList[0].gs_jc) },
        { title: '所属公司', name: "gs_jc", type: 'text', width: 80, readOnly: true },
        { title: '客户编号', name: "kh_bh", type: 'text', width: 65, readOnly: true },
        { title: '客户简称', name: "kh_jc", type: 'text', width: 90, readOnly: true },
        { title: '国家类型', name: "gj_type", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.nationType, "zd_1", "zd_2") },
        { title: '国家名称', name: "gj_name", type: 'text', width: 80, readOnly: true },
        { title: '省', name: "sheng", type: 'text', width: 60, readOnly: true, notHeadQuery: true },
        { title: '市', name: "shi", type: 'text', width: 60, readOnly: true, notHeadQuery: true },
        { title: '县', name: "xian", type: 'text', width: 60, readOnly: true, notHeadQuery: true },
        { title: '国内地址', name: "gn_xxdz", type: 'text', width: 80, readOnly: true },
        { title: '国外区域', name: "gw_qy", type: 'text', width: 80, readOnly: true },
        { title: '国外地址', name: "gw_xxdz", type: 'text', width: 80, readOnly: true },
        // { title: '客户阶段', name: "kh_jd", type: 'text', width: 80, readOnly: true },
        { title: '客户级别', name: "kh_jb", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerGrade, "zd_1", "zd_2") },
        { title: '客户行业', name: "kh_hy", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerIndustry, "zd_1", "zd_2") },
        { title: '客户来源', name: "kh_ly", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerSource, "zd_1", "zd_2") },
        { title: '客户类型', name: "kh_lx", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerType, "zd_1", "zd_2") },
        { title: '信用代码', name: "xydm", type: 'text', width: 80, readOnly: true },
        { title: '客户备注', name: "kh_bz", type: 'text', width: 80, readOnly: true },
        { title: '联系人', name: "cy_lxr", type: 'text', width: 80, readOnly: true },
        { title: '联系电话', name: "cy_lxr_tel", type: 'text', width: 80, readOnly: true },
        { title: 'E-mail', name: "cy_Email", type: 'text', width: 80, readOnly: true },
        { title: '归属人', name: "gsr_id", type: 'text', width: 80, readOnly: true },
        { title: '是否成交', name: "cj_flag", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.dealStatus, "zd_1", "zd_2") },
        { title: '录入时间', name: "time", type: 'text', width: 90, readOnly: true }
    ];
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
async function getDataCustomerManagerList(pageindex) {
    let kh_id = listCustomerManager.getCustomHeaderText("kh_id");
    let kh_bh = listCustomerManager.getCustomHeaderText("kh_bh");
    let kh_jc = listCustomerManager.getCustomHeaderText("kh_jc");
    let kh_qc = listCustomerManager.getCustomHeaderText("kh_qc");
    let gs_id = listCustomerManager.getCustomHeaderText("gs_id");
    let gj_type = listCustomerManager.getCustomHeaderText("gj_type");
    let list_gj_name = []
    let list_sheng = []
    let list_shi = []
    let list_xian = []
    let list_gw_qy = []
    let gn_xxdz = listCustomerManager.getCustomHeaderText("gn_xxdz");
    let kh_jb = listCustomerManager.getCustomHeaderText("kh_jb");
    let kh_hy = listCustomerManager.getCustomHeaderText("kh_hy");
    let kh_ly = listCustomerManager.getCustomHeaderText("kh_ly");
    let kh_lx = listCustomerManager.getCustomHeaderText("kh_lx");
    let bankcard = listCustomerManager.getCustomHeaderText("bankcard");
    let bankname = listCustomerManager.getCustomHeaderText("bankname");
    let hanghao = listCustomerManager.getCustomHeaderText("hanghao");
    let xydm = listCustomerManager.getCustomHeaderText("xydm");
    let cy_lxr = listCustomerManager.getCustomHeaderText("cy_lxr");
    let kh_bz = listCustomerManager.getCustomHeaderText("kh_bz");
    let gsr_id = listCustomerManager.getCustomHeaderText("gsr_id");
    let cj_flag = listCustomerManager.getCustomHeaderText("cj_flag");
    let start_time = $("#txtCustomerStartTime").val();
    let end_time = $("#txtCustomerEndTime").val();

    let JsonPara = {
        kh_id: kh_id, kh_bh: kh_bh, kh_jc: kh_jc, kh_qc: kh_qc,
        gs_id: gs_id, gj_type: gj_type,
        list_gj_name: list_gj_name,
        list_sheng: list_sheng, list_shi: list_shi, list_xian: list_xian,
        list_gw_qy: list_gw_qy,
        gn_xxdz: gn_xxdz, kh_jb: kh_jb, kh_hy: kh_hy, kh_ly: kh_ly, kh_lx: kh_lx,
        bankcard: bankcard, bankname: bankname, hanghao: hanghao, xydm: xydm,
        cy_lxr: cy_lxr, kh_bz: kh_bz, gsr_id: gsr_id, cj_flag: cj_flag,
        start_time: start_time, end_time: end_time, pageindex: pageindex
    }
    let apiurl = APIS.APIS_CUSTOMER_MANAGER.getCustomerList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    let list = re_obj.data;
    listCustomerManagerPageCount = re_obj.totle;
    // debugger
    let jExcelObj = getCustomerManagerOptions(list);
    listCustomerManager.setData(jExcelObj.data);
}

//#region 客户分页器
let listCustomerManagerPageCount = 0;
function initCustomerManagerPager() {
    var laypage = layui.laypage;
    // 自定义文本
    laypage.render({
        elem: 'listCustomerManagerPager',
        count: listCustomerManagerPageCount,
        limit: 20,
        first: `${CONSTANS.NORMAL_STR.STR_FIRST_PAGE}`,
        last: `${CONSTANS.NORMAL_STR.STR_LAST_PAGE}`,
        prev: `<em>${CONSTANS.NORMAL_STR.STR_PREV_PAGE}</em>`,
        next: `<em>${CONSTANS.NORMAL_STR.STR_NEXT_PAGE}</em>`,
        jump: function (obj, first) {
            let currPage = obj.curr;
            if (!first) {
                getDataCustomerManagerList(currPage);
            }
        }
    });
}
//#endregion

//#endregion


//#endregion



