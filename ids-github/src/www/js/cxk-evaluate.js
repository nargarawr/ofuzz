/**  cxk-evaluate.js
  Deals with the system evaluator
  Author: Craig Knott

  Functions:
  	generateEvaluatorUI ();
  	checkBounds ( htmlObject, min, max );
	storeValues ();
*/

/**
	Generate the UI for the system evaluator
*/
function generateEvaluatorUI () {
	var d = document.getElementById("inputValueList")
	clearNode(d);
	var h = document.createElement("h3");
	h.appendText("Inputs")
	d.appendChild(h)

	if ( getLength(true) < 1 ){
		d.appendText("None Yet!")
	}


	if ( getLength(true) == 2 && getLength(false) == 1) {
		clearNode(document.getElementById("beforeYouPlot"))
		var h3 = document.createElement("h3")
		h3.appendText("Surface plot of your system")
		document.getElementById("beforeYouPlot").appendChild(h3)
	} else {
		clearNode(document.getElementById("beforeYouPlot"))
	}

	for ( var key in inputDivs) {
		var inpBoxLabel = document.createElement("label")
		inpBoxLabel.setAttribute("for", "eval-inp-" + key)
		inpBoxLabel.appendText(inputDivs[key].varName + " (" +  inputDivs[key].rangeMin + "-"  + inputDivs[key].rangeMax +")")
		d.appendChild(inpBoxLabel)

		var inpBox = document.createElement("input")
		inpBox.setAttribute("max",inputDivs[key].rangeMax);
		inpBox.setAttribute("min",inputDivs[key].rangeMin);
		var s = "storeValues(); checkBounds(this, " + inputDivs[key].rangeMin + ", " + inputDivs[key].rangeMax + ")";
		inpBox.setAttribute("onchange", s)
		inpBox.className="shiny-bound-input";
		inpBox.id="eval-inp-" + key;
		inpBox.type="number";
		d.appendChild(inpBox)
	}

	exportFile('ufis');
}

/**
	Checks that a given numeric input is within it's bounds

	@param{htmlObject}, the numeric input to check
	@param{int}, the min bound
	@param{int}, the max bound
*/
function checkBounds ( htmlObject, min, max ) {
	if ( htmlObject.value > max ) {
		htmlObject.value = max;
	} else if ( htmlObject.value < min ){
		htmlObject.value = min;
	}
}

/**
	Stores the values of the input boxes in the pass back box for Shiny
*/
function storeValues (  ) {
	exportFile('ufis');
	Shiny.unbindAll();

	var d = document.getElementById("inputValueList")

	var s = "";

	for ( var c in d.childNodes ){
		var textbox = d.childNodes[c];
		if (textbox.tagName && textbox.tagName.toLowerCase() == "input" && textbox.type.toLowerCase() == "number"){
			if ( textbox.value != "" ) {
				s += textbox.value + " ";
			}
			
		}
	}
	$("#passBackEval").val(s)
	
	Shiny.bindAll();
}
