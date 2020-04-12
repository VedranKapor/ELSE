import { Message } from "../../Classes/Message.Class.js";
import { Base } from "../../Classes/Base.Class.js";
import { Html } from "../../Classes/Html.Class.js";
import { Grid } from "../../Classes/Grid.Class.js";
import { Else } from "../../Classes/Else.Class.js";
import { SmartAdmin } from "../../Classes/SmartAdmin.Class.js";
import { Model } from "../Model/AddCase.Model.js";
import { Navbar } from "./Navbar.js";

export default class AddCase {
    static onLoad(){
        Base.getSession()
        .then(response => {
            let casename = response.session;
            const promise = [];
            let genData = Else.genData(casename);
            promise.push(genData);
            return Promise.all(promise);
        })
        .then(data => {
            let [genData] = data;
            let model = new Model(genData);
            this.initPage(model);
        })
        .catch(error =>{
            Message.danger(error);
        });
    }

    static initPage(model){
        Message.clearMessages();
        //Navbar.initPage(model.casename, model.pageId);
        if (model.casename == null){
           Message.info("Please select case or create new case study!");
        }else{
            $("#else-new").show();
        }    
        
        Html.title(model.casename);
        Html.genData(model);
        Grid.basicGrid(model.units);
        loadScript("../References/smartadmin/js/plugin/ion-slider/ion.rangeSlider.min.js", SmartAdmin.rangeSlider.bind(null, model.years));
        this.initEvents();

    }

    static refreshPage(casename){
        Base.setSession(casename)
        .then(response=>{
            Message.clearMessages();
            const promise = [];
            let genData = Else.genData(casename);
            promise.push(genData);
            return Promise.all(promise);
        })
        .then(data => {
            let [genData] = data;
            let model = new Model(genData, "AddCase");
            AddCase.initPage(model);
        })
        .catch(error=>{
            Message.bigBoxInfo(error);
        })
    }

    static initEvents(){

        $("#casePicker").off('click');
        $("#casePicker").on('click', '.selectCS', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var casename = $(this).attr('data-ps');
            Html.updateCasePicker(casename);
            AddCase.refreshPage(casename);
            Message.smallBoxInfo("Case selection", casename + " is selected!", 3000);
        });

        function render(message, input) {
            if (this._message) {
                this._message.remove();
            }
            this._message = $("<span class='jqx-validator-error-label'>" + message + "</span>")
            this._message.appendTo("#yearsselectmsg");
            Message.smallBoxWarning("Selection", "Case has to have one year at least!", 3000);
            return this._message;
        }

        $("#else-caseForm").jqxValidator({
            hintType: 'label',
            animationDuration: 500,
            rules : [
                { input: '#else-casename', message: "Case name is required field!", action: 'keyup', rule: 'required' },
                { input: '#else-casename', message: "Entered case name is not allowed!", action: 'keyup', rule: function (input, commit) {
                         var casename = $( "#else-casename" ).val();
                         var result = (/^[a-zA-Z0-9-_ ]*$/.test(casename));
                         return result;
                    }
                },
                { input: '#else-dr', message: "Dicount rate is required field!", action: 'keyup', rule: 'required' },
                { input: '#else-dr', message: "Dicount rate should be zero or positive value!", action: 'keyup', rule: function (input, commit) {
                         var dr = $( "#else-dr" ).val();
                         console.log(dr)
                         console.log(dr < 0 ? true : false);
                         return dr < 0 || isNaN(dr) ? false : true;
                    }
                },
                { input: '#else-date', message: "Date is required field!", action: 'change', rule: 'required'},
                { input: '#else-years', message: 'Select at least one year', action: 'change', hintRender: render, rule: function () {
                    var elements = $('#else-years').find('input[type=checkbox]');
                    var check = false;
                    var result = $.grep(elements, function(element, index) {
                        if(element.checked==true)
                            check=true;
                        });
                    return (check);
                    }
                }
            ]
        });

        $("#else-new").on('click', function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            AddCase.refreshPage(null);
            $("#else-new").hide();
            Message.smallBoxConfirmation("Confirmation!", "Configure new case study!", 3500);
        });

        $("#else-save").on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            $("#else-caseForm").jqxValidator('validate')
        });

        $("#else-caseForm").on('validationSuccess', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            let unitsData = $('#else-grid').jqxGrid('getrows');

            let Data = [];
            $.each(unitsData, function (index, value) {
                let tmp = {};
                tmp.UnitId = value.UnitId;
                tmp[value.UnitId] = value.Unitname;
                tmp.Unitname = value.Unitname;
                tmp.Fuel = value.Fuel;
                tmp.h = value.h;
                tmp.IC = value.IC;
                tmp.LT = value.LT;
                tmp.CT = value.CT;
                Data.push(tmp);
            });

            var casename = $( "#else-casename" ).val();
            var desc = $( "#else-desc" ).val();
            var date = $( "#else-date" ).val();
            var currency = $( "#else-currency" ).val();
            var unit = $( "#else-unit" ).val();
            var dr = $( "#else-dr" ).val();

            var years = new Array();
            $.each($('input[type="checkbox"]:checked'), function (key, value) {
                years.push($(value).attr("id"));
            });

            let POSTDATA = {
                "else-version": "1.0",
                "else-casename":casename,
                "else-desc":desc,
                "else-date": date,
                "else-currency":currency,
                "else-unit": unit,
                "else-dr": dr,
                "else-units": Data,
                "else-years": years
            }
            Else.saveCase(POSTDATA)
            .then(response =>{
                if(response.status_code=="created"){
                    $("#else-new").show();
                    Message.clearMessages();
                    Message.bigBoxSuccess('Case study message', response.message, 3000);
                    Html.appendCasePicker(casename, casename);
                    $("#else-case").html(casename);
                }
                if(response.status_code=="edited"){
                    $("#else-case").html(casename);
                    $("#else-new").show();
                    Navbar.initPage(casename);
                    Message.bigBoxInfo('Case study message', response.message, 3000);
                }
                if(response.status_code=="exist"){
                    $("#else-new").show();
                    Message.bigBoxWarning('Case study message', response.message, 3000);
                }
            })
            .catch(error=>{
                Message.bigBoxDanger('Error message', error, null);
            })
        });

        var ID = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return 'UT_' + Math.random().toString(36).substr(2, 5);
          };

        $("#else-addUnit").on("click", function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            //var rowscount = $("#else-grid").jqxGrid('getdatainformation').rowscount;
            let id = ID();
            let defaultUnit = [
                {
                    "UnitId": id,
                    "Unitname":id,
                    "IC": 0,
                    "LT": 0,
                    "CT": 0,
                    "h": false,
                    "Fuel": "Lignite"
                }
            ];
            $("#else-grid").jqxGrid('addrow', null, defaultUnit);
        });

        $("#else-checkAll").on("click", function(event) {
            event.preventDefault();
            var elements = $('#else-years').find('input[type=checkbox]');
            $.grep(elements, function(element, index) {
                element.checked=true;
            });
            $("#else-caseForm").jqxValidator('validateInput', '#else-years');
        });

        $("#else-uncheckAll").on("click", function(event) {
            event.preventDefault();
            var elements = $('#else-years').find('input[type=checkbox]');
            $.grep(elements, function(element, index) {
                    element.checked=false;
            });
            $("#else-caseForm").jqxValidator('validateInput', '#else-years');
        });

        $("#else-x2").on("click", function(event) {
            event.preventDefault();
            var elements = $('#else-years').find('input[type=checkbox]');
            $.grep(elements, function(element, index) {
                if((index) % 2 == 0)
                element.checked=true;
            });
            $("#else-caseForm").jqxValidator('validateInput', '#else-years');
        });

        $("#else-x5").on("click", function(event) {
            event.preventDefault();
            var elements = $('#else-years').find('input[type=checkbox]');
            $.grep(elements, function(element, index) {
                if((index) % 5 == 0)
                element.checked=true;
            });
            $("#else-caseForm").jqxValidator('validateInput', '#else-years');
        });

    }
}
