function myFunction() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Template");
  var gcRange = sheet.getRange("D2:D10");
  var gcValues = gcRange.getValues();
  
  //Get all categories
  var categories =[]
  outerloop: for (var i = 0; i < gcValues.length; i++) {
    for (var j = 0; j < gcValues[i].length; j++) {
      var cellValue = gcValues[i][j];
      if (cellValue == ""){
        //Logger.log("Im out");
        break outerloop;
      }
      if (!categories.includes(cellValue)){
        categories.push(cellValue);
      }
      //Logger.log("Cell (" + (i+1) + "," + (j+1) + "): " + cellValue);
      
    }
  }
  Logger.log(categories);

  var wRange = sheet.getRange("F1:F20"); //+categories.length*2+1
  sheet.getRange("F1").getCell(1,1).setValue("Sub Total");
  
  var i=0;
  for (var j=1; j<categories.length*2; j+=2){
    //Logger.log(categories[j]);
    sheet.getRange("F1:F30").getCell(j+1,1).setValue(categories[i]);
    sheet.getRange("F1:F30").getCell(j+2,1).setValue("=SUMIF(D:D,"+"\""+categories[i]+"\""+",C:C)");
    i++;

  }
  i=null;
}
