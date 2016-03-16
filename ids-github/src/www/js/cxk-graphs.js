/**  cxk-graphs.js
  Deals with drawing of graphs with GoogleCharts
  Author: Craig Knott

  Functions:
    checkParameters (inputValues);
 	calcGauVals( inputValues, min, max );
 	calcGauBVals( inputValues, min, max );
	calcTrapVals( inputValues, min, max );
	calcTriVals ( inputValues, min, max );
    drawChart();
    $('#mfTypeSelect').change(function();
    drawVarCharts(chartDiv, divId, isInput);
*/

var g_isInput = true;

/**
  Checks whether all given parameters are numbers and not null

  @param {array[a]}, input values
  @return {boolean}, whether or not all values are valid or not 
*/
function checkParameters ( inputValues ) {
	for ( var key in inputValues ) {
		if ( !isNumber(inputValues[key]) ) {
			return false;
		}
	}
	return true;
}


/**
	Returns the values of the calculated gaussian curve

	@param {array[a]}, the input parameters
	@param {a}, numeric minimum
	@param {a}, numeric maximum
	@return {array[pair(a,b)]}, the plottable results of the function
*/
function calcGauVals( inputValues, min, max ){
	var outputValues = new Array();

	var sigma  = inputValues[0];
	var mean   = inputValues[1];
	var height = inputValues[2];

	for ( var i = parseInt(min); i <= parseInt(max); i++) {
		var v = height * Math.pow(Math.E, ((-1) * ((Math.pow(i - mean, 2))/(2 * Math.pow(sigma, 2)))));
		outputValues.push(new pair(i, v));
	}

	return outputValues;
}

/**
	Returns the values of the calculated gaussian curve

	@param {array[a]}, the input parameters
	@param {a}, numeric minimum
	@param {a}, numeric maximum
	@return {array[pair(a,b)]}, the plottable results of the function
*/
function calcGauBVals( inputValues, min, max ){
	var outputValues = new Array();

	var leftSigma  = inputValues[0];
	var leftMean   = inputValues[1];
	var rightSigma = inputValues[2];
	var rightMean  = inputValues[3];
	var height     = inputValues[4];

	var lastLeft = 0;
	var j = 0;

	for ( var i = parseInt(min); i <= parseInt(max); i++, j++) {
		var e;
		if (i <= leftMean) {
			e = height * Math.pow(Math.E, ((-1) * ((Math.pow(i - leftMean, 2))/(2 * Math.pow(leftSigma, 2)))));
			lastLeft = j;
		} else if (i >= rightMean) {
			e = height * Math.pow(Math.E, ((-1) * ((Math.pow(i - rightMean, 2))/(2 * Math.pow(rightSigma, 2)))));
		}

		outputValues.push(new pair(i, e));
	}
	
	return outputValues;
}

/**
	Returns the values of the calculated gaussian curve

	@param {array[a]}, the input parameters
	@param {a}, numeric minimum
	@param {a}, numeric maximum
	@return {array[pair(a,b)]}, the plottable results of the function
*/
function calcTrapVals( inputValues, min, max ){

	var outputValues = new Array();

	var lFoot 	= inputValues[0];
	var lShould = inputValues[1];
	var rShould = inputValues[2];
	var rFoot 	= inputValues[3];
	var height 	= inputValues[4];


	for ( var i = parseInt(min); i <= parseInt(max); i++) {
		var a = (i - lFoot) / (lShould - lFoot);
		var b = 1.0;
		var c = (rFoot - i) / (rFoot - rShould);

		var e = height * Math.max(Math.min(Math.min(a,b),c),0);

		if ( isNaN(e) ) {
			e = 1;
		}

		outputValues.push(new pair(i, e));
	}

	return outputValues;
}

/**
	Returns the values of the calculated gaussian curve

	@param {array[a]}, the input parameters
	@param {a}, numeric minimum
	@param {a}, numeric maximum
	@return {array[pair(a,b)]}, the plottable results of the function
*/
function calcTriVals ( inputValues, min, max ){

	var outputValues = new Array();

	var left   = inputValues[0];
	var mean   = inputValues[1];
	var right  = inputValues[2];
	var height = inputValues[3];

	for ( var i = parseInt(min); i <= parseInt(max); i++) {
		var a = (i - left) / (mean - left);
		var b = (right - i) / (right - mean);
		var e = height * (Math.max(Math.min(a, b), 0));
		outputValues.push(new pair(i, e));
	}

	return outputValues;
}

