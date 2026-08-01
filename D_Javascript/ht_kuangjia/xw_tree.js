//#region 原型
$.fn.extend({
    xw_stand_tree: function(json, opt_json) {
        this.data("jsonOpt", json);
        this.data("opt_json", opt_json);
        console.log("hello")
        var child_str = opt_json.child_str;
        var html = new StringBuffer();
        var tree_id = $(this).attr("id");
        $(this).attr("aria-activedescendant", "")
        html.Append(`<ul role="group" class="tree_childen">\r\n`);
        for(var i = 0; i<json.length; i++) {
            var area_have_son = false;
            if(isUndefine(json[i][child_str])) {
                area_have_son = false;
            }
            else if (json[i][child_str].length > 0) {
                area_have_son = true;
            }
            if(opt_json.onSelectRow != undefined) {
                sel_row_fun = opt_json.onSelectRow(`${json[i].mn_Id}_${tree_id}`, `${tree_id}`);
            }
            html.Append(`   <li class="tree_node" id="${json[i].mn_Id}_${tree_id}" area-type="${json[i].bl_name}" area-have-son="${area_have_son}" role="treeitem" area-seled="false" area-expend="false" area-level="1">\r\n`);
            html.Append(`       <i onclick="${sel_row_fun}" class="xw_tree_icon" ></i>\r\n`);
            html.Append(`       <a onclick="${sel_row_fun}">${json[i].bl_type}_${json[i].bl_name}</a>\r\n`);
            html.Append(`   </li>\r\n`);
        }
        html.Append(`</ul>\r\n`);
        html.Append(`\r\n`);
        $(this).html(html.ToString());

        for(var i = 0; i<json.length; i++) {
            xw_tree_fh_csh_open(`${json[i].mn_Id}_${tree_id}`, `${tree_id}`)
        }

        xw_tree_csh_icon(tree_id);
        get_more_cp_selet(tree_id);
        
    },
    xw_stand_tree_view: function(json, opt_json) {
        this.data("jsonOpt", json);
        this.data("opt_json", opt_json);
        console.log("hello")
        var child_str = opt_json.child_str;
        var html = new StringBuffer();
        var tree_id = $(this).attr("id");
        $(this).attr("aria-activedescendant", "")
        html.Append(`<ul role="group" class="tree_childen">\r\n`);
        for(var i = 0; i<json.length; i++) {
            var area_have_son = false;
            if(isUndefine(json[i][child_str])) {
                area_have_son = false;
            }
            else if (json[i][child_str].length > 0) {
                area_have_son = true;
            }
            if(opt_json.onSelectRow != undefined) {
                sel_row_fun = opt_json.onSelectRow(`${json[i].mn_Id}_${tree_id}`, `${tree_id}`);
            }
            html.Append(`   <li class="tree_node" id="${json[i].mn_Id}_${tree_id}" area-type="${json[i].bl_name}" area-have-son="${area_have_son}" role="treeitem" area-seled="false" area-expend="false" area-level="1">\r\n`);
            html.Append(`       <i onclick="${sel_row_fun}" class="xw_tree_icon" ></i>\r\n`);
            html.Append(`       <a onclick="${sel_row_fun}">${json[i].bl_type}_${json[i].bl_name}</a>\r\n`);
            html.Append(`   </li>\r\n`);
        }
        html.Append(`</ul>\r\n`);
        html.Append(`\r\n`);
        $(this).html(html.ToString());

        for(var i = 0; i<json.length; i++) {
            xw_tree_fh_csh_open(`${json[i].mn_Id}_${tree_id}`, `${tree_id}`)
        }

        xw_tree_csh_icon(tree_id);
        get_more_cp_selet(tree_id);
        
    },
    xw_tree: function(json, opt_json) {
        this.data("jsonOpt", json)
        this.data("opt_json", opt_json)
        var html = new StringBuffer();
        var tree_id = $(this).attr("id");
        var all_parent = json.filter(p => p.parent == undefined || p.parent == null || p.parent == "#");
        var hh = all_parent.length * 28;
        $(this).attr("aria-activedescendant", "")
        html.Append(`<ul role="group" class="tree_childen">\r\n`);
        // html.Append(`       <div id="${tree_id}_side_line" class="side_line" style="position: absolute; left: 10px; width: .1px; height: ${hh}px; border: .1px dashed #000"></div>\r\n`);
        for(var i = 0; i<all_parent.length; i++) {
            var son_json = json.filter(p => p.parent == all_parent[i].id);
            var area_have_son = false;
            if(son_json.length > 0) {
                area_have_son = true;
            }
            var sel_row_fun = "";
            if(opt_json.onSelectRow != undefined) {
                sel_row_fun = opt_json.onSelectRow(`${tree_id}_${all_parent[i].id}`, `${tree_id}`);
            }
            html.Append(`   <li class="tree_node" id="${tree_id}_${all_parent[i].id}" area-key="${all_parent[i].id}"  area-have-son="${area_have_son}" role="treeitem" area-seled="false" area-expend="false" area-level="1">\r\n`);
            html.Append(`       <i onclick="${sel_row_fun}" class="xw_tree_icon" ></i>\r\n`);
            html.Append(`       <a onclick="${sel_row_fun}">${all_parent[i].text}</a>\r\n`);
            html.Append(`   </li>\r\n`);
        }
        html.Append(`</ul>\r\n`);
        html.Append(`\r\n`);
        $(this).html(html.ToString());

        for(var i = 0; i<all_parent.length; i++) {
            xw_tree_csh_open(`${tree_id}_${all_parent[i].id}`, `${tree_id}`)
        }

        xw_tree_csh_icon(tree_id);
    }
});
//#endregion

