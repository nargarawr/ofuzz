/**  cxk-objects.js
  All of the objects present in the system
  Author: Craig Knott

  Functions:
    triMemFun (name, left, mean, right, height);
    trapMemFun (name, lfoot, lshould, rshould, rfoot, height);
  	gauMemFun (name, sigma, mean, height);
    gau2MemFun (name, lsigma, lmean, rsigma, rmean, height);
    systemVar(m_varName, divId, isInput);
    systemRule(m_inputList, m_outputList, weight, connective);	
*/

/**
	Triangular Membership Function

	@param {string}, the name of the function
	@param {double}, the left foot of the function
	@param {double}, the center of the function
	@param {double}, the right foot of the function
	@param {double}, the height of the function
*/
function triMemFun (name, left, mean, right, height) {
    this.funName            = name;
    this.funType            = "tri";
    this.paramLeft          = left;
    this.paramMean          = mean;
    this.paramRight         = right;
    this.paramHeight        = height; 
}

/**
	Trapezoidal Membership Function

	@param {string}, the name of the function
	@param {double}, the left foot of the function 
	@param {double}, the left shoulder of the function
	@param {double}, the right shoulder of the function
	@param {double}, the right foot of the function
	@param {double}, the height of the function
*/
function trapMemFun (name, lfoot, lshould, rshould, rfoot, height) {
    this.funName            = name;
    this.funType            = "trp";
    this.paramLeftFoot      = lfoot;
    this.paramLeftShoulder  = lshould;
    this.paramRightShoulder = rshould;
    this.paramRightFoot     = rfoot;
    this.paramHeight        = height; 
}

/**
	Gaussian Membership Function

	@param {string}, the name of the function
	@param {double}, the standard deviation of the function
	@param {double}, the center of the function
	@param {double}, the height of the function
*/
function gauMemFun (name, sigma, mean, height){
    this.funName            = name;
    this.funType            = "gau";
    this.paramSigma         = sigma;
    this.paramMean          = mean;
    this.paramHeight        = height;
}

/**
	2-Part Gaussian Membership Function

	@param {string}, the name of the function
	@param {double}, the standard deviation of the first function
	@param {double}, the center of the first function
	@param {double}, the standard deviation of the second function
	@param {double}, the center of the second function	
	@param {double}, the height of the functions
*/
function gau2MemFun (name, lsigma, lmean, rsigma, rmean, height) {
    this.funName            = name;
    this.funType            = "ga2";
    this.paramLeftSigma     = lsigma;
    this.paramLeftMean      = lmean;
    this.paramRightSigma    = rsigma;
    this.paramRightMean     = rmean;
    this.paramHeight        = height;   
}