/**
	Draws the relevant chart for the entered membership function
*/
function drawChart(  ) {

	var selectedDiv = getCurrentDiv();

	if ( g_isInput ) {
		if (typeof inputDivs[selectedDiv] === 'undefined'){
   			return;
 		}
	} else {
		if (typeof outputDivs[selectedDiv] === 'undefined'){
   			return;
 		}
	}

	var s = document.getElementById ( 'mfTypeSelect' );
	var mfType = s.options[s.selectedIndex].value;
		
	var minRange;
	var maxRange;
	if ( g_isInput ) {
		minRange = inputDivs[selectedDiv].rangeMin;
		maxRange = inputDivs[selectedDiv].rangeMax;	
	} else {
		minRange = outputDivs[selectedDiv].rangeMin;
		maxRange = outputDivs[selectedDiv].rangeMax;	
	}
	

	if ( mfType == "gaussMF" ) {
		// Check all parameters
		var inputValues = new Array();
		inputValues.push(document.getElementById("inputSigma").value);
		inputValues.push(document.getElementById("inputMean").value);
		inputValues.push(document.getElementById("inputHeight").value);
		if ( !checkParameters(inputValues) ) {
			var  x = document.getElementById("chart_div");
			clearNode(x);
			return;
		}

		var plotPoints = calcGauVals(inputValues, minRange, maxRange);

		var data = new google.visualization.DataTable();
		data.addColumn('number', 'xVal');
		data.addColumn('number', 'Truth');		
		data.addRows(plotPoints.length);
		var i = 0;
		for ( var key in plotPoints ) {
			data.setCell(i, 0, plotPoints[key].leftEl);
			data.setCell(i, 1, plotPoints[key].rightEl);
			i++;
		}
		
		var funName = document.getElementById("inputFunName").value;
    	var options = { 
    		title: funName,
    		curveType: 'function',
    		legend : { position : 'none' }
    	};     
    } else if ( mfType == "gaussbMF" ) {
    	// Check all parameters
		var inputValues = new Array();
		inputValues.push(document.getElementById("inputLSigma").value);
		inputValues.push(document.getElementById("inputLMean").value);
		inputValues.push(document.getElementById("inputRSigma").value);
		inputValues.push(document.getElementById("inputRMean").value);
		inputValues.push(document.getElementById("inputHeight").value);
		if ( !checkParameters(inputValues) ) {
			var  x = document.getElementById("chart_div");
			clearNode(x);
			return;
		}
		
		var plotPoints = calcGauBVals(inputValues, minRange, maxRange);

		var data = new google.visualization.DataTable();
		data.addColumn('number', 'xVal');
		data.addColumn('number', 'Truth');		
		data.addRows(plotPoints.length);
		var i = 0;
		for ( var key in plotPoints ) {
			data.setCell(i, 0, plotPoints[key].leftEl);
			data.setCell(i, 1, plotPoints[key].rightEl);
			i++;
		}
		
		var funName = document.getElementById("inputFunName").value;
    	var options = { 
    		title: funName,
    		curveType: 'function',
    		legend : { position : 'none' }
    	};  
    } else if ( mfType == "triMF" ) {
    	// Check all parameters
		var inputValues = new Array();
        inputValues.push(document.getElementById("inputLeft").value);
        inputValues.push(document.getElementById("inputMean").value);
        inputValues.push(document.getElementById("inputRight").value);
        inputValues.push(document.getElementById("inputHeight").value);
        if ( !checkParameters(inputValues) ) {
			var  x = document.getElementById("chart_div");
			clearNode(x);
			return;
		}

		var plotPoints = calcTriVals(inputValues, minRange, maxRange);

		var data = new google.visualization.DataTable();
		data.addColumn('number', 'xVal');
		data.addColumn('number', 'Truth');		
		data.addRows(plotPoints.length);
		var i = 0;
		for ( var key in plotPoints ) {
			data.setCell(i, 0, plotPoints[key].leftEl);
			data.setCell(i, 1, plotPoints[key].rightEl);
			i++;
		}
		
		var funName = document.getElementById("inputFunName").value;
    	var options = { 
    		title: funName,
    		legend : { position : 'none' }
    	};       
    } else if ( mfType == "trapMF" ) {
    	// Check all parameters
		var inputValues = new Array();
        inputValues.push(document.getElementById("inputLFoot").value);
        inputValues.push(document.getElementById("inputLShoulder").value);
        inputValues.push(document.getElementById("inputRShoulder").value);
        inputValues.push(document.getElementById("inputRFoot").value);
        inputValues.push(document.getElementById("inputHeight").value);
        if ( !checkParameters(inputValues) ) {
			var  x = document.getElementById("chart_div");
			clearNode(x);
			return;
		}

		var plotPoints = calcTrapVals(inputValues, minRange, maxRange);

		var data = new google.visualization.DataTable();
		data.addColumn('number', 'xVal');
		data.addColumn('number', 'Truth');		
		data.addRows(plotPoints.length);
		var i = 0;
		for ( var key in plotPoints ) {
			data.setCell(i, 0, plotPoints[key].leftEl);
			data.setCell(i, 1, plotPoints[key].rightEl);
			i++;
		}
		
		var funName = document.getElementById("inputFunName").value;
    	var options = { 
    		title: funName,
    		legend : { position : 'none' }
    	};       
    }

	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);	
}

/**
	Called when the mfTypeSelect (membership function type selector) is changed
*/
$(function() {
    $('#mfTypeSelect').change(function() {
        drawChart();
    });    
});

/**
	Draws all membership functions of a variable

	@param {string}, the id of the div to draw to
	@param {string}, the id of the variable div
	@param {array[membership functions]}, the array of membership functions
	@param {boolean}, input variable or output
*/
function drawVarCharts(chartDiv, divId, memFuncs, isInput) {

  if ( memFuncs.length < 1 ) {
    return;
  } else {

  	var x;
  	if ( isInput ) {
  		x = inputDivs[divId];
  	} else {
  		x = outputDivs[divId];
  	}

  	var dataArray = new Array();

  	for ( var key in memFuncs ) {
  		if ( memFuncs[key].funType == "gau" ) {
			var inputValues = new Array();
			inputValues.push(memFuncs[key].paramSigma);
			inputValues.push(memFuncs[key].paramMean);
			inputValues.push(memFuncs[key].paramHeight);

			var plotPoints = calcGauVals(inputValues, x.rangeMin, x.rangeMax);
			dataArray.push(plotPoints);
  		} else if ( memFuncs[key].funType == "ga2") {
			var inputValues = new Array();
			inputValues.push(memFuncs[key].paramLeftSigma);
			inputValues.push(memFuncs[key].paramLeftMean);
			inputValues.push(memFuncs[key].paramRightSigma);
			inputValues.push(memFuncs[key].paramRightMean);
			inputValues.push(memFuncs[key].paramHeight);

			var plotPoints = calcGauBVals(inputValues, x.rangeMin, x.rangeMax);
			dataArray.push(plotPoints);
  		} else if (memFuncs[key].funType == "tri") {
			var inputValues = new Array();
			inputValues.push(memFuncs[key].paramLeft);
			inputValues.push(memFuncs[key].paramMean);
			inputValues.push(memFuncs[key].paramRight);
			inputValues.push(memFuncs[key].paramHeight);

			var plotPoints = calcTriVals(inputValues, x.rangeMin, x.rangeMax);
			dataArray.push(plotPoints);
  		} else if (memFuncs[key].funType == "trp") {
			var inputValues = new Array();
			inputValues.push(memFuncs[key].paramLeftFoot);
			inputValues.push(memFuncs[key].paramLeftShoulder);
			inputValues.push(memFuncs[key].paramRightShoulder);
			inputValues.push(memFuncs[key].paramRightFoot);
			inputValues.push(memFuncs[key].paramHeight);

			var plotPoints = calcTrapVals(inputValues, x.rangeMin, x.rangeMax);
			dataArray.push(plotPoints);
  		}
  	}
	

  	var data = new google.visualization.DataTable();
	data.addColumn('number', 'xVal');

	for ( var key in memFuncs ) {
		data.addColumn('number', memFuncs[key].funName);	
	}

	var length = dataArray[0].length; 
	data.addRows(dataArray[0].length);

	for ( var i = 0 ; i < length ; i ++ ){
		data.setCell(i, 0, dataArray[0][i].leftEl); // Set the x value

		var j = 1;
		for ( var key in dataArray ) { // set each mf truth values
			data.setCell(i,j, dataArray[key][i].rightEl);
		j++;
		}
	}

	var options;
	for ( var key in memFuncs ) {
		if ( memFuncs[key].funType != "gau" && memFuncs[key].funType != "ga2" ){
			var options = { 
		    	title: x.varName,
		    	legend : { position : 'right' },
		    	chartArea: {  left: 40, width: "70%", height: "80%" }
		    };       
		} else {
			var options = { 
		    	title: x.varName,
		    	curveType: "function", 	
		    	legend : { position : 'right' },
		    	chartArea: {  left: 40, width: "70%", height: "80%" }
		    };       
		}
	}


	var chart = new google.visualization.LineChart(chartDiv);
    chart.draw(data, options);		

  }	
}