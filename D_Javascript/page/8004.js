$(document).ready(function () {
    csh_skin();
    initPermsButton();
    initRolePageInfo();
});

//#region 初始化
function get_para() {

}
//#endregion

//#region 初始化有权限的按钮
//TODO 记得回来改全局变量
function initPermsButton() {
    let dynamic_list = [
        {
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ADD_ROLE,
            icon: 'addition',
            callback: initAddRole,
            params: "",
            btncss: "add_auto",
            txtcss: "",
            gn_id: 1,
            dom: ".top_box_btn_group",
            info: ""
        },
    ];
    for (let i = 0; i < dynamic_list.length; i++) {
        let obj = dynamic_list[i];
        // XWUTILS.renenderButton(obj);
        renender_button(obj);
    }

    $(".layui-tab .flex-ul [data-tab]").on('click', function(e) {
        let type = $(this).attr('data-tab');
        $(".layui-tab .flex-ul [data-tab-btn]").each(function() {
            $(this).addClass('display_none');
        });
        if(type == 1) {
            $(".layui-tab .flex-ul [data-tab-btn='1']").removeClass('display_none');
            $(".layui-tab .flex-ul [data-tab-btn='2']").addClass('display_none');
        }
        else if(type == 2) {
            $(".layui-tab .flex-ul [data-tab-btn='2']").removeClass('display_none');
            $(".layui-tab .flex-ul [data-tab-btn='1']").addClass('display_none');
        }
    });

}
//#endregion

//#region 异步初始化
async function initRolePageInfo() {
    await getDataUserBaseParamsInfo();
    await getDataCompanyStructureList();
    initGetDataUserManagerList();
    getDataRoleList();
}
//#endregion

//#region 初始化全局信息
let userBaseParamsInfo = {
    userDepartment: [],
    userPosition: [],
    userGrade: [],
    userStatus: [{ "zd_2": `${CONSTANS.PAGE_USER_MANAGER.STR_USER_ACTIVE}`, "zd_1": CONSTANS.NORMAL_VAL.VAL_YES },
    { "zd_2": `${CONSTANS.PAGE_USER_MANAGER.STR_USER_INACTIVE}`, "zd_1": CONSTANS.NORMAL_VAL.VAL_NO }],
    userDepartmentSelect: null,
    userPositionSelect: null,
    userGradeSelect: null,
    userStatusSelect: null,

    allPermissionList: [],
    loginUserCompanyList: [],
    loginUserCompanySelect: null,
}
async function getDataUserBaseParamsInfo() {
    let list_id = [CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_DEPARTMENT, CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_POSITION, CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_GRADE];

    let JsonPara = { list_id: list_id }
    let apiurl = APIS.APIS_USER_PARAM.getListByTypeIDs;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_USER_BASE_FAIL);
        return;
    }
    let dataList = [...re_obj.data];
    userBaseParamsInfo.userDepartment = dataList.filter(p => p.type_id == CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_DEPARTMENT);
    userBaseParamsInfo.userDepartmentSelect = Create_select("userDepartmentSelect", userBaseParamsInfo.userDepartment, "zd_1", "zd_2", -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 });

    userBaseParamsInfo.userPosition = dataList.filter(p => p.type_id == CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_POSITION);
    userBaseParamsInfo.userPositionSelect = Create_select("userPositionSelect", userBaseParamsInfo.userPosition, "zd_1", "zd_2", -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 });

    userBaseParamsInfo.userGrade = dataList.filter(p => p.type_id == CONSTANS.PAGE_USER_PARAMS.STR_SIGN_USER_GRADE);
    userBaseParamsInfo.userGradeSelect = Create_select("userGradeSelect", userBaseParamsInfo.userGrade, "zd_1", "zd_2", -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 });

    userBaseParamsInfo.userStatusSelect = Create_select("userStatusSelect", userBaseParamsInfo.userStatus, "zd_1", "zd_2", -1, { title: CONSTANS.NORMAL_STR.PLEASE_SELECT, value: -1 });
    
    JsonPara = {}
    apiurl = APIS.APIS_PERMISSION.getPermsRoleList;
    re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    userBaseParamsInfo.allPermissionList = [...re_obj.data];

}
async function getDataCompanyStructureList() {
    let JsonPara = {}
    let apiurl = APIS.APIS_USER_MANAGER.getLoginUserCompanyInfo;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        layer.alert(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    list.sort((a, b) => a.parent_id - b.parent_id);
    // 公司
    userBaseParamsInfo.loginUserCompanyList = list;
}

//#endregion


//#region 左侧所有角色

//#region 角色事件
function bindHoverRoleItem() {
    const roleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'inelement') {
                const target = $(mutation.target);
                const inElement = target.attr('inelement');

                if (inElement == CONSTANS.NORMAL_VAL.ONE) {
                    target.addClass('role-hover-style');
                } else {
                    target.removeClass('role-hover-style');
                }
            }
        });
    });

    $('.role').each(function () {
        roleObserver.observe(this, {
            attributes: true,
            attributeFilter: ['inelement']
        });
    });

    $('.role').on('mouseenter', function () {
        $('.role').attr('inelement', CONSTANS.NORMAL_VAL.ZERO); // 重置所有
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ONE);    // 设置当前
    });

    $('.role').on('mouseleave', function () {
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ZERO);
    });


}

