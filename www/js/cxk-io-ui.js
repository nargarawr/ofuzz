/*
  cxk-io-ui.js
  Deals with loading and saving of files to the system
  Author: Craig Knott

  Functions:
    allowDownload ( filetype ); 
  	strcmp ( str1, str2 );
    exportFile ( filetype );
    saveFile ( filetype ); 
    getExtension ( filename );
    loadFile ( evt );
    validateInput ( inputText );
    copyToClipboard ( );
    updateIOType( type );

*/

function allowDownload ( filetype ){
  $("#downloadData").removeAttr("disabled", null);
  $("#downloadData").css("pointer-events", "auto");
  $("#downloadData").addClass("btn-primary");
  $("#downloadData").text("Download as " + filetype)
}

$(document).ready(function() {
    document.getElementById('files').addEventListener('change', loadFile, false);
});

/**t
	Compares the two given strings

	@param {string}, first string
	@param {string}, second string
	@return {int}, 0 if equal
*/
function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

/**
	Prints the system in a variety of formats

	@param {string}, the format to print in (mfis, ufis, or ojsn)
*/
function exportFile( filetype ){
    Shiny.unbindAll()

   	var texts = document.getElementById('exportOutput');
   	texts.value = "";
   
	var d = document.getElementById("mainDivExport");
	clearNode(d);

	if ( strcmp("ufis", filetype ) == 0 || strcmp("mfis", filetype ) == 0 ){
		// System Parameters
		d.appendSpecialBreakText("[System]", true, true)
		d.appendSpecialBreakText("Name='" + ($("#fisName").val()) + "'", true, true);
		d.appendSpecialBreakText("Type='" + ($("#fisType").val()).toLowerCase() + "'", true, true);
		if ( strcmp("ufis", filetype ) == 0  ){
			d.appendSpecialBreakText("Version=1.0", true, true);	
		} else {
			d.appendSpecialBreakText("Version=2.0", true, true);
		}
		d.appendSpecialBreakText("NumInputs=" + getLength(true), true, true);
		d.appendSpecialBreakText("NumOutputs=" + getLength(false), true, true);
		d.appendSpecialBreakText("NumRules=" + systemRules.length, true, true);
		d.appendSpecialBreakText("AndMethod='" + ($("#fisAnd").val()).toLowerCase() + "'", true, true);
		d.appendSpecialBreakText("OrMethod='" + ($("#fisOr").val()).toLowerCase() + "'", true, true);
		d.appendSpecialBreakText("ImpMethod='" + ($("#fisImp").val()).toLowerCase() + "'", true, true);
		d.appendSpecialBreakText("AggMethod='" + ($("#fisAgg").val()).toLowerCase() + "'", true, true);
		d.appendSpecialBreakText("DefuzzMethod='" + ($("#fisDfz").val()).toLowerCase() + "'", true, true);
		d.appendSpecialBreakText("", true, true);

		// System Inputs
		var i = 1;
		for ( var key in inputDivs ) {
			var io = inputDivs[key].isInput ? "In" : "Out" ;
			d.appendSpecialBreakText("[" + io + "put" + i + "]", true, true);
			d.appendSpecialBreakText("Name='" + inputDivs[key].varName + "'", true, true);
			d.appendSpecialBreakText("Range=[" + inputDivs[key].rangeMin + " " + inputDivs[key].rangeMax + "]", true, true);
			d.appendSpecialBreakText("NumMFs=" + inputDivs[key].memFuncs.length, true, true);
			var j = 1;
			for ( var key2 in inputDivs[key].memFuncs ) {
				var t = inputDivs[key].memFuncs[key2];

				if ( t.funType === "gau" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'gaussmf',[" + t.paramSigma + " " + t.paramMean + (filetype==="ufis" ? " " + t.paramHeight : "") + "]", true, true);
				} else if ( inputDivs[key].memFuncs[key2].funType === "ga2" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'gaussbmf',[" + t.paramLeftSigma + " " + t.paramLeftMean + " " + t.paramRightSigma + " " + t.paramRightMean + (filetype==="ufis" ? " " + t.paramHeight : "") +"]", true, true);
				} else if ( inputDivs[key].memFuncs[key2].funType === "trp" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'trapmf',[" + t.paramLeftFoot + " " + t.paramLeftShoulder + " " + t.paramRightShoulder + " " + t.paramRightFoot + (filetype==="ufis" ? " " + t.paramHeight : "") + "]", true, true);
				} else if ( inputDivs[key].memFuncs[key2].funType === "tri" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'trimf',[" + t.paramLeft + " " + t.paramMean + " " + t.paramRight + (filetype==="ufis" ? " " + t.paramHeight : "") + "]", true, true);	
				}					

				j++;
			}

			d.appendSpecialBreakText("", true, true);
			i++;
		}

		// System Outputs
		i = 1;
		for ( var key in outputDivs ) {
			var io = outputDivs[key].isoutput ? "In" : "Out" ;
			d.appendSpecialBreakText("[" + io + "put" + i + "]", true, true);
			d.appendSpecialBreakText("Name='" + outputDivs[key].varName + "'", true, true);
			d.appendSpecialBreakText("Range=[" + outputDivs[key].rangeMin + " " + outputDivs[key].rangeMax + "]", true, true);
			d.appendSpecialBreakText("NumMFs=" + outputDivs[key].memFuncs.length, true, true);
			var j = 1;
			for ( var key2 in outputDivs[key].memFuncs ) {
				var t = outputDivs[key].memFuncs[key2];
				if ( t.funType == "gau" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'gaussmf',[" + t.paramSigma + " " + t.paramMean + (filetype==="ufis" ? " " + t.paramHeight : "") + "]", true, true);
				} else if ( t.funType == "ga2" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'gaussbmf',[" + t.paramLeftSigma + " " + t.paramLeftMean + " " + t.paramRightSigma + " " + t.paramRightMean + (filetype==="ufis" ? " " + t.paramHeight : "") +"]", true, true);
				} else if ( t.funType == "trp" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'trapmf',[" + t.paramLeftFoot + " " + t.paramLeftShoulder + " " + t.paramRightShoulder + " " + t.paramRightFoot + (filetype==="ufis" ? " " + t.paramHeight : "") + "]", true, true);
				} else if ( t.funType == "tri" ) {
					d.appendSpecialBreakText("MF" + j + "='" + t.funName + "':'trimf',[" + t.paramLeft + " " + t.paramMean + " " + t.paramRight + (filetype==="ufis" ? " " + t.paramHeight : "") + "]", true, true);	
				}					

				j++;
			}

			d.appendSpecialBreakText("", true, true);
			i++;
		}

		// System Rules
		if ( systemRules.length > 0) {
			d.appendSpecialBreakText("[Rules]", true, true);		
		}
		for ( var key in systemRules ) {
			var r = systemRules[key];

			var id = 0;
			for ( var inp in r.inputList ) {
				if ( r.inputList[inp].negated ) {
					d.appendSpecialBreakText("-", false, true);
				}
				d.appendSpecialBreakText(findMfInVar(inputDivs["inputDiv" + id], r.inputList[inp].rightEl), false, true);
				id++;
				if ( isLastKey (inp, r.inputList)) {
					d.appendSpecialBreakText(", ", false, true);		
				} else {
					d.appendSpecialBreakText(" ", false, true);		
				}
			}
			
			id = 0;
			for ( var oup in r.outputList ){
				if ( r.outputList[oup].negated ) {
					d.appendSpecialBreakText("-", false, true);
				}				
				d.appendSpecialBreakText(findMfInVar(outputDivs["outputDiv" + id], r.outputList[oup].rightEl), false, true);
				id++;
				if ( isLastKey (oup, r.outputList)) {
					d.appendSpecialBreakText(" ", false, true);		
				} 
			}

			d.appendSpecialBreakText("(" + r.weight + ")", false, true);

			if ( strcmp(r.connective, "AND") == 0 ) {
				d.appendSpecialBreakText(" : 1", true, true);
			} else if ( strcmp(r.connective, "OR") == 0 ) {
				d.appendSpecialBreakText(" : 2", true, true);		
			}
		}
		d.appendSpecialBreakText("\n",true, true);
	} else if ( strcmp("ojsn", filetype ) == 0 ){
		var jsonData = [];
		var cName = "System"

		var systemData = [];
		systemData.push({
			Name: $("#fisName").val(),
			Type: $("#fisType").val(),
			Version: 1.0,
			NumInputs: getLength(true),
			NumOutputs: getLength(false),
			NumRules: systemRules.length,
			AndMethod:$("#fisAnd").val().toLowerCase(),
			OrMethod:$("#fisOr").val().toLowerCase(),
			ImpMethod:$("#fisImp").val().toLowerCase(),
			AggMethod:$("#fisAgg").val().toLowerCase(),
			DefuzzMethod:$("#fisDfz").val()	.toLowerCase()
		});
		
		inputData = [];
		for ( var key in inputDivs ) {
			var mfDataMain = [];
			for ( var key2 in inputDivs[key].memFuncs ) {
				var mfData = [];

				if ( inputDivs[key].memFuncs[key2].funType == "gau" ) {
					mfData.push({
						Name  : inputDivs[key].memFuncs[key2].funName,
						Type  : inputDivs[key].memFuncs[key2].funType,
						Sigma : parseFloat(inputDivs[key].memFuncs[key2].paramSigma),
						Mean  : parseFloat(inputDivs[key].memFuncs[key2].paramMean),
						Height: parseFloat(inputDivs[key].memFuncs[key2].paramHeight)		
					});
				} else if ( inputDivs[key].memFuncs[key2].funType == "ga2" ) {
					mfData.push({
						Name       : inputDivs[key].memFuncs[key2].funName,
						Type       : inputDivs[key].memFuncs[key2].funType,						
						LeftSigma  : parseFloat(inputDivs[key].memFuncs[key2].paramLeftSigma),
						LeftMean   : parseFloat(inputDivs[key].memFuncs[key2].paramLeftMean),
						RightSigma : parseFloat(inputDivs[key].memFuncs[key2].paramRightSigma),
						RightMean  : parseFloat(inputDivs[key].memFuncs[key2].paramRightMean),
						Height: parseFloat(inputDivs[key].memFuncs[key2].paramHeight)		
					});
				} else if ( inputDivs[key].memFuncs[key2].funType == "trp" ) {
					mfData.push({
						Name          : inputDivs[key].memFuncs[key2].funName,
						Type          : inputDivs[key].memFuncs[key2].funType,						
						LeftFoot      : parseFloat(inputDivs[key].memFuncs[key2].paramLeftFoot),
						LeftShoulder  : parseFloat(inputDivs[key].memFuncs[key2].paramLeftShoulder),
						RightShoulder : parseFloat(inputDivs[key].memFuncs[key2].paramRightShoulder),
						RightFoot     : parseFloat(inputDivs[key].memFuncs[key2].paramRightFoot),	
						Height: parseFloat(inputDivs[key].memFuncs[key2].paramHeight)
					});
				} else if ( inputDivs[key].memFuncs[key2].funType == "tri" ) {
					mfData.push({
						Name  : inputDivs[key].memFuncs[key2].funName,
						Type  : inputDivs[key].memFuncs[key2].funType,						
						Left  : parseFloat(inputDivs[key].memFuncs[key2].paramLeft),
						Mean  : parseFloat(inputDivs[key].memFuncs[key2].paramMean),
						Right : parseFloat(inputDivs[key].memFuncs[key2].paramRight),
						Height: parseFloat(inputDivs[key].memFuncs[key2].paramHeight)						
					});
				}

				mfDataMain.push(mfData);
			}
		
			var subInputData = [];
			subInputData.push({
				Id:   key,
				Name: inputDivs[key].varName,
				Min:  parseInt(inputDivs[key].rangeMin),
				Max:  parseInt(inputDivs[key].rangeMax),
				Functions: mfDataMain
			});
			inputData.push(subInputData);
		}

		outputData = [];
		for ( var key in outputDivs ) {
			var mfDataMain = [];
			for ( var key2 in outputDivs[key].memFuncs ) {
				var mfData = [];

				if ( outputDivs[key].memFuncs[key2].funType == "gau" ) {
					mfData.push({
						Name  : outputDivs[key].memFuncs[key2].funName,
						Type  : outputDivs[key].memFuncs[key2].funType,
						Sigma : parseFloat(outputDivs[key].memFuncs[key2].paramSigma),
						Mean  : parseFloat(outputDivs[key].memFuncs[key2].paramMean),
						Height: parseFloat(outputDivs[key].memFuncs[key2].paramHeight)		
					});
				} else if ( outputDivs[key].memFuncs[key2].funType == "ga2" ) {
					mfData.push({
						Name       : outputDivs[key].memFuncs[key2].funName,
						Type       : outputDivs[key].memFuncs[key2].funType,						
						LeftSigma  : parseFloat(outputDivs[key].memFuncs[key2].paramLeftSigma),
						LeftMean   : parseFloat(outputDivs[key].memFuncs[key2].paramLeftMean),
						RightSigma : parseFloat(outputDivs[key].memFuncs[key2].paramRightSigma),
						RightMean  : parseFloat(outputDivs[key].memFuncs[key2].paramRightMean),
						Height: parseFloat(outputDivs[key].memFuncs[key2].paramHeight)		
					});
				} else if ( outputDivs[key].memFuncs[key2].funType == "trp" ) {
					mfData.push({
						Name          : outputDivs[key].memFuncs[key2].funName,
						Type          : outputDivs[key].memFuncs[key2].funType,						
						LeftFoot      : parseFloat(outputDivs[key].memFuncs[key2].paramLeftFoot),
						LeftShoulder  : parseFloat(outputDivs[key].memFuncs[key2].paramLeftShoulder),
						RightShoulder : parseFloat(outputDivs[key].memFuncs[key2].paramRightShoulder),
						RightFoot     : parseFloat(outputDivs[key].memFuncs[key2].paramRightFoot),	
						Height: parseFloat(outputDivs[key].memFuncs[key2].paramHeight)
					});
				} else if ( outputDivs[key].memFuncs[key2].funType == "tri" ) {
					mfData.push({
						Name  : outputDivs[key].memFuncs[key2].funName,
						Type  : outputDivs[key].memFuncs[key2].funType,						
						Left  : parseFloat(outputDivs[key].memFuncs[key2].paramLeft),
						Mean  : parseFloat(outputDivs[key].memFuncs[key2].paramMean),
						Right : parseFloat(outputDivs[key].memFuncs[key2].paramRight),
						Height: parseFloat(outputDivs[key].memFuncs[key2].paramHeight)						
					});
				}

				mfDataMain.push(mfData);
			}
		
			var suboutputData = [];
			suboutputData.push({
				Id:   key,
				Name: outputDivs[key].varName,
				Min:  parseInt(outputDivs[key].rangeMin),
				Max:  parseInt(outputDivs[key].rangeMax),
				Functions: mfDataMain
			});
			outputData.push(suboutputData);
		}

		ruleData = [];
		for ( var key in systemRules ) {
			var r = systemRules[key];

			ruleInputData  = [];
			for ( var key2 in r.inputList ) {
				ruleInputData.push({
					Variable : r.inputList[key2].leftEl,
					Term     : r.inputList[key2].rightEl,
					Negated  : (r.inputList[key2].negated == 'true')
				});
			}
			ruleOutputData = [];
			for ( var key2 in r.outputList ) {
				ruleOutputData.push({
					Variable : r.outputList[key2].leftEl,
					Term     : r.outputList[key2].rightEl,
					Negated  : (r.outputList[key2].negated == 'true')				
				});
			}

			subRuleData = [];
			subRuleData.push({
				Inputs     : ruleInputData,
				Outputs    : ruleOutputData,
				Connective : r.connective,
				Weight     : parseFloat(r.weight)
			});
			ruleData.push(subRuleData);
		}

		jsonData.push({
        	System:  systemData,
        	Inputs:  inputData,
        	Outputs: outputData,
        	Rules:   ruleData
    	});

		d.appendSpecialBreakText(JSON.stringify(jsonData), false, true)		
	}

	Shiny.bindAll()
}

