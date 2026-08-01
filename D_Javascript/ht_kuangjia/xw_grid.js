//#region 原型
$.fn.extend({
    // 添加一个新的方法 myfun
    xwgrid: function (json) {
        // 序号
        json.posNum = 1;
        this.data("jsonOpt", json)

        var colNames = deepClone(json.colNames);
        var colModel = deepClone(json.colModel);
        if (colNames.length != colModel.length) { alert("不行"); return; }
        // $(this).css("width", json.width + "px");
        $(this).css("height", json.height + "px");
        var ww = $(this).width();
        var prolong = 0;
        colModel.map(p => prolong += p.width)
        if (prolong > ww - 20) {
            $(this).css("width", prolong + "px");
        }
        var xw_grid_dom_id = this[0].id;
        var html = new StringBuffer();
        html.Append(`\r\n`);
        //th
        //td
        html.Append(`<div id="${xw_grid_dom_id}_contain" style="float:left; height: ${json.height}px" >\r\n`);
        html.Append(`   <table id="${xw_grid_dom_id}_table_tb" xw-grid-el="tb" class="grid_all grid_tbody" style="width: 0px;table-layout: fixed;" >\r\n`);
        html.Append(`       <tbody>\r\n`);
        html.Append(`           <tr id="0_${xw_grid_dom_id}_tr_0" class="xw_grid_th" px="0">\r\n`);
        html.Append(`               <td id="0_${xw_grid_dom_id}_th_sel_all" td-name="th_sel_all" class="xw_grid_th_sel_all" px="0" onclick="xw_grid_sel_all('${xw_grid_dom_id}')"></td>`)
        for (var i = 0; i < colNames.length; i++) {
            var xw_grid_td_hidden = colModel[i].hidden;
            if (xw_grid_td_hidden == undefined || xw_grid_td_hidden == null || xw_grid_td_hidden == "" || xw_grid_td_hidden == "false") {
                html.Append(`           <td align="center" id="0_${xw_grid_dom_id}_th_${colModel[i].name}_${i}" xw-grid-el="th" class="xw_grid_th_td" td-name="${colModel[i].name}" px="0" style="width: ${colModel[i].width}px">${colNames[i]}</td>\r\n`);
            }
            else {
                html.Append(`           <td align="center" id="0_${xw_grid_dom_id}_th_${colModel[i].name}_${i}" xw-grid-el="th" class="xw_grid_th_td xw_grid_td_hid" td-name="${colModel[i].name}" px="0" style="width: 0px"></td>\r\n`);
            }
        }
        html.Append(`           </tr>\r\n`);
        html.Append(`       </tbody>\r\n`);
        html.Append(`   </table>\r\n`);
        html.Append(`</div>\r\n`);
        this.html(html.ToString());
        var dom_hid_tr = "#" + xw_grid_dom_id + "_tr_0";
        return this;
    },
    addRowData: function (rowIndex, rowData) {
        if (rowData == undefined || rowData == null) { return; }
        var opt_json = this.data("jsonOpt");
        var xw_grid_dom_id = this[0].id;  // list_1

        // console.log("test", rowIndex, xw_grid_dom_id);
        var xw_grid_dom_tr_id = `${rowIndex}_${xw_grid_dom_id}_tr`;  // 当前行的id

        var haven_th_keys_json = [];
        var xw_grid_json = [];
        var be_xw_grid_flag = true;
        var html = new StringBuffer();
        var xw_grid_dom_tb = "#" + xw_grid_dom_id + "_table_tb"
        // 先从th里面找td-name, 形成列表
        $(xw_grid_dom_tb).find("[xw-grid-el='th']").each(function () {
            var xw_grid_now_key = $(this).attr("td-name");

            var xw_grid_have_key_flag = containsKey(rowData, xw_grid_now_key)
            if (xw_grid_have_key_flag) {
                haven_th_keys_json.push(xw_grid_now_key);
                xw_grid_json.push(rowData[xw_grid_now_key])
            }
            else {
                // be_xw_grid_flag = false;
                haven_th_keys_json.push(xw_grid_now_key);
                xw_grid_json.push("");
                // return false;
            }
        });
        // if(!be_xw_grid_flag || haven_th_keys_json.length != xw_grid_json.length) { console.log(`无法生成表格 ${xw_grid_dom_id} 的第：${rowIndex} 行，有缺失字段`); return; }

        html.Append(`<tr id="${rowIndex}_${xw_grid_dom_id}_tr" class="xw_grid_tr" xw-grid-el="tr" sel-flag="false" px="${rowIndex}">\r\n`);

        // 开启序号
        var serNumber = opt_json.serNumber;
        if (serNumber != undefined && serNumber != null && serNumber == true) {
            html.Append(`    <td id="${rowIndex}_${xw_grid_dom_id}_sel_one" xw-grid-el="td_sel_con" class="xw_grid_td_sel_one" onclick="xw_grid_sel_one('${rowIndex}_${xw_grid_dom_id}', '${xw_grid_dom_id}')" px="${rowIndex}">${opt_json.posNum}</td>`)
            opt_json.posNum++;
        }
        else {
            html.Append(`    <td id="${rowIndex}_${xw_grid_dom_id}_sel_one" xw-grid-el="td_sel_con" class="xw_grid_td_sel_one" onclick="xw_grid_sel_one('${rowIndex}_${xw_grid_dom_id}', '${xw_grid_dom_id}')" px="0"></td>`)
        }
        for (var i = 0; i < haven_th_keys_json.length; i++) {
            var xw_grid_key = haven_th_keys_json[i];
            var xw_grid_align_attr = opt_json.colModel[i].align;
            var xw_grid_td_edit = opt_json.colModel[i].edit;
            var xw_grid_td_hidden = opt_json.colModel[i].hidden;
            var xw_grid_td_classes = opt_json.colModel[i].classes;

            var fun_format = opt_json.colModel[i].formatter;
            var dom_td_id_csh = `${rowIndex}_${xw_grid_dom_id}_${xw_grid_key}`;
            var dom_list_id_csh = `${xw_grid_dom_id}`;

            var sel_row_fun = ``;
            // if(opt_json.onSelectRow != undefined) {
            //     sel_row_fun = opt_json.onSelectRow(`${dom_td_id_csh}`, `${rowIndex}_${xw_grid_dom_id}`,`${dom_list_id_csh}`, `${rowData}`, `${rowIndex}`);
            // }
            if (xw_grid_td_hidden == undefined || xw_grid_td_hidden == null || xw_grid_td_hidden == "" || xw_grid_td_hidden == "false") {
                var val = rowData[xw_grid_key];
                if (val == null || val == "null") { val = ""; }
                if (val != null || val != "null") {
                    var val_t = val + "";
                    if (val_t.indexOf("https") >= 0 || val_t.indexOf("http") >= 0) {
                        val = `<img src="${val}" style="width: 30px; height: 30px;" />`
                    }
                }
                if (isUndefine(xw_grid_td_classes)) { xw_grid_td_classes = ""; }
                html.Append(`<td area-des="${rowIndex}_${xw_grid_dom_id}_${xw_grid_key}" class="xw_grid_td ${xw_grid_td_classes}" td-name="${xw_grid_key}" xw-grid-el="td" td-val="${rowData[xw_grid_key]}" sel-flag="false" onclick="${sel_row_fun}" align="${xw_grid_align_attr}" px="${rowIndex}">${val}</td>\r\n`)
            }
            else {
                html.Append(`<td area-des="${rowIndex}_${xw_grid_dom_id}_${xw_grid_key}" class="xw_grid_td xw_grid_td_hid" td-name="${xw_grid_key}" xw-grid-el="td" td-val="${rowData[xw_grid_key]}" sel-flag="false" onclick="xw_grid_td_click('${rowIndex}_${xw_grid_dom_id}_${xw_grid_key}', '${xw_grid_dom_id}');" align="${xw_grid_align_attr}" px="${rowIndex}"></td>\r\n`)
            }
        }
        html.Append(`</tr>\r\n`);
        $(xw_grid_dom_tb).append(html.ToString());

        for (var i = 0; i < haven_th_keys_json.length; i++) {
            var xw_grid_key = haven_th_keys_json[i];
            var fun_format = opt_json.colModel[i].formatter;
            // console.log(fun_format)
            var xw_grid_td_classes = opt_json.colModel[i].classes;
            var xw_grid_align_attr = opt_json.colModel[i].align;
            var val = rowData[xw_grid_key];
            if (fun_format != "" && fun_format != "undefined" && fun_format != undefined && fun_format != null) {
                var a = fun_format(val, xw_grid_dom_tr_id, xw_grid_dom_id, rowData, rowIndex)
                if (isUndefine(xw_grid_td_classes)) { xw_grid_td_classes = ""; }
                var html = new StringBuffer;
                html.Append(`${a}\r\n`)
                $(`#${rowIndex}_${xw_grid_dom_id}_tr td[area-des='${rowIndex}_${xw_grid_dom_id}_${xw_grid_key}']`).html(html.ToString());
            }
        }
        var xw_grid_dom_tb_width = xw_grid_dom_id + "_table_tb";
        drap_wid(xw_grid_dom_tb_width);


        var dom_tr_id = `${rowIndex}_${xw_grid_dom_id}_tr`;
        var dom_list_id = `${xw_grid_dom_id}`;
        var addRowCallback = opt_json.addRowCallback;
        if (!isUndefine(addRowCallback)) {
            addRowCallback(dom_tr_id, dom_list_id)
        }

        if (!isUndefine(opt_json.allow_drag_sel_con) && opt_json.allow_drag_sel_con == true) {
            xw_grid_drag_sel_one(xw_grid_dom_id);
        }

        $(`#${dom_tr_id}`).on("click", "[xw-grid-el='td']", function (e) {
            if (!isUndefine(opt_json.onSelectRow)) {
                var now_dom_td_id = $(this).attr("area-des");
                var e_tr = $(e.currentTarget).closest("tr[xw-grid-el='tr']");
                var now_dom_tr_id = $(e_tr).attr("id");
                var e_tb = $(e.currentTarget).closest("table[xw-grid-el='tb']");
                var now_dom_list_id = $(e_tb).attr("id").split("_table_tb")[0];
                opt_json.onSelectRow(now_dom_td_id, now_dom_tr_id, now_dom_list_id, rowData, rowIndex);
            }
        });
    },
    gridUnload: function () {
        if (!isUndefine(this.data("jsonOpt"))) {
            this.data("jsonOpt").posNum = 1;
        }
        $(this).find("[xw-grid-el='tr']").remove();
    },
    setGridWid: function (wid) {
        $(this).css("width", wid + "px");
    },
    addGridHead: function (callback) {
        var opt_json = this.data("jsonOpt");
        var colNames = deepClone(opt_json.colNames);
        var colModel = deepClone(opt_json.colModel);

        var xw_grid_dom_id = this[0].id; // list_1
        var first_th_tr_id = `#0_${xw_grid_dom_id}_tr_0`;

        var style_dom_json = [];

        var html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<tr class="xw_grid_tr_add_row" xw-grid-el="add_head_tr" id="add_head_${xw_grid_dom_id}">\r\n`)
        html.Append(`   <td class="xw_grid_td" xw-grid-el="add_head_td" style="border-left: none; font-size: 12px;">0</td>\r\n`)
        for (var i = 0; i < colNames.length; i++) {
            if (colModel[i].hidden == true) {
                html.Append(`<td class="xw_grid_td xw_grid_td_hid"></td>\r\n`)
            }
            else if (colModel[i].hidden == undefined || colModel[i].hidden == null || colModel[i].hidden == false) {
                html.Append(`<td id="add_head_${xw_grid_dom_id}_${colModel[i].name}" class="xw_grid_td">\r\n`)
                if (colModel[i].edit_flag != true) {
                    var td_edit_way = colModel[i].edit;
                    var td_width = colModel[i].width;

                    var style_dom_obj = null

                    if (td_edit_way == "input") {
                        html.Append(`<input id="txt_head_${xw_grid_dom_id}_${colModel[i].name}" style="height: var(--xw-grid-tr-height); border: none; width: ${td_width}px; font-size: var(--xw-grid-td-font-size);" />\r\n`);
                    }
                    else if (td_edit_way == "select") {
                        html.Append(`\r\n`);
                        var edit_opt = colModel[i].editoptions.values;
                        var edit_opt_list = edit_opt.split(";");
                        var now_sel_json = [];
                        for (var j = 0; j < edit_opt_list.length; j++) {
                            var value = edit_opt_list[j].split(":")[1];
                            var title = edit_opt_list[j].split(":")[0];
                            now_sel_json.push({ "para_title": title, "para_value": value })
                        }

                        var xw_internation_sel_ss_str = "请选择";
                        try {
                            xw_internation_sel_ss_str = get_lan_new_str(xw_internation_sel_ss_str);
                        }
                        catch {
                            xw_internation_sel_ss_str = "请选择";
                        }

                        var select_yesNo = Create_select(`sel_head_${xw_grid_dom_id}_${colModel[i].name}`, now_sel_json, "para_value", "para_title", -1, { title: `${xw_internation_sel_ss_str}`, value: -1 });
                        html.Append(`${select_yesNo}\r\n`);
                        var style_dom_obj = { id: `#sel_head_${xw_grid_dom_id}_${colModel[i].name}`, td_id: `#add_head_${xw_grid_dom_id}_${colModel[i].name}`, width: td_width }
                    }
                    else {
                        html.Append(`<div id="div_head_${xw_grid_dom_id}_${colModel[i].name}" style="cursor: not-allowed;line-height: var(--xw-grid-tr-height);height: var(--xw-grid-tr-height); border: none; width: ${td_width}px; font-size: var(--xw-grid-td-font-size);"></div>\r\n`);
                    }

                    if (style_dom_obj != null && style_dom_obj != undefined) {
                        style_dom_json.push(style_dom_obj);
                    }
                }
                html.Append(`</td>\r\n`)
            }
        }
        html.Append(`</tr>\r\n`)
        $(first_th_tr_id).after(html.ToString());
        if (style_dom_json != null && style_dom_json.length > 0) {
            for (var k = 0; k < style_dom_json.length; k++) {
                var td_sel_height = "var(--xw-grid-tr-height)";
                var td_sel_font_size = "var(--xw-grid-td-font-size)";
                var td_sel_width = style_dom_json[k].width;
                var edit_id = style_dom_json[k].id;
                $(edit_id).css("height", td_sel_height);
                $(edit_id).css("font-size", td_sel_font_size);
                $(edit_id).css("widht", td_sel_width + "px");
            }
        }

        if (!isUndefine(callback)) {
            var fun_head_hd = callback + "()";
            eval(fun_head_hd);
        }

    },
    addGridTail: function (pos, callback, param) {
        var opt_json = this.data("jsonOpt");
        var colNames = deepClone(opt_json.colNames);
        var colModel = deepClone(opt_json.colModel);

        // var aa = $(this).find("[xw-grid-el='add_head_tr']").length;
        // console.log(aa)

        var xw_grid_dom_id = this[0].id; // list_1
        var tail_th_tr_id;
        if (pos > 0) {
            tail_th_tr_id = `#${pos}_${xw_grid_dom_id}_tr`;
        }
        else if ($(this).find("[xw-grid-el='add_head_tr']").length > 0) {
            tail_th_tr_id = `#add_head_${xw_grid_dom_id}`;
        }
        else {
            tail_th_tr_id = `#${pos}_${xw_grid_dom_id}_tr_0`;
        }
        var style_dom_json = [];

        var html = new StringBuffer();
        html.Append(`<tr class="xw_grid_tr_add_row" xw-grid-el="add_tail_tr" id="add_tail_${xw_grid_dom_id}">\r\n`)
        html.Append(`   <td class="xw_grid_td" xw-grid-el="add_tail_td" style="border-left: none; font-size: 12px;">${pos + 1}</td>\r\n`)
        for (var i = 0; i < colNames.length; i++) {
            if (colModel[i].hidden == true) {
                html.Append(`<td id="add_tail_${xw_grid_dom_id}_${colModel[i].name}" td-val="" class="xw_grid_td xw_grid_td_hid"></td>\r\n`)
            }
            else if (colModel[i].hidden == undefined || colModel[i].hidden == null || colModel[i].hidden == false) {
                html.Append(`<td id="add_tail_${xw_grid_dom_id}_${colModel[i].name}" td-val="" class="xw_grid_td">\r\n`)
                if (colModel[i].edit_flag != true) {
                    var td_edit_way = colModel[i].edit;
                    var td_width = colModel[i].width;
                    var td_tail_allow = colModel[i].tail_allow;
                    var style_dom_obj = null

                    if (td_tail_allow != false && td_edit_way == "input") {
                        html.Append(`<input id="edit_txt_tail_${xw_grid_dom_id}_${colModel[i].name}" class="xw_add_tr_input" type="text" style="width: ${td_width}px; height: var(--xw-grid-tr-height); font-size: var(--xw-grid-td-font-size);" />\r\n`);
                        // style="width: ${w}; height: ${h}; font-size: ${font_size}; border: 0;"
                        // var style_dom_obj = { id: `#txt_${xw_grid_dom_id}_${colModel[i].name}`, td_id: `#add_head_${xw_grid_dom_id}_${colModel[i].name}` }
                    }
                    else if (td_tail_allow != false && td_edit_way == "select") {
                        html.Append(`\r\n`);
                        var edit_opt = colModel[i].editoptions.values;
                        var edit_opt_list = edit_opt.split(";");
                        var now_sel_json = [];
                        for (var j = 0; j < edit_opt_list.length; j++) {
                            var value = edit_opt_list[j].split(":")[1];
                            var title = edit_opt_list[j].split(":")[0];
                            now_sel_json.push({ "para_title": title, "para_value": value })
                        }

                        var xw_internation_sel_ss_str = "请选择"
                        try {
                            xw_internation_sel_ss_str = get_lan_new_str(xw_internation_sel_ss_str);
                        }
                        catch {
                            xw_internation_sel_ss_str = "请选择";
                        }
                        var select_yesNo = Create_select(`edit_sel_tail_${xw_grid_dom_id}_${colModel[i].name}`, now_sel_json, "para_value", "para_title", -1, { title: `${xw_internation_sel_ss_str}`, value: -1 });
                        // $(this).html(select_yesNo);
                        html.Append(`${select_yesNo}\r\n`);
                        // $(`#sel_${xw_grid_dom_id}_${colModel[i].name}`).css("width", w);
                        // $(`#sel_${xw_grid_dom_id}_${colModel[i].name}`).css("height", h);
                        var style_dom_obj = { id: `#edit_sel_tail_${xw_grid_dom_id}_${colModel[i].name}`, td_id: `#add_tail_${xw_grid_dom_id}_${colModel[i].name}`, width: td_width }
                    }
                    if (style_dom_obj != null && style_dom_obj != undefined) {
                        style_dom_json.push(style_dom_obj);
                    }
                }
                html.Append(`</td>\r\n`)
            }
        }
        html.Append(`</tr>\r\n`)
        $(tail_th_tr_id).after(html.ToString());
        if (style_dom_json != null && style_dom_json.length > 0) {
            for (var k = 0; k < style_dom_json.length; k++) {
                var td_sel_height = "var(--xw-grid-tr-height)";
                var td_sel_font_size = "var(--xw-grid-td-font-size)";
                var td_sel_width = style_dom_json[k].width;
                var edit_id = style_dom_json[k].id;
                $(edit_id).css("height", td_sel_height);
                $(edit_id).css("font-size", td_sel_font_size);
                $(edit_id).css("widht", td_sel_width + "px");
            }
        }

        if (callback != undefined && callback != null && callback != "") {
            if (isUndefine(param)) { param = "" }
            var fun_call = callback + `(${param})`;
            eval(fun_call);
        }

        ctr_l_r_tail(`add_tail_${xw_grid_dom_id}`, xw_grid_dom_id);

    },
    gridTailUnload: function () {
        $(this).find("[xw-grid-el='add_tail_tr']").remove();
    },
    xw_context: function (json) {
        // console.log(this)
        this.data("json_xw_context", json)
        var div_id = $(this).attr("id");
        var ctm_id = "ctm_" + div_id;
        var ctm_dom_id = "#ctm_" + div_id;
        var remove_dom_flag = json.remove_dom_flag;

        var x_correct = 0;
        var y_correct = 0;
        if (!isUndefine(json.x_correct)) {
            x_correct = json.x_correct;
        }
        if (!isUndefine(json.y_correct)) {
            y_correct = json.y_correct;
        }

        $(this).on("contextmenu", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var ex_pos = e.pageX + x_correct;
            var ey_pos = e.pageY + y_correct;

            var ctm_list = $(window.document.body).find("div[id^='ctm_']");
            if (!isUndefine(ctm_list)) {
                $.each(ctm_list, function (index, dom_ele) {
                    $(dom_ele).removeClass("ctm_block");
                    $(dom_ele).removeClass("ctm_hide");
                    $(dom_ele).addClass("ctm_hide");
                });
            }

            if ($(ctm_dom_id).length == 0) {
                var html = new StringBuffer();
                html.Append(`\r\n`);
                html.Append(`<div id="${ctm_id}" class="context_menu ctm_block" style="left: ${ex_pos}px; top: ${ey_pos}px;">\r\n`);
                html.Append(`    <div class="menu_list">\r\n`);
                for (var i = 0; i < json.menu_label.length; i++) {
                    var lb_obj = json.menu_label[i];
                    html.Append(`        <div id="${i}_${ctm_id}" class="menu_item">${lb_obj.label}</div>\r\n`);
                }
                html.Append(`    </div>\r\n`);
                html.Append(`</div>\r\n`);
                $(this).append(html.ToString());

                for (var i = 0; i < json.menu_label.length; i++) {
                    var now_obj = json.menu_label[i];
                    if (!isUndefine(now_obj.hd_fun)) {
                        $(`#${i}_${ctm_id}`).on("click", now_obj.hd_fun);
                    }
                }

            }
            // else if (remove_dom_flag == true) {
            //     $(ctm_dom_id).remove;
            // }
            else {
                if ($(ctm_dom_id).hasClass("ctm_block")) {
                    $(ctm_dom_id).css("left", `${ex_pos}px`);
                    $(ctm_dom_id).css("top", `${ey_pos}px`);
                }
                else if ($(ctm_dom_id).hasClass("ctm_hide")) {
                    $(ctm_dom_id).removeClass("ctm_hide");
                    $(ctm_dom_id).addClass("ctm_block");
                    $(ctm_dom_id).css("left", `${ex_pos}px`);
                    $(ctm_dom_id).css("top", `${ey_pos}px`);
                }
            }

        });

        $(document).on("click", function () {
            setTimeout(function () {
                var ctm_list = $(this.document.body).find("div[id^='ctm_']");
                $.each(ctm_list, function (index, dom_ele) {
                    if (remove_dom_flag == true) {
                        $(dom_ele).remove();
                    }
                    else {
                        $(dom_ele).removeClass("ctm_block");
                        $(dom_ele).removeClass("ctm_hide");
                        $(dom_ele).addClass("ctm_hide");
                    }
                });
            }, 10);
        });

        // $(document).on('selectionchange', function() {
        //     currentSelection = window.getSelection().toString();
        //     console.log('当前选中的文本:', currentSelection);
        //     if(!isUndefine(currentSelection)) {
        //         selectText = currentSelection;
        //     }
        // });

    },
    xw_context_upload: function () {
        this.data("json_xw_context", [])
        $(this).off("contextmenu")
    },
    gridColumnDrag: function () {
        var opt_json = this.data("jsonOpt");
        let hold_click = opt_json.hold_click = 0;
        let ori_kuang_x = 0;
        let ori_kuang_y = 0;
        let move_x = 0;
        let move_y = 0;
        let hold_click_timout = null;

        var list_id = $(this).attr("id");
        $(`#${list_id}_table_tb`).on("mouseleave", function (e) {
            console.log("??")
            hold_click = 0;
            // ori_kuang_x = 0;
            // ori_kuang_y = 0;
            $(`#${list_id}_kuang`).remove();
            if (hold_click_timout) {
                clearTimeout(hold_click_timout);
                hold_click_timout = null;
            }
        });
        $(this).on("mouseover", "[xw-grid-el='td']", function (e) {
            // $(this).css("background", "#ff0000")
        });
        // $(this).on("mouseleave", "[xw-grid-el='td']", function(e) {
        //     $(this).css("background", "#fff")
        // });
        $(this).on("mousedown", function (e) {
            hold_click_timout = setTimeout(() => {
                let container = document.getElementById(list_id);
                let rect = container.getBoundingClientRect();
                let x = e.clientX;
                let y = e.clientY;
                ori_kuang_x = x;
                ori_kuang_y = y;

                // 重置
                move_x = x;
                move_y = y;

                var html = new StringBuffer;
                html.Append(`<div id="${list_id}_kuang" style="border: 1px solid #ff0000; pointer-events: none;
                 width: 1px; height: 1px; position: absolute; top: ${y}px; left: ${x}px"></div>`)
                $(`#${list_id}`).append(html.ToString());
                hold_click = 1;
            }, 500);

            // $(this).css("background", "#ffff00")
        });
        $(this).on("mousemove", function (e) {
            // hold_click = 1;
            if (hold_click == 1) {
                // $(this).css("background", "#ffff00")
                move_x = e.clientX;
                move_y = e.clientY;
                let wid = 0;
                let hei = 0;

                wid = move_x - ori_kuang_x;
                hei = move_y - ori_kuang_y;
                if (move_x < ori_kuang_x && move_y >= ori_kuang_y) {
                    $(`#${list_id}_kuang`).css("left", `${move_x}px`);
                    $(`#${list_id}_kuang`).css("width", `${ori_kuang_x - move_x}px`);
                    $(`#${list_id}_kuang`).css("height", `${hei}px`);

                    // $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    //     let now_td_width = $(this).width();
                    //     let now_td_height = $(this).height();
                    //     let now_td_left = $(this).offset().left;
                    //     let now_td_top = $(this).offset().top;
                    //     // debugger
                    //     // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t  碰撞箱
                    //     if (now_td_left < ori_kuang_x && now_td_left + now_td_width > move_x
                    //         && now_td_top < move_y && now_td_height + now_td_top > ori_kuang_y ) {
                    //         $(this).css("background", "#fff000")
                    //         $(this).attr("sel-column", "true");
                    //     }
                    // });
                }
                else if (move_y < ori_kuang_y && move_x >= ori_kuang_x) {
                    $(`#${list_id}_kuang`).css("top", `${move_y}px`);
                    $(`#${list_id}_kuang`).css("width", `${wid}px`);
                    $(`#${list_id}_kuang`).css("height", `${ori_kuang_y - move_y}px`);

                    // $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    //     let now_td_width = $(this).width();
                    //     let now_td_height = $(this).height();
                    //     let now_td_left = $(this).offset().left;
                    //     let now_td_top = $(this).offset().top;
                    //     // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t
                    //     if (now_td_left < move_x && now_td_left + now_td_width > ori_kuang_x
                    //         && now_td_top < ori_kuang_y && now_td_height + now_td_top > move_y) {
                    //         $(this).css("background", "#fff000")
                    //         $(this).attr("sel-column", "true");

                    //     }
                    // });
                }
                else if (move_y < ori_kuang_y && move_x < ori_kuang_x) {
                    $(`#${list_id}_kuang`).css("left", `${move_x}px`);
                    $(`#${list_id}_kuang`).css("top", `${move_y}px`);

                    $(`#${list_id}_kuang`).css("width", `${ori_kuang_x - move_x}px`);
                    $(`#${list_id}_kuang`).css("height", `${ori_kuang_y - move_y}px`);

                    // $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    //     let now_td_width = $(this).width();
                    //     let now_td_height = $(this).height();
                    //     let now_td_left = $(this).offset().left;
                    //     let now_td_top = $(this).offset().top;
                    //     // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t
                    //     if (now_td_left < ori_kuang_x  && now_td_left + now_td_width > move_x
                    //         && now_td_top <  ori_kuang_y  && now_td_height + now_td_top > move_y) {
                    //         $(this).css("background", "#fff000")
                    //         $(this).attr("sel-column", "true");

                    //     }
                    // });

                }
                else if (move_y >= ori_kuang_y && move_x >= ori_kuang_x) {
                    $(`#${list_id}_kuang`).css("width", `${wid}px`);
                    $(`#${list_id}_kuang`).css("height", `${hei}px`);

                    // $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    //     let now_td_width = $(this).width();
                    //     let now_td_height = $(this).height();
                    //     let now_td_left = $(this).offset().left;
                    //     let now_td_top = $(this).offset().top;
                    //     // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t
                    //     if (now_td_left < move_x && now_td_left + now_td_width > ori_kuang_x
                    //         && now_td_top < move_y && now_td_height + now_td_top > ori_kuang_y) {
                    //         $(this).css("background", "#fff000")
                    //         $(this).attr("sel-column", "true");

                    //     }
                    // });

                }

                // console.log($(this).offset());
                // console.log($(`#${list_id}_kuang`).offset())

            }
            else {
                hold_click = 0;
                ori_kuang_x = 0;
                ori_kuang_y = 0;
                $(`#${list_id}_kuang`).remove();
                if (hold_click_timout) {
                    clearTimeout(hold_click_timout);
                    hold_click_timout = null;
                }
            }
        });
        $(this).on("mouseup", function (e) {
            if (move_x < ori_kuang_x && move_y >= ori_kuang_y) {
                $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    let now_td_width = $(this).width();
                    let now_td_height = $(this).height();
                    let now_td_left = $(this).offset().left;
                    let now_td_top = $(this).offset().top;
                    // debugger
                    // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t  碰撞箱
                    if (now_td_left <= ori_kuang_x && now_td_left + now_td_width > move_x
                        && now_td_top <= move_y && now_td_height + now_td_top > ori_kuang_y) {
                        $(this).css("background", "#fff000")
                        $(this).attr("sel-column", "true");
                    }
                });
            }
            else if (move_y < ori_kuang_y && move_x >= ori_kuang_x) {
                $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    let now_td_width = $(this).width();
                    let now_td_height = $(this).height();
                    let now_td_left = $(this).offset().left;
                    let now_td_top = $(this).offset().top;
                    // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t
                    if (now_td_left <= move_x && now_td_left + now_td_width > ori_kuang_x
                        && now_td_top <= ori_kuang_y && now_td_height + now_td_top > move_y) {
                        $(this).css("background", "#fff000")
                        $(this).attr("sel-column", "true");

                    }
                });
            }
            else if (move_y < ori_kuang_y && move_x < ori_kuang_x) {
                $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    let now_td_width = $(this).width();
                    let now_td_height = $(this).height();
                    let now_td_left = $(this).offset().left;
                    let now_td_top = $(this).offset().top;
                    // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t
                    if (now_td_left <= ori_kuang_x && now_td_left + now_td_width > move_x
                        && now_td_top <= ori_kuang_y && now_td_height + now_td_top > move_y) {
                        $(this).css("background", "#fff000")
                        $(this).attr("sel-column", "true");

                    }
                });

            }
            else if (move_y >= ori_kuang_y && move_x >= ori_kuang_x) {
                $(`#${list_id} td[xw-grid-el='td']`).each(function (e) {
                    let now_td_width = $(this).width();
                    let now_td_height = $(this).height();
                    let now_td_left = $(this).offset().left;
                    let now_td_top = $(this).offset().top;
                    // a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t
                    if (now_td_left <= move_x && now_td_left + now_td_width > ori_kuang_x
                        && now_td_top <= move_y && now_td_height + now_td_top > ori_kuang_y) {
                        $(this).css("background", "#fff000")
                        $(this).attr("sel-column", "true");

                    }
                });

            }
            console.log("up")
            hold_click = 0;
            ori_kuang_x = 0;
            ori_kuang_y = 0;
            move_x = 0;
            move_y = 0;
            $(`#${list_id}_kuang`).remove();
            if (hold_click_timout) {
                clearTimeout(hold_click_timout);
                hold_click_timout = null;
            }

            // $(this).css("background", "#ffff00")
        });
    },
    xw_search_sel: function (json) {
        this.data("xwSearchSel", json)
        var dom = $(this).attr("id");

        $(this).addClass("search_input_box_relative");

        console.log($(this).scrollLeft(), "????");

        let height = json.input_hei;  // input的高
        let width = $(this).width();  // input的宽
        if (!isUndefine(json.force_wid)) {
            width = json.force_wid;   // 强制input宽度
        }

        let srch_sel = "srch_sel_" + dom;

        let dl_wid = !isUndefine(json.dl_wid) ? json.dl_wid : ""; // 下拉项 最小宽
        let dl_hei = !isUndefine(json.dl_hei) ? json.dl_hei : ""; // 下拉项 最大高
        let dd_items = json.dd_items; // 下拉项

        let read_only = json.readonly;
        let read_only_str = "";
        if (!isUndefine(read_only) && read_only == true) {
            read_only_str = "readonly";
        }

        let pure_sel_flag = json.pure_sel_flag; // 是否变成纯粹的下拉框
        let pure_sel_str = isUndefine(json.pure_sel_flag) ? get_lan_new_str("全部") : json.pure_sel_str; // 是否变成纯粹的下拉框
        let pure_sel_val = isUndefine(json.pure_sel_val) ? '-1' : json.pure_sel_val;
        if (!isUndefine(pure_sel_flag) && pure_sel_flag && !isUndefine(read_only) && read_only == true) {
            dd_items = [{ value: pure_sel_val, title: pure_sel_str }].concat(dd_items);
        }

        // if(!isUndefine(json.clean_btn) && json.clean_btn) {
        //     dd_items.slice(0, 0, {  })
        // }

        let html = new StringBuffer();
        html.Append(`\r\n`)
        html.Append(`<div id="${srch_sel}" class="search_input_box">\r\n`)
        html.Append(`    <div id="${srch_sel}_search_input_box" class="search_input_box_input">\r\n`)
        html.Append(`        <input id="${srch_sel}_input_txt" ${read_only_str} style="width: ${width}px; height: ${height}px; line-height: ${height}px" placeholder="${isUndefine(json.placeholder) ? "" : json.placeholder}"/>\r\n`)
        html.Append(`        <input id="${srch_sel}_hid_input_txt" type="hidden" value=""/>\r\n`)
        html.Append(`    </div>\r\n`)

        html.Append(`</div>\r\n`)
        $(this).html(html.ToString());

        // html = new StringBuffer();
        // if(!isUndefine(dd_items) && dd_items.length > 0) {
        //     for(let i = 0; i < dd_items.length; i++) {
        //         let item = dd_items[i];
        //         html.Append(`        <dd dd-val="${item.value}">${item.title}</dd>\r\n`)
        //     }
        // }
        // $("#list_1").append(html.ToString());


        json.focus_flag = 0;
        json.dynamic_filter = 0;

        $(`#${srch_sel}_search_input_box`).on('click', function () {
            if (json.focus_flag == 0) {
                $(`#${srch_sel}_input_txt`).focus();
                $(`#${srch_sel}_dl_con`).removeClass("search_input_box_content_hid").addClass("search_input_box_content_show");
                json.focus_flag = 1;

                let real_top = $(this).offset().top + json.correct_top - $(this).scrollTop();    // 修正离上
                let real_left = $(this).offset().left + json.correct_left - $(this).scrollLeft();  // 修正离左

                let dl_con = $(`#${srch_sel}_dl_con`);
                if (dl_con.length > 0) {
                    $(`#${srch_sel}_dl_con`).css('top', `${real_top}px`);
                    $(`#${srch_sel}_dl_con`).css('left', `${real_left}px`);
                }
                else {
                    let html = new StringBuffer();
                    html.Append(`    <div id="${srch_sel}_dl_con" class="search_input_box_content search_input_box_content_show" style="top: ${real_top}px; left: ${real_left}px; min-width: ${dl_wid}px; max-height: ${dl_hei}px;">\r\n`)
                    if (!isUndefine(dd_items) && dd_items.length > 0) {
                        for (let i = 0; i < dd_items.length; i++) {
                            let item = dd_items[i];
                            html.Append(`        <dd dd-val="${item.value}" dd-title="${item.title}">${item.title}</dd>\r\n`)
                        }
                    }
                    html.Append(`    </div>\r\n`)
                    $(`#${json.parent_dom}`).append(html.ToString());

                    $(`#${srch_sel}_dl_con dd`).on('click', function (i, e) {
                        let title = $(this).attr('dd-title');
                        let val = $(this).attr('dd-val');
                        $(`#${srch_sel}_input_txt`).val(title);
                        $(`#${srch_sel}_hid_input_txt`).val(val);
                        if (!isUndefine(json.callback)) {
                            if (!isUndefine(json.callback_param) && json.callback_param.length > 0) {
                                json.callback(...json.callback_param);
                            }
                            else {
                                json.callback();
                            }
                        }
                    });
                }

                let txt_val = $(`#${srch_sel}_input_txt`).val();
                if (!isUndefine(txt_val)) {
                    let flag = 1;
                    let index = 0;
                    let dd_list = $(`#${srch_sel}_dl_con dd`);
                    $(`#${srch_sel}_dl_con dd`).removeClass('active')
                    while (flag == 1) {
                        let txt_sim = $(dd_list[index]).attr('dd-title');
                        if (!isUndefine(txt_sim) && !isUndefine(txt_val) && txt_sim.includes(txt_val)) {
                            flag = 0;
                            index--;
                        }
                        index++;
                    }
                    if (index >= 0) {
                        let active_dd_item = dd_list[index];
                        $(active_dd_item).addClass('active');
                    }
                }
            }
            else {
                $(`#${srch_sel}_input_txt`).blur();
            }
        });

        $(`#${srch_sel}_input_txt`).on('blur', function () {
            $(`#${srch_sel}_dl_con`).removeClass("search_input_box_content_show").addClass("search_input_box_content_hid");
            json.focus_flag = 0;
        });

        $(`#${srch_sel}_input_txt`).on("input", function () {
            let dd_items_temp = dd_items.filter(p => p.title.includes($(this).val()));
            let html = new StringBuffer();
            if (!isUndefine(dd_items_temp) && dd_items_temp.length > 0) {
                for (let i = 0; i < dd_items_temp.length; i++) {
                    let item = dd_items_temp[i];
                    html.Append(`        <dd dd-val="${item.value}" dd-title="${item.title}">${item.title}</dd>\r\n`)
                }
            }
            $(`#${srch_sel}_dl_con`).html(html.ToString());
            $(`#${srch_sel}_dl_con dd`).on('click', function (i, e) {
                let title = $(this).attr('dd-title');
                let val = $(this).attr('dd-val');
                $(`#${srch_sel}_input_txt`).val(title);
                $(`#${srch_sel}_hid_input_txt`).val(val);
                if (!isUndefine(json.callback)) {
                    if (!isUndefine(json.callback_param) && json.callback_param.length > 0) {
                        json.callback(...json.callback_param);
                    }
                    else {
                        json.callback();
                    }
                }
            });
        });
    },
    get_xwsle_val: function () {
        var dom = $(this).attr("id");
        let srch_sel = "srch_sel_" + dom;
        return $(`#${srch_sel}_hid_input_txt`).val();
    },
    clear_xw_search_sel: function (json) {
        let placeholder = json.placeholder;
        let input_hei = json.input_hei;
        let parent_dom = json.parent_dom;
        var dom = $(this).attr("id");
        $(`#${dom}`).xw_search_sel({
            dd_items: [],
            correct_top: 23,
            correct_left: 0,
            dl_wid: 50,
            dl_hei: 50,
            input_hei: input_hei,
            placeholder: get_lan_new_str(placeholder),
            parent_dom: parent_dom,
        });
    },
    unmount_xw_search_sel: function () {
        console.log('解除')
        var dom = $(this).attr("id");
        let srch_sel = "srch_sel_" + dom;
        $(`#${srch_sel}`).remove();
        $(this).removeData("xwSearchSel");
        $(`#${srch_sel}_dl_con`).remove();
        $(`#${srch_sel}_search_input_box`).off();
        $(`#${srch_sel}_input_txt`).off();
        $(`#${srch_sel}_dl_con dd`).off();
    },
});
//#endregion

