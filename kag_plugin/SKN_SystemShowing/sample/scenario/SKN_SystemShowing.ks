; 一回しか読み込まない
[if exp="tf.SKN_SYSTEMSHOWING_GUARD"]
	@return
[endif]
@eval exp="tf.SKN_SYSTEMSHOWING_GUARD = true"


@iscript
//------------------------------------------------ デフォルトの設定ここから ----
function SKN_SystemLayer_Config() {

// ◆システムレイヤの色と不透明度
this.baseColor = 0x0000FF; // 色
this.baseOpacity = 128; // 不透明度

// ◆ 左右上下マージン
this.marginL = 2; // 左余白
this.marginT = 2; // 上余白
this.marginR = 2; // 右余白
this.marginB = 2; // 下余白

// ◆ 文字の大きさ
this.fontSize = 16;

// ◆システムレイヤの高さについて
// システムレイヤの高さは「(文字の大きさ) + (上余白) + (下余白)」となります

// ◆システムレイヤの幅について
// システムレイヤの幅は 描画する文字数及び右余白と左余白 に応じて自動的に調整されます。

// ◆ 文字の書体
this.fontFace = "ＭＳ Ｐゴシック";

// ◆ 文字の色と不透明度
this.drawColor = 0xFFFFFF; // 色
this.drawOpa = 255; // 不透明度

// ◆ アンチエイリアス文字描画をするか
// する場合は true, しない場合は false を指定します。
this.drawAA = true;

// ◆ 影の不透明度
// 影の不透明度を指定します。
// 0を指定すると影は表示されません。
this.drawShadowlevel = 96;

// ◆ 影の色
this.drawShadowcolor = 0x000000;

// ◆ 影の幅
// 影の幅(ぼけ)を指定します。
// 0がもっともシャープ(ぼけない)で、値を大きくすると影をぼかすことができます。
this.drawShadowwidth = 1;

// ◆ 影の位置
// 影の位置を指定します。
// 指定した値だけ、描画する文字からずれた位置に描画されます。
// 正の値を指定すると右下方向、負の値を指定すると左上方向に描画されます。
// 0を指定すると文字の真下に描画されます。
this.drawShadowofsx = 2; // x方向
this.drawShadowofsy = 2; // y方向

// ◆ 移動する時間
// システムレイヤを表示するときにかける時間を指定します(ms単位)。
// 0を指定すると一瞬で表示され(もしくは隠され)ます。
this.showingTime = 200; // 表示するときにかける時間
this.hidingTime = 200; // 隠すときにかける時間

// ◆表示する時間
// システムレイヤを表示する時間を指定します(ms単位)。
// 表示するための移動が終わってから、指定した時間が過ぎると、隠すための移動が始まります
this.hideTimerInterval = 1500; // 隠すまでの時間
}

function SKN_SystemLayerManager_Config() {

// ◆システムレイヤの位置
// 一番上のシステムレイヤの表示位置を指定します。
this.top = 2;
// ◆システムレイヤ間のマージン
// 隣り合うシステムレイヤの間の幅を指定します。
// 負の値を指定するとシステムレイヤは重なり合って表示されます。
this.margin = 4;

}
//------------------------------------------------------------ 設定ここまで ----

	// ◆SKN_SystemLayerクラス
	// ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣	
class SKN_SystemLayer extends Layer {
	var waiting = true; // 待機中(表示されず隠れている)か
	var waitingLeft, waitingTop; // 待機中の位置
	
	var moveObject; // 現在進行中の自動移動用オブジェクト(進行していないときはvoid)
	var hideTimer = new Timer(this, "onHideTimer"); // 隠すまでの時間を測るタイマオブジェクト
	
	var showing = false; // 表示している(moveしている)最中か
	var hiding = false; // 隠している(moveしている)最中か
	
	var manager; // 管理オブジェクト
	
