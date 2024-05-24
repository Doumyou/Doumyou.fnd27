`use strict`

const startButtonId = "startButton"
const mainCanvasId = "mainCanvas"
const nextCanvasId = "nextCanvas"
const gameSpeed = 400;
const blockSize = 32;
const horCnt = 10;
const rowsCnt = 20;
const screenWidth = horCnt * blockSize;
const screenHight = rowsCnt * blockSize;
const nextAriaSize = 200;
const blockImg = [
    "block/block-0.png",
    "block/block-1.png",
    "block/block-2.png",
    "block/block-3.png",
    "block/block-4.png",
    "block/block-5.png",
    "block/block-6.png"
];
let gameScore = 0;
const displayScore = document.getElementById("displayScore");

//画面設定
window.onload = function () {
    Asset.init()            //画面の初期化実行
    let game = new Game()
    //スタートボタンを押すと、ゲームを開始する
    document.getElementById(startButtonId).onclick = function () {
        game.start()        //ゲームの実行
        this.blur()         // ボタンのフォーカスを外す
    }
}

// 各処理を管理するクラスの設定
// ゲーム開始前に初期化する
class Asset {
    // ブロック用Imageの配列
    static blockImages = [];

    // 初期化処理
    // callback には、init完了後に行う処理を渡す
    static init(callback) {
        let loadCnt = 0
        for (let i = 0; i <= 6; i++) {
            let img = new Image();
            // img.src = blockImg[i];      //自宅用
            img.src = "https://doumyou.github.io/Doumyou.fnd27/" + blockImg[i];     //提出サーバー用
            img.onload = function () {
                loadCnt++
                Asset.blockImages.push(img);
                // 全ての画像読み込みが終われば、callbackを実行
                if (loadCnt >= blockImg.length && callback) {
                    callback();
                }
            }
        }
        //得点の初期化
        displayScore.innerText=0;
    }
}

//ゲーム開始
class Game {
    
    constructor() {
        this.initMainCanvas();
        this.initNextCanvas();
    }
    // メインキャンバスの初期化
    initMainCanvas() {
        this.mainCanvas = document.getElementById(mainCanvasId);    //ID設定
        this.mainCtx = this.mainCanvas.getContext("2d");            //2Dグラフィックに設定
        this.mainCanvas.width = screenWidth;                        //幅の設定
        this.mainCanvas.height = screenHight;                       //高さの設定
        this.mainCanvas.style.border = "5px double #5b68ff";        //枠線の設定
    }
    // ネクストキャンバスの初期化
    initNextCanvas() {
        this.nextCanvas = document.getElementById(nextCanvasId);    //ID設定
        this.nextCtx = this.nextCanvas.getContext("2d");            //2Dグラフィックに設定
        this.nextCanvas.width = nextAriaSize;                       //幅の設定
        this.nextCanvas.height = nextAriaSize;                      //高さの設定
        this.nextCanvas.style.border = "5px double #5b68ff";        //枠線の設定
    }
    // ゲームの開始処理（STARTボタンクリック時）
    start() {
        this.field = new Field();       // フィールドとブロックの初期化
        this.popBlock();                 // 最初のブロックを読み込み
        this.drawAll();                 // 初回描画
        clearInterval(this.timer);      // 落下処理
        this.timer = setInterval(() => this.dropBlock(), gameSpeed);   //落下スピードの設定
        this.setKeyEvent();             // キーボードイベントの登録
        displayScore.innerText=0;       //得点の初期化
    }

    // 新しいブロックを読み込む
    popBlock() {
        this.mino = this.nextMino ?? new Mino();
        this.mino.spawn();
        this.nextMino = new Mino();
        // ゲームオーバーの判定
        if (!this.validMove(0, 1)) {
            this.drawAll();
            clearInterval(this.timer);
            alert("ゲームオーバー");
        }
    }

    // 画面の描画
    drawAll() {
        // 表示クリア
        this.mainCtx.clearRect(0, 0, screenWidth, screenHight);
        this.nextCtx.clearRect(0, 0, nextAriaSize, nextAriaSize);
        // 落下済みのブロックを描画
        this.field.drawFixedBlocks(this.mainCtx);
        // 再描画
        this.nextMino.drawNext(this.nextCtx);
        this.mino.draw(this.mainCtx);
    }

    // 次の移動が可能かチェック
    validMove(moveX, moveY, rot = 0) {
        let newBlocks = this.mino.getNewBlocks(moveX, moveY, rot);
        return newBlocks.every(block => {
            return (
                block.x >= 0 &&
                block.y >= -1 &&
                block.x < horCnt &&
                block.y < rowsCnt &&
                !this.field.has(block.x, block.y)
            );
        });
    }

    // キーを押したときのイベント
    setKeyEvent() {
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37: // 左
                    if (this.validMove(-1, 0)){
                        this.mino.x--;
                    }
                    break;
                case 39: // 右
                    if (this.validMove(1, 0)){
                        this.mino.x++;
                    }
                    break;
                case 40: // 下
                    if (this.validMove(0, 1)){
                        this.mino.y++;
                    }
                    break;
                case 32: // スペース
                    if (this.validMove(0, 0, 1)){
                        this.mino.rotate();
                    }
                    break;
            }
            this.drawAll();
        }.bind(this);
    }

    // ブロックの落下処理
    dropBlock() {
        if (this.validMove(0, 1)) {
            this.mino.y++;
        } else {
            // Blockを固定する（座標変換してFieldに渡す）
            this.mino.blocks.forEach(e => {
                e.x += this.mino.x;
                e.y += this.mino.y;
            })
            this.field.blocks = this.field.blocks.concat(this.mino.blocks);
            this.field.checkLine();
            this.popBlock();
        }
        this.drawAll();
    } 
}