/**
	Get the extension of a file 

	@param {string}, the file name to check
	@return {string}, the file extension
*/
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

/**
	Loads a file from a local directory

	@param {event}, the file event that called this function
*/
function loadFile(evt) {
	
	var r = confirm("Doing this will overwrite any work you have completed already, is this ok?")
	if ( !r ) {
		return;
	}

	clearNode(document.getElementById('nameList'));
	clearNode(document.getElementById('list'));

	var files = evt.target.files; 

	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		var ext = getExtension(f.name);
		switch ( ext.toLowerCase() ) {
			case 'fis':
			case 'json':
				break;
			default: 
				alert("Unsupported file type. Please unpload a .fis or .json file");
				return;
		} 

		document.getElementById('nameList').innerHTML = '<li><strong>' + escape(f.name) + '</strong> - '
		+ f.size + ' bytes, last modified: ' + (f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a') +
		'</li>';

		var reader = new FileReader();
		reader.onload = function ( e ) {
			var text = reader.result;
			switch ( ext.toLowerCase() ) {
				case 'fis':
					if ( loadFISFile(text) ) {
						document.getElementById('list').innerHTML = text.replace(/\n/g, "<br />");	
					}

					break;
				case 'json':
					if ( loadJSONFile(text) ) {
						document.getElementById('list').innerHTML = text.replace(/\n/g, "<br />");	
					}
					break;
			}
		}
		reader.readAsText(files[i]);	
		document.getElementById('list').innerHTML += '<ul>' + output.join('') + '</ul>';
	}	
}

