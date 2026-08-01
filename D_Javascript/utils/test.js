function set_checkbox_div_gn(rowData) {
    let gn_id = rowData.gn_id;
    return `<input type="checkbox" id="${gn_id}_gn_id" onclick="set_mid_premission(${gn_id})" name="list_ck_checkbox" value="${gn_id}" style="width: 15px; height: 15px;">`
}