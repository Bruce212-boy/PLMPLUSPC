document.onkeydown = function (evt) {
    var isie = (document.all) ? true : false;
    var key;
    var srcobj;
    // if the agent is an IE browser, it's easy to do this.
    if (isie) {
        key = event.keyCode;
        srcobj = event.srcElement;
    }
    else {
        key = evt.which;
        srcobj = evt.target;
    }
    //if (evt.shiftKey && evt.keyCode == 13) {
    //    evt.cancelBubble = true;
    //    evt.preventDefault();
    //    evt.stopPropagation();
    //}
    if (key == 13 && srcobj.type != '') {
        if (isie)
            event.keyCode = 9;
        else {
            var el = getNextElement(evt.target);
            if (el.type != 'hidden') {
                //nothing to do here.
            }
            else {
                while (el.type == 'hidden')
                    el = getNextElement(el);

            }
            if (!el) {
                return false;
            }
            else {
                el.focus();
            }
        }
    }

}
 
function getNextElement(field) {
    var form = field.form;
    for(var e = 0; e < form.elements.length; e++) {
        if (field == form.elements[e])
        break;
    }
    return form.elements[++e % form.elements.length];
}  
 