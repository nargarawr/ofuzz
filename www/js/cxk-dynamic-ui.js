/**  cxk-dynamic-ui.js
  Deals with additional dynamic user interface elements
  Author: Craig Knott

  Functions:
    showStart ();
    onTabChange( tabIndex );
    clearNode ( nodetoclear );
    Element.prototype.remove = function();
    Node.prototype.appendText = function (string);
    Node.prototype.appendText = function (string, shouldBreak);
    tipperTest( );
*/


/**
  Opens the modal window to begin the system
*/
function showStart ( ) {
  $('#startModal').modal('show');
}

/**
  Ran each time a new tab is selected, takes the tab selected as argument

  @param {int}, the index of the tab changed to
*/
function onTabChange ( tabIndex ) {
  var d = document.getElementById("errorRowRule");
  d.innerHTML = "";

  $("#downloadData").attr("disabled", "disabled");
  $("#downloadData").css("pointer-events", "none");
  $("#downloadData").removeClass("btn-primary");
  $("#downloadData").text("Download")
  $("#mainDivExport").text("")

  if ( getLength(true) >= 1 && getLength(false) >= 1 && systemRules.length >= 1 ){
    
      document.getElementById("evalPageInfo").innerHTML = ""; 
      document.getElementById("evalPageInfo").className = "";
  } else {
      document.getElementById("evalPageInfo").innerHTML = "Before this page is usable, you need to add inputs, outputs, and rules to your system!"; 
      document.getElementById("evalPageInfo").className = "alert alert-info";
  }

  if ( getLength(false) >= 1 ) { 
    document.getElementById("passBackEval2").value = "1";
  } else {
    document.getElementById("passBackEval2").value = "0";
  }
  
  document.getElementById("passBackEval3").value = getLength(true);
  

  if ( tabIndex == 0 ) {
    g_isInput = true;
  } else if ( tabIndex == 1 ) {
    g_isInput = false;
  } else if ( tabIndex == 2) {
    printRules();
  } else if ( tabIndex == 5) {
    generateEvaluatorUI();
  }


}

/**
  Deletes an element by id
*/
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

/**
  Deletes all child nodes of the given node

  @param {Node}, the node to be cleared
*/
function clearNode ( nodetoclear ) {
    if ( nodetoclear.hasChildNodes() ) {
      while ( nodetoclear.childNodes.length >= 1 ) {
        nodetoclear.removeChild( nodetoclear.firstChild );       
      } 
    }
}

/**
  Appends text to a node element

  @param {string}, the string to append
*/
Node.prototype.appendText = function (string) {
  this.appendChild(document.createTextNode(string));
} 

/**
  Appends text to a node element

  @param {string}, the string to append
  @param {boolean}, whether to also append a break or not
  @param {boolean}, whether to append to the file output
*/
Node.prototype.appendText = function (string, shouldBreak ) {
  this.appendChild(document.createTextNode(string));
  if ( shouldBreak ) {
    this.appendChild(document.createElement("br")); 
  }  
} 

/**
  Appends text to a node element

  @param {string}, the string to append
  @param {boolean}, whether to also append a break or not
  @param {boolean}, whether to append to the file output
*/
Node.prototype.appendSpecialBreakText = function (string, shouldBreak, shouldAppendToFile ) {
  this.appendChild(document.createTextNode(string));

  var d = document.getElementById('exportOutput');
  if ( shouldAppendToFile ) {
    d.value += string;
  }

  if ( shouldBreak ) {
    this.appendChild(document.createElement("br"));
    d.value += '<spbrk>';  
  }
} 

/**
    Debug function that constructs the tipper test example
*/
function tipperTest () {
    var mainDiv = document.getElementById("mainDivInput")

    var sysVar = new systemVar("Service", "inputDiv" + inputIndex, true);
    inputIndex++;

    mainDiv.appendChild(sysVar.createDiv());
    inputDivs[sysVar.divId] = sysVar;  
    inputDivs[sysVar.divId].rangeMin = 0;
    inputDivs[sysVar.divId].rangeMax = 10;

    var mf = new gauMemFun ("Poor", 1.5, 0, 1);
    var mf2 = new gauMemFun ("Good", 1.5, 5, 1);
    var mf3 = new gauMemFun ("Excellent", 1.5, 10, 1);
    inputDivs[sysVar.divId].memFuncs.push(mf);
    inputDivs[sysVar.divId].memFuncs.push(mf2);
    inputDivs[sysVar.divId].memFuncs.push(mf3);
    

    var sysVar = new systemVar("Food", "inputDiv" + inputIndex, true);
    inputIndex++;

    mainDiv.appendChild(sysVar.createDiv());
    inputDivs[sysVar.divId] = sysVar;  
    inputDivs[sysVar.divId].rangeMin = 0;
    inputDivs[sysVar.divId].rangeMax = 10;

    var mf = new trapMemFun ("Rancid", 0,0,1,3,1);
    var mf2 = new trapMemFun ("Delicious", 7,9,10,10,1);
    inputDivs[sysVar.divId].memFuncs.push(mf);
    inputDivs[sysVar.divId].memFuncs.push(mf2);

    var mainDiv = document.getElementById("mainDivOutput")

    var sysVar = new systemVar("Tip", "outputDiv" + outputIndex, false);
    outputIndex++;

    mainDiv.appendChild(sysVar.createDiv());
    outputDivs[sysVar.divId] = sysVar; 
    outputDivs[sysVar.divId].rangeMin = 0;
    outputDivs[sysVar.divId].rangeMax = 30;

    var mf = new triMemFun ("Poor", 0,5,10,1);
    var mf2 = new triMemFun ("Average", 10,15,20,1);
    var mf3 = new triMemFun ("Generous", 20,25,30,1);
    outputDivs[sysVar.divId].memFuncs.push(mf);
    outputDivs[sysVar.divId].memFuncs.push(mf2);   
    outputDivs[sysVar.divId].memFuncs.push(mf3);   

    updateSidePanelWithVars();

    // Create 3 rules

    var r1i = new Array;
    r1i.push(new rulePair("inputDiv0","Poor", false))
    r1i.push(new rulePair("inputDiv1","Rancid", false))
    var r1o = new Array;
    r1o.push(new rulePair("outputDiv0","Poor", false))
    var r1 = new systemRule(r1i, r1o, 1,"OR")
    systemRules.push(r1);

    var r2i = new Array;
    r2i.push(new rulePair("inputDiv0","Good", false))
    r2i.push(new rulePair("inputDiv1","(Not Used)", false))
    var r2o = new Array;
    r2o.push(new rulePair("outputDiv0","Average", false))
    var r2 = new systemRule(r2i, r2o, 1,"AND")
    systemRules.push(r2);

    var r3i = new Array;
    r3i.push(new rulePair("inputDiv0","Excellent", false))
    r3i.push(new rulePair("inputDiv1","Delicious", false))
    var r3o = new Array;
    r3o.push(new rulePair("outputDiv0","Generous", false))
    var r3 = new systemRule(r3i, r3o, 1,"OR")
    systemRules.push(r3);

    printRules();
    edittingRule = false;
    edittingId = null;     

    for ( var key in inputDivs ) {
      inputDivs[key].updateSmallView();
    }

    for ( var key in outputDivs ) {
      outputDivs[key].updateSmallView();
    }
}