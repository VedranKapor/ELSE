export class Model {
    
    constructor (casename, genData, cData) {
        if(casename){
    
            let datafields = [];
            let columns = [];
            let series = [];
            let years = genData['else-years'];

            datafields.push({ name: 'UnitId', type:'string' });
            datafields.push({ name: 'Unitname', type:'string' });
            datafields.push({ name: 'Fuel', type:'string' });
            datafields.push({ name: 'IC', type:'string' });
            columns.push({ text: 'Unit name', datafield: 'Unitname', pinned:true, editable: false, align: 'center',  minWidth: 120, maxWidth: 200 })
            columns.push({ text: 'Fuel', datafield: 'Fuel', pinned:true, editable: false, align: 'center',  minWidth: 120, maxWidth: 200 })
            columns.push({ text: '[ MW ]', datafield: 'IC', pinned:true, editable: false, cellsFormat: 'd2', align: 'center', cellsalign: 'right',  minWidth: 75, maxWidth: 120 })
    
            $.each(years, function (id, year) {
                datafields.push({ name: year, type:'bool' });
                columns.push({ text: year, datafield: year,  cellsalign: 'center',  columntype: 'checkbox',  align: 'center' });
            });

            $.each(genData['else-units'], function (id, obj) {
                $.each(cData, function (idtData, objtData) {
                    if(obj.UnitId == objtData.UnitId){
                        cData[idtData]['Fuel'] = obj.Fuel;
                        cData[idtData]['Unitname'] = obj.Unitname;
                        cData[idtData]['IC'] = obj.IC
                    }
                });
            });

            this.casename = casename; 
            this.years = years;
            this.datafields = datafields; 
            this.columns = columns;
            this.series = series;
            this.cData = cData;
            this.genData = genData;
        }else{
            this.casename = null; 
            this.years = null;
            this.datafields = null; 
            this.columns = null;
            this.columns = null;
            this.cData = null;
            this.genData = null;  
        }

    }
}