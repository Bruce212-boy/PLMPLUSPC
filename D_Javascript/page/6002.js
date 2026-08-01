$(document).ready(function () {
    csh_skin();
    csh_UI_word();
    // csh_getdata_1();
    // csh_getdata_2();
    // getdata_1();
    let permObject = XWUTILS.getSafety();
    if (permObject.flag == 1) {
        let btnList = permObject.data.list;
        initButtonAction(btnList);
        initSystemParamsEmpty();
        initSystemParamsDetailsEmpty();
    }
});

//#region 初始化按钮
function initButtonAction(list) {
    let funMap = new Map();
    funMap.set("initAddSystemParams", initAddSystemParams);
    funMap.set("initUpdateSystemParams", initUpdateSystemParams);
    funMap.set("delSystemParams", delSystemParams);

    funMap.set("initAddSystemParamsDetails", initAddSystemParamsDetails);
    funMap.set("initUpdateSystemParamsDetails", initUpdateSystemParamsDetails);
    funMap.set("delSystemParamsDetails", delSystemParamsDetails);

    XWUTILS.renenderButton(list, funMap);
}
//#endregion

$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($(".xw_left_con").width() - 14);
        $("#list_2").setGridWid($(".xw_right_con").width() - 14);
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

// 新的

//#region 左侧 参数类型
//#region 左侧列表
let listSystemParams;
function initSystemParamsEmpty() {
    let list = [];
    let origionList = [];
    let jExcelObj = getSystemParamsOptions(list);
    listSystemParams = $('#listSystemParams').jexcel({
        data: jExcelObj.data,
        columns: jExcelObj.columns,
        originData: origionList,
        onSelectRow: function (rowData) {
            listSystemParamsDetails.cleanCustomHeaderText();
            getDataSystemParamsDetailsList();
        },
        // contextMenu: function (el, x, y, e) {
        //     var items = [];
        //     items.push({
        //         title: "测试",
        //         shortcut: 'Ctrl + C',
        //         onclick: function () {
        //             XWUTILS.alertLanNewStr("hello")
        //         }
        //     });
        //     return items;
        // }
        allowContextMenu: false,
    });
    // listSystemParams.createCustomHeader();
    // $("#listSystemParams [data-input-sign]").on("keyup", function (e) {
    //     if ($(this).val() == "") {
    //         getdata_excel();
    //     }
    //     var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    //     if (key == 13) {
    //         e.stopPropagation();
    //         getdata_excel();
    //     }
    // });
    getDataSystemParamsList();
}
function getSystemParamsOptions(list) {
    let columns = [
        { title: '类型ID', name: "type_id", type: 'text', width: 60, readOnly: true },
        { title: '类型名', name: "type_name", type: 'text', width: 150, readOnly: true },
        { title: 'ID', name: "y1_para_type_id", type: 'hidden', width: 30, readOnly: true },
        // { title: '选择品名', name: "sp_btn", type: 'custom', readOnly: true, width: 50, formatter: function (val, rowData, colIndex, rowIndex) { return create_btn(val, rowData) } },
    ];
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
let addTypeLength = 0;
async function getDataSystemParamsList() {
    let JsonPara = {}
    let apiurl = APIS.APIS_SYSTEM_PARAM.getSysTypeList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    addTypeLength = list.length;
    let jExcelObj = getSystemParamsOptions(list);
    listSystemParams.setData(jExcelObj.data);
}
//#endregion

//#region 添加类型
function initAddSystemParams() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_ID}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_type_id" class="cz-input" value="${addTypeLength + 1}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_type_name" class="cz-input"/></td>\r\n`);
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
        title: CONSTANS.PAGE_USER_PARAMS.STR_ADD_USER_PARAMS,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                addSystemParams(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function addSystemParams(tk_index) {
    let type_id = $("#txt_edit_type_id").val();
    let type_name = $("#txt_edit_type_name").val();

    if (XWUTILS.isUndefine(type_id) || XWUTILS.isUndefine(type_name)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { type_id: type_id, type_name: type_name }
    let apiurl = APIS.APIS_SYSTEM_PARAM.addType;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataSystemParamsList();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 修改类型
function initUpdateSystemParams() {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_ID}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_type_id" class="cz-input" value="${obj.type_id}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_type_name" class="cz-input" value="${obj.type_name}"/></td>\r\n`);
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
        title: CONSTANS.PAGE_USER_PARAMS.STR_UPDATE_USER_PARAMS,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                updateSystemParams(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function updateSystemParams(tk_index) {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let y1_para_type_id = obj.y1_para_type_id;
    let type_id = $("#txt_edit_type_id").val();
    let type_name = $("#txt_edit_type_name").val();

    if (XWUTILS.isUndefine(type_id) || XWUTILS.isUndefine(type_name)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { type_id: type_id, type_name: type_name, y1_para_type_id: y1_para_type_id }
    let apiurl = APIS.APIS_SYSTEM_PARAM.updateType;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataSystemParamsList();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 删除类型
function delSystemParams() {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    let type_name = obj.type_name
    let y1_para_type_id = obj.y1_para_type_id;
    let tk = layer.confirm(`${CONSTANS.NORMAL_STR.CONFIRM_DELETE} ${type_name}`, () => {
        let JsonPara = { y1_para_type_id: y1_para_type_id }
        let apiurl = APIS.APIS_SYSTEM_PARAM.delType;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
            layer.close(tk);
            getDataSystemParamsList();
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    });
}
//#endregion

//#endregion


//#region 右侧 参数类型详细

//#region 右侧详细
let listSystemParamsDetails;
function initSystemParamsDetailsEmpty() {
    let list = [];
    let origionList = [];
    let jExcelObj = getSystemParamsDetailsOptions(list);
    listSystemParamsDetails = $('#listSystemParamsDetails').jexcel({
        data: jExcelObj.data,
        columns: jExcelObj.columns,
        originData: origionList,
        onSelectRow: function (rowData) {
        },
        allowContextMenu: false,
    });
    listSystemParamsDetails.createCustomHeader();
    $("#listSystemParamsDetails [data-input-sign]").on("keyup", function (e) {
        if ($(this).val() == "") {
            getDataSystemParamsDetailsList();
        }
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.stopPropagation();
            getDataSystemParamsDetailsList();
        }
    });
    getDataSystemParamsDetailsList();
}
function getSystemParamsDetailsOptions(list) {
    let columns = [
        { title: 'ID', name: "sys_para_id", type: 'hidden', width: 80, readOnly: true },
        { title: '类型ID', name: "type_id", type: 'text', width: 80, readOnly: true },
        { title: '参数1', name: "zd_1", type: 'text', width: 150, readOnly: true },
        { title: '参数2', name: "zd_2", type: 'text', width: 150, readOnly: true },
        { title: '参数3', name: "zd_3", type: 'text', width: 150, readOnly: true },
        { title: '参数4', name: "zd_4", type: 'text', width: 150, readOnly: true },
        { title: '排序', name: "px", type: 'text', width: 80, readOnly: true },
    ];
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
async function getDataSystemParamsDetailsList() {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];
    if (XWUTILS.isUndefine(obj)) {
        return;
    }
    let type_id = obj.type_id;
    // var zd_1 = $("#listSystemParamsDetails [data-input-sign='zd_1']").val();
    var zd_1 = listSystemParamsDetails.getCustomHeaderText('zd_1');
    var zd_2 = listSystemParamsDetails.getCustomHeaderText('zd_2');
    var zd_3 = listSystemParamsDetails.getCustomHeaderText('zd_3');
    var zd_4 = listSystemParamsDetails.getCustomHeaderText('zd_4');

    let JsonPara = { type_id: type_id, zd_1: zd_1, zd_2: zd_2, zd_3: zd_3, zd_4: zd_4 }
    let apiurl = APIS.APIS_SYSTEM_PARAM.getList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    let jExcelObj = getSystemParamsDetailsOptions(list);
    listSystemParamsDetails.setData(jExcelObj.data);
}
//#endregion

//#region 添加参数
function initAddSystemParamsDetails() {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_ONE}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_zd_1" class="cz-input" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_TWO}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_zd_2" class="cz-input" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_THREE}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_zd_3" class="cz-input" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_FOUR}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_zd_4" class="cz-input" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_SORT}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_zd_px" class="cz-input" value="100"/></td>\r\n`);
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
        title: CONSTANS.PAGE_USER_PARAMS.STR_ADD_USER_PARAMS_DETAILS,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                addSystemParamsDetails(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function addSystemParamsDetails(tk_index) {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let type_id = obj.type_id;
    let zd_1 = $("#txt_edit_zd_1").val();
    let zd_2 = $("#txt_edit_zd_2").val();
    let zd_3 = $("#txt_edit_zd_3").val();
    let zd_4 = $("#txt_edit_zd_4").val();
    let px = $("#txt_edit_zd_px").val();

    if (XWUTILS.isUndefine(zd_1) || XWUTILS.isUndefine(zd_2)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { type_id: type_id, zd_1: zd_1, zd_2: zd_2, zd_3: zd_3, zd_4: zd_4, px: px }
    let apiurl = APIS.APIS_SYSTEM_PARAM.addPara;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataSystemParamsDetailsList();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 修改参数
function initUpdateSystemParamsDetails() {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let objDetails = listSystemParamsDetails.getSelectedRowsData();
    if (!objDetails || objDetails.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let objDetail = objDetails[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_ONE}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_zd_1" class="cz-input" value="${objDetail.zd_1}" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_TWO}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_zd_2" class="cz-input" value="${objDetail.zd_2}" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_THREE}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_zd_3" class="cz-input" value="${objDetail.zd_3}" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_FOUR}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_zd_4" class="cz-input" value="${objDetail.zd_4}" /></td>\r\n`);
    html.Append(`           </tr>\r\n`);

    html.Append(`           <tr>\r\n`);
    html.Append(`               <td align="center">${CONSTANS.PAGE_USER_PARAMS.STR_USER_PARAMS_DETAILS_SORT}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="false" id="txt_edit_zd_px" class="cz-input" value="${objDetail.px}"/></td>\r\n`);
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
        title: CONSTANS.PAGE_USER_PARAMS.STR_ADD_USER_PARAMS_DETAILS,
        area: ["400px", "355px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                updateSystemParamsDetails(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function updateSystemParamsDetails(tk_index) {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let obj = objs[0];

    let objDetails = listSystemParamsDetails.getSelectedRowsData();
    if (!objDetails || objDetails.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let objDetail = objDetails[0];

    let type_id = obj.type_id;
    let sys_para_id = objDetail.sys_para_id;
    let zd_1 = $("#txt_edit_zd_1").val();
    let zd_2 = $("#txt_edit_zd_2").val();
    let zd_3 = $("#txt_edit_zd_3").val();
    let zd_4 = $("#txt_edit_zd_4").val();
    let px = $("#txt_edit_zd_px").val();

    if (XWUTILS.isUndefine(zd_1) || XWUTILS.isUndefine(zd_2)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = {
        type_id: type_id, sys_para_id: sys_para_id,
        zd_1: zd_1, zd_2: zd_2, zd_3: zd_3, zd_4: zd_4, px: px
    }
    let apiurl = APIS.APIS_SYSTEM_PARAM.updatePara;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataSystemParamsDetailsList();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 删除参数
function delSystemParamsDetails() {
    let objs = listSystemParams.getSelectedRowsData();
    if (!objs || objs.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    let objDetails = listSystemParamsDetails.getSelectedRowsData();
    if (!objDetails || objDetails.length > 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let objDetail = objDetails[0];
    let yhzd_para_id = objDetail.yhzd_para_id;

    let tk = layer.confirm(`${CONSTANS.NORMAL_STR.CONFIRM_DELETE} ${objDetail.zd_1} ${objDetail.zd_2}`, () => {
        let JsonPara = { yhzd_para_id: yhzd_para_id }
        let apiurl = APIS.APIS_SYSTEM_PARAM.delPara;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
            layer.close(tk);
            getDataSystemParamsDetailsList();
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    });
}

//#endregion


//#endregion

function test() {
    let objs = listSystemParams.getSelectedRowsData();
    let objs2 = listSystemParamsDetails.getSelectedRowsData();

    console.log(objs, objs2)

}

