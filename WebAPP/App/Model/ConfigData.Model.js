export class Model {
    
    constructor (casename, genData, cData) {
        if(casename){
    
            let datafields = [];
            let datafieldsChart = [];
            let columns = [];
            let series = [];
            let years = genData['else-years'];
            let units = genData['else-units'];
            let unitData;

            datafields.push({ name: 'UnitId', type:'string' });
            datafields.push({ name: 'Unitname', type:'string' });
            datafields.push({ name: 'Fuel', type:'string' });
            datafields.push({ name: 'IC', type:'string' });
            datafieldsChart.push({ name: 'Year', type:'string' });
            columns.push({ text: 'Unit name', datafield: 'Unitname', pinned:true, editable: false, align: 'center',  minWidth: 120, maxWidth: 200 })
            columns.push({ text: 'Fuel', datafield: 'Fuel', pinned:true, editable: false, align: 'center',  minWidth: 120, maxWidth: 200 })
            columns.push({ text: '[ MW ]', datafield: 'IC', pinned:true, editable: false, cellsFormat: 'd2', align: 'center', cellsalign: 'right',  minWidth: 75, maxWidth: 120 })
            
            $.each(years, function (id, year) {
                datafields.push({ name: year, type:'bool' });
                columns.push({ text: year, datafield: year,  cellsalign: 'center',  columntype: 'checkbox',  align: 'center' });
            });

            $.each(units, function (id, obj) {
                datafieldsChart.push({ name: obj.UnitId, type:'number' });
                series.push( { dataField: obj.UnitId, displayText:  obj.Unitname, showLabels: false, formatFunction: function (value) { return value.toFixed(2) + ' MW'; },
                    labels: {
                        visible: true,
                        verticalAlignment: 'middle',
                        offset: { x: 50, y: 50 }
                    },
                });
                unitData = {}
                $.each(cData, function (idtData, objtData) {
                    if(obj.UnitId == objtData.UnitId){
                        cData[idtData]['Fuel'] = obj.Fuel;
                        cData[idtData]['Unitname'] = obj.Unitname;
                        cData[idtData]['IC'] = obj.IC
                        // unitData[obj.UnitId] = {};
                        // unitData[obj.UnitId]['Unitname'] = obj.Unitname;
                        // unitData[obj.UnitId]['IC'] = obj.IC;
                        // unitData[obj.UnitId]['Config'] = obj.IC;
                    }
                    unitData[objtData.UnitId] = {};
                    $.each(years, function (idY, year) {
                        unitData[objtData.UnitId][year] = objtData[year];
                        
                    });
                });
            });

            let chartData = [];
            $.each(years, function (idY, year) {
                let chunk = {};
                chunk['Year'] = year;
                $.each(units, function (idU, unit) {
                    if (  unitData[unit.UnitId][year] ){
                        chunk[unit.UnitId] = unit.IC;
                        unitData[unit.UnitId]['IC'] = unit.IC;
                    }else{
                        chunk[unit.UnitId] = 0;
                        unitData[unit.UnitId]['IC'] = unit.IC;
                    }
 
                });
                chartData.push(chunk);
            });

            this.casename = casename; 
            this.years = years;
            this.datafields = datafields; 
            this.datafieldsChart = datafieldsChart; 
            this.columns = columns;
            this.series = series;
            this.cData = cData;
            this.chartData = chartData;
            this.genData = genData;
            this.unitData = unitData;
        }else{
            this.casename = null; 
            this.years = null;
            this.datafields = null; 
            this.datafieldsChart = null; 
            this.columns = null;
            this.columns = null;
            this.cData = null;
            this.chartData = null;
            this.genData = null; 
            this.unitData = null; 
        }

    }
}