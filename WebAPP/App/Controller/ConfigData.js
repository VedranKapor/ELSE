import { Message } from "../../Classes/Message.Class.js";
import { Base } from "../../Classes/Base.Class.js";
import { Html } from "../../Classes/Html.Class.js";
import { Model } from "../Model/ConfigData.Model.js";
import { Grid } from "../../Classes/Grid.Class.js";
import { Chart } from "../../Classes/Chart.Class.js";
import { Else } from "../../Classes/Else.Class.js";
import { MessageSelect } from "./MessageSelect.js";
import { SmartAdmin } from "../../Classes/SmartAdmin.Class.js";

export default class ConfigData {
    static onLoad(){
        Base.getSession()
        .then(response =>{
            let casename = response['session']
            const promise = [];
            promise.push(casename);
            const genData = Else.genData(casename);
            promise.push(genData); 
            const cData = Else.getcData(casename);
            promise.push(cData); 
            return Promise.all(promise);
        })
        .then(data => {
            let [casename, genData, cData] = data;
            let model = new Model(casename, genData, cData);
            if(casename){
                this.initPage(model);
                this.initEvents(model);
                ;
            }else{
                MessageSelect.init(ConfigData.refreshPage.bind(ConfigData));
            }
        })
        .catch(error =>{ 
            Message.warning(error);
        });
    }

    static initPage(model){
        Message.clearMessages();
        //Navbar.initPage(model.casename);
        Html.title(model.casename);
        console.log('chartData prije init', model.chartData)
        var srcGrid = {
            datatype: "json",
            localdata: model.cData,
            datafields: model.datafields,
        };
        var srcChart = {
            datatype: "json",
            localdata: model.chartData,
            datafields: model.datafieldsChart,
        };
        var daGrid = new $.jqx.dataAdapter(srcGrid);
        var daChart = new $.jqx.dataAdapter(srcChart, { autoBind: true });
        let $divGrid = $('#else-configGrid');
        let $divChart = $('#else-configChart');
        //Html.renderSparkline(model.fuels, model.perByFuel, model.capByFuel, model.totCapByFuel);
        Grid.configGrid($divGrid, daGrid, model.columns);
        Chart.configChart($divChart, daChart, model.series);
        //pageSetUp();
    }

    static refreshPage(casename){
        Base.setSession(casename)
        .then(response =>{
            const promise = [];
            promise.push(casename);
            const genData = Else.genData(casename);
            promise.push(genData); 
            const cData = Else.getcData(casename);
            promise.push(cData); 
            return Promise.all(promise);
        })
        .then(data => {
            let [casename, genData, cData] = data;
            let model = new Model(casename, genData, cData);
            this.initPage(model);
            this.initEvents(model);
        })
        .catch(error =>{ 
            Message.warning(error);
        });
    }

    static initEvents(model){
        $("#casePicker").off('click');
        $("#casePicker").on('click', '.selectCS', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var casename = $(this).attr('data-ps');
            Html.updateCasePicker(casename);
            ConfigData.refreshPage(casename);
            Message.smallBoxConfirmation("Confirmation!", "Case " + casename + " selected!", 3500);
        });

        $("#else-savecData").on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            let cData = $('#else-configGrid').jqxGrid('getrows');
            let daCData = JSON.stringify(cData,[ 'UnitId'].concat(model.years));
            //potrebno dodati za koji godinu vrsimo update
            Else.updatecData(JSON.parse(daCData))
            .then(response =>{
                model.cData = JSON.parse(daCData);
                Message.bigBoxSuccess('Case study message', response.message, 3000);
            })
            .catch(error=>{
                Message.bigBoxDanger('Error message', error, null);
            })
        });

        $("#else-configGrid").on('cellvaluechanged', function (event) {
            Pace.restart();
            var args = event.args;
            var year = event.args.datafield;
            var rowBoundIndex = args.rowindex;
            var value = args.newvalue;
            var unitId = $('#else-configGrid').jqxGrid('getcellvalue', rowBoundIndex, 'UnitId');
            $.each(model.chartData, function (id, obj) {
                if(obj.Year == year){
                    if(value){
                        obj[unitId] = model.unitData[unitId]['IC'];
                    }else{
                        obj[unitId] = 0;
                    }
                    
                }
            });
            var configChart = $('#else-configChart').jqxChart('getInstance');
            configChart.source.records = model.chartData;
            configChart.update();
        });

        $(".switchChart").on('click', function (e) {
            e.preventDefault();
            var configChart = $('#else-configChart').jqxChart('getInstance');
            var chartType = $(this).attr('data-chartType');
            configChart.seriesGroups[0].type = chartType;
            configChart.update();  
            $('.widget-toolbar a').switchClass( "green", "grey" );
            $('#'+chartType).switchClass( "grey", "green" );
        });
    }
}