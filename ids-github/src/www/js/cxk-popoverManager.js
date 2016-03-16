/**  cxk-rule-ui.js
  Deals with all popovers
  Author: Craig Knott

  Functions:
    clearPopovers( );
    $("#inputVarHelpBtn").popover(); 
    $("#inputVarHelpBtn").click();
    $("#outputVarHelpBtn").popover();
    $("#outputVarHelpBtn").click();
    $("#ruleHelpBtn").popover();
    $("#ruleHelpBtn").click();
    $("#mfcHelpBtn").popover();
    $("#mfcHelpBtn").click();
    $("#rulecHelpBtn").popover();
    $("#rulecHelpBtn").click();
    $("#importHelpBtn").popover();
    $("#importHelpBtn").click();
    $("#evalHelpBtn").popover();
    $("#evalHelpBtn").click();
    $("#input-tab").click();
    $("#output-tab").click();
    $("#rule-tab").click();
    $("#import-tab").click();
    $("#export-tab").click();
    $("#eval-tab").click();
*/

/**
  Function to clear any left over popovers
*/
function clearPopovers() {
    $("#inputVarHelpBtn").popover('hide');
    $("#outputVarHelpBtn").popover('hide');
    $("#mfcHelpBtn").popover('hide');
    $("#ruleHelpBtn").popover('hide');
    $("#rulecHelpBtn").popover('hide');
    $("#importHelpBtn").popover('hide');
    $("#exportHelpBtn").popover('hide');
    $("#paramHelpBtn").popover('hide');
    $("#evalHelpBtn").popover('hide');

    $("#inputVarHelpBtn").html("Show Help");
    $("#outputVarHelpBtn").html("Show Help");
    $("#mfcHelpBtn").html("Show Help");
    $("#ruleHelpBtn").html("Show Help");
    $("#rulecHelpBtn").html("Show Help");
    $("#importHelpBtn").html("Show Help");
    $("#exportHelpBtn").html("Show Help");    
    $("#paramHelpBtn").html("Help");        
    $("#evalHelpBtn").html("Show Help"); 
}

