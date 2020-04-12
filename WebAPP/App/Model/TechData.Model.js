export class Model {
    
    constructor (casename, genData, tData) {
        if(casename){

            let fuels = []
            let totCap = 0;
            let totCapByFuel = {}
            let capByFuel = {}
            let perByFuel = {}
            $.each(genData['else-units'], function (id, obj) {

                $.each(tData, function (idtData, objtData) {
                    if(obj.UnitId == objtData.UnitId){
                        tData[idtData]['Fuel'] = obj.Fuel;
                        tData[idtData]['Unitname'] = obj.Unitname;
                        tData[idtData]['IC'] = obj.IC
                    }
                });
                
                if ( fuels.indexOf(obj.Fuel) === -1 ){
                    fuels.push(obj.Fuel);
                    capByFuel[obj.Fuel] = [];
                }
                totCap = totCap + obj.IC
                if(!totCapByFuel[obj.Fuel]){
                    totCapByFuel[obj.Fuel] = 0;
                }
                totCapByFuel[obj.Fuel] =  totCapByFuel[obj.Fuel] + obj.IC;

            });

            console.log('tData ',tData);
            $.each(genData['else-units'], function (id, obj) {
                capByFuel[obj.Fuel].push(obj.IC);
            });
            $.each(totCapByFuel , function (f, val) {
                perByFuel[f] = val/totCap*100;
            });

            let datafields = [
                {name: "Year", type: "string"},
                {name: "UnitId", type: "string"},
                {name: "Unitname", type: "string"},
                {name: "Fuel", type: "string"},
                {name: "h", type: "bool"},
                {name: "IC", type: "number"},
                {name: "CF", type: "number"},
                {name: "EF", type: "number"},
                {name: "FUC", type: "number"},
                {name: "INC", type: "number"},
                {name: "OCF", type: "number"},
                {name: "OCV", type: "number"},
                {name: "CO2", type: "number"},
                {name: "SO2", type: "number"},
                {name: "NOX", type: "number"},
                {name: "Other", type: "number"}
            ];
    
            this.casename = casename; 
            this.datafields = datafields; 
            this.tData = tData;
            this.genData = genData;

            this.fuels = fuels;
            this.totCap = totCap;
            this.capByFuel = capByFuel;
            this.perByFuel = perByFuel;
            this.totCapByFuel = totCapByFuel;

        }else{
            this.casename = null; 
            this.datafields = null; 
            this.tData = null;
            this.genData = null; 

            this.fuels = null;
            this.totCap = null;
            this.capByFuel = null;
            this.perByFuel = null;
            this.totCapByFuel = null;
        }

    }
}