let newDate = ''
// getLangDate()

// function dataFilter(date) {
//     if (date < 10) {
//         return "0" + date
//     }
//     return date
// }

function getLangDate() {

    let dataFilter = val => val < 10 ? '0' + val : val

    let dateObj = new Date();
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    let weekday = dateObj.getDay();
    let weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    let weekstr = weeks[weekday]

    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    let second = dateObj.getSeconds();

    let str1 = dataFilter(year) + "-" + dataFilter(month) + "-" + dataFilter(day);
    let str2 = dataFilter(hour) + ":" + dataFilter(minute) + ":" + dataFilter(second);
    newDate = str1 + " " + str2
    console.log(newDate)
    document.getElementById("nowTime").innerText = newDate;
    // $("#nowTime").innerHTML = newDate;
    // setTimeout(getLangDate, 1000)
}

setInterval(getLangDate, 1000)