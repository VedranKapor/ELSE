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
        console.log("model ", model)
        Message.clearMessages();
        Html.title(model.casename);
        //console.log("model ", model)
        var sourceJson = {
            datatype: "json",
            localdata: model.cData,
            datafields: model.datafields,
        };
        var dataAdapterJson = new $.jqx.dataAdapter(sourceJson, { autoBind: true });
        let $configGrid = $('#else-configGrid');
        let $configChart = $('#else-configChart');
        //Html.renderSparkline(model.fuels, model.perByFuel, model.capByFuel, model.totCapByFuel);
        Grid.configGrid($configGrid, dataAdapterJson, model.columns);
        Chart.configChart($chartJson, dataAdapterJson, model.series);
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
    }
}