function bindClickRoleItem() {
    $('.role').on('click', function (e) {
        let _this = $(this);
        $('.role').each(function (e) {
            $(this).removeClass("active");
        });
        _this.addClass('active');

        // 触发右侧
        getDataPermsMenu();
        getDataUserManagerList();
    });
    $(".role-dp").on("click", function (e) {
        let _this = $(this);
        $('.role-dp').each(function (e) {
            $(this).removeClass("active");
        });
        _this.addClass('active');

    });

    $(document).click(function (event) {
        // 检查点击目标是否是目标元素及其子元素
        if (!$(event.target).closest('.role-dp').length) {
            $('.role-dp').removeClass('active');
        }
    });

    let dropdown = layui.dropdown;
    dropdown.render({
        elem: '.role-dp',
        // trigger: 'click' // trigger 已配置在元素 `lay-options` 属性上
        data: [{
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_EDIT_ROLE,
            id: CONSTANS.PAGE_ROLE_PERMISSIONS.EDIT_ROLE
        }, {
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_COPY_ROLE,
            id: CONSTANS.PAGE_ROLE_PERMISSIONS.COPY_ROLE
        }, {
            title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_DEL_ROLE,
            id: CONSTANS.PAGE_ROLE_PERMISSIONS.DEL_ROLE
        }],
        click: function (obj, othis) {
            let qx_dom = $('.role-list').find('.role-dp.active');
            let qx_id = $(qx_dom).attr("data-id");
            let qx_title = $(qx_dom).attr("data-title");
            if (obj.id === CONSTANS.PAGE_ROLE_PERMISSIONS.EDIT_ROLE) {
                // 编辑
                initUpdateRole();
            } else if (obj.id === CONSTANS.PAGE_ROLE_PERMISSIONS.COPY_ROLE) {
                // 复制

            } else if (obj.id === CONSTANS.PAGE_ROLE_PERMISSIONS.DEL_ROLE) {
                // 删除
                del_role(qx_id, qx_title);
            }
        }
    });

    // 默认选第一个
    $(`.role-list [data-index='${CONSTANS.NORMAL_VAL.ONE}']`).addClass('active').attr('inelement', CONSTANS.NORMAL_VAL.ONE);
    getDataPermsMenu();
    getDataUserManagerList();
}

function bindHoverDataRoleItem(dataList) {
    if (dataList == undefined || dataList.length <= 0) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.NO_MORE_DATA);
        return;
    }

    let html = new StringBuffer();
    for (let i = 0; i < dataList.length; i++) {
        let obj = dataList[i];
        html.Append(`\r\n`);
        html.Append(`<div class="role" inelement="0" data-id="${obj.qx_id}" data-index="${i + 1}" data-title="${obj.qx_title}">\r\n`);
        html.Append(`    <div class="role-text">${obj.qx_title}</div>\r\n`);
        html.Append(`    <div class="role-dp-con">\r\n`);
        html.Append(`        <div class="role-dp" data-id="${obj.qx_id}" data-title="${obj.qx_title}">\r\n`);
        html.Append(`            <i class="layui-icon layui-icon-more-vertical layui-font-12"></i>\r\n`);
        html.Append(`        </div>\r\n`);
        html.Append(`    </div>\r\n`);
        html.Append(`</div>\r\n`);
    }
    $(".role-list").html(html.ToString());

    const roleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'inelement') {
                const target = $(mutation.target);
                const inElement = target.attr('inelement');

                if (inElement == CONSTANS.NORMAL_VAL.ONE) {
                    target.addClass('role-hover-style');
                } else {
                    target.removeClass('role-hover-style');
                }
            }
        });
    });

    $('.role').each(function () {
        roleObserver.observe(this, {
            attributes: true,
            attributeFilter: ['inelement']
        });
    });

    $('.role').on('mouseenter', function () {
        $('.role').attr('inelement', CONSTANS.NORMAL_VAL.ZERO); // 重置所有
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ONE);    // 设置当前
    });

    $('.role').on('mouseleave', function () {
        $(this).attr('inelement', CONSTANS.NORMAL_VAL.ZERO);
    });
}
//#endregion

//#region 查询角色
function getDataRoleList() {
    $(".role-list").html("");
    let JsonPara = {}
    let apiurl = APIS.APIS_PERMISSION.getPermsRoleList;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    let dataList = re_obj.data;
    bindHoverDataRoleItem(dataList);
    bindClickRoleItem();
}
//#endregion

