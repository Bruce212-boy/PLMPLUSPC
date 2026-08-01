$(document).ready(function () {
    csh_skin();
    let permObject = XWUTILS.getSafety();
    if (permObject.flag == 1) {
        let btnList = permObject.data.list;
        console.log(btnList)
        initButtonAction(btnList);
        getDataCompanyStructureList();
        // getDataPermsFunList(-1);
    }
});

//#region 初始化按钮功能
function initButtonAction(list) {
    let funMap = new Map();
    funMap.set("initAddCompanyStructure", initAddCompanyStructure);
    funMap.set("initUpdateCompanyStructure", initUpdateCompanyStructure);
    funMap.set("delCompanyStructure", delCompanyStructure);
    XWUTILS.renenderButton(list, funMap);

}
//#endregion

//#region 左侧页面，渲染树菜单

//#region 获取所有菜单，并且预处理渲染
let allCompanyBaseInfo;
async function getDataCompanyStructureList() {
    let JsonPara = {}
    let apiurl = APIS.APIS_COMPANY_STRUCT.getCompanyList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    allCompanyBaseInfo = list;
    list.forEach(p => p.spread = true);
    list = preProcessTreeData(list, CONSTANS.NORMAL_VAL.ZERO, `gs_id`, `parent_id`);
    initCompanyStructureTree(list)
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
            if (obj.data.parent_id <= 2) {
                $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-id", `${obj.data.gs_id}`);
                $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-jc", `${obj.data.gs_jc}`);
                $(`#listCompanyTree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-lv", `${obj.data.Lv}`);
                // getDataPermsFunList(obj.data.gs_id);
            }
            getDataCompanyBaseInfo();
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

//#region 添加公司
function initAddCompanyStructure() {
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let Lv = gs_obj.level;
    let parent_id = gs_obj.id;
    let parent_name = gs_obj.name;

    if (Lv < 0 || Lv >= 2) {
        XWUTILS.msgLanNewStr(CONSTANS.PAGE_COMPANY_STRUCTURE.STR_NOT_ALLOW_CURRENT_LEVEL_ADD_COMPANY);
        return;
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_PARENT_LEVEL_INFO}</td>\r\n`);
    html.Append(`               <td align="center" colspan="3">${parent_name}</td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_company_name" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_COMPANY_STRUCTURE.STR_ADD_COMPANY,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                addCompanyStructure(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function addCompanyStructure(tk_index) {
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let parent_id = gs_obj.id;
    let gs_jc = $("#txt_edit_company_name").val();
    let JsonPara = { parent_id, gs_jc: gs_jc }
    let apiurl = APIS.APIS_COMPANY_STRUCT.addCompany;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
    layer.close(tk_index)
    getDataCompanyStructureList();
}
//#endregion

//#region 修改公司名
function initUpdateCompanyStructure() {
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let gs_jc = gs_obj.name;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_company_name" class="cz-input" value="${gs_jc}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_COMPANY_STRUCTURE.STR_ADD_COMPANY,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                updateCompanyStructure(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function updateCompanyStructure(tk_index) {
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let gs_id = gs_obj.id;
    let gs_jc = $("#txt_edit_company_name").val();

    let JsonPara = { gs_id: gs_id, gs_jc: gs_jc }
    let apiurl = APIS.APIS_COMPANY_STRUCT.updateCompany;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
    layer.close(tk_index)
    getDataCompanyStructureList();
}
//#endregion

//#region 删除公司
function delCompanyStructure() {
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let gs_id = gs_obj.id;
    let tk = layer.confirm(`${CONSTANS.NORMAL_STR.CONFIRM_DELETE} ${gs_obj.name}`,
        () => {
            let JsonPara = { gs_id: gs_id }
            let apiurl = APIS.APIS_COMPANY_STRUCT.delCompany;
            let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
            if (re_obj.flag != 1) {
                XWUTILS.alertLanNewStr(re_obj.msg);
                return;
            }
            else {
                XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
                layer.close(tk);
                getDataCompanyStructureList();
            }
        }
    )

}
//#endregion

//#region 查看公司详情

//#endregion

//#endregion

//#region 右侧，渲染公司信息
function getDataCompanyBaseInfo() {
    $("#companyBaseInfo").html('');
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let gs_id = gs_obj.id;

    let obj = allCompanyBaseInfo.find(p => p.gs_id == gs_id);
    initCompanyBaseInfo(obj);
}
function initCompanyBaseInfo(obj) {
    let html = new StringBuffer();
    html.Append(`   <table name="mytable" class="grid" style="width: 400px; background: #fff">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_SHORT_NAME}</td>\r\n`);
    html.Append(`           <td style="background: #eee; text-align: left; padding-left: 5px">${isUndefine(obj.gs_jc) ? "" : obj.gs_jc}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_FULL_NAME}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_gs_qc" class="cz-input" value="${isUndefine(obj.gs_qc) ? "" : obj.gs_qc}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_BANK_NAME}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_bankname" class="cz-input" value="${isUndefine(obj.bankname) ? "" : obj.bankname}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_BANK_CODE}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_bankcard" class="cz-input" value="${isUndefine(obj.bankcard) ? "" : obj.bankcard}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_BANK_NUMBER}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_hanghao" class="cz-input" value="${isUndefine(obj.hanghao) ? "" : obj.hanghao}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_CREDIT_CODE}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_xydm" class="cz-input" value="${isUndefine(obj.xydm) ? "" : obj.xydm}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px" align="center">${CONSTANS.PAGE_COMPANY_STRUCTURE.STR_COMPANY_ADDITION}</td>\r\n`);
    html.Append(`           <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_dizhi" class="cz-input" value="${isUndefine(obj.dizhi) ? "" : obj.dizhi}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td colspan="2" style="text-align: right; padding: 5px 10px"><button class="cz_fter_btn" onclick="setCompanyBaseInfo();">${CONSTANS.NORMAL_STR.SUBMIT}</button></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`   </table>\r\n`);
    $("#companyBaseInfo").html(html.ToString());
}
async function setCompanyBaseInfo() {
    let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTree", "gs-id", "gs-jc", "gs-lv");
    if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let gs_id = gs_obj.id;

    let gs_qc = $("#txt_edit_gs_qc").val();
    let bankname = $("#txt_edit_bankname").val();
    let bankcard = $("#txt_edit_bankcard").val();
    let hanghao = $("#txt_edit_hanghao").val();
    let xydm = $("#txt_edit_xydm").val();
    let dizhi = $("#txt_edit_dizhi").val();
    let JsonPara = { gs_id: gs_id, gs_qc: gs_qc, bankname: bankname, bankcard: bankcard, hanghao: hanghao, xydm: xydm, dizhi: dizhi }
    let apiurl = APIS.APIS_COMPANY_STRUCT.setCompanyDeatil;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        repeatSelNode();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}

async function repeatSelNode() {
    let JsonPara = {}
    let apiurl = APIS.APIS_COMPANY_STRUCT.getCompanyList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    allCompanyBaseInfo = list;
}

//#endregion



//#region 右侧页面，渲染功能列表

//#region 获取功能数据, 并且渲染
let listDetails;
function initGetDataPermsFunList() {
    let cd_id = xw_get_layer_tree("listCompanyTree");
    if (XWUTILS.isUndefine(cd_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    getDataPermsFunList(cd_id);
}
async function getDataPermsFunList(cd_id) {
    let JsonPara = {}
    let apiurl = APIS.APIS_PERMISSION.getPermsFunList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    if (cd_id == -1) {
        XWUTILS.renenderButton(list, funMap);
    }
    list = list.filter(p => p.cd_id == cd_id);
    list = dealFunButtonJson(list);
    initPermsFunsList(list)
}

function initPermsFunsList(dataList) {
    let data = dataList;
    let columns = [
        { title: '功能ID', name: "gn_id", type: 'text', width: 80, readOnly: true },
        { title: '功能名称', name: "gn_name", type: 'text', width: 200, readOnly: true },
        { title: '权限标识', name: "perm", type: 'text', width: 350, readOnly: true },
        { title: '权限功能', name: "action", type: 'text', width: 350, readOnly: true },
        // { title: '选择品名', name: "sp_btn", type: 'custom', readOnly: true, width: 50, formatter: function (val, rowData, colIndex, rowIndex) { return create_btn(val, rowData) } },
    ];

    let jExcelObj = XWUTILS.dealTableExcelData(data, columns);
    console.log(jExcelObj.data)
    if (XWUTILS.isUndefine(listDetails)) {
        listDetails = $('#list_funs').jexcel({
            data: jExcelObj.data,
            columns: jExcelObj.columns,
            originData: data,
        });
    }
    else {
        listDetails.setData(jExcelObj.data);
    }

    // listDetails.createCustomHeader();
}
function dealFunButtonJson(dataList) {
    let newList = [];
    for (let i = 0; i < dataList.length; i++) {
        let obj = dataList[i];
        if (XWUTILS.isUndefine(obj.gn_json)) {
            continue;
        }
        let gn_json;
        try {
            gn_json = JSON.parse(obj.gn_json);
        }
        catch {
            gn_json = {
                gn_name: obj.gn_name,
                perm: "",
                action: "",
            }
        }

        let newObj = {
            gn_id: obj.gn_id,
            gn_name: obj.gn_name,
            perm: gn_json.perm,
            action: gn_json.action,
        }

        newList.push(newObj);
    }

    if (newList.length == 0) {
        return dataList;
    }
    return newList;
}
//#endregion

//#region 添加功能按钮
function initAddFun() {
    let cd_id = xw_get_layer_tree("listCompanyTree");
    if (XWUTILS.isUndefine(cd_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_FUN_SETTING.STR_FUN_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_fun_name" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_FUN_SETTING.STR_FUN_PERM}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_fun_perm" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_FUN_SETTING.STR_FUN_ACTION}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_fun_action" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_FUN_SETTING.STR_ADD_ROLE,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                addFun(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function addFun(tk_index) {
    let cd_id = xw_get_layer_tree("listCompanyTree");
    if (XWUTILS.isUndefine(cd_id)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    let gn_name = $("#txt_edit_fun_name").val();
    let perm = $("#txt_edit_fun_perm").val();
    let action = $("#txt_edit_fun_action").val();

    if (XWUTILS.isUndefine(perm) || XWUTILS.isUndefine(action) || XWUTILS.isUndefine(gn_name)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let gn_json = {
        perm: perm,
        action: action,
    }

    let JsonPara = { cd_id: cd_id, gn_name: gn_name, gn_json: JSON.stringify(gn_json) }
    let apiurl = APIS.APIS_FUN_SETTING.addFunButton;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        initGetDataPermsFunList();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 修改按钮
function initUpdateFun() {
    let cd_id = xw_get_layer_tree("listCompanyTree");
    if (XWUTILS.isUndefine(cd_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    let objs = listDetails.getSelectedRowsData()
    if (objs && objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con jexcel_custom_element">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_FUN_SETTING.STR_FUN_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_fun_name" class="cz-input" value="${obj.gn_name}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_FUN_SETTING.STR_FUN_PERM}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_fun_perm" class="cz-input" value="${obj.perm}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_FUN_SETTING.STR_FUN_ACTION}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_fun_action" class="cz-input" value="${obj.action}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

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
        title: CONSTANS.PAGE_FUN_SETTING.STR_ADD_ROLE,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                updateFun(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function updateFun(tk_index) {
    let cd_id = xw_get_layer_tree("listCompanyTree");
    if (XWUTILS.isUndefine(cd_id)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    let objs = listDetails.getSelectedRowsData()
    if (objs && objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let gn_id = obj.gn_id

    let gn_name = $("#txt_edit_fun_name").val();
    let perm = $("#txt_edit_fun_perm").val();
    let action = $("#txt_edit_fun_action").val();

    if (XWUTILS.isUndefine(perm) || XWUTILS.isUndefine(action) || XWUTILS.isUndefine(gn_name)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let gn_json = {
        perm: perm,
        action: action,
    }

    let JsonPara = { gn_id: gn_id, gn_name: gn_name, gn_json: JSON.stringify(gn_json) }

    let apiurl = APIS.APIS_FUN_SETTING.updateFunButton;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        initGetDataPermsFunList();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除按钮
function delFun() {
    let objs = listDetails.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let gn_id = obj.gn_id;

    let tk_index = layer.confirm(CONSTANS.NORMAL_STR.CONFIRM_DELETE, async () => {
        let JsonPara = { gn_id: gn_id }
        let apiurl = APIS.APIS_FUN_SETTING.delFunButton;
        let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
        if (re_obj.flag != 1) {
            XWUTILS.alertLanNewStr(re_obj.msg);
            return;
        }
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        initGetDataPermsFunList();
    });

}
//#endregion

//#region 批量添加功能按钮
let listBatchAddFun;
let windowBtachAddFun;
function initBatchAddFunWindow() {
    let cd_obj = xw_get_layer_tree_object("listCompanyTree");
    if (XWUTILS.isUndefine(cd_obj) || XWUTILS.isUndefine(cd_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div style="padding: 5px; height: 96%;">\r\n`);
    html.Append(`    <div class="top_box bbt_none">\r\n`);
    html.Append(`        <div class="top_box_title" data-word="${cd_obj.name}">\r\n`);
    html.Append(`            ${cd_obj.name}\r\n`);
    html.Append(`        </div>\r\n`);
    html.Append(`        <div class="top_box_btn_group mgl_auto jexcel_custom_element">\r\n`);
    html.Append(`            <div class="top_box_btn_item" data-perm="setting.function.save.batch.add" data-action="saveBatchAddFun">\r\n`);
    html.Append(`                <span class="my-icon layui-icon layui-icon-ok-circle"></span>\r\n`);
    html.Append(`                <span class="text" data-word="${CONSTANS.PAGE_FUN_SETTING.STR_BATCH_ADD}">${CONSTANS.PAGE_FUN_SETTING.STR_BATCH_ADD}</span>\r\n`);
    html.Append(`            </div>\r\n`);
    html.Append(`        </div>\r\n`);
    html.Append(`    </div>\r\n`);
    html.Append(`    <div id="hss_con" class="hss_con xw_grid_main" style="height: 95%"><div id="listBatchAddFun" class="clearfix no-wrap"></div></div>\r\n`);
    html.Append(`</div>\r\n`);
    windowBtachAddFun = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: [CONSTANS.PAGE_FUN_SETTING.STR_BATCH_ADD_FUN],
        area: [`95%`, `95%`], // 初始宽高
        success: function (layero, index) {
            initBatchAddFun();
            $("[data-action='saveBatchAddFun']").on("click", function () {
                execSaveBatchAddFun();
            });
        },
        end: function () {
        }
    });
}
function initBatchAddFun() {
    console.log(12)
    let list = [];
    let origionList = [];
    let jExcelObj = getBatchAddFunOptions(list);
    listBatchAddFun = $('#listBatchAddFun').jexcel({
        data: jExcelObj.data,
        columns: jExcelObj.columns,
        originData: origionList,
        allowInsertRow: true,
        allowDeleteRow: true,
    });
}
function getBatchAddFunOptions(list) {
    let columns = [
        { title: '功能名称', name: "gn_name", type: 'text', width: 200, readOnly: false },
        { title: '权限标识', name: "perm", type: 'text', width: 350, readOnly: false },
        { title: '权限功能', name: "action", type: 'text', width: 350, readOnly: false },
        // { title: '选择品名', name: "sp_btn", type: 'custom', readOnly: true, width: 50, formatter: function (val, rowData, colIndex, rowIndex) { return create_btn(val, rowData) } },
    ];
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
function execSaveBatchAddFun() {
    let cd_obj = xw_get_layer_tree_object("listCompanyTree");
    if (XWUTILS.isUndefine(cd_obj) || XWUTILS.isUndefine(cd_obj.id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let cd_id = cd_obj.id;
    let tk = layer.confirm(CONSTANS.NORMAL_STR.CONFIRM_EXEC, () => {
        let dataList = listBatchAddFun.getJson();
        let count = dataList.some(p => XWUTILS.isUndefine(p.gn_name));
        if (count >= 1) {
            layer.close(tk);
            XWUTILS.alertLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        }
        else {
            let flag = 1;
            var loadIndex = XWUTILS.loadDialog();

            for (let i = 0; i < dataList.length; i++) {
                let obj = dataList[i];
                let gn_name = obj.gn_name;
                let gn_json = {
                    perm: obj.perm,
                    action: obj.action,
                }
                let JsonPara = { cd_id: cd_id, gn_name: gn_name, gn_json: JSON.stringify(gn_json) }
                let apiurl = APIS.APIS_FUN_SETTING.addFunButton;
                let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
                if (re_obj.flag != 1) {
                    flag = 0;
                    break;
                }
            }
            layer.close(loadIndex);
            if (flag != 1) {
                XWUTILS.alertLanNewStr(CONSTANS.NORMAL_STR.OPT_FAILED);
            }
            else {
                layer.close(windowBtachAddFun);
                XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
                getDataPermsFunList(cd_id);
            }
        }
    });
}
//#endreigon

//#endregion

//#region 左侧所有角色

//#region 角色事件
function bindHoverRoleItem() {
    const roleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'inelement') {
                const target = $(mutation.target);
                const inElement = target.attr('inelement');

                if (inElement == CONSTANS.NORMAL_VAL.ONE) {
                    target.addClass('role-hover-style');
                } else {
                    target.removeClass('role-hover-style');
                }
            }
        });
    });

    $('.role').each(function () {
        roleObserver.observe(this, {
            attributes: true,
            attributeFilter: ['inelement']
        });
    });

    $('.role').on('mouseenter', function () {
        $('.role').attr('inelement', CONSTANS.NORMAL_VAL.ZERO); // 重置所有
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ONE);    // 设置当前
    });

    $('.role').on('mouseleave', function () {
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ZERO);
    });


}

