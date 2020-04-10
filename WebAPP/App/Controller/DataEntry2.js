import { Message } from "../../Classes/Message.Class.js";
import { Base } from "../../Classes/Base.Class.js";
import { Html } from "../../Classes/Html.Class.js";
import { Model } from "../Model/DataEntry.Model2.js";
import { Grid } from "../../Classes/Grid.Class.js";
import { Chart } from "../../Classes/Chart.Class.js";
import { Else } from "../../Classes/Else.Class.js";

export default class DataEntry {
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
            
            this.initEvents(model)
            if(casename){
                this.initPage(model);
                ;
            }else{
                Message.info("Please select case to proceed!");
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
            DataEntry.refreshPage(casename);
            Message.smallBoxConfirmation("Confirmation!", "Case " + casename + " selected!", 3500);
        });

        $('a[data-toggle=tab').on('shown.bs.tab', function (e) {
                var tab = $(this).attr('href'); 
                if(tab == '#s2'){
                    var chart = $('#else-chart-csv').jqxChart('getInstance');
                    chart.update();  
                }  
                if(tab == '#s4'){
                    var chart = $('#else-chart-json').jqxChart('getInstance');
                    chart.update();  
                }  
        });

        $('select').off('change')
        $('select').on('change', function() {
            var sourceJson = {
                datatype: "json",
                localdata: model.hData[this.value],
                datafields: model.datafields,
            };
    
            var dataAdapterJson = new $.jqx.dataAdapter(sourceJson, { autoBind: true });
    
            let $gridJson = $('#else-grid-json');
            let $chartJson = $('#else-chart-json');
            Grid.hourlyGrid($gridJson, dataAdapterJson, model.columns);
            Chart.initChart($chartJson,dataAdapterJson, model.series);
          });

        $("#else-savehData").on('click', function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                let hData = $('#else-grid-json').jqxGrid('getrows');
                let daHData = JSON.stringify(hData,['Hour', 'Demand'].concat(model.units));
                let year = $( "#hData-years" ).val();
                //potrebno dodati za koji godinu vrsimo update
                Else.updatehData(JSON.parse(daHData), year)
                .then(response =>{
                    model.hData[year] = JSON.parse(daHData);
                    Message.bigBoxSuccess('Case study message', response.message, 3000);
                })
                .catch(error=>{
                    Message.bigBoxDanger('Error message', error, null);
                })
        });
    }
}