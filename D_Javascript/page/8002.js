$(document).ready(function () {
    csh_skin();
    let permObject = XWUTILS.getSafety();
    if (permObject.flag == 1) {
        let btnList = permObject.data.list;
        initButtonAction(btnList);
        initPageInfo();
        // getDataPermsFunList(-1);
    }
});

//#region 异步初始化
async function initPageInfo() {
    await getDataUserBaseParamsInfo();
    await getDataCompanyStructureList();
    initGetDataUserManagerList();
}
//#endregion

//#region 初始化按钮功能
function initButtonAction(list) {
    let funMap = new Map();
    funMap.set("initAddUser", initAddUser);
    funMap.set("initUpdateUser", initUpdateUser);
    funMap.set("initGrantPermsToUser", initGrantPermsToUser);
    funMap.set("delUser", delUser);
    // funMap.set("delCompanyStructure", delCompanyStructure);
    XWUTILS.renenderButton(list, funMap);
}
//#endregion

//#region 初始化全局信息
let userBaseParamsInfo = {
    userDepartment: [],
    userPosition: [],
    userGrade: [],
    userStatus: [],
    userDepartmentSelect: null,
    userPositionSelect: null,
    userGradeSelect: null,
    userStatusSelect: null,

    allPermissionList: [],
    loginUserCompanyList: [],
    loginUserCompanySelect: null,
}
async function getDataUserBaseParamsInfo() {
    let list_id_user = [
        CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_DEPARTMENT,
        CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_POSITION,
        CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_GRADE
    ];

    let userParams = await XWUTILS.getDataUserParamsByIds(list_id_user);
    let dataList = [...userParams];
    let configs = [
        {
            typeId: CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_DEPARTMENT,
            dataKey: 'userDepartment',
            selectKey: 'userDepartmentSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET // 1-从后端获取
        },
        {
            typeId: CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_POSITION,
            dataKey: 'userPosition',
            selectKey: 'userPositionSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET
        },
        {
            typeId: CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_GRADE,
            dataKey: 'userGrade',
            selectKey: 'userGradeSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_NET
        },
        {
            dataKey: 'userStatus',
            selectKey: 'userStatusSelect',
            sourceType: CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC, // 2-手动编写
            staticData: [
                { "zd_1": CONSTANS.NORMAL_VAL.VAL_YES, "zd_2": `${CONSTANS.PAGE_USER_MANAGER.STR_USER_ACTIVE}` },
                { "zd_1": CONSTANS.NORMAL_VAL.VAL_NO, "zd_2": `${CONSTANS.PAGE_USER_MANAGER.STR_USER_INACTIVE}` }
            ]
        }
    ];

    XWUTILS.createGlobalStaticDataAndSelect(configs, dataList, userBaseParamsInfo);

    JsonPara = {}
    apiurl = APIS.APIS_PERMISSION.getPermsRoleList;
    re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    userBaseParamsInfo.allPermissionList = [...re_obj.data];

}
//#endregion

//#region 左侧页面，渲染树菜单

