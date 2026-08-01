$(document).ready(function () {
    let flag = safety();
    if (flag) {
        get_para();
        csh_skin();
        csh_getdata_1();
        getdata_1(1);
    }
});

$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($("#con_kh").width() - 10);
    });
});

//#region 参数查询
let cp_type_json = null; let cp_type_select = null;
let cp_series_json = null; let cp_series_select = null;
let cp_series_dd_items = null;
function get_para() {
    let JsonPara = { list_id: [CONSTANS.CTS_PROD_INFO.PROD_SERIES, CONSTANS.CTS_PROD_INFO.PROD_TYPE] }
    let apiurl = APIS.APIS_USER_INFO.getYhzdParaByIDS;
    let re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let temp_list = re_obj.data;
    cp_type_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_PROD_INFO.PROD_TYPE);
    cp_type_select = Create_select("sel_cp_type", cp_type_json, "zd_1", "zd_2", -1, { title: get_lan_new_str("请选择"), value: -1 });

    cp_series_json = temp_list.filter(p => p.type_id == CONSTANS.CTS_PROD_INFO.PROD_SERIES);

    cp_series_dd_items = cp_series_json.map(function (item) {
        let obj = {
            value: item.zd_2,
            title: item.zd_2,
        }
        return obj;
    });
}
function get_select_name(temp, list, key_val, key_title) {
    if (isUndefine(list) || list.length == 0) { return temp; }
    let result = "";
    let temp_int = parseInt(temp);
    var p_obj = list.find(p => p[key_val] == temp_int);
    if (p_obj != null) { result = p_obj[key_title]; }
    return result;
}
function get_dd_zt_name(temp) {
    var result = "";
    var temp_int = parseInt(temp);
    var p_obj = dd_zt_json.find(p => p.para_value == temp_int);
    if (p_obj != null) { result = p_obj.para_title; }
    return result;
}
function get_other_file(val, rowData) {
    return `<a onclick="csh_check_other_file(${rowData.cp_id});" href="javascript:;">查看</a>`
}
function get_textarea(val) {
    const formattedText = val.replace(/\n/g, '<br>');
    return `<div style="padding: 5px; white-space: pre-wrap;">${formattedText}</div>`
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

//#region csh_getdata_1 
function csh_getdata_1() {
    var colname_temp = ["产品ID", "产品系列", "产品型号", "产品名", "产品图片", "产品类型", "产品单价", "产品单位", "安装奖励", "产品说明", "附件"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $("#con_kh").width(),
        height: $("#con_kh").height() - 20,
        colNames: colnames,
        colModel: [
            { name: "cp_id", width: 60, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cp_xl", width: 100, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "cp_xh", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cp_name", width: 150, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cp_img", width: 80, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: function (val) { return get_touxiang(val); }, hidden: false },
            {
                name: "cp_type", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center",
                editoptions: { values: set_jqg_select(cp_type_json, "zd_2", "zd_1") },
                formatter: function (val, a, b, rowData) { return get_select_name(val, cp_type_json, "zd_1", "zd_2"); }
            },
            { name: "danjia", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "danwei", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "az_jl", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "cp_sm", width: 200, tail_allow: false, edit_flag: false, edit: "input", align: "left", formatter: function (val) { return get_textarea(val); }, hidden: false },
            { name: "fujian", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: function (val, a, b, rowData) { return get_other_file(val, rowData); }, hidden: false },

        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
        },
        addRowCallback: function (dom_tr_id, dom_list_id) {
        },
        serNumber: true,
        all_row_edit: false,
        allow_drag_sel_con: true,
    }
    $("#list_1").xwgrid(json_th);
    $("#list_1").addGridHead("input_quary_getdata_1");
}
function getdata_1(pageindex) {
    $("#list_1").gridUnload();
    var cp_id = $("#txt_head_list_1_cp_id").val();
    var cp_xl = $("#srch_sel_div_head_list_1_cp_xl_input_txt").val();
    var cp_xh = $("#txt_head_list_1_cp_xh").val();
    var cp_name = $("#txt_head_list_1_cp_name").val();
    var cp_type = $("#sel_head_list_1_cp_type").val();

    var JsonPara = {
        pageindex: pageindex, cp_id: cp_id, cp_xl: cp_xl, cp_xh: cp_xh, cp_name: cp_name, cp_type: cp_type, pagesize: 20
    };
    var apiurl = APIS.APIS_PROD_INFO.getProdList;
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        let list = re_obj.data;
        getdata_1_str(list);

        if (!isUndefine(list) && list.length > 0) {
            var pager_str = get_pager(pageindex, 20, re_obj.totle, "getdata");
            $("#pager").html(pager_str);
        }
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
    $(`input[id^="txt_head_list_1_"]`).on('keyup', function (e) {
        if ($(this).val() == "") {
            getdata_1(1);
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            getdata_1(1);
        }
    });

    $(`select[id^="sel_head_list_1"]`).on('change', function (e) {
        getdata_1(1);
    });

    $("#div_head_list_1_cp_xl").xw_search_sel({
        // dd_items: [
        //     { value: "A15-550", title: "A15-550" },
        //     { value: "A16-660", title: "A16-660" },
        //     { value: "A17-770", title: "A17-770" },
        // ],
        dd_items: cp_series_dd_items,
        correct_top: 23,
        correct_left: 0,
        dl_wid: 100,
        dl_hei: 120,
        input_hei: 26,
        callback: getdata_1,
        callback_param: [1]
    });

    $(`#srch_sel_div_head_list_1_cp_xl_input_txt`).on('keyup', function (e) {
        if ($(this).val() == "") {
            getdata_1(1);
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            getdata_1(1);
        }
    });
}

function hello() {
    console.log(123)
}

function get_touxiang(cellvalue, options, rowdata) {

    var img = "";
    if (cellvalue == "" || cellvalue == null) { img = "<img src=\"../../E_image/morentouxiang.png\" style=\"width:30px;height:30px;\">"; }
    else {
        var img_url = file_yuming + cellvalue;
        img = "<img src=\"" + img_url + "\" onclick=\"show_big_img('" + img_url + "')\" style=\"width:30px;height:30px;cursor:pointer;\">";
    }
    return img;
}
//#endregion

//#region 添加整机
function csh_add_prod() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品名称")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_cp_name" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品类型")}</td>\r\n`);
    html.Append(`           <td colspan="2">${cp_type_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品系列")}</td>\r\n`);
    html.Append(`           <td><div id="li_cp_xl" style="text-align: left; padding-left: 5px"></div></td>\r\n`);
    html.Append(`           <td class="td_inner_selcon" onclick="csh_sel_cp_xl();">选择</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品型号")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_cp_xh" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("单价")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_danjia" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("单位")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_danwei" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("安装奖励")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_az_jl" value=""/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品说明")}</td>\r\n`);
    html.Append(`           <td colspan="2"><textarea type="text" id="txt_edit_cp_sm" value="" style="height: 70px"></textarea></td>\r\n`);
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
        title: get_lan_new_str("添加产品"),
        area: ["450px", "420px"], // 初始宽高
        success: function (layero, index) {
            // $("#div_edit_cp_xl").xw_search_sel({
            //     dd_items: cp_series_dd_items,
            //     correct_top: 23,
            //     correct_left: 0,
            //     dl_wid: 350,
            //     dl_hei: 150,
            //     input_hei: 30,
            //     placeholder: get_lan_new_str("请选择或搜索"),
            // });

            $("#btn_submit").on('click', function () {
                add_prod(tk_index);
            });
        },
        end: function () {
        }
    });

}
function add_prod(tk_index) {
    let cp_name = $("#txt_edit_cp_name").val();
    let cp_xl = $("#li_cp_xl").text();
    let cp_xh = $("#txt_edit_cp_xh").val();
    let danjia = $("#txt_edit_danjia").val();
    let danwei = $("#txt_edit_danwei").val();
    let az_jl = $("#txt_edit_az_jl").val();

    if (isUndefine(cp_name) || isUndefine(cp_xl) || isUndefine(cp_xh) || isUndefine(danjia)
        || isUndefine(az_jl) || isUndefine(danwei)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请输入必填项"));
        return;
    }

    let cp_sm = $("#txt_edit_cp_sm").val();
    let cp_type = $("#sel_cp_type").val(); if (isUndefine(cp_type) || cp_type == "-1") { layer.msg(get_lan_new_str("请选择")); return; }

    let JsonPara = {
        cp_name: cp_name, cp_xl: cp_xl, cp_xh: cp_xh, danjia: danjia, danwei: danwei, cp_sm: cp_sm, cp_type: cp_type,
        az_jl: az_jl
    }
    let apiurl = APIS.APIS_PROD_INFO.addProduct;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        getdata_1(1);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
function emit_required_input() {
    $(`input[id^="txt_edit_"][required]`).each(function () {
        let val = $(this).val();
        if (isUndefine(val)) {
            $(this).attr("placeholder", get_lan_new_str("请输入必填项"));
            $(this).addClass("require_color");
        }
    });
}
//#endregion

//#region 选择产品系列
function csh_sel_cp_xl() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <div class="content">\r\n`);
    html.Append(`       <div class="top_box">\r\n`);
    html.Append(`           <div class="top_box_title">\r\n`);
    html.Append(`               产品系列\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`           <div class="top_box_btn_group">\r\n`);
    html.Append(`               <input id="txt_search_cp_xl" type="text" style="width: 85px; margin-right: 5px; background: #fff; height: 26px; line-height: 26px; font-size: 14px;">\r\n`);
    html.Append(`               <div id="btn_search_cp_xl" class="top_box_btn_item"><span class="my-icon layui-icon layui-icon-search"></span><span class="text fcc">搜索</span></div>\r\n`);
    html.Append(`           </div>\r\n`);
    html.Append(`       </div>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`   <div id="div_cp_xl_area" class="div_file_area">\r\n`);
    html.Append(`   </div>\r\n`);

    // html.Append(`   <div class="cz_footer">\r\n`);
    // html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    // html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    let series_tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("选择产品系列"),
        area: ["400px", "330px"], // 初始宽高
        success: function (layero, index) {

        },
        end: function () {
        }
    });

    $("#btn_search_cp_xl").on('click', function () {
        search_cp_xl(series_tk_index);
    })
    $("#txt_search_cp_xl").on('keyup', function (e) {
        if ($(this).val() == "") {
            search_cp_xl(series_tk_index);
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            search_cp_xl(series_tk_index);
        }
    });
    get_sel_cp_xl(series_tk_index);

}
function get_sel_cp_xl(tk_index) {
    let html = new StringBuffer();
    for (let i = 0; i < cp_series_dd_items.length; i++) {
        let obj = cp_series_dd_items[i];
        html.Append(`       <div class="div_file_area_item" onclick="set_cp_xl_li('${obj.title}', ${tk_index})">\r\n`);
        html.Append(`           <div class="div_file_area_item2_text">${obj.title}</div>\r\n`);
        html.Append(`       </div>\r\n`);
    }
    $("#div_cp_xl_area").html(html.ToString());
}
function search_cp_xl(tk_index) {
    let val = $("#txt_search_cp_xl").val();
    let filter_list = [];
    for (let i = 0; i < cp_series_dd_items.length; i++) {
        let obj = cp_series_dd_items[i];
        if (obj.title.includes(val)) {
            filter_list.push(obj);
        }
    }

    let html = new StringBuffer();
    for (let i = 0; i < filter_list.length; i++) {
        let obj = filter_list[i];
        html.Append(`       <div class="div_file_area_item" onclick="set_cp_xl_li('${obj.title}', ${tk_index})">\r\n`);
        html.Append(`           <div class="div_file_area_item2_text">${obj.title}</div>\r\n`);
        html.Append(`       </div>\r\n`);
    }
    $("#div_cp_xl_area").html(html.ToString());
}
function set_cp_xl_li(val, tk_index) {
    $("#li_cp_xl").text(val);
    layer.close(tk_index)
}
//#endregion

//#region 修改整机
function csh_update_prod() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品名称")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_cp_name" value="${obj.cp_name}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品类型")}</td>\r\n`);
    html.Append(`           <td colspan="2">${cp_type_select}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品系列")}</td>\r\n`);
    html.Append(`           <td><div id="li_cp_xl" style="text-align: left; padding-left: 5px">${obj.cp_xl}</div></td>\r\n`);
    html.Append(`           <td class="td_inner_selcon" onclick="csh_sel_cp_xl();">选择</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品型号")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_cp_xh" value="${obj.cp_xh}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("单价")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_danjia" value="${obj.danjia}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("单位")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_danwei" value="${obj.danwei}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("安装奖励")}</td>\r\n`);
    html.Append(`           <td colspan="2"><input type="text" required id="txt_edit_az_jl" value="${obj.az_jl}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);

    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("产品说明")}</td>\r\n`);
    html.Append(`           <td colspan="2"><textarea type="text" id="txt_edit_cp_sm" style="height: 70px"/>${obj.cp_sm}</textarea></td>\r\n`);
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
        title: get_lan_new_str("修改产品"),
        area: ["450px", "420px"], // 初始宽高
        success: function (layero, index) {
            $("#sel_cp_type").val(obj.cp_type);
            $("#btn_submit").on('click', function () {
                update_prod(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function update_prod(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];
    debugger

    let cp_id = obj.cp_id;
    let cp_name = $("#txt_edit_cp_name").val();
    let cp_xl = $("#li_cp_xl").text();
    let cp_xh = $("#txt_edit_cp_xh").val();
    let danjia = $("#txt_edit_danjia").val();
    let danwei = $("#txt_edit_danwei").val();
    let az_jl = $("#txt_edit_az_jl").val();

    if (isUndefine(cp_name) || isUndefine(cp_xl) || isUndefine(cp_xh) || isUndefine(danjia)
        || isUndefine(az_jl) || isUndefine(danwei)) {
        emit_required_input();
        layer.msg(get_lan_new_str("请输入必填项"));
        return;
    }

    let cp_sm = $("#txt_edit_cp_sm").val();
    let cp_type = $("#sel_cp_type").val(); if (isUndefine(cp_type) || cp_type == "-1") { layer.msg(get_lan_new_str("请选择")); return; }

    let JsonPara = {
        cp_id: cp_id,
        cp_name: cp_name, cp_xl: cp_xl, cp_xh: cp_xh, danjia: danjia, danwei: danwei, cp_sm: cp_sm, cp_type: cp_type,
        az_jl: az_jl
    }
    let apiurl = APIS.APIS_PROD_INFO.updateProduct;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        flush_return_now_page("pager", getdata_1, "list_1", "cp_id", cp_id);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除
function csh_del_prod() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.cp_name} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { cp_id: obj.cp_id }
            let apiurl = APIS.APIS_PROD_INFO.delProduct;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                flush_return_now_page("pager", getdata_1);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion

//#region 设置图片
function newtb_click_pt_img_1() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let cp_id = list_1[0].cp_id;

    $("#hid_img_new_tb_1").bind("change", function () {
        tf_ajax_upload_zd_wjj_wjm_hzm('hid_img_new_tb_1', 'cp_tp', cp_id, "jpg,jpeg,png,PNG,JEG,JPEG", newtb_set_pt_img_1);
    });
    $("#hid_img_new_tb_1")[0].click();
}
function newtb_set_pt_img_1(tp_obj) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let cp_id = list_1[0].cp_id;

    if (tp_obj.flag == 0) { layer.msg(tp_obj.msg); return; }
    var obj = tp_obj.data;


    var file_url = obj.file_url;
    var cp_img = file_url;

    var JsonPara = { cp_id: cp_id, cp_img: cp_img }
    var apiurl = APIS.APIS_PROD_INFO.setProductImg;
    var re_obj = tf_ajax(JsonPara, apiurl);

    if (re_obj.flag == 1) {
        flush_return_now_page("pager", getdata_1, "list_1", "cp_id", cp_id);
    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 查看附件
function csh_check_other_file(cp_id) {

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <input id="hid_other_file" type="file" style="display:none">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str("上传附件")}</td>\r\n`);
    html.Append(`           <td></td>\r\n`);
    html.Append(`           <td onclick="csh_upload_other_file();" style="width: 65px; background: #ccc; cursor: pointer; user-select: none">选择</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`   </table>\r\n`);

    html.Append(`   <div id="div_file_area" class="div_file_area">\r\n`);
    html.Append(`   </div>\r\n`);

    // html.Append(`   <div class="cz_footer">\r\n`);
    // html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    // html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("上传附件"),
        area: ["400px", "320px"], // 初始宽高
        success: function (layero, index) {
            get_other_file_list(cp_id);
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function csh_upload_other_file() {
    $("#hid_other_file").bind("change", function () {
        tf_ajax_upload_zd_wjj_hzm('hid_other_file', 'cp_fj', "gif,jpg,jpeg,png,bmp,docx,doc,xlsx,xls,rar,zip,pdf,holes,dxf,dwg", upload_other_file);
    });
    $("#hid_other_file")[0].click();
}
function upload_other_file(tp_obj) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let cp_id = list_1[0].cp_id;

    if (tp_obj.flag == 0) { layer.msg(tp_obj.msg); return; }
    var obj = tp_obj.data;

    var file_url = obj.file_url;
    let sj_name = obj.sj_name;
    let ys_name = obj.ys_name;

    var JsonPara = { type_id: CONSTANS.FILE_COM_TYPE.PRODUCT_FILE, file_url: file_url, sj_name: sj_name, ys_name: ys_name, ty_id: cp_id }
    var apiurl = APIS.APIS_FILE_UPLOAD.addFile;
    var re_obj = tf_ajax(JsonPara, apiurl);

    if (re_obj.flag == 1) {
        get_other_file_list(cp_id);
        // flush_return_now_page("pager", getdata_1, "list_1", "cp_id", cp_id);
    }
    else {
        layer.alert(re_obj.msg);
    }
}

// 获取附件
function get_other_file_list(cp_id) {
    let JsonPara = { type_id: CONSTANS.FILE_COM_TYPE.PRODUCT_FILE, ty_id: cp_id }
    let apiurl = APIS.APIS_FILE_UPLOAD.getFileList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
    }
    let html = new StringBuffer();
    for (let i = 0; i < re_obj.data.length; i++) {
        let obj = re_obj.data[i];
        let file_url = file_yuming + obj.file_url;
        html.Append(`<div class="div_file_area_item">\r\n`);
        html.Append(`    <a target="_blank" href="${file_url}"><div class="div_file_area_item_text">${obj.ys_name}</div></a>\r\n`);
        html.Append(`    <div class="div_file_area_item_close" onclick="del_other_file(${obj.file_id}, ${cp_id});"><span class="my-icon layui-icon layui-icon-close fcc"></span></div>\r\n`);
        html.Append(`</div>\r\n`);
    }
    $("#div_file_area").html(html.ToString());
}

//#endregion

//#region 删除附件
function del_other_file(file_id, cp_id, file_name) {
    layer.confirm(`${get_lan_new_str("确认删除该附件")}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { file_id: file_id }
            let apiurl = APIS.APIS_FILE_UPLOAD.delFile;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                get_other_file_list(cp_id);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )

}
//#endregion

//#region 刷新回到当前页面
function flush_return_now_page(pager_dom, _fun, list_dom, repeat_item, repeat_val) {
    var dq_pageindex = $(`#${pager_dom} .tf_dqpage`).html();
    if (isUndefine(dq_pageindex)) { _fun(1); return; }
    else { _fun(dq_pageindex); };
    if (!isUndefine(repeat_item) && !isUndefine(repeat_val) && !isUndefine(list_dom)) {
        var need_repeat = xw_get_repeat_sel(`${list_dom}`, `${repeat_item}`, repeat_val)
        xw_grid_td_click(need_repeat, `${list_dom}`);
    }
}
//#endregion
