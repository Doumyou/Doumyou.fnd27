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
const img = [];     //画像データのファイル名一覧
let cnt = 0;
//ファイル名一覧の取得


//初期設定(1枚目の写真を表示)
changePhoto.src = img[0];
//写真送り
function changePhoto() {
    //画像選択
    changePhoto.src = img[cnt];
    cnt++;
    if (cnt == img.length) {
        cnt = 0
    };
    //秒数の指定(4sで切り替え(変更するときはstyle.cssも変更必要))
    setTimeout("changePhoto()", 4000);
}
changePhoto();
