$(document).ready(function () {
    csh_skin();
    let permObject = XWUTILS.getSafety();
    if (permObject.flag == 1) {
        let btnList = permObject.data.list;
        permissionList.list = btnList;
        initButtonAction(btnList);
        initCustomerManagerPageInfo();
    }
});
// 重写，新的

//#region 异步初始化
async function initCustomerManagerPageInfo() {
    await getDataCustomerBaseParamsInfo();
    await initGetDataCustomerManagerList();
}
//#endregion

//#region 初始化按钮, 右键菜单
function initButtonAction(list) {
    let funMap = new Map();
    funMap.set("bindGetDataCustomerManagerList", bindGetDataCustomerManagerList);
    funMap.set("seniorGetDataCustomerRegion", seniorGetDataCustomerRegion);

    funMap.set("initAddCustomer", initAddCustomer);
    funMap.set("initUpdateCustomer", initUpdateCustomer);
    funMap.set("initDelCustomer", initDelCustomer);

    let contextList = [
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_VIEW_LOG,
            dataPerm: 'context.customer.manager.view.log',
            id: 1,
            callback: initOpenWindowOperateLog,
            show: false,
        },
    ];
    XWUTILS.renenderContextButton(list, 'listCustomerManagerCon', contextList, 'jexcel_custom_element');
    XWUTILS.renenderButton(list, funMap);
}
//#endregion

