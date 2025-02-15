// ◆変数定義
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
// オブジェクトへの参照
var docRef = activeDocument;

// 保存オプション
var folderName = 'output';
var saveOpt = new PNGSaveOptions();
saveOpt.interlaced = false;
var folderPath = docRef.path.fsName.toString() + "\\" + folderName;
var folderRef = new Folder(folderPath);
if (!folderRef.exists) { folderRef.create(); }
var csvRef = new File(folderPath + "\\" + "output.csv");;

// CSVに書き出すデータ
var keys = [];
var data = [];

// ◆関数定義
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
// layRefをsavename + ".png"として保存
function saveLayer(layRef, savename) {	
	// 一旦保存(表示対象レイヤだけ可視になっているはず)
	var fileRef = new File(folderPath + "\\" + savename + ".png");
	docRef.saveAs(fileRef, saveOpt, true, Extension.LOWERCASE);
	// 画像を開いてトリミング
	open(fileRef);
	var bounds = activeDocument.artLayers[0].bounds;
	activeDocument.artLayers[0].translate(-bounds[0],-bounds[1]);
	activeDocument.resizeCanvas(bounds[2]-bounds[0], bounds[3]-bounds[1], AnchorPosition.TOPLEFT);
	activeDocument.close(SaveOptions.SAVECHANGES);
	// オフセットなどを記録
	keys.push(savename);
	data[savename] = [];
	data[savename]["offs_x"] = bounds[0].toString().slice(0,-3);
	data[savename]["offs_y"] = bounds[1].toString().slice(0,-3);
	data[savename]["width"] = (bounds[2]-bounds[0]).toString().slice(0,-3);
	data[savename]["height"] = (bounds[3]-bounds[1]).toString().slice(0,-3);
	// 元のドキュメントを開く
	activeDocument = docRef;
}

function saveLayers(objRef, basename) {
	var layersRef = objRef.layers;
	for (var i = 0; i < layersRef.length; ++i) {
		var layerName = layersRef[i].name.replace(/\$/g, basename); // "$"を置換
		layersRef[i].visible = true; // 対象のレイヤを一旦表示
		if (layersRef[i].typename == "LayerSet") {
			// レイヤセットの処理(再帰)
			if (layerName.charAt(0) == "[" && layerName.charAt(layerName.length-1) == "]") {
				// レイヤ名が基本ファイル名ならその基本ファイル名で再帰
				saveLayers(layersRef[i], layerName.slice(1, -1));
			} else {
				// そうでなければ現在のbasenameで再帰
				saveLayers(layersRef[i], basename);
			}
		} else {
			// その他のレイヤの処理
			if (layerName.charAt(0) == "[" && layerName.charAt(layerName.length-1) == "]") {
				// レイヤ名が基本ファイル名ならbasename更新
				basename = layerName.slice(1, -1);
			} else if (layerName.charAt(0) == "@") {
				// レイヤ名が@から始まっていればそのレイヤを保存
				saveLayer(layersRef[i], layerName.substr(1));
			}
		}
		layersRef[i].visible = false;
	}
}

function hideLayers(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (objRef.layers[i].typename == "LayerSet") { hideLayers(objRef.layers[i]); } // 子レイヤを先に隠す
		origVisibles.push(objRef.layers[i].visible);
		objRef.layers[i].visible = false;
	}
}
function restoreVisibles(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (objRef.layers[i].typename == "LayerSet") { restoreVisibles(objRef.layers[i]); }
		objRef.layers[i].visible = origVisibles[restoreVisiblesCount++];
	}
}
// ◆実行
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
var origUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;
var origVisibles = [];
// レイヤをすべて非表示にする
hideLayers(docRef, "");
	
// レイヤごとに保存
saveLayers(docRef);

// CSVを出力
csvRef.open("w");
for (var i = 0; i < keys.length; ++i) {
	var dic = data[keys[i]];
	csvRef.write(keys[i] + ",");
	csvRef.write(dic["offs_x"] + ",");
	csvRef.write(dic["offs_y"] + ",");
	csvRef.write(dic["width"] + ",");
	csvRef.write(dic["height"] + "\n");
}
csvRef.close();

// 元の状態に戻す
var restoreVisiblesCount = 0;
restoreVisibles(docRef); // visible
app.preferences.rulerUnits = origUnit; // ruler

// 参照を解放
docRef = null;
artLayerRef = null;

alert("実行終了しました");