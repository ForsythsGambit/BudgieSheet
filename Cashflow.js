function CashFlow() {
  //**Setup**//
  //read json string from config.html, then parse it
  const jsonString = HtmlService.createHtmlOutputFromFile("config.html").getContent();
  const config = JSON.parse(jsonString);

  let spreadsheet = SpreadsheetApp.openById(config.ID);
  let pages = spreadsheet.getSheets();
  let totals = []; //nested array in format[[datestamp,inflows,outflows,NCF]]

  //**iterate over pages and add totals to the array**//
  sheetloop: for (x =0; x<pages.length; x++  ){
    //Logger.log(pages[x].getName());
    //get ranges and values per column, set at fixed length of 100.
    let totalsRange = pages[x].getRange("G1:H2");
    let totalsValues = totalsRange.getValues();
    //filter to ensure only the monthly pages are added -- TEMP
    if ((totalsValues[1][0] != "") && (totalsValues[1][1] != "") && (pages[x].getName() != "Template")){
      totals.push([pages[x].getName(),totalsValues[1][1],totalsValues[1][0],totalsValues[1][0]+totalsValues[1][1]]);
    }
  }
  Logger.log(totals);

  //**output array into summary sheet**//
  let summary = spreadsheet.getSheetByName("Summary");
  let tableRange = summary.getRange("A3:D"+(totals.length+2));
  tableRange.setValues(totals);

  //**clear old chart(s)** //
  let charts = summary.getCharts();
  for (x=0; x<charts.length;x++){
    summary.removeChart(charts[x]);
  }

  //**create chart from summary sheet*/
  let cfdRange=summary.getRange("A3:C"+(totals.length+2));
  let cashFlowDiagram = summary.newChart().setChartType(Charts.ChartType.COLUMN).addRange(cfdRange).setPosition(1,7,0,0).build();

  cashFlowDiagram=cashFlowDiagram.modify().asColumnChart()
    .setOption('title', 'Cash Flow Diagram') // Set the chart title
    .setOption('series', { 0: { dataLabel: 'value' }, 1:{ dataLabel: 'value' }  }) // Show data labels
    .setOption('legend', 'none') // Remove the legend
    .build();
  summary.insertChart(cashFlowDiagram);
}