class Block {
    // 基準地点からの座標
    // 移動中 ⇒ Minoの左上
    // 配置後 ⇒ Fieldの左上
    constructor(x, y, type) {
        this.x = x;
        this.y = y;

        // 描画しないときはタイプを指定しない
        if (type >= 0){
            this.setType(type);
        }
    }

    setType(type) {
        this.type = type;
        this.image = Asset.blockImages[type];
    }

    // Minoに属するときは、Minoの位置をオフセットに指定
    // Fieldに属するときは、(0,0)を起点とするので不要
    draw(offsetX = 0, offsetY = 0, ctx) {
        let drawX = this.x + offsetX;
        let drawY = this.y + offsetY;
        // 画面外は描画しない
        if (drawX >= 0 && drawX < horCnt && drawY >= 0 && drawY < rowsCnt) {
            ctx.drawImage(
                this.image,
                drawX * blockSize,
                drawY * blockSize,
                blockSize,
                blockSize
            );
        }
    }

    // 次のブロックを描画する
    // タイプごとに余白を調整して、中央に表示
    drawNext(ctx) {
        let offsetX = 0;
        let offsetY = 0;
        //中央位置の調整
        switch (this.type) {
            case 0:
                offsetX = 1;     
                offsetY = 0.5;    
                break;
            case 1:
                offsetX = 1;      
                offsetY = 1;      
                break;
            default:
                offsetX = 1.5;    
                offsetY = 1;      
                break;
        }
        //描写設定
        ctx.drawImage(
            this.image,
            (this.x + offsetX) * blockSize,
            (this.y + offsetY) * blockSize,
            blockSize,
            blockSize
        );
    }
}

//ブロックの設定
class Mino {
    //ブロックをランダムで選択
    constructor() {     
        this.type = Math.floor(Math.random() * 7);
        this.initBlocks();
    }
    //ブロックの形状設定
    initBlocks() {
        let t = this.type
        switch (t) {
            case 0: // I型
                this.blocks = [new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t), new Block(3, 2, t)]; break;
            case 1: // O型
                this.blocks = [new Block(1, 1, t), new Block(2, 1, t), new Block(1, 2, t), new Block(2, 2, t)]; break;
            case 2: // T型
                this.blocks = [new Block(1, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)]; break;
            case 3: // J型
                this.blocks = [new Block(1, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)]; break;
            case 4: // L型
                this.blocks = [new Block(2, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)]; break;
            case 5: // S型
                this.blocks = [new Block(1, 1, t), new Block(2, 1, t), new Block(0, 2, t), new Block(1, 2, t)]; break;
            case 6: // Z型
                this.blocks = [new Block(0, 1, t), new Block(1, 1, t), new Block(1, 2, t), new Block(2, 2, t)]; break;
        }
    }

    // フィールドに生成する(初期位置)
    spawn() {
        this.x = horCnt / 2 - 2;
        this.y = -3;
    }
    // フィールドに描画する
    draw(ctx) {
        this.blocks.forEach(block => {
            block.draw(this.x, this.y, ctx);
        });
    }
    // 次のブロックを描画する
    drawNext(ctx) {
        this.blocks.forEach(block => {
            block.drawNext(ctx);
        });
    }
    // 回転させる
    rotate() {
        this.blocks.forEach(block => {
            let oldX = block.x;
            block.x = block.y;
            block.y = 3 - oldX;
        });
    }

    // 次に移動しようとしている位置の情報を持ったブロックを生成
    // 描画はせず、移動が可能かどうかの判定に使用する
    getNewBlocks(moveX, moveY, rot) {
        let newBlocks = this.blocks.map(block => {
            return new Block(block.x, block.y);
        });
        newBlocks.forEach(block => {
            // 移動させる場合
            if (moveX || moveY) {
                block.x += moveX;
                block.y += moveY;
            }
            // 回転させる場合
            if (rot) {
                let oldX = block.x;
                block.x = block.y;
                block.y = 3 - oldX;
            }
            // グローバル座標に変換
            block.x += this.x;
            block.y += this.y;
        });
        return newBlocks;
    }
}

//メインキャンバスの状態設定
class Field {
    constructor() {
        this.blocks = [];
    }
    //ブロックの位置の確認
    drawFixedBlocks(ctx) {
        this.blocks.forEach(block => block.draw(0, 0, ctx));
    }
    //ブロックの消去判定(行が揃ったら消す)
    checkLine() {
        let delLine = 0;
        for (let r = 0; r < rowsCnt; r++) {
            let c = this.blocks.filter(block => block.y === r).length;
            //1行が全てブロックで埋まったら消す
            if (c === horCnt) {
                console.log("r:",r);
                console.log("horCnt:",horCnt);
                this.blocks = this.blocks.filter(block => block.y !== r);
                this.blocks.filter(block => block.y < r).forEach(upper => upper.y++);
                delLine = delLine + 1;
            }
        }
        
        //消したラインを得点に反映
        if (delLine != 0){
            gameScore = gameScore + delLine*100 + (delLine-1)*20;
            displayScore.innerText=gameScore;
        }
        
    }
    //ブロックの位置
    has(x, y) {
        return this.blocks.some(block => block.x == x && block.y == y);
    }
}
