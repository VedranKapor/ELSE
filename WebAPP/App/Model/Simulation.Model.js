export class Model {
    
    constructor (casename, genData, hData) {
        if(casename){
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                return '<span style="margin: 4px;">' + value + ' h</span>';
            }
    
            let datafields = []
            let columns = []
            let series = []
            let units = []
            datafields.push({ name: 'Hour', type:'string' });
            datafields.push({ name: 'Demand', type:'number' });
            columns.push({ text: 'Hour', datafield: 'Hour',pinned:true, editable: false,  minWidth: 45, maxWidth: 120, cellsrenderer:cellsrenderer})
            columns.push({ text: 'Demand', datafield: 'Demand',  cellsFormat: 'd2', cellsalign: 'right'})
            series.push( { dataField: 'Demand', displayText: 'demand', lineWidth: 1., color: 'red' });
    
            $.each(genData['else-units'], function (name, obj) {
                columns.push({ text: obj.Unitname + " <sub>["+obj.Fuel+"]</sub>", datafield: obj.UnitId, cellsFormat: 'd2', cellsalign: 'right' });
                series.push( { dataField: obj.UnitId, displayText: obj.Unitname, lineWidth: 1 });
                datafields.push({ name: obj.UnitId, type:'number' });
                units.push(obj.UnitId)
            });
            this.casename = casename; 
            this.units = units;
            this.datafields = datafields; 
            this.columns = columns;
            this.series = series;
            this.hData = hData;
            this.genData = genData;
        }else{
            this.casename = null; 
            this.units = null;
            this.datafields = null; 
            this.columns = null;
            this.series = null;
            this.hData = null;
            this.genData = null;  
        }

    }
}