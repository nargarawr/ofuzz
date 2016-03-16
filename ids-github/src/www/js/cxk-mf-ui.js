/**  cxk-mf-ui.js
  Deals with all membership function storage and display
  Author: Craig Knott

  Functions:
    $(document).ready(function();
      $('#myModal').on('hidden', function ();
    updateModal ( selectionId );
    findMfInVar ( varDiv, mf );
    addElements ( id , mfType );
    errorsInFunction ( arr );
    overwriteMembershipFunction ( divId, isInput, originalName );
    createMembershipFunction( divId, isInput );
    deleteMembershipFunction ( i, divId, isInput );
    convertType ( type );
    getFuncNum ( divId, funcName );
    editMembershipFunction (i, divId, isInput );
*/

/**
  Functions that are called when the page is loaded
*/
$(document).ready(function() {
    /**
      Functions to be called when the modal window is closed in any way
    */
    $('#myModal').on('hidden', function () {
        clearPopovers();
        document.getElementById('inputFunName').value = "";
        edit = false;
    });
});

/**
	Updates the membership function creator based on the mf type selection

  @param {int}, the selected value of the option box
*/
function updateModal (selectionId) {
	var s = document.getElementById ( 'mfTypeSelect' );
	var opt = s.options[s.selectedIndex].value;

	var vo = document.getElementById ( "variableOptions" ) ; 
  clearNode(vo);   

	addElements ( vo, opt );
}

/**
  Finds the index of a membership function in a variable, by name

  @param {Variable}, the variable to search in
  @param {string}, the name to look for
  @return {int}, the index of the name
*/
function findMfInVar ( varDiv, mf ) {
  var i = 1;
  for ( var key in varDiv.memFuncs ) {
    if (strcmp (mf, varDiv.memFuncs[key].funName) == 0) {
      return i;
    } else {
      i++;
    }
  } 

  return 0;
}

