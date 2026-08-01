var XWUTILS = {
    isUndefine(item) {
        if (item === 0 || item === "0") {
            return false;
        }
        if (item == undefined || item == null || item == "undefined" || item == "null" || item == "") {
            return true;
        }
        return false;
    },
    renenderButton(list, funMap) {
        let funList = [];
        if (this.isUndefine(list)) {
            return;
        }
        list.forEach(p => {
            let gn_json = {};
            try {
                gn_json = JSON.parse(p.gn_json);
            }
            catch {
                gn_json = {
                    perm: "",
                    action: ""
                }
            }
            if (!this.isUndefine(gn_json.perm)) {
                funList.push(gn_json.perm);
            }
        });
        $('[data-perm]').each(function () {
            const _this = $(this);
            const permission = _this.data('perm');

            if (!funList.includes(permission)) {
                _this.hide(); // 或者 .hide() / .prop('disabled', true)
            }
            else {
                _this.show();
            }
        });

        // 事件委托绑定
        $(document).on('click', '[data-action]', function (e) {
            let action = $(this).data('action');
            if (funMap.get(action)) {
                funMap.get(action).call(this);
            }
        });
    },
    renenderContextButton(list, domId, options, className) {
        let funList = [];
        if (this.isUndefine(list)) {
            return;
        }
        list.forEach(p => {
            let gn_json = {};
            try {
                gn_json = JSON.parse(p.gn_json);
            }
            catch {
                gn_json = {
                    perm: "",
                    action: ""
                }
            }
            if (!this.isUndefine(gn_json.perm)) {
                funList.push(gn_json.perm);
            }
        });

        options.forEach(p => {
            let dataPerm = p.dataPerm;
            if (funList.includes(dataPerm)) {
                p.show = true;
            }
        });
        options = options.filter(p => p.show == true);

        let config = {
            domId: domId,
            className: className,
            options: options,
        }
        XWUTILS_LAYUI.openContextDropDown(config);
    },
    renenderTabButton(json) {
        const XW_DYNAMIC_INSERT_FLAG = {
            APP_PEND: 1,
            PRE_PEND: 2
        }

        let title = json.title;
        let callback = json.callback;
        let params = json.params;
        let btncss = json.btncss;
        let txtcss = json.txtcss;
        let gn_id = json.gn_id;
        let position = json.position; if (isUndefine(position)) { position = XW_DYNAMIC_INSERT_FLAG.APP_PEND; }
        let dom = json.dom;

        let html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<div class="top_box_tab_item ${btncss}" data-now-tab="${gn_id}">\r\n`);
        html.Append(`    <span class="top_box_tab_text ${txtcss}">${title}</span>\r\n`);
        html.Append(`</div>\r\n`);
        if (position == XW_DYNAMIC_INSERT_FLAG.APP_PEND) {
            $(`${dom}`).append(html.ToString());
        }
        else if (position == XW_DYNAMIC_INSERT_FLAG.PRE_PEND) {
            $(`${dom}`).prepend(html.ToString());
        }

        if (isUndefine(callback)) { return; }
        $(`${dom} div[data-now-tab='${gn_id}']`).on('click', function () {
            if (!isUndefine(params)) {
                callback(...params)
            }
            else {
                callback();
            }
        });
    },
    // 预处理按钮
    dealFunButtonJson(dataList) {
        let newList = [];
        for (let i = 0; i < dataList.length; i++) {
            let obj = dataList[i];
            if (XWUTILS.isUndefine(obj.gn_json)) {
                continue;
            }
            let gn_json;
            try {
                gn_json = JSON.parse(obj.gn_json);
            }
            catch {
                gn_json = {
                    gn_name: obj.gn_name,
                    perm: "",
                    action: "",
                }
            }

            let newObj = {
                gn_id: obj.gn_id,
                gn_name: obj.gn_name,
                perm: gn_json.perm,
                action: gn_json.action,
            }

            newList.push(newObj);
        }

        if (newList.length == 0) {
            return dataList;
        }
        return newList;
    },
    AJAX(JsonPara, apiurl) {
        var re_obj = null;
        var token = $.cookie("token");
        if (token == null || token == "null") {
            var tzurl = "";
            var tzpage = "login.html";
            var bdpage = window.location.pathname;
            bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
            if (bdpage == "index.html") { tzurl = tzpage; } else { tzurl = "../login.html"; }
            if (window != top) {
                top.location.href = tzurl;
            } else {
                location.href = tzurl;
            }
            return;
        }
        $.ajax({
            type: "post",
            url: APIS.api_yuming + apiurl,
            data: JSON.stringify(JsonPara),
            dataType: "json",
            traditional: true,
            async: false,
            contentType: "application/json; charset=utf-8",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", token);
            },
            success: function (data) {
                re_obj = data;
            },
            error: function (data) {
                re_obj = data;
            }
        });
        return re_obj;
    },
    promiseAJAX(JsonPara, apiurl) {
        var token = $.cookie("token");
        if (token == null || token == "null") {
            var tzurl = "";
            var tzpage = "index.html";
            var bdpage = window.location.pathname;
            bdpage = bdpage.substring(bdpage.lastIndexOf('/') + 1, bdpage.length);
            if (bdpage == "main.html") { tzurl = tzpage; } else { tzurl = "../index.html"; }
            if (window != top) {
                top.location.href = tzurl;
            } else {
                location.href = tzurl;
            }
            return;
        }
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: APIS.api_yuming + apiurl,
                data: JSON.stringify(JsonPara),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
                    XMLHttpRequest.setRequestHeader("token", token);
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });
    },
    bindAlertRequireItem() {
        // 绑定，然后提示
        $(`input[data-enter]`).on('keyup', function (e) {
            let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 13) {
                e.preventDefault();
                var currentInput = $(this);
                var inputs = $('input[data-enter]:not([readonly])');
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

        $(`input[id^="txt_edit_"][required="true"]`).on("blur", function () {
            let readonly = $(this).prop('readonly');
            let disabled = $(this).prop('disabled');
            if (readonly == true || disabled == true) {
                return;
            }

            let val = $(this).val();
            if (isUndefine(val)) {
                $(this).attr("placeholder", get_lan_new_str("请输入必填项"));
                $(this).addClass("require_color");
            }
            else {
                $(this).attr("placeholder", "");
                $(this).removeClass("require_color");
            }
        });
    },
    emitAlertRequireItem(prefix) {
        let flag = true;
        if (isUndefine(prefix)) { prefix = 'txt_edit' }
        $(`input[id^="${prefix}"][required]`).each(function () {
            let val = $(this).val();
            if (isUndefine(val)) {
                $(this).attr("placeholder", get_lan_new_str("请输入必填项"));
                $(this).addClass("require_color");
                flag = false;
            }
        });
        $(`tr[data-edit-panel] td select[required]`).each(function () {
            let val = $(this).val();
            if (isUndefine(val) || val + '' == '-1') {
                $(this).addClass("require_color");
                flag = false;
            }
        });
        return flag;
    },
    dealTableExcelData(data, columns) {
        // 从列配置中提取属性顺序
        const propertyOrder = columns.map(col => col.name);

        // 使用Set进行快速查找
        const validProperties = new Set(propertyOrder);

        // 处理数据数组
        const resultData = new Array(data.length);

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const newItem = {};

            // 只添加列配置中存在的属性
            for (let j = 0; j < propertyOrder.length; j++) {
                const prop = propertyOrder[j];
                if (item.hasOwnProperty(prop)) {
                    newItem[prop] = item[prop];
                }
            }

            resultData[i] = newItem;
        }

        // 如果结果数据为空，插入一个包含所有字段的空对象
        if (resultData.length == 0) {
            const emptyItem = {};
            for (let j = 0; j < propertyOrder.length; j++) {
                const prop = propertyOrder[j];
                emptyItem[prop] = "";
            }
            resultData.push(emptyItem);
        }

        return {
            data: resultData,
            columns: columns
        };
    },
    getLanNewStr(xw_str) {
        // TODO 国际化
        return xw_str;
        try {
            var lan_list = JSON.parse(sessionStorage.getItem('language_list'));
            var moren_lan_id = JSON.parse($.cookie('moren_lan_id'));
        }
        catch {
            return xw_str;
        }

        if (isUndefine(lan_list)) {
            lan_list = get_lang_list_temp();
            if (isUndefine(lan_list)) {
                return xw_str;
            }
        }
        if (isUndefine(moren_lan_id)) { moren_lan_id = 1; }

        // console.log("one", lan_list);
        // debugger;

        var new_xw_str = xw_str;
        if (moren_lan_id == 1) {
            new_xw_str = xw_str;
        }
        else if (moren_lan_id == 2) {
            var obj = lan_list.find(p => p.Lg_1 == xw_str);
            if (isUndefine(obj)) { new_xw_str = xw_str; }
            else { new_xw_str = obj.Lg_2; }
        }
        else if (moren_lan_id == 3) {
            var obj = lan_list.find(p => p.Lg_1 == xw_str);
            if (isUndefine(obj)) { new_xw_str = xw_str; }
            else { new_xw_str = obj.Lg_3; }
        }

        if (isUndefine(new_xw_str)) { new_xw_str = xw_str; }
        return new_xw_str;
    },
    msgLanNewStr(xw_str) {
        layer.msg(this.getLanNewStr(xw_str));
    },
    alertLanNewStr(xw_str) {
        layer.alert(this.getLanNewStr(xw_str));
    },
    loadDialog(xw_str) {
        if (this.isUndefine(xw_str)) {
            try {
                xw_str = CONSTANS.NORMAL_STR.LOADING;
                layer.msg(this.getLanNewStr(xw_str), {
                    icon: 16,
                    shade: 0.3
                });
            }
            catch {
                layer.msg(this.getLanNewStr(xw_str), {
                    icon: 16,
                    shade: 0.3
                });
            }
        }
        else {
            layer.msg(this.getLanNewStr(xw_str), {
                icon: 16,
                shade: 0.3
            });
        }
    },
    // 获取页面
    getPageHtml() {
        var this_page_str = window.location.pathname;
        var match = this_page_str.match(/page\/(.*?)\.html/);
        let result;
        if (match && match[1]) {
            result = match[1];
            return result;
        }
        return null;
    },
    // 获取页面可读和按钮可读权限
    getSafety() {
        let this_page = this.getPageHtml();
        if (this.isUndefine(this_page)) {
            return;
        }
        let JsonPara = { this_page: this_page }
        let apiurl = APIS.getSafty;
        let re_obj = this.AJAX(JsonPara, apiurl)
        if (re_obj.flag != 1) {
            top.location.href = "../404.html";
        }
        return re_obj;
    },
    // 获取树对象
    getLayerTreeObject(domId, idSign, nameSign) {
        let id = $(`#${domId}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr(`xw-sel-${idSign}`);
        let name = $(`#${domId}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr(`xw-sel-${nameSign}`);
        let obj = {
            name: name,
            id: id
        }
        return obj;
    },
    getLayerCompanyTreeObject(domId, idSign, nameSign, levelSign) {
        let id = $(`#${domId}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr(`xw-sel-${idSign}`);
        let name = $(`#${domId}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr(`xw-sel-${nameSign}`);
        let level = $(`#${domId}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr(`xw-sel-${levelSign}`);
        let obj = {
            name: name,
            id: id,
            level: level
        }
        return obj;
    },
    setSelectBaseInfo(json, idStr, nameStr, defaultVal, defaultStr) {
        var val_t = json.map(item => item[idStr] + ":" + item[nameStr]);
        var str = "";
        if (defaultVal == undefined) {
            str = `-1:${CONSTANS.NORMAL_STR.PLEASE_SELECT};`
        }
        else {
            str = `${defaultVal}:${defaultStr};`
        }
        val_t.forEach(e => {
            str += e + ";";
        });
        var res = str.slice(0, -1);
        return res;
    },
    // 获取系统参数
    async getDataSystemParamsByIds(listId) {
        let JsonPara = { list_id: listId }
        let apiurl = APIS.APIS_SYSTEM_PARAM.getListByTypeIDs;
        let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
        if (re_obj.flag != 1) {
            return null;
        }
        return re_obj.data;
    },
    // 获取用户参数
    async getDataUserParamsByIds(listId) {
        let JsonPara = { list_id: listId }
        let apiurl = APIS.APIS_USER_PARAM.getListByTypeIDs;
        let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
        if (re_obj.flag != 1) {
            return null;
        }
        return re_obj.data;
    },
    // 设置localStorage
    setLocalStorage(key, val) {
        try {
            val = JSON.stringify(val);
            localStorage.setItem(key, val);
            return true;
        }
        catch (e) {
            this.msgLanNewStr(e);
            return false;
        }
    },
    getLocalStorage(key) {
        try {
            let val = localStorage.setItem(key, val);
            val = JSON.parse(val);
            return val;
        }
        catch (e) {
            this.msgLanNewStr(e);
            return false;
        }
    },

    // 创建select静态或动态
    createGlobalStaticDataAndSelect(configs, dataList, globalVar) {
        configs.forEach(config => {
            let valKey = config.valKey;
            let textKey = config.textKey;
            if (valKey == undefined) {
                valKey = CONSTANS.NORMAL_STR.STR_FIELD_VAL;
                textKey = CONSTANS.NORMAL_STR.STR_FIELD_TEXT;
            }

            let defaultJson = config.defaultJson == undefined ? { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 } : config.defaultJson;

            let defaultVal = config.defaultVal;
            if (defaultVal != undefined) {
                debugger
            }
            if (defaultVal == undefined) {
                defaultVal = -1;
            }

            let dataObjectKey = config.dataObjectKey;
            if (dataObjectKey == undefined) {
                dataObjectKey = 'type_id';
            }

            let onChange = config.onChange == undefined ? '' : config.onChange;
            let onChangeParam = config.onChangeParam == undefined ? '' : config.onChangeParam;
            let dataAttr = config.dataAttr == undefined ? '' : config.dataAttr;

            if (config.sourceType === CONSTANS.NORMAL_VAL.SOURCE_FROM_NET) {
                globalVar[config.dataKey] = dataList.filter(p => p[`${dataObjectKey}`] == config.typeId);
            } else if (config.sourceType === CONSTANS.NORMAL_VAL.SOURCE_FROM_STATIC) {
                globalVar[config.dataKey] = config.staticData;
            }

            if (!this.isUndefine(config.selectKey)) {
                globalVar[config.selectKey] = Create_select(
                    config.selectKey,
                    globalVar[config.dataKey],
                    valKey,
                    textKey,
                    defaultVal,
                    defaultJson,
                    // { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: defaultVal },
                    onChange,
                    onChangeParam,
                    dataAttr
                );
            }
        });
    },

    // 判断某个对象中，各个有名字的列表Array是否任意一个不为空
    hasAnyNonEmptyList(searchParams, excludeKeys = []) {
        return Object.entries(searchParams).some(([key, list]) =>
            !excludeKeys.includes(key) &&
            Array.isArray(list) &&
            list.length > 0
        );
    },

    // 判断是否为管理员
    userIsAdmin(loginUserInfo) {
        if (this.isUndefine(loginUserInfo) || this.isUndefine(loginUserInfo.qx_id)) {
            return false;
        }
        let qx_id = userBaseParamsInfo.loginUserInfo.qx_id;
        qx_id = qx_id.split(',');
        if (qx_id.includes(CONSTANS.NORMAL_VAL.SYS_ADMIN_PERM + "")) {
            return true;
        }
        return false;
    },

    // 数字相等，'1'和1
    equalNumTransStr(val, valStr) {
        if (val + '' == valStr + '') {
            return true;
        }
        return false;
    },

    formartTime(fmt, date_str) {
        if (date_str == null) { return ""; }
        if (date_str.trim() == "") { return ""; }
        date_str = date_str.replace('T', " ");
        date_str = date_str.replace('上午', "");
        date_str = date_str.replace('下午', "");
        var p_date_str = date_str.replace(/\-/g, "/");
        var d_index = p_date_str.indexOf('.');
        var new_data = p_date_str;
        if (d_index != -1) {
            new_data = p_date_str.substr(0, p_date_str.indexOf('.'));
        }
        var date = new Date(new_data);
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "H+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },

    // 翻译日志json
    transFormMapOptionsData(str, options) {
        let a = str;
        if (XWUTILS.isUndefine(a)) {
            return '';
        }
        try {
            a = JSON.parse(a);
        }
        catch {
            console.log("transFormLog Error");
            return '';
        }
        let field = a[0].PropertyName;
        let oldVal = a[0].OldValue;
        let newVal = a[0].NewValue;
        let title = ``;
        try {
            let obj = options.find(p => p.name == field);
            title = obj.title;
            if (XWUTILS.isUndefine(title)) {
                title = '';
            }
        }
        catch {
            title = '';
        }
        let newStr = `${CONSTANS.NORMAL_STR.STR_FIELD}:<${title}> ${CONSTANS.NORMAL_STR.STR_FROM} ${oldVal} => ${newVal}`;
        return newStr;
    },

    deepClone(obj) {
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

}

var XWUTILS_LAYUI = {
    createRadio() {
        let html = "";
        html += `<div class="layui-form">\r\n`;
        html += `   <input type="radio" name="AAA" value="1" title="默认">\r\n`;
        html += `   <input type="radio" name="AAA" value="2" title="选中" checked>\r\n`;
        html += `   <input type="radio" name="AAA" value="3" title="禁用" disabled>\r\n`;
        html += `<div>\r\n`;
        return html;
    },
    // 查看公司树弹框
    openWindowQueryRegionCompanyTree(callback, companyList) {
        var html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<div class="cust-cz-con">\r\n`);
        html.Append(`   <div class="cz-middle">\r\n`);
        html.Append(`           <div class='cust-cz-con-tree' id="listCompanyTreeUniversal"></div>\r\n`);
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
                $("#btn_submit").on('click', function () {
                    execQueryRegionCompany(tk_index);
                });
                initCompanyStructureTreeUniveral(companyList);
            },
            end: function () {
                $("#btn_submit").off();
            }
        });

        function execQueryRegionCompany(tk_index) {
            let gs_obj = XWUTILS.getLayerCompanyTreeObject("listCompanyTreeUniversal", "gs-id", "gs-jc", "gs-lv");
            if (XWUTILS.isUndefine(gs_obj) || XWUTILS.isUndefine(gs_obj.id)) {
                XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
                return;
            }
            let gs_jc = gs_obj.name;
            let gs_id = gs_obj.id;

            let params = {
                gs_jc: gs_jc,
                gs_id: gs_id,
            }

            callback(params);
            layer.close(tk_index);
        }

        function preProcessTreeData(preList, pId, key, pIdKey) {
            let new_list = [];
            for (let i = 0; i < preList.length; i++) {
                let obj = preList[i];
                if (!isUndefine(obj[key]) && !isUndefine(obj[pIdKey]) && obj[pIdKey] == pId) {
                    obj.children = preProcessTreeData(preList, obj[key], key, pIdKey);
                    new_list.push(obj);
                }
            }
            return new_list;
        }

        function initCompanyStructureTreeUniveral(list) {
            list.forEach(p => {
                p.spread = true;
            });
            const minObj = list.reduce((min, current) => {
                return current.parent_id < min.parent_id ? current : min;
            });
            list = preProcessTreeData(list, minObj.parent_id, `gs_id`, `parent_id`);
            var tree = layui.tree;
            tree.render({
                elem: '#listCompanyTreeUniversal',
                data: list,
                onlyIconControl: true,  // 是否仅允许节点左侧图标控制展开收缩
                click: function (obj) {
                    // XWUTILS.msgLanNewStr(JSON.stringify(obj.data));
                    $(`#listCompanyTreeUniversal .layui-tree-txt`).removeClass("tree_active");
                    $(`#listCompanyTreeUniversal .layui-tree-entry`).attr("xw-sel-tree", "0");

                    $(`#listCompanyTreeUniversal [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first .layui-tree-txt`).addClass("tree_active");
                    $(`#listCompanyTreeUniversal [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-tree", "1");

                    $(`#listCompanyTreeUniversal [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-id", `${obj.data.gs_id}`);
                    $(`#listCompanyTreeUniversal [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-jc", `${obj.data.gs_jc}`);
                    $(`#listCompanyTreeUniversal [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-lv", `${obj.data.Lv}`);
                },
                customName: {
                    id: 'gs_id',
                    title: 'gs_jc',
                    children: 'children'
                }
            });
        }
    },
    // 查看归属人/所有用户 弹框
    openWindowAllUserList(callback, loginUserInfo) {
        let listAllUserUniversal;
        var html = new StringBuffer();
        html.Append(`\r\n`);
        html.Append(`<div class="cust-cz-con">\r\n`);
        html.Append(`   <div class="cz-middle">\r\n`);
        html.Append(`        <div class='cust-cz-con-list' ><div id="listAllUserUniversal"></div></div>\r\n`);
        html.Append(`        <div class="cust-cz-con-page-section">\r\n`);
        html.Append(`            <div class="cust-cz-con-page-content" id="listAllUserUniversalPager"></div>\r\n`);
        html.Append(`        </div>\r\n`);
        html.Append(`   </div>\r\n`);

        html.Append(`   <div class="cz_footer">\r\n`);
        html.Append(`       <button id="btn_user_universal_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
        html.Append(`   </div>\r\n`);
        html.Append(`</div>\r\n`);
        var tk_index = layer.open({
            type: 1,
            skin: "cust-open-page-skin jexcel_custom_element",
            content: html.ToString(),
            title: CONSTANS.PAGE_USER_MANAGER.STR_SELECT_USER,
            area: ["500px", "455px"], // 初始宽高
            success: function (layero, index) {
                $("#btn_user_universal_submit").on('click', function () {
                    execQueryRegionUserUniversal(tk_index);
                });
                initGetDataUserUniversalList();
            },
            end: function () {
                $("#btn_user_universal_submit").off();
            }
        });

        function execQueryRegionUserUniversal(tk_index) {
            let objs = listAllUserUniversal.getSelectedRowsData();
            if (!objs || objs.length > 1) {
                XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
                return;
            }
            let obj = objs[0];

            let gsr_id = obj.yh_id;
            let name = obj.name;

            let params = {
                gsr_id: gsr_id,
                name: name,
            }
            debugger
            callback(params);
            layer.close(tk_index);
        }

        async function initGetDataUserUniversalList() {
            let list = [];
            let origionList = [];
            let jExcelObj = getUserUniversalOptions(list);
            listAllUserUniversal = $("#listAllUserUniversal").jexcel({
                data: jExcelObj.data,
                columns: jExcelObj.columns,
                originData: origionList,
                allowContextMenu: false,
            });
            listAllUserUniversal.createCustomHeader();
            $("#listAllUserUniversal [data-input-sign]").on("keyup", function (e) {
                if ($(this).val() == "") {
                    getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
                }
                var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if (key == 13) {
                    e.stopPropagation();
                    getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
                }
            });
            $("#listAllUserUniversal [data-select-sign]").on("change", function (e) {
                getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
            });
            await getDataUserUniversalList(CONSTANS.NORMAL_VAL.ONE);
            initUserUniversalPager();
        }
        function getUserUniversalOptions(list) {
            let columns = [
                { title: '公司ID', name: "gs_id", type: 'hidden', width: 60, readOnly: true },
                { title: '用户ID', name: "yh_id", type: 'text', width: 60, readOnly: true },
                { title: '工号', name: "gonghao", type: 'text', width: 80, readOnly: true },
                { title: '姓名', name: "name", type: 'text', width: 150, readOnly: true },
                { title: '电话', name: "tel", type: 'text', width: 120, readOnly: true },
            ];
            let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
            return jExcelObj;
        }
        async function getDataUserUniversalList(pageindex) {
            let gs_id = loginUserInfo.gs_id;
            let qx_id = listAllUserUniversal.getCustomHeaderTextSelectAll("qx_id");
            let yh_id = listAllUserUniversal.getCustomHeaderText("yh_id");
            let username = listAllUserUniversal.getCustomHeaderText("username");
            let gonghao = listAllUserUniversal.getCustomHeaderText("gonghao");
            let name = listAllUserUniversal.getCustomHeaderText("name");
            let bm_id = listAllUserUniversal.getCustomHeaderTextSelectAll("bm_id");
            let zw_id = listAllUserUniversal.getCustomHeaderTextSelectAll("zw_id");
            let sp_id = listAllUserUniversal.getCustomHeaderTextSelectAll("sp_id");
            let zt_id = listAllUserUniversal.getCustomHeaderTextSelectAll("zt_id");

            var JsonPara = {
                pageindex: pageindex, yh_id: yh_id, username: username, gonghao: gonghao
                , name: name, bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, gs_id: gs_id, pagesize: 20
            };
            let apiurl = APIS.APIS_USER_MANAGER.getUserList;
            let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
            if (re_obj.flag != 1) {
                XWUTILS.alertLanNewStr(re_obj.msg);
                return null;
            }
            let list = re_obj.data;
            listAllUserUniversalPageCount = re_obj.totle;
            let jExcelObj = getUserUniversalOptions(list);
            listAllUserUniversal.setData(jExcelObj.data);
        }

        //#region 用户分页器
        let listAllUserUniversalPageCount = 0;
        function initUserUniversalPager() {
            var laypage = layui.laypage;
            // 自定义文本
            laypage.render({
                elem: 'listAllUserUniversalPager',
                count: listAllUserUniversalPageCount,
                limit: 20,
                first: `${CONSTANS.NORMAL_STR.STR_FIRST_PAGE}`,
                last: `${CONSTANS.NORMAL_STR.STR_LAST_PAGE}`,
                prev: `<em>${CONSTANS.NORMAL_STR.STR_PREV_PAGE}</em>`,
                next: `<em>${CONSTANS.NORMAL_STR.STR_NEXT_PAGE}</em>`,
                jump: function (obj, first) {
                    let currPage = obj.curr;
                    if (!first) {
                        getDataUserUniversalList(currPage);
                    }
                }
            });
        }
        //#endregion

    },
    openContextDropDown(config) {
        // config = {
        //     domId: '',
        //     isAllowSpread: false,
        //     className: 'jexcel_customer_element',
        //     autoIdFlag: true,
        //     options: [{
        //         title: "",
        //         id: "",
        //         callback: ""
        //     }, {}]
        // }
        let domId = config.domId;
        if (domId == undefined) {
            return;
        }
        let options = config.options;
        let className = config.className == undefined ? '' : config.className;
        let isAllowSpread = config.isAllowSpread == undefined ? false : config.className;
        let autoIdFlag = config.autoIdFlag == undefined ? false : config.autoIdFlag;
        let data = [];

        options.forEach(p => {
            let id;
            if (autoIdFlag) {

            }
            let obj = {
                title: p.title,
                id: p.id
            }
            data.push(obj);
        });

        var dropdown = layui.dropdown;
        // 右键菜单
        dropdown.render({
            elem: '#' + domId, // 也可绑定到 document，从而重置整个右键
            trigger: 'contextmenu', // contextmenu
            isAllowSpread: isAllowSpread, // 禁止菜单组展开收缩
            style: 'width: 200px', // 定义宽度，默认自适应
            className: className,
            data: data,
            click: function (obj, othis) {
                let callBackId = obj.id;
                let opt = options.find(p => p.id == callBackId);
                let callback = opt.callback;
                if (callback != undefined) {
                    callback();
                }
            }
        });
    }
}

// var XWUTILS_GLOBAL_VAR = {
//     SELECT_LOG_OPERATE_STATIC_JSON: [
//         {
//             text: CONSTANS.NORMAL_STR.STR_ADD,
//             val: 1,
//         },
//         {
//             text: CONSTANS.NORMAL_STR.STR_UPDATE,
//             val: 2,
//         },
//         {
//             text: CONSTANS.NORMAL_STR.STR_DEL,
//             val: 3,
//         }
//     ],

// }

//#region 触发input的required
function emit_required_input(prefix) {
    if (isUndefine(prefix)) { prefix = 'txt_edit' }
    $(`input[id^="${prefix}"][required]`).each(function () {
        let val = $(this).val();
        if (isUndefine(val)) {
            $(this).attr("placeholder", get_lan_new_str("请输入必填项"));
            $(this).addClass("require_color");
        }
    });

}
//#endreigon

//#region 页面鉴权
function safety() {
    var this_page_str = window.location.pathname;
    var this_page = "page/" + this_page_str.split("/")[2];
    var apiurl = "api/quanxian/get_safety";
    var JsonPara = { this_page: this_page }
    var re_obj = tf_ajax(JsonPara, apiurl);
    if (re_obj.flag == 0) {
        top.location.href = "../404.html";
    }
    else {
        return 1;
    }
}
//#endregion

//#region 渲染设置下拉框
// get_select_name(val, kh_type_json, "zd_1", "zd_2");
function get_select_name(temp, list, key_val, key_title) {
    if (isUndefine(list) || list.length == 0) { return temp; }
    let result = "";
    let temp_int = parseInt(temp);
    var p_obj = list.find(p => p[key_val] == temp_int);
    if (p_obj != null) { result = p_obj[key_title]; }
    return result;
}
//#endregion

//#region 刷新回到自己
// flush_return_now_page("pager_1", getdata_1, "list_1", "sq_id", sq_id);
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

//#region 渲染权限按钮
function renender_button(json) {
    const XW_DYNAMIC_INSERT_FLAG = {
        APP_PEND: 1,
        PRE_PEND: 2
    }

    let title = json.title;
    let icon = json.icon;
    let callback = json.callback;
    let params = json.params;
    let btncss = json.btncss;
    let txtcss = json.txtcss;
    let gn_id = json.gn_id;
    let position = json.position; if (isUndefine(position)) { position = XW_DYNAMIC_INSERT_FLAG.APP_PEND; }
    let dom = json.dom;

    let html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div aria-btn-cb="${gn_id}" class="top_box_btn_item ${btncss}">
        <span class="my-icon layui-icon layui-icon-${icon}"></span><span class="text ${txtcss}">${title}</span></div>\r\n`);
    if (position == XW_DYNAMIC_INSERT_FLAG.APP_PEND) {
        $(`${dom}`).append(html.ToString());
    }
    else if (position == XW_DYNAMIC_INSERT_FLAG.PRE_PEND) {
        $(`${dom}`).prepend(html.ToString());
    }

    if (isUndefine(callback)) { return; }
    $(`${dom} div[aria-btn-cb='${gn_id}']`).on('click', function () {
        if (!isUndefine(params)) {
            callback(...params)
        }
        else {
            callback();
        }
    });
}

// let btn_json = {
//     title: get_lan_new_str("查询"),
//     icon: 'search',
//     callback: getdata_1,
//     params: "",
//     btncss: "",
//     txtcss: "fcc",
//     gn_id: 1,
//     dom: ".xw_left_con .top_box .top_box_btn_group.mgl_left"
// }
// renender_button(btn_json);
//#endregion

//#region 渲染按钮（Tab）版本
function renender_tab_button(json) {
    const XW_DYNAMIC_INSERT_FLAG = {
        APP_PEND: 1,
        PRE_PEND: 2
    }

    let title = json.title;
    let callback = json.callback;
    let params = json.params;
    let btncss = json.btncss;
    let txtcss = json.txtcss;
    let gn_id = json.gn_id;
    let position = json.position; if (isUndefine(position)) { position = XW_DYNAMIC_INSERT_FLAG.APP_PEND; }
    let dom = json.dom;

    let html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="top_box_tab_item ${btncss}" data-now-tab="${gn_id}">\r\n`);
    html.Append(`    <span class="top_box_tab_text ${txtcss}">${title}</span>\r\n`);
    html.Append(`</div>\r\n`);
    if (position == XW_DYNAMIC_INSERT_FLAG.APP_PEND) {
        $(`${dom}`).append(html.ToString());
    }
    else if (position == XW_DYNAMIC_INSERT_FLAG.PRE_PEND) {
        $(`${dom}`).prepend(html.ToString());
    }

    if (isUndefine(callback)) { return; }
    $(`${dom} div[data-now-tab='${gn_id}']`).on('click', function () {
        if (!isUndefine(params)) {
            callback(...params)
        }
        else {
            callback();
        }
    });
}
//#endregion

//#region 渲染树
function render_company_tree(dom_id, list) {
    var tree = layui.tree;
    // 渲染
    tree.render({
        elem: `#${dom_id}`,
        data: list,
        onlyIconControl: true,  // 是否仅允许节点左侧图标控制展开收缩
        click: function (obj) {
            // layer.msg(JSON.stringify(obj.data));
            $(`#${dom_id} .layui-tree-txt`).removeClass("tree_active");
            $(`#${dom_id} .layui-tree-entry`).attr("xw-sel-tree", "0");

            $(`#${dom_id} [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first .layui-tree-txt`).addClass("tree_active");
            $(`#${dom_id} [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-tree", "1");
            $(`#${dom_id} [data-id="${obj.data.gs_id}"].layui-tree-set .layui-tree-entry:first`).attr("xw-sel-gs-id", `${obj.data.gs_id}`);
        },
        customName: {
            id: 'gs_id',
            title: 'gs_jc',
            children: 'children'
        }
    });
}
//#region 预处理树迭代
function pre_process_tree_data(pre_list, pid) {
    let new_list = [];
    for (let i = 0; i < pre_list.length; i++) {
        let obj = pre_list[i];
        if (!isUndefine(obj.gs_id) && !isUndefine(obj.parent_id) && obj.parent_id == pid) {
            obj.children = pre_process_tree_data(pre_list, obj.gs_id);
            new_list.push(obj);
        }
    }
    return new_list;
}
//#endregion

//#region 获取选择的迭代树信息
function xw_get_layer_tree(dom_id) {
    let a = $(`#${dom_id}`).find(`.layui-tree-entry[xw-sel-tree="1"]`).attr("xw-sel-gs-id");
    return a;
}
//#endregion
//#endregion

//#region 打开公司结构树弹窗 版本1
function open_company_struct_tree(callback) {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cz_con cust-cz-con">\r\n`);
    html.Append(`    <div class="clearfix hei95">\r\n`);
    html.Append(`       <div class="xw_grid_main con_height_nopage hei95-20">\r\n`);
    html.Append(`           <div id="list_company_detail" class=""></div>\r\n`);
    html.Append(`       </div>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_set_company" type="button" class="cz_fter_btn">${get_lan_new_str('提交')}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: get_lan_new_str("选择公司"),
        area: ["350px", "320px"], // 初始宽高
        success: function (layero, index) {
            $("#btn_set_company").on('click', function () {
                if (!isUndefine(callback)) {
                    callback(tk_index);
                }
            });
            render_company_tree('list_company_detail', company_struct_data);
        },
        end: function () {
            $("#btn_set_company").off();
        }
    });
}
// 1001

// 10002
// function set_li_company(tk_index) {
//     let gs_id = xw_get_layer_tree("list_company_detail");
//     if (isUndefine(gs_id)) { layer.msg(get_lan_new_str("请选一项")); return; }
//     let obj = origin_company_data.find(p => p.gs_id == gs_id);

//     $("#txt_li_company_info").val(obj.gs_id);
//     $("#li_company_info").text(obj.gs_jc);
//     layer.close(tk_index);
// }
//#endregion

//#region 判空
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


