const DEBUG = true

function UploadFile() {
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
    $.ajax({
        url: "http://localhost:8081/uploadfile",
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

// $(function (){
//     console.log("1111")
//     $("#download_button").click(function () {
//         // let code = $("#pickup_code").val()
//         console.log("download")
//         $.post("http://localhost:8081/downloadfile",
//             {
//                 code: $("#pickup_code").val()
//             },
//             function success(data) {
//                 let json = $.parseJSON(data)
//                 alert(json.text)
//             },
//             "json"
//         );
//         $("#pickupDialog").hide()
//         // todo download
//     });
// });

// $(function (){
//     console.log("1111")
//     $("#download_button").click(function () {
//         $.post("http://localhost:8081/downloadfile", {
//             code: $("#pickup_code").val(),
//         }, {
//             responseType: 'blob'
//         }).then(function (res){
//             let blob = res.data
//             let reader = new FileReader()
//             reader.readAsDataURL(blob)
//             reader.onload = function (e) {
//                 let a = document.createElement('a');
//                 let fileName = res.headers["content-disposition"].split("=")
//                 console.log(fileName)
//                 fileName = fileName[fileName.length - 1]
//                 console.log(fileName)
//                 fileName = fileName.replace(/"/g, "")
//                 a.download = fileName
//                 a.href = e.target.result
//                 document.body.appendChild(a)
//                 a.click()
//                 document.body.removeChild(a)
//             }
//         })
//         $("#pickupDialog").hide()
//     });
// })

$(function (){
    $("#download_button").click(function () {
        $.post("http://localhost:8081/downloadfile", {
            code: $("#pickup_code").val(),
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