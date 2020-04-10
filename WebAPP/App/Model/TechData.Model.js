export class Model {
    
    constructor (casename, genData, tData) {
        if(casename){

            let datafields = [
                {name: "Year", type: "string"},
                {name: "UnitId", type: "string"},
                {name: "Unitname", type: "string"},
                {name: "Fuel", type: "string"},
                {name: "h", type: "bool"},
                {name: "IC", type: "number"},
                {name: "CF", type: "number"},
                {name: "LT", type: "number"},
                {name: "CT", type: "number"}
            ];
    
            this.casename = casename; 
            this.datafields = datafields; 
            this.tData = tData;
            this.genData = genData;
        }else{
            this.casename = null; 
            this.datafields = null; 
            this.tData = null;
            this.genData = null;  
        }

    }
}