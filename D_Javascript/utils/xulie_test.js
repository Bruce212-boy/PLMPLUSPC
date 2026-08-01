const fs = require('fs');

// addNewKey("ALL_MY_INFO_UP", 1, 0, "PERMS_CUST_INFO", './BtnPerms.js', 'const BTN_PERMS = ');
// addNewKey("ALL_MY_INFO_DOWN", 2, 1, "PERMS_CUST_INFO", './BtnPerms.js', 'const BTN_PERMS = ');
function addNewKey(_newKey, _newValue, _position, _permKey, _filePath, _splitStr) {
    let filePath = _filePath;
    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error('读取文件时出错:', readErr);
            return;
        }

        let jsonData;
        try {
            jsonData = data.split(_splitStr)[1];
            jsonData = JSON.parse(jsonData);
            // jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('解析 JSON 时出错:', parseErr);
            return;
        }

        // 定义要插入的新键值对
        const newKey = _newKey;
        const newValue = _newValue;

        // 检查 _permKey 是否存在并且是一个对象
        if (jsonData[_permKey] && typeof jsonData[_permKey] === 'object') {
            // 获取当前的键数组
            const keys = Object.keys(jsonData[_permKey]);
            const values = Object.values(jsonData[_permKey]);

            // 查找要插入的位置（假设插入在值为 2 的键之后）
            const insertIndex = values.indexOf(_position);
            if (insertIndex === -1) {
                console.error(`未找到值为 ${_position} 的键。`);
                return;
            }

            // 插入新的键值对
            keys.splice(insertIndex + 1, 0, newKey);
            values.splice(insertIndex + 1, 0, newValue);

            // 创建一个新的对象，并重新分配键和值
            const updatedPerms = {};
            keys.forEach((key, index) => {
                updatedPerms[key] = values[index];
            });

            // 更新 _permKey
            jsonData[_permKey] = updatedPerms;

            // 递增后续的值
            for (let i = insertIndex + 2; i < keys.length; i++) {
                updatedPerms[keys[i]] = updatedPerms[keys[i]] + 1;
            }

            // 将更新后的数据转换为 JSON 字符串
            const newDataString = _splitStr + JSON.stringify(jsonData, null, 4); // 第二个参数为 replacer，第三个参数为缩进空格数

            // 写回 JSON 文件
            fs.writeFile(filePath, newDataString, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('写入文件时出错:', writeErr);
                    return;
                }
                console.log(`成功在 ${_permKey} 中插入新的键值对 "${newKey}: ${newValue}" 并递增后续值。`);
            });
        } else {
            console.error(`${_permKey} 不存在或不是一个对象。`);
        }
    });
}

removeOldKey('NEW', "PERMS_CUST_INFO", './BtnPerms.js', "const BTN_PERMS = ")
function removeOldKey(_newKey, _permKey, _filePath, _splitStr) {
    let filePath = _filePath;
    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error('读取文件时出错:', readErr);
            return;
        }

        let jsonData;
        try {
            jsonData = data.split(_splitStr)[1];
            jsonData = JSON.parse(jsonData);
            // jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('解析 JSON 时出错:', parseErr);
            return;
        }

        // 定义要移除的
        const removeKey = _newKey;
        if(jsonData[_permKey] && typeof jsonData[_permKey] === 'object') {
            const keys = Object.keys(jsonData[_permKey]);
            const removeIndex = keys.indexOf(removeKey);
            if (removeIndex === -1) {
                console.error(`未找到键 "${removeKey}"，无法移除。`);
                return;
            }
            keys.splice(removeIndex, 1);
            const updatedPerms = {};
            keys.forEach((key, index) => {
                updatedPerms[key] = index + 1; // 重新分配值，从 1 开始递增
            });
        
            // 更新 PERMS_CUST_INFO
            jsonData[_permKey] = updatedPerms;
        
            // 将更新后的数据转换为 JSON 字符串
            const newDataString = _splitStr + JSON.stringify(jsonData, null, 4); // 第二个参数为 replacer，第三个参数为缩进空格数
        
            // 写回 JSON 文件
            fs.writeFile(filePath, newDataString, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('写入文件时出错:', writeErr);
                    return;
                }
                console.log(`成功移除键 "${removeKey}" 并重新分配值。`);
            });
        }
        else {
            console.error(`"${_permKey}" 不存在或不是一个对象。`);
        }
    });
}

// resetValue("PERMS_CUST_INFO", './BtnPerms.js', 'const BTN_PERMS = ')
function resetValue(_permKey, _filePath, _splitStr) {
    let filePath = _filePath;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('读取文件时出错:', err);
            return;
        }

        let jsonData;
        try {
            jsonData = data.split(_splitStr)[1];
            jsonData = JSON.parse(jsonData);
        } catch (parseErr) {
            console.error('解析 JSON 时出错:', parseErr);
            return;
        }

        if(jsonData[_permKey] && typeof jsonData[_permKey] === 'object') {
            let keys = Object.keys(jsonData[_permKey]);
            let updateJson = {};
            keys.forEach((key, index) => {
                updateJson[key] = index + 1; 
            });
            jsonData[_permKey] = updateJson;

            const newDataString = _splitStr + JSON.stringify(jsonData, null, 4); // 第二个参数为 replacer，第三个参数为缩进空格数
            fs.writeFile(filePath, newDataString, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('写入文件时出错:', writeErr);
                    return;
                }
                console.log(`成功重新分配值。`);
            });
        }
        else {
            console.error(`${_permKey} 不是有效json`);
        }

    });
}