//#region 添加角色
function initAddRole() {
    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td style="width: 85px" align="center">${CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ROLE_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_role_name" class="cz-input"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);
    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ADD_ROLE,
        area: ["350px", "280px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                addRole(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}

function addRole(tk_index) {
    let qx_title = $("#txt_edit_role_name").val();
    if (XWUTILS.isUndefine(qx_title)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { qx_title: qx_title }
    let apiurl = APIS.APIS_PERMISSION.addPermsRole;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataRoleList();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 修改角色名称
function initUpdateRole() {
    let qx_dom = $('.role-list').find('.role-dp.active');
    let qx_title = $(qx_dom).attr("data-title");

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <table name="mytable" class="grid" style="width: 100%">\r\n`);
    html.Append(`           <tr>\r\n`);
    html.Append(`               <td style="width: 85px" align="center">${CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ROLE_NAME}</td>\r\n`);
    html.Append(`               <td colspan="3"><input data-enter type="text" required="true" id="txt_edit_role_name" class="cz-input" value="${qx_title}"/></td>\r\n`);
    html.Append(`           </tr>\r\n`);
    html.Append(`       </table>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin",
        content: html.ToString(),
        title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_UPDATE_ROLE,
        area: ["350px", "280px"], // 初始宽高
        success: function (layero, index) {
            // 绑定输入框，然后提示必填项
            XWUTILS.bindAlertRequireItem();

            $("#btn_submit").on('click', function () {
                updateRole(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}

function updateRole(tk_index) {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }

    let qx_title = $("#txt_edit_role_name").val();
    if (XWUTILS.isUndefine(qx_title)) {
        XWUTILS.emitAlertRequireItem();
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_INPUT_TEXT);
        return;
    }

    let JsonPara = { qx_title: qx_title, qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.updatePermsRole;
    let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
    if (re_obj.flag == 1) {
        XWUTILS.msgLanNewStr(re_obj.msg);
        layer.close(tk_index);
        getDataRoleList();
    }
    else {
        XWUTILS.alertLanNewStr(re_obj.msg);
    }
}
//#endregion

//#region 复制角色 TODO

//#endregion

//#region 删除角色
function del_role(qx_id, qx_title) {
    if (qx_id == undefined) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }
    let confirm_tk = layer.confirm(CONSTANS.NORMAL_STR.CONFIRM_DELETE + " " + qx_title, () => {

        let JsonPara = { qx_id: qx_id }
        let apiurl = APIS.APIS_PERMISSION.delPermsRole;
        let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(re_obj.msg);
            getDataRoleList();
            layer.close(confirm_tk);
        }
        else {
            layer.close(confirm_tk);
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    });
}
//#endregion

//#endregion

//#region 右侧页面一 所有功能权限

//#region 功能权限事件
function bindClickFunMenuItem() {

    layui.form.on(`checkbox(all-perms-checkbox)`, function (data) {
        var elem = data.elem; // 获得 checkbox 原始 DOM 对象
        var checked = elem.checked; // 获得 checkbox 选中状态
        var value = elem.value; // 获得 checkbox 值
        var othis = data.othis; // 获得 checkbox 元素被替换后的 jQuery 对象

        if (checked) {
            $(`.module-title [data-high-level]`).prop("indeterminate", false);
            $(`.module-title [data-high-level]`).prop("checked", true);
            $(`.directory [data-high-level]`).prop("indeterminate", false);
            $(`.directory [data-high-level]`).prop("checked", true);
            $(`.checkbox-item [data-top-level]`).prop("checked", true);
        }
        else if (!checked) {
            $(`.directory [data-high-level]`).prop("indeterminate", false);
            $(`.module-title [data-high-level]`).prop("indeterminate", false);
            $(`.module-title [data-high-level]`).prop("checked", false);
            $(`.directory [data-high-level]`).prop("checked", false);
            $(`.checkbox-item [data-top-level]`).prop("checked", false);
        }
    });

    $('.authority-menu .menu-item').on('click', function (e) {
        debugger
        let _this = $(this);
        $('.authority-menu .menu-item').each(function (e) {
            $(this).removeClass("active");
        });
        _this.addClass('active');

        // 触发右侧滚动 TODO
        let cd_id = _this.data("menu-id");
        var targetInput = $(`.module-title .layui-form[data-menu-id="${cd_id}"]`);
        var container = $('.authority-page');
        var containerScrollTop = container.scrollTop();
        var elementOffset = targetInput.offset().top;
        var containerOffset = container.offset().top

        // $('.authority-page').scrollTop(700)

        // 计算元素在容器内的相对位置
        var scrollPosition = elementOffset - containerOffset + containerScrollTop;

        // 平滑滚动到目标位置
        container.animate({
            scrollTop: scrollPosition
        }, 500);
    });
}
//#endregion

//#region 查询一级菜单和二级菜单
async function getDataPermsMenu() {
    $("#authority-menu").html("");

    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }

    let JsonPara = { qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.getPermsMenuList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    let menuList = re_obj.data;
    initPermsMenu(menuList);

    let funList = await getDataFunList();
    initPermsPageAndFun(menuList, funList);

    await bindRoleSavedMenuAndFun(funList);
    bindClickFunMenuItem();
}
//#endregion

//#region 查询功能列表
async function getDataFunList() {
    $(".authority-page-con .middle-section").html("");

    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }

    let JsonPara = { qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.getPermsFunList;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return [];
    }
    let dataList = re_obj.data;
    return dataList;
}
//#endregion

//#region 显示一级菜单
function initPermsMenu(dataList) {
    if (XWUTILS.isUndefine(dataList) || dataList.length <= 0) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.NO_MORE_DATA);
        return;
    }

    let parentList = dataList.filter(p => p.p_id == CONSTANS.NORMAL_VAL.ZERO);

    let html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="menu-title">ERP权限</div>\r\n`);
    for (let i = 0; i < parentList.length; i++) {
        let obj = parentList[i]
        html.Append(`<div class="menu-item" data-menu-id="${obj.cd_id}">${obj.cd_title}</div>\r\n`);
    }
    $(`.authority-menu`).html(html.ToString());
}
//#endregion

//#region 显示二级菜单 和 显示功能列表
function initPermsPageAndFun(dataList, funList) {
    $(`.middle-section`).html("");
    if (XWUTILS.isUndefine(dataList) || dataList.length <= 0) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.NO_MORE_DATA);
        return;
    }

    let html = new StringBuffer();
    html.Append(`\r\n`);
    let parentList = dataList.filter(p => p.p_id == CONSTANS.NORMAL_VAL.ZERO);
    let sonList = dataList.filter(p => p.p_id != CONSTANS.NORMAL_VAL.ZERO);
    for (let i = 0; i < parentList.length; i++) {
        let pObj = parentList[i];
        let sonList = dataList.filter(p => p.p_id == pObj.cd_id);
        html.Append(`<div class="authority-module">\r\n`);
        html.Append(`   <div class="module-title">\r\n`);
        html.Append(`       <div class="layui-form" data-menu-id="${pObj.cd_id}">\r\n`);
        html.Append(`           <input type="checkbox" lay-filter="parent_${pObj.cd_id}" name="" title="${pObj.cd_title}" data-high-level="${pObj.cd_id}">\r\n`);
        html.Append(`       </div>\r\n`);
        html.Append(`       <div class="layui-form">\r\n`);
        html.Append(`           <input type="checkbox" lay-filter="parent_${pObj.cd_id}" name="" title="功能权限" data-high-level="${pObj.cd_id}">\r\n`);
        html.Append(`       </div>\r\n`);
        html.Append(`   </div>\r\n`);
        for (let j = 0; j < sonList.length; j++) {
            let sObj = sonList[j];
            let functionList = funList.filter(p => p.cd_id == sObj.cd_id)
            html.Append(`   <div class="module-content">\r\n`);
            html.Append(`       <div class="authority-checkbox">\r\n`);
            html.Append(`           <div class="directory">\r\n`);
            html.Append(`               <div class="layui-form">\r\n`);
            html.Append(`                   <input lay-filter="son_${sObj.cd_id}" type="checkbox" name="" title="${sObj.cd_title}" data-high-level="${pObj.cd_id}" data-now-level="${sObj.cd_id}">\r\n`);
            html.Append(`               </div>\r\n`);
            html.Append(`           </div>\r\n`);
            html.Append(`           <div role="group" aria-label="checkbox-group" class="checkbox-group">\r\n`);
            for (let k = 0; k < functionList.length; k++) {
                let fObj = functionList[k];
                html.Append(`               <div class="layui-form">\r\n`);
                html.Append(`                   <div class="checkbox-item">\r\n`);
                html.Append(`                       <input lay-filter="fun_${fObj.gn_id}" type="checkbox" name="" title="${fObj.gn_name}" data-high-level="${sObj.cd_id}" data-top-level="${pObj.cd_id}" data-now-level="${fObj.gn_id}">\r\n`);
                html.Append(`                   </div>\r\n`);
                html.Append(`               </div>\r\n`);
            }
            html.Append(`           </div>\r\n`);
            html.Append(`       </div>\r\n`);
            html.Append(`   </div>\r\n`);
        }
        html.Append(`</div>\r\n`);
    }
    $(`.middle-section`).html(html.ToString());
    layui.form.render();

    // 绑定 选择/全选 事件
    bindCheckBoxChangePerms(parentList, sonList, funList);
}

function bindCheckBoxChangePerms(parentList, sonList, funList) {
    checkAllCheckbox();

    for (let i = 0; i < parentList.length; i++) {
        let cd_id = parentList[i].cd_id;
        layui.form.on(`checkbox(parent_${cd_id})`, function (data) {
            var elem = data.elem; // 获得 checkbox 原始 DOM 对象
            var checked = elem.checked; // 获得 checkbox 选中状态
            var value = elem.value; // 获得 checkbox 值
            var othis = data.othis; // 获得 checkbox 元素被替换后的 jQuery 对象

            // XWUTILS.msgLanNewStr('checked 状态: ' + elem.checked);

            if (checked) {
                $(`.module-title [data-high-level="${cd_id}"]`).prop('indeterminate', false);
                $(`.module-title [data-high-level="${cd_id}"]`).prop("checked", true);
                $(`.directory [data-high-level="${cd_id}"]`).prop("indeterminate", false);
                $(`.directory [data-high-level="${cd_id}"]`).prop("checked", true);

                $(`.checkbox-item [data-top-level="${cd_id}"]`).prop("checked", true);
            }
            else if (!checked) {
                $(`.module-title [data-high-level="${cd_id}"]`).prop("checked", false);
                // $(`.module-title [data-high-level="${cd_id}"]`).prop('indeterminate', false);
                $(`.directory [data-high-level="${cd_id}"]`).prop("checked", false);

                $(`.checkbox-item [data-top-level="${cd_id}"]`).prop("checked", false);
            }

            checkAllCheckbox();
        });
    }

    for (let i = 0; i < sonList.length; i++) {
        let cd_id = sonList[i].cd_id;
        layui.form.on(`checkbox(son_${cd_id})`, function (data) {
            var elem = data.elem; // 获得 checkbox 原始 DOM 对象
            var checked = elem.checked; // 获得 checkbox 选中状态
            var value = elem.value; // 获得 checkbox 值
            var othis = data.othis; // 获得 checkbox 元素被替换后的 jQuery 对象

            // XWUTILS.msgLanNewStr('checked 状态: ' + elem.checked);

            let pId = $(elem).data("high-level");
            let sId = $(elem).data("now-level");

            if (checked) {
                $(`.checkbox-item [data-high-level="${cd_id}"]`).prop("checked", true);
            }
            else if (!checked) {
                $(`.checkbox-item [data-high-level="${cd_id}"]`).prop("checked", false);
            }

            checkPageCheckbox(pId, sId);

        });
    }

    for (let i = 0; i < funList.length; i++) {
        let gn_id = funList[i].gn_id;
        layui.form.on(`checkbox(fun_${gn_id})`, function (data) {
            var elem = data.elem; // 获得 checkbox 原始 DOM 对象
            var checked = elem.checked; // 获得 checkbox 选中状态
            var value = elem.value; // 获得 checkbox 值
            var othis = data.othis; // 获得 checkbox 元素被替换后的 jQuery 对象

            // XWUTILS.msgLanNewStr('checked 状态: ' + elem.checked);

            // if(checked) {
            //     $(`.checkbox-item [data-high-level="${cd_id}"]`).prop("checked", true);
            // }
            // else if(!checked) {
            //     $(`.checkbox-item [data-high-level="${cd_id}"]`).prop("checked", false);
            // }

            let pId = $(elem).data("top-level");
            let sId = $(elem).data("high-level");
            // console.log(pId, sId);

            // 反过来检查
            // checkFunCheckbox(gn_id);

            // 选中功能id的情况下，需要去半选菜单和顶部全选按钮
            checkFunCheckbox(pId, sId, gn_id);

        });
    }

}

// 检查并更新功能复选框状态的函数
function checkFunCheckbox(pId, sId, gn_id) {
    // 获取该子级下的所有功能复选框
    let funCheckboxes = $(`.checkbox-item [data-high-level="${sId}"]`);

    // 检查是否所有功能复选框都被选中
    let funAllChecked = funCheckboxes.length > 0 &&
        funCheckboxes.length == funCheckboxes.filter(':checked').length;

    let funCheckedLen = funCheckboxes.filter(':checked').length;

    // 如果全部选中了，子级全选，否则子级半选
    $(`.directory [data-now-level="${sId}"]`).prop("checked", funAllChecked);
    if (funCheckedLen > 0 && !funAllChecked) {
        $(`.directory [data-now-level="${sId}"]`).prop("checked", false);
        $(`.directory [data-now-level="${sId}"]`).prop("indeterminate", true);
    }
    else if (funCheckedLen == 0) {
        $(`.directory [data-now-level="${sId}"]`).prop("indeterminate", false);
        $(`.directory [data-now-level="${sId}"]`).prop("checked", false);
    }

    if (funAllChecked) {
        // 取消某个子级的半选
        $(`.directory [data-now-level="${sId}"]`).prop("indeterminate", false);

        // 获取该父级下的所有子级复选框
        let sonCheckboxes = $(`.directory [data-high-level="${pId}"]`);

        // 检查是否所有子级复选框都被选中
        let sonAllChecked = sonCheckboxes.length > 0 &&
            sonCheckboxes.length == sonCheckboxes.filter(':checked').length;

        // 如果全部选中了，父级全选，否则父级半选
        $(`.module-title [data-high-level="${pId}"]`).prop("checked", sonAllChecked);
    }
    else {
        // 接下来判断父是否需要全选或半选
        let sonCheckboxes = $(`.directory [data-high-level="${pId}"]`);
        let sonAllChecked = sonCheckboxes.length > 0 &&
            sonCheckboxes.length == sonCheckboxes.filter(':checked').length;

        let sonCheckedLen = sonCheckboxes.filter(':checked').length;
        if (sonCheckedLen == 0) {
            sonCheckedLen = sonCheckboxes.filter(function () {
                return this.indeterminate;
            }).length;
        }

        if (!sonAllChecked && sonCheckedLen > 0) {
            $(`.module-title [data-high-level="${pId}"]`).prop("checked", false);
            $(`.module-title [data-high-level="${pId}"]`).prop("indeterminate", true);
        }
        else if (sonCheckedLen == 0) {
            $(`.module-title [data-high-level="${pId}"]`).prop("indeterminate", false);
            $(`.module-title [data-high-level="${pId}"]`).prop("checked", false);
        }
    }

    checkAllCheckbox();

    // 如果使用了layui，需要更新样式
    layui.form.render('checkbox');
}

// 检查并更新子级复选框状态的函数
function checkPageCheckbox(pId, sId) {
    // 获取该父级下的所有子级复选框
    let sonCheckboxes = $(`.directory [data-high-level="${pId}"]`);

    // 检查是否所有子级复选框都被选中
    let sonAllChecked = sonCheckboxes.length > 0 &&
        sonCheckboxes.length == sonCheckboxes.filter(':checked').length;

    // 如果全部选中了，父级全选，否则父级半选
    $(`.module-title [data-high-level="${pId}"]`).prop("checked", sonAllChecked);

    let sonCheckedLen = sonCheckboxes.filter(':checked').length;

    if (!sonAllChecked && sonCheckedLen > 0) {
        $(`.module-title [data-high-level="${pId}"]`).prop("checked", false);
        $(`.module-title [data-high-level="${pId}"]`).prop("indeterminate", true);
    }
    else if (!sonAllChecked && sonCheckedLen == 0) {
        $(`.module-title [data-high-level="${pId}"]`).prop("indeterminate", false);
        $(`.module-title [data-high-level="${pId}"]`).prop("checked", false);
    }

    checkAllCheckbox();

    // 如果使用了layui，需要更新样式
    layui.form.render('checkbox');
}

// 检查并更新全选复选框状态的函数
function checkAllCheckbox() {
    let sonCheckboxes = $(`.directory [data-now-level]`);

    let sonAllChecked = sonCheckboxes.length > 0 &&
        sonCheckboxes.length == sonCheckboxes.filter(':checked').length;

    $(`[data-now-level="all"]`).prop("indeterminate", false);
    $(`[data-now-level="all"]`).prop("checked", sonAllChecked);

    let sonCheckedLen = sonCheckboxes.filter(function () {
        return this.indeterminate || this.checked;
    }).length;

    if (!sonAllChecked && sonCheckedLen > 0) {
        $(`[data-now-level="all"]`).prop("checked", false);
        $(`[data-now-level="all"]`).prop("indeterminate", true);
    }
    else if (!sonAllChecked && sonCheckedLen == 0) {
        $(`[data-now-level="all"]`).prop("indeterminate", false);
        $(`[data-now-level="all"]`).prop("checked", false);
    }
}
//#endregion

//#region 绑定当前角色曾经保存过的 菜单 以及 功能ID
async function bindRoleSavedMenuAndFun(allFunList) {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }

    let JsonPara = { qx_id: qx_id }
    let apiurl = APIS.APIS_PERMISSION.getPermsHasMenu;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    let menuList = re_obj.data;

    apiurl = APIS.APIS_PERMISSION.getPermsHasFun;
    re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    let funList = re_obj.data;

    // 绑定菜单
    for (let i = 0; i < menuList.length; i++) {
        let sId = menuList[i];

        let allFun = allFunList.filter(p => p.cd_id == sId);
        let allFunCount = 0;
        if (!XWUTILS.isUndefine(allFun) && allFun.length > 0) {
            allFunCount = allFun.length;
        }

        // 根据总数判断是否 半选 / 全选
        let savedFuns = funList.filter(p => p.cd_id == sId && !XWUTILS.isUndefine(p.gn_id));
        let savedFunCount = 0;
        if (!XWUTILS.isUndefine(savedFuns) && savedFuns.length > 0) {
            savedFunCount = savedFuns.length;
        }
        if (savedFunCount != allFunCount && savedFunCount > 0) {
            // 半选
            $(`.directory [data-now-level="${sId}"]`).prop("checked", false);
            $(`.directory [data-now-level="${sId}"]`).prop("indeterminate", true);
        }
        else {
            $(`.directory [data-now-level="${sId}"]`).prop("indeterminate", false);
            $(`.directory [data-now-level="${sId}"]`).prop("checked", true);
        }
        let pId = $(`.directory [data-now-level="${sId}"]`).data("high-level");
        checkPageCheckbox(pId, sId);
    }

    // 绑定功能
    for (let i = 0; i < funList.length; i++) {
        let gn_id = funList[i].gn_id;
        $(`.checkbox-item [data-now-level="${gn_id}"]`).prop("checked", true);
    }

}
//#endregion

//#region 保存菜单id以及功能id
async function savePermsPageAndFunList() {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }

    // 先获取所有的半选或勾选的cd_id
    let sonCheckboxes = $(`.directory [data-now-level]`).filter(function () {
        return this.indeterminate || this.checked;
    });

    // if (XWUTILS.isUndefine(sonCheckboxes)) {
    //     XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
    //     return;
    // }
    // else if (sonCheckboxes.length <= 0) {
    //     XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.OPT_FINISHED);
    //     return;
    // }

    // 再去for循环获取功能id和设置参数列表
    let paramList = [];
    for (let i = 0; i < sonCheckboxes.length; i++) {
        let dom = sonCheckboxes[i];
        let sId = $(dom).data("now-level");
        let funDoms = $(`.checkbox-item [data-high-level="${sId}"]`).filter(function () {
            return this.checked;
        });
        if (!XWUTILS.isUndefine(funDoms) && funDoms.length > 0) {
            for (let j = 0; j < funDoms.length; j++) {
                let funDom = funDoms[j];
                let gn_id = $(funDom).data("now-level");
                let obj = {
                    qx_id: qx_id,
                    cd_id: sId,
                    gn_id: gn_id
                }
                paramList.push(obj);
            }
        }
        else {
            let obj = {
                qx_id: qx_id,
                cd_id: sId,
                gn_id: ""
            }
            paramList.push(obj);
        }
    }

    var loadIndex = XWUTILS.loadDialog();
    debugger
    if (paramList.length == 0) {
        let JsonPara = { qx_id: qx_id }
        let apiurl = APIS.APIS_PERMISSION.cleanPermsAll;
        let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
        layer.close(loadIndex);
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(re_obj.msg);
            await getDataPermsMenu();
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }

    }
    else {
        let JsonPara = { list: paramList }
        let apiurl = APIS.APIS_PERMISSION.savePermsPageAndFun;
        let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
        layer.close(loadIndex);
        if (re_obj.flag == 1) {
            XWUTILS.msgLanNewStr(re_obj.msg);
            await getDataPermsMenu();
        }
        else {
            XWUTILS.alertLanNewStr(re_obj.msg);
        }
    }
}
//#endregion

//#endregion

//#region 右侧页面二 为当前权限增加使用用户

//#region 获取所有用户，并且预处理渲染
let listUserManager;
function initGetDataUserManagerList() {
    let list = [];
    let origionList = [];
    let jExcelObj = getUserManagerOptions(list);
    listUserManager = $("#listUserManager").jexcel({
        data: jExcelObj.data,
        columns: jExcelObj.columns,
        originData: origionList,
        allowContextMenu: false,
    });
    listUserManager.createCustomHeader();
    $("#listUserManager [data-input-sign]").on("keyup", function (e) {
        if ($(this).val() == "") {
            getDataUserManagerList();
        }
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.stopPropagation();
            getDataUserManagerList();
        }
    });
    $("#listUserManager [data-select-sign]").on("change", function (e) {
        getDataUserManagerList();
    });

    // getDataUserManagerList();
}
function getUserManagerOptions(list) {
    let columns = [
        { title: '公司ID', name: "gs_id", type: 'hidden', width: 60, readOnly: true },
        { title: '用户ID', name: "yh_id", type: 'text', width: 60, readOnly: true },
        { title: '登录账号', name: "username", type: 'text', width: 150, readOnly: true },
        // { title: '登录密码', name: "password", type: 'text', width: 150, readOnly: true },
        { title: '工号', name: "gonghao", type: 'text', width: 150, readOnly: true },
        { title: '姓名', name: "name", type: 'text', width: 150, readOnly: true },
        { title: '权限', name: "qx_id", type: 'text', width: 250, readOnly: true },
        { title: 'PC授权码', name: "pc_code", type: 'text', width: 150, readOnly: true },
        { title: '手机授权码', name: "tel_code", type: 'text', width: 150, readOnly: true },
        { title: '企业微信授权码', name: "qy_uid", type: 'text', width: 150, readOnly: true },
        { title: '电话', name: "tel", type: 'text', width: 150, readOnly: true },
        { title: '部门', name: "bm_id", type: 'text', customType: 'select', width: 150, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userDepartment, "zd_1", "zd_2") },
        { title: '职位', name: "zw_id", type: 'text', customType: 'select', width: 150, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userPosition, "zd_1", "zd_2") },
        { title: '水平', name: "sp_id", type: 'text', customType: 'select', width: 150, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userGrade, "zd_1", "zd_2") },
        { title: '状态', name: "zt_id", type: 'text', customType: 'select', width: 80, readOnly: true, baseInfo: XWUTILS.setSelectBaseInfo(userBaseParamsInfo.userStatus, "zd_1", "zd_2") },
        // { title: '选择品名', name: "sp_btn", type: 'custom', readOnly: true, width: 50, formatter: function (val, rowData, colIndex, rowIndex) { return create_btn(val, rowData) } },
    ];
    let jExcelObj = XWUTILS.dealTableExcelData(list, columns);
    return jExcelObj;
}
async function getDataUserManagerList() {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_RETRY_GET_ID_FAIL);
        return;
    }
    let gs_obj = userBaseParamsInfo.loginUserCompanyList[0];
    let gs_id = gs_obj.gs_id;
    // let qx_id = listUserManager.getCustomHeaderText("qx_id");
    let yh_id = listUserManager.getCustomHeaderText("yh_id");
    let username = listUserManager.getCustomHeaderText("username");
    let gonghao = listUserManager.getCustomHeaderText("gonghao");
    let name = listUserManager.getCustomHeaderText("name");
    let bm_id = listUserManager.getCustomHeaderText("bm_id");
    let zw_id = listUserManager.getCustomHeaderText("zw_id");
    let sp_id = listUserManager.getCustomHeaderText("sp_id");
    let zt_id = listUserManager.getCustomHeaderText("zt_id");

    var JsonPara = {
        yh_id: yh_id, username: username, gonghao: gonghao
        , name: name, bm_id: bm_id, zw_id: zw_id, sp_id: sp_id, qx_id: qx_id, zt_id: zt_id, gs_id: gs_id
    };
    let apiurl = APIS.APIS_USER_MANAGER.getUserListNotPage;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return null;
    }
    let list = re_obj.data;
    list.forEach(p => {
        p.qx_id = dealPermNumberStr(p.qx_id);
    });
    let jExcelObj = getUserManagerOptions(list);
    listUserManager.setData(jExcelObj.data);
}
// 预处理权限
function dealPermNumberStr(str) {
    if (XWUTILS.isUndefine(str)) {
        return "";
    }
    strs = str.split(',');
    let newStrs = [];
    if (!XWUTILS.isUndefine(strs) && strs.length > 0) {
        strs.forEach(p => {
            let item = userBaseParamsInfo.allPermissionList.find(k => k.qx_id == p);
            if (!XWUTILS.isUndefine(item)) {
                newStrs.push(item.qx_title);
            }
        });
    }
    let newStr = newStrs.join(',');
    return newStr;
}
//#endregion

//#region 为角色 添加用户的弹窗
function initAssignPermsToUser() {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    var html = new StringBuffer();
    html.Append(`\r\n`);
    html.Append(`<div class="cust-cz-con">\r\n`);
    html.Append(`   <div class="cz-middle">\r\n`);
    html.Append(`       <div id="transferAssiginPerms"></div>\r\n`);
    html.Append(`   </div>\r\n`);

    html.Append(`   <div class="cz_footer">\r\n`);
    html.Append(`       <button id="btn_submit" type="button" class="cz_fter_btn">${CONSTANS.NORMAL_STR.SUBMIT}</button>\r\n`);
    html.Append(`   </div>\r\n`);
    html.Append(`</div>\r\n`);
    var tk_index = layer.open({
        type: 1,
        skin: "cust-open-page-skin jexcel_custom_element",
        content: html.ToString(),
        title: CONSTANS.PAGE_ROLE_PERMISSIONS.STR_ASSING_PERMS_TO_USER,
        area: ["600px", "555px"], // 初始宽高
        success: function (layero, index) {
            initQualifiedUser();
            $("#btn_submit").on('click', function () {
                batchAssignPermsToUser(tk_index);
            });
        },
        end: function () {
            $("#btn_submit").off();
            $(`input[data-enter]`).off();
        }
    });
}
// 获取并过滤出复合条件的用户
let transfer;
async function initQualifiedUser() {
    let returnList = await getDataQualifiedUser();
    transfer = layui.transfer;
    // 数据
    // var data = [
    //   {"value": "1", "title": "李白"},
    //   {"value": "2", "title": "杜甫"},
    //   {"value": "3", "title": "苏轼"},
    //   {"value": "4", "title": "李清照"},
    //   {"value": "5", "title": "鲁迅", "disabled": true},
    //   {"value": "6", "title": "巴金"},
    //   {"value": "7", "title": "冰心"},
    //   {"value": "8", "title": "矛盾"},
    //   {"value": "9", "title": "贤心"}
    // ];
    let data = returnList.userList;
    let valued = returnList.value;
    // 渲染
    transfer.render({
      elem: '#transferAssiginPerms',
      id: 'transferAssiginPermsID',
      data: data,
      value: valued,
      title: [`${CONSTANS.PAGE_ROLE_PERMISSIONS.STR_CANDIDATE_USER}`, `${CONSTANS.PAGE_ROLE_PERMISSIONS.STR_SELECTED_USER}`],
      showSearch: true
    });
}
async function getDataQualifiedUser() {
    let gs_obj = userBaseParamsInfo.loginUserCompanyList[0];
    let gs_id = gs_obj.gs_id;
    let qx_id = "";
    let yh_id = "";
    let username = "";
    let gonghao = "";
    let name = "";
    let bm_id = "-1";
    let zw_id = "-1";
    let sp_id = "-1";
    let zt_id = "-1";

    var JsonPara = {
        gs_id: gs_id
    };
    let apiurl = APIS.APIS_USER_MANAGER.getUserListByCompany;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return null;
    }
    let userList = re_obj.data;

    let qx_dom = $('.role-list').find('.role.active');
    let now_qx_id = $(qx_dom).attr("data-id");
    let returnList = {
        userList: [],
        value: []
    };
    userList.forEach(p => {
        let qx_ids = "";
        if(!XWUTILS.isUndefine(p.qx_id)) {
            qx_ids = p.qx_id.split(',');
        }
        if(qx_ids.includes(now_qx_id)) {
            returnList.value.push(p.yh_id);
        }

        let newObj = {
            value: p.yh_id,
            title: p.name,
            qx_id: p.qx_id,
        }
        returnList.userList.push(newObj);
    });

    return returnList;
}
async function batchAssignPermsToUser(tk_index) {
    let qx_dom = $('.role-list').find('.role.active');
    let now_qx_id = $(qx_dom).attr("data-id");

    let dataList = transfer.getData('transferAssiginPermsID');
    let list_yh_id = dataList.map(p => p.value);

    let JsonPara = { qx_id: now_qx_id, list_yh_id: list_yh_id }
    let apiurl = APIS.APIS_PERMISSION.assignPermsToUser;
    let re_obj = await XWUTILS.promiseAJAX(JsonPara, apiurl)
    if (re_obj.flag != 1) {
        XWUTILS.alertLanNewStr(re_obj.msg);
        return;
    }
    layer.close(tk_index);
    await getDataUserManagerList();
}
//#endregion

//#region 移除用户
async function removePermsFromUser() {
    let qx_dom = $('.role-list').find('.role.active');
    let qx_id = $(qx_dom).attr("data-id");
    if (XWUTILS.isUndefine(qx_id)) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT_ITEM);
        return;
    }

    let objs = listUserManager.getSelectedRowsData();
    if (!objs || objs.length < 1) {
        XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.PLEASE_SELECT);
        return;
    }

    let tk = layer.confirm(CONSTANS.NORMAL_STR.CONFIRM_EXEC, () => {
        let flag = 1;
        var loadIndex = XWUTILS.loadDialog();

        for (let i = 0; i < objs.length; i++) {
            let obj = objs[i];
            let JsonPara = { yh_id: obj.yh_id, qx_id: qx_id }
            let apiurl = APIS.APIS_PERMISSION.removePermsFromUser;
            let re_obj = XWUTILS.AJAX(JsonPara, apiurl)
            if (re_obj.flag != 1) {
                flag = 0;
                break;
            }
        }
        layer.close(loadIndex);
        if (flag != 1) {
            XWUTILS.alertLanNewStr(CONSTANS.NORMAL_STR.OPT_FAILED);
        }
        else {
            XWUTILS.msgLanNewStr(CONSTANS.NORMAL_STR.SUCCESS);
            getDataUserManagerList();
        }
    });

}
//#endregion

//#endregion

