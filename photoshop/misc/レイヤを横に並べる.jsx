// レイヤを横に並べるスクリプト

//=============================== Stdlib =======================================
//#includepath "/c/Program Files/Adobe/xtools"
//#include "xlib/stdlib.js"

Stdlib = function Stdlib() {};
// Traverse the all layers, including nested layers, executing
// the specified function. Traversal can happen in both directions.
Stdlib.traverseLayers = function(doc, ftn, reverse, layerSets) {
  function _traverse(doc, layers, ftn, reverse, layerSets) {
    var ok = true;
    for (var i = 1; i <= layers.length && ok != false; i++) {
      var index = (reverse == true) ? layers.length-i : i - 1;
      var layer = layers[index];
      if (layer.typename == "LayerSet") {
        if (layerSets) { ok = ftn(doc, layer); }
        if (ok) {
          ok = _traverse(doc, layer.layers, ftn, reverse, layerSets);
        }
      } else {
        ok = ftn(doc, layer);
        try {
          if (app.activeDocument != doc) {
            app.activeDocument = doc;
          }
        } catch (e) {}
      }
    }
    return ok;
  };
  return _traverse(doc, doc.layers, ftn, reverse, layerSets);
};

//==============================================================================
var width = activeDocument.width.value;
var index = 0;
var ftn = function(doc, layer) {
	layer.translate(width * index, 0);
	++index;
	return true;
};

Stdlib.traverseLayers(activeDocument, ftn, false, false);

activeDocument.resizeCanvas(width * index, activeDocument.height.value, AnchorPosition.TOPLEFT);
