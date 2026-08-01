function safety() {
    var this_page_str = window.location.pathname;
    var this_page = "page/" + this_page_str.split("/")[2];

    var apiurl = "api.aspx/get_safety";
    var JsonPara = {this_page: this_page}
    var re_obj = tf_ajax(JsonPara, apiurl);
    if(re_obj.flag == 0) {
        top.location.href = "../login.html";
    }
}
safety();

