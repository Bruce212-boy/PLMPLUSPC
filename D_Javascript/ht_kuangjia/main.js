var dq_page_id=1000000;

function create(id, title, url) {
    dq_page_id=id;
    if ($("#page_" + id + "").length == 0) {
        var parent1 = $("#t_right2 ul");
        $("#t_right2 ul li").each(function () { this.className = ""; });
        $("#t_right2 ul li a").each(function () { this.className = ""; });
        if (id == "sy") {
            parent1.append("<li id=\"title_sy\" class=\"current\"><i class=\"fa fa-home fa-1g\"></i><span onclick=\"show_bq('sy');\">首页</span></li>");
        }
        else {
            parent1.append("<li id=\"title_" + id + "\" class=\"current\"><div onclick=\"show_bq('" + id + "');\">" + title + "</div><i class='tag_del' onclick=\"del_bq('" + id + "');\"></i></li>");
        }
        var parent2 = $("#right");
        $("#right iframe").each(function () { this.style.display = "none"; });
        parent2.append("<iframe id=\"page_" + id + "\" src=\"" + url + "\" width=\"100%\" height=\"100%\" scrolling=\"yes\" frameborder=\"0\">");

    }
    else {

        show_bq(id);
    }
}

function show_bq(id) {
    dq_page_id=id;
    $("#t_right2 ul li").each(function () { this.className = ""; });
    $("#t_right2 ul a").each(function () { this.className = ""; });
    $("#title_" + id + "").addClass("current");
    $("#title_" + id + " a").addClass("current");

    $("#right iframe").each(function () { this.style.display = "none"; });
    $("#page_" + id + "")[0].style.display = "inline";
    //if ($("#page_" + id + "")[0].src != "" && $("#page_" + id + "")[0].src.indexOf("login.html") == -1) {
    //    $("#page_" + id + "")[0].src = $("#page_" + id + "")[0].src;
    //}
    // console.log(id)


    $("#menu ul").each(function () { this.style.display = "none"; });
    $("#menu h1").each(function () { this.className = ""; });
    $("#menu ul li").each(function () {
        if (this.id == "li_" + id) {
            this.className = "current";
            var tfkjul=this.parentNode;
            var tfkjh1=   this.parentNode.previousElementSibling;
            // if($(this).hasClass("current")) {
            $(tfkjul).slideToggle(0).siblings("ul").slideUp(0);
            // }
            // else {
            //     $(tfkjul).slideToggle("slow").siblings("ul").slideUp("fast");
            // }
            tfkjh1.className = "current";
           
        }
        else {
            this.className = "";
        }
    });

    var a = cookie_sx();
    if(a == id) {
        $.cookie("yemian", "");
        sx_this_page();
    }
}

//#region 读cookie的页面信息
function cookie_sx() {
    var a = $.cookie("yemian");
    return a;
}
//#endregion

function del_bq(id) {
    $("#title_" + id + "").remove();
    $("#page_" + id + "").remove();

    var sel_ss_str = "首页";
    sel_ss_str = get_lan_new_str(sel_ss_str);

    if ($("#t_right2 ul").find("li").length == 1) {

       create('1000000', sel_ss_str,if_sy_url);
    }
    else {
        $("#t_right2 ul li:last-child").find("div")[0].click();

    }
}
function del_all() {
    $("#t_right2 ul").find("li").each(function (index, item) {
        if (index != 0) {
            item.remove();
        }
    })
    $("#right").find("iframe").each(function (index, item) {
        if (index != 0) {
            item.remove();
        }
    })
    $("#title_1000000").find("span")[0].click();
}

function del_all_except_me() {
    var current_index = 0;
    $("#t_right2 ul").find("li").each(function (index, item) {
        if($(this).attr("class") == "current") {
            current_index = index;
        }
        if (index != 0 && index != current_index) {
            item.remove();
        }
    })
    $("#right").find("iframe").each(function (index, item) {
        if (index != 0 && index != current_index) {
            item.remove();
        }
    })
    // $("#title_1000000").find("span")[0].click();
}

function u_menu() {
    $("#right")[0].className = "right_qb";
    $("#left").hide();

}

function s_menu() {
    $("#right")[0].className = "right";
    $("#left").show();
}

function sx_this_page() {
    var dizhi = $("#page_" + dq_page_id + "")[0].src;
    $("#page_" + dq_page_id + "")[0].src = dizhi;
}

function sys_exit() { 
    $.cookie('token', null,{ expires: -1, path: '/' });
    location.href="index.html";
}