/**
	A fuzzy variable object

	@param {string}, the name of the variable
	@param {string}, the id of the div this is stored in
	@param {boolean}, whether this is an input or output
*/
function systemVar(m_varName, divId, isInput){
	// Fuzzy values
	this.varName = m_varName;
	this.rangeMin = 0;
	this.rangeMax = 1;
	this.isInput = isInput;
	this.memFuncs = new Array();

	// HTML div values 
	this.spanSize = 3;
	this.divId = divId;
	this.div = null;
	this.notice = null;
	this.chartDiv = null;

	/**
		Updates the range and function count of the small view
	*/
	this.updateSmallView = updateSmallView;
	function updateSmallView () {
		clearNode(this.div);
		this.getSmallContent();
	}

	/**
		Creates the div to store all viewable content

		@return {string}, this as a div
	*/
	this.createDiv = createDiv; 
	function createDiv () {
		this.notice = document.createElement("div");

		this.div = document.createElement("div");
		this.div.id = this.divId;
		this.div.className = "variable span" +this.spanSize;
		this.resetContent();
		this.getSmallContent();
		return this.div;
	}

	/**
		Resets content of this div, to be refreshed
	*/
	this.resetContent=resetContent;
	function resetContent () {
		var fc = this.div.firstChild;
		while( fc ) {
	    	this.div.removeChild( fc );
	    	fc = this.div.firstChild;
		}
	}

	/**
		Redisplays the membership functions of the variable
	*/
	this.refreshMembershipFunctions = refreshMembershipFunctions;
	function refreshMembershipFunctions () {
		var c = document.getElementById(this.div.id + "Inner");
		var fc = c.firstChild;
		
		while( fc ) {
	    	c.removeChild( fc );
	    	fc = c.firstChild;
		}
		

		var varFunctionsLabel = document.getElementById(this.div.id+"titleText");
		varFunctionsLabel.innerHTML = "Functions: " + this.memFuncs.length;

		c.appendChild(convertToTable(this.memFuncs, this.divId, this.isInput));
	}

	/**
		Displays the 'compressed' content of a variable
	*/
	this.getSmallContent = getSmallContent;
	function getSmallContent () {
		var p = document.createElement("h4");
		p.className = "titleText";
		p.appendChild(document.createTextNode(this.varName));
		this.div.appendChild(p);

		this.div.appendChild(document.createElement("br"));
		this.div.appendChild(document.createElement("br"));

		var r = document.createElement("h5");
		r.className = "titleText";
		r.appendChild(document.createTextNode("Range: " + this.rangeMin + "-" + this.rangeMax));
		this.div.appendChild(r);		

		this.div.appendChild(document.createElement("br"));
		this.div.appendChild(document.createElement("br"));

		var mf = document.createElement("h5");
		mf.className = "titleText";
		mf.appendChild(document.createTextNode("Functions: " + this.memFuncs.length));
		this.div.appendChild(mf);				

		this.div.appendChild(document.createElement("br"));
		this.div.appendChild(document.createElement("br"));

		var editButton = document.createElement("button");
		editButton.className = "btn btn-primary variableButton lowMarge";
		editButton.appendChild(document.createTextNode("Edit"));
		var s = "\"" + this.divId +"\", " + this.isInput;
		editButton.setAttribute("onClick", "expandDiv(" + s +  ")");
		this.div.appendChild(editButton);

		var deleteButton = document.createElement("button");
		deleteButton.className = "btn btn-danger variableButton lowMarge";
		deleteButton.appendChild(document.createTextNode("Delete"));
		var s = "\"" + this.divId +"\", " + this.isInput;
		deleteButton.setAttribute("onClick", "deleteDiv(" + s +  ")");
		this.div.appendChild(deleteButton);
	}

	/**
		Displays the 'expanded' content of a variable
	*/
	this.getBigContent = getBigContent;
	function getBigContent () {

		var upperContent = document.createElement("div");
		upperContent.id = "upperDiv_" + this.divId;
		upperContent.setAttribute("style", "width:100%; overflow:hidden");

		var divUpperLeft = document.createElement("div");
		divUpperLeft.setAttribute("style", "width: 50%; float:left; margin-bottom:2.5%");

		var chartDiv = document.createElement("div");
		chartDiv.id = this.divId + "_chartDiv";
		chartDiv.setAttribute("style", "float:left; ");
		this.chartDiv = chartDiv;

		drawVarCharts(this.chartDiv, this.divId, this.memFuncs, this.isInput);

		this.div.appendChild(this.notice);

		var varNameLabel = document.createElement("h4");
		varNameLabel.className = "titleText";
		varNameLabel.setAttribute("style", "width:90%")
		varNameLabel.appendChild(document.createTextNode("Variable Name"));
		divUpperLeft.appendChild(varNameLabel);		

		var varNameInput = document.createElement("input");
		varNameInput.id = this.divId + "_nameInput";
		varNameInput.type = "text";
		varNameInput.value = this.varName;
		varNameInput.className = "indent";
		varNameInput.setAttribute("style", "width:82.5%")
		divUpperLeft.appendChild(varNameInput);
		 
		var varRangeLabel = document.createElement("h4");
		varRangeLabel.className = "titleText";
		varRangeLabel.setAttribute("style", "width:90%")
		varRangeLabel.appendChild(document.createTextNode("Range (min-max)"));
		divUpperLeft.appendChild(varRangeLabel);

		var varMinInput = document.createElement("input");
		varMinInput.id = this.divId + "_rminInput";
		varMinInput.type = "number";
		varMinInput.className="indent";
		varMinInput.setAttribute("style", "width:40%")
		varMinInput.value = this.rangeMin;
		divUpperLeft.appendChild(varMinInput);

		var varMaxInput = document.createElement("input");
		varMaxInput.id = this.divId + "_rmaxInput";
		varMaxInput.type = "number";
		varMaxInput.value = this.rangeMax;
		varMaxInput.setAttribute("style", "width:40%")
		divUpperLeft.appendChild(varMaxInput);

		upperContent.appendChild(divUpperLeft)
		upperContent.appendChild(this.chartDiv)
		this.div.appendChild(upperContent)

		this.div.appendChild(document.createElement("br"));		

		var varFunctionsLabel = document.createElement("h4");
		varFunctionsLabel.className = "titleText";
		varFunctionsLabel.id = this.div.id + "titleText";
		varFunctionsLabel.appendChild(document.createTextNode("Functions: " + this.memFuncs.length));
		this.div.appendChild(varFunctionsLabel);

		this.div.appendChild(document.createElement("br"));		
		this.div.appendChild(document.createElement("hr"));

		var innerDiv = document.createElement("div");
		innerDiv.setAttribute("id",this.div.id + "Inner");
		this.div.appendChild(innerDiv);

		innerDiv.appendChild(convertToTable(this.memFuncs, this.divId, this.isInput));


		// Buttons 
		var buttonDiv = document.createElement("div");
		buttonDiv.id = "btnDiv_" + this.divId;
		buttonDiv.setAttribute("style", "width:100%; overflow:hidden");

		var divLeft = document.createElement("div");
		divLeft.setAttribute("style", "width: 40%; float:left;");
			
		var divRight = document.createElement("div");
		divRight.setAttribute("style", "width:60%; float:right");
	
		var addMFButton = document.createElement("button");
		addMFButton.className = "btn variableButton smallIndent btn-primary";
		addMFButton.appendChild(document.createTextNode("Add Membership Function"));
		addMFButton.setAttribute("data-toggle","modal");
		addMFButton.setAttribute("href","#myModal");
		var d = "\"" + this.divId +"\", " + this.isInput;
		var e = "\"" + this.divId +"\", " + this.isInput + ", false";
		addMFButton.setAttribute("onclick","checkValidity(" + d + "); clearPopovers(); updateModal(); saveDiv(" + d + "); setCurrentDiv(" + d + ")");
		divLeft.appendChild(addMFButton);


		var deleteButton = document.createElement("button");
		deleteButton.className = "btn btn-danger variableButton";
		deleteButton.appendChild(document.createTextNode("Delete"));
		deleteButton.setAttribute("style", "margin-left:2.5%; float:right")
		var s = "\"" + this.divId +"\", " + this.isInput;
		deleteButton.setAttribute("onClick", "deleteDiv(" + s +  ")");
		divRight.appendChild(deleteButton);

		var saveButton = document.createElement("button");
		saveButton.className = "btn btn-success variableButton";
		saveButton.appendChild(document.createTextNode("Save"));
		saveButton.setAttribute("style", "margin-left:2.5%; float:right")
		var s2 = "\"" + this.divId +"\", " + this.isInput;
		saveButton.setAttribute("onClick", "saveDiv(" + s2 +  ")");
		divRight.appendChild(saveButton);

		var closeButton = document.createElement("button");
		closeButton.className = "btn btn-success variableButton";
		closeButton.setAttribute("style", "margin-left:2.5%; float:right")
		closeButton.appendChild(document.createTextNode("Save and Close"));
		var s2 = "\"" + this.divId +"\", " + this.isInput + ", true";
		closeButton.setAttribute("onClick", "compressDiv(" + s2 +  ")");
		divRight.appendChild(closeButton);

		buttonDiv.appendChild(divLeft);
		buttonDiv.appendChild(divRight);


		this.div.appendChild(buttonDiv);

	}
}

/**
	A object to pair together two homogeneous elements

	@param {a}, the left hand element
	@param {b}, the right hand element
*/
function pair ( l, r ) {
	this.leftEl = l;
	this.rightEl = r;
}

/**	Rule object

	@param {array[rulePair]}, an array of pairs of variables and terms for inputs
	@param {array[rulePair]}, an array of pairs of variables and terms for outputs
	@param {double}, the weight of the rule in the system
	@param {string}, the connective to use in this rule

*/
function systemRule(m_inputList, m_outputList, weight, connective){
	this.inputList = m_inputList;
	this.outputList = m_outputList;
	this.weight = weight;
	this.connective = connective;
}

/**
	A object to pair together two homogeneous elements and a boolean

	@param {a}, the left hand element
	@param {b}, the right hand element
	@param {boolean}, whether the rule is negated or not
*/
function rulePair ( l, r, n ) {
	this.leftEl = l;
	this.rightEl = r;
	this.negated = n;
}