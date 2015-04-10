// ƒXƒ^ƒbƒN‚Æ‚©ƒOƒ[ƒoƒ‹‚É‚¨‚¢‚Ä‚à‚æ‚©‚Á‚½cc¡X’¼‚·‚ÌŒ™‚È‚Ì‚Å•ú’u

// Ÿ”Ä—pŠÖ”
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
/**
 * ƒGƒ‰[ˆ—
 * @param message ƒGƒ‰[ƒƒbƒZ[ƒW
 */
function errorFunc(message) {
	alert(message);
}
/**
 * @param layer ƒŒƒCƒ„
 * @return layer‚ªƒŒƒCƒ„ƒZƒbƒg‚È‚çtrue
 */
function isLayerSet(layer) {
	return layer.typename == "LayerSet";
}

// Ÿ•\¦ó‘Ô•œ‹AŠÖ”
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
var ___origVisible = [];
var ___visiblesCount = 0;
/**
 * Ä‹A“I‚ÉobjRefˆÈ‰º‚ÌƒŒƒCƒ„‚ğ‚·‚×‚Ä”ñ•\¦‚É‚·‚é
 * ___origVisible‚É•\¦î•ñ‚ğ‹L˜^
 * @param objRef ƒhƒLƒ…ƒƒ“ƒgorƒŒƒCƒ„ƒZƒbƒg
 */
function storeLayerVisible(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (isLayerSet(objRef.layers[i])) {
			storeLayerVisible(objRef.layers[i]); // qƒŒƒCƒ„‚ğæ‚É‰B‚·
		}
		___origVisible.push(objRef.layers[i].visible);
		objRef.layers[i].visible = false;
	}
}
/**
 * Ä‹A“I‚ÉobjRefˆÈ‰º‚ÌƒŒƒCƒ„‚Ì•\¦ó‘Ô‚ğ___origVisible‚É]‚Á‚Ä•œ‹A
 * ŒÄ‚Ño‚·‘O‚É___visiblesCount‚ğ0‚ÉƒŠƒZƒbƒg‚·‚é•K—v‚ ‚è
 * @param objRef ƒhƒLƒ…ƒƒ“ƒgorƒŒƒCƒ„ƒZƒbƒg
 */
function restoreLayerVisible(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (isLayerSet(objRef.layers[i])) { restoreLayerVisible(objRef.layers[i]); }
		objRef.layers[i].visible = ___origVisible[___visiblesCount++];
	}
}

// ŸƒXƒ^ƒbƒN‹L˜^ŠÖ”
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
/**
 * •¶š‚ªƒfƒŠƒ~ƒ^‚©”»’è‚·‚é
 * @param ch ”»’è‚·‚é•¶š
 * @return ch‚ªƒfƒŠƒ~ƒ^‚¾‚Á‚½‚çtrue
 */
function isDelimiter(ch) {
	if (INVERSDELIMS[ch]) return true;
	return false;
}
/**
 * •¶š—ñ‚©‚çƒfƒŠƒ~ƒ^‚ğ’Tõ‚·‚é
 * @param str ƒfƒŠƒ~ƒ^‚ğ’T‚·•¶š—ñ
 * @param start ’TõŠJnˆÊ’u
 * @return ’TõŠJnˆÊ’u‚©‚çƒfƒŠƒ~ƒ^‚ğ’T‚µ‚Ä”­Œ©‚µ‚½ˆÊ’uBƒfƒŠƒ~ƒ^‚ª‚È‚©‚Á‚½ê‡‚Ístr.length‚Æˆê’vB
 */
