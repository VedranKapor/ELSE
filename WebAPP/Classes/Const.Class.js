export const CURRENCY = ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTN","BWP","BYR","BZD","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CUP","CVE","CYP","CZK","DJF","DKK","DOP","DZD","EEK","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LTL","LVL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MTL","MUR","MVR","MWK","MXN","MXV","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SKK","SLL","SOS","SRD","STD","SYP","SZL","THB","TJS","TMM","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","USN","USS","UYU","UZS","VEB","VND","VUV","WST","XAF","XAG","XAU","XBA","XBB","XBC","XBD","XCD","XDR","XFO","XFU","XOF","XPD","XPF","XPT","XTS","XXX","YER","ZAR","ZMK","ZWD",];
export const UNITS = ["PJ","ktoe","Mtoe","GWh"];
export const SECTOR = ["Industry","Transport","Residential","Commercial","Agriculture","Fishing", "Non Energy Use", "Other"];
export const COMMODITY = ["Coal","Oil","Gas","Biofuels","Waste", "Peat", "Oil Shale", "Electricity", "Heat"];
export const FUELS1 = [
                        {"id":"Lignite", "name":"Lignite", group: "Fuel group - Coal"},
                        {"id":"BrownCoal", "name":"Brown Coal", group: "Coal"},
                        {"id":"Oil","name":"Oil", group: "Oil"}, 
                        {"id":"Gas","name":"Gas", group: "Gas"}, 
                        {"id":"Biofuels","name":"Biofuels", group: "Biofules"}, 
                        {"id":"Waste","name":"Waste", group: "Waste"}, 
                        {"id":"Peat","name":"Peat", group: "Coal"}, 
                        {"id":"OilShale","name":"Oil Shale", group: "Coal"}, 
                        {"id":"Nuclear","name":"Nuclear", group: "Coal"}, 
                        {"id":"Geothermal","name":"Geothermal", group: "Coal"},
                        {"id":"Solar","name":"Solar", group: "Coal"}, 
                        {"id":"Wind","name":"Wind", group: "Coal"}, 
                        {"id":"Hydro","name":"Hydro", group: "Coal"}];

                        export const FUELS = [
                            {id:"Lignite", name:"Lignite", group: "Fuel group - Coal"},
                            {id:"BrownCoal", name:"Brown Coal", group: "Fuel group - Coal"},
                            {id:"Oil",name:"Oil", group: "Fuel group - Oil"}, 
                            {id:"Gas",name:"Gas", group: "Fuel group - Gas"}, 
                            {id:"Biofuels",name:"Biofuels", group: "Fuel group - Biofules"}, 
                            {id:"Waste",name:"Waste", group: "Fuel group - Waste"}, 
                            {id:"Peat",name:"Peat", group: "Fuel group - Coal"}, 
                            {id:"OilShale",name:"Oil Shale", group: "Fuel group - Coal"}, 
                            {id:"Nuclear",name:"Nuclear", group: "Fuel group - Coal"}, 
                            {id:"Geothermal",name:"Geothermal", group: "Fuel group - Coal"},
                            {id:"Solar",name:"Solar", group: "Fuel group - Coal"}, 
                            {id:"Wind",name:"Wind", group: "Fuel group - Coal"}, 
                            {id:"Hydro",name:"Hydro", group: "Fuel group - Coal"}];

export const CHART_TYPE = {
    barChart: "column",
    lineChart: 'spline',
    areaChart: 'stackedarea',
    stackedChart: 'stackedcolumn'
}

export const SIMTYPE = {
    'false': {
        dataField: 'Hour',
        labelUnit: "h",
        minValue: 2190,
        maxValue: 2920,
        gridLinesInterval: 168, 
        unitInterval: 730,
    },
    day: {
        dataField: 'Day',
        labelUnit: "d",
        minValue: 90,
        maxValue: 120,
        gridLinesInterval: 7, 
        unitInterval: 30,
    },
    month: {
        dataField: 'Month',
        labelUnit: "m",
        minValue: 3,
        maxValue: 4,
        gridLinesInterval: 1, 
        unitInterval: 1,
    },
    'true': {
        dataField: 'Hour',
        labelUnit: "h",
        minValue: 3,
        maxValue: 4,
        gridLinesInterval: 1, 
        unitInterval: 1,
    }
}
