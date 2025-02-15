// スタックとかグローバルにおいてもよかった……今更直すの嫌なので放置

// ◆汎用関数
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
/**
 * エラー処理
 * @param message エラーメッセージ
 */
function errorFunc(message) {
	alert(message);
}
/**
 * @param layer レイヤ
 * @return layerがレイヤセットならtrue
 */
function isLayerSet(layer) {
	return layer.typename == "LayerSet";
}

// ◆表示状態復帰関数
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
var ___origVisible = [];
var ___visiblesCount = 0;
/**
 * 再帰的にobjRef以下のレイヤをすべて非表示にする
 * ___origVisibleに表示情報を記録
 * @param objRef ドキュメントorレイヤセット
 */
function storeLayerVisible(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (isLayerSet(objRef.layers[i])) {
			storeLayerVisible(objRef.layers[i]); // 子レイヤを先に隠す
		}
		___origVisible.push(objRef.layers[i].visible);
		objRef.layers[i].visible = false;
	}
}
/**
 * 再帰的にobjRef以下のレイヤの表示状態を___origVisibleに従って復帰
 * 呼び出す前に___visiblesCountを0にリセットする必要あり
 * @param objRef ドキュメントorレイヤセット
 */
function restoreLayerVisible(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (isLayerSet(objRef.layers[i])) { restoreLayerVisible(objRef.layers[i]); }
		objRef.layers[i].visible = ___origVisible[___visiblesCount++];
	}
}

// ◆スタック記録関数
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
/**
 * 文字がデリミタか判定する
 * @param ch 判定する文字
 * @return chがデリミタだったらtrue
 */
function isDelimiter(ch) {
	if (INVERSDELIMS[ch]) return true;
	return false;
}
/**
 * 文字列からデリミタを探索する
 * @param str デリミタを探す文字列
 * @param start 探索開始位置
 * @return 探索開始位置からデリミタを探して発見した位置。デリミタがなかった場合はstr.lengthと一致。
 */
function nextDelimiter(str, start) {
	for (; start != str.length ; ++start) {
		if (isDelimiter(str[start])) { return start; }
	}
	return start;
}
/**
 * 文字列から指定された属性を抽出して記録
 * @param type 処理する属性の種類
 * @param str 処理する文字列
 * @param stack 全体指定属性スタック
 * @param tmpAttr 一時指定属性
 * @param all 全体指定か
 * @return 記録した部分を除いた文字列。記録部分がなかったらstrそのまま。
 */
function saveAttrFromStr(type, str, stack, tmpAttr, all) {
	var delim = DELIMS[type];
	var start = str.indexOf(delim);
	if (start != -1) {
		var end = nextDelimiter(str, start+1);
		var attr = str.substring(start+1, end);
		if (all) { saveAttr2Dic(type, stack[stack.length-1], attr); }
		else     { saveAttr2Dic(type, tmpAttr, attr);               }
		return str.substr(0, start) + str.substr(end);
	}
	return str;
}
/**
 * attrをdicに記録
 * @param type 記録する属性の種類
 * @param dic 記録する辞書配列
 * @param attr 記録する文字列
 */
function saveAttr2Dic(type, dic, attr) {
	switch (type) {
	case "type":
	case "name":
	case "csvName":
	case "replace":
		dic[type] = attr;
		break;
	case "option": // オプションは複数指定可能
		dic[type].push(attr);
		break;
	default:
		errorFunc("不明なtype指定(saveAttr2Dic), type:" + type);
	}
}

// ◆データ読み出し関数
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
/**
 * @param stack 全体指定属性スタック
 * @return stackの中で最も深い位置にある置換文字列
 */
function replaceString(stack) {
	for (var i = stack.length-1; i >= 0; --i) {
		if (stack[i].replace != null) return stack[i].replace;
	}
	return "";
}
/**
 * オプションが存在するか
 * @param attr チェックするオプション名
 * @param stack 全体指定属性スタック
 * @param tmpAttr 一時指定属性
 * @return stackまたはtmpAttrのoptionにattrが含まれていたらtrue
 */