	function SKN_SystemLayer(win, par, man) {
		super.Layer(win, par);
		
		manager = man;
		(SKN_SystemLayer_Config incontextof this)(); // 設定読み込み
		hideTimer.interval = hideTimerInterval + showingTime;
		
		with (font) { // フォントの設定
			.height = fontSize;
			.face = fontFace;
		}
		
		// レイヤの設定
		height = font.height + marginT + marginB; // レイヤの縦幅
		absolute = 3000000; // 一番上に表示
		visible = true; // 常に表示(画面外に隠れるだけ)
		enabled = false; // メッセージは一切受け取らない
		hitThreshold = 256;
	}
	function finalize() {
		invalidate moveObject if moveObject !== void;
		invalidate hideTimer if hideTimer !== void;
		super.finalize(...);
	}	
	function show(text) {
	 	// システムレイヤを表示するときに呼ぶ
	 	width = marginT + marginB + font.getTextWidth(mp.text); // レイヤの横幅
		fillRect(0, 0, width, height, baseColor + (baseOpacity << 24)); // ベースの色を塗る
		
		drawText(marginL, marginT, text, drawColor, drawOpa, drawAA, drawShadowlevel, drawShadowcolor, drawShadowwidth, drawShadowofsx, drawShadowofsy); // 文字描画
		
		showing = true;
		waiting = false;
		beginMove(%["time"=>showingTime, "path"=> "(" +(window.innerWidth-width)+ "," +top+ "," +opacity+ ")"]); // ムーブ
		hideTimer.enabled = true;
	}	
	function onHideTimer() {
		// レイヤを隠すときに呼ばれる
		hideTimer.enabled = false;
		hiding = true;
		beginMove(%["time"=>hidingTime, "path"=> "(" +waitingLeft+ "," +waitingTop+ "," +opacity+ ")"]);
	}			
	function beginMove(elm)	{
		// elm に従い自動移動を開始する
		stopMove();
			// path の分解
		var array = [].split("(), ", elm.path, , true);
		for(var i = array.count-1; i>=0; i--) array[i+3] = +array[i];
		array[0] = left;
		array[1] = top;
		array[2] = opacity;
			// 移動用オブジェクトの作成
		moveObject = new LinearMover(this, array, +elm.time, elm.accel === void ? 0 : +elm.accel, moveFinalFunction);
		
		moveObject.startMove(+elm.delay);
	}
	function moveFinalFunction() {
		// 自動移動が終了するときに呼ばれる関数
		if (showing) {
			showing = false;
		} else if (hiding) {
			waiting = true;
			hiding = false;
		}
	}	
	function stopMove() {
		// ムーブを終わらせる
		if(moveObject !== void) {
			invalidate moveObject;
			moveObject = void;
		}
	}
}

	// ◆SKN_SystemLayerManagerクラス
	// ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
class SKN_SystemLayerManager extends KAGPlugin {
	var fore = %["systemLayers" => []]; // レイヤオブジェクト(表画面)
	var back = %["systemLayers" => []]; // レイヤオブジェクト(裏画面)
	var window; // KAGWindowオブジェクト

	
	function SKN_SystemLayerManager(win) {
		window = win;
		(SKN_SystemLayerManager_Config incontextof this)(); // 設定読み込み
		addSystemLayer(); // とりあえずシステムレイヤを一つ作っておく
	}
	function finalize() {
		for (var i=0; i< fore.systemLayers.count; ++i) {
			invalidate fore.systemLayers[i];
			invalidate back.systemLayers[i];
		}
	}
	function addSystemLayer() {
		// systemLayerを追加, 追加したsystemLayerの番号を返す
		fore.systemLayers.add( new SKN_SystemLayer(window, window.fore.base, this) );
		back.systemLayers.add( new SKN_SystemLayer(window, window.back.base, this) );
		
			// システムレイヤの初期設定
		var num = fore.systemLayers.count -1;
		with (fore.systemLayers[num]) { // 表画面	
			.waitingLeft = window.innerWidth;
			.waitingTop = (.height+margin)*num + top;
			.setPos(.waitingLeft, .waitingTop);
			.name = "システムレイヤ[" + num + "]表";
		}		
		with (back.systemLayers[num]) { // 裏画面
			.waitingLeft = kag.innerWidth;
			.waitingTop = (.height+margin)*num + top;
			.setPos(.waitingLeft, .waitingTop);
			.name = "システムレイヤ[" + num + "]裏";
		}		
		return num;
	}

	function getSystemLayer() {
		// 待機中のsystemLayerの番号を得る
		for (var i = 0; i < fore.systemLayers.count; ++i) {
			if (fore.systemLayers[i].waiting) {
				return i;
			}
		}
		return addSystemLayer(); // 全て待機中でなかったらレイヤ追加
	}

	function showSystemLayer(text) {
		// システムレイヤを表示
		var num = getSystemLayer();
		with (fore.systemLayers[num]) {
			.show(text);
		}
		with (back.systemLayers[num]) {
			.show(text);
		}
	}
}

kag.addPlugin(global.skn_systemLayer = new SKN_SystemLayerManager(kag));
@endscript


; ◆マクロ定義
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
@macro name="systemShow"
	@eval exp="skn_systemLayer.showSystemLayer(mp.text)"
@endmacro

@return