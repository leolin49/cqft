function UploadFile() {
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