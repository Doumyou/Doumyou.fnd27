'use strict'

//今日の日付を取得
let today = new Date();                     //今日の日付を取得
let currentYear = today.getFullYear();      //今日の日付から年を取得
let currentMonth = today.getMonth();        //今日の日付から月を取得

//年の取得(1年前から3年後まで)
function generateYearRange(start, end){
    let years = "";      //初期化
    for (let i = start; i <= end; i++){        //対象年分のhtml文を取得する
        years += "<option value='" + i + "'>" + i + "年" + "</option>";
    }
    return years;
}

//月の取得
function generateMonthRange(){
    let Month = "";      //初期化
    for (let i = 0; i <= 11; i++){        //対象年分のhtml文を取得する
        Month += "<option value='" + i + "'>" + (i + 1) + "月" + "</option>";
    }
    return Month;
}

//日の取得
function generateDayRange(end){
    let days = "";
    for (let i = 0; i < end; i++){        //対象年分のhtml文を取得する
        days += "<option value='" + i + "'>" + (i + 1) +"日" + "</option>";
    }
    return days;
}

let startYear = today.getFullYear() - 1;    //1年前を取得
let endYear = today.getFullYear() + 3;      //3年後を取得
let createYear = generateYearRange(startYear, endYear);     //-1年～+3年までのhtml文を取得
document.getElementById("year").innerHTML = createYear;     //htmlのID=yearにhtml文としてcreateYearの値を追加
document.getElementById("reserveYear").innerHTML = createYear;     //htmlのID=reserveYearにhtml文としてcreateYearの値を追加
let createMonth = generateMonthRange();     //-1年～+3年までのhtml文を取得
document.getElementById("month").innerHTML = createMonth;     //htmlのID=yearにhtml文としてcreateYearの値を追加
document.getElementById("reserveMonth").innerHTML = createMonth;     //htmlのID=yearにhtml文としてcreateYearの値を追加


//カレンダー取得時の年・月のドキュメント要素を取得
let selectYear = document.getElementById("year");       //年
let selectMonth = document.getElementById("month");     //月

//カレンダー作成時の要素取得
let calendar = document.getElementById("calendar");     //ID=calendarを取得
let lang = calendar.getAttribute("data-lang");          //ID=calendarのdata-lang要素を取得

//各月, 曜日を配列データとして取得 (表示用)
const monthName = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const dayName=["日","月", "火", "水", "木", "金", "土"];

//曜日データをhtml文に反映
let dayhead = "<tr>";
for (let i = 0; i < dayName.length; i++){       //各曜日の表示となるようにhtml文を取得
    dayhead += "<th data-days='" + dayName[i] + "'>" + dayName[i] + "</th>";
}
dayhead += "</tr>"
document.getElementById("theadWeekday").innerHTML = dayhead;    //htmlのID=theadWeekdayにhtml文としてdayheadの値を追加

//散歩当番のリスト
const dutyName  = ["", "お父さん", "お母さん", "直哉", "茜里"];
let dutyCode;
for (let i = 0; i < dutyName.length; i++){
    dutyCode += "<option value='" + dutyName[i] + "'>" + dutyName[i] + "</option>";
}
document.getElementById("amWalk").innerHTML = dutyCode;
document.getElementById("pmWalk").innerHTML = dutyCode;

