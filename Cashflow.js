function CashFlow()
{
	//read json string from config.html, then parse it
	const jsonString = HtmlService.createHtmlOutputFromFile("config.html").getContent();
	const config = JSON.parse(jsonString);
	//setup variables
	let spreadsheet = SpreadsheetApp.openById(config.ID);
	let pages = spreadsheet.getSheets();
	let totals = []; //nested array in format[[datestamp,inflows,outflows,NCF]]

	//iterate over pages and add totals to the array
	sheetloop: for (const page of pages)
	{
		//Logger.log(pages[x].getName());
		//get ranges and values per column, set at fixed length of 100.
		let totalsRange = page.getRange(interpolate("%s2:%s2", [config.TotalOutflowColumn, config.TotalInflowColumn])); 
		let totalsValues = totalsRange.getValues();
		
		Logger.log(interpolate("%s: Outflows %s, Inflows %s",[page.getName(), totalsValues[0][0], totalsValues[0][1]]));
		//Logger.log(totalsValues);
		
		//filter to ensure only the monthly pages are added -- TEMP
		if ((page.getName() != "Template") && (page.getName() != "Summary") && (totalsValues[0][0] != null) && (totalsValues[0][1] != null))
		{
			totals.push([
				page.getName(),
				totalsValues[0][1],
				totalsValues[0][0],
				totalsValues[0][0]+totalsValues[0][1]
			]);
		}
	}
	Logger.log(totals);

	//output array into summary sheet
	let summary = spreadsheet.getSheetByName("Summary");
	let tableRange = summary.getRange("A3:D"+(totals.length+2));
	tableRange.setValues(totals);

	//clear old chart(s)
	for (const chart of summary.getCharts())
	{
		summary.removeChart(chart);
	}

	//create chart from summary sheet
	let cfdRange=summary.getRange("A3:C"+(totals.length+2));
	let cashFlowDiagram = summary.newChart().setChartType(Charts.ChartType.COLUMN).addRange(cfdRange).setPosition(1,7,0,0).build();

	cashFlowDiagram=cashFlowDiagram.modify().asColumnChart()
	.setOption('title', 'Cash Flow Diagram') // Set the chart title
	.setOption('series', { 0: { dataLabel: 'value' }, 1:{ dataLabel: 'value' }  }) // Show data labels
	.setOption('legend', 'none') // Remove the legend
	.build();
	summary.insertChart(cashFlowDiagram);
}