function bindClickRoleItem() {
    $('.role').on('click', function (e) {
        let _this = $(this);
        $('.role').each(function (e) {
            $(this).removeClass("active");
        });
        _this.addClass('active');

        // 触发右侧
        getDataPermsMenu();
    });
    $(".role-dp").on("click", function (e) {
        let _this = $(this);
        $('.role-dp').each(function (e) {
            $(this).removeClass("active");
        });
        _this.addClass('active');

    });

    $(document).click(function (event) {
        // 检查点击目标是否是目标元素及其子元素
        if (!$(event.target).closest('.role-dp').length) {
            $('.role-dp').removeClass('active');
        }
    });

    let dropdown = layui.dropdown;
    dropdown.render({
        elem: '.role-dp',
        // trigger: 'click' // trigger 已配置在元素 `lay-options` 属性上
        data: [{
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_EDIT_ROLE,
            id: CONSTANS.PAGE_ROLE_PERMISSIONS.EDIT_ROLE
        }, {
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_COPY_ROLE,
            id: CONSTANS.PAGE_ROLE_PERMISSIONS.COPY_ROLE
        }, {
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_DEL_ROLE,
            id: CONSTANS.PAGE_ROLE_PERMISSIONS.DEL_ROLE
        }],
        click: function (obj, othis) {
            let qx_dom = $('.role-list').find('.role-dp.active');
            let qx_id = $(qx_dom).attr("data-id");
            let qx_title = $(qx_dom).attr("data-title");
            if (obj.id === CONSTANS.PAGE_ROLE_PERMISSIONS.EDIT_ROLE) {
                // 编辑
                initUpdateRole();
            } else if (obj.id === CONSTANS.PAGE_ROLE_PERMISSIONS.COPY_ROLE) {
                // 复制

            } else if (obj.id === CONSTANS.PAGE_ROLE_PERMISSIONS.DEL_ROLE) {
                // 删除
                del_role(qx_id, qx_title);
            }
        }
    });
}