/**
	Adds the relevant input elements to the membership function creator

  @param {int}, the index of the div to add to
  @param {string}, the type of the membership function being added
*/
function addElements ( id, mfType ){
    var  x = document.getElementById("chart_div");
    clearNode(x);

    if ( mfType == "gaussMF" ) {
        var inputBox1 = document.createElement("input");
        inputBox1.setAttribute("id","inputSigma");
        inputBox1.setAttribute("onBlur","drawChart()");


        var inputBox2 = document.createElement("input");
        inputBox2.setAttribute("id","inputMean");
        inputBox2.setAttribute("onBlur","drawChart()");
        
        id.appendChild(document.createTextNode("Sigma"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox1);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Mean"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox2);
        id.appendChild((document.createElement("br")));      
    } else if ( mfType == "gaussbMF" ) {
        var inputBox1 = document.createElement("input");
        inputBox1.id = "inputLSigma";
        inputBox1.setAttribute("onBlur", "drawChart()");

        var inputBox2 = document.createElement("input");
        inputBox2.id = "inputLMean";
        inputBox2.setAttribute("onBlur", "drawChart()");

        var inputBox3 = document.createElement("input");
        inputBox3.id = "inputRSigma";
        inputBox3.setAttribute("onBlur", "drawChart()");

        var inputBox4 = document.createElement("input");
        inputBox4.id = "inputRMean";
        inputBox4.setAttribute("onBlur", "drawChart()");

        id.appendChild(document.createTextNode("Left Sigma"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox1);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Left Mean"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox2);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Right Sigma"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox3);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Right Mean"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox4);
        id.appendChild((document.createElement("br")));
    } else if ( mfType == "triMF" ) {
        var inputBox1 = document.createElement("input");
        inputBox1.id = "inputLeft";
        inputBox1.setAttribute("onBlur", "drawChart()")

        var inputBox2 = document.createElement("input");
        inputBox2.id = "inputMean";
        inputBox2.setAttribute("onBlur", "drawChart()")

        var inputBox3 = document.createElement("input");
        inputBox3.id = "inputRight";
        inputBox3.setAttribute("onBlur", "drawChart()")

        id.appendChild(document.createTextNode("Left"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox1);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Mean"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox2);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Right"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox3);
        id.appendChild((document.createElement("br")));
    } else if ( mfType == "trapMF" ) {
        var inputBox1 = document.createElement("input");
        inputBox1.id = "inputLFoot";
        inputBox1.setAttribute("onBlur", "drawChart()")

        var inputBox2 = document.createElement("input");
        inputBox2.id = "inputLShoulder";
        inputBox2.setAttribute("onBlur", "drawChart()")

        var inputBox3 = document.createElement("input");
        inputBox3.id = "inputRShoulder";
        inputBox3.setAttribute("onBlur", "drawChart()")

        var inputBox4 = document.createElement("input");
        inputBox4.id = "inputRFoot";
        inputBox4.setAttribute("onBlur", "drawChart()")

        id.appendChild(document.createTextNode("Left Foot"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox1);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Left Shoulder"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox2);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Right Shoulder"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox3);
        id.appendChild((document.createElement("br")));
        id.appendChild(document.createTextNode("Right Foot"));
        id.appendChild((document.createElement("br")));
        id.appendChild(inputBox4);
        id.appendChild((document.createElement("br")));
    } else {

        alert("Invalid option selected or option not yet supported");
    }  

      var inputBox5 = document.createElement("input");        
      inputBox5.id = "inputHeight";
      inputBox5.setAttribute("onBlur","drawChart()");


      id.appendChild(document.createTextNode("Height"));  
      id.appendChild((document.createElement("br")));
      id.appendChild(inputBox5);
}

/**
	Checks for any errors in a given membership function
	
  @param {int}, the array of membership function parameters to check
  @return {int}, error code
                  code 0 - valid
                  code 1 - no name
                  code 2 - a parameter is blank / not a number
*/
function errorsInFunction (arr) {
      if ( arr[0] === "" ){
        return 1;
      }

      for (i = 1 ; i < arr.length; i++){
        if ( isNaN (arr[i]) || arr[i] === "") {
          return 2;  
        }       
      }

      return 0;
}

/**
  Overwrites a give membership function with a new one

  @param {string}, the id of the div to add to
  @param {boolean}, whether this is an input or not
  @param {string}, the original name of the membership function
*/
function overwriteMembershipFunction (divId, isInput, originalName) {
  // Get the entered values
  var vals;
  var mf;
  if ( isInput ){
    mf = inputDivs[divId].memFuncs[globali];
  } else {
    mf = outputDivs[divId].memFuncs[globali];
  }
  
  var mfName = document.getElementById('inputFunName').value;

  // Error checking on parameters
  if ( strcmp(mfName,"") == 0 ){
    alert("You have not entered a function name.");
    return;
  }

  // Check for duplicate names
    if ( isInput ){
      for ( var i = 0 ; i < inputDivs[divId].memFuncs.length ; i ++ ){       
          var m = inputDivs[divId].memFuncs[i];
          if (mfName == m.funName && mfName != g_originalName) {
              alert("Function names must be unique");
              return;
          }
      }
    } else {
      for ( var i = 0 ; i < outputDivs[divId].memFuncs.length ; i ++ ){       
          var m = outputDivs[divId].memFuncs[i];
          if (mfName == m.funName && mfName != g_originalName) {
              alert("Function names must be unique");
              return;
          }
      }
    }

    var s = document.getElementById ( 'mfTypeSelect' );
    var opt = s.options[s.selectedIndex].value;
    var vals;

    if ( opt == "gaussMF" ){
        mf.paramSigma = document.getElementById('inputSigma').value;  
        mf.paramMean = document.getElementById('inputMean').value;    
        mf.funType = "gau";

        vals = [mf.paramSigma, mf.paramMean, document.getElementById('inputHeight').value];
    } else if ( opt == "gaussbMF" ){
        mf.paramLeftSigma = document.getElementById('inputLSigma').value;  
        mf.paramLeftMean = document.getElementById('inputLMean').value;  
        mf.paramRightSigma = document.getElementById('inputRSigma').value;  
        mf.paramRightMean = document.getElementById('inputRMean').value;  
        mf.funType = "ga2";

        vals = [mf.paramLeftSigma, mf.paramLeftMean, mf.paramRightSigma, mf.paramRightMean, document.getElementById('inputHeight').value];
    } else if ( opt == "triMF" ){
        mf.paramLeft = document.getElementById('inputLeft').value;  
        mf.paramMean = document.getElementById('inputMean').value;  
        mf.paramRight = document.getElementById('inputRight').value;  
        mf.funType = "tri";

        vals = [mf.paramLeft, mf.paramMean, mf.paramRight, document.getElementById('inputHeight').value];
    } else if ( opt == "trapMF" ){
        mf.paramLeftFoot = document.getElementById('inputLFoot').value;  
        mf.paramLeftShoulder = document.getElementById('inputLShoulder').value;  
        mf.paramRightShoulder = document.getElementById('inputRShoulder').value;  
        mf.paramRightFoot = document.getElementById('inputRFoot').value;  
        mf.funType = "trp";

        vals = [mf.paramLeftFoot, mf.paramLeftShoulder,  mf.paramRightFoot, mf.paramRightShoulder, document.getElementById('inputHeight').value];
    } 
    mf.funName = document.getElementById('inputFunName').value;
    mf.paramHeight = document.getElementById('inputHeight').value;

      for (i = 0 ; i < vals.length; i++){
        if ( isNaN (vals[i]) || vals[i] === "") {
          alert("Some parameters were not numbers, or were blank");
          return;
        }       
      }

  // Refresh display
  if ( isInput ){
    inputDivs[divId].refreshMembershipFunctions();       
  } else {
    outputDivs[divId].refreshMembershipFunctions();
  }

  // Close modal
  $('#myModal').modal('hide');

  edit = false;

  if ( isInput ){
    drawVarCharts(inputDivs[divId].chartDiv, divId, inputDivs[divId].memFuncs, isInput)
  } else {
    drawVarCharts(outputDivs[divId].chartDiv, divId, outputDivs[divId].memFuncs, isInput)
  }

}

/**
  Creates a membership function from the input elements

  @param {string}, the id of the div to add to
  @param {boolean}, whether this is an input or not
*/
function createMembershipFunction( divId, isInput ) {

    if ( edit ) {
      overwriteMembershipFunction(divId, isInput, g_originalName);
      return;
    }

    var s = document.getElementById ( 'mfTypeSelect' );
    var opt = s.options[s.selectedIndex].value;
    var mfName = document.getElementById('inputFunName').value;
    var pHeight = document.getElementById('inputHeight').value;  
    var isNotUniqueName = false;

    // Check for unique names
    if ( isInput ){
      for ( var i = 0 ; i < inputDivs[divId].memFuncs.length ; i ++ ){       
          var mf = inputDivs[divId].memFuncs[i];
          if (mfName === mf.funName) {
              alert("Function names must be unique");
              return;
          }
      }
    } else {
      for ( var i = 0 ; i < outputDivs[divId].memFuncs.length ; i ++ ){       
          var mf = outputDivs[divId].memFuncs[i];
          if (mfName === mf.funName) {
              alert("Function names must be unique");
              return;
          }
      }
    }
    
    // Get the entered values
    var vals;
    if ( opt == "gaussMF" ){
        var pSigma = document.getElementById('inputSigma').value;  
        var pMean = document.getElementById('inputMean').value;  

        var vals = [mfName, pSigma, pMean, pHeight];   
    } else if ( opt == "gaussbMF" ){
        var pLSigma = document.getElementById('inputLSigma').value;  
        var pLMean = document.getElementById('inputLMean').value;  
        var pRSigma = document.getElementById('inputRSigma').value;  
        var pRMean = document.getElementById('inputRMean').value;  

        var vals = [mfName, pLSigma, pLMean, pRSigma, pRMean, pHeight];
    } else if ( opt == "triMF" ){
        var pLeft = document.getElementById('inputLeft').value;  
        var pMean = document.getElementById('inputMean').value;  
        var pRight = document.getElementById('inputRight').value;  

        var vals = [mfName, pLeft, pMean, pRight, pHeight];
    } else if ( opt == "trapMF" ){
        var pLFoot = document.getElementById('inputLFoot').value;  
        var pLShould = document.getElementById('inputLShoulder').value;  
        var pRShould = document.getElementById('inputRShoulder').value;  
        var pRFoot = document.getElementById('inputRFoot').value;  

        var vals = [mfName, pLFoot, pLShould, pRShould, pRFoot, pHeight];
    } 

    // Check for errors in the entered parameters
    var errCode = errorsInFunction(vals);
    if ( errCode === 1 ){
      alert ( "You have not entered a function name." );
      return;
    } else if ( errCode === 2 ) {
      alert ( "Some parameters were not numbers, or were blank" );
      return;
    } 

    // Create the membership function
    var mf;
    if ( opt == "gaussMF" ){
         var mf = new gauMemFun (mfName, pSigma, pMean, pHeight);
    } else if ( opt == "gaussbMF" ){
          var mf = new gau2MemFun (mfName, pLSigma, pLMean, pRSigma, pRMean, pHeight);
    } else if ( opt == "triMF" ){
          var mf = new triMemFun (mfName, pLeft, pMean, pRight, pHeight);
    } else if ( opt == "trapMF" ){
          var mf = new trapMemFun (mfName, pLFoot, pLShould, pRShould, pRFoot, pHeight);
    } 

    // Add to correct place, and refresh display
    if ( isInput ){
      inputDivs[divId].memFuncs.push(mf);
      inputDivs[divId].refreshMembershipFunctions();       
    } else {
      outputDivs[divId].memFuncs.push(mf);
      outputDivs[divId].refreshMembershipFunctions();
    }

    // Hide modal
    $('#myModal').modal('hide');
    if ( isInput ){
      drawVarCharts(inputDivs[divId].chartDiv, divId, inputDivs[divId].memFuncs, isInput)
    } else {
      drawVarCharts(outputDivs[divId].chartDiv, divId, outputDivs[divId].memFuncs, isInput)
    }
}

/**
  Deletes a membership function

  @param {int}, index of the membership function
  @param {string}, the id of the div to delete from
  @param {boolean}, whether this is an input or not
*/
function deleteMembershipFunction ( i, divId, isInput ) {
  var r = confirm("This will permanently delete this membership function (and any rules you have), are you sure you wish to continue?")
    if ( r ) {    
      if ( isInput ) {
        (inputDivs[divId].memFuncs).splice(i, 1);
        inputDivs[divId].resetContent();
        inputDivs[divId].getBigContent();
      } else {
        (outputDivs[divId].memFuncs).splice(i, 1);
        outputDivs[divId].resetContent();
        outputDivs[divId].getBigContent();
      }
      systemRules.length = 0;
      printRules();
    }
  if ( isInput ){
    drawVarCharts(inputDivs[divId].chartDiv, divId, inputDivs[divId].memFuncs, isInput)
  } else {
    drawVarCharts(outputDivs[divId].chartDiv, divId, outputDivs[divId].memFuncs, isInput)
  }
}

/**
  Converts the abbreviation type name to a full type name

  @param {string}, the type to be converted
  @return {string}, the convert type
*/
function convertType (type){
  if ( type === "gau" ){
    return "Gaussian";
  } else if (type === "ga2"){
    return "2-Part Gaussian";
  } else if ( type === "tri" ){
    return "Triangular";
  } else if ( type === "trp" ){
    return "Trapezoidal";
  }
}

/**
  Finds the index of a membership function in a variable

  @param {string}, the id of the div to look in
  @param {string}, the name of the membership function to look for
  @param {boolean}, whether this is an input or not
  @return {int|string}, either returns the index, or the string "null"
*/
function getFuncNum ( divId, funcName, isInput ) {
  var i = 0;
  if ( isInput ) {
    for ( var key in inputDivs[divId].memFuncs ) {
      if ( inputDivs[divId].memFuncs[key].funName === funcName ) {
        return i;
      }
      i++;
    }  
  } else {
    for ( var key in outputDivs[divId].memFuncs ) {
      if ( outputDivs[divId].memFuncs[key].funName === funcName ) {
        return i;
      }
      i++;
    }
  }
  return "null";
}

/**
  Edits a membership function

  @param {int}, the index of the membership function
  @param {string}, the id of the div to edit from
  @param {boolean}, whether this is an input or not
*/
function editMembershipFunction ( i, divId, isInput ){

  var x = document.getElementById("chart_div");
  clearNode(x);

  edit = true;
  globali = i;

  var type;
  if ( isInput ) {
    type = inputDivs[divId].memFuncs[i].funType;
  } else {
    type = outputDivs[divId].memFuncs[i].funType;
  }
  
  var s = document.getElementById ( 'mfTypeSelect' );
  if ( type === "gau" ){
    s.selectedIndex = 0;
  } else if (type === "ga2"){
    s.selectedIndex = 1;
  } else if ( type === "tri" ){
    s.selectedIndex = 2;
  } else if ( type === "trp" ){
    s.selectedIndex = 3;
  }

  updateModal();
  var mf;
  if ( isInput ) {
    mf = inputDivs[divId].memFuncs[i];
  } else {
    mf = outputDivs[divId].memFuncs[i];
  }

  // Fill values, dependent on function type
  if ( type === "gau" ){
    document.getElementById("inputSigma").value = mf.paramSigma;
    document.getElementById("inputMean").value = mf.paramMean;
  } else if (type === "ga2"){
    document.getElementById("inputLSigma").value = mf.paramLeftSigma;
    document.getElementById("inputLMean").value = mf.paramLeftMean;
    document.getElementById("inputRSigma").value = mf.paramRightSigma;
    document.getElementById("inputRMean").value = mf.paramRightMean;
  } else if ( type === "tri" ){
    document.getElementById("inputLeft").value = mf.paramLeft;
    document.getElementById("inputMean").value = mf.paramMean;
    document.getElementById("inputRight").value = mf.paramRight;
  } else if ( type === "trp" ){
    document.getElementById("inputLFoot").value = mf.paramLeftFoot;
    document.getElementById("inputLShoulder").value = mf.paramLeftShoulder;
    document.getElementById("inputRFoot").value = mf.paramRightFoot;
    document.getElementById("inputRShoulder").value = mf.paramRightShoulder;
  }

  document.getElementById("inputFunName").value = mf.funName;
  document.getElementById("inputHeight").value = mf.paramHeight;

  g_originalName = mf.funName;

  drawChart();
  drawChart();
}