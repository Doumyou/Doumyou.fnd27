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
//画像表示htmlの作成
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
const inputPhotoData = document.getElementById("slidesList");
let divCode;
let imgCode;
for (const photoImg of img) {
    divCode = document.createElement("div");    //要素divの作成
    divCode.classList.add("swiper-slide");      //要素divにクラスの設定
    imgCode = document.createElement("img");    //要素imgの作成
    // imgCode.src = "photo/" + photoImg;          //画像の設定 自宅用
    imgCode.src = "https://doumyou.github.io/Doumyou.fnd27/photo/" + photoImg;          //画像の設定 提出サーバー用
    divCode.appendChild(imgCode);
    inputPhotoData.appendChild(divCode);      
}

//swiper.jsの初期設定
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    autoHeight: true,
    autoplay: {
        delay: 3000,
    },
    keepAspectRatio: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});
