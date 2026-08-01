$(document).ready(function () {
    csh_skin();
    // get_zw_list();
    // get_cd_json();
    get_para();
    csh_getdata_1();
    getdata_1();
    csh_getdata_2();
});

//#region 初始化权限按钮
function get_button_permission(btn_list) {
    // let btn_perms = tf_ajax_bd({}, "../D_Javascript/utils/BtnPerms.json");
    // let now_page_perms = btn_perms.PERMS_SALE_TEMPLATE;

    let now_page_perms = new Set([1, 2, 3, 4, 5, 6, 7, 8]);
    let dynamic_list = [
        {
            title: get_lan_new_str("添加"),
            icon: 'addition',
            callback: csh_add_xw_2,
            params: "",
            btncss: "add_auto",
            txtcss: "",
            gn_id: 1,
            dom: ".xw_left_con .top_box .top_box_btn_group.mgl_left"
        },
        {
            title: get_lan_new_str("删除"),
            icon: 'delete',
            callback: csh_del_xw_2,
            params: "",
            btncss: "",
            txtcss: "fcc",
            gn_id: 2,
            dom: ".xw_left_con .top_box .top_box_btn_group.mgl_auto"
        },
    ]
    for(let i = 0; i < dynamic_list.length; i++) {
        let obj = dynamic_list[i];
        if(now_page_perms.has(obj.gn_id)) {
            renender_button(obj);
        }
    }
}
function get_xwme_obj() {
    let JsonPara = {}
    let apiurl = APIS.getUserInfo;
    let re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let qx_id = re_obj.data.qx_id;
    let cd_id = CONSTANS.MENU_PERMS_ID.SALE_TEMPLATE;

    JsonPara = { cd_id: cd_id, qx_id: qx_id }
    apiurl = APIS.APIS_PERMISSION.getButtionPermisDetail;
    re_obj = tf_ajax(JsonPara, apiurl);

    return re_obj.data;
}
//#endregion

//#region 初始化
let wt_type = null; let wt_type_select = null;
function get_para() {
    let btn_list = get_xwme_obj();
    get_button_permission(btn_list);

    wt_type = [{ "para_title": "单选", "para_value": `${CONSTANS.CTS_SALE_TEMPLATE.SINGLE_SEL}` }, 
            { "para_title": "多选", "para_value": `${CONSTANS.CTS_SALE_TEMPLATE.MULTIPLE_SEL}` }, { "para_title": "填空", "para_value": `${CONSTANS.CTS_SALE_TEMPLATE.FILL_IN}` }];
    wt_type = get_lan_select_para_json(wt_type, "para_title");
    wt_type_select = Create_select("sel_wt_type", wt_type, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });
}
//#endregion

//#region getdata_1
function csh_getdata_1() {
    var colname_temp = ["阶段ID", "阶段名称"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_left_con").width(),
        height: $(".xw_left_con").height() - 40,
        colNames: colnames,
        colModel: [
            { name: "jd_id", width: 75, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "jd_name", width: 140, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            // { name: "gj_type", width: 80, tail_allow: false, edit_flag: false, edit: "select", align: "center", editoptions: { values: set_jqg_select(nation_type, "para_title", "para_value") }, formatter: function (val, a, b, rowData) { return get_select_name(val, nation_type, "para_value", "para_title"); } },
        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
            getdata_2();
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
    $("#list_1").gridUnload();
    $("#list_2").gridUnload();
    $("#list_3").gridUnload();

    let JsonPara = {}
    let apiurl = APIS.APIS_SALE_TEMPLATE.getSaleTemplate1;
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
let data_2_length;
function csh_getdata_2() {
    var colname_temp = ["排序", "名称", "类型", "问题ID"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_mid_con").width(),
        height: $(".xw_mid_con").height() - 40,
        colNames: colnames,
        colModel: [
            { name: "px", width: 45, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "wt_title", width: 185, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "wt_type", width: 65, edit_flag: false, edit: "input", align: "center", formatter: function (val, a, b, rowData) { return get_select_name(val, wt_type, "para_value", "para_title"); }, hidden: false },
            { name: "jd_wt_id", width: 55, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
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
    $("#list_2").xwgrid(json_th);
    // input_quary_getdata_2();
    // $("#list_2").addGridHead("input_quary_getdata_2");
}
function getdata_2() {
    $("#list_2").gridUnload();
    $("#list_3").gridUnload();

    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    let jd_id = list_1[0].jd_id;
    let JsonPara = { jd_id: jd_id }
    let apiurl = APIS.APIS_SALE_TEMPLATE.getSaleTemplate2;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let list = re_obj.data;
        getdata_2_str(list);
        data_2_length = list.length;
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
//#endregion

//#region 添加模板问题
function csh_add_xw_2() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    var jd_id = list_1[0].jd_id;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("阶段名称")}</td>\r\n`);
    html.Append(`           <td>${list_1[0].jd_name}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("问题标题")}</td>\r\n`);
    html.Append(`           <td><input type="text" required id="txt_edit_wt_title" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str("问题类型")}</td>\r\n`);
    html.Append(`           <td>${wt_type_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>${get_lan_new_str("排序")}</td>\r\n`);
    html.Append(`           <td><input type="text" required id="txt_edit_px"/></td>\r\n`);
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
        title: get_lan_new_str("添加模板问题"),
        area: ["400px", "350px"], // 初始宽高
        success: function (layero, index) {
            $("#txt_edit_px").val(data_2_length + 1)
            $("#btn_submit").on('click', function () {
                add_xw_2(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function add_xw_2(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    var jd_id = list_1[0].jd_id;

    let wt_title = $("#txt_edit_wt_title").val();
    let px = $("#txt_edit_px").val();
    debugger
    console.log(isUndefine(wt_title))
    if (isUndefine(wt_title)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请输入必填项"));
        return;
    }
    if (isUndefine(px)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请输入必填项"));
        return;
    }
    let wt_type = $("#sel_wt_type").val(); if (wt_type == "-1") { layer.msg(get_lan_new_str("请选择")); return; }

    let JsonPara = { jd_id: jd_id, wt_title: wt_title, px: px, wt_type: wt_type }
    let apiurl = APIS.APIS_SALE_TEMPLATE.addSaleSel2;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_2();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除模板问题
function csh_del_xw_2() {
    let list_2 = xw_get_row("list_2");
    if (list_2.length != 1) { layer.msg(get_lan_new_str("请选一项")); return; }
    var obj = list_2[0];
    let jd_wt_id = obj.jd_wt_id;

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.wt_title} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { jd_wt_id: jd_wt_id }
            let apiurl = APIS.APIS_SALE_TEMPLATE.delSaleSel2;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                getdata_2();
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion

