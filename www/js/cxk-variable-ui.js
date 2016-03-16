/**  cxk-variable-ui.js
  Deals with all variable aspects of the system
  Author: Craig Knott

  Functions:
    getLength ( input );
    getTotalMfCount ( input );
    checkValidity ( divId, isInput );
    compressDiv ( divId, isInput, shouldReset );
    resizeDivs ( topDivId, isInput );
    expandDiv( divId, isInput );
    deleteDiv( divId, isInput );
    addNewVar( isInput );
    swapToFront( keyToSwap, isInput );
    setCurrentDiv ( cd, b );
    getCurrentDiv ( );
    getIsInput ( );
    convertToTable ( memFuncs, divId, isInput );
*/

// Global variables to track the input variables
var inputIndex = 0;
var inputDivs = new Array();

var outputIndex = 0;
var outputDivs = new Array();

var currentIsInput;
var currentDiv = "";

var g_originalName;
var globali = 0;
var edit = false;

/**
  Get the number of either input or output variables

  @param {boolean}, whether to get input (true), or output (false)
  @return {int}, the number of variables
*/
function getLength ( input ) {
  var i = 0;
  if ( input ) {
    for ( var key in inputDivs ){
      i++;
    }
  } else {
    for ( var key in outputDivs ){
      i++;
    }
  }
  
  return i;
}

/**
  Get the number of input or output membership functions

  @param {boolean}, whether this is an input or not
  @return {int}, the number of membership functions 
*/
function getTotalMfCount( input ){
    var total = 0;
    if ( input ) {
      for ( var key in inputDivs ) {
        total += inputDivs[key].memFuncs.length;
      }
    } else {
      for ( var key in outputDivs ) {
        total += outputDivs[key].memFuncs.length;
      }
    }

    return total;
}

/**
	Checks whether the specified variable is valid

  @param {string}, the id of the div to look at
  @param {boolean}, whether this is an input or not
  @return {int}, a number representing an error code
                  0 - No Error
                  1 - Name is missing
                  2 - Bounds are missing/invalid
                  3 - Range is invalid
*/
function checkValidity (divId, isInput) {

  var name = document.getElementById(divId + "_nameInput").value;
  var rmin = parseInt(document.getElementById(divId + "_rminInput").value);
  var rmax = parseInt(document.getElementById(divId + "_rmaxInput").value);  
 
	if ( !name ) {
		// Name is missing
		return 1;	
	} else if ( (!rmin && rmin!==0) || !rmax ){
		// A bound is missing/invalid
		return 2;	
	} else if ( rmin >= rmax ) {
		// Range is invalid
		return 3;	
  }
    
  var unique = true;
  for (var key in inputDivs){
    if (inputDivs[key].varName === name && key !== divId) {
      unique = false;
    }
  } 
  for (var key in outputDivs){
    if (outputDivs[key].varName === name && key !== divId) {
      unique = false;
    }
  } 
  if ( !unique ) {
    // Non-unique name
    return 4;
  }

	// All good!
  	return 0;
}

function saveDiv ( divId, isInput ) {
  var errorCode = checkValidity(divId, isInput);
  var errorMessage;

  if ( errorCode == 0) {
    if ( isInput ) {
      inputDivs[divId].varName = document.getElementById(divId + "_nameInput").value;
      inputDivs[divId].rangeMin = document.getElementById(divId + "_rminInput").value;
      inputDivs[divId].rangeMax = document.getElementById(divId + "_rmaxInput").value;
    } else {
      outputDivs[divId].varName = document.getElementById(divId + "_nameInput").value;
      outputDivs[divId].rangeMin = document.getElementById(divId + "_rminInput").value;
      outputDivs[divId].rangeMax = document.getElementById(divId + "_rmaxInput").value;
    }
  } else if (errorCode == 1){
    errorMessage = "<strong>Oops!</strong> It looks like you have not entered a name for your variable";
  } else if (errorCode == 2){
    errorMessage =  "<strong>Oops!</strong> Your bounds appear to be missing, or not numbers";  
  } else if (errorCode == 3){
    errorMessage = "<strong>Oops!</strong> Your bounds are causing problems, is your maximum lower than your minimum?";           
  } else if (errorCode == 4 ){
      errorMessage = "<strong>Oops!</strong> You've already given that name to one of your variables";          
  }
  errorMessage = "<div class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button>" + errorMessage + "</div>";

  if ( errorCode != 0 ){
    if ( isInput ){
      inputDivs[divId].notice.innerHTML = errorMessage;
    } else {
      outputDivs[divId].notice.innerHTML = errorMessage;
    }
  } else {
    if ( isInput ){
      inputDivs[divId].notice.innerHTML = "";
      drawVarCharts(inputDivs[divId].chartDiv, divId, inputDivs[divId].memFuncs,isInput);
    } else {
      outputDivs[divId].notice.innerHTML = "";
      drawVarCharts(outputDivs[divId].chartDiv, divId, outputDivs[divId].memFuncs,isInput);      
    }    

  }

  updateSidePanelWithVars();
}

