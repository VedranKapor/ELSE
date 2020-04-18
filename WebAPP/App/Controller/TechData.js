import { Message } from "../../Classes/Message.Class.js";
import { Base } from "../../Classes/Base.Class.js";
import { Html } from "../../Classes/Html.Class.js";
import { Model } from "../Model/TechData.Model.js";
import { Grid } from "../../Classes/Grid.Class.js";
import { Else } from "../../Classes/Else.Class.js";
import { MessageSelect } from "../Controller/MessageSelect.js";

export default class TechData {
    static onLoad(){
        Base.getSession()
        .then(response =>{
            let casename = response['session']
            const promise = [];
            promise.push(casename);
            const genData = Else.genData(casename);
            promise.push(genData); 
            const tData = Else.gettData(casename);
            promise.push(tData); 
            return Promise.all(promise);
        })
        .then(data => {
            let [casename, genData, tData] = data;
            let model = new Model(casename, genData, tData);
            if(casename){
                this.initPage(model);
                this.initEvents(model);
            }else{
                MessageSelect.init(TechData.refreshPage.bind(TechData));
            }
        })
        .catch(error =>{ 
            Message.warning(error);
        });
    }

    static initPage(model){
        Message.clearMessages();
        Html.title(model.casename);
        var sourceJson = {
            datatype: "json",
            localdata: model.tData,
            datafields: model.datafields,
        };
        var dataAdapterJson = new $.jqx.dataAdapter(sourceJson);
        let $gridJson = $('#else-techGrid');
        Html.renderSparkline(model.fuels, model.perByFuel, model.capByFuel, model.totCapByFuel);
        Grid.techGrid($gridJson, dataAdapterJson, model.genData['else-currency']);
        pageSetUp();
    }

    static refreshPage(casename){
        Base.setSession(casename)
        .then(response =>{
            const promise = [];
            promise.push(casename);
            const genData = Else.genData(casename);
            promise.push(genData); 
            const tData = Else.gettData(casename);
            promise.push(tData); 
            return Promise.all(promise);
        })
        .then(data => {
            let [casename, genData, tData] = data;
            let model = new Model(casename, genData, tData);
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
            TechData.refreshPage(casename);
            Message.smallBoxConfirmation("Confirmation!", "Case " + casename + " selected!", 3500);
        });

        $("#else-savetData").on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            let tData = $('#else-techGrid').jqxGrid('getrows');
            let daTData = JSON.stringify(tData,['Year', 'UnitId', 'IC','CF', 'EF', 'FUC', 'INC', 'OCF', 'OCV', 'CO2', 'SO2', 'NOX', 'Other']);
            //potrebno dodati za koji godinu vrsimo update
            Else.updatetData(JSON.parse(daTData))
            .then(response =>{
                model.tData = JSON.parse(daTData);
                Message.bigBoxSuccess('Case study message', response.message, 3000);
            })
            .catch(error=>{
                Message.bigBoxDanger('Error message', error, null);
            })
        });
    }
}