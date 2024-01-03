# BudgieSheet

A personal project to summarize my monthly cashflows in a google sheet using Google App Script.

---

#### Current functionality includes:
  
  - Creating monthly net subtotals by category of transaction

  - Collecting each months inflows and outflows as well as net cash flow on the summary page

  - Creating a cashflow diagram on the summary page based off each months total inflows and outflows

#### Planned features:

  - Automatation of csv statement ingestion (in the format supplied by my bank) and formatting the information to the schema of the spreadhseet.

---
### Demonstration
An example spreadsheet is uploaded [here](https://docs.google.com/spreadsheets/d/1r-nB_bqIiaQMe1N-OPAejxGia9spVaSPTzE9OBjyU3Q/edit?usp=sharing) as well as a copy included in the repository. To test the functionality view the uploaded example spreadsheet and execute the functions from the app script editor [here](https://script.google.com/d/1OFy4kz_khHANCXMJec1TmEPSdKxSZ_wyIPQ3yzMbM_78g_l1zjm-JzHy/edit?usp=sharing).

### Instructions
To use this app for your own spreadsheet first you must replace the spreadsheet ID from the example sheet to your own. Extract the ID from the URL of your spreadsheet then edit the config file `config.html` in the json format. The example config looks like this:

```
{
  "ID" : "1r-nB_bqIiaQMe1N-OPAejxGia9spVaSPTzE9OBjyU3Q"
}
```

Ensure your data is entered according to the template page in the spreadsheet as all operations are done based on absolute column locations.



#### Sub Totals
To generate net subtotals for each month simply run `SubTotal()` in `SubTotal.gs`. Each unique category found in column D will be listed in column F with the net total of all transactions in that category in the cell below. 
Once complete the output will look like the following:
![Image](https://github.com/ForsythsGambit/BudgieSheet/assets/56049633/d415139c-4d54-4da0-9958-2a7e6b4c2b8c)

#### Cash Flow Summary
To generate the summary page of the spreadhseet execute `CashFlow()` in `CashFlow.gs`. Each page aside from the Template and Summary pages are assumed to be a monthly cash flow (Specifying exceptions in the config file is planned). The total Inflow and Outflow from each month's corresponding page will be copied to the Summary page and then a cash flow diagram will be generated from these values.
Once completed the output will resemble the following (although only one month is presently included in the example sheet):
![Image](https://github.com/ForsythsGambit/BudgieSheet/assets/56049633/3009a99b-feda-4542-a516-27b0cf7d5ac9)
