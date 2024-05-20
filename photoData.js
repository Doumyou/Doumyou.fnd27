'use strict'

//写真データを取得
const inputPhoto = document.getElementById("getPhotoData");
let dataFiles = [];
const files = [];
files[0] = [];
files[1] = [];

//作成途中------------------------------------------------------------------
//写真ファイル選択時の情報取得処理
const inputData = () => {
    dataFiles = inputPhoto.files
    for (let i = 0; i < dataFiles.length; i++) {
        files[0][i] = dataFiles[i].name;
        files[1][i] = inputPhoto.value;
        console.log(files[1][i]);
    }
}

//写真ファイルを選択すると、変数inputDataの処理を実行
inputPhoto.addEventListener('change', inputData);

//写真データの保存
function savePhotos() {
    console.log("fsdfasdfasdf");
    const fs = require(`fs`);
    const files = fs.readdirSync("https://doumyou.github.io/Doumyou.fnd27/background/");
    console.log(files)
}
//-------------------------------------------------------------------------

//写真送り
const img = ["2024010501.jpg","2024010502.jpg","2024010701.jpg","2024011001.jpg","2024040901.jpg","2024051101.jpg"];     //画像データのファイル名一覧
let cnt = 0;
//ファイル名一覧の取得


//初期設定(1枚目の写真を表示)
// changePhoto.src = "photo/" + img[0];   //自宅用
changePhoto.src = "https://doumyou.github.io/Doumyou.fnd27/photo/" + img[0];   //提出サーバー用
//写真送り
function changePhotoData() {
    //画像選択
    console.log(cnt);
    console.log(img[cnt]);
    // changePhoto.src = "photo/" + img[cnt];     //自宅用
    changePhoto.src = "https://doumyou.github.io/Doumyou.fnd27/photo/" + img[cnt];     //提出サーバー自宅用
    cnt++;
    if (cnt == img.length) {
        cnt = 0
    };
    //秒数の指定(4sで切り替え(変更するときはstyle.cssも変更必要))
    setTimeout("changePhotoData()", 4000);
}
changePhotoData();
