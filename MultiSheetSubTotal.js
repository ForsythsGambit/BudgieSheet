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
	sheetloop: for (const page of pages)
	{
		Logger.log(interpolate("Parsing page: %s", [page.getName()]));

		//get all categories and store them in categories array
		let categoryRange = page.getRange(interpolate("%s2:%s100", [config.CategoryColumn,config.CategoryColumn])); // TODO dynamic range
		//config.CategoryColumn+"2:"+config.CategoryColumn+"100"
		let categoryValues = categoryRange.getValues();

		columnloop: for (i = 0; i<categoryValues.length; i++)
		{
			if (page.getName() == "Summary")
			{
				continue sheetloop; //skip summary page
			}
			
			let cellValue = categoryValues[i][0];
			//Logger.log("Cell value of D"+i+": "+cellValue);
			if (cellValue == "")
			{
				break columnloop;
			} 
			else if (!categories.includes(cellValue))
			{
				categories.push(cellValue);
			}

			if ((!sheetCategories.includes(cellValue)) || (sheetCategories==[]))
			{
				sheetCategories.push(cellValue);
			} 
		}
		Logger.log("sheet categroies: "+sheetCategories);


		let subtotalRangeText = interpolate("%s1:%s30", [config.SubtotalColumn, config.SubtotalColumn]);
		let categoryRangeText = interpolate("%s:%s", [config.CategoryColumn, config.CategoryColumn]);
		let discretionaryRangeText = interpolate("%s:%s", [config.DiscretionaryColumn, config.DiscretionaryColumn]);
		let AmountRangeText = interpolate("%s:%s", [config.AmountColumn, config.AmountColumn]);
		//clear column F before writing subtotals
		page.getRange(1,6,page.getLastRow(),1).clearContent();
		//print subtotals
		let k=0;
		Logger.log("printing sub totals");
		page.getRange(subtotalRangeText).getCell(1,1).setValue("Sub Totals");
		for (let j=1; j<sheetCategories.length*2; j+=2)
		{
			page.getRange(subtotalRangeText).getCell(j+1,1).setValue(sheetCategories[k]);
			let formula = interpolate("=SUMIFS(%s, %s, \"%s\", %s, \"<>no\")", [AmountRangeText, categoryRangeText, sheetCategories[k], discretionaryRangeText]);
			page.getRange(subtotalRangeText).getCell(j+2,1).setValue(formula);
			k++;
		}
		k=null;
		sheetCategories=[];
	}
	Logger.log("Categories across all pages: " + categories);
}