function bindHoverDataRoleItem(dataList) {
    if (dataList == undefined || dataList.length <= 0) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.NO_MORE_DATA);
        return;
    }

    let html = new StringBuffer();
    for (let i = 0; i < dataList.length; i++) {
        let obj = dataList[i];
        html.Append(`\r\n`);
        html.Append(`<div class="role" inelement="0" data-id="${obj.qx_id}" data-title="${obj.qx_title}">\r\n`);
        html.Append(`    <div class="role-text">${obj.qx_title}</div>\r\n`);
        html.Append(`    <div class="role-dp-con">\r\n`);
        html.Append(`        <div class="role-dp" data-id="${obj.qx_id}" data-title="${obj.qx_title}">\r\n`);
        html.Append(`            <i class="layui-icon layui-icon-more-vertical layui-font-12"></i>\r\n`);
        html.Append(`        </div>\r\n`);
        html.Append(`    </div>\r\n`);
        html.Append(`</div>\r\n`);
    }
    $(".role-list").html(html.ToString());

    const roleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'inelement') {
                const target = $(mutation.target);
                const inElement = target.attr('inelement');

                if (inElement == CONSTANS.NORMAL_VAL.ONE) {
                    target.addClass('role-hover-style');
                } else {
                    target.removeClass('role-hover-style');
                }
            }
        });
    });

    $('.role').each(function () {
        roleObserver.observe(this, {
            attributes: true,
            attributeFilter: ['inelement']
        });
    });

    $('.role').on('mouseenter', function () {
        $('.role').attr('inelement', CONSTANS.NORMAL_VAL.ZERO); // 重置所有
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ONE);    // 设置当前
    });

    $('.role').on('mouseleave', function () {
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ZERO);
    });
}
//#endregion