//#region 关于图标切换
function xw_tree_csh_icon(tree_id) {
    var tree_dom = "#" + tree_id;
    $(tree_dom).find("li[area-level='1']").each(function() {
        // console.log(this)
        $(this).find("i").removeClass("xw_tree_icon");
        $(this).find("i").removeClass("xw_tree_icon_hide");
    });
    $(tree_dom).find("li[area-expend='true']").each(function() {
        // console.log(this)
        $(this).find("i").addClass("xw_tree_icon_hide");
    });
    $(tree_dom).find("li[area-expend='false']").each(function() {
        // console.log(this)
        $(this).find("i").addClass("xw_tree_icon");
    });
}
//#endregion

//#region 限制两级不通用
function xw_tree_csh_open(dom_id, tree_id) {
    var data_json = $("#" + tree_id).data("jsonOpt");
    var li_dom = "#" + dom_id;
    var dq_id = $(li_dom).attr("area-key");
    var son_json = data_json.filter(p => p.parent == dq_id);
    var level = $(li_dom).attr("area-level");
    var expend_flag = $(li_dom).attr("area-expend");
    var son_flag = $(li_dom).attr("area-have-son");
    if(son_flag == "true") {
        if(expend_flag == "false") {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            $(li_dom).css("height", hei + node_height + "px")
            $(li_dom).attr("area-expend", "true");
            xw_tree_generate_detail_1(dom_id, son_json, tree_id, level);
        }
        else {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            $(li_dom).css("height", node_height + "px")
            $(li_dom).attr("area-expend", "false");
            xw_tree_generate_detail_1(dom_id, son_json, tree_id, level);
        }
    }
}
function xw_tree_open_detail_1(dom_id, tree_id) {
    var data_json = $("#" + tree_id).data("jsonOpt");
    var li_dom = "#" + dom_id;
    var dq_id = $(li_dom).attr("area-key");
    var son_json = data_json.filter(p => p.parent == dq_id);
    var level = $(li_dom).attr("area-level");
    var expend_flag = $(li_dom).attr("area-expend");
    var son_flag = $(li_dom).attr("area-have-son");
    if(son_flag == "true") {
        if(expend_flag == "false") {
            // var sl_dq_h = $(`#${tree_id}_side_line`).css("height").split("px")[0];
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            // var hh = parseFloat(sl_dq_h) + hei;
            $(li_dom).css("height", hei + node_height + "px")
            // $(`#${tree_id}_side_line`).css("height", hh + "px");
            $(li_dom).attr("area-expend", "true");
            xw_tree_generate_detail_1(dom_id, son_json, tree_id, level);
        }
        else {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            // var sl_dq_h = $(`#${tree_id}_side_line`).css("height").split("px")[0];
            var hei = son_json.length * node_height;
            // var hh = parseFloat(sl_dq_h) - hei;
            $(li_dom).css("height", node_height + "px")
            // $(`#${tree_id}_side_line`).css("height", hh + "px");
            $(li_dom).attr("area-expend", "false");
            xw_tree_generate_detail_1(dom_id, son_json, tree_id, level);
        }
    }
    else {

    }
    sel_tree_node(dom_id, tree_id);
    xw_tree_csh_icon(tree_id);
}
function xw_tree_generate_detail_1(dom_id, son_json, tree_id, level) {
    var data_json = $("#" + tree_id).data("jsonOpt");
    var opt_json = $("#" + tree_id).data("opt_json");

    var li_dom = "#" + dom_id;
    var expend_flag = $(li_dom).attr("area-expend");
    level++;
    if(expend_flag == "true") {
        var html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<ul role="group" class="tree_childen">\r\n`);
        for(var i = 0; i< son_json.length; i++) {
            var ss_json = data_json.filter(p => p.parent == son_json[i].id);
            var area_have_son = false;
            if(ss_json.length > 0) {
                area_have_son = true;
            }
            var text_ml = parseFloat($(':root').css('--tree-text-ml').split("px")[0]);
            var line_ml = (parseFloat($(':root').css('--tree-text-ml').split("px")[0]) + level) * level;
            
            var sel_row_fun = "";
            if(opt_json.onSelectRow != undefined) {
                sel_row_fun = opt_json.onSelectRow(`${tree_id}_${son_json[i].id}`, `${tree_id}`);
            }
            // console.log(son_json)
            html.Append(`   <li class="tree_node" id="${tree_id}_${son_json[i].id}" onclick="" area-key="${son_json[i].id.split("_")[1]}" area-have-son="${area_have_son}" role="treeitem" area-seled="false" area-expend="false" area-level="${level}">\r\n`);
            html.Append(`       <i class="xw_tree_icon_son" onclick="${sel_row_fun}" style="margin-left: ${line_ml}px"></i>\r\n`);
            html.Append(`       <a style="margin-left: ${text_ml}px" onclick="${sel_row_fun}">${son_json[i].text}</a>\r\n`);
            html.Append(`   </li>\r\n`);
        }
        html.Append(`</ul>\r\n`);
        $(li_dom).append(html.ToString());
    }
    else {
        xw_tree_all_tree_remove_1(dom_id, tree_id)
        $(li_dom + " ul").remove();
    }
}
function xw_tree_all_tree_remove_1(dom_id, tree_id) {
    var li_dom = "#" + dom_id;
    var li_sons_t = $(li_dom + " ul li[area-have-son='true']");
    var li_sons = [];
    for(var i = 0; i< li_sons_t.length; i++) {
        li_sons.push($(li_sons_t[i]).attr("id"))
    }
    if(li_sons.length > 1) {
        for(var j = 0; j< li_sons.length; j++) {
            xw_tree_all_tree_remove_1(li_sons[j], tree_id)
        }
    }
    else {
        var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
        // var sl_dq_h = $(`#${tree_id}_side_line`).css("height").split("px")[0];
        var num = li_sons.length;
        if(num== 0) {
            num = 1;
        }
        var hei = num * node_height;
        // var hh = parseFloat(sl_dq_h) - hei;
        $(li_dom).css("height", node_height + "px")
        // $(`#${tree_id}_side_line`).css("height", hh + "px");
        $(li_dom + " ul").remove();
    }
    // var son_expend_flag = $(li_dom).attr("area-expend");
    // if(son_expend_flag == "true") {
    //     xw_tree_all_tree_remove
    // }
}
//#endregion