//#region 用来给window事件绑定和解绑的
//#endregion

//#region 拉宽
function drap_wid(dom_tb) {
    var tTD;
    var table = document.getElementById(dom_tb);

    for (j = 0; j < table.rows[0].cells.length; j++) {
        table.rows[0].cells[j].onmousedown = function () {
            tTD = this;

            if (event.offsetX > tTD.offsetWidth - 10) {
                tTD.mouseDown = true;
                tTD.oldX = event.x;
                tTD.oldWidth = tTD.offsetWidth;
            }
        };
        table.rows[0].cells[j].onmouseup = function () {
            if (tTD == undefined) tTD = this;
            tTD.mouseDown = false;
            tTD.style.cursor = 'default';
        };
        table.rows[0].cells[j].onmousemove = function () {
            if ($(this).attr("td-name") == "th_sel_all") {
                this.style.cursor = 'pointer';
            }
            else if (event.offsetX > this.offsetWidth - 10) {
                this.style.cursor = 'col-resize';
            }
            else {
                this.style.cursor = 'default';
            }
            if (tTD == undefined) tTD = this;
            if (tTD.mouseDown != null && tTD.mouseDown == true) {
                tTD.style.cursor = 'default';
                if (tTD.oldWidth + (event.x - tTD.oldX) > 0) {
                    // 让table所在容器不断延申，这样table的td就不会自适应了
                    var ww = parseFloat($(table).css("width").split("px")[0]);
                    var all_td_ww = $(tTD).attr("id")
                    var prolong = 0;
                    $("#" + all_td_ww).closest("tr").find("td").each(function () {
                        prolong += $(this).width();
                    })

                    if (prolong > ww - 20) {
                        ww = ww + 2;
                        var big_contain = dom_tb.split("_table_tb")[0];
                        $(`#${big_contain}_contain`).css("width", ww + "px");
                    }
                    tTD.width = tTD.oldWidth + (event.x - tTD.oldX);
                }

                // tTD.style.width = tTD.width;
                tTD.style.cursor = 'col-resize';
                table = tTD;
                $(table).css("width", tTD.width)

                while (table.tagName != 'TABLE') table = table.parentElement;
                for (j = 0; j < table.rows.length; j++) {
                    table.rows[j].cells[tTD.cellIndex].width = tTD.width;
                }

            }
        };
    }
}
//#endregion

