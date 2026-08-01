
let CONSTANS = {
    NORMAL_VAL: {
        ZERO: 0,
        ONE: 1,
        TWO: 2,
        THREE: 3,
        APP_PEND: 1,
        PRE_PEND: 2,

        SENIOR_MANAGER_LIST: [1, 2],
        SYST_MANAGER: 1,
        LEVEL_ONE_MANAGER: 2,
        LEVEL_TWO_MANAGER: 3,
        LEVEL_THREE_MANAGER: 4,

        PERM_TREE_LEVEL_ZERO: 0,
        PERM_TREE_LEVEL_ONE: 1,
        PERM_TREE_LEVEL_TWO: 2,

        VAL_YES: 1,
        VAL_NO: 0,

        SOURCE_FROM_NET: 1,
        SOURCE_FROM_STATIC: 2,

        SYS_ADMIN_PERM: 1,

        DERAULT_SEL_VAL: -1,

        TWENTY_PAGE: 20,

    },

    NORMAL_STR: {
        NO_MORE_DATA: "没有更多数据",
        CONFIRM_DELETE: "确认删除吗",
        OPT_FINISHED: "操作完成",
        OPT_FAILED: "操作失败请检查",
        CONFIRM_EXEC: "确认执行吗",


        PLEASE_RETRY_GET_ID_FAIL: "获取信息失败请关闭重试",
        PLEASE_RETRY_GET_USER_BASE_FAIL: "获取基本信息失败请关闭重试",
        PLEASE_SELECT_ITEM: "请选择一项",
        PLEASE_SELECT_ITEM_LIST: "请选择需要",
        PLEASE_INPUT_TEXT: "请输入必填项",
        SUBMIT: "提交",
        ALL_CLEAN: "全部清空",
        LOADING: "加载中",
        SUCCESS: "操作成功",

        PLEASE_SELECT: "请选择",
        STR_YES: "是",
        STR_NO: "否",
        STR_PREV_PAGE: "上一页",
        STR_NEXT_PAGE: "下一页",
        STR_FIRST_PAGE: "首页",
        STR_LAST_PAGE: "尾页",

        STR_SELECT: "选择",
        STR_ADD: "添加",
        STR_UPDATE: "修改",
        STR_DEL: "删除",
        STR_CLEAN: "清空",

        STR_SEARCH: "搜索",

        STR_FIELD_VAL: "zd_1",
        STR_FIELD_TEXT: "zd_2",

        DERAULT_SEL_VAL: "-1",

        STR_FIELD: "字段",
        STR_FROM: '从',
    },

    layerPageSize: {
        tk_1_w: "600px",
        tk_1_h: "550px",

        tk_mini_w: "250px",
        tk_mini_h: "210px",

        tk_2_w: "500px",

        tk_95: "95%",
        tk_85: "85%",
        tk_75: "75%",
        tk_65: "65%",
        tk_55: "55%",
    },

    MENU_PERMS_ID: {
        CUST_INFT: 1,
        PUBLIC_CUST: 2,
        PROD_MACHINE: 3,
        PROD_PARTS: 4,
        SALE_TEMPLATE: 31,
    },

    FILE_COM_TYPE: {
        PRODUCT_FILE: 1,
        CONTRACT_FILE: 2,
        WORK_ORD_IMG: 3,
        WORK_ORD_FILE: 4,
        PROJECT_IMG: 5,
        PROJECT_FILE: 6,
    },

    CTS_CUST_INFO: {
        KH_PHASE: 0, // 废弃
        KH_LEVEL: 1,
        KH_FOREIGN: 2,

        KH_INDUSTRY: 4,
        KH_ORIGIN: 5,
        KH_TYPE: 6,

        MANAGER_LIST: [1, 2],

        SET_OWNER_MODE: 1, // 设置归属人

        CHINA_FLAG: 1,
        FOREGIN_FLAG: 2,

        // 下方切换TAB
        TAB_SALE_CODE: 1,
        TAB_CONTRACT_CODE: 2,
        TAB_PROJECT_CODE: 3,
        TAB_SENIOR_CONTACT: 4,

        PUBLIC_SEA: "公海",
    },

    CTS_PROD_INFO: {
        PROD_SERIES: 8,
        PROD_TYPE: 9,
    },

    CTS_SALE_TEMPLATE: {
        SINGLE_SEL: 1,
        MULTIPLE_SEL: 2,
        FILL_IN: 3,
    },

    CTS_SYS_PARAM: {
        BM_ID: 1, // 部门
        ZW_ID: 2, // 职位
        SP_ID: 3, // 水平
    },

    // 客户管理
    PAGE_CUSTOMER_MANAGER: {

        //#region 是否成交,国家类型
        STR_DEAL_PENDING: "未成交",
        STR_DEAL_COMPLETED: "已成交",
        STR_DOMESTIC: "国内",
        STR_FOREIGN: "国外",
        STR_SIGN_DOMESTIC: 1,
        STR_SIGN_FOREGIN: 2,
        //#endregion

        // 系统参数
        STR_SIGN_CUSTOMER_GRADE: 1,
        STR_SIGN_CUSTOMER_CONTINENT: 2,
        // 用户参数
        STR_SIGN_CUSTOMER_INDUSTRY: 4,
        STR_SIGN_CUSTOMER_SOURCE: 5,
        STR_SIGN_CUSTOMER_TYPE: 6,

        STR_ALL: "全部",

        //#region 省,市,县,洲
        STR_PROVINCE: "省",
        STR_CITY: "市",
        STR_COUNTRY: "县",
        STR_CONTINENT: "区域",
        STR_NATION_NAME: "国家名",

        STR_EN_PROVINCE: "sheng",
        STR_EN_CITY: "shi",
        STR_EN_COUNTRY: "xian",
        STR_EN_CONTINENT: "gw_qy",
        STR_EN_NATION_NAME: "gj_name",

        STR_SELECTED_PROVINCE: "已选省",
        STR_SELECTED_CITY: "已选市",
        STR_SELECTED_COUNTRY: "已选县",
        STR_SELECTED_CONTINENT: "已选区域",
        STR_SELECTED_NATION_NAME: "已选国家",

        STR_SIGN_PROVINCE: "1",
        STR_SIGN_CITY: "2",
        STR_SIGN_COUNTRY: "3",
        STR_SIGN_CONTINENT: "4",
        STR_SIGN_NATION_NAME: "5",
        //#endregion

        STR_QUERYING: "复合查询中...",
        STR_SINGLE_QUERYING: "单一查询中...",
        STR_AREA_QUERYING: "复合查询中",
        STR_SENIRO_SEARCH: "复合查询",

        PLEASE_INPUT_AND_ENTER: "请输入后按回车",


        VAL_HIDE_COUNTRY: 1,
        VAL_HIDE_CITY_COUNTRY: 2,

        VAL_SHOW_CITY: 1,
        VAL_SHOW_COUNTRY: 2,

        SIGN_SENIOR_SEARCH: 1,

        //#region 添加修改的参数
        PARAM_CUSTOMER_SHORT_NAME: "客户简称",
        PARAM_CUSTOMER_FULL_NAME: "客户全称",
        PARAM_NATION_TYPE: "国家类型",
        PARAM_NATION_NAME: "国家名字",
        PARAM_DOMESTIC_ADDRESS: "国内地址",
        PARAM_FOREIGN_CONTINENT: "国外区域",
        PARAM_FOREIGN_ADDRESS: "国外地址",
        PARAM_CUSTOMER_GRADE: "客户等级",
        PARAM_CUSTOMER_INDUSTRY: "客户行业",
        PARAM_CUSTOMER_SOURCE: "客户来源",
        PARAM_CUSTOMER_TYPE: "客户类型",

        PARAM_BANK_NAME: "银行名称",
        PARAM_BANK_CODE: "银行卡号",
        PARAM_BANK_NUMBER: "银行行号",
        PARAM_CREDIT_CODE: "信用代码",

        PARAM_CUSTOMER_CONTACT: "联系人",
        PARAM_CUSTOMER_CONTACT_TEL: "联系电话",
        PARAM_EMAIL: "邮箱",
        PARAM_DEAL_STATUS: "成交状态",
        PARAM_CUSTOMER_REMARK: "客户备注",
        //#endregion
    
        //#region 右键菜单
        STR_VIEW_LOG: "查看日志",
        STR_ROLLBACK_LOG: "回退日志",
        //#endregion
    
    },


    // 用户参数
    PAGE_USER_PARAMS: {
        STR_ADD_USER_PARAMS: "添加类型",
        STR_UPDATE_USER_PARAMS: "修改类型",
        STR_DEL_USER_PARAMS: "删除类型",

        STR_USER_PARAMS_ID: "类型ID",
        STR_USER_PARAMS_NAME: "类型名称",


        STR_ADD_USER_PARAMS_DETAILS: "添加参数详细",
        STR_UPDATE_USER_PARAMS_DETAILS: "修改参数详细",
        STR_DEL_USER_PARAMS_DETAILS: "删除参数详细",

        STR_USER_PARAMS_DETAILS_ID: "参数ID",
        STR_USER_PARAMS_DETAILS_NAME: "参数名称",

        STR_USER_PARAMS_DETAILS_ONE: "参数1",
        STR_USER_PARAMS_DETAILS_TWO: "参数2",
        STR_USER_PARAMS_DETAILS_THREE: "参数3",
        STR_USER_PARAMS_DETAILS_FOUR: "参数4",
        STR_USER_PARAMS_DETAILS_SORT: "排序",

        STR_SIGN_USER_DEPARTMENT: 1,
        STR_SIGN_USER_POSITION: 2,
        STR_SIGN_USER_GRADE: 3,
    },

    // 公司架构
    PAGE_COMPANY_STRUCTURE: {
        STR_ADD_COMPANY: "添加公司",
        STR_UPDATE_COMPANY: "修改公司",
        STR_DEL_COMPANY: "删除公司",

        STR_PARENT_LEVEL_INFO: "父级信息",
        STR_COMPANY_NAME: "公司名称",

        STR_NOT_ALLOW_CURRENT_LEVEL_ADD_COMPANY: "当前层级不支持添加子级",

        STR_COMPANY_SHORT_NAME: "公司简称",
        STR_COMPANY_FULL_NAME: "公司全称",
        STR_COMPANY_BANK_NAME: "银行名称",
        STR_COMPANY_BANK_CODE: "银行卡号",
        STR_COMPANY_BANK_NUMBER: "银行行号",
        STR_COMPANY_CREDIT_CODE: "信用代码",
        STR_COMPANY_ADDITION: "公司地址"
    },

    // 用户管理
    PAGE_USER_MANAGER: {
        STR_USERNAME: "登录账号",
        STR_PASSWORD: "登录密码",
        STR_NAME: "姓名",
        STR_STATUS: "在职状态",
        STR_WX_NICKNAME: "微信昵称",
        STR_WX_OPENID: "微信授权码",
        STR_TEL: "电话",
        STR_EMPLOYEE_NUM: "工号",

        STR_USER_DEPARTMENT: "用户部门",
        STR_USER_POSITION: "用户职位",
        STR_USER_GRADE: "用户级别",

        STR_ADD_USER: "添加用户",
        STR_UPDATE_USER: "修改用户",
        STR_DEL_USER: "删除用户",

        STR_EMPLOY_COMPANY: "归属公司",

        STR_USER_ACTIVE: "在职",
        STR_USER_INACTIVE: "离职",

        STR_GRANT_PERMS_TO_USER: "为用户分配权限",
        STR_PERMS_USER: "权限角色",

        STR_SELECT_USER: "选择用户",
    },

    // 权限
    PAGE_ROLE_PERMISSIONS: {
        EDIT_ROLE: 1,
        COPY_ROLE: 2,
        DEL_ROLE: 3,

        STR_EDIT_ROLE: "编辑",
        STR_COPY_ROLE: "复制",
        STR_DEL_ROLE: "删除",

        STR_ADD_ROLE: "添加角色",
        STR_UPDATE_ROLE: "修改角色",
        STR_ROLE_NAME: "角色名称",

        STR_ASSING_PERMS_TO_USER: "为角色分配用户",

        STR_CANDIDATE_USER: "候选用户",
        STR_SELECTED_USER: "已选用户"

    },

    // 功能按钮设置
    PAGE_FUN_SETTING: {

        STR_ADD_FUN: "添加功能",
        STR_UPDATE_FUN: "修改功能",

        STR_FUN_NAME: "功能名称",
        STR_FUN_ICON: "图标名称",
        STR_FUN_ICON_STYLE: "图标样式",
        STR_FUN_TEXT_STYLE: "文本样式",
        STR_FUN_BUTTON_POS: "按钮位置",
        STR_FUN_OTHER_INFO: "其他信息",
        STR_FUN_CALLBACK: "回调功能",
        STR_FUN_PARAMS: "功能参数",

        STR_FUN_PERM: "权限标识",
        STR_FUN_ACTION: "权限功能",


        STR_BATCH_ADD_FUN: "批量添加功能",
        STR_BATCH_ADD: "批量添加"


    }
}


