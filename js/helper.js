const DEBUG = true

// ==========================test jquery========================
// $(function () {
//    alert("hello world by jquery")
// });

function UploadFile() {
    if (DEBUG) {
        console.log("UploadFile")
    }
    let select = $("#select_file")
    select.click()
    select.onchange = function () {
        $("#send_file").click()
    }
}

function UploadFile2() {
    let input_button = document.getElementById("select_file")
    let submit_button = document.getElementById("send_file")
    input_button.click()
    input_button.onchange = function () {
        submit_button.click()
    }
}

function saveReport() {
    if (DEBUG) {
        console.log("saveReport")
    }
    $.ajax({
        url: "./uploadfile",
        type: "POST",
        dataType: 'json',
        complete: function (rsp) {
            let json = JSON.parse(rsp.responseText)
            console.log(json)
            alert("文件上传成功， 取件码为：" + json["pickup_code"])
        },
        cache: false,
        data: new FormData($('#upload')[0]),
        processData: false,
        contentType: false,
        // contentType: "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW;",
    });
    return false;
}

$(function (){
    $("#download_button").click(function () {
        $.post("./downloadfile", {
            code: $("#pickup_code").val(),
            responseType: "blob",
        }).then(function (res, status, xhr){
            if (DEBUG) {
                console.log(res)
                console.log(xhr)
            }
            const fileName = xhr.getResponseHeader("Content-Disposition").match(
                /filename=(.*)/
            )[1]
            if (DEBUG) {
                console.log(fileName)
            }
            const blob = new Blob([res], { type: 'application/octet-stream' })
            if (typeof window.navigator.msSaveBlob != 'undefined') {
                // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
                window.navigator.msSaveBlob(blob, decodeURI(fileName))
            } else {
                // 创建新的URL并指向File对象或者Blob对象的地址
                const blobURL = window.URL.createObjectURL(blob)
                // 创建a标签，用于跳转至下载链接
                const templink = document.createElement('a')
                templink.style.display = 'none'
                templink.href = blobURL
                templink.setAttribute('download', decodeURI(fileName))
                // 兼容：某些浏览器不支持HTML5的download属性
                if (typeof templink.download == 'undefined') {
                    templink.setAttribute('target', '_blank')
                }
                document.body.appendChild(templink)
                templink.click()
                document.body.removeChild(templink)
                window.URL.revokeObjectURL(blobURL)
            }
        })
        $("#dialog_close_button").click()
    });
})

$(function () {
    $("#download_button").click(function () {
        let code = $("#pickup_code").val()
        $.ajax("./downloadfile", {

        })
    })
})

function SearchEnter(event) {
    let e = event || window.event
    if (e.keyCode === 13) {
        let word = $("#search-input").val()
        window.open("https://www.baidu.com/s?wd="+word)
    }
}

// $("#search-input").bind('keyup', function (event) {
//     if (DEBUG) {
//         console.log("enter word")
//     }
//     var e = event || window.event || arguments.callee.caller.arguments[0];
//     if (e.keyCode === 13) {
//         let word = $("#search-input").val()
//         window.open("https://www.baidu.com/s?wd="+word)
//     }
// })