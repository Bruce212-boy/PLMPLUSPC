$(document).ready(function () {
    csh_skin();
    get_para();
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
            callback: csh_add_branch,
            params: "",
            btncss: "add_auto",
            txtcss: "",
            gn_id: 1,
            dom: ".xw_left_con .top_box .top_box_btn_group.mgl_left"
        },
        {
            title: get_lan_new_str("修改"),
            icon: 'edit',
            callback: csh_update_branch,
            params: "",
            btncss: "",
            txtcss: "fcc",
            gn_id: 2,
            dom: ".xw_left_con .top_box .top_box_btn_group.mgl_auto"
        },
        {
            title: get_lan_new_str("删除"),
            icon: 'delete',
            callback: csh_del_branch_company,
            params: "",
            btncss: "",
            txtcss: "fcc",
            gn_id: 3,
            dom: ".xw_left_con .top_box .top_box_btn_group.mgl_auto"
        },
    ]
    for (let i = 0; i < dynamic_list.length; i++) {
        let obj = dynamic_list[i];
        if (now_page_perms.has(obj.gn_id)) {

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
let gs_info_list = null;
let origin_info_list = null;
function csh_getdata_1() {

}
function getdata_1() {
    $("#list_company_tree").html('');
    $("#list_company_detail").html('');

    let JsonPara = {}
    let apiurl = APIS.APIS_COMPANY_STRUCT.getCompanyList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        let list = re_obj.data;
        origin_info_list = list;
        console.log(origin_info_list);
        origin_info_list.forEach(p => {
            p.children = [];
            p.spread = true;
        });

        let new_list = pre_process_tree_data(list, 0);
        gs_info_list = new_list;
        console.log(gs_info_list);
        getdata_1_str(gs_info_list)
    }
    else {
        layer.alert(re_obj.msg);
    }
}
function getdata_1_str(list) {
    var tree = layui.tree;
    // 渲染
    tree.render({
        elem: '#list_company_tree',
        data: list,
        onlyIconControl: true,  // 是否仅允许节点左侧图标控制展开收缩
        click: function (obj) {
            // layer.msg(JSON.stringify(obj.data));
            $(`#list_company_tree .layui-tree-txt`).removeClass("tree_active");
            $(`#list_company_tree .layui-tree-entry`).attr("xw-sel-tree", "0");

            $(`#list_company_tree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first .layui-tree-txt`).addClass("tree_active");
            $(`#list_company_tree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-tree", "1");
            $(`#list_company_tree [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-id", `${obj.data.gs_id}`);
            // xw_get_layer_tree();
            getdata_2();
        },
        customName: {
            id: 'gs_id',
            title: 'gs_jc',
            children: 'children'
        }
    });
}
function input_quary_getdata_1() {

}
//#endregion



//#region 获取选择的迭代树信息
function xw_get_layer_tree(dom_id) {
    let a = $(`#${dom_id}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr("xw-sel-gs-id");
    return a;
}
//#endregion

//#region getdata_2
function csh_getdata_2() {
    // var colname_temp = ["排序", "名称", "类型", "问题ID"];
    // var colnames = get_lan_new_xw_colName(colname_temp);
    // var json_th = {
    //     width: $(".xw_mid_con").width(),
    //     height: $(".xw_mid_con").height() - 40,
    //     colNames: colnames,
    //     colModel: [
    //         { name: "px", width: 45, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
    //         { name: "wt_title", width: 185, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
    //         { name: "wt_type", width: 65, edit_flag: false, edit: "input", align: "center", formatter: function (val, a, b, rowData) { return get_select_name(val, wt_type, "para_value", "para_title"); }, hidden: false },
    //         { name: "jd_wt_id", width: 55, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
    //     ],
    //     onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
    //         xw_grid_td_click(dom_td_id, dom_list_id);
    //     },
    //     addRowCallback: function (dom_tr_id, dom_list_id) {
    //         // $(`#${dom_tr_id}`).dblclick(function (e) {
    //         //     dbclick_open_page(e);
    //         // });
    //     },
    //     serNumber: true,
    //     all_row_edit: false,
    //     allow_drag_sel_con: true,
    // }
    // $("#list_company_detail").xwgrid(json_th);
    // input_quary_getdata_2();
    // $("#list_company_detail").addGridHead("input_quary_getdata_2");
}
function getdata_2() {
    $("#list_company_detail").html('');
    let gs_id = xw_get_layer_tree("list_company_tree");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_info_list.find(p => p.gs_id == gs_id);

    getdata_2_str(obj);

}
function getdata_2_str(json) {
    let obj = json;
    let html = new StringBuffer();
    html.Append(`   <table name="mytable" class="grid" style="width: 400px; background: #fff">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('公司简称')}</td>\r\n`);
    html.Append(`           <td style="background: #eee; text-align: left; padding-left: 5px">${isUndefine(obj.gs_jc) ? "" : obj.gs_jc}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('公司全称')}</td>\r\n`);
    html.Append(`           <td><input style="background: #fff" data-enter type="text" required id="txt_edit_gs_qc" value="${isUndefine(obj.gs_qc) ? "" : obj.gs_qc}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('银行名称')}</td>\r\n`);
    html.Append(`           <td><input style="background: #fff" data-enter type="text" required id="txt_edit_bankname" value="${isUndefine(obj.bankname) ? "" : obj.bankname}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('银行卡号')}</td>\r\n`);
    html.Append(`           <td><input style="background: #fff" data-enter type="text" required id="txt_edit_bankcard" value="${isUndefine(obj.bankcard) ? "" : obj.bankcard}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('行号')}</td>\r\n`);
    html.Append(`           <td><input style="background: #fff" data-enter type="text" required id="txt_edit_hanghao" value="${isUndefine(obj.hanghao) ? "" : obj.hanghao}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('信用代码')}</td>\r\n`);
    html.Append(`           <td><input style="background: #fff" data-enter type="text" required id="txt_edit_xydm" value="${isUndefine(obj.xydm) ? "" : obj.xydm}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('地址')}</td>\r\n`);
    html.Append(`           <td><input style="background: #fff" data-enter type="text" required id="txt_edit_dizhi" value="${isUndefine(obj.dizhi) ? "" : obj.dizhi}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td colspan="2" style="text-align: right; padding: 5px 10px"><button class="cz_fter_btn" onclick="set_company_detail();">${get_lan_new_str('提交')}</button></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`   </table>\r\n`);
    $("#list_company_detail").html(html.ToString());
}
//#endregion

//#region 添加分公司 2级
function csh_add_branch() {
    let gs_id = xw_get_layer_tree("list_company_tree");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_info_list.find(p => p.gs_id == gs_id);
    let now_Lv = obj.Lv + 1;
    if(now_Lv > 2) { layer.msg(get_lan_new_str("不能继续添加新层级")); return; }

    let str = "分公司";
    let str_c = "分公司简称";
    if (now_Lv == 1) {
        str = "添加分公司";
    }
    else if (now_Lv == 2) {
        str = "添加子公司";
        str_c = "子公司简称";
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con cz_middle">\r\n`);
    html.Append(`   <table name="mytable" class="grid cz_middle" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('本级信息')}</td>\r\n`);
    html.Append(`           <td id="li_now_parent_id" data-val="${obj.gs_id}" style="text-align: left; padding-left: 5px;">${obj.Lv} - ${obj.gs_jc}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('添加层级')}</td>\r\n`);
    html.Append(`           <td id="li_now_Lv" data-val="${now_Lv}" style="text-align: left; padding-left: 5px;">${now_Lv}</td>\r\n`);
    html.Append(`       </tr>\r\n`);


    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str(str_c)}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required id="txt_edit_gs_jc"/></td>\r\n`);
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
        title: get_lan_new_str(`${str}`),
        area: ["400px", "240px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_submit").on('click', function () {
                add_branch(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });

}
function add_branch(tk_index) {

    let parent_id = $("#li_now_parent_id").attr('data-val'); if (isUndefine(parent_id)) { layer.msg(get_lan_new_str("无法添加,请联系管理员")); return; }
    let Lv = $("#li_now_Lv").attr('data-val'); if (isUndefine(Lv)) { layer.msg(get_lan_new_str("无法添加,请联系管理员")); return; }
    let gs_jc = $(`#txt_edit_gs_jc`).val();
    if (isUndefine(gs_jc)) {
        emit_required_input();
        return;
    }
    let JsonPara = { parent_id, gs_jc: gs_jc }
    let apiurl = APIS.APIS_COMPANY_STRUCT.addCompany;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_1();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 修改公司
function csh_update_branch() {
    let gs_id = xw_get_layer_tree("list_company_tree");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_info_list.find(p => p.gs_id == gs_id);
    let now_Lv = obj.Lv + 1;
    if(now_Lv > 2) { layer.msg(get_lan_new_str("不能继续添加新层级")); return; }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con cz_middle">\r\n`);
    html.Append(`   <table name="mytable" class="grid" style="width: 100%">\r\n`);
    
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('公司简称')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" required id="txt_edit_gs_jc" value="${obj.gs_jc}"/></td>\r\n`);
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
        title: get_lan_new_str(`修改公司简称`),
        area: ["300px", "180px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_submit").on('click', function () {
                update_branch(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function update_branch(tk_index) {
    let gs_id = xw_get_layer_tree("list_company_tree");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_info_list.find(p => p.gs_id == gs_id);

    let gs_jc = $(`#txt_edit_gs_jc`).val();
    if (isUndefine(gs_jc)) {
        emit_required_input();
        return;
    }
    debugger
    let JsonPara = { gs_id: obj.gs_id, gs_jc: gs_jc }
    let apiurl = APIS.APIS_COMPANY_STRUCT.updateCompany;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_1();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除公司
function csh_del_branch_company() {
    let gs_id = xw_get_layer_tree("list_company_tree");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let obj = origin_info_list.find(p => p.gs_id == gs_id);
    console.log(obj);

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.gs_jc} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { gs_id: obj.gs_id }
            let apiurl = APIS.APIS_COMPANY_STRUCT.delCompany;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                getdata_1();
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );
}
//#endregion

//#region 设置公司信息
function set_company_detail() {
    let gs_id = xw_get_layer_tree("list_company_tree");
    if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
    let gs_qc = $("#txt_edit_gs_qc").val();
    let bankname = $("#txt_edit_bankname").val();
    let bankcard = $("#txt_edit_bankcard").val();
    let hanghao = $("#txt_edit_hanghao").val();
    let xydm = $("#txt_edit_xydm").val();
    let dizhi = $("#txt_edit_dizhi").val();

    let JsonPara = { gs_id: gs_id, gs_qc: gs_qc, bankname: bankname, bankcard: bankcard, hanghao: hanghao, xydm: xydm, dizhi: dizhi }
    let apiurl = APIS.APIS_COMPANY_STRUCT.setCompanyDeatil;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        repeat_sel_node();
        getdata_2();
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 重新刷新
function repeat_sel_node() {
    let apiurl = APIS.APIS_COMPANY_STRUCT.getCompanyList;
    let re_obj = tf_ajax({}, apiurl)
    if (re_obj.flag == 1) {
        origin_info_list = re_obj.data;
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion


