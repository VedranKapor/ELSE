import { CURRENCY, UNITS, FUELS, COMMODITY } from './Const.Class.js';
import { Message } from "./Message.Class.js";

export class Grid {
    static theme() {
        let theme = "bootstrap";
        return theme
    }

    static basicGrid(data){
        if(!data){
            var data = [{
                    "UnitId": "UT_00000",
                    "Unitname": "UT_00000",
                    "IC": 0,
                    "LT": 0,
                    "CT": 0,
                    "h": false,
                    "Fuel": "Lignite"
                }  
            ];
        }

        var source =  {
            localdata: data,
            datatype: "json",
            datafields:
            [
                { name: 'UnitId', type: 'string' },
                { name: 'Unitname', type: 'string' },
                { name: 'IC', type: 'number'},
                { name: 'LT', type: 'number'},
                { name: 'CT', type: 'number'},
                { name: 'Fuel', type: 'string' },
                { name: 'h', type: 'string' }
            ],
        };
        var dataAdapter = new $.jqx.dataAdapter(source);

        var ddlSource = {
            localdata: JSON.stringify(FUELS),
            datatype: "json",
            datafields:
            [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'group', type: 'string' }
            ],
        };
        var daFuels = new $.jqx.dataAdapter(ddlSource);

        var ddlEditor = function(row, value, editor) {
            editor.jqxDropDownList({ source: daFuels, displayMember: 'name', valueMember: 'id', groupMember: 'group' });
        }

        var validation_1 = function (cell, value) {
            var validationResult = true;
            var rows = $('#else-grid').jqxGrid('getrows');
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].Unitname.trim() == value.trim() && i != cell.row) {
                    validationResult = false;
                    break;
                }
            };

            if (validationResult == false) {
                Message.smallBoxWarning("Input message", "Unit name should be unique!", 3000);
                return { result: false, message: "" };
            }
            return true;
        }

        var validation_2 = function(cell, value){
            if(value < 0 ){
                return { result: false, message: "Vlaue should be positive" };
            }else{
                return true;
            }
        }

        var cellsrendererbutton = function (row, column, value) {
            var id = $("#else-grid").jqxGrid('getrowid', row);
            if (id == 0) {
                return '';
            }
            return '<span style="padding:10px; width:100%; border:none" class="btn btn-default deleteUnit" data-id='+ id+'><i class="fa  fa-minus-circle danger"></i>Delete</span>';
        }

        var columnsrenderer = function (value) {
            return '<div style="text-align: center; margin-top: 12px; word-wrap:normal; white-space:normal;">' + value + '</div>';
        }

        var createeditor = function (row, cellvalue, editor) {
            editor.jqxNumberInput({ decimalDigits: 0 });
        }

        $(document).delegate(".deleteUnit","click",function(e){
            event.preventDefault();
            event.stopImmediatePropagation();
            var id = $(this).attr('data-id');
            if(id!=0){
                $("#else-grid").jqxGrid('deleterow', id);
            }
            // $.SmartMessageBox({
            //     title : "<i class='fa fa-warning shake animated fa-2x'></i>Confirmation Box!",
            //     content : "You are about to <b class='danger'>delete</b> case study! it will remove all related data to this unit in tool. Are you sure?",
            //     buttons : '[No][Yes]'
            // }, function(ButtonPressed) {
            //     if (ButtonPressed === "Yes") {
            //         console.log(id);
            //         if(id!=0){
            //             $("#else-grid").jqxGrid('deleterow', id);
            //         }
            //     }
            //     if (ButtonPressed === "No") {
            //         Message.smallBoxInfo("Confirmation message", "You pressed No...", 3000)
            //     }
            // });
        });

        $("#else-grid").jqxGrid({
            width: '100%',
            autoheight: true,
            columnsheight: 70,
            theme: this.theme(),
            source: dataAdapter,
            editable: true,
            selectionmode: 'none',
            enablehover: false,
            columns: [
              { text: 'unitId', datafield: 'UnitId', hidden: true },
              { text: 'Plant unit name', datafield: 'Unitname', width: '24%',align: 'center',cellsalign: 'left', validation:validation_1 },
              { text: 'Capacity <br>[MW]', datafield: 'IC', width: '12%', align: 'center',cellsalign: 'right', cellsformat: 'f2', validation:validation_2, renderer: columnsrenderer, columntype: 'numberinput'},
              { text: 'Pattern <br>[hours]', datafield: 'h', width: '10%',  columntype: 'checkbox',  align: 'center' , renderer: columnsrenderer},
              { text: 'Lifetime <br>[years]', datafield: 'LT', width: '12%', align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, renderer: columnsrenderer, columntype: 'numberinput',createeditor:createeditor},
              { text: 'Contruction <br>[years]', datafield: 'CT', width: '12%', align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, renderer: columnsrenderer, columntype: 'numberinput',createeditor:createeditor},
              { text: 'Fuel <br>[Technology]', datafield: 'Fuel', width: '20%',  columntype: 'dropdownlist',  createeditor: ddlEditor, align: 'center',cellsalign: 'center', renderer: columnsrenderer},
              { text: '', datafield: 'Delete', width: '10%',  cellsrenderer: cellsrendererbutton, editable:false  },
            ]
        }); 
    }

    static hourlyGrid($div, dataAdapter, columns){
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            return '<span style="margin: 4px;">' + value + ' h</span>';
        }
        $div.jqxGrid({
            width: '100%',
            autoheight: true,
            rowsheight: 25,
            source: dataAdapter,
            columnsautoresize: true,
            columnsresize:true,
            pageable: true,
            columnsResize: true,
            theme: this.theme(),
            pagerheight: 26,
            editable: true,
            altrows: false,
            pagesize: 20,
            selectionmode: 'multiplecellsadvanced',
            enablehover: false,
            editmode: 'selectedcell',
            columns:columns,
            // handlekeyboardnavigation: function (event) {
            //     var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
            //     if (key == 86) {
            //         console.log('paste'),
            //         console.log('e ', event);
            //         return true;
            //     } else if (key == 27) {
            //         alert('Pressed Esc Key.');
            //         return true;
            //     }
            // },
        });
    }

    static techGrid($div, dataAdapter, currency){
 
        var columnsrenderer = function (value) {
         return '<div style="text-align: center; margin-top: 12px; word-wrap:normal; white-space:normal;">' + value + '</div>';
         }
 
         var cellsrendererWarning = function (row, columnfield, value, defaulthtml, columnproperties) {
            if ( value==0) {
                value = $.jqx.dataFormat.formatnumber(value, 'd2');
                return '<span style="margin: 4px;  float: ' + columnproperties.cellsalign + ';"><i class="fa fa-exclamation-triangle warning" aria-hidden="true"></i>' + value + '</span>';
           }
           if ( value<0) {
                value = $.jqx.dataFormat.formatnumber(value, 'd2');
                return '<span style="margin: 4px;  float: ' + columnproperties.cellsalign + ';"><i class="fa fa-exclamation-triangle danger" aria-hidden="true"></i>' + value + '</span>';
            }
        }

        let height = $( window ).height() -245 ;
        $div.jqxGrid({
             autoheight: true,
             //height: height,
            // autorowheight: true,
             showfilterrow: false,
             filterable: true,
             sortable: true,
             columnsheight: 50,
             columnsresize:true,     
             //columnsautoresize:true,
             altrows: true,
             groupable: true,
             showgroupsheader: true,
             
             width: '100%',
             theme: this.theme(),
             source: dataAdapter,
             editable: true,
             selectionmode: 'multiplecellsadvanced',

             columns: [
                { text: 'Year',                                              datafield: 'Year',       align: 'center',  cellsalign: 'left',                        pinned: true, editable: false,  maxwidth: 155, minwidth: 100, renderer: columnsrenderer },
                { text: 'Unitname',                                          datafield: 'Unitname',   align: 'center',  cellsalign: 'left',                        pinned: true, editable: false,  maxwidth: 155, minwidth: 100, renderer: columnsrenderer },
                { text: 'Fuel',                                              datafield: 'Fuel',       align: 'center',  cellsalign: 'left',                        pinned: true, editable: false,  maxwidth: 155, minwidth: 100, renderer: columnsrenderer },
                { text: 'Installed capacity<br>[MW]',                        datafield: 'IC',         align: 'center',  cellsalign: 'right',   columngroup: 'TD',   editable: false,  maxwidth: 155, minwidth: 100, renderer: columnsrenderer },
                { text: 'Capacity factor <br>[%]',                           datafield: 'CF',         align: 'center',  cellsalign: 'right', columngroup: 'TD',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'Efficiency <br>[%]',                                datafield: 'EF',         align: 'center',  cellsalign: 'right', columngroup: 'TD',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'CO<sub>2</sub> <br>removal factor [%]',                        datafield: 'CO2',        align: 'center',  cellsalign: 'right', columngroup: 'EF',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'NO<sub>X</sub> <br>[g/kWh]',                                   datafield: 'NOX',        align: 'center',  cellsalign: 'right', columngroup: 'EF',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'SO<sub>2</sub> <br>[g/kWh]',                                   datafield: 'SO2',        align: 'center',  cellsalign: 'right', columngroup: 'EF',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'Other <br>[g/kWh]',                                    datafield: 'Other',      align: 'center',  cellsalign: 'right', columngroup: 'EF',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'Fuel cost <br>['+currency+'/GJ]',                   datafield: 'FUC',        align: 'center',  cellsalign: 'right', columngroup: 'CD',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'Investment cost <br>['+currency+'/kW]',             datafield: 'INC',        align: 'center',  cellsalign: 'right', columngroup: 'CD',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'Operating cost <sub>fixed</sub> <br>['+currency+'/kW/yr]',     datafield: 'OCF',        align: 'center',  cellsalign: 'right', columngroup: 'CD',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
                { text: 'Operating cost <sub>variable</sub> <br>['+currency+'/MWh]',    datafield: 'OCV',        align: 'center',  cellsalign: 'right', columngroup: 'CD',maxwidth: 155, minwidth: 100, cellsformat: 'd2', renderer: columnsrenderer, cellsrenderer:cellsrendererWarning },
            ],
            columngroups: 
            [
              { text: 'Technical Details', align: 'center', name: 'TD' },
              { text: 'Emisions factors',  align: 'center', name: 'EF' },
              { text: 'Cost data', align: 'center', name: 'CD' }
            ]
        });

    }

    static configGrid($div, dataAdapter, columns){
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            return '<span style="margin: 4px;">' + value + ' h</span>';
        }
        $div.jqxGrid({
            width: '100%',
            autoheight: true,
            //rowsheight: 25,
            source: dataAdapter,
            columnsautoresize: true,
            columnsresize:true,
            groupable: true,
            theme: this.theme(),
            // pageable: true,
            // pagerheight: 26,
            editable: true,
            altrows: true,
            pagesize: 20,
            selectionmode: 'multiplecellsadvanced',
            enablehover: true,
            editmode: 'selectedcell',
            columns:columns
        });
    }

}