//#region 键
function containsKey(obj, key) {
    if (obj == undefined || obj == null) { return; }
    return obj.hasOwnProperty(key);
}
//#endregion

//#region 深拷贝
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        // 如果不是对象或数组，直接返回
        return obj;
    }
    // 创建一个新的对象或数组
    let clone = Array.isArray(obj) ? [] : {};
    // 遍历对象或数组的每个属性
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 如果属性值是对象或数组，递归调用深拷贝
            clone[key] = deepClone(obj[key]);
        }
    }
    return clone;
}
function isUndefine(item) {
    if (item === 0 || item === "0") {
        return false;
    }
    if (item == undefined || item == null || item == "undefined" || item == "null" || item == "") {
        return true;
    }
    return false;
}
//#endregion

//#region 点击启动编辑模式
// var lastTrObj = "";
function xw_grid_td_click(dom, dom_list_id) {  //前者是具体的td，后者是list_1
    var dom_id = `#${dom_list_id} td[area-des=${dom}]`;
    var opt_json = $("#" + dom_list_id).data("jsonOpt");

    var dq_px = $(dom_id).closest("tr").attr("px");
    var dom_gb_tb_id = dq_px + "_" + dom_list_id;
    xw_grid_just_sel_one_quiet(dom_gb_tb_id, dom_list_id)

    var inputExist = $(`#${dom_list_id} td[area-des=${dom}]`).closest("[xw-grid-el='tr']").find("input[type='text']").length;
    if (inputExist > 0) { return; }
    else {
        var dom_tr = $(dom_id).closest("tr");
        var dom_tr_id = $(dom_id).closest("tr").attr("id");

        if (opt_json.lastTrObj != "") {
            close_edit_td_not_change(opt_json.lastTrObj);
        }
        opt_json.lastTrObj = dom_tr_id;

        var position = 0;
        dom_tr.find("[xw-grid-el='td']").each(function () {
            var td_id = $(this).attr("id");
            var val = $(this).html();
            var w = $(this).css("width");
            var h = $(this).css("height");
            var text_align = $(this).css("text-align");
            var font_size = $(this).css("font-size");
            var td_edit = opt_json.colModel[position].edit;
            var td_name = $(this).attr("td-name");
            var td_edit_flag = opt_json.colModel[position].edit_flag;
            var xw_grid_td_mid_allow = opt_json.colModel[position].mid_allow;
            var all_row_flag = opt_json.all_row_edit;
            if (all_row_flag == true) {
                if (xw_grid_td_mid_allow != false && td_edit == "input") {
                    $(this).html(`<input id="${dom_tr_id}_input_${td_name}" type="text" value="${val}" style="width: ${w}; height: ${h}; font-size: ${font_size}; border: 0; text-align: ${text_align}; text-indent: 0; " />\r\n`);
                }
                else if (xw_grid_td_mid_allow != false && td_edit == "select") {
                    var html = new StringBuffer();
                    var edit_opt = opt_json.colModel[position].editoptions.values;
                    var edit_opt_list = edit_opt.split(";");
                    var now_sel_json = [];
                    for (var i = 0; i < edit_opt_list.length; i++) {
                        var value = edit_opt_list[i].split(":")[1];
                        var title = edit_opt_list[i].split(":")[0];
                        now_sel_json.push({ "para_title": title, "para_value": value })
                    }
                    var xw_internation_sel_ss_str = "请选择"
                    try {
                        xw_internation_sel_ss_str = get_lan_new_str(xw_internation_sel_ss_str);
                    }
                    catch {
                        xw_internation_sel_ss_str = "请选择";
                    }
                    var select_yesNo = Create_select(`${dom_tr_id}_sel_edit`, now_sel_json, "para_value", "para_title", -1, { title: `${xw_internation_sel_ss_str}`, value: -1 });
                    $(this).html(select_yesNo);
                    $(`#${dom_tr_id}_sel_edit`).css("width", w);
                    $(`#${dom_tr_id}_sel_edit`).css("height", h);
                }
            }
            position++;
        });
        var dom_input_id = dom_id + " input";
        $(dom_input_id).select();
        var dom_tr_id = $(dom_id).closest("tr").attr("id");
        ctr_u_d(dom_tr_id);

        dom_tr.find("[xw-grid-el='td'] input[type='text'],select").each(function () {
            var key = "";
            $(this).on("keydown", function (e) {
                key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            });
            if (!isUndefine(opt_json.edit_change_fun)) {
                $(this).on("change", function (e) {
                    var e_td = $(e.currentTarget).closest("td[xw-grid-el='td']");
                    var now_dom_td_id = $(e_td).attr("area-des");
                    opt_json.edit_change_fun(now_dom_td_id, dom_tr_id, dom_list_id, key);
                })
            }
        });
        ctr_l_r(dom_tr_id);
    }

    var dom_tr = $(dom_id).closest("tr");
    var dom_tr_id = $(dom_id).closest("tr").attr("id");
    if (opt_json.click_td_overried) {
        dom_tr.on("click", () => {
            opt_json.click_td_overried(dom_tr_id, dom_list_id);
        });
    }

}
function xw_grid_td_click_not_udlf(dom, dom_list_id) {  //前者是具体的td，后者是list_1
    var dom_id = `#${dom_list_id} td[area-des=${dom}]`;

    var dq_px = $(dom_id).closest("tr").attr("px");
    var dom_gb_tb_id = dq_px + "_" + dom_list_id;
    xw_grid_just_sel_one_quiet(dom_gb_tb_id, dom_list_id)

    var inputExist = $(`#${dom_list_id} td[area-des=${dom}]`).closest("[xw-grid-el='tr']").find("input[type='text']").length;
    if (inputExist > 0) { return; }
    else {
        var dom_tr = $(dom_id).closest("tr");
        var dom_tr_id = $(dom_id).closest("tr").attr("id");
        var opt_json = $("#" + dom_list_id).data("jsonOpt");

        if (opt_json.lastTrObj != "") {
            close_edit_td_not_change(opt_json.lastTrObj);
        }
        opt_json.lastTrObj = dom_tr_id;

        var position = 0;
        dom_tr.find("[xw-grid-el='td']").each(function () {
            var td_id = $(this).attr("id");
            var val = $(this).html();
            var w = $(this).css("width");
            var h = $(this).css("height");
            var font_size = $(this).css("font-size");
            var td_edit = opt_json.colModel[position].edit;
            var td_name = $(this).attr("td-name");
            var td_edit_flag = opt_json.colModel[position].edit_flag;
            var xw_grid_td_mid_allow = opt_json.colModel[position].mid_allow;
            var all_row_flag = opt_json.all_row_edit;
            if (all_row_flag == true) {
                if (xw_grid_td_mid_allow != false && td_edit == "input") {
                    $(this).html(`<input id="${dom_tr_id}_input_${td_name}" type="text" value="${val}" style="width: ${w}; height: ${h}; font-size: ${font_size}; border: 0;" />\r\n`);
                }
                else if (xw_grid_td_mid_allow != false && td_edit == "select") {
                    var html = new StringBuffer();
                    var edit_opt = opt_json.colModel[position].editoptions.values;
                    var edit_opt_list = edit_opt.split(";");
                    var now_sel_json = [];
                    for (var i = 0; i < edit_opt_list.length; i++) {
                        var value = edit_opt_list[i].split(":")[1];
                        var title = edit_opt_list[i].split(":")[0];
                        now_sel_json.push({ "para_title": title, "para_value": value })
                    }
                    var xw_internation_sel_ss_str = "请选择"
                    try {
                        xw_internation_sel_ss_str = get_lan_new_str(xw_internation_sel_ss_str);
                    }
                    catch {
                        xw_internation_sel_ss_str = "请选择";
                    }
                    var select_yesNo = Create_select(`${dom_tr_id}_sel_edit`, now_sel_json, "para_value", "para_title", -1, { title: `${xw_internation_sel_ss_str}`, value: -1 });
                    $(this).html(select_yesNo);
                    $(`#${dom_tr_id}_sel_edit`).css("width", w);
                    $(`#${dom_tr_id}_sel_edit`).css("height", h);
                }
            }
            position++;
        });
        var dom_input_id = dom_id + " input";
        $(dom_input_id).select();
        var dom_tr_id = $(dom_id).closest("tr").attr("id");
        xw_grid_only_enter(dom_tr_id)
    }
}
//#endregion

