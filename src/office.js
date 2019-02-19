var spexcel;
(function(){
    "use strict";
    spexcel = function(data) {
        this.id = data.id;
        this.fun = data.fun;
        this.option = data.option;
        this.forexcel();
    };

spexcel.prototype.forexcel = function() {
	var _this = this;
    document.getElementById(this.id).onchange = function() {
        var file,filetype,acctype = ["txt","xls","xlsx"],num = 0;
        if (window.ActiveXObject) { //IE
            this.select();
            this.blur();
            file = document.selection.createRange().text;    //for ie8 and filePath
            try {
                var f = new ActiveXObject("Scripting.FileSystemObject");
                filetype = f.GetFile(file).name.split(".")[1];
            } catch (e) {
                alert("ActiveX Initialization Failed.Please Enabled In Settings");
            }

            for(var i = 0;i < acctype.length;i++){  // check file type
            	if(acctype[i] == filetype){
            		num++;
            	}
            }
            if(num == 0){
            	alert("Illegal file type");
    			return false;
            }

            if(filetype == "txt"){    //txt
                var ff = f.OpenTextFile(file, 1);
                var html = "";
                while (!ff.AtEndOfStream){
                    html += ff.ReadLine();
                };
                ff.Close();
                callback(_this.fun,html);
            }else{                  //excel
                var oEx = new ActiveXObject("Excel.application");
                var oWB = oEx.Workbooks.open(file);
                var sheet = oWB.Worksheets(1);
                var data = {},rows,cols;
                rows = sheet.UsedRange.Rows.Count;     //sheets1 
                cols = sheet.UsedRange.Columns.Count;

                // oWB.Worksheets(1).Columns(1).Font.Bold = "True"
                // oWB.Worksheets(1).Activate;   //激活 sheets1
                // alert(oWB.Worksheets(1).Range("A1").value)
                // alert(oWB.Worksheets(1).Cells(1, 1).value);

                data.head = [];  
                for(var j = 1;j <= cols;j++){   //table head
                	data.head.push(sheet.Cells(1,j).value);
                }

                data.list = [];
                // if(_this.option.rows == undefined && _this.option.cols == undefined)   //all data
                // {
                    for(var k = 2;k < rows;k++){
                    	var json = {},head = data.head;
                    	for(var l = 1;l <= cols;l++){
                            json[head[l - 1]] = sheet.Cells(k,l).value;
                    	}
                    }
                    data.list.push(json);
                    oEx.Quit();
                    oEx = null;
                    callback(_this.fun,data);
                // }else if(_this.option.rows != undefined && _this.option.cols == undefined)
            }

        }else if (window.FileReader){  //Chrome
        	// if(window.XMLHttpRequest) alert(1);   // chrome ff was supported
        	var reader = new FileReader();
            file = this.files[0];
            if(!file){
                return false;
            };
            if(file.type.indexOf("text") > -1){    //  chrome txt
	            reader.readAsText(file);    //  is async
	            reader.onload = function(e){
	            	callback(_this.fun,this.result);
	            };
            }else{                   //chrome excel
            	jsxlsx(reader,file,_this.fun);
            }

        }

        // else if (document.implementation && document.implementation.createDocument)  // ff
        // {
        //     var xmlDoc = document.implementation.createDocument("", "", null);
        //         file = this.value;
        //         xmlDoc.async = false;
        //         xmlDoc.load(this.value);
        //     if(file.split(".")[1] == "txt")    //ff txt
        //     {
                
        //     }else{
        //       jsxlsx(reader,file,_this.fun);
        //     }
        // }
    };
};

function jsxlsx(handel,file,fun){
	var data = {};
    data.head = [];
    handel.readAsArrayBuffer(file);    //  is async
	handel.onload = function(){
		var arr = fixdata(this.result);
	    var wb = XLSX.read(btoa(arr), {type: "base64"});
		sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
	    for(var i in sheetData[0]){
	        data.head.push(i);
	    }
		data.list = sheetData;
		callback(fun,data);
	};
};

function callback(fun,data){
	try {
        eval(fun + "(data)");
    } catch (e) {
        alert("function " + fun + " undefined");
    }
}

function fixdata(data) {
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l){
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    }
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

function isArray(arr) {
    return Object.prototype.toString.call(arr) == "[object Array]";
}
})();