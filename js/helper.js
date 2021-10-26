function UploadFile() {
    let input_button = document.getElementById("select_file")
    let submit_button = document.getElementById("send_file")
    input_button.click()
    input_button.onchange = function () {
        submit_button.click()
    }
}

// todo
function saveReport() {
    // let options = {
    //     type: 'POST',
    //     dataType: 'json',
    //     success: function (responseText, statusText, xhr, $form) {
    //         alert(responseText.pickup_code)
    //     },
    //     complete: function (responseText) {
    //         alert(responseText.pickup_code)
    //     },
    //     clearForm: true
    // }
    htmlobj=$.ajax({
        url: "http://localhost:8081/uploadfile",
        type: "POST",
        dataType: 'json',
        complete: function (responseText) {
            alert(responseText.pickup_code)
            console.log(responseText)
        },
        success: function (responseText) {
            // alert(responseText.pickup_code)
            console.log(responseText)
        },
        contentType: "multipart/form-data;"
        // contentType: "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW;",
    });

    // let xmlhttp;
    // if (window.XMLHttpRequest) {
    //     xmlhttp = new XMLHttpRequest();
    // } else {
    //     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.open("POST", "", true)
    // console.log(xmlhttp.responseText)

    console.log("111")
    console.log(htmlobj.responseText)
    return false;
}