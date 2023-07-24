(function () 
{

    // Script variables
    var abort;
    var title = "Создание карточек";

    // Reusable UI variables
    var g; // group
    var p; // panel
    var w; // window

    // Permanent UI variables
    var btnCancel;
    var btnFolderInput;
    var btnMockup;
    var txtMockup;
    var btnOk;
    var mockup;
    var txtFolderInput;
    var txtFI;
    var files;
    var txtFolderOutput = "~/CreateCards/Output";
    
    w = new Window("dialog", title);
    w.alignChildren = "fill";
    p = w.add("panel", undefined, "Input");
    g = p.add("group");
    btnFolderInput = g.add("button", undefined, "Files...");
    txtFI = g.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtFI.preferredSize = [200, -1];
    g = w.add("group");
    g.alignment = "center";

    w.alignChildren = "fill";
    p = w.add("panel", undefined,"Template");
    g = p.add("group");
    btnMockup = g.add("button", undefined, "File...");
    txtMockup = g.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtMockup.preferredSize = [200, -1];
    g = w.add("group");
    g.alignment = "center";
    
    btnOk = g.add("button", undefined, "OK");
    btnCancel = g.add("button", undefined, "Cancel");

    // UI EVENT HANDLERS

    btnFolderInput.onClick = function () {
        f = File.openDialog(null, "*.jpg*; *.png*", true);
        if (f[0]) {
            files = f;
            s = files[0].name;
            for (i = 1; i < files.length; i++) {
                s = s + ", " + files[i].name;
            }
            if (s.length > 36){
                txtFI.text = s.slice(0, 36) + "..."
            }
            else{
                 txtFI.text = s;    
            };
        }
    };

    btnMockup.onClick = function () {
        var f = File.openDialog(null, "*.psd*", false);
        if (f) {
            txtMockup.text = f.name;
            mockup = f;
        }
    };

    btnOk.onClick = function () {
        if (!txtFI.text) {
            alert("Select input folder", " ", false);
            return;
        }
        if (!txtMockup.text) {
            alert("Select template", " ", false);
            return;
        }
        w.close(1);
    };

    btnCancel.onClick = function () {
        w.close(0);
    };

    // SHOW THE WINDOW

    if (w.show() == 1) {
        try {
            process();
            alert(abort || "Done", title, false);
        } catch (e) {
            alert("An error has occurred.\nLine " + e.line + ": " + e.message, title, true);
        }
    }

    function process() {
        var i;
        // Ignore messages when opening documents.
        app.displayDialogs = DialogModes.NO;
        progress("Reading folder...");
        // Get files in folder.
        if (!files.length) {
            abort = "No files found in selected folder";
            return;
        }
        progress.set(files.length);
        try {
            // Loop through files array.
            for (i = 0; i < files.length; i++) {
                processFile(files[i]);
            }
        } finally {
            progress.close();
        }
    }

    
    function processFile(file) {
        var doc;
        var fileJpg;
        var saveOptions;
        var scale;
        doc = app.open(file);
        try {
            progress.message(File.decode(doc.name));
            // Resize image
            scale = 300 / doc.width;
            doc.resizeImage(300, doc.height * scale, 72, ResampleMethod.BICUBICSHARPER);
            // Save PNG
            fileJpg = new File(txtFolderOutput + "/" + doc.name.replace(/\.[^\.]*$/, "") + ".png");
            saveOptions = new PNGSaveOptions();;
            doc.saveAs(fileJpg, saveOptions);
            putImage(doc);
            progress.increment();
        } finally {
            doc.close(SaveOptions.DONOTSAVECHANGES);
        }
    }
        function putImage(doc){
                var newDoc =  app.open(mockup);               
                filePSD = new File("~/CreateCards/МакетыPSD/" + doc.name.replace("png, psd"));
                // File destination.txt will be created or overwritten by default.  
                saveOptions = new PhotoshopSaveOptions();
                layer= newDoc.artLayers.add();
                var idPlc = charIDToTypeID( "Plc " );
                var desc13 = new ActionDescriptor();
                var idIdnt = charIDToTypeID( "Idnt" );
                desc13.putInteger( idIdnt, 61 );
                var idnull = charIDToTypeID( "null" );
                desc13.putPath( idnull, new File( txtFolderOutput + "/" + doc.name));
                var idFTcs = charIDToTypeID( "FTcs" );
                var idQCSt = charIDToTypeID( "QCSt" );
                var idQcsa = charIDToTypeID( "Qcsa" );
                desc13.putEnumerated( idFTcs, idQCSt, idQcsa );
                var idOfst = charIDToTypeID( "Ofst" );
                var desc14 = new ActionDescriptor();
                var idHrzn = charIDToTypeID( "Hrzn" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc14.putUnitDouble( idHrzn, idPxl, 0.000000 );
                var idVrtc = charIDToTypeID( "Vrtc" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc14.putUnitDouble( idVrtc, idPxl, 0.000000 );
                var idOfst = charIDToTypeID( "Ofst" );
                desc13.putObject( idOfst, idOfst, desc14 );
                var idWdth = charIDToTypeID( "Wdth" );
                var idPrc = charIDToTypeID( "#Prc" );
                desc13.putUnitDouble( idWdth, idPrc, 33.388648 );
                var idHght = charIDToTypeID( "Hght" );
                var idPrc = charIDToTypeID( "#Prc" );
                desc13.putUnitDouble( idHght, idPrc, 33.388648 );
                executeAction( idPlc, desc13, DialogModes.NO );

                
                app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("CHANGE");
                var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );
                var desc14 = new ActionDescriptor();
                var idnull = charIDToTypeID( "null" );
                desc14.putPath( idnull, new File( txtFolderOutput + "/" + doc.name ) );
                executeAction( idplacedLayerReplaceContents, desc14, DialogModes.NO );
                if (doc.height < doc.width && mockup.name == "IMAGERESIZE.psd"){ 
                    app.activeDocument.activeLayer.resize(doc.width * 100 / doc.height + 1, doc.width * 100 / doc.height + 1, AnchorPosition.MIDDLECENTER)
                }
                newDoc.saveAs(filePSD, saveOptions); 
                fileJpg = new File("~/CreateCards/МакетЫJPG/" + newDoc.name.replace("psd", "jpg"));
                saveOptions = new JPEGSaveOptions();
                saveOptions.embedColorProfile = true;
                saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
                saveOptions.quality = 12;
                doc.saveAs(fileJpg, saveOptions);
    }

    function progress(message) {
        var b;
        var t;
        var w;
        w = new Window("palette", "Progress", undefined, {
            closeButton: false
        });
        t = w.add("statictext", undefined, message);
        t.preferredSize = [450, -1];
        b = w.add("progressbar");
        b.preferredSize = [450, -1];
        progress.close = function () {
            w.close();
        };
        progress.increment = function () {
            b.value++;
        };
        progress.message = function (message) {
            t.text = message;
            app.refresh();
        };
        progress.set = function (steps) {
            b.value = 0;
            b.minvalue = 0;
            b.maxvalue = steps;
        };
        w.show();
        app.refresh();
    }

})();

