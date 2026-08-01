function xz_yonghu(callback,dom_id,dom_title, type) {
    var yh_json=null;
    var bm_json=null;
    var re_obj_1 = tf_ajax({}, "api/yonghu/get_all");
    if (re_obj_1.flag == 1) { yh_json = re_obj_1.data; }

    var re_obj_2 = tf_ajax({}, "api/bumen/get_all");
    if (re_obj_2.flag == 1) { bm_json = re_obj_2.data; }
    if (bm_json.length > 0) {
        var html = new StringBuffer;

        html.Append("    <div class=\"cz_title\"><span>请选择用户</span><i class=\"fa fa-times-circle fa-lg\"  onclick=\"un_tk_3();\"></i></div>\r\n");
        html.Append("    <div class=\"cz_con\">\r\n");
        html.Append("    <div id=\"xz_yh_div\" class=\"xm_node_set\">\r\n");
        for (var i = 0; i < bm_json.length; i++) {
            html.Append("<h1><label>" + bm_json[i].bm_title + "</label><i class=\"fa fa-angle-right\"></i></h1>\r\n");
            var bm_id = bm_json[i].bm_id;
            var qx_yh_list = yh_json.filter(p => p.bm_id == bm_id);
            html.Append("<div>\r\n");
            if (qx_yh_list.length > 0) {
                html.Append("<table>");
                for (var j = 0; j < qx_yh_list.length; j++) {
                    html.Append("<tr style=\"cursor:pointer;\" onclick=\"" + callback + "(" + qx_yh_list[j].yh_id + ",'" + qx_yh_list[j].name + "','" + dom_id + "','" + dom_title + "'," + type + ");\">\r\n");
                    html.Append("<td style=\"width:25%\">" + qx_yh_list[j].name + "</td>\r\n");
                    html.Append("<td style=\"width:25%\">" + qx_yh_list[j].tel + "</td>\r\n");
                    html.Append("<td style=\"width:25%\">" + qx_yh_list[j].zhiwei + "</td>\r\n");
                    html.Append("<td style=\"width:25%\">" + get_yh_zt(qx_yh_list[j].yh_zt) + "</td>\r\n");
                    html.Append("</tr>\r\n");
                }
                html.Append("</table>");
            }
            else {
                html.Append("<table><tr><td colspan=\"4\">该部门暂无人员</td></tr></table>");
            }
            html.Append("</div>\r\n");
        }
        html.Append("    </div>\r\n");
        html.Append("</div>\r\n");
        tk_3(html.ToString());
        loadxz_yonghu();
    }
}

function loadxz_yonghu() {
    $("#xz_yh_div h1").click(function () {
        var ul_obj = $(this).next("div");
        if (ul_obj.css("display") != "block") {
            ul_obj.slideToggle("slow").siblings("div").slideUp("fast");
            $("#xz_yh_div h1 i").each(function () { this.className = "fa fa-angle-right "; })
            $(this).find("i")[0].className = "fa fa-angle-down";
        }
        else {
            ul_obj.slideToggle("slow").siblings("div").slideUp("fast");
            $(this).find("i")[0].className = "fa fa-angle-right ";
        }
    });
}

//#region 回调函数

//#region 搜索专用
function ss_zy(id,name,dom_id,dom_title,type) { 
    $("#"+dom_id).val(id);
    $("#"+dom_title).html(name);
    un_tk_3();
};
//#endregion 

//#region 客户页面分配客户用
function fp_kh(id,name,dom_id,dom_title,type) { 
    var list=get_row("list_1");
    if (list.length == 0) { Toast("请选择一个客户");return;}
    else if(list.length>1){ Toast("只能选择一个客户");return;}
    var kh_id=list[0].kh_id;
    var JsonPara = {type:type, kh_id:kh_id,yh_id:id,name:name };
    var apiurl = "api/kehu/fp_kh";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 客户页面批量分配客户用
function pl_fp_kh(id,name,dom_id,dom_title,type) { 
    var sheng = $("#sel_tt_sheng").val(); if (sheng == "-1") { Toast("省市县，最少需要选择一级");return;}
    var shi = $("#sel_tt_shi").val();
    var xian = $("#sel_tt_xian").val();
    var JsonPara = {type:type, sheng:sheng,shi:shi,xian:xian, yh_id:id,name:name };
    var apiurl = "api/kehu/pl_fp_kh";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 供应商页面分配客户用
function fp_gys(id,name,dom_id,dom_title,type) { 
    var list=get_row("list_1");
    if (list.length == 0) { Toast("请选择一个供应商");return;}
    else if(list.length>1){ Toast("只能选择一个供应商");return;}
    var gys_id=list[0].gys_id;
    var JsonPara = {type:type, gys_id:gys_id,yh_id:id,name:name };
    var apiurl = "api/gys/fp_gys";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 供应商页面批量分配客户用
function pl_fp_gys(id,name,dom_id,dom_title,type) { 
    var sheng = $("#sel_tt_sheng").val(); if (sheng == "-1") { Toast("省市县，最少需要选择一级");return;}
    var shi = $("#sel_tt_shi").val();
    var xian = $("#sel_tt_xian").val();
    var JsonPara = {type:type, sheng:sheng,shi:shi,xian:xian, yh_id:id,name:name };
    var apiurl = "api/gys/pl_fp_gys";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 设置订单归属人
function set_ht_gsr(id,name,dom_id,dom_title,type) { 
    var list=get_row("list_1");
    if (list.length == 0) { Toast("请选择一条数据"); return; }
    if (list.length >1) { Toast("只能选择一条数据"); return; }
    var ht_id=list[0].ht_id
    var JsonPara = {ht_id:ht_id,yh_id:id,name:name };
    var apiurl = "api/ht_dd/set_gsr";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        getdata_1(1);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 设置项目任务负责人
function set_xmrw_fzr(id,name,dom_id,dom_title,type) { 
    var list = get_row("list_2");
    if (list.length == 0) { Toast("请选择一个项目任务"); return; }
    else if (list.length > 1) { Toast("只能选择一个项目任务"); return; }
    var xm_rw_id = list[0].xm_rw_id;
    var JsonPara = {xm_rw_id:xm_rw_id,yh_id:id,name:name };
    var apiurl = "api/xm/set_xmrw_fzr";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        $("#"+dom_title).html(name);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 设置项目任务审核人
function set_xmrw_shr(id,name,dom_id,dom_title,type) { 
    var list = get_row("list_2");
    if (list.length == 0) { Toast("请选择一个项目任务"); return; }
    else if (list.length > 1) { Toast("只能选择一个项目任务"); return; }
    var xm_rw_id = list[0].xm_rw_id;
    var JsonPara = {xm_rw_id:xm_rw_id,sh_xl:type, yh_id:id,name:name };
    var apiurl = "api/xm/set_xmrw_shr";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        $("#"+dom_title).html(name);
        Toast(re_obj.msg);
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 设置方案负责人
function set_fzr_fa(id,name,dom_id,dom_title,type) { 
    var fzr_fa_con_id = type;
    var JsonPara = {fzr_fa_con_id:fzr_fa_con_id,fzr_id:id,fzr_name:name };
    var apiurl = "api/fzr_and_shr_fa/set_fzr_fa";
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 1) {
        Toast(re_obj.msg);
        get_fa_con();
        un_tk_3();
    }
    else { 
        Toast(re_obj.msg);
    }
};
//#endregion 

//#region 设置方案审核人
function set_shr_dom(id,name,dom_id,dom_title,type) { 
    $("#"+dom_id).val(id);
    $("#"+dom_title).html(name); 
    un_tk_3();
};
//#endregion 
//#endregion 