/* not used
function chkOptionAttr(attr, stack, tmpAttr) {
	var arr = tmpAttr["option"];
	for (var i = arr.length-1; i >= 0; --i) { if (arr[i] == attr) return true; }
	for (var i = stack.length-1; i >= 0; --i) {
		arr = stack[i]["option"];
		for (var i = arr.length-1; i >= 0; --i) { if (arr[i] == attr) return true; }
	}
	return false;
}
*/

/**
 * @param attr チェックする名前
 * @param stack 全体指定属性スタック
 * @param tmpAttr 一時指定属性
 * @return tmpAttrまたはstackに記録されているtypeの値
 */
function attr(type, stack, tmpAttr) {
	if (tmpAttr[type] != null) return tmpAttr[type];
	for (var i = stack.length-1; i >= 0; --i) {
		if (stack[i][type] != null) return stack[i][type];
	}
	return "";
}

/**
 * オプションを配列に入れる順番は深い位置にあるものから。
 * 同じ深さでは先に書かれているものから。
 * @param stack 全体指定属性スタック
 * @param tmpAttr 一時指定属性
 * @return 全てのオプション属性が入った配列。
 */
function options(stack, tmpAttr) {
	var ret = [];
	var arr = tmpAttr["option"];
	for (var i = 0; i < arr.length; ++i) { ret.push(arr[i]); }
	for (var i = stack.length-1; i >= 0; --i) {
		arr = stack[i]["option"];
		for (var j = 0; j < arr.length; ++j) { ret.push(arr[j]); }
	}
	return ret;
}

// ◆画像、CSV情報出力関数
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
/**
 * @param layerRef 出力するレイヤ
 * @param stack 全体指定属性スタック
 * @param tmpAttr 一時指定属性
 */
function outputImage(layerRef, stack, tmpAttr) {
	layerRef.visible = true; // 対象レイヤを一旦表示

	// 属性を読み込む
	var attrType = attr("type", stack, tmpAttr);
	var attrCsvName = attr("csvName", stack, tmpAttr);
	var attrName = attr("name", stack, tmpAttr);
	var attrOpt = options(stack, tmpAttr).join();
	// 一旦画像を出力
	var imagename =attrCsvName + DELIMS["name"] + attrName + DELIMS["type"] + attrType;
	if (attrOpt != "") imagename += DELIMS["option"] + attrOpt.replace(/,/g, DELIMS["option"]);
	var fileRef = new File(folderPath + "\\" + imagename + ".png");
	docRef.saveAs(fileRef, saveOpt, true, Extension.LOWERCASE);
	// 画像を開いてトリミング、サイズを測る
	open(fileRef);
	var bounds
	with (activeDocument) {
		bounds = artLayers[0].bounds;
		artLayers[0].translate(-bounds[0],-bounds[1]);
		resizeCanvas(bounds[2]-bounds[0], bounds[3]-bounds[1], AnchorPosition.TOPLEFT);
		close(SaveOptions.SAVECHANGES);
	}
	// noimageオプションがついていたら画像削除
	if (attrOpt.indexOf("noimage") != -1) fileRef.remove();
	
	// fileコマンド
	if (attrOpt.indexOf("nofile") == -1) {
		csvFile.push([]);
		var dic = csvFile[csvFile.length-1];
		dic.imagename = imagename;
		dic.csvName = attrCsvName;
		dic.name = attrName;
		dic.offs_x = bounds[0];
		dic.offs_y = bounds[1];
		dic.width = bounds[2]-bounds[0];
		dic.height = bounds[3]-bounds[1];
		dic.options = attrOpt;
	}
	
	// typeコマンド
	if (attrOpt.indexOf("notype") == -1) {
		var dic = csvTypeRef[attrName];
		if (dic == undefined) { // まだtype情報がなかったら画像サイズそのまま記録
			csvType.push([]);
			dic = csvTypeRef[attrName] = csvType[csvType.length-1];
			dic.uitype = attrType;
			dic.csvName = attrCsvName;
			dic.name = attrName;
			dic.left = bounds[0];
			dic.top = bounds[1];
			dic.width = bounds[2]-bounds[0];
			dic.height = bounds[3]-bounds[1];
		} else { // type情報があったら範囲拡張
			if (dic.left > bounds[0]) {
				var newLeft = bounds[0];
				dic.width += newLeft - dic.left;
				dic.left = newLeft;
			}
			if (dic.top > bounds[1]) {
				var newTop = bounds[1];
				dic.height += newTop - dic.top;
				dic.top = newTop;
			}
			if (dic.width < bounds[2]-bounds[0]) {
				dic.width = bounds[2]-bounds[0];
			}
			if (dic.height < bounds[3]-bounds[1]) {
				dic.height = bounds[3]-bounds[1];
			}
		}
	}
	
	layerRef.visible = false;
}

