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
    csh_skin();
    let permObject = XWUTILS.getSafety();
    if (permObject.flag == 1) {
        initCustomerManagerPageInfo();
    }
});

// $(function () {
//     $(window).resize(function () {
//         $("#list_1").setGridWid($(".xw_left_con").width() - 14);
//         $("#list_2").setGridWid($(".xw_right_con").width() - 14);
//     });
// });

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
    dealStatus: [], // 成交
    nationType: [], // 国内国外
    
    provinceJson: [],
    cityJson: [],
    countryJson: [],// 县
    continentJson: [],   // 洲

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
    customerBaseParamsInfo.provinceJson = tf_ajax_bd({}, "../D_Javascript/ht_kuangjia/city_code.json");
    customerBaseParamsInfo.provinceJson.forEach(p => {
        if (p.city == undefined) {
            return;
        }
        for (let i = 0; i < p.city.length; i++) {
            let obj = p.city[i];
            customerBaseParamsInfo.cityJson.push(obj);
            if (obj.area == undefined) {
                continue;
            }
            for (let j = 0; j < obj.area.length; j++) {
                let oobj = obj.area[j];
                customerBaseParamsInfo.countryJson.push(oobj);
            }
        }
    });
    console.log(customerBaseParamsInfo.provinceJson)
    // console.log(customerBaseParamsInfo.cityJson)
    // console.log(customerBaseParamsInfo.countryJson);
    BindSelect("sel_qb_sheng", customerBaseParamsInfo.provinceJson, "name", "name", -1, { title: get_lan_new_str('请选择省'), value: -1 })


    let list_id_user = [
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_INDUSTRY,
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_SOURCE,
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_TYPE
    ];

    let list_id_system = [
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_GRADE,
        CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_CONTINENT,
    ]

    let userParams = await XWUTILS.getDataUserParamsByIds(list_id_user);
    let systemParams = await XWUTILS.getDataSystemParamsByIds(list_id_system);
    if (XWUTILS.isUndefine(userParams) || XWUTILS.isUndefine(systemParams)) {
        XWUTILS.alertLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_USER_BASE_FAIL);
        return;
    }
    let dataList = [...userParams, ...systemParams];

    let configs = [
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_GRADE,
            dataKey: 'customerGrade',
            selectKey: 'customerGradeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET // 1-从后端获取
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_CONTINENT,
            dataKey: 'continentJson',
            selectKey: '',
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

    // 配置静态全局数据
    XWUTILS.createGlobalStaticDataAndSelect(configs, dataList, customerBaseParamsInfo);

    // 保持一致，方便和省市县联查
    customerBaseParamsInfo.continentJson.forEach(p => {
        p.code = p.zd_1;
        p.name = p.zd_2;
    });

    JsonPara = {}
    apiurl = APIS.getUserInfo;
    re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    userBaseParamsInfo.loginUserInfo = { ...re_obj.data };
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
    if (qx_id == CONSTANS.NORMAL_VAL.SYS_ADMIN_PERM) {
        userBaseParamsInfo.loginUserCompanyList = list;
        userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", list[0].gs_id, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: list[0].gs_id });
    }
    else {
        userBaseParamsInfo.loginUserCompanyList = list[0];
        userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", list[0].gs_id, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: list[0].gs_id });
    }

    console.log(customerBaseParamsInfo)
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
let seniroSearchParams = {
    listNationName: [],
    listProvince: [],
    listCity: [],
    listCountry: [], // 县
    listContinent: [], // 洲（美洲）
}
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
        { title: '国家类型', name: "gj_type", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.nationType, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
        { title: '国家名称', name: "gj_name", type: 'text', width: 80, readOnly: true },
        { title: '省', name: "sheng", type: 'text', width: 60, readOnly: true, notHeadQuery: true },
        { title: '市', name: "shi", type: 'text', width: 60, readOnly: true, notHeadQuery: true },
        { title: '县', name: "xian", type: 'text', width: 60, readOnly: true, notHeadQuery: true },
        { title: '国内地址', name: "gn_xxdz", type: 'text', width: 80, readOnly: true },
        { title: '国外区域', name: "gw_qy", type: 'text', width: 80, readOnly: true },
        { title: '国外地址', name: "gw_xxdz", type: 'text', width: 80, readOnly: true },
        // { title: '客户阶段', name: "kh_jd", type: 'text', width: 80, readOnly: true },
        { title: '客户级别', name: "kh_jb", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerGrade, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
        { title: '客户行业', name: "kh_hy", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerIndustry, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
        { title: '客户来源', name: "kh_ly", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerSource, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
        { title: '客户类型', name: "kh_lx", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerType, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
        { title: '信用代码', name: "xydm", type: 'text', width: 80, readOnly: true },
        { title: '客户备注', name: "kh_bz", type: 'text', width: 80, readOnly: true },
        { title: '联系人', name: "cy_lxr", type: 'text', width: 80, readOnly: true },
        { title: '联系电话', name: "cy_lxr_tel", type: 'text', width: 80, readOnly: true },
        { title: 'E-mail', name: "cy_Email", type: 'text', width: 80, readOnly: true },
        { title: '归属人', name: "gsr_id", type: 'text', width: 80, readOnly: true },
        { title: '是否成交', name: "cj_flag", type: 'text_select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.dealStatus, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
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
    let list_gj_name = seniroSearchParams.listNationName;
    let list_sheng = seniroSearchParams.listProvince;
    let list_shi = seniroSearchParams.listCity;
    let list_xian = seniroSearchParams.listCountry;
    let list_gw_qy = seniroSearchParams.listContinent;
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

//#region 复合查询
function seniorGetDataCustomerRegion() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con multiple-region">\r\n`);
    html.Append(`   <div class="cz-middle flex-box">\r\n`);

    // left
    html.Append(`       <div class="cz-left-wrapper">\r\n`);
    html.Append(`           <table class="grid" style="width: 100%">\r\n`);
    // html.Append(`               <tr>\r\n`);
    // html.Append(`                   <td align="center" style="width: 85px">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_PROVINCE}</td>\r\n`);
    // html.Append(`                   <td></td>\r\n`);
    // html.Append(`                   <td class="td_inner_selcon" data-action="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE}">${CONSTANS.NORMAL_STR.STR_SELECT}</td>\r\n`);
    // html.Append(`                   <td class="td_inner_selcon" data-seled-clean='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE}'>${CONSTANS.NORMAL_STR.STR_CLEAN}</td>\r\n`);
    // html.Append(`               </tr>\r\n`);
    // html.Append(`               <tr>\r\n`);
    // html.Append(`                   <td align="center">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_PROVINCE}</td>\r\n`);
    // html.Append(`                   <td colspan="3"><div data-seled-mul-area='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE}' id="div_seled_region_${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE}" class="div_seled_mul_area"></div></td>\r\n`);
    // html.Append(`               </tr>\r\n`);

    // html.Append(`               <tr>\r\n`);
    // html.Append(`                   <td align="center" style="width: 85px">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CITY}</td>\r\n`);
    // html.Append(`                   <td></td>\r\n`);
    // html.Append(`                   <td class="td_inner_selcon" data-action="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY}">${CONSTANS.NORMAL_STR.STR_SELECT}</td>\r\n`);
    // html.Append(`                   <td class="td_inner_selcon" data-seled-clean='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY}'>${CONSTANS.NORMAL_STR.STR_CLEAN}</td>\r\n`);
    // html.Append(`               </tr>\r\n`);
    // html.Append(`               <tr>\r\n`);
    // html.Append(`                   <td align="center">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_CITY}</td>\r\n`);
    // html.Append(`                   <td colspan="3"><div data-seled-mul-area='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY}' id="div_seled_region_${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY}" class="div_seled_mul_area"></div></td>\r\n`);
    // html.Append(`               </tr>\r\n`);

    let configs = [
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_PROVINCE,
            action: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE,
            selectedTitle: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_PROVINCE
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CITY,
            action: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY,
            selectedTitle: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_CITY
        }
    ]
    createMuliSearchDom(configs, html);

    html.Append(`           </table>\r\n`);
    html.Append(`       </div>\r\n`);

    // right
    html.Append(`       <div class="cz-right-wrapper">\r\n`);
    html.Append(`           <table class="grid" style="width: 100%">\r\n`);
    html.Append(`               <tr>\r\n`);
    html.Append(`                   <td align="center" style="width: 85px">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_COUNTRY}</td>\r\n`);
    html.Append(`                   <td></td>\r\n`);
    html.Append(`                   <td class="td_inner_selcon" data-action="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY}">${CONSTANS.NORMAL_STR.STR_SELECT}</td>\r\n`);
    html.Append(`                   <td class="td_inner_selcon" data-seled-clean='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY}'>${CONSTANS.NORMAL_STR.STR_CLEAN}</td>\r\n`);
    html.Append(`               </tr>\r\n`);
    html.Append(`               <tr>\r\n`);
    html.Append(`                   <td align="center">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_CITY}</td>\r\n`);
    html.Append(`                   <td colspan="3"><div data-seled-mul-area='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY}' id="div_seled_region_${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY}" class="div_seled_mul_area"></div></td>\r\n`);
    html.Append(`               </tr>\r\n`);

    html.Append(`               <tr>\r\n`);
    html.Append(`                   <td align="center" style="width: 85px">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CONTINENT}</td>\r\n`);
    html.Append(`                   <td></td>\r\n`);
    html.Append(`                   <td class="td_inner_selcon" data-action="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT}">${CONSTANS.NORMAL_STR.STR_SELECT}</td>\r\n`);
    html.Append(`                   <td class="td_inner_selcon" data-seled-clean='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT}'>${CONSTANS.NORMAL_STR.STR_CLEAN}</td>\r\n`);
    html.Append(`               </tr>\r\n`);
    html.Append(`               <tr>\r\n`);
    html.Append(`                   <td align="center">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_CONTINENT}</td>\r\n`);
    html.Append(`                   <td colspan="3"><div data-seled-mul-area='${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT}' id="div_seled_region_${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT}" class="div_seled_mul_area"></div></td>\r\n`);
    html.Append(`               </tr>\r\n`);


    html.Append(`           </table>\r\n`);

    html.Append(`       </div>\r\n`);

    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: get_lan_new_str("复合查询"),
        area: ["800px", "600px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_submit").on('click', function () {
                execSeniorGetDataCustomerRegion(tk_index);
            });

            $(".multiple-region [data-action]").on('click', function (e) {
                let action = $(this).attr('data-action') + "";
                initMultipleSelRegion(action);
            });

            $(".multiple-region [data-seled-clean]").on('click', function(e) {
                let action = $(this).attr('data-seled-clean') + "";
                $(`#div_seled_region_${action}`).html("");
            });

        },
        end: function () {
        }
    });


    function createMuliSearchDom(configs, html) {
        configs.forEach(p => {
            html.Append(`               <tr>\r\n`);
            html.Append(`                   <td align="center" style="width: 85px">${p.title}</td>\r\n`);
            html.Append(`                   <td></td>\r\n`);
            html.Append(`                   <td class="td_inner_selcon" data-action="${p.action}">${CONSTANS.NORMAL_STR.STR_SELECT}</td>\r\n`);
            html.Append(`                   <td class="td_inner_selcon" data-seled-clean='${p.action}'>${CONSTANS.NORMAL_STR.STR_CLEAN}</td>\r\n`);
            html.Append(`               </tr>\r\n`);
            html.Append(`               <tr>\r\n`);
            html.Append(`                   <td align="center">${p.selectedTitle}</td>\r\n`);
            html.Append(`                   <td colspan="3"><div data-seled-mul-area='${p.action}' id="div_seled_region_${p.action}" class="div_seled_mul_area"></div></td>\r\n`);
            html.Append(`               </tr>\r\n`);
        });
    }

}
// 最后提交查询
async function execSeniorGetDataCustomerRegion(tk_index) {
    $('[data-seled-mul-area]').each(function (e) {
        let action = $(this).attr('data-seled-mul-area');
        let list = getSeniorRegionText(action);
        switch (action) {
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE:
                seniroSearchParams.listProvince = [...list];
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY:
                seniroSearchParams.listCity = [...list];
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY:
                seniroSearchParams.listCountry = [...list];
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT:
                list = getSeniorRegionVal(action);
                seniroSearchParams.listContinent = [...list];
                break;
        }
    });

    function getSeniorRegionText(action) {
        let list = [];
        $(`#div_seled_region_${action} [data-seled-item]`).each(function (e) {
            let val = $(this).attr("data-text");
            list.push(val);
        });
        return list;
    }

    function getSeniorRegionVal(action) {
        let list = [];
        $(`#div_seled_region_${action} [data-seled-item]`).each(function (e) {
            let val = $(this).attr("data-val");
            list.push(val);
        });
        return list;
    }

    layer.close(tk_index);
    await getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
}
//#endregion

//#region 复合查询 初始化多选界面
function initMultipleSelRegion(action) {
    let str = CONSTANS.PAGE_CUSTOMER_MANAGER.STR_ALL;
    let titleStr = CONSTANS.NORMAL_STR.STR_SELECT;
    let dataList = [];
    switch (action) {
        case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE:
            str += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_PROVINCE;
            titleStr += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_PROVINCE;
            dataList = customerBaseParamsInfo.provinceJson;

            break;
        case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY:
            str += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CITY;
            titleStr += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CITY;
            dataList = customerBaseParamsInfo.cityJson;

            break;
        case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY:
            str += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_COUNTRY;
            titleStr += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_COUNTRY;
            dataList = customerBaseParamsInfo.countryJson;

            break;
        case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT:
            str += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CONTINENT;
            titleStr += CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CONTINENT;
            dataList = customerBaseParamsInfo.continentJson;
            break;
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle content">\r\n`);
    html.Append(`       <div class="top_box">\r\n`);
    html.Append(`           <div class="top_box_title">\r\n`);
    html.Append(`               ${str}\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`           <div class="top_box_btn_group">\r\n`);
    html.Append(`               <input id="txt_search_multi_sel_region" type="text" style="width: 85px; margin-right: 5px;  height: 26px; line-height: 26px; font-size: 14px;">\r\n`);
    html.Append(`               <div id="btn_search_multi_sel_region" class="top_box_btn_item"><span class="my-icon layui-icon layui-icon-search"></span><span class="text fcc">${CONSTANS.NORMAL_STR.STR_SEARCH}</span></div>\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`       </div>\r\n`);
    html.Append(`       <div id="div_multi_sel_region" class="div_file_area"></div>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_sumbit_mul" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    let tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: titleStr,
        area: ["800px", "600px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_sumbit_mul").on('click', function () {
                setMuliSelRegion(tk_index, action);
            });
        },
        end: function () {
        }
    });

    $("#btn_search_multi_sel_region").on('click', function () {
        searchMultiSelRegion(action, dataList);
    })
    $("#txt_search_multi_sel_region").on('keyup', function (e) {
        if ($(this).val() == "") {
            searchMultiSelRegion(action, dataList);
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            searchMultiSelRegion(action, dataList);
        }
    });
    getDataMuliSelRegion(tk_index, action, dataList);
}
function getDataMuliSelRegion(tk_index, action, data) {
    let html = new StringBuffer();
    // let sheng = customerBaseParamsInfo.cityJson.filter(p => p.name);
    let dataList = data;

    //TODO val用val, text
    for (let i = 0; i < dataList.length; i++) {
        let text = dataList[i].name;
        let val = dataList[i].code;
        html.Append(`       <div class="div_file_area_item" data-sign='selecting_${action}_${val}' aria-item='${i}' sel-flag="false">\r\n`);
        html.Append(`           <div class="div_file_area_item2_text" data-val="${val}" data-text='${text}'>${text}</div>\r\n`);
        html.Append(`       </div>\r\n`);
    }

    $("#div_multi_sel_region").html(html.ToString());

    $("#div_multi_sel_region .div_file_area_item").on('click', function () {
        let ii = $(this).attr('aria-item');
        let obj = dataList[ii];
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

    let selectedDomList = $(`#div_seled_region_${action} .div_file_area_item[data-sign]`);
    console.log('?', selectedDomList)
    for (let i = 0; i < selectedDomList.length; i++) {
        let domObj = selectedDomList[i];
        let val = $(domObj).attr('data-val');
        $(`#div_multi_sel_region .div_file_area_item[data-sign='selecting_${action}_${val}']`).attr('sel-flag', 'true');
        $(`#div_multi_sel_region .div_file_area_item[data-sign='selecting_${action}_${val}'] .div_file_area_item2_text`).addClass('active');
    }
}
// 静态查询
function searchMultiSelRegion(action, dataList) {
    let val = $("#txt_search_multi_sel_region").val();
    let filter_list = [];
    for (let i = 0; i < dataList.length; i++) {
        let obj = dataList[i];
        if (obj.includes(val)) {
            filter_list.push(obj);
        }
    }
    $("#div_multi_sel_region .div_file_area_item").each(function () {
        $(this).hide();
        let val = $(this).find(`.div_file_area_item2_text`).attr(`data-val`);
        if (filter_list.includes(val)) {
            $(this).show();
        }
    });
}
// 第一次提交
function setMuliSelRegion(tk_index, action) {
    // $("#txt_search_multi_sel_region").val('');
    // searchMultiSelRegion()
    $(`#div_seled_region_${action}`).html('');
    let dom_list = $(`#div_multi_sel_region .div_file_area_item[sel-flag="true"]`);
    let html = new StringBuffer();
    for (let i = 0; i < dom_list.length; i++) {
        let dom = dom_list[i];
        let val = $(dom).find(`.div_file_area_item2_text`).attr(`data-val`);
        let text = $(dom).find(`.div_file_area_item2_text`).attr(`data-text`);
        console.log(val, text, dom)
        html.Append(`<div class="div_file_area_item" data-seled-item data-sign='selected_${action}_${val}' data-val='${val}' data-text='${text}'>\r\n`);
        html.Append(`    <div class="div_file_area_item_text">${text}</div>\r\n`);
        html.Append(`    <div class="div_file_area_item_close"><span class="my-icon layui-icon layui-icon-close fcc"></span></div>\r\n`);
        html.Append(`</div>\r\n`);
    }
    $(`#div_seled_region_${action}`).html(html.ToString());
    layer.close(tk_index);

    $(`#div_seled_region_${action} .div_file_area_item .div_file_area_item_close`).on('click', function (e) {
        $(this).closest('.div_file_area_item').remove();
    });
}
//#endregion


//#endregion



