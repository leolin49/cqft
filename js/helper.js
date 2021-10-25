function UploadFile() {
    let input_button = document.getElementById("select_file")
    let submit_button = document.getElementById("send_file")
    input_button.click()
    input_button.onchange = function () {
        submit_button.click()
    }
}