/**
 * csvType、csvFile、csvTypeRefに従ってCSVファイルを出力
 */
 var OPENMODE = "a"; // 追記モード
function outputCSV() {
	// typeコマンド出力
	for (var i = 0; i < csvType.length; ++i) {
		var dic = csvType[i];
		var csvRef = new File(folderPath + "\\" + dic.csvName + ".csv");
		csvRef.open(OPENMODE);
		csvRef.write(
			"type," +
			dic.name + "," +
			dic.uitype + "," +
			dic.left.value + "," + dic.top.value + ",", +
			dic.width.value + "," + dic.height.value + "\n"
		);
		csvRef.close();
	}
	// fileコマンド出力
	for (var i = 0; i < csvFile.length; ++i) {
		var dic = csvFile[i];
		var csvRef = new File(folderPath + "\\" + dic.csvName + ".csv");
		csvRef.open(OPENMODE);
		if (csvTypeRef[dic.name] == undefined) {
			errorFunc("type定義レイヤが見つかりません。\nName:" + dic.name + "\nImageName:" + dic.imagename);
		}
		csvRef.write(
			"file," +
			dic.name + "," +
			dic.imagename + "," +
			(dic.offs_x - csvTypeRef[dic.name].left).value + "," + (dic.offs_y - csvTypeRef[dic.name].top).value + "," +
			dic.width.value + "," + dic.height.value
		);
		if (dic.options == "") csvRef.write("\n");
		else csvRef.write("," + dic.options + "\n");
		csvRef.close();
	}
	// その他コマンド出力
	for (var i = 0; i < csvCmd.length; ++i) {
		var dic = csvCmd[i];
		var csvRef = new File(folderPath + "\\" + dic.csvName + ".csv");
		csvRef.open(OPENMODE);
		csvRef.write(dic.cmd + "\n");
		csvRef.close();
	}
}
	
// ◆メイン再帰関数
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
/**
 * @param objRef レイヤの親（ドキュメント自体 or レイヤセット
 * @param stack レイヤセットのスコープを実現するスタック
 */
