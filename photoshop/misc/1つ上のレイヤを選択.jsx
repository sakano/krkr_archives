
var activeLayer = activeDocument.activeLayer;
var layers = activeLayer.parent.layers;
var idx = 0;
for (; idx < layers.length; ++idx) {
   if (layers[idx] == activeLayer) { break; }
}
--idx;
var vis = layers[idx].visible;
activeDocument.activeLayer = layers[idx];
layers[idx].visible = vis;
