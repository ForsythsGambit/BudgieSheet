function msSubTotal() {
  //read json string from config.html, then parse it
  const jsonString = HtmlService.createHtmlOutputFromFile("config.html").getContent();
  const config = JSON.parse(jsonString);
  //open spreadsheet
  let spreadsheet = SpreadsheetApp.openById(config.ID);
  let pages = spreadsheet.getSheets();
  let categories = [];
  let sheetCategories = []

  //loop over spreadsheets
  sheetloop: for (x =0; x<pages.length; x++  ){
    Logger.log("Parsing page: "+pages[x].getName());

    //get all categories and store them in categories array
    let categoryRange = pages[x].getRange("D2:D100"); // TODO dynamic range
    let categoryValues = categoryRange.getValues();
    columnloop: for (i = 0; i<categoryValues.length; i++){
      if (pages[x].getName() == "Summary"){
        //skip summary page
        continue sheetloop;
      }
      
      let cellValue = categoryValues[i][0];
      //Logger.log("Cell value of D"+i+": "+cellValue);
      if (cellValue == ""){
        break columnloop;
      } else if (!categories.includes(cellValue)){
      categories.push(cellValue);
      }
      if ((!sheetCategories.includes(cellValue)) || (sheetCategories==[])){
        sheetCategories.push(cellValue);
      } 
    }
    Logger.log("sheet categroies: "+sheetCategories);

    //clear column F before writing subtotals
    pages[x].getRange(1,6,pages[x].getLastRow(),1).clearContent();
    //print subtotals
    let k=0;
    Logger.log("printing sub totals");
    pages[x].getRange("F1:F30").getCell(1,1).setValue("Sub Totals");
    for (let j=1; j<sheetCategories.length*2; j+=2){
      pages[x].getRange("F1:F30").getCell(j+1,1).setValue(sheetCategories[k]);
      pages[x].getRange("F1:F30").getCell(j+2,1).setValue("=SUMIF(D:D,"+"\""+sheetCategories[k]+"\""+",C:C)");
      k++;
    }
    k=null;
    sheetCategories=[];
  }
  Logger.log("Categories across all pages: " +categories);
}