//カレンダーの作成
function createCalendar(year, month){
    //ID=year,monthに表示させる年月の値を入れる
    selectYear.value = year;
    selectMonth.value = month;

    //カレンダーの表題を表示(年月)を入れる
    // document.getElementById("yearAndMonth").innerHTML = year + "年 " + monthName[month];

    //表示月の初日の曜日を取得
    let firstDay = (new Date(year, month )).getDay();    //数字で出力される(0:日曜, 1:月曜 ～)
    //カレンダーの日数を入れる
    let tableCode = document.getElementById("tableBody");   //IDの設定
    tableCode.innerHTML = "";
    let date = 1;
    let endDate = (new Date(year, month + 1, 0)).getDate();  //月の最終日を取得
    let htmlCode;           //html文(全文)
    let dayCode;            //html文(1日分)
    let daySentence;        //html内に入れるコメント
    let innerBodyCode;      //html内に入れる各日付のhtml文
    let upperCode;          //各日付のhtml文の上段(日付 / 天気)
    let middleCode;         //各日付のhtml文の中段(散歩当番 AM / PM)
    let lowerCode;          //各日付のhtml文の下段(散歩当番 AM / PM)
    let weatherDayId;       //各日付の天気アドレスを入れる為のID
    let walkDutyAmId;       //各日付の朝の散歩当番を入れる為のID
    let walkDutyPmId;       //各日付の夕の散歩当番を入れる為のID
    let scheduleId;         //各日付の予定を入れる為のID
    // let dayWeather;          //各日付の天気
    let walkDutyAm;         //午前の散歩当番
    let walkDutyPm;         //午後の散歩当番
    let schedule;           //予定1
    for (let i = 0; i < 6; i++){            //1～6週目の各週毎に処理を行う
        htmlCode = document.createElement("tr");    //各週分を表として設定する
        for (let j = 0; j < 7; j++){        //各週の曜日分処理を行う
            if (i === 0 && j < firstDay){                   //最初の週文で、1日より前の曜日は空欄にする
                dayCode = document.createElement("td");         //1日分の設定
                daySentence = document.createTextNode("");      //空欄にする
                dayCode.appendChild(daySentence);               //一日分の設定に、コメントを追加
                htmlCode.appendChild(dayCode);                  //html文として追加
            }else if (date > endDate){                      //最終日を迎えたら、for文を抜ける
                break;
            }else{                                                      //各曜日に日付を入れる
                dayCode = document.createElement("td");                     //1日分の設定                              
                dayCode.setAttribute("dataDate", date);                     //属性設定(dataDate),値はdate
                dayCode.setAttribute("dataMonth", month+1);                 //属性設定(dataMonth),値はmonth
                dayCode.setAttribute("dataYear", year);                     //属性設定(dataYear),値はyear
                dayCode.setAttribute("dataMonthName",monthName[month]);     //属性設定(dataMonthName),値はmonthName[]
                dayCode.className = "datePicker";                           //クラス属性の設定(datePicker)
                
                //html文の初期化
                innerBodyCode = "";         //記入コードの初期化
                upperCode = "";
                middleCode = "";
                lowerCode = "";
                // dayWeather ="☀"
                 walkDutyAm = ""; 
                 walkDutyPm = "";
                 schedule = "";
                weatherDayId = "weather" + String(year) + String(month+1) + String(date);   //天気アドレスを入れる為のID
                walkDutyAmId = "WDAm"  + String(year) + String(month+1) + String(date);     //朝の散歩当番を入れる為のID
                walkDutyPmId = "WDPm"  + String(year) + String(month+1) + String(date);     //夕の散歩当番を入れる為のID
                scheduleId = "schedule"  + String(year) + String(month+1) + String(date);   //予定を入れる為のID

                //html文の作成
                upperCode = "<div class=\"dayUpper\"><div class =\"day\">" + date + "</div><div class=\"weather\" id=" + weatherDayId + "></div></div>";
                middleCode = "<div class =\"dayMiddle\"><div class=\"walkDuty\" id=" + walkDutyAmId + ">" + "さんぽ 朝: "+ walkDutyAm + "</div>" + "<div class=\"walkDuty\" id=" + walkDutyPmId + ">" + "　　　 夕: " + walkDutyPm + "</div></div>" ; 
                lowerCode = "<div class=\"dayLower\"><div class =\"scheduleTitle\"><span>予定</span></div><div class =\"schedule\"><span id=" + scheduleId + ">" + schedule + "</span></div></div>";
                innerBodyCode = upperCode + middleCode + lowerCode;
                dayCode.innerHTML = innerBodyCode;

                //今日の日付の場合は、classネームを変える
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
                    dayCode.className = "datePicker selected";      //クラス属性の設定(datePicker.selected)
                }

                //html文に追加
                htmlCode.appendChild(dayCode);
                date ++;
            }
        }
        tableCode.appendChild(htmlCode);        //一週間分のhtml文を追加する

        //予定入力欄に年月日の情報を入れる
        document.getElementById("reserveYear").value = year;
        document.getElementById("reserveMonth").value = month;
        let createDay = generateDayRange(endDate);     //1日～最終日までの一覧を作成
        document.getElementById("reserveDay").innerHTML = createDay;
    }

}

createCalendar(currentYear, currentMonth);      //本html立ち上げ時の動作(当月のカレンダー表示)

//前の月を表示
function previous(){
    //年の取得
    if (currentMonth === 0){        //対象月が1月(表記上は0)の場合は-1年する
        currentYear = currentYear - 1;
    }
    //月の取得
    if (currentMonth === 0){        //対象月が1月(表記上は0)の場合は12月,そうでなければ-1月 
        currentMonth = 11;          //12月(表記上は11)
    }else{
        currentMonth = currentMonth - 1;
    }
    createCalendar(currentYear, currentMonth);
    getWeather();
}

//次の月を表示
function next(){
    //年の取得
    if (currentMonth === 11){        //対象月が12月(表記上は11)の場合は+1年する
        currentYear = currentYear + 1;
    }
    //月の取得
    if (currentMonth === 11){        //対象月が12月(表記上は11)の場合は1月,そうでなければ+1月 
        currentMonth = 0;            //1月(表記上は0)
    }else{
        currentMonth = currentMonth + 1;
    }
    createCalendar(currentYear, currentMonth);
    getWeather();
}

//指定の月を表示
function reconstruction(){
    currentYear = parseInt(selectYear.value);     //yearの値を整数として取得
    currentMonth = parseInt(selectMonth.value);   //monthの値を整数として取得
    createCalendar(currentYear, currentMonth);
    getWeather();
}

//予定の登録
function writeReserve(){
    //予定入力欄に記載してある値を取得
    const reserveComment = [amWalk.value, pmWalk.value, reserveContents.value];         //各予定記入欄の取得 (amWalk, pmWalk, reserveContents)

    //スケジュールに反映
    const idCode = ["WDAm", "WDPm", "schedule"];    //各予定ID
    const comment = ["さんぽ 朝: ", "　　　 夕: ", ""];
    // console.log(reserveYear.value + String(parseInt(reserveMonth.value) + 1) + String(parseInt(reserveDay.value)+1));

    // console.log(parseInt(reserveMonth.value) + 1);
    // console.log(typeof (parseInt(reserveMonth.value) + 1));
    // console.log(parseInt(reserveDay.value)+1);
    // console.log(typeof (parseInt(reserveDay.value)+1));

    for (let i = 0; i < idCode.length; i++){
        if (document.getElementById(idCode[i] + reserveYear.value + String(parseInt(reserveMonth.value) + 1) + String(parseInt(reserveDay.value)+1))){
            console.log(true);
        }else{
            console.log(false);
        }
        document.getElementById(idCode[i] + reserveYear.value + String(parseInt(reserveMonth.value) + 1) + String(parseInt(reserveDay.value)+1)).innerHTML = comment[i] + reserveComment[i];
        console.log(comment[i] + reserveComment[i]);
    }

}
