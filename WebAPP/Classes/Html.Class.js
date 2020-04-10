import { CURRENCY, UNITS, FUELS, COMMODITY } from './Const.Class.js';
import { Message } from "./Message.Class.js";

export class Html {

    static renderCases(cs, selectedCS){
        $('#cases').empty();
        let cases = cs.cases;
       
        $.each(cases, function (index, value) {
            Html.apendCase(value, selectedCS)
        });

        if(!selectedCS) Message.info( "Please select existing or create new case to proceed!");
    }

    static removeCase(value){
        $(`#p_${value.replace(/[^A-Z0-9]/ig, "")}`).remove();
        $(`#l_${value.replace(/[^A-Z0-9]/ig, "")}`).remove();
    }

    static apendCase(value, selectedCS){
        //Base.appendCasePickerHTML(value, selectedCS);
        let htmlstring = `
            <div class="panel panel-default" id=l_${value.replace(/[^A-Z0-9]/ig, "")}>
                <div class="panel-heading" style="padding-right: 0px !important;">
                    <table style="width: 100%;">
                        <tr>
                            <td>
                                <b>
                                    <span class="selectCS"  data-ps="${value}" data-toggle="tooltip" data-placement="top" title="Select case study">
                                        <span class="glyphicon 
                                        ${ selectedCS == value ? ` glyphicon-check danger ` : ` glyphicon-bookmark green `}
                                        fa-1.5x icon-btn"></span><span class="pointer">${value}</span>
                                    </span>
                                </b>
                            </td>
                            <td style="width:40px; text-align:center">
                                <span data-toggle="modal" data-target="#modaldescriptionps">
                                <span class="descriptionPS" data-ps="${value}" data-toggle="tooltip" data-placement="top" title="Case study description">
                                <span class="glyphicon glyphicon-info-sign text-info icon-btn"></span>
                                </span>
                                </span>
                            </td>
                            <td style="width:40px; text-align:center">
                                <span class="editPS " data-ps="${value}" data-toggle="tooltip" data-placement="top" title="Edit case study">
                                    <span class="glyphicon glyphicon-edit text-info icon-btn"></span>
                                </span>
                            </td>
                            <td style="width:40px; text-align:center">
                                <span class="backupCS" data-ps="${value}"
                                data-toggle="tooltip" data-placement="top" title="Backup case study" >
                                <span class="glyphicon glyphicon-download-alt text-info icon-btn"></span>
                                </span>
                                </td>
                            <td style="width:40px; text-align:center">
                                <span data-toggle="modal" data-target="#modalcopy">
                                <span class="copyCS" data-ps="${value}"' + 'id="copy_${value}"  data-toggle="tooltip" data-placement="top" title="Copy case study" >
                                <span class="glyphicon glyphicon-duplicate text-info icon-btn"></span>
                                </span>
                                </span>
                            </td>
                            <td style="width:40px; text-align:center">
                                <span>
                                    <span class="DeletePS" data-ps="${value}"'+'data-toggle="tooltip" data-placement="top" title="Delete case study">
                                        <span  class="glyphicon glyphicon-trash danger icon-btn"></span>
                                    </span>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="collapse_${value.replace(/[^A-Z0-9]/ig, "")}" class="panel-collapse collapse">
                </div>
        </div>`;
        $('#cases').append(htmlstring);
    }

    static renderCasePicker(cs, selectedCS){
        $('#casePicker').empty();
        let cases = cs.cases;
        $.each(cases, function (index, value) {
            Html.appendCasePicker(value, selectedCS);
        });
    }

    static appendCasePicker(value, selectedCS, pageId){
        let res = `
        <li id=p_${value.replace(/[^A-Z0-9]/ig, "")}>
            <a href="javascript:void(0);"  class="selectCS" data-ps="${value}"> <span class="glyphicon 
                ${ selectedCS == value ? ` glyphicon-check danger ` : ` glyphicon-bookmark green `}
            "></span><b> ${value}</b></a>
            <p class="divider"></p>
        </li>
        `;
        $('#casePicker').append(res);
    }

    static updateCasePicker(titleps){
        $('#casePicker').find(".glyphicon-check").removeClass('glyphicon-check danger').addClass('glyphicon-bookmark green');
        $(`#casePicker #p_${titleps.replace(/[^A-Z0-9]/ig, "")} span`).removeClass('glyphicon-bookmark green').addClass('glyphicon-check danger');

        $('#cases').find(".glyphicon-check").removeClass("glyphicon-check danger").addClass("glyphicon-bookmark green");
        $("#collapse_" + titleps.replace(/[^A-Z0-9]/ig, ""))
            .parent()
            .find(".glyphicon-bookmark")
            .removeClass("glyphicon-bookmark green")
            .addClass("glyphicon-check danger"); 
    }

    static title(casename){
        $("#else-case").html(casename);
    }

    static genData(model){
        var container =  $('#else-currency');
        container.empty();
        $.each(CURRENCY, function (key, value) {
            if (value == model.currency){
                container.append('<option value="'+ value+'" selected>'+value+'</option>');
            }else{
                container.append('<option value="'+ value+'">'+value+'</option>');
            }
        });

        var container =  $('#else-unit');
        container.empty();
        $.each(UNITS, function (key, value) {
            if (value == model.unit){
                container.append('<option value="'+ value+'" selected>'+value+'</option>');
            }else{
                container.append('<option value="'+ value+'">'+value+'</option>');
            }
        });

        $("#else-date").datepicker().datepicker("setDate", model.date);
        $("#else-casename").val(model.casename);
        $("#else-desc").val(model.desc);
        $("#else-dr").val(model.dr);
    }

    static ddlyears(years, year){
        var container =  $('#hData-years');
        container.empty();
        $.each(years, function (key, value) {
            if (value == year){
                container.append('<option value="'+ value+'" selected>'+value+'</option>');
            }else{
                container.append('<option value="'+ value+'">'+value+'</option>');
            }
        });
    }

    static years(from, to, range){
        var container =  $('#else-years');
        container.empty();
        for(var i = from; i <= to; i++) {
            if (range.indexOf(String(i)) != -1) {
                container.append(' <label class="checkbox"><input type="checkbox" name="Year['+i+']" id="'+i+'" checked/><i></i>'+i+'</label>');
            }else{
                container.append(' <label class="checkbox"><input type="checkbox" name="Year['+i+']" id="'+i+'"/><i></i>'+i+'</label>');
            }
        }
    }

}