//#region 点击移动光标
function xw_grid_move_gb(dom_tb, dom_list) {

}
//#endregion

//#region 关闭编辑模式
function close_edit_td(dom_id) {
    $("#" + dom_id).find("[xw-grid-el='td']").each(function () {
        var val = $(this).find("input[type='text']").val();
        var txt_length = $(this).find("input[type='text']").length;
        if (isUndefine(val) && txt_length == 1) {
            val = "";
        }
        else if (!isUndefine(val) && txt_length == 1) {
            // val = $(this).html(val);
        }
        else {
            val = $(this).html();
        }
        $(this).html(`${val}`);
        var val_sel_flag = $(this).find("select");
        if (val_sel_flag.length > 0) {
            var val_sel = $(this).find("select").val();
            $(this).html(`${val_sel}`);
        }
    });
}
function close_edit_td_not_change(dom_id) {
    $(`#${dom_id}`).find("[xw-grid-el='td']").each(function () {
        if ($(this).find("input[type='text']").length > 0) {
            var val = $(this).attr("td-val");
            if (isUndefine(val)) {
                val = "";
            }
            $(this).html(`${val}`);
        }

        var val_sel_flag = $(this).find("select");
        if (val_sel_flag.length > 0) {
            var val_sel = $(this).attr("td-val");
            $(this).html(`${val_sel}`);
        }
    });
}
//#endregion