//#region 不同类型页面的许多下拉框
var all_sys_para_json = null;
var zk_T_json = null; var zk_T_select = null;
var zk_cq_json = null; var zk_cq_select = null;
var zk_fj_json = null; var zk_fj_select = null;
var zk_mrjs_json = null; var zk_mrjs_select = null;

var jc_T_json = null; var jc_T_select = null;
var jc_type_json = null; var jc_type_select = null;
var jc_color_json = null; var jc_color_select = null;

var gy_lx_json = null; var gy_lx_select = null;
var bl_T_json = null; var bl_T_select = null;
var bl_yanse_json = null; var bl_yanse_select = null;
var bl_bh_json = null; var bl_bh_select = null;
function get_more_cp_selet(tree_id) {
    var apiurl = "api/cp_para/get_list_by_type_id";
    var list_id = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
    // var list_text = ["工艺类型", "中空充气", "中空封胶", "中空胶深", "中空厚度", "夹胶厚度", "夹胶类型", "夹胶颜色", "玻璃颜色", "玻璃厚度"];
    var JsonPara = { list_id: list_id };
    var re_obj = tf_ajax(JsonPara, apiurl);
    if(re_obj.flag == 1) {
        all_sys_para_json = re_obj.data;
        bind_json_sel(all_sys_para_json, tree_id);
    }
}
function bind_json_sel(json, tree_id) {
    if(json.length <= 0) { return; }

    var tree = `'${tree_id}'`;

    var gy_lx_tmp = json.filter(p => p.cp_para_type_id == "11")
    gy_lx_json = yu_bind_json(gy_lx_tmp);
    gy_lx_select = Create_select(`sel_gy_lx`, gy_lx_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_gy_lx", tree);
    
    var zk_cq_tmp = json.filter(p => p.cp_para_type_id == "12");
    zk_cq_json = yu_bind_json(zk_cq_tmp);
    zk_cq_select = Create_select(`sel_zk_cq`, zk_cq_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_zk_cq", tree);

    var zk_fj_tmp = json.filter(p => p.cp_para_type_id == "13");
    zk_fj_json = yu_bind_json(zk_fj_tmp);
    zk_fj_select = Create_select(`sel_zk_fj`, zk_fj_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_zk_fj", tree);

    var zk_mrjs_tmp = json.filter(p => p.cp_para_type_id == "14");
    zk_mrjs_json = yu_bind_json(zk_mrjs_tmp);
    zk_mrjs_select = Create_select(`sel_zk_mrjs`, zk_mrjs_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_zk_mrjs", tree);

    var zk_T_tmp = json.filter(p => p.cp_para_type_id == "15");
    zk_T_json = yu_bind_json(zk_T_tmp);
    zk_T_select = Create_select(`sel_zk_T`, zk_T_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_zk_T", tree);

    var jc_T_tmp = json.filter(p => p.cp_para_type_id == "16");
    jc_T_json = yu_bind_json(jc_T_tmp);
    jc_T_select = Create_select(`sel_jc_T`, jc_T_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_jc_T", tree);

    var jc_type_json = json.filter(p => p.cp_para_type_id == "17");
    jc_type_json = yu_bind_json(jc_type_json);
    jc_type_select = Create_select(`sel_jc_type`, jc_type_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_jc_type", tree);

    var jc_color_tmp = json.filter(p => p.cp_para_type_id == "18");
    jc_color_json = yu_bind_json(jc_color_tmp);
    jc_color_select = Create_select(`sel_jc_color`, jc_color_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_jc_color", tree);

    var bl_T_tmp = json.filter(p => p.cp_para_type_id == "20");
    bl_T_json = yu_bind_json(bl_T_tmp);
    bl_T_select = Create_select(`sel_bl_T`, bl_T_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_bl_T", tree);

    var bl_yanse_tmp = json.filter(p => p.cp_para_type_id == "19");
    bl_yanse_json = yu_bind_json(bl_yanse_tmp);
    bl_yanse_select = Create_select(`sel_bl_yanse`, bl_yanse_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_bl_yanse", tree);

    var bl_bh_tmp = json.filter(p => p.cp_para_type_id == "19");
    bl_bh_json = yu_bh_bind_json(bl_bh_tmp);
    bl_bh_select = Create_select(`sel_bl_yanse`, bl_bh_json, "para_value", "para_title", -1, { title: '请选择', value: -1 }, "change_bl_yanse", tree);

}
function yu_bind_json(json) {
    if(json.length <= 0) { return []; }
    var new_json = []
    for(var i = 0; i< json.length; i++) {
        var newItem = {
            "para_value": json[i].cp_para_title,
            "para_title": json[i].cp_para_title,
        };
        new_json.push(newItem);
    }
    return new_json;
}
function yu_bh_bind_json(json) {
    if(json.length <= 0) { return []; }
    var new_json = []
    for(var i = 0; i< json.length; i++) {
        var newItem = {
            "para_value": json[i].cp_para_bh,
            "para_title": json[i].cp_para_bh,
        };
        new_json.push(newItem);
    }
    return new_json;
}

function change_gy_lx(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var gy_lx = $("#sel_gy_lx").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.gongyi = gy_lx;
                break;
            }
        }
    }
    else {
        levOne.gongyi = gy_lx;
    }
}
function change_zk_cq(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var zk_cq = $("#sel_zk_cq").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.chongqi = zk_cq;
                break;
            }
        }
    }
    else {
        levOne.chongqi = zk_cq;
    }
}
function change_zk_fj(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var zk_fj = $("#sel_zk_fj").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.fengjiao = zk_fj;
                break;
            }
        }
    }
    else {
        levOne.fengjiao = zk_fj;
    }
}
function change_zk_mrjs(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var zk_mrjs = $("#sel_zk_mrjs").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.jiaoshen = zk_mrjs;
                break;
            }
        }
    }
    else {
        levOne.jiaoshen = zk_mrjs;
    }
}
function change_zk_T(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var zk_T = $("#sel_zk_T").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.T = zk_T;
                break;
            }
        }
    }
    else {
        levOne.T = zk_T;
    }
}
function change_jc_T(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var jc_T = $("#sel_jc_T").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.T = jc_T;
                break;
            }
        }
    }
    else {
        levOne.T = jc_T;
    }
}
function change_jc_type(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var jc_type = $("#sel_jc_type").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.jiaoxing = jc_type;
                console.log(levTow_tmp)
                break;
            }
        }
    }    
    else {
        levOne.jiaoxing = jc_type;
    }
}
function change_jc_color(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var jc_color = $("#sel_jc_color").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.jiaose = jc_color;
                console.log(levTow_tmp)
                break;
            }
        }
    }
    else {
        levOne.jiaose = jc_color;
    }
}
function change_bl_T(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var bl_T = $("#sel_bl_T").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.T = bl_T;
                console.log(levTow_tmp)
                break;
            }
        }
    }
    else {
        levOne.T = bl_T;
    }
}
function change_bl_yanse(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var bl_yanse = $("#sel_bl_yanse").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                // levTow_tmp.cp_name = bl_yanse;
                levTow_tmp.yanse = bl_yanse;
                var pos = -1;
                for(var i = 0; i< bl_yanse_json.length; i++) {
                    if(bl_yanse == bl_yanse_json[i].para_value) { pos = i; }
                }
                if(pos != -1 ) {
                    levTow_tmp.cp_bh = bl_bh_json[pos].para_value;
                    levTow_tmp.ysdm = bl_bh_json[pos].para_value;
                    // console.log(levTow_tmp.cp_bh)
                }
                break;
            }
        }
    }
    else {
        // levOne.cp_name = bl_yanse;
        levOne.yanse = bl_yanse;
        for(var i = 0; i< bl_yanse_json.length; i++) {
            if(bl_yanse == bl_yanse_json[i].para_value) { pos = i; }
        }
        if(pos != -1 ) {
            levOne.cp_bh = bl_bh_json[pos].para_value;
            levOne.ysdm = bl_bh_json[pos].para_value;
            // console.log(levOne.cp_bh)
        }
    }
}
function input_jc_beizhu(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var beizhu = $("#txt_jc_beizhu").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.beizhu = beizhu;
                console.log(levTow_tmp)
                break;
            }
        }
    }
    else {
        levOne.beizhu = beizhu;
    }
}
function input_zk_beizhu(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var beizhu = $("#txt_zk_beizhu").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.beizhu = beizhu;
                console.log(levTow_tmp)
                break;
            }
        }
    }
    else {
        levOne.beizhu = beizhu;
    }
}
function input_bl_beizhu(tree_id) {
    var tree_dom = "#" + tree_id;
    var sel_mn_Id = $(tree_dom).find("li[area-seled='true']").attr("id").split("_")[0];
    var beizhu = $("#txt_bl_beizhu").val();
    var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
    if(isUndefine(levOne)) {
        for(var i = 0; i< send_info_json.content.length; i++) {
            if(isUndefine(send_info_json.content[i].content)) { continue; }
            var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
            if(isUndefine(levTow_tmp)) {
                continue;
            }
            else {
                levTow_tmp.beizhu = beizhu;
                console.log(levTow_tmp)
                break;
            }
        }
    }
    else {
        levOne.beizhu = beizhu;
    }
}
//#endregion

