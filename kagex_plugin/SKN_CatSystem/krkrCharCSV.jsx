// Ÿ•Ï”’è‹`
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
// ƒIƒuƒWƒFƒNƒg‚Ö‚ÌQÆ
var docRef = activeDocument;

// •Û‘¶ƒIƒvƒVƒ‡ƒ“
var folderName = 'output';
var saveOpt = new PNGSaveOptions();
saveOpt.interlaced = false;
var folderPath = docRef.path.fsName.toString() + "\\" + folderName;
var folderRef = new Folder(folderPath);
if (!folderRef.exists) { folderRef.create(); }
var csvRef = new File(folderPath + "\\" + "output.csv");;

// CSV‚É‘‚«o‚·ƒf[ƒ^
var keys = [];
var data = [];

// ŸŠÖ”’è‹`
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
// layRef‚ğsavename + ".png"‚Æ‚µ‚Ä•Û‘¶
function saveLayer(layRef, savename) {	
	// ˆê’U•Û‘¶(•\¦‘ÎÛƒŒƒCƒ„‚¾‚¯‰Â‹‚É‚È‚Á‚Ä‚¢‚é‚Í‚¸)
	var fileRef = new File(folderPath + "\\" + savename + ".png");
	docRef.saveAs(fileRef, saveOpt, true, Extension.LOWERCASE);
	// ‰æ‘œ‚ğŠJ‚¢‚ÄƒgƒŠƒ~ƒ“ƒO
	open(fileRef);
	var bounds = activeDocument.artLayers[0].bounds;
	activeDocument.artLayers[0].translate(-bounds[0],-bounds[1]);
	activeDocument.resizeCanvas(bounds[2]-bounds[0], bounds[3]-bounds[1], AnchorPosition.TOPLEFT);
	activeDocument.close(SaveOptions.SAVECHANGES);
	// ƒIƒtƒZƒbƒg‚È‚Ç‚ğ‹L˜^
	keys.push(savename);
	data[savename] = [];
	data[savename]["offs_x"] = bounds[0].toString().slice(0,-3);
	data[savename]["offs_y"] = bounds[1].toString().slice(0,-3);
	data[savename]["width"] = (bounds[2]-bounds[0]).toString().slice(0,-3);
	data[savename]["height"] = (bounds[3]-bounds[1]).toString().slice(0,-3);
	// Œ³‚ÌƒhƒLƒ…ƒƒ“ƒg‚ğŠJ‚­
	activeDocument = docRef;
}

function saveLayers(objRef, basename) {
	var layersRef = objRef.layers;
	for (var i = 0; i < layersRef.length; ++i) {
		var layerName = layersRef[i].name.replace(/\$/g, basename); // "$"‚ğ’uŠ·
		layersRef[i].visible = true; // ‘ÎÛ‚ÌƒŒƒCƒ„‚ğˆê’U•\¦
		if (layersRef[i].typename == "LayerSet") {
			// ƒŒƒCƒ„ƒZƒbƒg‚Ìˆ—(Ä‹A)
			if (layerName.charAt(0) == "[" && layerName.charAt(layerName.length-1) == "]") {
				// ƒŒƒCƒ„–¼‚ªŠî–{ƒtƒ@ƒCƒ‹–¼‚È‚ç‚»‚ÌŠî–{ƒtƒ@ƒCƒ‹–¼‚ÅÄ‹A
				saveLayers(layersRef[i], layerName.slice(1, -1));
			} else {
				// ‚»‚¤‚Å‚È‚¯‚ê‚ÎŒ»İ‚Ìbasename‚ÅÄ‹A
				saveLayers(layersRef[i], basename);
			}
		} else {
			// ‚»‚Ì‘¼‚ÌƒŒƒCƒ„‚Ìˆ—
			if (layerName.charAt(0) == "[" && layerName.charAt(layerName.length-1) == "]") {
				// ƒŒƒCƒ„–¼‚ªŠî–{ƒtƒ@ƒCƒ‹–¼‚È‚çbasenameXV
				basename = layerName.slice(1, -1);
			} else if (layerName.charAt(0) == "@") {
				// ƒŒƒCƒ„–¼‚ª@‚©‚çn‚Ü‚Á‚Ä‚¢‚ê‚Î‚»‚ÌƒŒƒCƒ„‚ğ•Û‘¶
				saveLayer(layersRef[i], layerName.substr(1));
			}
		}
		layersRef[i].visible = false;
	}
}

function hideLayers(objRef) {
	for (var i = 0; i < objRef.layers.length; ++i) {
		if (objRef.layers[i].typename == "LayerSet") { hideLayers(objRef.layers[i]); } // qƒŒƒCƒ„‚ğæ‚É‰B‚·
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
// ŸÀs
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
var origUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;
var origVisibles = [];
// ƒŒƒCƒ„‚ğ‚·‚×‚Ä”ñ•\¦‚É‚·‚é
hideLayers(docRef, "");
	
// ƒŒƒCƒ„‚²‚Æ‚É•Û‘¶
saveLayers(docRef);

// CSV‚ğo—Í
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

// Œ³‚Ìó‘Ô‚É–ß‚·
var restoreVisiblesCount = 0;
restoreVisibles(docRef); // visible
app.preferences.rulerUnits = origUnit; // ruler

// QÆ‚ğ‰ğ•ú
docRef = null;
artLayerRef = null;

alert("ÀsI—¹‚µ‚Ü‚µ‚½");