//#region 全选 / 单选
function xw_grid_sel_all(dom_list_id) {
    var dom_tb = "#" + dom_list_id + "_table_tb";
    var opt_json = $("#" + dom_list_id).data("jsonOpt");

    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        var inputExist = $(this).find("input").length;
        if (inputExist > 0) {
            var dom_tr_id = $(this).attr("id");
            close_edit_td_not_change(dom_tr_id);
        }
    });
    var sel_list = [];
    $(dom_tb).find("[xw-grid-el='tr']").map(function () {
        sel_list.push($(this).attr("sel-flag"));
    });
    // 至少有一个false，就是全选true。没有false，就取消全选
    var sel_all_flag = sel_list.some(p => p == "false");

    if (sel_all_flag) { // 全选
        $(dom_tb).find("[xw-grid-el='tr']").each(function () {
            $(this).find("[xw-grid-el='td']").each(function () {
                $(this).attr("sel-flag", "true");
            });
            $(this).removeClass("td_seled");
            $(this).addClass("td_seled");
            $(this).attr("sel-flag", "true");
        });
    }
    else { // 全不选
        $(dom_tb).find("[xw-grid-el='tr']").each(function () {
            $(this).find("[xw-grid-el='td']").each(function () {
                $(this).attr("sel-flag", "false");
            });
            $(this).removeClass("td_seled");
            $(this).attr("sel-flag", "false");
        });
    }

    var dom_tr = "#" + dom_tr_id + "_tr";
    var dom_tr_id = $(dom_tr).attr("id");
    if (opt_json.click_sel_all_overried) {
        opt_json.click_sel_all_overried(dom_tr_id, dom_list_id);
    }
}
function xw_grid_sel_one(dom_tr_id, dom_list_id) {
    var dom_tb = "#" + dom_list_id + "_table_tb";
    var opt_json = $("#" + dom_list_id).data("jsonOpt");

    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        var inputExist = $(this).find("input").length;
        if (inputExist > 0) {
            var dom_tr_id = $(this).attr("id");
            close_edit_td(dom_tr_id);
        }
    });

    var dom_tr = "#" + dom_tr_id + "_tr";
    var sel_tr = $(dom_tr).attr("sel-flag");
    if (sel_tr == "false") {
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "true");
        });
        $(dom_tr).removeClass("td_seled");
        $(dom_tr).addClass("td_seled");
        $(dom_tr).attr("sel-flag", "true");
    }
    else {
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "false");
        });
        $(dom_tr).removeClass("td_seled");
        $(dom_tr).attr("sel-flag", "false");
    }

    var dom_tr_id = $(dom_tr).attr("id");
    if (opt_json.click_sel_con_overried) {
        opt_json.click_sel_con_overried(dom_tr_id, dom_list_id);
    }

}
function xw_grid_just_sel_one(dom_tr_id, dom_list_id) {
    var opt_json = $("#" + dom_list_id).data("jsonOpt");
    var dom_tb = "#" + dom_list_id + "_table_tb";
    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        var inputExist = $(this).find("input").length;
        if (inputExist > 0) {
            var dom_tr_id = $(this).attr("id");
            var quite_update_flag = opt_json.quite_update;
            if (quite_update_flag == true) {
                close_edit_td(dom_tr_id);
            }
            else {
                close_edit_td_not_change(dom_tr_id);
            }
        }
    });

    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        $(this).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "false");
        });
        $(this).removeClass("td_seled");
        $(this).attr("sel-flag", "false");
    });

    var dom_tr = "#" + dom_tr_id + "_tr";
    var sel_tr = $(dom_tr).attr("sel-flag");
    if (sel_tr == "false") {
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "true");
        });
        $(dom_tr).removeClass("td_seled");
        $(dom_tr).addClass("td_seled");
        $(dom_tr).attr("sel-flag", "true");
    }
    else {
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "false");
        });
        $(dom_tr).removeClass("td_seled");
        $(dom_tr).attr("sel-flag", "false");
    }
}
function xw_grid_just_sel_one_quiet(dom_tr_id, dom_list_id) {
    var dom_tb = "#" + dom_list_id + "_table_tb";
    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        // var inputExist = $(this).find("input").length;
        // if(inputExist > 0) {
        //     var dom_tr_id = $(this).attr("id");
        //     close_edit_td_not_change(dom_tr_id);
        // }
    });

    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        $(this).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "false");
        });
        $(this).removeClass("td_seled");
        $(this).attr("sel-flag", "false");
    });

    var dom_tr = "#" + dom_tr_id + "_tr";
    var sel_tr = $(dom_tr).attr("sel-flag");
    if (sel_tr == "false") {
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "true");
        });
        $(dom_tr).removeClass("td_seled");
        $(dom_tr).addClass("td_seled");
        $(dom_tr).attr("sel-flag", "true");
    }
    else {
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            $(this).attr("sel-flag", "false");
        });
        $(dom_tr).removeClass("td_seled");
        $(dom_tr).attr("sel-flag", "false");
    }
}
// 搜索所在位置的方法
function xw_grid_get_ele_position(dom_list, ele_name) {
    var dom_list_id = "#" + dom_list;
}
//#endregion

