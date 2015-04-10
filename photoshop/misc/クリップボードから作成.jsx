
#target "photoshop"
// Clipboard to New
try {
    var idMk = charIDToTypeID( "Mk  " );
        var desc1 = new ActionDescriptor();
        var idNw = charIDToTypeID( "Nw  " );
            var desc2 = new ActionDescriptor();
            var idpreset = stringIDToTypeID( "preset" );
            desc2.putString( idpreset, """ÉNÉäÉbÉvÉ{Å[Éh""" );
        var idDcmn = charIDToTypeID( "Dcmn" );
        desc1.putObject( idNw, idDcmn, desc2 );
    executeAction( idMk, desc1, DialogModes.NO );
    
    var idpast = charIDToTypeID( "past" );
        var desc3 = new ActionDescriptor();
        var idAntA = charIDToTypeID( "AntA" );
        var idAnnt = charIDToTypeID( "Annt" );
        var idAnno = charIDToTypeID( "Anno" );
        desc3.putEnumerated( idAntA, idAnnt, idAnno );
    executeAction( idpast, desc3, DialogModes.NO );
    
    var idslct = charIDToTypeID( "slct" );
        var desc4 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref2 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            ref2.putName( idLyr, "îwåi" );
        desc4.putReference( idnull, ref2 );
        var idMkVs = charIDToTypeID( "MkVs" );
        desc4.putBoolean( idMkVs, false );
    executeAction( idslct, desc4, DialogModes.NO );
    
    var idDlt = charIDToTypeID( "Dlt " );
        var desc5 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref3 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref3.putEnumerated( idLyr, idOrdn, idTrgt );
        desc5.putReference( idnull, ref3 );
    executeAction( idDlt, desc5, DialogModes.NO );
} catch(e) { alert("é∏îsÇµÇ‹ÇµÇΩ") ;}