/**
	Loads a fis file into the system

	@param {string}, the text to parse and check
*/
function loadFISFile ( txt ) {

	var name, type, andMethod, orMethod, aggMethod, impMethod, defMethod;

	var str = txt.split("\n");

	if ( !(new RegExp("\\[System\\]").test(str[0])) ) {
		alert("System tag is not present")
		return false;
	}

	var re = "Name='[a-zA-Z0-9 ]*'";
	if ( !(new RegExp(re).test(str[1])) ) {
		alert("Name tag is not present, or malformed")
		return false;
	}
	name = (str[1].split("'"))[1];
	
	if ( !(new RegExp("Type=\'mamdani\'").test(str[2])) ) {
		alert("Type tag is not present, or malformed")
		return false;
	}
	
	type = (str[2].split("'"))[1];
	type = type.charAt(0).toUpperCase() + type.slice(1);

	if ( !(new RegExp("AndMethod=\'(min|product)\'").test(str[7])) ) {
		alert("And Method tag is not present, or malformed")
		return false;
	}
	andMethod = (str[7].split("'"))[1];
	andMethod = andMethod.charAt(0).toUpperCase() + andMethod.slice(1);

	if ( !(new RegExp("OrMethod=\'(max|probor)\'").test(str[8])) ) {
		alert("Or Method tag is not present, or malformed")
		return false;
	}
	orMethod = (str[8].split("'"))[1];
	orMethod = orMethod.charAt(0).toUpperCase() + orMethod.slice(1);

	if ( !(new RegExp("ImpMethod=\'(min|product)\'").test(str[9])) ) {
		alert("Implication Method tag is not present, or malformed")
		return false;
	}
	impMethod = (str[9].split("'"))[1];
	impMethod = impMethod.charAt(0).toUpperCase() + impMethod.slice(1);
	
	if ( !(new RegExp("AggMethod=\'(max|probor|sum)\'").test(str[10])) ) {
		alert("Aggregation Method tag is not present, or malformed")
		return false;
	}
	aggMethod = (str[10].split("'"))[1];
	aggMethod = aggMethod.charAt(0).toUpperCase() + aggMethod.slice(1);

	if ( !(new RegExp("DefuzzMethod=\'(centroid|lom|mom|som|bisector)\'").test(str[11])) ) {
		alert("Defuzzification Method tag is not present, or malformed")
		return false;
	}
	defMethod = (str[11].split("'"))[1];
	defMethod = defMethod.charAt(0).toUpperCase() + defMethod.slice(1);

	$('#fisName').val(name)
	$('#fisType').val(type);
	$('#fisAnd').val(andMethod);
	$('#fisOr').val(orMethod);
	$('#fisImp').val(impMethod);
	$('#fisAgg').val(aggMethod);
	$('#fisDfz').val(defMethod);

	if ( !(new RegExp("NumInputs=\d*").test(str[4])) ) {
		alert("No input count defined (NumInputs field)")
		return false;
	}
	
	if ( !(new RegExp("NumOutputs=\d*").test(str[5])) ) {
		alert("No output count defined (NumOutputs field)")
		return false;
	}

	if ( !(new RegExp("NumRules=\d*").test(str[6])) ) {
		alert("No rule count defined (NumRules field)")
		return false;
	}

	inputDivs.length = 0;
	var myDiv = document.getElementById('mainDivInput');
	clearNode(myDiv)
	inputIndex = 0;
	var inputCount = parseInt((str[4].split("="))[1]);
    var breakDiv = document.createElement("div");
    breakDiv.className = "break";
    myDiv.appendChild(breakDiv);

	outputDivs.length = 0;
	var myDiv = document.getElementById('mainDivOutput');
	clearNode(myDiv)
	outputIndex = 0;
	var outputCount = parseInt((str[5].split("="))[1]);
	var breakDiv = document.createElement("div");
    breakDiv.className = "break";
    myDiv.appendChild(breakDiv);

	systemRules.length = 0;
	printRules ( ); 
	var ruleCount = parseInt((str[6].split("="))[1]);

	for ( var i = 13; i < str.length ; ){
		if ( new RegExp("\\[Input\\d+\\]").test(str[i]) ) {

			if ( !(new RegExp("Name=\'.*\'").test(str[i+1]))) {
				alert("A name tag is missing for one of your input variables")
				return false;
			}
			var inputName = (str[i+1].split("'"))[1];
			
			if ( !(new RegExp(/[Range=\[\d+\ \d+\]]+/).test(str[i+2]))) {
				alert("A range tag is missing or malformed for one of your input variables");
				return false;
			}
			var ranges = str[i+2].split(/[\s\[\]]+/)
			var minRange = ranges[1];
			var maxRange = ranges[2];

			if ( !(new RegExp(/[NumMFs=\d+]+/).test(str[i+3]))) {
				alert("A membership function count tag is missing or malformed for one of your input variables");
				return false;				
			}
			
			var mfCount = (str[i+3].split("="))[1];
			var mfList = new Array();

			for ( var j = 0 ; j < mfCount ; j++ ){
				if ( !(new RegExp(/[MF\d+=\'(\s|\S)*\':(\'gaussmf\',\[\-?\d+\.?\d* \-?\d+\.?\d* \-?\d+\.?\d*|\'gaussbmf\',\[\-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d*\]|\'trapmf\',\[\-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d*\]|\'trimf\',\[\-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d*)]+/).test(str[i+4+j]))) {
					alert("Membership function " + (j+1) + " of one of your variables is invalid")
					return false;
				}

				var str_params = str[i+4+j].split(/['|\[\]]/);
				var mf_name = str_params[1];
				var mf_type = str_params[3];
				var mf_params = str_params[5].split(/[\ ]/)
				
				if ( mf_type === "gaussmf") {
					mfList.push(new gauMemFun(mf_name, mf_params[0], mf_params[1], 1 ));
				} else if ( mf_type === "gaussbmf") {
					mfList.push(new gau2MemFun(mf_name, mf_params[0], mf_params[1], mf_params[2], mf_params[3],  1 ));
				} else if ( mf_type === "trapmf") {
					mfList.push(new trapMemFun(mf_name, mf_params[0], mf_params[1], mf_params[2], mf_params[3],  1  ));
				} else if ( mf_type === "trimf") {
					mfList.push(new triMemFun(mf_name, mf_params[0], mf_params[1], mf_params[2], 1 ));
				}				
			}

			var mainDiv = document.getElementById("mainDivInput")
			var sysVar = new systemVar(inputName, "inputDiv" + inputIndex, true);
    		inputIndex++;

		    mainDiv.appendChild(sysVar.createDiv());
		    inputDivs[sysVar.divId] = sysVar;  
		    inputDivs[sysVar.divId].rangeMin = minRange;
		    inputDivs[sysVar.divId].rangeMax = maxRange;

		    for ( var key in mfList ) {
				inputDivs[sysVar.divId].memFuncs.push(mfList[key])
		    }

			inputDivs[sysVar.divId].updateSmallView();		    
		} else if ( new RegExp("\\[Output\\d+\\]").test(str[i]) ) {
			if ( !(new RegExp("Name=\'.*\'").test(str[i+1]))) {
				alert("A name tag is missing for one of your input variables")
				return false;
			}
			var inputName = (str[i+1].split("'"))[1];
			
			if ( !(new RegExp(/[Range=\[\d+\ \d+\]]+/).test(str[i+2]))) {
				alert("A range tag is missing or malformed for one of your input variables");
				return false;
			}
			var ranges = str[i+2].split(/[\s\[\]]+/)
			var minRange = ranges[1];
			var maxRange = ranges[2];

			if ( !(new RegExp(/[NumMFs=\d+]+/).test(str[i+3]))) {
				alert("A membership function count tag is missing or malformed for one of your input variables");
				return false;				
			}
			
			var mfCount = (str[i+3].split("="))[1];
			var mfList = new Array();

			for ( var j = 0 ; j < mfCount ; j++ ){
				if ( !(new RegExp(/[MF\d+=\'(\s|\S)*\':(\'gaussmf\',\[\-?\d+\.?\d* \-?\d+\.?\d* \-?\d+\.?\d*|\'gaussbmf\',\[\-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d*\]|\'trapmf\',\[\-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d*\]|\'trimf\',\[\-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d* \-?\d*\.?\d*)]+/).test(str[i+4+j]))) {
					alert("Membership function " + (j+1) + " of one of your variables is invalid")
					return false;
				}

				var str_params = str[i+4+j].split(/['|\[\]]/);
				var mf_name = str_params[1];
				var mf_type = str_params[3];
				var mf_params = str_params[5].split(/[\ ]/)
				
				if ( mf_type === "gaussmf") {
					mfList.push(new gauMemFun(mf_name, mf_params[0], mf_params[1], 1 ));
				} else if ( mf_type === "gaussbmf") {
					mfList.push(new gau2MemFun(mf_name, mf_params[0], mf_params[1], mf_params[2], mf_params[3],  1 ));
				} else if ( mf_type === "trapmf") {
					mfList.push(new trapMemFun(mf_name, mf_params[0], mf_params[1], mf_params[2], mf_params[3],  1  ));
				} else if ( mf_type === "trimf") {
					mfList.push(new triMemFun(mf_name, mf_params[0], mf_params[1], mf_params[2], 1));
				}				
			}

			var mainDiv = document.getElementById("mainDivOutput")
			var sysVar = new systemVar(inputName, "outputDiv" + outputIndex, false);
    		outputIndex++;

		    mainDiv.appendChild(sysVar.createDiv());
		    outputDivs[sysVar.divId] = sysVar;  
		    outputDivs[sysVar.divId].rangeMin = minRange;
		    outputDivs[sysVar.divId].rangeMax = maxRange;

		    for ( var key in mfList ) {
				outputDivs[sysVar.divId].memFuncs.push(mfList[key])
		    }

			outputDivs[sysVar.divId].updateSmallView();		    
		} else if ( new RegExp("\\[Rules\\]").test(str[i]) ) {
			for ( var j = 1 ; j <= ruleCount ; j++ ){
				var regexp = "";

				for ( var iJ = 0 ; iJ < inputCount+outputCount ; iJ++ ){
					regexp += "\d+";
					if ( iJ == inputCount-1 ) {
						regexp += ", ";	
					} else {
						regexp += " ";
					}
				}
				
				regexp += "\(\d+\.?\d*\) : (1|2)"
				if ( !(new RegExp(regexp).test(str[i+j])) ) {
					var parts = str[i+j].split(/ \(|\) : /);

					var rule_inputs = new Array();
					var rule_outputs = new Array();

					var insAndOuts = parts[0];
					var lookingAtOutputs = false;

					
					for ( var ji=0; ji < insAndOuts.length; ji++ ) {
						var charAt = insAndOuts.substr( ji, 1 );
						if ( charAt == " " ) {
							continue;
						} else if (charAt == "," ) {
							lookingAtOutputs = true;
						} else if ( charAt == "-") {
							var twoChart = "-" + insAndOuts.substr( ji+1, 1 );
							if ( lookingAtOutputs ) {
								rule_outputs.push(twoChart)
							} else {
								rule_inputs.push(twoChart)
							}							
							ji++;
						} else {
							if ( lookingAtOutputs ) {
								rule_outputs.push(charAt)
							} else {
								rule_inputs.push(charAt)
							}
						}
					}

					var rule_weight = parts[1];
					var rule_conn   = parts[2];

				    var r1i = new Array;
				    var r1iDex = 0;
				    for ( var key in inputDivs ) {
				    	var p1 = inputDivs[key].divId;
				    	var p2 = "";
				    	var p3 = ( rule_inputs[r1iDex] < 0 );
				    	if ( rule_inputs[r1iDex] == 0 ) {
				    		p2 = "(Not Used)";
				    	} else {
				    		p2 =inputDivs[key].memFuncs[Math.abs(rule_inputs[r1iDex]-1)].funName;
				    	}
				    	
				    	r1i.push(new rulePair(p1,p2,p3))
				    	r1iDex++;
				    }

				    var r1o = new Array;
				    var r1oDex = 0;
				    for ( var key in outputDivs ) {
						var p1 = outputDivs[key].divId;
				    	var p2 = "";
				    	var p3 = ( rule_outputs[r1oDex] < 0 );
				    	if ( rule_outputs[r1oDex] == 0 ) {
				    		p2 = "(Not Used)";
				    	} else {
				    		p2 =outputDivs[key].memFuncs[Math.abs(rule_outputs[r1oDex]-1)].funName;
				    	}

				    	r1o.push(new rulePair(p1,p2,p3))
				    	r1oDex++;
				    }				    

				    var conn_str = "";
				    if ( rule_conn == 1 ) {
				    	conn_str = "AND";
				    } else if ( rule_conn == 2 ) {
						conn_str = "OR";
				    }
				    var sr = new systemRule(r1i, r1o, rule_weight, conn_str)
				    systemRules.push(sr);
				}
			}
		}
		i++;
	}

	updateSidePanelWithVars();
	return true;
}

/**
	Loads a json file into the system

	@param {string}, the text to parse and check
*/
function loadJSONFile ( txt ) {

	inputDivs.length = 0;
	var myDiv = document.getElementById('mainDivInput');
	clearNode(myDiv)
	inputIndex = 0;
    var breakDiv = document.createElement("div");
    breakDiv.className = "break";
    myDiv.appendChild(breakDiv);

	outputDivs.length = 0;
	var myDiv = document.getElementById('mainDivOutput');
	clearNode(myDiv)
	outputIndex = 0;
	var breakDiv = document.createElement("div");
    breakDiv.className = "break";
    myDiv.appendChild(breakDiv);

	systemRules.length = 0;
	printRules (); 

	var f = (JSON.parse(txt))[0]

	var sys_name		= f.System[0].Name;
	var sys_type		= f.System[0].Type;
	var sys_andMethod	= f.System[0].AndMethod;
	var sys_orMethod	= f.System[0].OrMethod;
	var sys_impMethod	= f.System[0].ImpMethod;
	var sys_aggMethod	= f.System[0].AggMethod;
	var sys_defMethod	= f.System[0].DefuzzMethod;


	if (typeof(sys_name) == "undefined"){
		alert("System name is missing or malformed")
		return false;
	}
	if (typeof(sys_type) == "undefined"){
		alert("System type is missing or malformed")
		return false;		
	}
	if (typeof(sys_andMethod) == "undefined"){
		alert("And Method is missing or malformed")
		return false;
	}	
	if (typeof(sys_orMethod) == "undefined"){
		alert("Or Method is missing or malformed")
		return false;
	}
	if (typeof(sys_impMethod) == "undefined"){
		alert("Implication Method is missing or malformed")
		return false;
	}
 	if (typeof(sys_aggMethod) == "undefined"){
		alert("Aggregation method is missing or malformed")
		return false;
	}
 	if (typeof(sys_defMethod) == "undefined"){
		alert("Defuzzification method is missing or malformed")
		return false;
	}	

	$('#fisName').val(sys_name)
	$('#fisType').val(sys_type);
	$('#fisAnd').val(sys_andMethod);
	$('#fisOr').val(sys_orMethod);
	$('#fisImp').val(sys_impMethod);
	$('#fisAgg').val(sys_aggMethod);
	$('#fisDfz').val(sys_defMethod);

	$.each( f.Inputs, function ( index, value ) {
		var var_id = JSON.stringify(value[0].Id).replace(/"/g, "");
		var var_name = JSON.stringify(value[0].Name).replace(/"/g, "");
		var var_minRange = JSON.stringify(value[0].Min);
		var var_maxRange = JSON.stringify(value[0].Max);

		if ( typeof(var_id) == "undefined" || typeof(var_name) == "undefined" || typeof(var_minRange) == "undefined" || typeof(var_maxRange) == "undefined" ){
			alert("One of your input variables is invalid")
			return false;
		}		
		
	  
		var var_mfList = new Array();

		$.each( value[0].Functions, function( mf_index, mf ) {
	  		var mf_name = JSON.stringify(mf[0].Name).replace(/"/g, "")
	  		var mf_type = JSON.stringify(mf[0].Type).replace(/"/g, "")

	  		if ( strcmp(mf_type, "gau") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].Sigma)
	  			var mf_p2 = JSON.stringify(mf[0].Mean)
				var mf_p3 = JSON.stringify(mf[0].Height)

				var_mfList.push(new gauMemFun (mf_name, mf_p1, mf_p2, mf_p3))
	  		} else if ( strcmp(mf_type, "ga2") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].LeftSigma)
	  			var mf_p2 = JSON.stringify(mf[0].LeftMean)
				var mf_p3 = JSON.stringify(mf[0].RightSigma)
				var mf_p4 = JSON.stringify(mf[0].RightMean)
				var mf_p5 = JSON.stringify(mf[0].Height)

				var_mfList.push(new gau2MemFun (mf_name, mf_p1, mf_p2, mf_p3, mf_p4, mf_p5))
	  		} else if ( strcmp(mf_type, "trp") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].LeftFoot)
	  			var mf_p2 = JSON.stringify(mf[0].LeftShoulder)
				var mf_p3 = JSON.stringify(mf[0].RightShoulder)
				var mf_p4 = JSON.stringify(mf[0].RightFoot)
				var mf_p5 = JSON.stringify(mf[0].Height)

				var_mfList.push(new trapMemFun (mf_name, mf_p1, mf_p2, mf_p3, mf_p4, mf_p5))
	  		} else if ( strcmp(mf_type, "tri") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].Left)
	  			var mf_p2 = JSON.stringify(mf[0].Mean)
				var mf_p3 = JSON.stringify(mf[0].Right)
				var mf_p4 = JSON.stringify(mf[0].Height)

				var_mfList.push(new triMemFun (mf_name, mf_p1, mf_p2, mf_p3, mf_p4))
	  		}
		});

		var mainDiv = document.getElementById("mainDivInput")
		var sysVar = new systemVar(var_name, "inputDiv" + inputIndex, true);
		inputIndex++;

	    mainDiv.appendChild(sysVar.createDiv());
	    inputDivs[sysVar.divId] = sysVar;  
	    inputDivs[sysVar.divId].rangeMin = var_minRange;
	    inputDivs[sysVar.divId].rangeMax = var_maxRange;

	    for ( var key in var_mfList ) {
			inputDivs[sysVar.divId].memFuncs.push(var_mfList[key])
	    }

		inputDivs[sysVar.divId].updateSmallView();	
	});

	$.each( f.Outputs, function ( index, value ) {
		var var_id = JSON.stringify(value[0].Id).replace(/"/g, "");
		var var_name = JSON.stringify(value[0].Name).replace(/"/g, "");
		var var_minRange = JSON.stringify(value[0].Min);
		var var_maxRange = JSON.stringify(value[0].Max);

		if ( typeof(var_id) == "undefined" || typeof(var_name) == "undefined" || typeof(var_minRange) == "undefined" || typeof(var_maxRange) == "undefined" ){
			alert("One of your output variables is invalid")
			return false;
		}		
		
	  
		var var_mfList = new Array();

		$.each( value[0].Functions, function( mf_index, mf ) {
	  		var mf_name = JSON.stringify(mf[0].Name).replace(/"/g, "")
	  		var mf_type = JSON.stringify(mf[0].Type).replace(/"/g, "")

	  		if ( strcmp(mf_type, "gau") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].Sigma)
	  			var mf_p2 = JSON.stringify(mf[0].Mean)
				var mf_p3 = JSON.stringify(mf[0].Height)

				var_mfList.push(new gauMemFun (mf_name, mf_p1, mf_p2, mf_p3))
	  		} else if ( strcmp(mf_type, "ga2") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].LeftSigma)
	  			var mf_p2 = JSON.stringify(mf[0].LeftMean)
				var mf_p3 = JSON.stringify(mf[0].RightSigma)
				var mf_p4 = JSON.stringify(mf[0].RightMean)
				var mf_p5 = JSON.stringify(mf[0].Height)

				var_mfList.push(new gau2MemFun (mf_name, mf_p1, mf_p2, mf_p3, mf_p4, mf_p5))
	  		} else if ( strcmp(mf_type, "trp") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].LeftFoot)
	  			var mf_p2 = JSON.stringify(mf[0].LeftShoulder)
				var mf_p3 = JSON.stringify(mf[0].RightShoulder)
				var mf_p4 = JSON.stringify(mf[0].RightFoot)
				var mf_p5 = JSON.stringify(mf[0].Height)

				var_mfList.push(new trapMemFun (mf_name, mf_p1, mf_p2, mf_p3, mf_p4, mf_p5))
	  		} else if ( strcmp(mf_type, "tri") == 0 ) {
	  			var mf_p1 = JSON.stringify(mf[0].Left)
	  			var mf_p2 = JSON.stringify(mf[0].Mean)
				var mf_p3 = JSON.stringify(mf[0].Right)
				var mf_p4 = JSON.stringify(mf[0].Height)

				var_mfList.push(new triMemFun (mf_name, mf_p1, mf_p2, mf_p3, mf_p4))
	  		}
		});

		var mainDiv = document.getElementById("mainDivOutput")
		var sysVar = new systemVar(var_name, "outputDiv" + outputIndex, false);
		outputIndex++;

	    mainDiv.appendChild(sysVar.createDiv());
	    outputDivs[sysVar.divId] = sysVar;  
	    outputDivs[sysVar.divId].rangeMin = var_minRange;
	    outputDivs[sysVar.divId].rangeMax = var_maxRange;

	    for ( var key in var_mfList ) {
			outputDivs[sysVar.divId].memFuncs.push(var_mfList[key])
	    }

		outputDivs[sysVar.divId].updateSmallView();	
	});

	$.each ( f.Rules, function ( index, value) {
		var rule_inputs = new Array();
		var rule_outputs = new Array();


		var inputtingIndex = 0;

		$.each ( value[0].Inputs, function ( in_index, in_value) {
			var rule_var = (JSON.stringify(in_value.Variable).replace(/"/g, ""))
			var rule_term = (JSON.stringify(in_value.Term).replace(/"/g, ""))
			var rule_negated = (JSON.stringify(in_value.Negated)) == 'true';

			if ( typeof(rule_var) == "undefined" || typeof(rule_term) == "undefined" || typeof(rule_negated) == "undefined" ){
				alert("One of your rules is invalid")
				return false;
			}
			
			rule_inputs.push(new rulePair(rule_var, rule_term, rule_negated))		
		});

		$.each ( value[0].Outputs, function ( out_index, out_value) {
			var rule_var = (JSON.stringify(out_value.Variable).replace(/"/g, ""))	
			var rule_term = (JSON.stringify(out_value.Term).replace(/"/g, ""))
			var rule_negated = (JSON.stringify(out_value.Negated))  == 'true';

			if ( typeof(rule_var) == "undefined" || typeof(rule_term) == "undefined" || typeof(rule_negated) == "undefined" ){
				alert("One of your rules is invalid")
				return false;
			}			

			rule_outputs.push(new rulePair(rule_var, rule_term, rule_negated))					
		});

		var rule_conn = (JSON.stringify(value[0].Connective)).replace(/"/g, "");
		var rule_weight = (JSON.stringify(value[0].Weight));

		if ( typeof(rule_conn) == "undefined" || typeof(rule_weight) == "undefined" ){
			alert("One of your rules is invalid")
			return false;
		}


		var sr = new systemRule(rule_inputs, rule_outputs, rule_weight, rule_conn)
		systemRules.push(sr);
	});

	return true;
}

/**
	Allows R-Shiny to access the type of file to save

	@param {string}, the file type 
*/
function updateIOType( type ) {
	Shiny.unbindAll()
	$("#iotypestore").val(type);
	Shiny.bindAll()
}