//#region 获取已选的信息
function xw_get_row(dom_id) {
    var dom_tb = "#" + dom_id + "_table_tb";
    var seled_list = [];
    var all_info_json = [];
    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        if ($(this).attr("sel-flag") == "true") {
            seled_list.push($(this).attr("id"));
        }
    });
    for (var i = 0; i < seled_list.length; i++) {
        var dom_tr = "#" + seled_list[i];
        var now_info_json = {};
        $(dom_tr).find("[xw-grid-el='td']").each(function () {
            var key = $(this).attr("td-name");
            var val = $(this).attr("td-val");
            now_info_json[key] = val;
        });
        all_info_json.push(now_info_json);
    }
    return all_info_json;
}
function xw_get_row_para(dom_id) {
    var dom_tb = "#" + dom_id + "_table_tb";
    var seled_list = [];
    var all_info_json = [];
    $(dom_tb).find("[xw-grid-el='tr']").each(function () {
        if ($(this).attr("sel-flag") == "true") {
            seled_list.push($(this).attr("id"));
        }
    });
    return seled_list;
}
function xw_get_repeat_sel(dom_id, dom_td, val) {
    var dom_tb = "#" + dom_id + "_table_tb";
    var query_dom_td = $(dom_tb).find(`[td-name='${dom_td}']`);
    var find_dom_td = "";
    for (var i = 0; i < query_dom_td.length; i++) {
        if ($(query_dom_td[i]).attr("td-val") == val) {
            find_dom_td = query_dom_td[i];
        }
    }
    // [td-val='${val}']
    // var a = $(dom_tb).find(`[td-name='${dom_td}']`); // 先找到td-name对应的元素
    // if (a.length > 0) {
    //     a = a.find(`[td-val='${val}']`); // 再在找到的元素内部查找td-val对应的元素
    // }
    if (isUndefine(find_dom_td)) { return ""; }
    return $(find_dom_td).attr(`area-des`);
}
//#endregion