/**
	Compresses the specified div, shrinking it in size and changing the content

  @param {string}, the id of the div to look at
  @param {boolean}, whether this is an input or not
  @param {boolean}, whether or not this div should be reset or not
*/
function compressDiv ( divId, isInput, shouldReset ) {
	var errorCode = checkValidity(divId, isInput);
  var errorMessage;

	if ( errorCode == 0 ){
    if ( isInput ) {
      inputDivs[divId].varName = document.getElementById(divId + "_nameInput").value;
      inputDivs[divId].rangeMin = document.getElementById(divId + "_rminInput").value;
      inputDivs[divId].rangeMax = document.getElementById(divId + "_rmaxInput").value;

      if ( shouldReset ) {
        inputDivs[divId].resetContent();
        inputDivs[divId].getSmallContent();
        inputDivs[divId].div.className = "variable span3";
        inputDivs[divId].div.spanSize = "3";

        inputDivs[divId].notice.innerHTML = "";

        for ( var key in inputDivs ){
          swapToFront(key, isInput);
          break;
        }    
      }
      
    } else {
      outputDivs[divId].varName = document.getElementById(divId + "_nameInput").value;
      outputDivs[divId].rangeMin = document.getElementById(divId + "_rminInput").value;
      outputDivs[divId].rangeMax = document.getElementById(divId + "_rmaxInput").value;

      if ( shouldReset ) {
        outputDivs[divId].resetContent();
        outputDivs[divId].getSmallContent();
        outputDivs[divId].div.className = "variable span3";
        outputDivs[divId].div.spanSize = "3";

        outputDivs[divId].notice.innerHTML = "";

        for ( var key in outputDivs ){
          swapToFront(key, isInput);
          break;
        }      
      }
    }
		
	} else if (errorCode == 1){
		errorMessage = "<strong>Oops!</strong> It looks like you have not entered a name for your variable";
	} else if (errorCode == 2){
		errorMessage =  "<strong>Oops!</strong> Your bounds appear to be missing, or not numbers";	
	} else if (errorCode == 3){
		errorMessage = "<strong>Oops!</strong> Your bounds are causing problems, is your maximum lower than your minimum?";						
	}	else if (errorCode == 4 ){
      errorMessage = "<strong>Oops!</strong> You've already given that name to one of your variables";          
  }
  errorMessage = "<div class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button>" + errorMessage + "</div>";

  if ( errorCode != 0 ){
    if ( isInput ){
      inputDivs[divId].notice.innerHTML = errorMessage;
    } else {
      outputDivs[divId].notice.innerHTML = errorMessage;
    }
  }
  updateSidePanelWithVars();
}

/**
	Compresses all divs, excluding the one at index /topDivId/

  @param {string}, the id of the div listed first currently
  @param {boolean}, whether this is an input or not
*/
function resizeDivs (topDivId, isInput) {
	// Reduce size of all divs except newly clicked
  if ( isInput ){
    for ( var key in inputDivs ) {
      if ( key !== topDivId && inputDivs[key].div.spanSize == "9" ) {
        compressDiv(key, isInput, true);
      }
    }  
  } else {
    for ( var key in outputDivs ) {
      if ( key !== topDivId && outputDivs[key].div.spanSize == "9" ) {
        compressDiv(key, isInput, true);
      }
    }      
  }
}

/**
	Expands the specified div, growing it in size and changing the content

  @param {string}, the id of the div to expand
  @param {boolean}, whether this is an input or not  
*/
function expandDiv(divId, isInput){
	resizeDivs (divId, isInput);
	swapToFront(divId, isInput);
  if ( isInput ){
    inputDivs[divId].resetContent();
    inputDivs[divId].getBigContent();
    inputDivs[divId].div.className = "variable span9";
    inputDivs[divId].div.spanSize = "9";
  } else {
    outputDivs[divId].resetContent();
    outputDivs[divId].getBigContent();
    outputDivs[divId].div.className = "variable span9";
    outputDivs[divId].div.spanSize = "9";    
  }
}

