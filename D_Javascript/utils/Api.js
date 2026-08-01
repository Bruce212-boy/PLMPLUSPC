let APIS = {
    // 域名
    api_yuming: "http://127.0.0.1:1901/",
    // api_yuming: "http://10.168.1.102:1901/",
    file_yuming: "http://127.0.0.1:1902/",

    // 登录
    login: 'api/login/get_token',
    getUserMenu: "api/quanxian/get_yh_cd",
    getUserInfo: "api/quanxian/get_me",
    getUserAll: "api/yonghu/get_all",

    getSafty: "api/quanxian/get_safety",


    APIS_FILE_UPLOAD: {
        getFileList: "api/wenjian/get_list",
        addFile: "api/wenjian/add",
        delFile: "api/wenjian/delete",
    },


    APIS_CUST_INFO: {
        getListCustomAll: "api/kehu/get_list_kh_1_bfy",
        getListCustomAll3: "api/kehu/get_list_kh_3_bfy",
        getListCustom1: "api/kehu/get_list_kh_1",
        addCustom: "api/kehu/add",
        updateCustom: "api/kehu/update",
        delCustom: "api/kehu/delete",
        setCustomOwner: "api/kehu/set_gsr",
        getListCustom2: "api/kehu/get_list_kh_2",
        getListCustom3: "api/kehu/get_list_kh_3",

        // 客户阶段
        getCustomPhase: "api/gdmb/get_xsmb_1",
    },

    APIS_PROD_INFO: {
        getProdList: "api/chanpin/get_list",
        addProduct: "api/chanpin/add",
        updateProduct: "api/chanpin/update",
        delProduct: "api/chanpin/delete",
        setProductImg: "api/chanpin/set_cp_img",
    },

    APIS_SALE_TEMPLATE: {
        getSaleTemplate1: "api/gdmb/get_xsmb_1",
        getSaleTemplate2: "api/gdmb/get_xsmb_2",
        getSaleTemplate3: "api/gdmb/get_xsmb_3",

        addSaleSel2: "api/gdmb/add_xs_2",
        updateSaleSel2: "api/gdmb/update_xs_2",
        delSaleSel2: "api/gdmb/delete_xs_2",

        addSaleSel3: "api/gdmb/add_xs_3",
        updateSaleSel3: "api/gdmb/update_xs_3",
        delSaleSel3: "api/gdmb/delete_xs_3",
    },

    // 客户管理
    APIS_CUSTOMER_MANAGER: {
        getCustomerList: "api/kehu/get_list_kh_1",
        addCustomer: "api/kehu/add",
        updateCustomer: "api/kehu/update",
        delCustomer: 'api/kehu/delete',

        // 拿操作日志
        getOperateLog: "api/kehu/get_log_by_item",
        recoveryOperateLog: "api/kehu/hf_log",
    },

    // 用户参数
    APIS_USER_PARAM: {
        getSysTypeList: "api/yhzd_para/get_para_type_list",
        getList: "api/yhzd_para/get_list",
        getListByTypeIDs: "api/yhzd_para/get_list_by_type_id",

        addType: "api/yhzd_para/add_t",
        updateType: "api/yhzd_para/update_t",
        delType: "api/yhzd_para/delete_t",

        addPara: "api/yhzd_para/add",
        updatePara: "api/yhzd_para/update",
        delPara: "api/yhzd_para/delete",
    },

    // 系统参数
    APIS_SYSTEM_PARAM: {
        getSysTypeList: "api/sys_para/get_para_type_list",
        getList: "api/sys_para/get_list",
        getListByTypeIDs: "api/sys_para/get_list_by_type_id",

        addType: "api/sys_para/add_t",
        updateType: "api/sys_para/update_t",  // 类型
        delType: "api/sys_para/delete_t",

        addPara: "api/sys_para/add",
        updatePara: "api/sys_para/update",   // 详细参数
        delPara: "api/sys_para/delete",
    },

    APIS_USER_INFO: {
        getUserList: "api/yonghu/get_list",
        addUser: "api/yonghu/add",
        updateUser: "api/yonghu/update",
        delUser: "api/yonghu/delete",
        delPcCode: "api/yonghu/del_pc_code",
        delTelCode: "api/yonghu/del_tel_code",
        getSysParaByIDS: "api/sys_para/get_list_by_type_id",
        getYhzdParaByIDS: "api/yhzd_para/get_list_by_type_id",
    },

    // 用户管理
    APIS_USER_MANAGER: {
        getUserList: "api/yonghu/get_list",
        getUserListNotPage: "api/yonghu/get_list_wfy",
        getUserListByCompany: "api/yonghu/get_all",

        addUser: "api/yonghu/add",
        updateUser: "api/yonghu/update",
        delUser: "api/yonghu/delete",

        // 获取当前登录用户所在公司及下属公司
        getLoginUserCompanyInfo: "api/gs_jg/get_qx_gs",

        // 为某个用户分配权限
        grantPermsToUser: "api/yonghu/fp_qx",
    },

    APIS_ADUIT_MACHINE: {
        getAduitList: "api/yonghu/get_list_jqsh",
        setAduitMachine: "api/yonghu/sh_jq",
        delMachine: "api/yonghu/del_jqsh",
    },

    // 公司架构
    APIS_COMPANY_STRUCT: {
        getCompanyList: "api/gs_jg/get_list",
        addCompany: "api/gs_jg/add",
        updateCompany: "api/gs_jg/update",
        delCompany: "api/gs_jg/delete",
        setCompanyDeatil: "api/gs_jg/set_xx",
    },


    // 角色权限
    APIS_PERMISSION: {
        // 角色增删改查
        getPermsRoleList: "api/quanxian/get_list",
        addPermsRole: "api/quanxian/add",
        updatePermsRole: "api/quanxian/update",
        delPermsRole: "api/quanxian/delete",

        // 菜单查询
        getPermsMenuList: "api/quanxian/get_cd_list",

        // 功能按钮增删改查
        getPermsFunList: "api/quanxian/get_gn_list",
        addPermsFunList: "",
        updatePermsFunList: "",
        delPermsFunList: "",

        // 批量保存 二级菜单和功能id
        savePermsPageAndFun: "api/quanxian/qx_save",
        cleanPermsAll: "api/quanxian/qx_clear",

        // 获取某权限 已有的菜单ID和功能ID
        getPermsHasMenu: "api/quanxian/get_xz_cd_id",
        getPermsHasFun: "api/quanxian/get_xz_gn_id",

        // 将权限分配给某些用户
        assignPermsToUser: "api/quanxian/fp_yh",

        // 移除权限
        removePermsFromUser: "api/quanxian/yc_qx",
    },

    // 功能设置
    APIS_FUN_SETTING: {
        // 功能按钮增删改查
        addFunButton: "api/quanxian/gn_add",
        updateFunButton: "api/quanxian/gn_update",
        delFunButton: "api/quanxian/gn_delete",
    }

}