//#region 上下左右控制
function ctr_u_d(dom_tr_id) {
    $(`#${dom_tr_id} input[type='text'],input[type='checkbox']`).keydown(function (e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 38) {
            var dom_list_id = $(this).closest("table").attr("id").split("_table_tb")[0];
            var px = $(this).closest("td").attr("px");
            var td_name = $(this).closest("td").attr("td-name");
            if (px > 1) {
                px--;
                var dom_td_id = px + "_" + dom_list_id + "_" + td_name;
                // 光标的换行
                var dom_gb_tb_id = px + "_" + dom_list_id;
                xw_grid_just_sel_one(dom_gb_tb_id, dom_list_id)
                xw_grid_td_click(dom_td_id, dom_list_id)
            }
            else {
                return;
            }
        }
        else if (key == 40) {
            var dom_list_id = $(this).closest("table").attr("id").split("_table_tb")[0];
            var px = $(this).closest("td").attr("px");
            var td_name = $(this).closest("td").attr("td-name");
            px++;
            var dom_td_id = px + "_" + dom_list_id + "_" + td_name;
            // 光标的换行
            var dom_gb_tb_id = px + "_" + dom_list_id;
            xw_grid_just_sel_one(dom_gb_tb_id, dom_list_id)
            xw_grid_td_click(dom_td_id, dom_list_id)

        }
    });
}
// var dq_sel_tr_id = null;
function ctr_l_r(dom_tr_id) {
    $(`#${dom_tr_id} input[type='text'],select,input[type='checkbox']`).keydown(function (e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 39) {  // 回车和右
            if (this == null) { return; }
            //阻止元素的默认行为
            e.preventDefault();
            try {
                var rowid = dom_tr_id.split("_")[0];
                console.log(this)
                var inputs = $(this).closest("[xw-grid-el='tr']").find(`[id^='${rowid}_']`);
                inputs.eq(inputs.index(this) + 1).focus();
                inputs.eq(inputs.index(this) + 1).select();

                var ii = inputs.eq(inputs.index(this) + 1).attr('id');
                // var dq_sel_tr_id = ii.match(/_\w+$/)[0].substring(1);

            }
            catch { return; }
        }
        else if (key == 37) {  // 左
            e.preventDefault();
            try {
                var rowid = dom_tr_id.split("_")[0];
                var inputs = $(this).closest("[xw-grid-el='tr']").find(`[id^='${rowid}_']`);
                console.log(inputs.index(this) - 1)
                if (inputs.index(this) > 0) {
                    inputs.eq(inputs.index(this) - 1).focus();
                    inputs.eq(inputs.index(this) - 1).select();
                    var ii = inputs.eq(inputs.index(this) - 1).attr('id');
                    // var dq_sel_tr_id = ii.match(/_\w+$/)[0].substring(1);
                }
            }
            catch { return; }
        }
        else if (key == 13) {
            if (this == null) { return; }
            //阻止元素的默认行为
            e.preventDefault();
            try {
                var dom_list_id = $(this).closest("table").attr("id").split("_table_tb")[0];
                var px = $(this).closest("td").attr("px");
                var td_name = $(this).closest("td").attr("td-name");
                var dom_td_id = px + "_" + dom_list_id + "_" + td_name;
                xw_grid_edit_fun(dom_td_id, dom_tr_id, dom_list_id); // 这里要加一层判断

                var overrid_flag = $(`#${dom_list_id}`).data("jsonOpt").overrid_enter;

                // console.log("中间回车/(ㄒoㄒ)/~~", overrid_flag)

                if (overrid_flag != true) {
                    px++;
                    var dom_td_id = px + "_" + dom_list_id + "_" + td_name;
                    // 光标的换行
                    var dom_gb_tb_id = px + "_" + dom_list_id;
                    xw_grid_just_sel_one(dom_gb_tb_id, dom_list_id)
                    xw_grid_td_click(dom_td_id, dom_list_id)
                }
            }
            catch { return; }
        }
    });
}
function xw_grid_only_enter(dom_tr_id) {
    $(`#${dom_tr_id} input[type='text'],select,input[type='checkbox']`).keydown(function (e) {

        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            if (this == null) { return; }
            //阻止元素的默认行为
            e.preventDefault();
            try {
                var dom_list_id = $(this).closest("table").attr("id").split("_table_tb")[0];
                var px = $(this).closest("td").attr("px");
                var td_name = $(this).closest("td").attr("td-name");
                var dom_td_id = px + "_" + dom_list_id + "_" + td_name;
                xw_grid_edit_fun(dom_td_id, dom_tr_id, dom_list_id); // 这里要加一层判断

                var overrid_flag = $(`#${dom_list_id}`).data("jsonOpt").overrid_enter;

                // console.log("中间回车/(ㄒoㄒ)/~~", overrid_flag)

                if (overrid_flag != true) {
                    px++;
                    var dom_td_id = px + "_" + dom_list_id + "_" + td_name;
                    // 光标的换行
                    var dom_gb_tb_id = px + "_" + dom_list_id;
                    xw_grid_just_sel_one(dom_gb_tb_id, dom_list_id)
                    xw_grid_td_click(dom_td_id, dom_list_id)
                }
            }
            catch { return; }
        }
    });
}
function xw_grid_edit_fun(dom_td_id, dom_tr_id, dom_list_id) {
    var opt_json = $("#" + dom_list_id).data("jsonOpt");

    var mid_edit_cb_fun = opt_json.mid_edit_cb_fun;
    if (!isUndefine(mid_edit_cb_fun)) {
        mid_edit_cb_fun(dom_td_id, dom_tr_id, dom_list_id)
    }
}
//#endregion

