$(document).ready(function () {
    csh_skin();
    csh_UI_word();

    csh_getdata_1();
    csh_getdata_2();
    getdata_1();
});


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

//#region getdata_1
function csh_getdata_1() {
    var colname_temp = ["类型ID", "类型名", "ID"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_left_con").width(),
        height: $(".xw_left_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "type_id", width: 60, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "type_name", width: 150, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "y1_para_type_id", width: 30, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
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
    let JsonPara = {}
    let apiurl = APIS.APIS_SYSTEM_PARAM.getSysTypeList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let json = re_obj.data;
        getdata_1_str(json)
    }
    else {
        layer.alert("查询失败: " + re_obj.msg);
    }
}
let addTypeLength = 0;
function getdata_1_str(json) {
    $("#list_1").gridUnload();
    $("#list_2").gridUnload();
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            $("#list_1").addRowData(i + 1, json[i]);
        }
        addTypeLength = json.length;
    }
}
//#endregion

//#region getdata_2
function csh_getdata_2() {
    var colname_temp = ["ID", "类型ID", "参数1", "参数2", "参数3", "参数4", "排序"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_right_con").width(),
        height: $(".xw_right_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "sys_para_id", width: 60, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: true },
            { name: "type_id", width: 60, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: true },
            { name: "zd_1", width: 120, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "zd_2", width: 120, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "zd_3", width: 120, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "zd_4", width: 120, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "px", width: 80, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
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
    $("#list_2").addGridHead("input_quary_getdata_2");
}
function getdata_2() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let type_id = list_1[0].type_id;
    let zd_1 = $("#txt_head_list_2_zd_1").val();
    let zd_2 = $("#txt_head_list_2_zd_2").val();
    let zd_3 = $("#txt_head_list_2_zd_3").val();
    let zd_4 = $("#txt_head_list_2_zd_4").val();

    let JsonPara = { type_id: type_id, zd_1: zd_1, zd_2: zd_2, zd_3: zd_3, zd_4, zd_4 }
    let apiurl = APIS.APIS_SYSTEM_PARAM.getList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let json = re_obj.data;
        getdata_2_str(json)
    }
    else {
        layer.alert("查询失败: " + re_obj.msg);
    }
}
function getdata_2_str(json) {
    $("#list_2").gridUnload();
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            $("#list_2").addRowData(i + 1, json[i]);
        }
    }

    let t_w_t = ["添加参数", "修改参数", "删除参数"];
    let t_w_g = get_lan_new_xw_colName(t_w_t);
    let json_context = {
        menu_label: [
            { label: t_w_g[t_w_t.indexOf("添加参数")], hd_fun: function () { csh_add_para(); } },
            { label: t_w_g[t_w_t.indexOf("修改参数")], hd_fun: function () { csh_update_para(); } },
            { label: t_w_g[t_w_t.indexOf("删除参数")], hd_fun: function () { csh_del_para(); } },
        ],
        remove_dom_flag: true,
        x_correct: 0,
        y_correct: 0
    }
    $(`#list_2`).xw_context(json_context);
}

function input_quary_getdata_2() {
    $(`input[id^="txt_head_list_2_"]`).on('keyup', function (e) {
        if ($(this).val() == "") {
            getdata_2();
        }
        let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            getdata_2();
        }
    });
}
//#endregion

