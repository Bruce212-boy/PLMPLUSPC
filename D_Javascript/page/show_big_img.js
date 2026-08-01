function show_big_img(img_url) {
   
    var img = new Image();
    img.src = img_url;
    var i_w=img.width; var i_h=img.height;
    var s_w=0;var s_h=0;
    var css="";

    if (i_w >= i_h) {
        if (i_w > 578) { s_w=578; s_h=parseInt(s_w*i_h/i_w);}
        else {s_h=i_h;s_w=i_w; }
        css = "style=\"width:"+s_w+"px;height:"+s_h+"px;border:solid 1px #000;\"";
    } else { 
        if (i_h > 550) { s_h = 550; s_w = parseInt(i_w * s_h / i_h); }
        else {s_h=i_h;s_w=i_w; }
        css = "style=\"width:"+s_w+"px;height:"+s_h+"px;border:solid 1px #000;\"";

    }

    var html = new StringBuffer;
    html.Append("<div class=\"cz_tupian_con\" style='height: calc(100% - 1px)' >\r\n");
    html.Append("<img "+css+" src=\""+img_url+"\">\r\n");
    html.Append("</div>\r\n");

    layer.open({
        type: 1,
        title: "大图片",
        content: html.ToString(),
        skin: "cust-open-page-skin",
        area: ["80%", "80%"]
    });

}

//#region 关闭大图片
function un_tk_img() {
    $("#tc_pg_img").remove();
    $("#tc_zz_img").remove();
}
//#endregion