//#region 获取所有菜单，并且预处理渲染
async function getDataCompanyStructureList() {
    let JsonPara = {}
    let apiurl = APIS.APIS_USER_MANAGER.getLoginUserCompanyInfo;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    list.forEach(p => p.spread = true);
    // 公司
    userBaseParamsInfo.loginUserCompanyList = list;
    userBaseParamsInfo.loginUserCompanySelect = Create_select("loginUserCompanySelect", userBaseParamsInfo.loginUserCompanyList, "gs_id", "gs_jc", -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 });

    const minObj = list.reduce((min, current) => {
        return current.parent_id < min.parent_id ? current : min;
    });
    list = preProcessTreeData(list, minObj.parent_id, `gs_id`, `parent_id`);
    initCompanyStructureTree(list)

    // 默认选第一个
    $(`#listCompanyTree .layui-tree-txt`).removeClass("tree_active");
    $(`#listCompanyTree .layui-tree-entry`).attr("xw-sel-tree", "0");

    $(`#listCompanyTree [data-id="${minObj.gs_id}"].layui-tree-set .layui-tree-entry:first .layui-tree-txt`).addClass("tree_active");
    $(`#listCompanyTree [data-id="${minObj.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-tree", "1");

    $(`#listCompanyTree [data-id="${minObj.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-id", `${minObj.gs_id}`);
    $(`#listCompanyTree [data-id="${minObj.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-jc", `${minObj.gs_jc}`);
    $(`#listCompanyTree [data-id="${minObj.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-lv", `${minObj.Lv}`);
    // getDataPermsFunList(obj.data.gs_id);
}
function initCompanyStructureTree(list) {
    var tree = layui.tree;
    tree.render({
        elem: '#listCompanyTree',
        data: list,
        onlyIconControl: true,  // 是否仅允许节点左侧图标控制展开收缩
        click: function (obj) {
            // XWUTILS.msgLanNewStr(JSON.stringify(obj.data));
            $(`#listCompanyTree .layui-tree-txt`).removeClass("tree_active");
            $(`#listCompanyTree .layui-tree-entry`).attr("xw-sel-tree", "0");

            $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first .layui-tree-txt`).addClass("tree_active");
            $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-tree", "1");
            // getdata_2();
            $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-id", `${obj.data.gs_id}`);
            $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-jc", `${obj.data.gs_jc}`);
            $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-lv", `${obj.data.Lv}`);
            // getDataPermsFunList(obj.data.gs_id);
            getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
        },
        customName: {
            id: 'gs_id',
            title: 'gs_jc',
            children: 'children'
        }
    });
}
//#endregion

//#region 预处理树迭代
function preProcessTreeData(preList, pId, key, pIdKey) {
    let new_list = [];
    for (let i = 0; i < preList.length; i++) {
        let obj = preList[i];
        if (!isUndefine(obj[key]) && !isUndefine(obj[pIdKey]) && obj[pIdKey] == pId) {
            obj.children = preProcessTreeData(preList, obj[key], key, pIdKey);
            new_list.push(obj);
        }
    }
    return new_list;
}
//#endregion

//#region 获取选择的迭代树信息
function xw_get_layer_tree(dom_id) {
    let a = $(`#${dom_id}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr("xw-sel-cd-id");
    return a;
}
function xw_get_layer_tree_object(dom_id) {
    let name = $(`#${dom_id}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr("xw-sel-cd-name");
    let id = $(`#${dom_id}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr("xw-sel-cd-id");
    let obj = {
        name: name,
        id: id
    }
    return obj;
}
//#endregion

//#endregion

//#region 右侧页面

//#region 获取所有用户，并且预处理渲染
let listUserManager;
async function initGetDataUserManagerList() {
    let list = [];
    let origionList = [];
    let jExcelObj = getUserManagerOptions(list);
    listUserManager = $("#listUserManager").jexcel({
        data: jExcelObj.data,
        columns: jExcelObj.columns,
        originData: origionList,
        allowContextMenu: false,
    });
    listUserManager.createCustomHeader();
    $("#listUserManager [data-input-sign]").on("keyup", function (e) {
        if ($(this).val() == "") {
            getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.stopPropagation();
            getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
    });
    $("#listUserManager [data-select-sign]").on("change", function (e) {
        getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
    });
    await getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
    initUserManagerPager();
}
function getUserManagerOptions(list) {
    let columns = [
        { title: '公司ID', name: "gs_id", type: 'hidden', width: 60, readOnly: true },
        { title: '用户ID', name: "yh_id", type: 'text', width: 60, readOnly: true },
        { title: '登录账号', name: "username", type: 'text', width: 150, readOnly: true },
        { title: '登录密码', name: "password", type: 'text', width: 150, readOnly: true },
        { title: '工号', name: "gonghao", type: 'text', width: 150, readOnly: true },
        { title: '姓名', name: "name", type: 'text', width: 150, readOnly: true },
        { title: '权限', name: "qx_id", type: 'text', customType: 'select', mulSelect: true, width: 250, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.allPermissionList, "qx_id", "qx_title") },
        { title: '权限id', name: "origin_qx_id", type: 'hidden', width: 150, readOnly: true },
        { title: 'PC授权码', name: "pc_code", type: 'text', width: 150, readOnly: true },
        { title: '手机授权码', name: "tel_code", type: 'text', width: 150, readOnly: true },
        { title: '企业微信授权码', name: "qy_uid", type: 'text', width: 150, readOnly: true },
        { title: '电话', name: "tel", type: 'text', width: 150, readOnly: true },
        { title: '部门', name: "bm_id", type: 'text', customType: 'select', width: 150, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userDepartment, "zd_1", "zd_2") },
        { title: '职位', name: "zw_id", type: 'text', customType: 'select', width: 150, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userPosition, "zd_1", "zd_2") },
        { title: '水平', name: "sp_id", type: 'text', customType: 'select', width: 150, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userGrade, "zd_1", "zd_2") },
        { title: '状态', name: "zt_id", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userStatus, "zd_1", "zd_2") },
        // { title: '选择品名', name: "sp_btn", type: 'custom', readOnly: true, width: 50, formatter: function (val, rowData, colIndex, rowIndex) { return create_btn(val, rowData) } },
    ];
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
async function getDataUserManagerList(pageindex) {
    let gs_obj = XWUTILS.getLayerTreeObject("listCompanyTree", "gs-id", "gs-jc");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let gs_id = gs_obj.id;
    let qx_id = listUserManager.getCustomHeaderText("qx_id");
    let yh_id = listUserManager.getCustomHeaderText("yh_id");
    let username = listUserManager.getCustomHeaderText("username");
    let gonghao = listUserManager.getCustomHeaderText("gonghao");
    let name = listUserManager.getCustomHeaderText("name");
    let bm_id = listUserManager.getCustomHeaderText("bm_id");
    let zw_id = listUserManager.getCustomHeaderText("zw_id");
    let sp_id = listUserManager.getCustomHeaderText("sp_id");
    let zt_id = listUserManager.getCustomHeaderText("zt_id");

    var JsonPara = {
        pageindex: pageindex, yh_id: yh_id, username: username, gonghao: gonghao
        , name: name, bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, gs_id: gs_id, pagesize: 20
    };
    let apiurl = APIS.APIS_USER_MANAGER.getUserList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    listUserManagerPageCount = re_obj.totle;
    list.forEach(p => {
        p.origin_qx_id = p.qx_id;
        p.qx_id = dealPermNumberStr(p.qx_id);
    });
    let jExcelObj = getUserManagerOptions(list);
    listUserManager.setData(jExcelObj.data);

}
// 预处理权限
function dealPermNumberStr(str) {
    if (XWUTILS.isUndefine(str)) {
        return "";
    }
    strs = str.split(',');
    let newStrs = [];
    if (!XWUTILS.isUndefine(strs) && strs.length > 0) {
        strs.forEach(p => {
            let item = userBaseParamsInfo.allPermissionList.find(k => k.qx_id == p);
            if (!XWUTILS.isUndefine(item)) {
                newStrs.push(item.qx_title);
            }
        });
    }
    let newStr = newStrs.join(',');
    return newStr;
}
//#region 用户分页器
let listUserManagerPageCount = 0;
function initUserManagerPager() {
    var laypage = layui.laypage;
    // 自定义文本
    laypage.render({
        elem: 'listUserManagerPager',
        count: listUserManagerPageCount,
        limit: 20,
        first: `${CONSTANS.NORMAL_STR.STR_FIRST_PAGE}`,
        last: `${CONSTANS.NORMAL_STR.STR_LAST_PAGE}`,
        prev: `<em>${CONSTANS.NORMAL_STR.STR_PREV_PAGE}</em>`,
        next: `<em>${CONSTANS.NORMAL_STR.STR_NEXT_PAGE}</em>`,
        jump: function (obj, first) {
            let currPage = obj.curr;
            if (!first) {
                getDataUserManagerList(currPage);
            }
        }
    });
}
//#endregion

//#endregion

//#region 添加用户
function initAddUser() {
    let gs_obj = XWUTILS.getLayerTreeObject("listCompanyTree", "gs-id", "gs-jc");
    let gs_id = gs_obj.id;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle flex-box">\r\n`);

    html.Append(`       <div class="cz-left-wrapper">\r\n`);
    //#region 左边放基础信息
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_EMPLOY_COMPANY}</td>\r\n`);
    html.Append(`               <td align="center" colspan="3">${userBaseParamsInfo.loginUserCompanySelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USERNAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_username" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_PASSWORD}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_password" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_EMPLOYEE_NUM}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_gonghao" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_name" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_TEL}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_tel" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_DEPARTMENT}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userDepartmentSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_POSITION}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userPositionSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_GRADE}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userGradeSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_STATUS}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userStatusSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`       </table>\r\n`);

    //#endregion
    html.Append(`       </div>\r\n`);

    html.Append(`       <div class="cz-right-wrapper">\r\n`);
    //#region 右边放多选权限
    html.Append(`       <div class="perms-main">\r\n`);
    html.Append(`           <div class="perms-title">${CONSTANS.PAGE_USER_MANAGER.STR_PERMS_USER}</div>\r\n`);
    html.Append(`           <div class="perms-content">\r\n`);
    html.Append(`               <div class="layui-form">\r\n`);
    let permList = userBaseParamsInfo.allPermissionList;
    for (let i = 0; i < permList.length; i++) {
        let obj = permList[i];
        html.Append(`                   <div class="checkbox-item">\r\n`);
        html.Append(`                       <input lay-filter="perm_checkbox" type="checkbox" name="" title="${obj.qx_title}" value="${obj.qx_id}">\r\n`);
        html.Append(`                   </div>\r\n`);
    }
    html.Append(`               </div>\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`       </div>\r\n`);
    //#endregion
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
        title: CONSTANS.PAGE_USER_MANAGER.STR_ADD_USER,
        area: ["760px", "415px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();
            layui.form.render();
            if (!XWUTILS.isUndefine(gs_id)) {
                $("#loginUserCompanySelect").val(gs_id);
            }
            $("#btn_submit").on('click', function () {
                addUser(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function addUser(tk_index) {
    let gs_id = $("#loginUserCompanySelect").val();
    if (XWUTILS.isUndefine(gs_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let username = $("#txt_edit_username").val();
    let password = $("#txt_edit_password").val();
    let gonghao = $("#txt_edit_gonghao").val();
    let name = $("#txt_edit_name").val();
    let tel = $("#txt_edit_tel").val();
    if (XWUTILS.isUndefine(username) || XWUTILS.isUndefine(password)
        || XWUTILS.isUndefine(gonghao) || XWUTILS.isUndefine(name)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let bm_id = $("#userDepartmentSelect").val();
    let zw_id = $("#userPositionSelect").val();
    let sp_id = $("#userGradeSelect").val();
    let zt_id = $("#userStatusSelect").val();
    let verifyMinus = [bm_id, zw_id, sp_id, zt_id];
    if (verifyMinus.some(p => p == -1 || p == "-1" || XWUTILS.isUndefine(p))) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let list_qx_id = [];
    let checkBoxDatas = $(`.perms-content [lay-filter="perm_checkbox"]`).filter(function () {
        return this.checked;
    });
    for (let i = 0; i < checkBoxDatas.length; i++) {
        let checkObj = checkBoxDatas[i];
        list_qx_id.push($(checkObj).val());
    }

    let JsonPara = {
        gs_id: gs_id, username: username, password: password, gonghao: gonghao, name: name, tel: tel,
        bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, zt_id: zt_id, list_qx_id: list_qx_id
    }
    let apiurl = APIS.APIS_USER_MANAGER.addUser;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 修改用户
function initUpdateUser() {
    let objs = listUserManager.getSelectedRowsData();
    if (!objs || objs.length == 0 || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle flex-box">\r\n`);

    html.Append(`       <div class="cz-left-wrapper">\r\n`);
    //#region 左边放基础信息
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_EMPLOY_COMPANY}</td>\r\n`);
    html.Append(`               <td align="center" colspan="3">${userBaseParamsInfo.loginUserCompanySelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USERNAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_username" class="cz-input" value="${obj.username}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_PASSWORD}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_password" class="cz-input" value="${obj.password}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_EMPLOYEE_NUM}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_gonghao" class="cz-input" value="${obj.gonghao}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_name" class="cz-input" value="${obj.name}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_TEL}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_tel" class="cz-input" value="${obj.tel}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_DEPARTMENT}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userDepartmentSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_POSITION}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userPositionSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_GRADE}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userGradeSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_STATUS}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userStatusSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`       </table>\r\n`);

    //#endregion
    html.Append(`       </div>\r\n`);

    html.Append(`       <div class="cz-right-wrapper">\r\n`);
    //#region 右边放多选权限
    html.Append(`       <div class="perms-main">\r\n`);
    html.Append(`           <div class="perms-title">${CONSTANS.PAGE_USER_MANAGER.STR_PERMS_USER}</div>\r\n`);
    html.Append(`           <div class="perms-content">\r\n`);
    html.Append(`               <div class="layui-form">\r\n`);
    let permList = userBaseParamsInfo.allPermissionList;
    for (let i = 0; i < permList.length; i++) {
        let pObj = permList[i];
        let allowPerms = [];
        if (!XWUTILS.isUndefine(obj.origin_qx_id)) {
            allowPerms = obj.origin_qx_id.split(',')
        }
        let checked = "";
        debugger
        if (allowPerms.includes(pObj.qx_id) || allowPerms.includes(pObj.qx_id + '')) {
            checked = "checked";
        }
        html.Append(`                   <div class="checkbox-item">\r\n`);
        html.Append(`                       <input ${checked} lay-filter="perm_checkbox" type="checkbox" name="" title="${pObj.qx_title}" value="${pObj.qx_id}">\r\n`);
        html.Append(`                   </div>\r\n`);
    }
    html.Append(`               </div>\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`       </div>\r\n`);
    //#endregion
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
        title: CONSTANS.PAGE_USER_MANAGER.STR_UPDATE_USER,
        area: ["760px", "415px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();
            layui.form.render();
            $("#loginUserCompanySelect").val(obj.gs_id);
            $("#userDepartmentSelect").val(obj.bm_id);
            $("#userPositionSelect").val(obj.zw_id);
            $("#userGradeSelect").val(obj.sp_id);
            $("#userStatusSelect").val(obj.zt_id);

            $("#btn_submit").on('click', function () {
                updateUser(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function updateUser(tk_index) {
    let objs = listUserManager.getSelectedRowsData();
    if (!objs || objs.length == 0 || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let yh_id = obj.yh_id;

    let gs_id = $("#loginUserCompanySelect").val();
    if (XWUTILS.isUndefine(gs_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let username = $("#txt_edit_username").val();
    let password = $("#txt_edit_password").val();
    let gonghao = $("#txt_edit_gonghao").val();
    let name = $("#txt_edit_name").val();
    let tel = $("#txt_edit_tel").val();
    if (XWUTILS.isUndefine(username) || XWUTILS.isUndefine(password)
        || XWUTILS.isUndefine(gonghao) || XWUTILS.isUndefine(name)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let bm_id = $("#userDepartmentSelect").val();
    let zw_id = $("#userPositionSelect").val();
    let sp_id = $("#userGradeSelect").val();
    let zt_id = $("#userStatusSelect").val();
    let verifyMinus = [bm_id, zw_id, sp_id, zt_id];
    if (verifyMinus.some(p => p == -1 || p == "-1" || XWUTILS.isUndefine(p))) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let list_qx_id = [];
    let checkBoxDatas = $(`.perms-content [lay-filter="perm_checkbox"]`).filter(function () {
        return this.checked;
    });
    for (let i = 0; i < checkBoxDatas.length; i++) {
        let checkObj = checkBoxDatas[i];
        list_qx_id.push($(checkObj).val());
    }

    let JsonPara = {
        yh_id: yh_id, gs_id: gs_id, username: username, password: password, gonghao: gonghao, name: name, tel: tel,
        bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, zt_id: zt_id, list_qx_id: list_qx_id
    }
    let apiurl = APIS.APIS_USER_MANAGER.updateUser;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 分配权限
function initGrantPermsToUser() {
    let objs = listUserManager.getSelectedRowsData();
    if (!objs || objs.length == 0 || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle flex-box">\r\n`);

    html.Append(`       <div class="cz-left-wrapper">\r\n`);
    //#region 左边放基础信息
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_EMPLOY_COMPANY}</td>\r\n`);
    html.Append(`               <td align="center" colspan="3">${userBaseParamsInfo.loginUserCompanySelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USERNAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input readonly data-enter type="text" required="true" id="txt_edit_username" class="cz-input" value="${obj.username}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_PASSWORD}</td>\r\n`);
    html.Append(`               <td colspan="3"><input readonly data-enter type="text" required="true" id="txt_edit_password" class="cz-input" value="${obj.password}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_EMPLOYEE_NUM}</td>\r\n`);
    html.Append(`               <td colspan="3"><input readonly data-enter type="text" required="true" id="txt_edit_gonghao" class="cz-input" value="${obj.gonghao}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input readonly data-enter type="text" required="true" id="txt_edit_name" class="cz-input" value="${obj.name}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_TEL}</td>\r\n`);
    html.Append(`               <td colspan="3"><input readonly data-enter type="text" required="false" id="txt_edit_tel" class="cz-input" value="${obj.tel}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_DEPARTMENT}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userDepartmentSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_POSITION}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userPositionSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_USER_GRADE}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userGradeSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_MANAGER.STR_STATUS}</td>\r\n`);
    html.Append(`               <td colspan="3">${userBaseParamsInfo.userStatusSelect}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`       </table>\r\n`);

    //#endregion
    html.Append(`       </div>\r\n`);

    html.Append(`       <div class="cz-right-wrapper">\r\n`);
    //#region 右边放多选权限
    html.Append(`       <div class="perms-main">\r\n`);
    html.Append(`           <div class="perms-title">${CONSTANS.PAGE_USER_MANAGER.STR_PERMS_USER}</div>\r\n`);
    html.Append(`           <div class="perms-content">\r\n`);
    html.Append(`               <div class="layui-form">\r\n`);
    let permList = userBaseParamsInfo.allPermissionList;
    for (let i = 0; i < permList.length; i++) {
        let pObj = permList[i];
        let allowPerms = [];
        if (!XWUTILS.isUndefine(obj.origin_qx_id)) {
            allowPerms = obj.origin_qx_id.split(',')
        }
        let checked = "";
        if (allowPerms.includes(pObj.qx_id) || allowPerms.includes(pObj.qx_id + '')) {
            checked = "checked";
        }
        html.Append(`                   <div class="checkbox-item">\r\n`);
        html.Append(`                       <input ${checked} lay-filter="perm_checkbox" type="checkbox" name="" title="${pObj.qx_title}" value="${pObj.qx_id}">\r\n`);
        html.Append(`                   </div>\r\n`);
    }
    html.Append(`               </div>\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`       </div>\r\n`);
    //#endregion
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
        title: CONSTANS.PAGE_USER_MANAGER.STR_GRANT_PERMS_TO_USER,
        area: ["760px", "415px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();
            layui.form.render();

            let selectConfig = [
                { selector: "#loginUserCompanySelect", value: obj.gs_id },
                { selector: "#userDepartmentSelect", value: obj.bm_id },
                { selector: "#userPositionSelect", value: obj.zw_id },
                { selector: "#userGradeSelect", value: obj.sp_id },
                { selector: "#userStatusSelect", value: obj.zt_id }
            ];

            selectConfig.forEach(config => {
                $(config.selector)
                    .val(config.value)
                    .prop('disabled', true);
            });

            $("#btn_submit").on('click', function () {
                grantPermsToUser(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function grantPermsToUser(tk_index) {
    let objs = listUserManager.getSelectedRowsData();
    if (!objs || objs.length == 0 || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let yh_id = obj.yh_id;

    let list_qx_id = [];
    let checkBoxDatas = $(`.perms-content [lay-filter="perm_checkbox"]`).filter(function () {
        return this.checked;
    });
    for (let i = 0; i < checkBoxDatas.length; i++) {
        let checkObj = checkBoxDatas[i];
        list_qx_id.push($(checkObj).val());
    }

    let JsonPara = {
        yh_id: yh_id, list_qx_id: list_qx_id
    }
    let apiurl = APIS.APIS_USER_MANAGER.grantPermsToUser;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 删除用户
function delUser() {
    let objs = listUserManager.getSelectedRowsData();
    if (!objs || objs.length == 0 || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let name = obj.name
    let yh_id = obj.yh_id;
    let tk = layer.confirm(`${CONSTANS.NORMAL_STR.CONFIRM_DELETE} ${name}`, () => {
        let JsonPara = { yh_id: yh_id }
        let apiurl = APIS.APIS_USER_MANAGER.delUser;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
            layer.close(tk);
            getDataUserManagerList(CONSTANS.NORMAL_VAL.ONE);
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    });

}
//#endregion

//#endregion


