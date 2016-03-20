library(shiny)

source(file = 'FuzzyToolkitUoN.R', chdir='T')

shinyServer(function(input, output) {

  # Download the file to the user's hard drive;
  # In json, MATLAB fis, or FuzzyToolkitUoN fis
  output$downloadData <- downloadHandler(
    filename = function() { 
      paste(input$fisName, input$iotypestore, sep='') 
    },
    content = function(file) {
      cat(input$exportOutput)
      cat(gsub("<spbrk>","\n",input$exportOutput))
      write({gsub("  "," ",gsub("<spbrk>","\n",input$exportOutput))}, file)
    }
  )

  output$plotGenSurf <- renderPlot({    
    fis <- readFISFromString(gsub("<spbrk>","\n",input$exportOutput))
    if ( is.null(fis)) {
      cat("is null")
    } else {
      if ( length(fis$inputList) == 2 && length(fis$outputList) == 1 ) {
        gensurf(fis)
      }
    }
  })

  # Read the FIS object from the system, create it in R, and evaluate
  output$evalFisOutput <- renderPrint ({
    if ( input$passBackEval2 >= 1 ) {
      if ( length(strsplit(input$passBackEval," ")[[1]]) == input$passBackEval3 )  {
      
          vals = strsplit(input$passBackEval, " ")
          cvals = c()
          for ( i in 1:length(vals) ) {
            cvals = c(cvals, as.numeric(vals[[1]]))
          }

          fis <- readFISFromString(gsub("<spbrk>","\n",input$exportOutput))
          dummy <- capture.output(x <- evalFIS(matrix(cvals, 1, length(cvals)), fis))
          

          for ( i in 1:ncol(x) ) {
            cat(fis$outputList[[i]]$outputName, x[i])
          }
      } else {
        cat("You have not provided a value for all of your inputs, so no evaluation can be done!")
      }
    } else {
        cat("You have not provided any output variables")  
      
    }
  })


})


  readFISFromString <- function ( fis ) {
    txt= strsplit(fis  , "\n")
    inputCount = eval(parse(text=txt[[1]][5]))
    outputCount= eval(parse(text=txt[[1]][6]))
    ruleCount= eval(parse(text=txt[[1]][7]))

    if ( inputCount == 0 ) {
      cat("Not enough input variables for evaluation")
    } else if ( outputCount == 0 ) { 
      cat("Not enough output variables for evaluation")
    } else if ( ruleCount == 0 ) { 
      cat("Not enough rules for evaluation")
    } else {
      # Creates placeholder FIS for the coming values.
      FIS <- newFIS("temp")
      # Overwrite the values in the placeholder FIS with the values from the file.
      FIS$name= gsub("Name='|'","",txt[[1]][2])
      FIS$type= gsub("Type='|'","",txt[[1]][3])
      FIS$version= eval(parse(text=txt[[1]][4]))
      FIS$andMethod= gsub("AndMethod='|'","",txt[[1]][8])
      FIS$orMethod= gsub("OrMethod='|'","",txt[[1]][9])
      FIS$impMethod= gsub("ImpMethod='|'","",txt[[1]][10])
      FIS$aggMethod= gsub("AggMethod='|'","",txt[[1]][11])
      FIS$defuzzMethod= gsub("DefuzzMethod='|'","",txt[[1]][12])
      
      # The following line counts how many input variables exist from the file by pattern matching.
      inputLines=grep("\\[Input\\d\\]", txt[[1]])

      # Checks to see if any inputs exist, if not, ignore code block.
      if(length(inputLines > 0)) {
        
          # The following loop obtains each variable's name and range.
          for(i in 1:length(inputLines)) {
    
              txtc = inputLines[[i]]
              
              mfCount = eval(parse(text=txt[[1]][txtc+3]))
              txtc= txtc+1
              
              nameHolder = gsub("Name='|'", "", txt[[1]][txtc])
              txtc= txtc+1
              minmax <- unlist(strsplit(gsub("Range=\\[(.*?)\\]", "\\1", txt[[1]][txtc]), " "))
              minHolder <- minmax[1]
              maxHolder <- minmax[2]
              txtc=txtc+1
              # Adds the variable name and range to the FIS structure currently stored in memory.
              FIS= addVar(FIS, "input", nameHolder, c(minHolder:maxHolder))
    
              # The following block reads all the data from each of the variable's membership function from the file,
              # and stores the data in relevant variables for a later addition to the FIS structure in memory which
              # occurs on every iteration.
              if( mfCount > 0 ) {
                txtc=txtc+1
                mfHolder = list(mfName="", mfType="", mfParams=c())
                for ( j in 1:mfCount ) {
                  
                  mfName = gsub("MF\\d+='|':'[a-zA-Z]+',\\[((-)?\\d+(\\.)?\\d*(\\s)?)+\\]","",txt[[1]][txtc])
                  mfType = gsub("MF\\d+='(\\S| )+':'|',\\[((-)?\\d+\\.?\\d*(\\s)*)*\\]","",txt[[1]][txtc])
                  params = strsplit(gsub("  ", " ", gsub("MF\\d+='(\\S| )+':'[a-zA-Z]+|',\\[|\\]|","",txt[[1]][txtc])), " ")
                  paramsV = c()
                  for ( fg in 1:length(params[[1]]) ){
                    paramsV = c(paramsV, as.numeric(params[[1]][fg]))
                  }

                  mf = NULL
                  if ( mfType == "gaussmf" ) {
                    mf = gaussMF(mfName, c(minHolder:maxHolder), paramsV)
                  } else if ( mfType == "gaussbmf" ) {
                    mf = gaussbMF(mfName, c(minHolder:maxHolder), paramsV)
                  } else if ( mfType == "trapmf" ) {
                    mf = trapMF(mfName, c(minHolder:maxHolder), paramsV)
                  } else if ( mfType == "trimf" ) {
                    mf = triMF(mfName, c(minHolder:maxHolder), paramsV)
                  }

                  
                  FIS = addMF(FIS, "input", i, mf)
                  txtc=txtc+1
                }
              }
          }
      }

      # The following line counts how many input variables exist from the file by pattern matching.
      outputLines=grep("\\[Output\\d\\]", txt[[1]])

      # Checks to see if any inputs exist, if not, ignore code block.
      if(length(outputLines > 0)) {
          # The following loop obtains each variable's name and range.
          for(i in 1:length(outputLines)) {

              txtc = outputLines[[i]]
              
              mfCount = eval(parse(text=txt[[1]][txtc+3]))
              txtc= txtc+1
              
              nameHolder = gsub("Name='|'", "", txt[[1]][txtc])
              txtc= txtc+1
              minmax <- unlist(strsplit(gsub("Range=\\[(.*?)\\]", "\\1", txt[[1]][txtc]), " "))
              minHolder <- minmax[1]
              maxHolder <- minmax[2]

              # Adds the variable name and range to the FIS structure currently stored in memory.
              FIS= addVar(FIS, "output", nameHolder, c(minHolder:maxHolder))
              
              # The following block reads all the data from each of the variable's membership function from the file,
              # and stores the data in relevant variables for a later addition to the FIS structure in memory which
              # occurs on every iteration.
              if( mfCount > 0 ) {
                txtc=txtc+2
                mfHolder = list(mfName="", mfType="", mfParams=c())
                for ( j in 1:mfCount ) {
                  mfName = gsub("MF\\d+='|':'[a-zA-Z]+',\\[((-)?\\d+(\\.)?\\d*(\\s)?)+\\]","",txt[[1]][txtc])
                  mfType = gsub("MF\\d+='(\\S| )+':'|',\\[((-)?\\d+\\.?\\d*(\\s)*)*\\]","",txt[[1]][txtc])
                  params = strsplit(gsub("  ", " ", gsub("MF\\d+='(\\S| )+':'[a-zA-Z]+|',\\[|\\]|","",txt[[1]][txtc])), " ")
                  paramsV = c()
                  for ( fg in 1:length(params[[1]]) ){
                    paramsV = c(paramsV, as.numeric(params[[1]][fg]))
                  }

                  mf = NULL
                  if ( mfType == "gaussmf" ) {
                    mf = gaussMF(mfName, c(minHolder:maxHolder), paramsV)
                  } else if ( mfType == "gaussbmf" ) {
                    mf = gaussbMF(mfName, c(minHolder:maxHolder), paramsV)
                  } else if ( mfType == "trapmf" ) {
                    mf = trapMF(mfName, c(minHolder:maxHolder), paramsV)
                  } else if ( mfType == "trimf" ) {
                    mf = triMF(mfName, c(minHolder:maxHolder), paramsV)
                  }

                  FIS = addMF(FIS, "output", i, mf)
                  txtc=txtc+1
                }
              }
          }
      }

      txtc= grep("\\[Rules\\]", txt[[1]])
      txtc= txtc+1
      if(ruleCount > 0) {
        for(i in 1:ruleCount) {
          
          inputVals = strsplit(gsub(",.*$", "", txt[[1]][txtc]), " ") 
          outputVals = strsplit(gsub(".$","",gsub("\\(.*$","",gsub("^.*,.","",txt[[1]][txtc]))), " ") 
          weight = as.numeric(gsub(" ","",gsub(".*\\(", "", gsub("\\).*$","", txt[[1]][txtc]))))
          connective = as.numeric(gsub(" ","", gsub("^.*:", "", txt[[1]][txtc]))) 

          ruleList = c()
          for ( fg in 1:length(inputVals[[1]])){
            ruleList = c(ruleList, as.numeric(inputVals[[1]][fg]))
          }

          for ( fg in 1:length(outputVals[[1]])){
            ruleList = c(ruleList, as.numeric(outputVals[[1]][fg]))
          }
          ruleList = c (ruleList, weight)        
          ruleList = c (ruleList, connective)
          FIS = addRule(FIS, ruleList)
          txtc= txtc + 1
        }

      }
      
      # Return the FIS object to be evaluated!
      FIS
  }
}