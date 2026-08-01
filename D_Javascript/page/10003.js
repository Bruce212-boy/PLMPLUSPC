$(document).ready(function () {
    csh_skin();
    csh_UI_word();
    get_para();
    csh_getdata_1();
    getdata_1(1);
});


$(function () {
    $(window).resize(function () {
        $("#list_1").setGridWid($(".xw_left_con").width() - 14);
        $("#list_2").setGridWid($(".xw_right_con").width() - 14);
    });
});

//#region get_para
var zt_json = null; var zt_id_select = null;
function get_para() {
    zt_json = [{ "para_title": "待审核", "para_value": "0" }, { "para_title": "审核通过", "para_value": "1" }, { "para_title": "审核失败", "para_value": "2" }];
    zt_json = get_lan_select_para_json(zt_json, "para_title");
    zt_id_select = Create_select("sel_zt_id", zt_json, "para_value", "para_title", -1, { title: get_lan_new_str("请选择"), value: -1 });
}
function get_select_name(temp, list, key_val, key_title) {
    if (isUndefine(list) || list.length == 0) { return temp; }
    let result = "";
    let temp_int = parseInt(temp);
    var p_obj = list.find(p => p[key_val] == temp_int);
    if (p_obj != null) { result = p_obj[key_title]; }
    return result;
}
function set_format_time_2(val) {
    var ftime = formartTime("yyyy-MM-dd HH:mm:ss", val)
    return ftime;
}
function set_ok(val) {
    if (val == 1) {
        return `<div class="sh_pass_1" style="height: var(--xw-grid-tr-height); line-height: var(--xw-grid-tr-height); color: #000; width: 100%; border: none">${get_select_name(val, zt_json, "para_value", "para_title")}</div>`;
    }
    else {
        return `<div class="sh_pass_2" style="height: var(--xw-grid-tr-height); line-height: var(--xw-grid-tr-height); color: #000; width: 100%; border: none">${get_select_name(val, zt_json, "para_value", "para_title")}</div>`;
    }
}
//#endregion

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
    var colname_temp = ["ID", "用户名", "名字", "机器代码", "状态", "申请时间", "审核人", "审核时间"];
    var colnames = get_lan_new_xw_colName(colname_temp);
    var json_th = {
        width: $(".xw_left_con").width(),
        height: $(".xw_left_con").height() - 10,
        colNames: colnames,
        colModel: [
            { name: "sq_id", width: 50, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "username", width: 100, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "name", width: 100, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "code_type", width: 80, tail_allow: false, edit_flag: false, edit: "input", align: "center", formatter: "", hidden: false },
            { name: "zt_id", width: 100, tail_allow: false, edit_flag: false, edit: "select", align: "center", hidden: false, editoptions: { values: set_jqg_select(zt_json, "para_title", "para_val") }, formatter: function (val, a, b, rowData) { return set_ok(val); } },
            { name: "shr_name", width: 100, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: "", hidden: false },
            { name: "sq_time", width: 150, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: function (val) { return set_format_time_2(val); }, hidden: false },
            { name: "sh_time", width: 150, tail_allow: false, edit_flag: false, edit: "none", align: "center", formatter: function (val) { return set_format_time_2(val); }, hidden: false },

        ],
        onSelectRow: function (dom_td_id, dom_tr_id, dom_list_id) {
            xw_grid_td_click(dom_td_id, dom_list_id);
            // getdata_2();
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
    $("#list_1").addGridHead("input_quary_getdata_1");
}
function getdata_1(pageindex) {

    let username = $("#txt_head_list_1_username").val();
    let name = $("#txt_head_list_1_name").val();
    let code_type = $("#txt_head_list_1_code_type").val();
    let zt_id = $("#sel_head_list_1_zt_id").val();

    let JsonPara = { username: username, name: name, code_type: code_type, zt_id: zt_id, pageindex: pageindex, pagesize: 20 }
    let apiurl = APIS.APIS_ADUIT_MACHINE.getAduitList;
    let re_obj = tf_ajax(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        let json = re_obj.data;
        if (json.length > 0) {
            getdata_1_str(json);
            var pager_str = get_pager(pageindex, 20, re_obj.totle, "getdata_1");
            $("#pager_1").html(pager_str);
        }
    }
    else {
        layer.alert("查询失败: " + re_obj.msg);
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
}
//#endregion

//#region 审核通过/不通过
function aduit_pass() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let sq_id = list_1[0].sq_id;

    layer.confirm(`${get_lan_new_str("是否审核通过")}: ${sq_id}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { sq_id: sq_id, zt_id: 1 }
            let apiurl = APIS.APIS_ADUIT_MACHINE.setAduitMachine;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                flush_return_now_page("pager_1", getdata_1, "list_1", "sq_id", sq_id);
                layer.msg(re_obj.msg);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );

}
function aduit_rej() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let sq_id = list_1[0].sq_id;

    layer.confirm(`${get_lan_new_str("是否审核失败")}: ${sq_id}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { sq_id: sq_id, zt_id: 2 }
            let apiurl = APIS.APIS_ADUIT_MACHINE.setAduitMachine;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                flush_return_now_page("pager_1", getdata_1, "list_1", "sq_id", sq_id);
                layer.msg(re_obj.msg);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );


}
//#endregion

//#region 删除申请
function csh_del_aduit() {
    let list_1 = xw_get_row("list_1");
    if (list_1.length != 1) { layer.msg(get_lan_new_str("请只选一条")); return; }
    let sq_id = list_1[0].sq_id;

    layer.confirm(`${get_lan_new_str("确认删除该申请")}: ${sq_id}?`,
        { btn: [`${get_lan_new_str('确认')}`, `${get_lan_new_str("取消")}`] },
        () => {
            let JsonPara = { sq_id: sq_id }
            let apiurl = APIS.APIS_ADUIT_MACHINE.delMachine;
            let re_obj = tf_ajax(JsonPara, apiurl)
            if (re_obj.flag == 1) {
                flush_return_now_page("pager_1", getdata_1);
                layer.msg(re_obj.msg);
            }
            else {
                layer.alert(re_obj.msg);
            }
        },
    );
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