function nextDelimiter(str, start) {
	for (; start != str.length ; ++start) {
		if (isDelimiter(str[start])) { return start; }
	}
	return start;
}
/**
 * •¶š—ñ‚©‚çw’è‚³‚ê‚½‘®«‚ğ’Šo‚µ‚Ä‹L˜^
 * @param type ˆ—‚·‚é‘®«‚Ìí—Ş
 * @param str ˆ—‚·‚é•¶š—ñ
 * @param stack ‘S‘Ìw’è‘®«ƒXƒ^ƒbƒN
 * @param tmpAttr ˆêw’è‘®«
 * @param all ‘S‘Ìw’è‚©
 * @return ‹L˜^‚µ‚½•”•ª‚ğœ‚¢‚½•¶š—ñB‹L˜^•”•ª‚ª‚È‚©‚Á‚½‚çstr‚»‚Ì‚Ü‚ÜB
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
 * attr‚ğdic‚É‹L˜^
 * @param type ‹L˜^‚·‚é‘®«‚Ìí—Ş
 * @param dic ‹L˜^‚·‚é«‘”z—ñ
 * @param attr ‹L˜^‚·‚é•¶š—ñ
 */
function saveAttr2Dic(type, dic, attr) {
	switch (type) {
	case "type":
	case "name":
	case "csvName":
	case "replace":
		dic[type] = attr;
		break;
	case "option": // ƒIƒvƒVƒ‡ƒ“‚Í•¡”w’è‰Â”\
		dic[type].push(attr);
		break;
	default:
		errorFunc("•s–¾‚Ètypew’è(saveAttr2Dic), type:" + type);
	}
}

// Ÿƒf[ƒ^“Ç‚İo‚µŠÖ”
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
/**
 * @param stack ‘S‘Ìw’è‘®«ƒXƒ^ƒbƒN
 * @return stack‚Ì’†‚ÅÅ‚à[‚¢ˆÊ’u‚É‚ ‚é’uŠ·•¶š—ñ
 */
function replaceString(stack) {
	for (var i = stack.length-1; i >= 0; --i) {
		if (stack[i].replace != null) return stack[i].replace;
	}
	return "";
}
/**
 * ƒIƒvƒVƒ‡ƒ“‚ª‘¶İ‚·‚é‚©
 * @param attr ƒ`ƒFƒbƒN‚·‚éƒIƒvƒVƒ‡ƒ“–¼
 * @param stack ‘S‘Ìw’è‘®«ƒXƒ^ƒbƒN
 * @param tmpAttr ˆêw’è‘®«
 * @return stack‚Ü‚½‚ÍtmpAttr‚Ìoption‚Éattr‚ªŠÜ‚Ü‚ê‚Ä‚¢‚½‚çtrue
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
 * @param attr ƒ`ƒFƒbƒN‚·‚é–¼‘O
 * @param stack ‘S‘Ìw’è‘®«ƒXƒ^ƒbƒN
 * @param tmpAttr ˆêw’è‘®«
 * @return tmpAttr‚Ü‚½‚Ístack‚É‹L˜^‚³‚ê‚Ä‚¢‚étype‚Ì’l
 */
function attr(type, stack, tmpAttr) {
	if (tmpAttr[type] != null) return tmpAttr[type];
	for (var i = stack.length-1; i >= 0; --i) {
		if (stack[i][type] != null) return stack[i][type];
	}
	return "";
}

/**
 * ƒIƒvƒVƒ‡ƒ“‚ğ”z—ñ‚É“ü‚ê‚é‡”Ô‚Í[‚¢ˆÊ’u‚É‚ ‚é‚à‚Ì‚©‚çB
 * “¯‚¶[‚³‚Å‚Íæ‚É‘‚©‚ê‚Ä‚¢‚é‚à‚Ì‚©‚çB
 * @param stack ‘S‘Ìw’è‘®«ƒXƒ^ƒbƒN
 * @param tmpAttr ˆêw’è‘®«
 * @return ‘S‚Ä‚ÌƒIƒvƒVƒ‡ƒ“‘®«‚ª“ü‚Á‚½”z—ñB
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

// Ÿ‰æ‘œACSVî•ño—ÍŠÖ”
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
/**
 * @param layerRef o—Í‚·‚éƒŒƒCƒ„
 * @param stack ‘S‘Ìw’è‘®«ƒXƒ^ƒbƒN
 * @param tmpAttr ˆêw’è‘®«
 */
