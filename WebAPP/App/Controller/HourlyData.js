import { Message } from "../../Classes/Message.Class.js";
import { Base } from "../../Classes/Base.Class.js";
import { Html } from "../../Classes/Html.Class.js";
import { Model } from "../Model/HourlyData.Model.js";
import { Grid } from "../../Classes/Grid.Class.js";
import { Chart } from "../../Classes/Chart.Class.js";
import { Else } from "../../Classes/Else.Class.js";
import { MessageSelect } from "./MessageSelect.js";

export default class HourlyData {
    static onLoad(){
        Base.getSession()
        .then(response =>{
            let casename = response['session']
            const promise = [];
            promise.push(casename);
            const genData = Else.genData(casename);
            promise.push(genData); 
            const hData = Else.gethData(casename);
            promise.push(hData); 
            return Promise.all(promise);
        })
        .then(data => {
            let [casename, genData, hData] = data;
            let model = new Model(casename, genData, hData);
            
            if(casename){
                this.initPage(model);
                this.initEvents(model);
            }else{
                MessageSelect.init(HourlyData.refreshPage.bind(HourlyData));
            }
        })
        .catch(error =>{ 
            Message.warning(error);
        });
    }

    static initPage(model, year = model.genData['else-years'][0]){

        Message.clearMessages();
        Html.title(model.casename);
        Html.ddlyears(model.genData['else-years'], model.genData['else-years'][0]);

        var sourceJson = {
            datatype: "json",
            localdata: model.hData[year],
            datafields: model.datafields,
        };

        var dataAdapterJson = new $.jqx.dataAdapter(sourceJson, { autoBind: true });

        let $gridJson = $('#else-grid-json');
        let $chartJson = $('#else-chart-json');
        Grid.hourlyGrid($gridJson, dataAdapterJson, model.columns);
        Chart.initChart($chartJson,dataAdapterJson, model.series);
    }

    static refreshPage(casename){
        Base.setSession(casename)
        .then(response =>{
            const promise = [];
            promise.push(casename);
            const genData = Else.genData(casename);
            promise.push(genData); 
            const hData = Else.gethData(casename);
            promise.push(hData); 
            return Promise.all(promise);
        })
        .then(data => {
            let [casename, genData, hData] = data;
            let model = new Model(casename, genData, hData);
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
            HourlyData.refreshPage(casename);
            Message.smallBoxConfirmation("Confirmation!", "Case " + casename + " selected!", 3500);
        });

        $('select').off('change')
        $('select').on('change', function() {
            Pace.restart();
            var sourceJson = {
                datatype: "json",
                localdata: model.hData[this.value],
                datafields: model.datafields,
            };
            var dataAdapterJson = new $.jqx.dataAdapter(sourceJson, { autoBind: true });
            let $gridJson = $('#else-grid-json');
            //let $chartJson = $('#else-chart-json');
            Grid.hourlyGrid($gridJson, dataAdapterJson, model.columns);
            //$gridJson.jqxGrid('refreshdata');
            //$gridJson.jqxGrid('updatebounddata', 'cells');
            //Chart.initChart($chartJson,dataAdapterJson, model.series);
            var chart = $('#else-chart-json').jqxChart('getInstance');
            chart.source.records = model.hData[this.value];
            chart.update();  
          });

        //callback za cellvaluechanged, poziva se manuelno iz copy/paste eventa sa zakasnjenjem od 1.5 sec da se ne poziva za svaki cellvalue changed prilikom paste
        let cellvaluechanged = function (event) {
            let hData = $('#else-grid-json').jqxGrid('getrows');
            let daHData = JSON.stringify(hData,['Hour', 'Demand'].concat(model.units));
            let year = $( "#hData-years" ).val();
            model.hData[year] = JSON.parse(daHData);
            var chart = $('#else-chart-json').jqxChart('getInstance');
            chart.source.records = model.hData[year] ;
            chart.update();  
        }

        $("#else-grid-json").on('cellvaluechanged', cellvaluechanged);

        $("#else-grid-json").bind('keydown', function (event) {
            var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
            var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
            if (key == vKey) {
                Pace.restart();
                $("#else-grid-json").off('cellvaluechanged');
                setTimeout(function(){ 
                    cellvaluechanged();
                    $("#else-grid-json").on('cellvaluechanged', cellvaluechanged);
                 }, 1500);
            }
        });

        $("#else-savehData").on('click', function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                let hData = $('#else-grid-json').jqxGrid('getrows');
                let daHData = JSON.stringify(hData,['Hour', 'Demand'].concat(model.units));
                let year = $( "#hData-years" ).val();
                Else.updatehData(JSON.parse(daHData), year)
                .then(response =>{
                    // model.hData[year] = JSON.parse(daHData);
                    // var chart = $('#else-chart-json').jqxChart('getInstance');
                    // chart.update();  
                    Message.bigBoxSuccess('Case study message', response.message, 3000);
                })
                .catch(error=>{
                    Message.bigBoxDanger('Error message', error, null);
                })
        });
    }
}