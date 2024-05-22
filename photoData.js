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
    //ファイルのコピー
    for (let i = 0; i < files[0].lenght; i++) {
        files[1][i].copy("/photo");
    }
}
//-------------------------------------------------------------------------

//写真送り
//ファイル名一覧の取得
const img = ["2024050101.jpg",
            "2024050301.jpg",
            "2024050302.jpg",
            "2024050901.jpg",
            "2024051001.jpg",
            "2024051101.jpg",
            "2024051201.jpg",
            "2024051501.jpg",
            "2024051701.jpg",
            "2024051801.jpg",
        ];
//写真送り
let cnt = 0;
function changePhotoData() {
    //画像選択
    // changePhoto.src = "photo/" + img[cnt];     //自宅用
    changePhoto.src = "https://doumyou.github.io/Doumyou.fnd27/photo/" + img[cnt];     //提出サーバー用
    cnt++;
    if (cnt == img.length) {
        cnt = 0
    };
    //秒数の指定(4sで切り替え(変更するときはstyle.cssも変更必要))
    setTimeout("changePhotoData()", 5000);
}
changePhotoData();