//#region 初始化客户全局信息
let permissionList = {
    list: [],
}
let customerBaseParamsInfo = {
    customerGrade: [],
    customerIndustry: [],
    customerSource: [],
    customerType: [],
    dealStatus: [], // 成交
    nationType: [], // 国内国外

    nationNameJson: [],
    provinceJson: [],
    cityJson: [],
    countryJson: [],// 县
    continentJson: [],   // 洲

    // 日志类型
    logOperateType: [],
    logOperateTypeSelect: null,

    customerGradeSelect: null,
    customerIndustrySelect: null,
    customerSourceSelect: null,
    customerTypeSelect: null,
    dealStatusSelect: null,
    nationTypeSelect: null,

    provinceSelect: null,
    citySelect: null,
    countrySelect: null,
    continentSelect: null,

    editCustomerGradeSelect: null,
    editCustomerIndustrySelect: null,
    editCustomerSourceSelect: null,
    editCustomerTypeSelect: null,
    editDealStatusSelect: null,
    editNationTypeSelect: null,

    editProvinceSelect: null,
    editCitySelect: null,
    editCountrySelect: null,
    editContinentSelect: null,


    rollbackPropertyList: [],
}
let userBaseParamsInfo = {
    loginUserInfo: {},
    loginUserCompanyList: [],
    loginUserCompanySelect: null,
}
let customerManagerPageOptions;

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
    console.log(customerBaseParamsInfo.cityJson)
    // console.log(customerBaseParamsInfo.countryJson);
    let batchQueryObject = { 'name': CONSTANS.PAGE_CUSTOMER_MANAGER.STR_AREA_QUERYING, 'code': -2 }
    customerBaseParamsInfo.provinceJson.push(batchQueryObject);
    customerBaseParamsInfo.cityJson.push(batchQueryObject);
    customerBaseParamsInfo.countryJson.push(batchQueryObject);

    console.log(XWUTILS_LAYUI, "////")
    let SELECT_LOG_OPERATE_STATIC_JSON = [
        {
            text: CONSTANS.NORMAL_STR.STR_ADD,
            val: 1,
        },
        {
            text: CONSTANS.NORMAL_STR.STR_UPDATE,
            val: 2,
        },
        {
            text: CONSTANS.NORMAL_STR.STR_DEL,
            val: 3,
        }
    ];


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
            selectKey: 'continentSelect',
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
        },

        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_GRADE,
            dataKey: 'customerGrade',
            selectKey: 'editCustomerGradeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET, // 1-从后端获取
            dataAttr: 'required',
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_CONTINENT,
            dataKey: 'continentJson',
            selectKey: 'editContinentSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET, // 1-从后端获取
            dataAttr: 'required',
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_INDUSTRY,
            dataKey: 'customerIndustry',
            selectKey: 'editCustomerIndustrySelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET,
            dataAttr: 'required',
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_SOURCE,
            dataKey: 'customerSource',
            selectKey: 'editCustomerSourceSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET,
            dataAttr: 'required',
        },
        {
            typeId: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CUSTOMER_TYPE,
            dataKey: 'customerType',
            selectKey: 'editCustomerTypeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET,
            dataAttr: 'required',
        },
        {
            dataKey: 'dealStatus',
            selectKey: 'editDealStatusSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: [
                { "zd_1": CONSTANS.NORMAL_VAL.VAL_YES, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_DEAL_COMPLETED}` },
                { "zd_1": CONSTANS.NORMAL_VAL.VAL_NO, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_DEAL_PENDING}` }
            ],
            dataAttr: 'required',
        },
        {
            dataKey: 'nationType',
            selectKey: 'editNationTypeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: [
                { "zd_1": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_DOMESTIC}` },
                { "zd_1": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN, "zd_2": `${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_FOREIGN}` }
            ],
            dataAttr: 'required',
        },
        {
            dataKey: 'logOperateType',
            selectKey: 'logOperateTypeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: SELECT_LOG_OPERATE_STATIC_JSON,
            valKey: "val",
            textKey: "text",
        },
    ];

    // 配置静态全局数据
    XWUTILS.createGlobalStaticDataAndSelect(configs, dataList, customerBaseParamsInfo);

    console.log()

    // 保持一致，方便和省市县联查
    customerBaseParamsInfo.continentJson.forEach(p => {
        p.code = p.zd_1;
        p.name = p.zd_2;
    });

    // 省市县三级联动
    let areaConfigs = [
        {
            dataKey: 'province',
            selectKey: 'provinceSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: customerBaseParamsInfo.provinceJson,
            valKey: "code",
            textKey: "name",
            dataAttr: 'required',
        },
        {
            dataKey: 'city',
            selectKey: 'citySelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: customerBaseParamsInfo.cityJson,
            valKey: "code",
            textKey: "name",
            dataAttr: 'required',
        },
        {
            dataKey: 'country',
            selectKey: 'countrySelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: customerBaseParamsInfo.countryJson,
            valKey: "code",
            textKey: "name",
            dataAttr: 'required',
        },

        {
            dataKey: 'province',
            selectKey: 'editProvinceSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: customerBaseParamsInfo.provinceJson,
            valKey: "name",
            textKey: "name",
            dataAttr: 'required',
        },
        {
            dataKey: 'city',
            selectKey: 'editCitySelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: customerBaseParamsInfo.cityJson,
            valKey: "name",
            textKey: "name",
            dataAttr: 'required',
        },
        {
            dataKey: 'country',
            selectKey: 'editCountrySelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: customerBaseParamsInfo.countryJson,
            valKey: "name",
            textKey: "name",
            dataAttr: 'required',
        }
    ]
    XWUTILS.createGlobalStaticDataAndSelect(areaConfigs, dataList, customerBaseParamsInfo);


    //#region
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
    // let qx_id = 1;
    let qx_id = userBaseParamsInfo.loginUserInfo.qx_id;
    qx_id = qx_id.split(',')
    if (qx_id.includes(CONSTANS.NORMAL_VAL.SYS_ADMIN_PERM + '')) {
        userBaseParamsInfo.loginUserCompanyList = list;
        userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", userBaseParamsInfo.loginUserInfo.gs_id, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: userBaseParamsInfo.loginUserInfo.gs_id });
    }
    else {
        userBaseParamsInfo.loginUserCompanyList = [list.find(p => p.gs_id == userBaseParamsInfo.loginUserInfo.gs_id)];
        userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", userBaseParamsInfo.loginUserInfo.gs_id, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: userBaseParamsInfo.loginUserInfo.gs_id });
    }


    //#endregion

    console.log(customerBaseParamsInfo)

    customerManagerPageOptions = {
        customerManagerOptions: [
            { title: '客户ID', name: "kh_id", type: 'text', width: 50, readOnly: true },
            {
                title: '公司', name: "gs_id", type: 'text',
                customType: 'queryRegion',
                queryRegionConfigs: {
                    queryRegionStart: function (callback) {
                        XWUTILS_LAYUI.openWindowQueryRegionCompanyTree(callback, userBaseParamsInfo.loginUserCompanyList);
                    },
                    queryRegionSubmit: function (params) {
                        getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
                    },
                    queryRegionEnd: function () {
                        getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
                    },
                    displayField: 'gs_jc',
                    valueField: 'gs_id',
                    defaultVal: userBaseParamsInfo.loginUserCompanyList[0].gs_id
                },
                width: 90, readOnly: true,
                notHeadQuery: !XWUTILS.userIsAdmin(userBaseParamsInfo.loginUserInfo),
                baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", userBaseParamsInfo.loginUserCompanyList[0].gs_id, userBaseParamsInfo.loginUserCompanyList[0].gs_jc)
            },
            // { title: '公司', name: "gs_id", type: 'text', customType: 'select', width: 90, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", userBaseParamsInfo.loginUserCompanyList[0].gs_id, userBaseParamsInfo.loginUserCompanyList[0].gs_jc) },
            // { title: '所属公司', name: "gs_jc", type: 'text', width: 80, readOnly: true },
            { title: '客户编号', name: "kh_bh", type: 'text', width: 65, readOnly: true },
            { title: '客户简称', name: "kh_jc", type: 'text', width: 90, readOnly: true },
            { title: '客户全称', name: "kh_qc", type: 'text', width: 90, readOnly: true },
            { title: '国家类型', name: "gj_type", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.nationType, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
            { title: '国家名称', name: "gj_name", type: 'text', width: 80, readOnly: true },
            { title: '省', name: "sheng", type: 'text', customType: 'select', width: 80, readOnly: true, notHeadQuery: false, useOriginVal: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.provinceJson, 'code', 'name') },
            { title: '市', name: "shi", type: 'text', customType: 'select', width: 80, readOnly: true, notHeadQuery: false, useOriginVal: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.cityJson, 'code', 'name') },
            { title: '县', name: "xian", type: 'text', customType: 'select', width: 80, readOnly: true, notHeadQuery: false, useOriginVal: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.countryJson, 'code', 'name') },
            { title: '国内地址', name: "gn_xxdz", type: 'text', width: 80, readOnly: true },
            { title: '国外区域', name: "gw_qy", type: 'text', width: 80, readOnly: true, customType: 'select', useOriginVal: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.continentJson, 'code', 'name') },
            { title: '国外地址', name: "gw_xxdz", type: 'text', width: 80, readOnly: true },
            // { title: '客户阶段', name: "kh_jd", type: 'text', width: 80, readOnly: true },
            { title: '客户级别', name: "kh_jb", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerGrade, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
            { title: '客户行业', name: "kh_hy", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerIndustry, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
            { title: '客户来源', name: "kh_ly", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerSource, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
            { title: '客户类型', name: "kh_lx", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.customerType, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
            { title: '银行名称', name: "bankname", type: 'text', width: 80, readOnly: true },
            { title: '银行卡号', name: "bankcard", type: 'text', width: 80, readOnly: true },
            { title: '银行行号', name: "hanghao", type: 'text', width: 80, readOnly: true },
            { title: '信用代码', name: "xydm", type: 'text', width: 80, readOnly: true },
            { title: '客户备注', name: "kh_bz", type: 'text', width: 80, readOnly: true },
            { title: '联系人', name: "cy_lxr", type: 'text', width: 80, readOnly: true },
            { title: '联系电话', name: "cy_lxr_tel", type: 'text', width: 80, readOnly: true },
            { title: 'E-mail', name: "cy_Email", type: 'text', width: 80, readOnly: true },
            {
                title: '归属人', name: "gsr_id", type: 'text',
                customType: 'queryRegion',
                queryRegionConfigs: {
                    queryRegionStart: function (callback) {
                        // XWUTILS_LAYUI.openWindowQueryRegionCompanyTree(callback, userBaseParamsInfo.loginUserCompanyList);
                        XWUTILS_LAYUI.openWindowAllUserList(callback, userBaseParamsInfo.loginUserInfo);
                    },
                    queryRegionSubmit: function (params) {
                        getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
                    },
                    queryRegionEnd: function () {
                        getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
                    },
                    displayField: 'name',
                    valueField: 'gsr_id',
                    defaultVal: "",
                },
                width: 80, readOnly: true,
                showValueField: "name",
            },
            { title: '归属人', name: "name", type: 'hidden', width: 80, readOnly: true },
            { title: 'E-mail', name: "cy_Email", type: 'text', width: 80, readOnly: true },
            { title: '是否成交', name: "cj_flag", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.dealStatus, CONSTANS.NORMAL_STR.STR_FIELD_VAL, CONSTANS.NORMAL_STR.STR_FIELD_TEXT) },
            { title: '录入时间', name: "time", type: 'text', width: 90, readOnly: true }
        ],
        operateLogOptions: [
            { title: '日志ID', name: "rz_id", type: 'text', width: 60, readOnly: true },
            { title: '操作', name: "cz_id", type: 'text', width: 80, readOnly: true, customType: 'select', useOriginVal: false, baseInfo: XWUTILS.setSelectBaseInfo(customerBaseParamsInfo.logOperateType, 'val', 'text') },
            { title: 'ys_id', name: "ys_id", type: 'text', width: 60, readOnly: true },
            {
                title: '操作时间', name: "time", type: 'text', customType: 'textCustom',
                textCustomConfigs: {
                    formatterText(val) { return XWUTILS.formartTime('yy-MM-dd HH:mm', val); }
                },
                width: 130, readOnly: true
            },
            {
                title: '操作信息', name: "rz_json", type: 'text', customType: 'textCustom',
                textCustomConfigs: {
                    formatterText(val) { return XWUTILS.transFormMapOptionsData(val, customerManagerPageOptions.customerManagerOptions); }
                },
                width: 360, readOnly: true
            },
        ],
    };
}
function tess() {
    console.log("????");
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
        pageindex: pageindex,
        pagesize: 20
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
    actionMap: {
        "listNationName": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME,
        "listProvince": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_PROVINCE,
        "listCity": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CITY,
        "listCountry": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY,
        "listContinent": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT
    },
    matchSelect: {
        "listProvince": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_PROVINCE,
        "listCity": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY,
        "listCountry": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY,
        "listContinent": CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CONTINENT,
    }
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
        let allowField = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_NATION_NAME];
        let field = $(this).attr('data-input-sign');
        if ($(this).val() == "") {
            if (allowField.includes(field)) {
                regionInteractionInput(allowField);
            }
            getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.stopPropagation();
            if (allowField.includes(field)) {
                regionInteractionInput(allowField);
            }
            getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
    });
    $("#listCustomerManager [data-select-sign]").on("change", function (e) {
        let field = $(this).attr('data-select-sign');
        let allowField = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_PROVINCE, CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY
            , CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY, CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CONTINENT];
        if (allowField.includes(field)) {
            regionInteraction(field);
        }
        getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
    });

    function initHideAreaSelectOption() {
        let hideSelectOptionList = [];
        hideSelectOptionList = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY, CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY];
        hideSelectOptionList.forEach(p => {
            $(`[data-select-sign="${p}"] option`).each(function (e) {
                let val = $(this).val();
                if (val != -1) {
                    $(this).hide();
                }
            });
        });
    }
    initHideAreaSelectOption();
    bindGetDataCustomerManagerList();

}
function getCustomerManagerOptions(list) {
    let columns = customerManagerPageOptions.customerManagerOptions;

    if (customerBaseParamsInfo.rollbackPropertyList.length == 0) {
        customerBaseParamsInfo.rollbackPropertyList = columns;
    }
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
async function bindGetDataCustomerManagerList() {
    await getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
}
async function getDataCustomerManagerList(pageindex) {
    let kh_id = listCustomerManager.getCustomHeaderText("kh_id");
    let kh_bh = listCustomerManager.getCustomHeaderText("kh_bh");
    let kh_jc = listCustomerManager.getCustomHeaderText("kh_jc");
    let kh_qc = listCustomerManager.getCustomHeaderText("kh_qc");
    // let gs_id = '2';
    let gs_id = listCustomerManager.getCustomHeaderText("gs_id");
    if (gs_id == "") {
        gs_id = userBaseParamsInfo.loginUserCompanyList[0].gs_id;
    }
    let gj_type = listCustomerManager.getCustomHeaderText("gj_type");

    let list_gj_name = seniroSearchParams.listNationName.map(p => p.text);
    let list_sheng = seniroSearchParams.listProvince.map(p => p.text);
    let list_shi = seniroSearchParams.listCity.map(p => p.text);
    let list_xian = seniroSearchParams.listCountry.map(p => p.text);
    let list_gw_qy = seniroSearchParams.listContinent.map(p => p.val);

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
        start_time: start_time, end_time: end_time, pageindex: pageindex,
        pagesize: listCustomerManagerLimit
    }
    let apiurl = APIS.APIS_CUSTOMER_MANAGER.getCustomerList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    let list = re_obj.data;
    listCustomerManagerTotle = re_obj.totle;
    let jExcelObj = getCustomerManagerOptions(list);
    listCustomerManager.setData(jExcelObj.data);
    initCustomerManagerPager();
}

//#region 客户分页器
let listCustomerManagerTotle = 0;
let listCustomerManagerLimit = CONSTANS.NORMAL_VAL.TWENTY_PAGE;
let listCustomerManagerPageIndex = CONSTANS.NORMAL_VAL.ONE;
function initCustomerManagerPager() {
    var laypage = layui.laypage;
    // 自定义文本
    laypage.render({
        elem: 'listCustomerManagerPager',
        count: listCustomerManagerTotle,
        limit: listCustomerManagerLimit,
        limits: [10, 20, 30, 50, 100],
        layout: ['first', 'prev', 'page', 'next', 'last', 'count', 'limit', 'skip'],
        first: `${CONSTANS.NORMAL_STR.STR_FIRST_PAGE}`,
        last: `${CONSTANS.NORMAL_STR.STR_LAST_PAGE}`,
        prev: `<em>${CONSTANS.NORMAL_STR.STR_PREV_PAGE}</em>`,
        next: `<em>${CONSTANS.NORMAL_STR.STR_NEXT_PAGE}</em>`,
        jump: function (obj, first) {
            if (!first) {
                listCustomerManagerLimit = obj.limit;
                listCustomerManagerPageIndex = obj.curr;
                getDataCustomerManagerList(obj.curr);
            }
        }
    });
}
//#endregion

//#endregion

//#region 复合查询
function seniorGetDataCustomerRegion() {
    //#region 窗口打开
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con multiple-region">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);

    // TOP
    html.Append(`       <div class="flex-box">\r\n`);
    // left
    html.Append(`       <div class="cz-left-wrapper">\r\n`);
    html.Append(`           <table class="grid" style="width: 100%">\r\n`);
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
    configs = [
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_COUNTRY,
            action: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_COUNTRY,
            selectedTitle: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_COUNTRY
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CONTINENT,
            action: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_CONTINENT,
            selectedTitle: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_CONTINENT
        },
    ]
    createMuliSearchDom(configs, html);
    html.Append(`           </table>\r\n`);

    html.Append(`       </div>\r\n`);
    html.Append(`       </div>\r\n`);
    // TOP

    html.Append(`   <div>\r\n`);
    html.Append(`           <table class="grid mgt5" style="width: 100%">\r\n`);
    html.Append(`               <tr>\r\n`);
    html.Append(`                  <td align="center" style="width: 85px">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_NATION_NAME}</td>\r\n`);
    html.Append(`                  <td><input class="cz-input" type='text' id='txt_add_search_nation_name' placeholder="${CONSTANS.PAGE_CUSTOMER_MANAGER.PLEASE_INPUT_AND_ENTER}"></td>\r\n`);
    html.Append(`                  <td class="td_inner_selcon" data-action-input="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME}">${CONSTANS.NORMAL_STR.STR_ADD}</td>\r\n`);
    html.Append(`                  <td class="td_inner_selcon" data-seled-clean-input="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME}">${CONSTANS.NORMAL_STR.STR_CLEAN}</td>\r\n`);
    html.Append(`               </tr>\r\n`);
    html.Append(`               <tr>\r\n`);
    html.Append(`                  <td align="center">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SELECTED_NATION_NAME}</td>\r\n`);
    html.Append(`                  <td colspan="3"><div data-seled-mul-area="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME}" id="div_seled_region_${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME}" class="div_seled_mul_area seled_mul_nation_name"></div></td>\r\n`);
    html.Append(`               </tr>\r\n`);
    html.Append(`           </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_all_clean" type="button" class="cz_fter_btn bgwhite">${CONSTANS.NORMAL_STR.ALL_CLEAN}</button>\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn mgl30">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: get_lan_new_str("复合查询"),
        area: ["850px", "650px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_submit").on('click', function () {
                execSeniorGetDataCustomerRegion(tk_index);
            });

            $("#btn_all_clean").on('click', function () {
                execCleanSeniorGetDataCustomerRegion();
            });

            $(".multiple-region [data-action]").on('click', function (e) {
                let action = $(this).attr('data-action') + "";
                initMultipleSelRegion(action);
            });

            $(".multiple-region [data-seled-clean]").on('click', function (e) {
                let action = $(this).attr('data-seled-clean') + "";
                $(`#div_seled_region_${action}`).html("");
            });

            // 另一个
            $("#txt_add_search_nation_name").on('keyup', function (e) {
                if (XWUTILS.isUndefine($(this).val())) {
                    return;
                }
                let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if (key == 13) {
                    createMuliNationName();
                }
            });

            $('.multiple-region [data-action-input]').on('click', function (e) {
                createMuliNationName();
            });

            $('.multiple-region [data-seled-clean-input]').on('click', function (e) {
                let action = $(this).attr('data-seled-clean-input') + "";
                $(`#div_seled_region_${action}`).html("");
            });

            function createMuliNationName() {
                let val = $("#txt_add_search_nation_name").val();
                if (XWUTILS.isUndefine(val)) {
                    return;
                }
                let html = new StringBuffer();
                let text = val;
                let action = CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME;
                html.Append(`<div class="div_file_area_item" data-seled-item data-sign='selected_input_${action}' data-val='${val}' data-text='${text}'>\r\n`);
                html.Append(`    <div class="div_file_area_item_text">${text}</div>\r\n`);
                html.Append(`    <div class="div_file_area_item_close"><span class="my-icon layui-icon layui-icon-close fcc"></span></div>\r\n`);
                html.Append(`</div>\r\n`);
                $(`#div_seled_region_${action}`).append(html.ToString());
                $("#txt_add_search_nation_name").val('');
                $(`#div_seled_region_${action} .div_file_area_item .div_file_area_item_close`).on('click', function (e) {
                    $(this).closest('.div_file_area_item').remove();
                });
            }

        },
        end: function () {
        }
    });
    //#endregion

    function createMuliSearchDom(configs, html, cssStr, selBtnStr, cleanBtnStr) {
        configs.forEach(p => {
            html.Append(`               <tr>\r\n`);
            html.Append(`                   <td align="center" style="width: 85px">${p.title}</td>\r\n`);
            html.Append(`                   <td></td>\r\n`);
            let btnSel = CONSTANS.NORMAL_STR.STR_SELECT;
            let btnClean = CONSTANS.NORMAL_STR.STR_CLEAN;
            if (!XWUTILS.isUndefine(selBtnStr)) {
                btnSel = selBtnStr
            }
            if (!XWUTILS.isUndefine(cleanBtnStr)) {
                btnClean = cleanBtnStr
            }
            html.Append(`                   <td class="td_inner_selcon" data-action="${p.action}">${btnSel}</td>\r\n`);
            html.Append(`                   <td class="td_inner_selcon" data-seled-clean='${p.action}'>${btnClean}</td>\r\n`);
            html.Append(`               </tr>\r\n`);
            html.Append(`               <tr>\r\n`);
            html.Append(`                   <td align="center">${p.selectedTitle}</td>\r\n`);
            let css = 'div_seled_mul_area';
            if (!XWUTILS.isUndefine(cssStr)) {
                css += " " + cssStr
            }
            html.Append(`                   <td colspan="3"><div data-seled-mul-area='${p.action}' id="div_seled_region_${p.action}" class="${css}"></div></td>\r\n`);
            html.Append(`               </tr>\r\n`);
        });
    }

    // 根据现有已选的，进行初始化
    function getNonEmptyListsWithActions(searchParams) {
        const result = [];

        Object.entries(searchParams).forEach(([key, value]) => {
            // 跳过actionMap本身，只处理数组类型的属性
            if (key !== 'actionMap' && Array.isArray(value) && value.length > 0) {
                const actionId = searchParams.actionMap[key];
                if (actionId) {
                    result.push({
                        listKey: key,
                        listData: value,
                        actionId: actionId
                    });
                }
            }
        });

        return result;
    }

    let initialDatas = getNonEmptyListsWithActions(seniroSearchParams);
    initialDatas.forEach(p => {
        let action = p.actionId
        let listData = p.listData;
        let html = new StringBuffer();
        for (let i = 0; i < listData.length; i++) {
            let obj = listData[i];
            html.Append(`<div class="div_file_area_item" data-seled-item data-sign='selected_${action}_${obj.val}' data-val='${obj.val}' data-text='${obj.text}'>\r\n`);
            html.Append(`    <div class="div_file_area_item_text">${obj.text}</div>\r\n`);
            html.Append(`    <div class="div_file_area_item_close"><span class="my-icon layui-icon layui-icon-close fcc"></span></div>\r\n`);
            html.Append(`</div>\r\n`);
        }
        $(`#div_seled_region_${action}`).html(html.ToString());
        $(`#div_seled_region_${action} .div_file_area_item .div_file_area_item_close`).on('click', function (e) {
            $(this).closest('.div_file_area_item').remove();
        });
    });


}
// 最后提交查询
async function execSeniorGetDataCustomerRegion(tk_index) {
    $('[data-seled-mul-area]').each(function (e) {
        let action = $(this).attr('data-seled-mul-area');
        let list = getSeniorRegionObj(action);
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
                seniroSearchParams.listContinent = [...list];
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_NATION_NAME:
                seniroSearchParams.listNationName = [...list];
                break;
        }
    });

    function getSeniorRegionObj(action) {
        let list = [];
        $(`#div_seled_region_${action} [data-seled-item]`).each(function (e) {
            let val = $(this).attr("data-val");
            let text = $(this).attr("data-text");
            let obj = {
                val: val,
                text: text,
            }
            list.push(obj);
        });
        return list;
    }

    layer.close(tk_index);

    // 界面变更
    let flag = XWUTILS.hasAnyNonEmptyList(seniroSearchParams);
    if (flag) {
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion']`).addClass('muli_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_QUERYING)
    }
    else {
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SENIRO_SEARCH)
    }

    // 界面jexcel顶部查询框变更
    Object.entries(seniroSearchParams.matchSelect).forEach(([key, value]) => {
        let selectKey = value;
        let listKey = key;
        let list = seniroSearchParams[key];
        if (list.length == 0) {
            $(`#listCustomerManager [data-select-sign="${selectKey}"]`).val(-1);
        }
        else if (list.length > 1) {
            $(`#listCustomerManager [data-select-sign="${selectKey}"]`).val(-2);
        }
        else {
            $(`#listCustomerManager [data-select-sign="${selectKey}"]`).val(list[0].val);
        }
        regionInteraction(selectKey, CONSTANS.PAGE_CUSTOMER_MANAGER.SIGN_SENIOR_SEARCH, list)
    });

    // 界面jexcel顶部input查询框变更
    if (seniroSearchParams.listNationName.length > 0) {
        let valStr = seniroSearchParams.listNationName.map(p => p.val).join(',');
        $(`#listCustomerManager [data-input-sign="${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_NATION_NAME}"]`).val(valStr);
    }

    await getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
}
// 清空全部查询条件
function execCleanSeniorGetDataCustomerRegion() {
    // let action = $(this).attr('data-seled-clean') + "";
    $(`[data-seled-mul-area]`).each(function (e) {
        $(this).html('');
    });
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
    let dataList = data;

    //TODO val用val, text
    for (let i = 0; i < dataList.length; i++) {
        let text = dataList[i].name;
        let val = dataList[i].code;
        if (val == -2) {
            continue;
        }
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
        if (obj.name.includes(val)) {
            filter_list.push(obj);
        }
    }
    $("#div_multi_sel_region .div_file_area_item").each(function () {
        $(this).hide();
        let val = $(this).find(`.div_file_area_item2_text`).attr(`data-val`);
        if (filter_list.map(p => p.code).includes(val)) {
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

//#region 添加客户
function initAddCustomer() {
    let configs = [
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_SHORT_NAME,
            type: 'text',
            require: true,
            field: 'kh_jc',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_FULL_NAME,
            type: 'text',
            require: true,
            field: 'kh_qc',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_NATION_TYPE,
            type: 'select',
            select: customerBaseParamsInfo.editNationTypeSelect,
            require: true,
            field: 'gj_type',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_NATION_NAME,
            type: 'text',
            require: true,
            field: 'gj_name',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_PROVINCE,
            type: 'select',
            select: customerBaseParamsInfo.editProvinceSelect,
            require: true,
            field: 'sheng',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CITY,
            type: 'select',
            select: customerBaseParamsInfo.editCitySelect,
            require: true,
            field: 'shi',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_COUNTRY,
            type: 'select',
            select: customerBaseParamsInfo.editCountrySelect,
            require: true,
            field: 'xian',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_DOMESTIC_ADDRESS,
            type: 'text',
            require: false,
            field: 'gn_xxdz',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_FOREIGN_CONTINENT,
            type: 'select',
            select: customerBaseParamsInfo.editContinentSelect,
            require: false,
            field: 'gw_qy',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_FOREIGN_ADDRESS,
            type: 'text',
            require: false,
            field: 'gw_xxdz',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_GRADE,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerGradeSelect,
            require: true,
            field: 'kh_jb',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_INDUSTRY,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerIndustrySelect,
            require: true,
            field: 'kh_hy',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_SOURCE,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerSourceSelect,
            require: true,
            field: 'kh_ly',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_TYPE,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerTypeSelect,
            require: true,
            field: 'kh_lx',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_BANK_NAME,
            type: 'text',
            require: false,
            field: 'bankname',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_BANK_CODE,
            type: 'text',
            require: false,
            field: 'bankcard',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_BANK_NUMBER,
            type: 'text',
            require: false,
            field: 'hanghao',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CREDIT_CODE,
            type: 'text',
            require: false,
            field: 'xydm',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_CONTACT,
            type: 'text',
            require: false,
            field: 'cy_lxr',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_CONTACT_TEL,
            type: 'text',
            require: false,
            field: 'cy_lxr_tel',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_EMAIL,
            type: 'text',
            require: false,
            field: 'cy_Email',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_DEAL_STATUS,
            type: 'select',
            select: customerBaseParamsInfo.editDealStatusSelect,
            require: true,
            field: 'cj_flag',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_REMARK,
            type: 'text',
            require: false,
            field: 'kh_bz',
            colspan: 3
        },
        // {
        //     title: '',
        //     type: 'empty',
        //     require: false,
        //     field: '',
        // },

    ]
    let option = {
        rowCount: 2,
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);

    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    generateStandardDataHtmlTd(configs, html, option)
    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);

    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: get_lan_new_str("添加客户"),
        area: ["600px", "540px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();
            specialBindForAddCustomer();
            $("#btn_submit").on('click', function () {
                addCustomer(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}

function specialBindForAddCustomer() {

    //#region 国内外区域联动
    let regionList = ['editProvinceSelect', 'editCitySelect', 'editCountrySelect', 'editContinentSelect'];
    regionList.forEach(p => {
        $(`#${p}`).attr('disabled', 'disabled');
    })

    let addrList = ['txt_edit_gn_xxdz', 'txt_edit_gw_xxdz'];
    addrList.forEach(p => {
        $(`[data-edit-panel] #${p}`).attr('readonly', 'readonly');
        $(`[data-edit-panel] #${p}`).attr('placeholder', '');
    })

    $("#editNationTypeSelect").on('change', function (e) {
        let val = $(this).val() + "";


        if (val == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC + "") {
            // 选择国内，国内解除限制
            regionList.forEach(p => {
                $(`#${p}`).removeAttr('disabled');
                $(`#${p}`).attr('required', 'required');
            })
            $("[data-edit-panel] #txt_edit_gn_xxdz").removeAttr('readonly');
            $("[data-edit-panel] #txt_edit_gn_xxdz").attr('required', 'required');
            $("[data-edit-panel] #txt_edit_gj_name").val('中国');

            // 国外解除required
            $("#editContinentSelect").val(-1);
            $("#editContinentSelect").attr('disabled', 'disabled');
            $("#editContinentSelect").removeAttr('required');
            $("[data-edit-panel] #txt_edit_gw_xxdz").val('');
            $("[data-edit-panel] #txt_edit_gw_xxdz").attr('readonly', 'readonly');
            $("[data-edit-panel] #txt_edit_gw_xxdz").removeAttr('required');
        }
        else if (val == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN + "") {
            // 选择国外，国内开启限制，解除required
            regionList.forEach(p => {
                $(`#${p}`).removeAttr('required');
                $(`#${p}`).attr('disabled', 'disabled');
                $(`#${p}`).val(-1);
            })
            $("[data-edit-panel] #txt_edit_gn_xxdz").val('');
            $("[data-edit-panel] #txt_edit_gj_name").val('');
            $("[data-edit-panel] #txt_edit_gn_xxdz").attr('readonly', 'readonly');
            $("[data-edit-panel] #txt_edit_gn_xxdz").removeAttr('required');

            $("#editContinentSelect").removeAttr('disabled');
            $("#editContinentSelect").attr('required', 'required');
            $("#editContinentSelect").val(-1);
            $("[data-edit-panel] #txt_edit_gw_xxdz").removeAttr('readonly');
            $("[data-edit-panel] #txt_edit_gw_xxdz").attr('required', 'required');
            $("[data-edit-panel] #txt_edit_gw_xxdz").val('');
        }
        else if (val == '-1') {
            $("[data-edit-panel] #txt_edit_gj_name").val('');

            regionList.forEach(p => {
                $(`#${p}`).removeAttr('required');
                $(`#${p}`).attr('disabled', 'disabled');
                $(`#${p}`).val(-1);
                $(`#${p}`).removeClass("require_color");
            })

            addrList.forEach(p => {
                $(`[data-edit-panel] #${p}`).removeClass('require_color');
                $(`[data-edit-panel] #${p}`).attr('readonly', 'readonly');
                $(`[data-edit-panel] #${p}`).attr('required', 'required');
                $(`[data-edit-panel] #${p}`).val('');
            })
        }
    });
    //#endregion

    //#region 省市县联动
    initHideAreaSelectOption();

    function initHideAreaSelectOption() {
        let hideSelectOptionList = [];
        hideSelectOptionList = ["editCitySelect", "editCountrySelect"];
        hideSelectOptionList.forEach(p => {
            $(`#${p}`).html('');
        });
    }
    //#endregion

    //#region 联动方法
    $("#editProvinceSelect").on('change', function (e) {
        let val = $(this).val();
        if (XWUTILS.equalNumTransStr(val, CONSTANS.NORMAL_VAL.DERAULT_SEL_VAL)) {
            BindSelect('editCitySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
            BindSelect('editCountrySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
        else {
            let citys = customerBaseParamsInfo.provinceJson.find(p => p.name == val);
            BindSelect('editCitySelect', citys.city, 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
            BindSelect('editCountrySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
    });
    $("#editCitySelect").on('change', function (e) {
        let val = $(this).val();
        if (XWUTILS.equalNumTransStr(val, CONSTANS.NORMAL_VAL.DERAULT_SEL_VAL)) {
            BindSelect('editCountrySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
        else {
            let countrys = customerBaseParamsInfo.cityJson.find(p => p.name == val);
            BindSelect('editCountrySelect', countrys.area, 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
    });
    //#endregion
}

async function addCustomer(tk_index) {
    let flag = XWUTILS.emitAlertRequireItem();
    if (!flag) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let kh_jc = getDataFromStandardDataHtmlTdText('kh_jc')
    let kh_qc = getDataFromStandardDataHtmlTdText('kh_qc')
    let gj_type = $("#editNationTypeSelect").val();
    let gj_name = getDataFromStandardDataHtmlTdText('gj_name')

    let sheng = $("#editProvinceSelect").find('option:selected').text();
    let shi = $("#editCitySelect").find('option:selected').text();
    let xian = $("#editCountrySelect").find('option:selected').text();

    let gn_xxdz = getDataFromStandardDataHtmlTdText('gn_xxdz')
    let gw_qy = $("#editContinentSelect").val();
    if (gw_qy + "" == CONSTANS.NORMAL_STR.DERAULT_SEL_VAL) {
        gw_qy = "";
    }
    let gw_xxdz = getDataFromStandardDataHtmlTdText('gw_xxdz')
    let kh_jb = $("#editCustomerGradeSelect").val();
    let kh_hy = $("#editCustomerIndustrySelect").val();
    let kh_ly = $("#editCustomerSourceSelect").val();
    let kh_lx = $("#editCustomerTypeSelect").val();
    let bankcard = getDataFromStandardDataHtmlTdText('bankcard')
    let bankname = getDataFromStandardDataHtmlTdText('bankname')
    let hanghao = getDataFromStandardDataHtmlTdText('hanghao')
    let xydm = getDataFromStandardDataHtmlTdText('xydm')
    let cy_lxr = getDataFromStandardDataHtmlTdText('cy_lxr')
    let cy_lxr_tel = getDataFromStandardDataHtmlTdText('cy_lxr_tel')
    let cy_Email = getDataFromStandardDataHtmlTdText('cy_Email')
    let kh_bz = getDataFromStandardDataHtmlTdText('kh_bz')
    let cj_flag = $("#editDealStatusSelect").val();

    let JsonPara = {
        kh_jc: kh_jc, kh_qc: kh_qc, gj_type: gj_type, gj_name: gj_name,
        sheng: sheng, shi: shi, xian: xian, gn_xxdz: gn_xxdz,
        gw_qy: gw_qy, gw_xxdz: gw_xxdz, kh_jb: kh_jb, kh_hy: kh_hy,
        kh_ly: kh_ly, kh_lx: kh_lx, bankcard: bankcard, bankname: bankname,
        hanghao: hanghao, xydm: xydm, cy_lxr: cy_lxr, cy_lxr_tel: cy_lxr_tel,
        cy_Email: cy_Email, kh_bz: kh_bz, cj_flag: cj_flag
    };

    let apiurl = APIS.APIS_CUSTOMER_MANAGER.addCustomer;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    layer.close(tk_index);
    XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
    await getDataCustomerManagerList(CONSTANS.NORMAL_VAL.ONE);
}

function generateStandardDataHtmlTd(configs, html, option) {
    let rowCount = 1; // 默认一行一个参数
    let prefix = "txt_edit_"
    if (option != undefined) {
        rowCount = option.rowCount;
        if (option.prefix != undefined) {
            prefix = option.prefix;
        }
    }
    let calCount = 0; // 计数器

    html.Append(`<tr data-edit-panel>\r\n`);
    configs.forEach(c => {
        let title = c.title;
        let type = c.type;
        let requiredFlag = c.require;
        let required = ''
        if (requiredFlag == true) {
            required = 'required';
        }
        let field = c.field
        let id = `${prefix}${field}`;
        let select = c.select;
        let colspan = c.colspan;
        if (colspan == undefined) {
            colspan = 1;
        }
        let titleWid = c.titleWid;
        if (titleWid == undefined) {
            titleWid = 85;
        }

        let defaultVal = c.defaultVal == undefined ? '' : c.defaultVal;

        if (type == 'text') {
            html.Append(`<td style='width: ${titleWid}px' align='center'>${title}</td>\r\n`);
            html.Append(`<td colspan='${colspan}'><input data-enter type="text" class="cz-input" ${required} id="${id}" value='${defaultVal}'/></td>\r\n`);
        }
        else if (type == 'select') {
            html.Append(`<td style='width: ${titleWid}px' align='center'>${title}</td>\r\n`);
            html.Append(`<td colspan='${colspan}' ${required}>${select}</td>\r\n`);
        }
        else if (type == 'empty') {
            html.Append(`<td colspan='${colspan}'></td>\r\n`);
        }
        calCount = calCount + 1;
        if (calCount == rowCount) {
            html.Append(`</tr>\r\n`);
            html.Append(`<tr data-edit-panel>\r\n`);
            calCount = 0;
        }
    });
}

function getDataFromStandardDataHtmlTdText(field, prefixStr) {
    let prefix = "txt_edit_"
    if (prefixStr != undefined) {
        prefix = prefixStr;
    }
    let id = `${prefix}${field}`;
    let val = $(`#${id}`).val();
    if (val == undefined) {
        val = '';
    }
    return val;
}
//#endregion

//#region 修改客户
function initUpdateCustomer() {
    let objs = listCustomerManager.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let configs = [
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_SHORT_NAME,
            type: 'text',
            require: true,
            field: 'kh_jc',
            defaultVal: obj.kh_jc
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_FULL_NAME,
            type: 'text',
            require: true,
            field: 'kh_qc',
            defaultVal: obj.kh_qc
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_NATION_TYPE,
            type: 'select',
            select: customerBaseParamsInfo.editNationTypeSelect,
            require: true,
            field: 'gj_type',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_NATION_NAME,
            type: 'text',
            require: true,
            field: 'gj_name',
            defaultVal: obj.gj_name
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_PROVINCE,
            type: 'select',
            select: customerBaseParamsInfo.editProvinceSelect,
            require: true,
            field: 'sheng',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_CITY,
            type: 'select',
            select: customerBaseParamsInfo.editCitySelect,
            require: true,
            field: 'shi',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_COUNTRY,
            type: 'select',
            select: customerBaseParamsInfo.editCountrySelect,
            require: true,
            field: 'xian',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_DOMESTIC_ADDRESS,
            type: 'text',
            require: false,
            field: 'gn_xxdz',
            defaultVal: obj.gn_xxdz
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_FOREIGN_CONTINENT,
            type: 'select',
            select: customerBaseParamsInfo.editContinentSelect,
            require: false,
            field: 'gw_qy',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_FOREIGN_ADDRESS,
            type: 'text',
            require: false,
            field: 'gw_xxdz',
            defaultVal: obj.gw_xxdz
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_GRADE,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerGradeSelect,
            require: true,
            field: 'kh_jb',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_INDUSTRY,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerIndustrySelect,
            require: true,
            field: 'kh_hy',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_SOURCE,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerSourceSelect,
            require: true,
            field: 'kh_ly',
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_TYPE,
            type: 'select',
            select: customerBaseParamsInfo.editCustomerTypeSelect,
            require: true,
            field: 'kh_lx',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_BANK_NAME,
            type: 'text',
            require: false,
            field: 'bankname',
            defaultVal: obj.bankname
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_BANK_CODE,
            type: 'text',
            require: false,
            field: 'bankcard',
            defaultVal: obj.bankcard
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_BANK_NUMBER,
            type: 'text',
            require: false,
            field: 'hanghao',
            defaultVal: obj.hanghao
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CREDIT_CODE,
            type: 'text',
            require: false,
            field: 'xydm',
            defaultVal: obj.xydm
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_CONTACT,
            type: 'text',
            require: false,
            field: 'cy_lxr',
            defaultVal: obj.cy_lxr
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_CONTACT_TEL,
            type: 'text',
            require: false,
            field: 'cy_lxr_tel',
            defaultVal: obj.cy_lxr_tel
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_EMAIL,
            type: 'text',
            require: false,
            field: 'cy_Email',
            defaultVal: obj.cy_Email
        },
        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_DEAL_STATUS,
            type: 'select',
            select: customerBaseParamsInfo.editDealStatusSelect,
            require: true,
            field: 'cj_flag',
        },

        {
            title: CONSTANS.PAGE_CUSTOMER_MANAGER.PARAM_CUSTOMER_REMARK,
            type: 'text',
            require: false,
            field: 'kh_bz',
            colspan: 3,
            defaultVal: obj.kh_bz
        },
    ]
    let option = {
        rowCount: 2,
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);

    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    generateStandardDataHtmlTd(configs, html, option)
    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);

    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: get_lan_new_str("添加客户"),
        area: ["600px", "540px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();
            specialBindForUpdateCustomer(obj);
            $("#btn_submit").on('click', function () {
                updateCustomer(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}

function specialBindForUpdateCustomer(obj) {

    //#region 国内外区域联动
    let regionList = ['editProvinceSelect', 'editCitySelect', 'editCountrySelect', 'editContinentSelect'];
    // regionList.forEach(p => {
    //     $(`#${p}`).attr('disabled', 'disabled');
    // })

    let addrList = ['txt_edit_gn_xxdz', 'txt_edit_gw_xxdz'];
    // addrList.forEach(p => {
    //     $(`[data-edit-panel] #${p}`).attr('readonly', 'readonly');
    //     $(`[data-edit-panel] #${p}`).attr('placeholder', '');
    // })

    $("#editNationTypeSelect").on('change', function (e) {
        let val = $(this).val() + "";

        if (val == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC + "") {
            // 选择国内，国内解除限制
            regionList.forEach(p => {
                $(`#${p}`).removeAttr('disabled');
                $(`#${p}`).attr('required', 'required');
            })
            $("[data-edit-panel] #txt_edit_gn_xxdz").removeAttr('readonly');
            $("[data-edit-panel] #txt_edit_gn_xxdz").attr('required', 'required');
            $("[data-edit-panel] #txt_edit_gj_name").val('中国');

            // 国外解除required
            $("#editContinentSelect").val(-1);
            $("#editContinentSelect").attr('disabled', 'disabled');
            $("#editContinentSelect").removeAttr('required');
            $("[data-edit-panel] #txt_edit_gw_xxdz").val('');
            $("[data-edit-panel] #txt_edit_gw_xxdz").attr('readonly', 'readonly');
            $("[data-edit-panel] #txt_edit_gw_xxdz").removeAttr('required');
        }
        else if (val == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN + "") {
            // 选择国外，国内开启限制，解除required
            regionList.forEach(p => {
                $(`#${p}`).removeAttr('required');
                $(`#${p}`).attr('disabled', 'disabled');
                $(`#${p}`).val(-1);
            })
            $("[data-edit-panel] #txt_edit_gn_xxdz").val('');
            $("[data-edit-panel] #txt_edit_gn_xxdz").attr('readonly', 'readonly');
            $("[data-edit-panel] #txt_edit_gn_xxdz").removeAttr('required');

            $("#editContinentSelect").removeAttr('disabled');
            $("#editContinentSelect").attr('required', 'required');
            $("#editContinentSelect").val(-1);
            $("[data-edit-panel] #txt_edit_gw_xxdz").removeAttr('readonly');
            $("[data-edit-panel] #txt_edit_gw_xxdz").attr('required', 'required');
            $("[data-edit-panel] #txt_edit_gw_xxdz").val('');
        }
        else if (val == '-1') {
            $("[data-edit-panel] #txt_edit_gj_name").val('');

            regionList.forEach(p => {
                $(`#${p}`).removeAttr('required');
                $(`#${p}`).attr('disabled', 'disabled');
                $(`#${p}`).val(-1);
                $(`#${p}`).removeClass("require_color");
            })

            addrList.forEach(p => {
                $(`[data-edit-panel] #${p}`).removeClass('require_color');
                $(`[data-edit-panel] #${p}`).attr('readonly', 'readonly');
                $(`[data-edit-panel] #${p}`).attr('required', 'required');
                $(`[data-edit-panel] #${p}`).val('');
            })
        }
    });
    //#endregion

    //#region 省市县联动
    // initHideAreaSelectOption();

    function initHideAreaSelectOption() {
        let hideSelectOptionList = [];
        hideSelectOptionList = ["editCitySelect", "editCountrySelect"];
        hideSelectOptionList.forEach(p => {
            $(`#${p}`).html('');
        });
    }
    //#endregion

    //#region 联动方法
    $("#editProvinceSelect").on('change', function (e) {
        let val = $(this).val();
        if (XWUTILS.equalNumTransStr(val, CONSTANS.NORMAL_VAL.DERAULT_SEL_VAL)) {
            BindSelect('editCitySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
            BindSelect('editCountrySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
        else {
            let citys = customerBaseParamsInfo.provinceJson.find(p => p.name == val);
            BindSelect('editCitySelect', citys.city, 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
            BindSelect('editCountrySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
    });
    $("#editCitySelect").on('change', function (e) {
        let val = $(this).val();
        if (XWUTILS.equalNumTransStr(val, CONSTANS.NORMAL_VAL.DERAULT_SEL_VAL)) {
            BindSelect('editCountrySelect', [], 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
        else {
            let countrys = customerBaseParamsInfo.cityJson.find(p => p.name == val);
            BindSelect('editCountrySelect', countrys.area, 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
        }
    });
    //#endregion

    //#region 上面绑定了change的事件，这里直接变动触发
    $("#editNationTypeSelect").val(obj.gj_type);
    let regionJsonList = [
        {
            select: 'editProvinceSelect',
            field: 'sheng',
            type: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC,
            val: obj.sheng,
        },
        {
            select: 'editCitySelect',
            field: 'shi',
            type: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC,
            val: obj.shi,
        },
        {
            select: 'editCountrySelect',
            field: 'xian',
            type: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC,
            val: obj.xian,
        },
        {
            select: 'editContinentSelect',
            field: 'gw_qy',
            type: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN,
            val: obj.gw_qy,
        },
    ];
    let dList = regionJsonList.filter(p => p.type == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC);
    let fList = regionJsonList.filter(p => p.type == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN);

    if (obj.gj_type == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_DOMESTIC) {
        // 国内就禁止国外
        fList.forEach(p => {
            $(`#${p.select}`).attr('disabled', 'disabled');
            $(`#${p.select}`).removeAttr('required');
        })
        $(`[data-edit-panel] #txt_edit_gw_xxdz`).attr('readonly', 'readonly');
        $(`[data-edit-panel] #txt_edit_gw_xxdz`).removeAttr('required');

        // 国内就触发省市县
        dList.forEach(p => {
            let val = p.val;
            if (p.field == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_PROVINCE) {
                let citys = customerBaseParamsInfo.provinceJson.find(p => p.name == val);
                BindSelect('editCitySelect', citys.city, 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
            }
            else if (p.field == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY) {
                let countrys = customerBaseParamsInfo.cityJson.find(p => p.name == val);
                BindSelect('editCountrySelect', countrys.area, 'name', 'name', -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 })
            }
            $(`#${p.select}`).val(val);
        })
    }
    else if (obj.gj_type == CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SIGN_FOREGIN) {
        // 国外就禁止国内
        dList.forEach(p => {
            $(`#${p.select}`).attr('disabled', 'disabled');
            $(`#${p.select}`).removeAttr('required');
        })
        $(`[data-edit-panel] #txt_edit_gn_xxdz`).attr('readonly', 'readonly');
        $(`[data-edit-panel] #txt_edit_gn_xxdz`).removeAttr('required');

        // 国外就触发国外区域continent
        fList.forEach(p => {
            $(`#${p.select}`).val(p.val);
        })
    }

    //#endregion

    //#region 其他select的绑定
    let otherSelects = [
        {
            selectKey: "editCustomerGradeSelect",
            field: "kh_jb"
        },
        {
            selectKey: "editCustomerIndustrySelect",
            field: "kh_hy"
        },
        {
            selectKey: "editCustomerSourceSelect",
            field: "kh_ly"
        },
        {
            selectKey: "editCustomerTypeSelect",
            field: "kh_lx"
        },
        {
            selectKey: "editDealStatusSelect",
            field: "cj_flag"
        },
    ];
    otherSelects.forEach(p => {
        let field = p.field
        $(`#${p.selectKey}`).val(obj[field]);
    });
    //#endregion
}

async function updateCustomer(tk_index) {
    let objs = listCustomerManager.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let flag = XWUTILS.emitAlertRequireItem();
    if (!flag) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }


    let kh_id = obj.kh_id;
    let kh_jc = getDataFromStandardDataHtmlTdText('kh_jc')
    let kh_qc = getDataFromStandardDataHtmlTdText('kh_qc')
    let gj_type = $("#editNationTypeSelect").val();
    let gj_name = getDataFromStandardDataHtmlTdText('gj_name')

    let sheng = $("#editProvinceSelect").find('option:selected').text();
    let shi = $("#editCitySelect").find('option:selected').text();
    let xian = $("#editCountrySelect").find('option:selected').text();

    let gn_xxdz = getDataFromStandardDataHtmlTdText('gn_xxdz')
    let gw_qy = $("#editContinentSelect").val();
    let gw_xxdz = getDataFromStandardDataHtmlTdText('gw_xxdz')
    let kh_jb = $("#editCustomerGradeSelect").val();
    let kh_hy = $("#editCustomerIndustrySelect").val();
    let kh_ly = $("#editCustomerSourceSelect").val();
    let kh_lx = $("#editCustomerTypeSelect").val();
    let bankcard = getDataFromStandardDataHtmlTdText('bankcard')
    let bankname = getDataFromStandardDataHtmlTdText('bankname')
    let hanghao = getDataFromStandardDataHtmlTdText('hanghao')
    let xydm = getDataFromStandardDataHtmlTdText('xydm')
    let cy_lxr = getDataFromStandardDataHtmlTdText('cy_lxr')
    let cy_lxr_tel = getDataFromStandardDataHtmlTdText('cy_lxr_tel')
    let cy_Email = getDataFromStandardDataHtmlTdText('cy_Email')
    let kh_bz = getDataFromStandardDataHtmlTdText('kh_bz')
    let cj_flag = $("#editDealStatusSelect").val();

    let JsonPara = {
        kh_id: kh_id,
        kh_jc: kh_jc, kh_qc: kh_qc, gj_type: gj_type, gj_name: gj_name,
        sheng: sheng, shi: shi, xian: xian, gn_xxdz: gn_xxdz,
        gw_qy: gw_qy, gw_xxdz: gw_xxdz, kh_jb: kh_jb, kh_hy: kh_hy,
        kh_ly: kh_ly, kh_lx: kh_lx, bankcard: bankcard, bankname: bankname,
        hanghao: hanghao, xydm: xydm, cy_lxr: cy_lxr, cy_lxr_tel: cy_lxr_tel,
        cy_Email: cy_Email, kh_bz: kh_bz, cj_flag: cj_flag
    };

    let apiurl = APIS.APIS_CUSTOMER_MANAGER.updateCustomer;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    layer.close(tk_index);
    XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
    await getDataCustomerManagerList(listCustomerManagerPageIndex);
}

// function generateStandardDataHtmlTd(configs, html, option) {
//     let rowCount = 1; // 默认一行一个参数
//     let prefix = "txt_edit_"
//     if (option != undefined) {
//         rowCount = option.rowCount;
//         if (option.prefix != undefined) {
//             prefix = option.prefix;
//         }
//     }
//     let calCount = 0; // 计数器

//     html.Append(`<tr data-edit-panel>\r\n`);
//     configs.forEach(c => {
//         let title = c.title;
//         let type = c.type;
//         let requiredFlag = c.require;
//         let required = ''
//         if (requiredFlag == true) {
//             required = 'required';
//         }
//         let field = c.field
//         let id = `${prefix}${field}`;
//         let select = c.select;
//         let colspan = c.colspan;
//         if (colspan == undefined) {
//             colspan = 1;
//         }
//         let titleWid = c.titleWid;
//         if (titleWid == undefined) {
//             titleWid = 85;
//         }

//         if (type == 'text') {
//             html.Append(`<td style='width: ${titleWid}px' align='center'>${title}</td>\r\n`);
//             html.Append(`<td colspan='${colspan}'><input data-enter type="text" class="cz-input" ${required} id="${id}"/></td>\r\n`);
//         }
//         else if (type == 'select') {
//             html.Append(`<td style='width: ${titleWid}px' align='center'>${title}</td>\r\n`);
//             html.Append(`<td colspan='${colspan}' ${required}>${select}</td>\r\n`);
//         }
//         else if (type == 'empty') {
//             html.Append(`<td colspan='${colspan}'></td>\r\n`);
//         }
//         calCount = calCount + 1;
//         if (calCount == rowCount) {
//             html.Append(`</tr>\r\n`);
//             html.Append(`<tr data-edit-panel>\r\n`);
//             calCount = 0;
//         }
//     });
// }

// function getDataFromStandardDataHtmlTdText(field, prefixStr) {
//     let prefix = "txt_edit_"
//     if (prefixStr != undefined) {
//         prefix = prefixStr;
//     }
//     let id = `${prefix}${field}`;
//     let val = $(`#${id}`).val();
//     if (val == undefined) {
//         val = '';
//     }
//     return val;
// }
//#endregion

//#region 删除客户
function initDelCustomer() {
    let objs = listCustomerManager.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let kh_id = obj.kh_id;
    let kh_jc = obj.kh_jc;

    let tk = layer.confirm(`${CONSTANS.NORMAL_STR.CONFIRM_DELETE} ${kh_jc}`, () => {
        let JsonPara = { kh_id: kh_id }
        let apiurl = APIS.APIS_CUSTOMER_MANAGER.delCustomer;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
            layer.close(tk);
            getDataCustomerManagerList(listCustomerManagerPageIndex);
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    });
}
//#endregion

//#endregion

//#region 省市县三级联动
function regionInteraction(field, sign, list) {
    let dom = $(`#listCustomerManager [data-select-sign="${field}"]`);
    let val = $(dom).val();

    if (sign == CONSTANS.PAGE_CUSTOMER_MANAGER.SIGN_SENIOR_SEARCH) {
        if (list.length > 1) {

        }
    }
    else {
        switch (field) {
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_PROVINCE:
                seniroSearchParams.listProvince = [];
                seniroSearchParams.listCity = [];
                seniroSearchParams.listCountry = [];
                if (val == -1 || val == '-1') {
                    hideAreaSelectOption(CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_HIDE_CITY_COUNTRY);
                }
                else {
                    let text = $(dom).find('option:selected').text();
                    let obj = {
                        text: text,
                        val: val
                    }
                    let flag = seniroSearchParams.listProvince.findIndex(p => p.val == val);
                    if (flag == -1) {
                        seniroSearchParams.listProvince.push(obj);
                    }
                    showAreaSelectOption(CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_SHOW_CITY)
                    let list = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY, CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY];
                    // resetAreaSelect(list)
                }
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY:
                seniroSearchParams.listCity = [];
                seniroSearchParams.listCountry = [];

                if (val == -1 || val == '-1') {
                    hideAreaSelectOption(CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_HIDE_COUNTRY);
                }
                else {
                    let text = $(dom).find('option:selected').text();
                    let obj = {
                        text: text,
                        val: val
                    }
                    let flag = seniroSearchParams.listCity.findIndex(p => p.val == val);
                    if (flag == -1) {
                        seniroSearchParams.listCity.push(obj);
                    }
                    showAreaSelectOption(CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_SHOW_COUNTRY);
                    let list = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY];
                    // resetAreaSelect(list)
                }
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY:
                seniroSearchParams.listCountry = [];
                if (val == -1 || val == '-1') {
                }
                else {
                    let text = $(dom).find('option:selected').text();
                    let obj = {
                        text: text,
                        val: val
                    }
                    let flag = seniroSearchParams.listCountry.findIndex(p => p.val == val);
                    if (flag == -1) {
                        seniroSearchParams.listCountry.push(obj);
                    }
                }
                break;
            case CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CONTINENT:
                seniroSearchParams.listContinent = [];
                if (val == -1 || val == '-1') {
                }
                else {
                    let text = $(dom).find('option:selected').text();
                    let obj = {
                        text: text,
                        val: val
                    }
                    let flag = seniroSearchParams.listContinent.findIndex(p => p.val == val);
                    if (flag == -1) {
                        seniroSearchParams.listContinent.push(obj);
                    }
                }
                break;
        }

        let flag = XWUTILS.hasAnyNonEmptyList(seniroSearchParams);
        if (flag) {
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion']`).addClass('single_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SINGLE_QUERYING)
        }
        else {
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SENIRO_SEARCH)
        }
    }

    function hideAreaSelectOption(action) {
        let hideSelectOptionList = [];
        if (action == CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_HIDE_COUNTRY) {
            hideSelectOptionList = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY];
        }
        else if (action == CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_HIDE_CITY_COUNTRY) {
            hideSelectOptionList = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY, CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY];
        }
        else {
            hideSelectOptionList = [];
        }

        hideSelectOptionList.forEach(p => {
            $(`[data-select-sign="${p}"] option`).each(function (e) {
                let val = $(this).val();
                if (val != -1) {
                    $(this).hide();
                }
            });
            $(`[data-select-sign="${p}"]`).val(-1)
        });
    }

    function showAreaSelectOption(action) {
        let superArea; // 上级单位
        let nowMatchAreaList; // 当前单位
        let hideSelectOptionList = [];
        if (action == CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_SHOW_CITY) {
            hideSelectOptionList = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY];
            superArea = CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_PROVINCE;
            let superCode = $(`[data-select-sign="${superArea}"]`).val();
            if (superCode != -2 && superCode != -1) {
                nowMatchAreaList = customerBaseParamsInfo.provinceJson.find(p => p.code == superCode);
                nowMatchAreaList = nowMatchAreaList.city.map(p => p.code);
            }
        }
        else if (action == CONSTANS.PAGE_CUSTOMER_MANAGER.VAL_SHOW_COUNTRY) {
            hideSelectOptionList = [CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_COUNTRY];
            superArea = CONSTANS.PAGE_CUSTOMER_MANAGER.STR_EN_CITY;
            let superCode = $(`[data-select-sign="${superArea}"]`).val();
            if (superCode != -2 && superCode != -1) {
                nowMatchAreaList = customerBaseParamsInfo.cityJson.find(p => p.code == superCode);
                nowMatchAreaList = nowMatchAreaList.area.map(p => p.code);
            }
        }
        else {
            hideSelectOptionList = [];
            superArea = '';
            nowMatchAreaList = [];
        }

        hideSelectOptionList.forEach(p => {
            $(`[data-select-sign="${p}"] option`).each(function (e) {
                let val = $(this).val();
                if (val != -1) {
                    $(this).hide();
                }
                if (nowMatchAreaList != undefined) {
                    if (val != -1 && nowMatchAreaList.includes(val)) {
                        $(this).show();
                    }
                }
            });
        });
    }

    function resetAreaSelect(list) {
        list.forEach(p => {
            $(`[data-select-sign="${p}"] option`).each(function (e) {
                $(this).val(-1);
            });
        });
    }

}
// 输入框的联动
function regionInteractionInput(field) {
    seniroSearchParams.listNationName = [];
    let dom = $(`#listCustomerManager [data-input-sign="${field}"]`);
    let val = $(dom).val();
    val = val.replace('，', ',');
    let valList = val.split(',');
    if (XWUTILS.isUndefine(valList)) {
        let flag = XWUTILS.hasAnyNonEmptyList(seniroSearchParams);
        if (flag) {
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion']`).addClass('muli_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_QUERYING)
        }
        else {
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
            $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SENIRO_SEARCH)
        }
        return;
    }
    valList.forEach(p => {
        let obj = {
            val: p,
            text: p
        }
        seniroSearchParams.listNationName.push(obj);
    });
    let flag = XWUTILS.hasAnyNonEmptyList(seniroSearchParams);
    if (flag) {
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion']`).addClass('muli_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_QUERYING)
    }
    else {
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('muli_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion']`).removeClass('single_seled_highline');
        $(`.container [data-action='seniorGetDataCustomerRegion'] .fcc`).text(CONSTANS.PAGE_CUSTOMER_MANAGER.STR_SENIRO_SEARCH)
    }
}
//#endregion

//#region 查看日志
function initOpenWindowOperateLog() {
    let objs = listCustomerManager.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    openWindowOperateLog(obj);
}
function openWindowOperateLog(customerObj) {
    let listOperateLog;
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`        <div class='cust-cz-con-list' ><div id="listOperateLog"></div></div>\r\n`);
    html.Append(`        <div class="cust-cz-con-page-section">\r\n`);
    html.Append(`            <div class="cust-cz-con-page-content" id="listOperateLogPager"></div>\r\n`);
    html.Append(`        </div>\r\n`);
    html.Append(`   </div>\r\n`);

    // html.Append(`   <div class="cz_footer">\r\n`);
    // html.Append(`       <button id="btn_optrate_log_submit" type="button" class="cz_fter_btn">${CONSTANS.PAGE_CUSTOMER_MANAGER.STR_ROLLBACK_LOG}</button>\r\n`);
    // html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_VIEW_LOG,
        area: ["800px", "600px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_optrate_log_submit").on('click', function () {
                // execQueryRegionUserUniversal(tk_index);
            });
            initGetDataOperateLogList();
        },
        end: function () {
            $("#btn_optrate_log_submit").off();
        }
    });

    async function initGetDataOperateLogList() {
        let list = [];
        let origionList = [];
        let jExcelObj = getOperateLogOptions(list);
        listOperateLog = $("#listOperateLog").jexcel({
            data: jExcelObj.data,
            columns: jExcelObj.columns,
            originData: origionList,
            allowContextMenu: false,
        });
        listOperateLog.createCustomHeader();
        // $("#listOperateLog [data-input-sign]").on("keyup", function (e) {
        //     if ($(this).val() == "") {
        //         getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
        //     }
        //     var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        //     if (key == 13) {
        //         e.stopPropagation();
        //         getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
        //     }
        // });
        // $("#listOperateLog [data-select-sign]").on("change", function (e) {
        //     getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
        // });
        await getDataOperateLogList();

        let contextList = [
            {
                title: CONSTANS.PAGE_CUSTOMER_MANAGER.STR_ROLLBACK_LOG,
                dataPerm: 'context.customer.manager.rollback.log',
                id: 1,
                callback: initCustomerRollBackOperateLog,
                show: false,
            },
        ];
        XWUTILS.renenderContextButton(permissionList.list, 'listOperateLog', contextList, 'jexcel_custom_element');
        // initUserUniversalPager();
    }
    function getOperateLogOptions(list) {
        let columns = customerManagerPageOptions.operateLogOptions;
        let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
        return jExcelObj;
    }
    async function getDataOperateLogList() {
        let JsonPara = { cz_id: "-1", ys_id: customerObj.kh_id }

        let apiurl = APIS.APIS_CUSTOMER_MANAGER.getOperateLog;
        let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
        if (re_obj.flag != 1) {
            layer.alert(re_obj.msg);
            return null;
        }
        let list = re_obj.data;
        list = list.OrderByDesc(p => p.rz_id);
        let jExcelObj = getOperateLogOptions(list);
        listOperateLog.setData(jExcelObj.data);
    }
}
//#endregion

//#region 回退日志
function initCustomerRollBackOperateLog() {
    let objs = listOperateLog.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let rz_id = obj.rz_id;

    let tk = layer.confirm(`${CONSTANS.NORMAL_STR.CONFIRM_DELETE} ${kh_jc}`, () => {
        let JsonPara = { kh_id: kh_id }
        let apiurl = APIS.APIS_CUSTOMER_MANAGER.delCustomer;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
            layer.close(tk);
            getDataCustomerManagerList(listCustomerManagerPageIndex);
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    });
}

//#endregion

