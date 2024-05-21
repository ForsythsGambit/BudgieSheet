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
	sheetloop: for (x =0; x<pages.length; x++)
	{
		Logger.log("Parsing page: "+pages[x].getName());

		//get all categories and store them in categories array
		let categoryRange = pages[x].getRange(interpolate("%s2:%s100", [config.CategoryColumn,config.CategoryColumn])); // TODO dynamic range
		//config.CategoryColumn+"2:"+config.CategoryColumn+"100"
		let categoryValues = categoryRange.getValues();

		columnloop: for (i = 0; i<categoryValues.length; i++)
		{
			if (pages[x].getName() == "Summary")
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


		let subtotalRange = interpolate("%s1:%s30", [config.SubtotalColumn, config.SubtotalColumn]);
		//clear column F before writing subtotals
		pages[x].getRange(1,6,pages[x].getLastRow(),1).clearContent();
		//print subtotals
		let k=0;
		Logger.log("printing sub totals");
		pages[x].getRange(subtotalRange).getCell(1,1).setValue("Sub Totals");
		for (let j=1; j<sheetCategories.length*2; j+=2)
		{
			pages[x].getRange(subtotalRange).getCell(j+1,1).setValue(sheetCategories[k]);
			//"=SUMIF(D:D,"+"\""+sheetCategories[k]+"\""+",C:C)"
			let formula = interpolate("=SUMIF(%s:%s,\"%s\",%s:%s)", [config.CategoryColumn, config.CategoryColumn,sheetCategories[k],config.AmountColumn,config.AmountColumn]);
			pages[x].getRange(subtotalRange).getCell(j+2,1).setValue(formula);
			formula = interpolate("=SUMIF(%s:%s,\"%s\", %s:%s", [config.CategoryColumn, config.CategoryColumn, sheetCategories[k], config.AmountColumn, config.AmountColumn]);
			pages[x].getRange(subtotalRange).getCell(j+2,1).setValue(formula);
			//"=SUMIF(D:D,"+"\""+sheetCategories[k]+"\""+",C:C)");
			k++;
		}
		k=null;
		sheetCategories=[];
	}
	Logger.log("Categories across all pages: " +categories);
}
