$(document).ready(function () {
    csh_skin();
    // get_zw_list();
    // get_cd_json();

    csh_getdata_1();
    getdata_1();
    csh_getdata_2();
    getdata_2();
    csh_getdata_3();
});

//#region 初始化
function get_para() {

}
//#endregion

//#region getdata_1
function csh_getdata_1() {
    var colname_temp = ["权限ID", "权限名称"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_left_con").width(),
        height: $(".xw_left_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "qx_id", width: 80, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "qx_title", width: 185, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            // { name: "gj_type", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(nation_type, "para_title", "para_value") }, formatter: function (val, a, b, rowData) { return get_select_name(val, nation_type, "para_value", "para_title"); } },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
            getdata_2();
            get_middle_data();
            $("#list_3").gridUnload();
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
    // $("#list_1").addGridHead("input_quary_getdata_1");
}
function getdata_1() {
    let JsonPara = {  }
    let apiurl = APIS.APIS_PERMISSION.getPermsRoleList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        let list = re_obj.data;
        getdata_1_str(list)
    }
    else {
        layer.alert(re_obj.msg);
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

}
//#endregion

//#region getdata_2
function csh_getdata_2() {
    var colname_temp = ["选", "菜单ID", "菜单名称"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_mid_con").width(),
        height: $(".xw_mid_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "xuan", width: 40, edit_flag: false, edit: "none", align: "center", formatter: function(val, a, b, rowData) { return set_checkbox_div(rowData); }, hidden: false },
            { name: "cd_id", width: 70, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cd_title", width: 165, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
            getdata_3();
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
    $("#list_2").xwgrid(json_th);
    input_quary_getdata_2();
    // $("#list_2").addGridHead("input_quary_getdata_2");
}
function getdata_2() {
    let JsonPara = {}
    let apiurl = APIS.APIS_PERMISSION.getPermisMenu;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let list = re_obj.data;
        getdata_2_str(list);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
function getdata_2_str(json) {
    $("#list_2").gridUnload();
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            $("#list_2").addRowData(i + 1, json[i]);
        }
    }
}
function input_quary_getdata_2() {
    var html = new StringBuffer();
    html.Append(`<input type="checkbox" id="mid_all_cb" onclick="set_mid_all_permission();" name="list_2_all_checkbox" style="width: 15px; height: 15px;">\r\n`);
    $("#0_list_2_th_xuan_0").html(html.ToString());
}
function set_mid_all_permission() {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); $("#mid_all_cb").prop('checked', false); return; }
    let qx_id = list_1[0].qx_id;
    let cbs = $(`#list_2 input[type='checkbox'][id$='_cd_id']`);
    let list_id = [];
    for(let i = 0; i < cbs.length; i++) {
        let b = $(cbs[i]).attr('value');
        list_id.push(b);
    }
    let all_flag = $("#mid_all_cb").prop('checked');
    let xz_flag = all_flag == true ? 1 : 0;

    let JsonPara = { qx_id: qx_id, xz_flag: xz_flag, list_id: list_id };
    let apiurl = APIS.APIS_PERMISSION.setPermisDetailAll;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        get_middle_data();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 点击左侧，获取中间区域数据
function get_middle_data(msg_flag) {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { 
        if(isUndefine(msg_flag)) {
            layer.msg(get_lan_new_str("请选一项权限")); 
        }
        $("#mid_all_cb").prop('checked', false);
        return; 
    }
    let qx_id = list_1[0].qx_id;

    let JsonPara = { qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.getPermisDetail;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }

    $(`#list_2 input[type='checkbox'][id$='_cd_id']`).each(function(i, e) {
        $(e).prop("checked", false);
    });

    let pre_sel_list = re_obj.data;
    for (let i = 0; i < pre_sel_list.length; i++) {
        let cd_id = pre_sel_list[i];
        $(`#${cd_id}_cd_id`).prop("checked", true)
    }

    let all_flag = false;
    let all_a_list = [];
    $(`#list_2 input[type='checkbox'][id$='_cd_id']`).each(function(i, e) {
        let aa = $(e).prop("checked");
        all_a_list.push(aa);
    });
    if(!isUndefine(all_a_list) && all_a_list.length > 0) {
        all_flag = all_a_list.every(p => p == true);
    }
    if(all_flag) {
        // 有一个没选，那么多选按钮就不懂
        // 如果全选了，多选按钮就变色
        $("#mid_all_cb").prop('checked', true);
    }
    else {
        $("#mid_all_cb").prop('checked', false);
    }
}
//#endregion

//#region 多选框 设置中间权限
function set_checkbox_div(rowData) {
    let cd_id = rowData.cd_id;
    return `<input type="checkbox" id="${cd_id}_cd_id" onclick="set_mid_premission(${cd_id})" name="list_ck_checkbox" value="${cd_id}" style="width: 15px; height: 15px;">`
}
function set_mid_premission(cd_id) {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); $(`#list_2 #${cd_id}_cd_id`).prop('checked', false); return; }
    let qx_id = list_1[0].qx_id;

    let xz_flag = 0;
    let flag = $(`#list_2 #${cd_id}_cd_id`).is(':checked');
    if (flag) {
        xz_flag = 1;
    }
    else {
        xz_flag = 0;
    }

    let JsonPara = { qx_id: qx_id, xz_flag: xz_flag, cd_id: cd_id }
    let apiurl = APIS.APIS_PERMISSION.setPermisMenu;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        get_middle_data();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion



//#region getdata_3
function csh_getdata_3() {
    var colname_temp = ["选", "功能ID", "功能名称", "功能位置"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_right_con").width(),
        height: $(".xw_right_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "xuan", width: 40, edit_flag: false, edit: "none", align: "center", formatter: function(val, a, b, rowData) { return set_checkbox_div_gn(rowData); }, hidden: false },
            { name: "gn_id", width: 70, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "gn_name", width: 145, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "gn_wz", width: 305, edit_flag: false, edit: "input", align: "left", formatter: "", hidden: false },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
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
    $("#list_3").xwgrid(json_th);
    input_quary_getdata_3();
}
function getdata_3() {
    // let list_1 = xw_get_row("list_1");
    // if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); return; }

    let list_2 = xw_get_row("list_2");
    if(list_2.length != 1) { layer.msg(get_lan_new_str("请选一项菜单")); return; }
    let cd_id = list_2[0].cd_id;

    let JsonPara = { cd_id: cd_id }
    let apiurl = APIS.APIS_PERMISSION.getButtonPermis;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let list = re_obj.data;
        getdata_3_str(list);
        get_right_data();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
function getdata_3_str(json) {
    $("#list_3").gridUnload();
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            $("#list_3").addRowData(i + 1, json[i]);
        }
    }
}
function input_quary_getdata_3() {
    var html = new StringBuffer();
    html.Append(`<input type="checkbox" id="right_all_cb" onclick="set_right_all_permission();" name="list_3_all_checkbox" style="width: 15px; height: 15px;">\r\n`);
    $("#0_list_3_th_xuan_0").html(html.ToString());
}
function set_right_all_permission() {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); $("#right_all_cb").prop('checked', false); return; }
    let qx_id = list_1[0].qx_id;

    let list_2 = xw_get_row("list_2");
    if(list_2.length != 1) { layer.msg(get_lan_new_str("请选一项菜单")); $("#right_all_cb").prop('checked', false); return; }
    let cd_id = list_2[0].cd_id;

    let cd_flag = $(`#list_2 #${cd_id}_cd_id`).prop('checked');
    if(cd_flag == false) {
        $(`#right_all_cb`).prop('checked', false);
        layer.msg(get_lan_new_str("请先设置菜单,才能设置功能")); return;
    }

    let cbs = $(`#list_3 input[type='checkbox'][id$='_gn_id']`);
    let list_id = [];

    if(isUndefine(cbs) || cbs.length == 0) {
        $(`#right_all_cb`).prop('checked', false);
        layer.msg(get_lan_new_str("该菜单无功能")); return;
    }

    for(let i = 0; i < cbs.length; i++) {
        let b = $(cbs[i]).attr('value');
        list_id.push(b);
    }
    let all_flag = $("#right_all_cb").prop('checked');
    let xz_flag = all_flag == true ? 1 : 0;

    let JsonPara = { qx_id: qx_id, xz_flag: xz_flag, list_id: list_id, cd_id: cd_id };
    let apiurl = APIS.APIS_PERMISSION.setButtonPermisAll;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        get_right_data();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 点击中间，获取右边区域数据, 如果左侧也点了，就调用回显接口
function get_right_data() {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { return; }
    let qx_id = list_1[0].qx_id;

    let list_2 = xw_get_row("list_2");
    if(list_2.length != 1) { return; }
    let cd_id = list_2[0].cd_id;
    debugger
    let JsonPara = { cd_id: cd_id, qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.getButtionPermisDetail;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }

    $(`#list_3 input[type='checkbox'][id$='_gn_id']`).each(function(i, e) {
        $(e).prop("checked", false);
    });

    let pre_sel_list = re_obj.data;
    for (let i = 0; i < pre_sel_list.length; i++) {
        let gn_id = pre_sel_list[i];
        $(`#${gn_id}_gn_id`).prop("checked", true)
    }
    let all_flag = false;
    let all_a_list = [];
    $(`#list_3 input[type='checkbox'][id$='_gn_id']`).each(function(i, e) {
        let aa = $(e).prop("checked");
        all_a_list.push(aa);
    });
    if(!isUndefine(all_a_list) && all_a_list.length > 0) {
        all_flag = all_a_list.every(p => p == true);
    }
    if(all_flag) {
        // 有一个没选，那么多选按钮就不懂
        // 如果全选了，多选按钮就变色
        $("#right_all_cb").prop('checked', true);
    }
    else {
        $("#right_all_cb").prop('checked', false);
    }
}
//#endregion

//#region 功能多选框 设置右边按钮权限
function set_checkbox_div_gn(rowData) {
    let gn_id = rowData.gn_id;
    return `<input type="checkbox" id="${gn_id}_gn_id" onclick="set_right_premission(${gn_id})" name="list_ck_checkbox" value="${gn_id}" style="width: 15px; height: 15px;">`
}
function set_right_premission(gn_id) {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); $(`#list_3 #${gn_id}_gn_id`).prop('checked', false); return; }
    let qx_id = list_1[0].qx_id;

    let list_2 = xw_get_row("list_2");
    if(list_2.length != 1) { layer.msg(get_lan_new_str("请选一项菜单")); $(`#list_3 #${gn_id}_gn_id`).prop('checked', false); return; }
    let cd_id = list_2[0].cd_id;

    let cd_flag = $(`#list_2 #${cd_id}_cd_id`).prop('checked');
    if(cd_flag == false) {
        $(`#list_3 #${gn_id}_gn_id`).prop('checked', false);
        layer.msg(get_lan_new_str("请先设置菜单,才能设置功能")); return;
    }

    let xz_flag = 0;
    let flag = $(`#list_3 #${gn_id}_gn_id`).is(':checked');
    if (flag) {
        xz_flag = 1;
    }
    else {
        xz_flag = 0;
    }
    let JsonPara = { qx_id: qx_id, xz_flag: xz_flag, cd_id: cd_id, gn_id: gn_id }
    let apiurl = APIS.APIS_PERMISSION.setButtonPermis;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        get_right_data();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion


//#region 修改权限名
function csh_update_name() {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); return; }
    var qx_title = list_1[0].qx_title;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("权限ID")}</td>\r\n`);
    html.Append(`           <td>${list_1[0].qx_id}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("权限名称")}</td>\r\n`);
    html.Append(`           <td><input type="text" id="txt_qx_title" value="${qx_title}"/></td>\r\n`);
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
        title: get_lan_new_str("修改权限名"),
        area: ["300px", "200px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_submit").on('click', function () {
                update_name(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });

}
function update_name(tk_index) {
    let list_1 = xw_get_row("list_1");
    if(list_1.length != 1) { layer.msg(get_lan_new_str("请选一项权限")); return; }
    var qx_id = list_1[0].qx_id;
    var qx_title = $("#txt_qx_title").val(); if (isUndefine(qx_title)) { Toast("请输入"); return; }

    let JsonPara = { qx_id: qx_id, qx_title: qx_title }
    let apiurl = APIS.APIS_PERMISSION.updatePermsRoleName;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_1();
        getdata_2();
        get_middle_data(true);
        $("#list_3").gridUnload();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endreigon
