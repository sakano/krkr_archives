#target photoshop
var filename = activeDocument.fullName.toString().split(/\.(?=[^.]+$)/)[0];
var file = new File(filename + ".png");
if (file.exists) {
    for (var i = 1; file.exists; ++i) {
        var file = new File(filename + "_" + i + ".png");
    }
}
var saveOpt = new PNGSaveOptions();
activeDocument.saveAs(file, saveOpt, true, Extension.NONE);