function recursiveFunc(objRef, stack) {
	var layersRef = objRef.layers;

	// レイヤ一枚ごとにループ
	for (var i = 0; i < layersRef.length; ++i) {
		var layerRef = layersRef[i]; // 操作対象レイヤ
		var layerName = layerRef.name; // 操作対象レイヤのレイヤ名
		var isLayerSetCache = (isLayerSet(layerRef)); // 操作対象レイヤがレイヤセットか
		var tmpAttr = STACK(); // このレイヤ限りの属性
		var doDelimiter = true; // デリミタを解釈するか

		// レイヤ名からコメントを削除
		var start = layerName.indexOf(DELIMS["comment"]);
		if (start != -1) layerName = layerName.substr(0, start);

		// レイヤセットだったらスタックをつむ
		if (isLayerSetCache) stack.push(STACK());

		// 全体属性指定か判定（全体指定の場合はtmpAttrではなくstackにデータを入れる
		// レイヤセットの場合は問答無用で全体指定
		var all = false;
		if (layerName[0] == DELIMS["allBegin"] && layerName[layerName.length-1] == DELIMS["allEnd"]) {
			all = true;
			layerName = layerName.slice(1, -1);
		} else if (isLayerSetCache) {
			all = true;
		}

		//  文字列置換
        {
			// 置換対象文字 $ の置換
			if (layerName.indexOf(DELIMS["rep"]) != -1) {
				layerName = layerName.replace(/\$/g, replaceString(stack));
			}
			// CSVファイル名置換 \0
			if (layerName.indexOf("\\0")!= -1) layerName = layerName.replace(/\\0/g, attr("csvName", stack, tmpAttr));
			// 固有名置換 \1
			if (layerName.indexOf("\\1")!= -1) layerName = layerName.replace(/\\1/g, attr("name", stack, tmpAttr));
			// 部品タイプ置換 \2
			if (layerName.indexOf("\\2")!= -1) layerName = layerName.replace(/\\2/g, attr("type", stack, tmpAttr));		 
			// オプション名置換 \3
			if (layerName.indexOf("\\3")!= -1) layerName = layerName.replace(/\\3/g, options(stack, tmpAttr).join(DELIMS["option"]));

			// 置換文字列指定
			if (layerName[0] == DELIMS["repBegin"] && layerName[layerName.length-1] == DELIMS["repEnd"] ) {
				saveAttr2Dic("replace", stack[stack.length-1], layerName.slice(1,-1));
				doDelimiter = false;
			}
		}
	
		// IGNORE は無視
		if (isLayerSetCache && layerName == "IGNORE") {
			continue;
		}
	
		// デミリタコマンド
		if (doDelimiter) {			
			// オプション属性を記録
			for (;;) { // オプションは複数あるかもしれない
				if (layerName.indexOf(DELIMS["option"]) != -1) {
					layerName = saveAttrFromStr("option", layerName, stack, tmpAttr, all);
				} else { break; }
			}
			// 固有名属性を記録
			layerName = saveAttrFromStr("name", layerName, stack, tmpAttr, all);
			// 部品タイプ属性を記録
			layerName = saveAttrFromStr("type", layerName, stack, tmpAttr, all);
			// CSVファイル名を記録
			layerName = saveAttrFromStr("csvName", layerName, stack, tmpAttr, all);

			// 出力指定がされていれば画像出力,座標情報記録
			if (layerName.indexOf(DELIMS["out"]) != -1) {
				if (isLayerSetCache) errorFunc("レイヤセットは画像出力できません。");
				outputImage(layerRef, stack, tmpAttr);
			}
			// コマンド指定がされていれば記録
			if (layerName.indexOf(DELIMS["rawCmd"]) != -1) {
					csvCmd.push({ cmd:layerName.substr(layerName.indexOf(DELIMS["rawCmd"])+1), csvName:attr("csvName", stack, tmpAttr) });
			}
		}

		// レイヤセットなら再帰的に処理
		if (isLayerSetCache) {
			layerRef.visible = true;
			recursiveFunc(layerRef, stack);
			stack.pop();
			layerRef.visible = false;
		}
	}
}

// ◆定数定義
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
// デリミタ
var DELIMS = {
	option:";",
	type:"&",
	name:"@",
	csvName:"!",
	rawCmd:"<",
	comment:"/",
	rep:"$",
	repBegin:"[",
	repEnd:"]",
	allBegin:"(",
	allEnd:")",
	out:"*"
};
var INVERSDELIMS = {};
for (var i in DELIMS) { INVERSDELIMS[DELIMS[i]] = true;}
/**
 * オプションのみ複数指定あり
 * @return スタックのテンプレートとなる配列
 */
function STACK() { return { option:[], type:null, name:null, csvName:null, replace:null }; }


// ◆変数定義
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
// csvへの出力
var csvType = [];
var csvFile = [];
var csvCmd = [];
var csvTypeRef = [];

// オブジェクトへの参照
var docRef = activeDocument;

// 保存オプション
var saveOpt = new PNGSaveOptions();
saveOpt.interlaced = false;
var folderName = 'output';
var folderPath = docRef.path.fsName.toString() + "\\" + folderName;
var folderRef = new Folder(folderPath);
if (!folderRef.exists) { folderRef.create(); }

// ◆実行
//￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
// ピクセル単位
var origUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

// レイヤをすべて非表示にする
storeLayerVisible(docRef, "");
	
// レイヤを再帰的に処理
recursiveFunc(docRef, [STACK()]);

// CSV出力
try {
	outputCSV();
} catch (e) {
	alert(e + "\n\nエラーが発生しました。\n元の状態に復帰します。"); // 失敗したら状態復帰へ
}
// 状態復帰
___visiblesCount = 0; // restoreLayerVisibleで使用
restoreLayerVisible(docRef);
app.preferences.rulerUnits = origUnit;

// 参照を解放
docRef = null;
artLayerRef = null;

alert("実行終了しました。");