function outputImage(layerRef, stack, tmpAttr) {
	layerRef.visible = true; // ‘ÎÛƒŒƒCƒ„‚ğˆê’U•\¦

	// ‘®«‚ğ“Ç‚İ‚Ş
	var attrType = attr("type", stack, tmpAttr);
	var attrCsvName = attr("csvName", stack, tmpAttr);
	var attrName = attr("name", stack, tmpAttr);
	var attrOpt = options(stack, tmpAttr).join();
	// ˆê’U‰æ‘œ‚ğo—Í
	var imagename =attrCsvName + DELIMS["name"] + attrName + DELIMS["type"] + attrType;
	if (attrOpt != "") imagename += DELIMS["option"] + attrOpt.replace(/,/g, DELIMS["option"]);
	var fileRef = new File(folderPath + "\\" + imagename + ".png");
	docRef.saveAs(fileRef, saveOpt, true, Extension.LOWERCASE);
	// ‰æ‘œ‚ğŠJ‚¢‚ÄƒgƒŠƒ~ƒ“ƒOAƒTƒCƒY‚ğ‘ª‚é
	open(fileRef);
	var bounds
	with (activeDocument) {
		bounds = artLayers[0].bounds;
		artLayers[0].translate(-bounds[0],-bounds[1]);
		resizeCanvas(bounds[2]-bounds[0], bounds[3]-bounds[1], AnchorPosition.TOPLEFT);
		close(SaveOptions.SAVECHANGES);
	}
	// noimageƒIƒvƒVƒ‡ƒ“‚ª‚Â‚¢‚Ä‚¢‚½‚ç‰æ‘œíœ
	if (attrOpt.indexOf("noimage") != -1) fileRef.remove();
	
	// fileƒRƒ}ƒ“ƒh
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
	
	// typeƒRƒ}ƒ“ƒh
	if (attrOpt.indexOf("notype") == -1) {
		var dic = csvTypeRef[attrName];
		if (dic == undefined) { // ‚Ü‚¾typeî•ñ‚ª‚È‚©‚Á‚½‚ç‰æ‘œƒTƒCƒY‚»‚Ì‚Ü‚Ü‹L˜^
			csvType.push([]);
			dic = csvTypeRef[attrName] = csvType[csvType.length-1];
			dic.uitype = attrType;
			dic.csvName = attrCsvName;
			dic.name = attrName;
			dic.left = bounds[0];
			dic.top = bounds[1];
			dic.width = bounds[2]-bounds[0];
			dic.height = bounds[3]-bounds[1];
		} else { // typeî•ñ‚ª‚ ‚Á‚½‚ç”ÍˆÍŠg’£
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
 * csvTypeAcsvFileAcsvTypeRef‚É]‚Á‚ÄCSVƒtƒ@ƒCƒ‹‚ğo—Í
 */
 var OPENMODE = "a"; // ’Ç‹Lƒ‚[ƒh
function outputCSV() {
	// typeƒRƒ}ƒ“ƒho—Í
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
	// fileƒRƒ}ƒ“ƒho—Í
	for (var i = 0; i < csvFile.length; ++i) {
		var dic = csvFile[i];
		var csvRef = new File(folderPath + "\\" + dic.csvName + ".csv");
		csvRef.open(OPENMODE);
		if (csvTypeRef[dic.name] == undefined) {
			errorFunc("type’è‹`ƒŒƒCƒ„‚ªŒ©‚Â‚©‚è‚Ü‚¹‚ñB\nName:" + dic.name + "\nImageName:" + dic.imagename);
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
	// ‚»‚Ì‘¼ƒRƒ}ƒ“ƒho—Í
	for (var i = 0; i < csvCmd.length; ++i) {
		var dic = csvCmd[i];
		var csvRef = new File(folderPath + "\\" + dic.csvName + ".csv");
		csvRef.open(OPENMODE);
		csvRef.write(dic.cmd + "\n");
		csvRef.close();
	}
}
	
// ŸƒƒCƒ“Ä‹AŠÖ”
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
/**
 * @param objRef ƒŒƒCƒ„‚ÌeiƒhƒLƒ…ƒƒ“ƒg©‘Ì or ƒŒƒCƒ„ƒZƒbƒg
 * @param stack ƒŒƒCƒ„ƒZƒbƒg‚ÌƒXƒR[ƒv‚ğÀŒ»‚·‚éƒXƒ^ƒbƒN
 */
function recursiveFunc(objRef, stack) {
	var layersRef = objRef.layers;

	// ƒŒƒCƒ„ˆê–‡‚²‚Æ‚Éƒ‹[ƒv
	for (var i = 0; i < layersRef.length; ++i) {
		var layerRef = layersRef[i]; // ‘€ì‘ÎÛƒŒƒCƒ„
		var layerName = layerRef.name; // ‘€ì‘ÎÛƒŒƒCƒ„‚ÌƒŒƒCƒ„–¼
		var isLayerSetCache = (isLayerSet(layerRef)); // ‘€ì‘ÎÛƒŒƒCƒ„‚ªƒŒƒCƒ„ƒZƒbƒg‚©
		var tmpAttr = STACK(); // ‚±‚ÌƒŒƒCƒ„ŒÀ‚è‚Ì‘®«
		var doDelimiter = true; // ƒfƒŠƒ~ƒ^‚ğ‰ğß‚·‚é‚©

		// ƒŒƒCƒ„–¼‚©‚çƒRƒƒ“ƒg‚ğíœ
		var start = layerName.indexOf(DELIMS["comment"]);
		if (start != -1) layerName = layerName.substr(0, start);

		// ƒŒƒCƒ„ƒZƒbƒg‚¾‚Á‚½‚çƒXƒ^ƒbƒN‚ğ‚Â‚Ş
		if (isLayerSetCache) stack.push(STACK());

		// ‘S‘Ì‘®«w’è‚©”»’èi‘S‘Ìw’è‚Ìê‡‚ÍtmpAttr‚Å‚Í‚È‚­stack‚Éƒf[ƒ^‚ğ“ü‚ê‚é
		// ƒŒƒCƒ„ƒZƒbƒg‚Ìê‡‚Í–â“š–³—p‚Å‘S‘Ìw’è
		var all = false;
		if (layerName[0] == DELIMS["allBegin"] && layerName[layerName.length-1] == DELIMS["allEnd"]) {
			all = true;
			layerName = layerName.slice(1, -1);
		} else if (isLayerSetCache) {
			all = true;
		}

		//  •¶š—ñ’uŠ·
        {
			// ’uŠ·‘ÎÛ•¶š $ ‚Ì’uŠ·
			if (layerName.indexOf(DELIMS["rep"]) != -1) {
				layerName = layerName.replace(/\$/g, replaceString(stack));
			}
			// CSVƒtƒ@ƒCƒ‹–¼’uŠ· \0
			if (layerName.indexOf("\\0")!= -1) layerName = layerName.replace(/\\0/g, attr("csvName", stack, tmpAttr));
			// ŒÅ—L–¼’uŠ· \1
			if (layerName.indexOf("\\1")!= -1) layerName = layerName.replace(/\\1/g, attr("name", stack, tmpAttr));
			// •”•iƒ^ƒCƒv’uŠ· \2
			if (layerName.indexOf("\\2")!= -1) layerName = layerName.replace(/\\2/g, attr("type", stack, tmpAttr));		 
			// ƒIƒvƒVƒ‡ƒ“–¼’uŠ· \3
			if (layerName.indexOf("\\3")!= -1) layerName = layerName.replace(/\\3/g, options(stack, tmpAttr).join(DELIMS["option"]));

			// ’uŠ·•¶š—ñw’è
			if (layerName[0] == DELIMS["repBegin"] && layerName[layerName.length-1] == DELIMS["repEnd"] ) {
				saveAttr2Dic("replace", stack[stack.length-1], layerName.slice(1,-1));
				doDelimiter = false;
			}
		}
	
		// IGNORE ‚Í–³‹
		if (isLayerSetCache && layerName == "IGNORE") {
			continue;
		}
	
		// ƒfƒ~ƒŠƒ^ƒRƒ}ƒ“ƒh
		if (doDelimiter) {			
			// ƒIƒvƒVƒ‡ƒ“‘®«‚ğ‹L˜^
			for (;;) { // ƒIƒvƒVƒ‡ƒ“‚Í•¡”‚ ‚é‚©‚à‚µ‚ê‚È‚¢
				if (layerName.indexOf(DELIMS["option"]) != -1) {
					layerName = saveAttrFromStr("option", layerName, stack, tmpAttr, all);
				} else { break; }
			}
			// ŒÅ—L–¼‘®«‚ğ‹L˜^
			layerName = saveAttrFromStr("name", layerName, stack, tmpAttr, all);
			// •”•iƒ^ƒCƒv‘®«‚ğ‹L˜^
			layerName = saveAttrFromStr("type", layerName, stack, tmpAttr, all);
			// CSVƒtƒ@ƒCƒ‹–¼‚ğ‹L˜^
			layerName = saveAttrFromStr("csvName", layerName, stack, tmpAttr, all);

			// o—Íw’è‚ª‚³‚ê‚Ä‚¢‚ê‚Î‰æ‘œo—Í,À•Wî•ñ‹L˜^
			if (layerName.indexOf(DELIMS["out"]) != -1) {
				if (isLayerSetCache) errorFunc("ƒŒƒCƒ„ƒZƒbƒg‚Í‰æ‘œo—Í‚Å‚«‚Ü‚¹‚ñB");
				outputImage(layerRef, stack, tmpAttr);
			}
			// ƒRƒ}ƒ“ƒhw’è‚ª‚³‚ê‚Ä‚¢‚ê‚Î‹L˜^
			if (layerName.indexOf(DELIMS["rawCmd"]) != -1) {
					csvCmd.push({ cmd:layerName.substr(layerName.indexOf(DELIMS["rawCmd"])+1), csvName:attr("csvName", stack, tmpAttr) });
			}
		}

		// ƒŒƒCƒ„ƒZƒbƒg‚È‚çÄ‹A“I‚Éˆ—
		if (isLayerSetCache) {
			layerRef.visible = true;
			recursiveFunc(layerRef, stack);
			stack.pop();
			layerRef.visible = false;
		}
	}
}

// Ÿ’è”’è‹`
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
// ƒfƒŠƒ~ƒ^
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
 * ƒIƒvƒVƒ‡ƒ“‚Ì‚İ•¡”w’è‚ ‚è
 * @return ƒXƒ^ƒbƒN‚Ìƒeƒ“ƒvƒŒ[ƒg‚Æ‚È‚é”z—ñ
 */
function STACK() { return { option:[], type:null, name:null, csvName:null, replace:null }; }


// Ÿ•Ï”’è‹`
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
// csv‚Ö‚Ìo—Í
var csvType = [];
var csvFile = [];
var csvCmd = [];
var csvTypeRef = [];

// ƒIƒuƒWƒFƒNƒg‚Ö‚ÌQÆ
var docRef = activeDocument;

// •Û‘¶ƒIƒvƒVƒ‡ƒ“
var saveOpt = new PNGSaveOptions();
saveOpt.interlaced = false;
var folderName = 'output';
var folderPath = docRef.path.fsName.toString() + "\\" + folderName;
var folderRef = new Folder(folderPath);
if (!folderRef.exists) { folderRef.create(); }

// ŸÀs
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
// ƒsƒNƒZƒ‹’PˆÊ
var origUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

// ƒŒƒCƒ„‚ğ‚·‚×‚Ä”ñ•\¦‚É‚·‚é
storeLayerVisible(docRef, "");
	
// ƒŒƒCƒ„‚ğÄ‹A“I‚Éˆ—
recursiveFunc(docRef, [STACK()]);

// CSVo—Í
try {
	outputCSV();
} catch (e) {
	alert(e + "\n\nƒGƒ‰[‚ª”­¶‚µ‚Ü‚µ‚½B\nŒ³‚Ìó‘Ô‚É•œ‹A‚µ‚Ü‚·B"); // ¸”s‚µ‚½‚çó‘Ô•œ‹A‚Ö
}
// ó‘Ô•œ‹A
___visiblesCount = 0; // restoreLayerVisible‚Åg—p
restoreLayerVisible(docRef);
app.preferences.rulerUnits = origUnit;

// QÆ‚ğ‰ğ•ú
docRef = null;
artLayerRef = null;

alert("ÀsI—¹‚µ‚Ü‚µ‚½B");
