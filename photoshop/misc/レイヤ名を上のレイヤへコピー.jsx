#target photoshop

var activeLayer = activeDocument.activeLayer;
var layers = activeLayer.parent.layers;
var idx = 0;
for (; idx < layers.length; ++idx) {
   if (layers[idx] == activeLayer) { break; }
}
layers[idx-1].name = activeLayer.name;