//#region 添加类型
function csh_add_type() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    // html.Append(`   <div class="widget-wrapper">\r\n`);
    // html.Append(`       <div class="widget-list">\r\n`);
    // html.Append(`               <div class="fx-field x-grid-col-4">
    //                                 <div class="field-label">
    //                                     <div class="field-name">工序名称</div>
    //                                 </div>
    //                                 <div class="field-component">
    //                                     <div class="fx-form-text" style="width: 354px; max-width: 100%;">
    //                                         <div class="x-input x-input-css-var normal-input input-normal">
    //                                             <div class="x-inner-wrapper"><input type="text" class="input-inner" autocomplete="new-password"
    //                                                     value=""></div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>\r\n`);
    // html.Append(`       </div>\r\n`);
    // html.Append(`   </div>\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">类型ID</td>\r\n`);
    html.Append(`           <td><input type="text" id="txt_type_id" value="${addTypeLength + 1}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>类型名称</td>\r\n`);
    html.Append(`           <td><input type="text" id="txt_type_name"/></td>\r\n`);
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
        title: get_lan_new_str("添加类型"),
        area: ["300px", "200px"], // 初始宽高
        // maxmin: true,
        success: function (layero, index) {
            // layer.full(index); // 最大化
            // $(".layui-layer-min").before(`<span onclick="csh_getdata_gd_discuss(); layer.msg('刷新成功');" class="layui-icon layui-icon-refresh" style="font-size: 12px"></span>`)
            $("#btn_submit").on('click', function () {
                add_type(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function add_type(tk_index) {
    let type_id = $("#txt_type_id").val(); if (isUndefine(type_id)) { layer.msg(get_lan_new_str("请输入")); return; }
    let type_name = $(`#txt_type_name`).val(); if (isUndefine(type_name)) { layer.msg(get_lan_new_str("请输入")); return; }
    let JsonPara = { type_id: type_id, type_name: type_name }
    let apiurl = APIS.APIS_SYSTEM_PARAM.addType;
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

//#region 修改类型
function csh_update_type() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">ID</td>\r\n`);
    html.Append(`           <td>${obj.y1_para_type_id}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">类型ID</td>\r\n`);
    html.Append(`           <td><input type="text" id="txt_type_id" value="${obj.type_id}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td>类型名称</td>\r\n`);
    html.Append(`           <td><input type="text" id="txt_type_name" value="${obj.type_name}"/></td>\r\n`);
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
        title: get_lan_new_str("修改类型"),
        area: ["300px", "200px"], // 初始宽高
        // maxmin: true,
        success: function (layero, index) {
            // layer.full(index); // 最大化
            // $(".layui-layer-min").before(`<span onclick="csh_getdata_gd_discuss(); layer.msg('刷新成功');" class="layui-icon layui-icon-refresh" style="font-size: 12px"></span>`)
            $("#btn_submit").on('click', function () {
                update_type(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
        }
    });
}
function update_type(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let y1_para_type_id = list_1[0].y1_para_type_id;

    let type_id = $("#txt_type_id").val(); if (isUndefine(type_id)) { layer.msg(get_lan_new_str("请输入")); return; }
    let type_name = $(`#txt_type_name`).val(); if (isUndefine(type_name)) { layer.msg(get_lan_new_str("请输入")); return; }
    let JsonPara = { type_id: type_id, type_name: type_name, y1_para_type_id: y1_para_type_id }
    let apiurl = APIS.APIS_SYSTEM_PARAM.updateType;
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

//#region 删除类型
function csh_del_type() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let obj = list_1[0];
    let y1_para_type_id = list_1[0].y1_para_type_id;

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.type_name} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { y1_para_type_id: y1_para_type_id }
            let apiurl = APIS.APIS_SYSTEM_PARAM.delType;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                getdata_1();
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion

//#region 2-添加参数
function csh_add_para() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选择一条类型")); return; }
    let type_id = list_1[0].type_id;

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('类型ID')}</td>\r\n`);
    html.Append(`           <td>${type_id}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段1')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_1"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段2')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_2"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段3')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_3"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段4')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_4"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('排序')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_px" value="100"/></td>\r\n`);
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
        title: get_lan_new_str("添加参数"),
        area: ["300px", "300px"], // 初始宽高
        success: function (layero, index) {

            $(`input[data-enter]`).on('keyup', function(e) {
                let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if(key == 13) {
                    e.preventDefault();
                    var currentInput = $(this);
                    var inputs = $('input[data-enter]');
                    var currentIndex = inputs.index(currentInput);
                    var nextIndex = currentIndex + 1;

                    if (nextIndex < inputs.length) {
                        inputs.eq(nextIndex).focus();
                        inputs.eq(nextIndex).select();
                    } else {
                        inputs.eq(0).focus();
                        inputs.eq(nextIndex).select();
                    }
                }
            });

            $("#btn_submit").on('click', function () {
                add_para(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
function add_para(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选择一条类型")); return; }
    let type_id = list_1[0].type_id;

    let zd_1 = $("#txt_zd_1").val(); if (isUndefine(zd_1)) { layer.msg(get_lan_new_str("请输入字段1")); return; }
    let zd_2 = $("#txt_zd_2").val(); if (isUndefine(zd_2)) { layer.msg(get_lan_new_str("请输入字段2")); return; }
    let zd_3 = $("#txt_zd_3").val();
    let zd_4 = $("#txt_zd_4").val();
    let px = $("#txt_px").val();     if (isUndefine(px)) { px = 0; }

    let JsonPara = { type_id: type_id, zd_1: zd_1, zd_2: zd_2, zd_3: zd_3, zd_4: zd_4, px: px }
    let apiurl = APIS.APIS_SYSTEM_PARAM.addPara;
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

//#region 修改参数
function csh_update_para() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选择一条类型")); return; }
    let type_id = list_1[0].type_id;

    let list_2 = xw_get_row("list_2");
    if (list_2.length != 1) { layer.msg(get_lan_new_str("请选择一条参数")); return; }
    let obj = list_2[0];
    
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`   <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('参数ID')}</td>\r\n`);
    html.Append(`           <td>${obj.sys_para_id}</td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段1')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_1" value="${isUndefine(obj.zd_1) ? "" : obj.zd_1}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段2')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_2" value="${isUndefine(obj.zd_2) ? "" : obj.zd_2}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段3')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_3" value="${isUndefine(obj.zd_3) ? "" : obj.zd_3}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('字段4')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_zd_4" value="${isUndefine(obj.zd_4) ? "" : obj.zd_4}"/></td>\r\n`);
    html.Append(`       </tr>\r\n`);
    html.Append(`       <tr>\r\n`);
    html.Append(`           <td style="width: 85px">${get_lan_new_str('排序')}</td>\r\n`);
    html.Append(`           <td><input data-enter type="text" id="txt_px" value="${obj.px}"/></td>\r\n`);
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
        title: get_lan_new_str("添加参数"),
        area: ["300px", "300px"], // 初始宽高
        success: function (layero, index) {

            $(`table[name='mytable'] input[data-enter]`).on('keyup', function(e) {
                let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if(key == 13) {
                    e.preventDefault();
                    var currentInput = $(this);
                    var inputs = $('input[data-enter]');
                    var currentIndex = inputs.index(currentInput);
                    var nextIndex = currentIndex + 1;

                    if (nextIndex < inputs.length) {
                        inputs.eq(nextIndex).focus();
                        inputs.eq(nextIndex).select();
                    } else {
                        inputs.eq(0).focus();
                        inputs.eq(nextIndex).select();
                    }
                }
            });

            $("#btn_submit").on('click', function () {
                update_para(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`table[name='mytable'] input[data-enter]`).off();
        }
    });
}
function update_para(tk_index) {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请选择一条类型")); return; }
    let type_id = list_1[0].type_id;

    let list_2 = xw_get_row("list_2");
    if (list_2.length != 1) { layer.msg(get_lan_new_str("请选择一条参数")); return; }
    let sys_para_id = list_2[0].sys_para_id;

    let zd_1 = $("#txt_zd_1").val(); if (isUndefine(zd_1)) { layer.msg(get_lan_new_str("请输入字段1")); return; }
    let zd_2 = $("#txt_zd_2").val(); if (isUndefine(zd_2)) { layer.msg(get_lan_new_str("请输入字段2")); return; }
    let zd_3 = $("#txt_zd_3").val();
    let zd_4 = $("#txt_zd_4").val();
    let px = $("#txt_px").val();     if (isUndefine(px)) { px = 0; }

    let JsonPara = { type_id: type_id, sys_para_id: sys_para_id,
                     zd_1: zd_1, zd_2: zd_2, zd_3: zd_3, zd_4: zd_4, px: px }
    let apiurl = APIS.APIS_SYSTEM_PARAM.updatePara;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        layer.msg(re_obj.msg);
        layer.close(tk_index);
        var scrollOffset = $("#con_2").scrollTop();
        getdata_2();
        $("#con_2").scrollTop(scrollOffset);

    }
    else {
        layer.alert(re_obj.msg);
    }
}
//#endregion

//#region 删除参数
function csh_del_para() {
    let list_2 = xw_get_row("list_2");
    if (list_2.length != 1) { layer.msg(get_lan_new_str("请只选一条参数")); return; }
    let obj = list_2[0];
    let sys_para_id = list_2[0].sys_para_id;

    layer.confirm(`${get_lan_new_str("确认删除")} ${obj.zd_1} ?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { sys_para_id: sys_para_id }
            let apiurl = APIS.APIS_SYSTEM_PARAM.delPara;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                layer.msg(re_obj.msg);
                var scrollOffset = $("#con_2").scrollTop();
                getdata_2();
                $("#con_2").scrollTop(scrollOffset);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    )
}
//#endregion