//#region 查询角色
function getDataRoleList() {
    $(".role-list").html("");
    let JsonPara = {}
    let apiurl = APIS.APIS_PERMISSION.getPermsRoleList;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return;
    }
    let dataList = re_obj.data;
    bindHoverDataRoleItem(dataList);
    bindClickRoleItem();
}
//#endregion

//#region 添加角色
function initAddRole() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td style="width: 85px" align="center">${CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ROLE_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_role_name" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);
    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ADD_ROLE,
        area: ["350px", "280px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                addRole(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}

function addRole(tk_index) {
    let qx_title = $("#txt_edit_role_name").val();
    if (XWUTILS.isUndefine(qx_title)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { qx_title: qx_title }
    let apiurl = APIS.APIS_PERMISSION.addPermsRole;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataRoleList();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 修改角色名称
function initUpdateRole() {
    let qx_dom = $('.role-list').find('.role-dp.active');
    let qx_title = $(qx_dom).attr("data-title");

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td style="width: 85px" align="center">${CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ROLE_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_role_name" class="cz-input" value="${qx_title}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);
    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_UPDATE_ROLE,
        area: ["350px", "280px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                updateRole(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}

function updateRole(tk_index) {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }

    let qx_title = $("#txt_edit_role_name").val();
    if (XWUTILS.isUndefine(qx_title)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { qx_title: qx_title, qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.updatePermsRole;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataRoleList();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 复制角色 TODO

//#endregion

//#region 删除角色
function del_role(qx_id, qx_title) {
    if (qx_id == undefined) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let confirm_tk = layer.confirm(CONSTANS.NORMAL_STR.CONFIRM_DELETE + " " + qx_title, () => {

        let JsonPara = { qx_id: qx_id }
        let apiurl = APIS.APIS_PERMISSION.delPermsRole;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(re_obj.msg);
            getDataRoleList();
            layer.close(confirm_tk);
        }
        else {
            layer.close(confirm_tk);
            layer.alert(re_obj.msg);
        }
    });
}
//#endregion

//#endregion

//#endregion