//#region 尾插的左右
function ctr_l_r_tail(dom_tr_id, dom_list_id) {

    $(`#${dom_tr_id} input[type='text'],select,input[type='checkbox']`).focus(function () {
        var opt_json = $("#" + dom_list_id).data("jsonOpt");
        if (opt_json.lastTrObj != "") {
            close_edit_td_not_change(opt_json.lastTrObj);
        }
    });

    $(`#${dom_tr_id} input[type='text'],select,input[type='checkbox']`).keyup(function (e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 39) {  // 回车和右
            if (this == null) { return; }
            //阻止元素的默认行为
            e.preventDefault();
            try {
                var rowid = dom_tr_id.split("_")[0];
                var inputs = $(this).closest("[xw-grid-el='add_tail_tr']").find(`[id^='edit_']`);
                inputs.eq(inputs.index(this) + 1).focus();
                inputs.eq(inputs.index(this) + 1).select();

                var ii = inputs.eq(inputs.index(this) + 1).attr('id');

                // var dq_sel_tr_id = ii.match(/_\w+$/)[0].substring(1);
            }
            catch { return; }
        }
        else if (key == 37) {  // 左
            e.preventDefault();
            try {
                var rowid = dom_tr_id.split("_")[0];
                var inputs = $(this).closest("[xw-grid-el='add_tail_tr']").find(`[id^='edit_']`);
                if (inputs.index(this) > 0) {
                    inputs.eq(inputs.index(this) - 1).focus();
                    inputs.eq(inputs.index(this) - 1).select();

                    var ii = inputs.eq(inputs.index(this) - 1).attr('id');
                    // var dq_sel_tr_id = ii.match(/_\w+$/)[0].substring(1);
                }
            }
            catch { return; }
        }
        else if (key == 13) {
            if (this == null) { return; }
            //阻止元素的默认行为
            e.preventDefault();
            try {
                var rowid = dom_tr_id.split("_")[0];
                var inputs = $(this).closest("[xw-grid-el='add_tail_tr']").find(`[id^='edit_']`);
                inputs.eq(inputs.index(this) + 1).focus();
                inputs.eq(inputs.index(this) + 1).select();

                var ii = inputs.eq(inputs.index(this) + 1).attr('id');

                // 新加的
                var opt_json = $(`#${dom_list_id}`).data("jsonOpt");
                var tail_edit_cb_fun = opt_json.tail_callback_fun;
                if (!isUndefine(tail_edit_cb_fun)) {
                    var dom_td = $(this).closest("td");
                    var dom_td_id = $(dom_td).attr("id");
                    tail_edit_cb_fun(dom_td_id, dom_tr_id, dom_list_id)
                }

                // var dq_sel_tr_id = ii.match(/_\w+$/)[0].substring(1);
            }
            catch { return; }

        }
        // else if(key == 40) {
        //     if(this == null) { return; }
        //     //阻止元素的默认行为
        //     e.preventDefault();
        //     try {
        //         var opt_json = $(`#${dom_list_id}`).data("jsonOpt");
        //         var tail_edit_cb_fun = opt_json.tail_callback_fun;
        //         if(!isUndefine(tail_edit_cb_fun)) {
        //             var dom_td = $(this).closest("td");
        //             var dom_td_id = $(dom_td).attr("id");
        //             tail_edit_cb_fun(dom_td_id, dom_tr_id, dom_list_id)
        //         }
        //     }
        //     catch{ return; }

        // }
    });
}
//#endregion

//#region 一键批量

//#endregion

//#region 是否启动拖动即可选中项功能
function xw_grid_drag_sel_one(dom_list_id) {
    if (isUndefine($(`#${dom_list_id}`).data('jsonOpt').allow_drag_sel_con) || $(`#${dom_list_id}`).data('jsonOpt').allow_drag_sel_con == false) { return; }

    $(`#${dom_list_id} tr[xw-grid-el='tr'] td[xw-grid-el='td_sel_con']`).on('mousedown', function (e) {
        // $(`#${dom_list_id}`).data('jsonOpt').drag_timer = setTimeout(function() {
        $(`#${dom_list_id}`).data('jsonOpt').sel_drag_flag = true;
        // }, 500);
    });

    $(`#${dom_list_id} tr[xw-grid-el='tr'] td[xw-grid-el='td_sel_con']`).on('mouseup', function (e) {
        // clearTimeout($(`#${dom_list_id}`).data('jsonOpt').drag_timer); // 清除定时器
        // console.log($(`#${dom_list_id}`).data('jsonOpt'))
        // $(`#${dom_list_id}`).data('jsonOpt').sel_drag_flag = false;
        // setTimeout(function() {
        $(`#${dom_list_id}`).data('jsonOpt').sel_drag_flag = false;
        // }, 600);

    });

    $(`#${dom_list_id} tr[xw-grid-el='tr'] td[xw-grid-el='td_sel_con']`).on('mousemove', function (e) {
        if ($(`#${dom_list_id}`).data('jsonOpt').sel_drag_flag) {
            var now_sel_td = $(this);
            var sel_flag_tr = now_sel_td.closest("tr[xw-grid-el='tr']").attr('sel-flag');
            // console.log(sel_flag_tr)
            if (sel_flag_tr == "true") { sel_flag_tr = true }
            else if (sel_flag_tr == "false") { sel_flag_tr = false }

            if (now_sel_td.length && !sel_flag_tr) {
                var dom_tr = now_sel_td.closest("tr[xw-grid-el='tr']").attr("id");
                var row_id = dom_tr.split("_")[0];
                var dom_tr_id = `${row_id}_${dom_list_id}`
                xw_grid_sel_one(dom_tr_id, `${dom_list_id}`)
            }
        }
    });

    // $(`#${dom_list_id} tr[xw-grid-el='tr'] td[xw-grid-el='td_sel_con']`).on('mouseleave', function(e) {
    //     clearTimeout($(`#${dom_list_id}`).data('jsonOpt').drag_timer); // 清除定时器
    //     // console.log($(`#${dom_list_id}`).data('jsonOpt'))
    //     $(`#${dom_list_id}`).data('jsonOpt').sel_drag_flag = false;
    // });
}
//#endregion

// xw_context 配置项
// var json_opt = {
//     menu_label: [
//         { label: "复制", hd_fun: function() { return add_console()  }  },
//         { label: "粘贴", hd_fun: function() { return edit_console() }  },
//         { label: "删除", hd_fun: function() { return del_console()  }  },
//         { label: "查看", hd_fun: function() { return view_console() }  }
//     ],
// remove_dom_flag: true,
// }

//#region 检查文本框是否必填

//#endregion