//#region 根据类型进入不同页面, 然后根据已有的json进行初始化
function show_bl_type_page(dom_id, tree_id, div_id) {
    var li_dom = "#" + dom_id;
    var div_dom = "#" + div_id;
    var type_name = $(li_dom).attr("area-type");
    // var html = html + show_bl_type_page_detail(type_name);
    var html = show_bl_type_page_detail(type_name, tree_id);
    $(div_dom).html(html.ToString());
    if(type_name == "半成品") { $(div_dom).html(""); }

    var mn_Id = dom_id.split("_")[0];
    csh_type_page_detail(mn_Id, type_name)
}
function csh_type_page_detail(mn_Id, type_name) {
    var sel_mn_Id = mn_Id;
    if(type_name == "玻璃") {
        var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
        if(isUndefine(levOne)) {
            for(var i = 0; i< send_info_json.content.length; i++) {
                if(isUndefine(send_info_json.content[i].content)) { continue; }
                var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
                if(isUndefine(levTow_tmp)) {
                    continue;
                }
                else {
                    $("#sel_bl_T").val(isUndefine(levTow_tmp.T) ? "-1" : levTow_tmp.T);
                    // $("#sel_bl_yanse").val(isUndefine(levTow_tmp.cp_name) ? "-1" : levTow_tmp.cp_name);
                    $("#sel_bl_yanse").val(isUndefine(levTow_tmp.yanse) ? "-1" : levTow_tmp.yanse);
                    $("#sel_gy_lx").val(isUndefine(levTow_tmp.gongyi) ? "-1" : levTow_tmp.gongyi);
                    $("#txt_bl_beizhu").val(isUndefine(levTow_tmp.beizhu) ? "" : levTow_tmp.beizhu)
                    break;
                }
            }
        }
        else {
            $("#sel_bl_T").val(isUndefine(levOne.T) ? "-1" : levOne.T);
            var a= isUndefine(levOne.yanse) ? "-1" : levOne.yanse;
            console.log(a)
            $("#sel_bl_yanse").val(a);
            $("#sel_gy_lx").val(isUndefine(levOne.gongyi) ? "-1" : levOne.gongyi);
            $("#txt_bl_beizhu").val(isUndefine(levOne.beizhu) ? "" : levOne.beizhu)
        }
    }
    else if(type_name == "夹层") {
        var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
        if(isUndefine(levOne)) {
            for(var i = 0; i< send_info_json.content.length; i++) {
                if(isUndefine(send_info_json.content[i].content)) { continue; }
                var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
                if(isUndefine(levTow_tmp)) {
                    continue;
                }
                else {
                    $("#sel_jc_color").val(isUndefine(levTow_tmp.jiaose) ? "-1" : levTow_tmp.jiaose);
                    $("#sel_jc_type").val(isUndefine(levTow_tmp.jiaoxing) ? "-1" : levTow_tmp.jiaoxing);
                    $("#sel_jc_T").val(isUndefine(levTow_tmp.T) ? "-1" : levTow_tmp.T);
                    $("#txt_jc_beizhu").val(isUndefine(levTow_tmp.beizhu) ? "" : levTow_tmp.beizhu)
                    break;
                }
            }
        }
        else {
            $("#sel_jc_color").val(isUndefine(levOne.jiaose) ? "-1" : levOne.jiaose);
            $("#sel_jc_type").val(isUndefine(levOne.jiaoxing) ? "-1" : levOne.jiaoxing);
            $("#sel_jc_T").val(isUndefine(levOne.T) ? "-1" : levOne.T);
            $("#txt_jc_beizhu").val(isUndefine(levOne.beizhu) ? "" : levOne.beizhu) 
        }
    }
    else if(type_name == "中空") {
        var levOne = send_info_json.content.find(p => p.mn_Id == sel_mn_Id);
        if(isUndefine(levOne)) {
            for(var i = 0; i< send_info_json.content.length; i++) {
                if(isUndefine(send_info_json.content[i].content)) { continue; }
                var levTow_tmp = send_info_json.content[i].content.find(p => p.mn_Id == sel_mn_Id);
                if(isUndefine(levTow_tmp)) {
                    continue;
                }
                else {
                    $("#sel_zk_mrjs").val(isUndefine(levTow_tmp.jiaoshen) ? "-1" : levTow_tmp.jiaoshen);
                    $("#sel_zk_fj").val(isUndefine(levTow_tmp.fengjiao) ? "-1" : levTow_tmp.fengjiao);
                    $("#sel_zk_cq").val(isUndefine(levTow_tmp.chongqi) ? "-1" : levTow_tmp.chongqi);
                    $("#sel_zk_T").val(isUndefine(levTow_tmp.T) ? "-1" : levTow_tmp.T);
                    $("#txt_zk_beizhu").val(isUndefine(levTow_tmp.beizhu) ? "" : levTow_tmp.beizhu)
                    break;
                }
            }
        }
        else {
            $("#sel_zk_mrjs").val(isUndefine(levOne.jiaoshen) ? "-1" : levOne.jiaoshen);
            $("#sel_zk_fj").val(isUndefine(levOne.fengjiao) ? "-1" : levOne.fengjiao);
            $("#sel_zk_cq").val(isUndefine(levOne.chongqi) ? "-1" : levOne.chongqi);
            $("#sel_zk_T").val(isUndefine(levOne.T) ? "-1" : levOne.T);
            $("#txt_zk_beizhu").val(isUndefine(levOne.beizhu) ? "" : levOne.beizhu)
        }
    }
    else {  }
}
function show_bl_type_page_detail(type_name, tree_id) {
    var html = new StringBuffer();
    html.Append(`\r\n`)
    if(type_name == "玻璃") {
        html.Append(`\r\n`);
        html.Append(`<div class="list_cp_xx_page">`)
        html.Append(`   <table class="grid" style="width: 100%">\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width:85px">厚度</td><td clospan="2">${bl_T_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>颜色</td><td clospan="2">${bl_yanse_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>工艺</td><td colspan="8" class="gy_lx_sel">${gy_lx_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>备注</td><td colspan="8"><input id="txt_bl_beizhu" style="width: 100%" onkeyup="input_bl_beizhu('${tree_id}')"/></td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`   </table>\r\n`);
        html.Append(`</div>`)
        return html;
    }
    else if(type_name == "夹层") {
        html.Append(`\r\n`);
        html.Append(`<div class="list_cp_xx_page">`)
        html.Append(`   <table class="grid">\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width: 85px">厚度</td><td>${jc_T_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>类型</td><td>${jc_type_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>颜色</td><td>${jc_color_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>备注</td><td colspan="5"><input id="txt_jc_beizhu" style="width: 100%" onkeyup="input_jc_beizhu('${tree_id}')"/></td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`   </table>\r\n`);
        html.Append(`</div>`)
        return html;
    }
    else if(type_name == "中空") {
        html.Append(`\r\n`);
        html.Append(`<div class="list_cp_xx_page">`)
        html.Append(`   <table class="grid">\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td style="width: 85px">厚度</td><td>${zk_T_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>充气</td><td>${zk_cq_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>封胶</td><td>${zk_fj_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>默认胶深</td><td>${zk_mrjs_select}</td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`       <tr>\r\n`);
        html.Append(`           <td>备注</td><td colspan="7"><input id="txt_zk_beizhu" style="width: 100%" onkeyup="input_zk_beizhu('${tree_id}')"/></td>\r\n`);
        html.Append(`       </tr>\r\n`);
        html.Append(`   </table>\r\n`);
        html.Append(`</div>`)
        return html;
    }
    else { 
        html.Append(`\r\n`);
        return html; 
    }
}
//#endregion

//#region 复合树不通用
function xw_tree_fh_csh_open(dom_id, tree_id) {
    // console.log(dom_id, tree_id)
    var data_json = $("#" + tree_id).data("jsonOpt");
    var opt_json = $("#" + tree_id).data("opt_json");

    var li_dom = "#" + dom_id;
    var dq_id = $(li_dom).attr("area-key");
    // console.log(data_json)
    var mn_Id = dom_id.split("_")[0];
    var child_str = opt_json.child_str;
    var tmp_son_json = data_json.find(p => p.mn_Id == mn_Id);
    var son_json = [];
    if(!isUndefine(tmp_son_json)) {
        var son_json = data_json.find(p => p.mn_Id == mn_Id)[child_str];
    }
    var level = $(li_dom).attr("area-level");
    // console.log(level)
    var expend_flag = $(li_dom).attr("area-expend");
    var son_flag = $(li_dom).attr("area-have-son");
    if(son_flag == "true") {
        if(expend_flag == "false") {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            $(li_dom).css("height", hei + node_height + "px")
            $(li_dom).attr("area-expend", "true");
            xw_tree_fh_generate_detail_1(dom_id, son_json, tree_id, level);
        }
        else {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            $(li_dom).css("height", node_height + "px")
            $(li_dom).attr("area-expend", "false");
            xw_tree_fh_generate_detail_1(dom_id, son_json, tree_id, level);
        }
    }
}
function xw_tree_fh_open_detail_1(dom_id, tree_id) {
    // get_more_cp_selet();

    var data_json = $("#" + tree_id).data("jsonOpt");
    var opt_json = $("#" + tree_id).data("opt_json");
    var li_dom = "#" + dom_id;
    var dq_id = $(li_dom).attr("area-key");
    // console.log(data_json)
    var mn_Id = dom_id.split("_")[0];
    var child_str = opt_json.child_str;
    var tmp_son_json = data_json.find(p => p.mn_Id == mn_Id);
    var son_json = [];
    if(!isUndefine(tmp_son_json)) {
        var son_json = data_json.find(p => p.mn_Id == mn_Id)[child_str];
    }
    var level = $(li_dom).attr("area-level");
    // console.log(level)
    var expend_flag = $(li_dom).attr("area-expend");
    var son_flag = $(li_dom).attr("area-have-son");
    if(son_flag == "true") {
        if(expend_flag == "false") {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            $(li_dom).css("height", hei + node_height + "px")
            $(li_dom).attr("area-expend", "true");
            xw_tree_fh_generate_detail_1(dom_id, son_json, tree_id, level);
        }
        else {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            $(li_dom).css("height", node_height + "px")
            $(li_dom).attr("area-expend", "false");
            xw_tree_fh_generate_detail_1(dom_id, son_json, tree_id, level);
        }
    }
    else {

    }
    sel_tree_node(dom_id, tree_id);
    xw_tree_csh_icon(tree_id);
    // show_bl_type_page(dom_id, "list_4");
}
function xw_tree_fh_generate_detail_1(dom_id, son_json, tree_id, level) {
    // console.log("hihi")
    var data_json = $("#" + tree_id).data("jsonOpt");
    var opt_json = $("#" + tree_id).data("opt_json");

    var li_dom = "#" + dom_id;
    var expend_flag = $(li_dom).attr("area-expend");
    level++;
    if(expend_flag == "true") {
        var html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<ul role="group" class="tree_childen">\r\n`);
        for(var i = 0; i< son_json.length; i++) {
            var ss_json = data_json.filter(p => p.parent == son_json[i].id);
            var area_have_son = false;
            if(ss_json.length > 0) {
                area_have_son = true;
            }
            var text_ml = parseFloat($(':root').css('--tree-text-ml').split("px")[0]);
            var line_ml = (parseFloat($(':root').css('--tree-text-ml').split("px")[0]) + level) * level;
            
            var sel_row_fun = "";
            if(opt_json.onSelectRow != undefined) {
                sel_row_fun = opt_json.onSelectRow(`${son_json[i].mn_Id}_${tree_id}`, `${tree_id}`);
            }
            // console.log(son_json[i])
            html.Append(`   <li class="tree_node" id="${son_json[i].mn_Id}_${tree_id}" area-type="${son_json[i].bl_name}" onclick="" area-key="${son_json[i].mn_Id}" area-have-son="${area_have_son}" role="treeitem" area-seled="false" area-expend="false" area-level="${level}">\r\n`);
            html.Append(`       <i class="xw_tree_icon_son" onclick="${sel_row_fun}" style="margin-left: ${line_ml}px"></i>\r\n`);
            html.Append(`       <a style="margin-left: ${text_ml}px" onclick="${sel_row_fun}">${son_json[i].bl_type}_${son_json[i].bl_name}</a>\r\n`);
            html.Append(`   </li>\r\n`);
        }
        html.Append(`</ul>\r\n`);
        $(li_dom).append(html.ToString());
    }
    else {
        xw_tree_all_tree_remove_1(dom_id, tree_id)
        $(li_dom + " ul").remove();
    }
}
function xw_tree_all_tree_remove_1(dom_id, tree_id) {
    var li_dom = "#" + dom_id;
    var li_sons_t = $(li_dom + " ul li[area-have-son='true']");
    var li_sons = [];
    for(var i = 0; i< li_sons_t.length; i++) {
        li_sons.push($(li_sons_t[i]).attr("id"))
    }
    if(li_sons.length > 1) {
        for(var j = 0; j< li_sons.length; j++) {
            xw_tree_all_tree_remove_1(li_sons[j], tree_id)
        }
    }
    else {
        var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
        var num = li_sons.length;
        if(num== 0) {
            num = 1;
        }
        var hei = num * node_height;
        $(li_dom).css("height", node_height + "px")
        $(li_dom + " ul").remove();
    }
}
//#endregion

//#region 多级
function xw_tree_open_detail_2(dom_id, tree_id) {
    var data_json = $("#" + tree_id).data("jsonOpt");
    var li_dom = "#" + dom_id;
    var dq_id = $(li_dom).attr("area-key");
    var son_json = data_json.filter(p => p.parent == dq_id);
    var level = $(li_dom).attr("area-level");
    var expend_flag = $(li_dom).attr("area-expend");
    var son_flag = $(li_dom).attr("area-have-son");
    if(son_flag == "true") {
        if(expend_flag == "false") {
            // var sl_dq_h = $(`#${tree_id}_side_line`).css("height").split("px")[0];
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            var hei = son_json.length * node_height;
            // var hh = parseFloat(sl_dq_h) + hei;
            $(li_dom).css("height", hei + node_height + "px")
            // $(`#${tree_id}_side_line`).css("height", hh + "px");
            $(li_dom).attr("area-expend", "true");
            xw_tree_generate_detail_2(dom_id, son_json, tree_id, level);
        }
        else {
            var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
            // var sl_dq_h = $(`#${tree_id}_side_line`).css("height").split("px")[0];
            var hei = son_json.length * node_height;
            // var hh = parseFloat(sl_dq_h) - hei;
            $(li_dom).css("height", node_height + "px")
            // $(`#${tree_id}_side_line`).css("height", hh + "px");
            $(li_dom).attr("area-expend", "false");
            xw_tree_generate_detail_2(dom_id, son_json, tree_id, level, json);
        }
    }
    else {

    }
}
function xw_tree_generate_detail_2(dom_id, son_json, tree_id, level) {
    var data_json = $("#" + tree_id).data("jsonOpt");

    var li_dom = "#" + dom_id;
    var expend_flag = $(li_dom).attr("area-expend");
    level++;
    if(expend_flag == "true") {
        var html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<ul role="group" class="tree_childen">\r\n`);
        for(var i = 0; i< son_json.length; i++) {
            var ss_json = data_json.filter(p => p.parent == son_json[i].id);
            var area_have_son = false;
            if(ss_json.length > 0) {
                area_have_son = true;
            }
            var text_ml = parseFloat($(':root').css('--tree-text-ml').split("px")[0]);
            var line_ml = (parseFloat($(':root').css('--tree-text-ml').split("px")[0]) + level) * level;
            // console.log(son_json[i]);
            html.Append(`   <li class="tree_node" id="${tree_id}_${son_json[i].id}" area-jg="${son_json[i].jg_id}" onclick="" area-have-son="${area_have_son}" role="treeitem" area-seled="false" area-expend="false" area-level="${level}">\r\n`);
            html.Append(`       <i class="xw_tree_icon_son" onclick="xw_tree_open_detail('${son_json[i].id}', '${tree_id}')" style="margin-left: ${line_ml}px"></i>\r\n`);
            html.Append(`       <a style="margin-left: ${text_ml}px" onclick="xw_tree_open_detail('${son_json[i].id}', '${tree_id}')">${son_json[i].text}</a>\r\n`);
            html.Append(`   </li>\r\n`);
        }
        html.Append(`</ul>\r\n`);
        $(li_dom).append(html.ToString());
    }
    else {
        xw_tree_all_tree_remove_2(dom_id, tree_id)
        $(li_dom + " ul").remove();
    }
}
function xw_tree_all_tree_remove_2(dom_id, tree_id) {
    var li_dom = "#" + dom_id;
    var li_sons_t = $(li_dom + " ul li[area-have-son='true']");
    var li_sons = [];
    for(var i = 0; i< li_sons_t.length; i++) {
        li_sons.push($(li_sons_t[i]).attr("id"))
    }
    if(li_sons.length > 1) {
        for(var j = 0; j< li_sons.length; j++) {
            xw_tree_all_tree_remove_2(li_sons[j], tree_id)
        }
    }
    else {
        var node_height = parseFloat($(':root').css('--tree-node-height').split("px")[0]);
        // var sl_dq_h = $(`#${tree_id}_side_line`).css("height").split("px")[0];
        var num = li_sons.length;
        if(num== 0) {
            num = 1;
        }
        var hei = num * node_height;
        // var hh = parseFloat(sl_dq_h) - hei;
        $(li_dom).css("height", node_height + "px")
        // $(`#${tree_id}_side_line`).css("height", hh + "px");
        $(li_dom + " ul").remove();
    }
    // var son_expend_flag = $(li_dom).attr("area-expend");
    // if(son_expend_flag == "true") {
    //     xw_tree_all_tree_remove
    // }
}
//#endregion

//#region 获取当前所选
function sel_tree_node(dom_id, tree_id) {
    var tree_dom = "#" + tree_id;
    $(tree_dom).find("li").each(function() {
        $(this).removeClass("tree_selected");
        $(this).attr("area-seled", "false");
    });
    // $(tree_dom).find("li [area-seled='true']").each(function() {
    //     $(this).attr("area-seled", "false");
    // });
    var li_dom = "#" + dom_id;
    var seled_flag = $(li_dom).attr("area-seled");
    if(!$(li_dom).hasClass("tree_selected") && seled_flag == "false") {
        $(li_dom).addClass("tree_selected");
        $(li_dom).attr("area-seled", "true");
    }
    else {
        $(li_dom).removeClass("tree_selected");
        $(li_dom).attr("area-seled", "false");
    }
    
}
function xw_get_tree_lev(tree_id, lev) {
    var dom_tree = "#" + tree_id;
    var all_info_json = [];
    $(dom_tree).find(`[area-level='${lev}']`).each(function() {
        var obj = {}
        if($(this).attr("area-seled") == "true") {
            obj.id = $(this).attr("area-key");
            obj.text = $(this).find("a").text();
            all_info_json.push(obj)
        }
    });
    return all_info_json;
}

function xw_get_tree_seled(tree_id) {

}
//#endregion