/**
	Deletes the specified div, after giving a warning

  @param {string}, the id of the div to expand
  @param {boolean}, whether this is an input or not    
*/
function deleteDiv(divId, isInput) {

	var r = confirm("This will permanently delete this variable (and any rules you have), are you sure you wish to continue?")
	if (r) { 		
    if ( isInput ) {
      for ( var key in inputDivs ) {
        if ( key === divId ) {
          delete inputDivs[key];
        }
      }
      systemRules.length = 0;
      printRules();
      var myDiv = document.getElementById('mainDivInput');
      myDiv.removeChild(document.getElementById(divId));      
    } else {
      for ( var key in outputDivs ) {
        if ( key === divId ) {
          delete outputDivs[key];
        }
      }
      systemRules.length = 0;
      printRules();
      var myDiv = document.getElementById('mainDivOutput');
      myDiv.removeChild(document.getElementById(divId));            
    }
  } 
  updateSidePanelWithVars();
}

/**
	Adds a new variable to the system

  @param {boolean}, whether this variable is an input or and output
*/
function addNewVar(isInput){
  if ( systemRules.length > 0 ) {
    var r = confirm("Doing this will result in your rule base becoming invalid, are you sure you wish to do this?")
    if ( r ) {    
      systemRules.length = 0;
      printRules();
    }  else {
      return;
    }
  }

  if ( isInput ){
    var mainDiv = document.getElementById("mainDivInput")

    var sysVar = new systemVar("Input Variable " + inputIndex, "inputDiv" + inputIndex, isInput);
    inputIndex++;

    mainDiv.appendChild(sysVar.createDiv());
    inputDivs[sysVar.divId] = sysVar;  
  } else {
    var mainDiv = document.getElementById("mainDivOutput")

    var sysVar = new systemVar("Output Variable " + outputIndex, "outputDiv" + outputIndex, isInput);
    outputIndex++;

    mainDiv.appendChild(sysVar.createDiv());
    outputDivs[sysVar.divId] = sysVar;      
  }

  updateSidePanelWithVars();
  printRules();
}

/**
  Displays the inputs and outputs of the system in the side panel
*/
function updateSidePanelWithVars(){

  var x = document.getElementById("dispSysInfo");
  clearNode(x);
  
  x.appendChild(document.createTextNode("Input Values"));
  x.appendChild(document.createElement("br"));      
  for ( var key in inputDivs ){
    x.appendChild(document.createTextNode(inputDivs[key].varName + " { "));
    for ( var key2 in inputDivs[key].memFuncs ) {
      if ( isLastKey ( key2, inputDivs[key].memFuncs ) ) {
        x.appendChild(document.createTextNode(inputDivs[key].memFuncs[key2].funName)); 
      } else {
        x.appendChild(document.createTextNode(inputDivs[key].memFuncs[key2].funName + ", "));        
      }
      
    } 
    x.appendChild(document.createTextNode(" }"));
    x.appendChild(document.createElement("br")); 
  }
  x.appendChild(document.createElement("br")); 
  x.appendChild(document.createTextNode("Output Values"));
  x.appendChild(document.createElement("br"));     
  for ( var key in outputDivs ){
    x.appendChild(document.createTextNode(outputDivs[key].varName + " { "));
    for ( var key2 in outputDivs[key].memFuncs ) {
      if ( isLastKey ( key2, outputDivs[key].memFuncs ) ) {
        x.appendChild(document.createTextNode(outputDivs[key].memFuncs[key2].funName)); 
   
      } else {
        x.appendChild(document.createTextNode(outputDivs[key].memFuncs[key2].funName + ", "));        
      }
    }
    x.appendChild(document.createTextNode(" }"));
    x.appendChild(document.createElement("br"));  
  }

}