$(document).ready(function() {
    /** 
      Input variable help button information
    */
    $("#inputVarHelpBtn").popover(
      {
        placement:'bottomRight',
        container: 'body',
        title: '<b> Input Variable Creator </b>',
        content: "An input variable is a collection of membership functions that specify an input to the system. For instance, if we wanted to construct a system to predict how good we would be at basketball, we could have inputs such as height and athleticism.<br><br> To create your own input variable, simply click on the \'Add New Variable\' button. This will create a placeholder new variable for you. The name of the variable is a symbolic, and unique, reference name for it, and the range of a variable is the range between which the values can fall.<br><br> To then edit your variable, you can click on the \'Edit\' button, which will take you to the expanded view of the variable. From here you can modify all the values of the variable (including any functions that have been added). To actually add your membership functions, click on the \'Add Function\' button, which will bring up the membership function creation window."
      });
    $("#inputVarHelpBtn").click(function(){
        if ( $("#inputVarHelpBtn").text() === "Show Help") {
          $("#inputVarHelpBtn").html("Hide Help");
        } else {
          $("#inputVarHelpBtn").html("Show Help");
        }
    });

    /** 
      Output variable help button information   
    */
    $("#outputVarHelpBtn").popover(
      {
        placement:'bottomRight',
        container: 'body',
        title: '<b> Output Variable Creator </b>',
        content: "An output variable is a collection of membership functions that specify an output to the system. For instance, if we had a system that had age and athleticism as our inputs, a potential output of this system could be how good we would be at basketball.<br><br> To create your own output variable, simply click on the \'Add New Variable\' button. This will create a placeholder new variable for you. The name of the variable is a symbolic, and unique, reference name for it, and the range of a variable is the range between which the values can fall.<br><br> To then edit your variable, you can click on the \'Edit\' button, which will take you to the expanded view of the variable. From here you can modify all the values of the variable (including any functions that have been added). To actually add your membership functions, click on the \'Add Function\' button, which will bring up the membership function creation window"
      });

    $("#outputVarHelpBtn").click(function(){
        if ( $("#outputVarHelpBtn").text() === "Show Help") {
          $("#outputVarHelpBtn").html("Hide Help");
        } else {
          $("#outputVarHelpBtn").html("Show Help");
        }
    });

    /**
      Rule creator help button information 
    */
    $("#ruleHelpBtn").popover({
      placement:'bottomRight',
      container: 'body',
      title: '<b> Rule Creator </b>',
      content: 'In this section of the system, you can specify what logical rules you wish to apply to the system, during the evaluation process.<br><br> To add a rule, press the \'Add New Rule\' button. This will bring up the Rule Creator Menu, which will explain more about rules in a fuzzy system. Once a rule has been created, you can use the \'Edit\' and \'Delete\' buttons to edit and delete the rule, respectively.<br><br>Also, if your system has 2 inputs, and 1 output, your rules will be displayed in an intuitive table format'
    });

    $("#ruleHelpBtn").click(function(){
      if ( $('#ruleHelpBtn').text() === "Show Help"){
          $('#ruleHelpBtn').html("Hide Help");
      } else {
          $('#ruleHelpBtn').html("Show Help");
      }
    });

    /**
      Membership function creator help button information 
    */
    $("#mfcHelpBtn").popover({
      placement:'bottomRight',
      title: '<b> Membership Function Creator </b>',
      content: 'Membership functions make up fuzzy sets (or fuzzy variables, as we know them here), and represent the degrees of truth that given values have for the property they represent. For instance, if we had an \'Age\' variable, we could have membership functions such as: Old, Young, and Middle-Aged.<br><br> In o-Fuzz!, there are currently four different membership functions to choose from, each providing a distinct shape: <a href=\"http://www.mathworks.co.uk/help/fuzzy/gaussmf.html\" target=\"_newtab\">Gaussian</a>, <a href=\"http://www.mathworks.co.uk/help/fuzzy/gauss2mf.html\" target=\"_newtab\">2-Part Gaussian</a>, <a href=\"http://www.mathworks.co.uk/help/fuzzy/trimf.html\" target="_newtab">Triangular</a>, and <a href=\"http://www.mathworks.co.uk/help/fuzzy/trapmf.html\" target="_newtab">Trapezoidal</a>. This will be expanded upon when our back end, <a href=\"http://cran.r-project.org/web/packages/FuzzyToolkitUoN/index.html\" target="_newtab">FuzzyToolkitUoN</a> is updated.<br><br>Creating a membership function is as easy as specifying the type and parameters that you wish the function to have. You\'ll notice that a graphical representation of your function will be drawn as you specify it, so you can observe any errors.<br><br>Be aware that all membership functions within a variable need to have a unique name, this name cannot be blank, and all parameters must be numbers'
    });

    $("#mfcHelpBtn").click(function(){
      if ( $('#mfcHelpBtn').text() === "Show Help"){
          $('#mfcHelpBtn').html("Hide Help");
      } else {
          $('#mfcHelpBtn').html("Show Help");
      }
    });

    /**
      Rule creator help button information
    */
    $("#rulecHelpBtn").popover(
      {
        placement:'bottomRight',
        title: '<b> Rule Creator </b>',
        content: "Specifying rules is as simple as selecting the correct linguistic term for each variable in your system. We use rules to dictate how the system will be evaluated later on. For example, you could specify a rule that says:<br><br> If \"height\" is \"tall\" and \"athleticism\" is \"good\" then \"sport to play\" is \"basketball\". <br><br>This will then tell the fuzzy inference system how to evaluate an instance where these statements are true. It is generally a good idea to specify a rule for each combination of input terms for your system, to ensure you cover all possible permutations. <br><br>You may also specify the connective to use (either AND or OR), and the weight of the rule (which affects how much impact the rule has on the system as a whole). You can select the weight using the provided slider, or by entering a value directly into the provided text box; just remember that this value has to be between 0 (no effect), and 1 (full effect)."
      });

    $("#rulecHelpBtn").click(function(){
        if ( $("#rulecHelpBtn").text() === "Show Help") {
          $("#rulecHelpBtn").html("Hide Help");
        } else {
          $("#rulecHelpBtn").html("Show Help");
        }
    });

    /**
      Import tab help button information
    */
    $("#importHelpBtn").popover(
      {
        placement:'bottomRight',
        title: '<b> File Import </b>',
        content: "In this panel, you can import a Fuzzy Inference System, in a variety of formats, into the system. You will then be able to work with this Fuzzy System, and even export it again later (again, in a variety of formats). <br><br> The currently supported formats are:<ul><li>MATLAB .fis</li><li>FuzzyToolkitUoN .fis</li><li>o-Fuzz .json</li></ul>"
      });

    $("#importHelpBtn").click(function(){
        if ( $("#importHelpBtn").text() === "Show Help") {
          $("#importHelpBtn").html("Hide Help");
        } else {
          $("#importHelpBtn").html("Show Help");
        }
    });

    /**
      Export tab help button information
    */
    $("#exportHelpBtn").popover(
      {
        placement:'bottomRight',
        container: 'body',
        title: '<b> File Export </b>',
        content: "In this panel, you can export the Fuzzy System you have created, to a variety of file types. This allows you to save your system and work on it later, and it also allows you to open the file in a different software environment.<br><br> Currently, you can export you file into the following formats:<ul><li>MATLAB .fis</li><li>FuzzyToolkitUoN .fis</li><li>o-Fuzz .json</li></ul>"
      });

    $("#exportHelpBtn").click(function(){
        if ( $("#exportHelpBtn").text() === "Show Help") {
          $("#exportHelpBtn").html("Hide Help");
        } else {
          $("#exportHelpBtn").html("Show Help");
        }
    });

    /**
      System Parameters tab help button information
    */
    $("#paramHelpBtn").popover(
      {
        placement:'bottomLeft',
        container: 'body',
        title: '<b> System Wide Parameters </b>',
        content: "These are parameters that will affect the way the system will be evaluated. As our back end (<a href=\"http://cran.r-project.org/web/packages/FuzzyToolkitUoN/index.html\" target=\"_newtab\">FuzzyToolkitUoN</a>) is expanded, more options for this will become available. <ul><li> <b>Name:</b> The system name </li><li> <b>Type:</b> The inference method to use </li><li> <b>And:</b> How to process rules with AND in them </li><li> <b>Or:</b> How to process rules with OR in them </li><li> <b>Aggregation:</b> How to combine the outputs of the evaluation </li><li> <b>Implication:</b> How to map the inputs to the outputs </li><li> <b>Defuzzification:</b> How to convert your output set to a crisp value </li></ul>"
      });

    $("#paramHelpBtn").click(function(){
        if ( $("#paramHelpBtn").text() === "Help") {
          $("#paramHelpBtn").html("Hide");
        } else {
          $("#paramHelpBtn").html("Help");
        }
    });    

    $("#evalHelpBtn").popover(
    {
        placement:'bottomRight',
        title: '<b> System Evaluation </b>',
        content: "Evaluation of a fuzzy system is the process of taking the rules of the system, and applying the supplied input values to those rules. The goal of this is to evaluate each rule, combine the results of this rule, and then produce a single value for you to use. The actual process of inferencing is not important to the end user, but those looking to find more can check <a href=\"http://www.cs.princeton.edu/courses/archive/fall07/cos436/HIDDEN/Knapp/fuzzy004.htm\" target=\"_newtab\">this</a>. <br><br> There are some facts and figures that are displayed on this page that may not be relevant to novice users, so feel free to ignore these. The most important values are the \"Input\" boxes, and the \"Output\" boxes"
    });

    $("#evalHelpBtn").click(function(){
        if ( $("#evalHelpBtn").text() === "Show Help") {
          $("#evalHelpBtn").html("Hide Help");
        } else {
          $("#evalHelpBtn").html("Show Help");
        }
    });    

    // When any navigation is pressed, clear all help windows
    $("#input-tab").click(clearPopovers);
    $("#output-tab").click(clearPopovers);
    $("#rule-tab").click(clearPopovers);
    $("#import-tab").click(clearPopovers);
    $("#export-tab").click(clearPopovers);
    $("#eval-tab").click(clearPopovers);
});