/**
	Set the div at index 'keyToSwap' to be above all other divs

  @param {string}, the key of the div to swap to the top
  @param {boolean}, whether this variable is an input or and output
*/
function swapToFront(keyToSwap, isInput ){
  if ( isInput ) {
    var mainDiv = document.getElementById("mainDivInput");
    
    // Remove all current children
    var fc = mainDiv.firstChild;
    while( fc ) {
        mainDiv.removeChild( fc );
        fc = mainDiv.firstChild;
    }

    // Add necessary first, empty, div
    var breakDiv = document.createElement("div");
    breakDiv.className = "break";
    mainDiv.appendChild(breakDiv);

    mainDiv.appendChild(inputDivs[keyToSwap].div);
    for ( var key in inputDivs ) {
      if ( key !== keyToSwap ){
        mainDiv.appendChild(inputDivs[key].div);
      }
    }    
  } else {
    var mainDiv = document.getElementById("mainDivOutput");
    
    // Remove all current children
    var fc = mainDiv.firstChild;
    while( fc ) {
        mainDiv.removeChild( fc );
        fc = mainDiv.firstChild;
    }

    // Add necessary first, empty, div
    var breakDiv = document.createElement("div");
    breakDiv.className = "break";
    mainDiv.appendChild(breakDiv);

    mainDiv.appendChild(outputDivs[keyToSwap].div);
    for ( var key in outputDivs ) {
      if ( key !== keyToSwap ){
        mainDiv.appendChild(outputDivs[key].div);
      }
    }        
  }
}


/**
  Sets the current div, so we know where to store membership functions

  @param {string}, the id of the current div
  @param {boolean}, whether this is an input or output
*/
function setCurrentDiv (cd, b) {
  currentDiv = cd;
  currentIsInput = b;
}

/**
  Gets the currently active div

  @return {string}, returns the id of the current div
*/
function getCurrentDiv ( ){

    return currentDiv;
}

/**
  Gets whether or not the current active div is an input variable or not

  @param {boolean}, whether the div is an input or output
*/
function getIsInput (){ 

  return currentIsInput;
}


/**
  Creates a table to display the membership functions in
  
  @param {array[membershipFunction]}, array of membership functions to print 
  @param {string}, the id of the div to print the membership functions to
  @param {boolean}, whether the div is an input or output
  @return {table}, the table of membership functions to be printed
*/
function convertToTable ( memFuncs, divId, isInput ) {
  if ( memFuncs.length < 1 ) {
    return document.createElement("br");
  }
  var tbl = document.createElement("table");
  
  var tbl_header = document.createElement("tr");
  tbl.appendChild(tbl_header);
  var tbld = document.createElement("td");
    tbld.appendChild(document.createTextNode("Name"));
    tbld.setAttribute("style", "font-weight:bold");
    tbl_header.appendChild(tbld);
  
  tbld = document.createElement("td");
    tbld.appendChild(document.createTextNode("Type"));
    tbld.setAttribute("style", "font-weight:bold");
    tbl_header.appendChild(tbld);   


    tbld = document.createElement("td");
    tbl_header.appendChild(tbld);

    tbld = document.createElement("td");
    tbl_header.appendChild(tbld);
  
  for ( var i = 0 ; i < memFuncs.length ; i ++ ) {
    var sid = divId + "-tr" + i;
    var tbl_row = document.createElement("tr");
    tbl_row.setAttribute("id", sid);
    tbl.appendChild(tbl_row);
    
    tbld = document.createElement("td");
    tbld.appendChild(document.createTextNode(memFuncs[i].funName));
    tbl_row.appendChild(tbld);        

    tbld = document.createElement("td");
    tbld.appendChild(document.createTextNode(convertType(memFuncs[i].funType)));
    tbl_row.appendChild(tbld);            

    tbld = document.createElement("td");
    var editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.setAttribute("data-toggle","modal");
    editButton.setAttribute("href","#myModal");
    editButton.className = "btn btn-primary";
    var s = i + ", \"" + divId +"\", " + isInput;
    var d = "\"" + divId +"\", " + isInput;
    editButton.setAttribute("onclick", "setCurrentDiv(" + d + "), editMembershipFunction(" + s + ")");    
    tbld.appendChild(editButton);
    tbl_row.appendChild(tbld);  
    
    
    tbld = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.appendChild(document.createTextNode("Delete"));
    var s = i + ", \"" + divId +"\", " + isInput;
    deleteButton.setAttribute("onclick", "deleteMembershipFunction(" + s + ")");
    tbld.appendChild(deleteButton);
    tbl_row.appendChild(tbld);    
  }

  return tbl;
}