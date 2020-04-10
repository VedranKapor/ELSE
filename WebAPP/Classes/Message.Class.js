export class Message {

    static clearMessages(){
        $( "#else-warning" ).empty();
        $( "#else-success" ).empty();
        $( "#else-danger" ).empty();
        $( "#else-info" ).empty();
    }

    static warning(message){
        $("#else-warning").html(`<div class="alert alert-warning fade in">
                                        <button class="close" data-dismiss="alert">×</button>
                                        <i class="fa-fw fa fa-warning"></i>
                                        <strong>Warning</strong> `+ message +`
                                    </div>`);
    }

    static success(message){
        $("#else-success").html(`<div class="alert alert-success fade in">
                                        <button class="close" data-dismiss="alert">×</button>
                                        <i class="fa-fw fa fa-check"></i>
                                        <strong>Success</strong> `+ message +`
                                    </div>`);
    }

    static info(message){
        $("#else-info").html(`<div class="alert alert-info fade in">
                                        <button class="close" data-dismiss="alert">×</button>
                                        <i class="fa-fw fa fa-info"></i>
                                        <strong>Info!</strong> `+ message +`
                                    </div>`);
    }

    static danger(message){
        $("#else-danger").html(`<div class="alert alert-danger fade in">
                                        <button class="close" data-dismiss="alert">×</button>
                                        <i class="fa-fw fa fa-times"></i>
                                        <strong>Error!</strong> `+ message +`
                                    </div>`);
    }

    static bigBoxDanger(title, content, timeout){
        $.bigBox({
            title : title,
            content : `<i class='fa fa-clock-o'></i> <i>${content}</i>`,
            color : "#C46A69",
            icon : "fa fa-warning shake animated",
            //number : "1",
            timeout : timeout
        });
    }

    static bigBoxInfo(title, content, timeout){
        $.bigBox({
            title : title,
            content : content,
            color : "#3276B1",
            icon : "fa fa-bell swing animated",
            //number : "2"
            timeout : timeout
        });
    }

    static bigBoxWarning(title, content, timeout){
        $.bigBox({
            title : title,
            content : content,
            color : "#C79121",
            timeout : timeout,
            icon : "fa fa-shield fadeInLeft animated",
            //number : "3"
        });
    }

    static bigBoxSuccess(title, content, timeout){
        $.bigBox({
            title : title,
            content : content,
            timeout : timeout,
            color : "#659265",
            icon : "fa fa-shield fadeInLeft animated",
            //number : "3"
        });
    }

    static smallBoxSuccess(title, content, timeout){
        $.smallBox({
            title : title,
            timeout : timeout,
            content : `<i class='fa fa-clock-o'></i> <i>${content}</i>`,
            color : "#659265",
            iconSmall : "fa fa-check fa-2x fadeInRight animated"
        });
    }

    static smallBoxWarning(title, content, timeout){
        $.smallBox({
            title : title,
            timeout : timeout,
            content : `<i class='fa fa-clock-o'></i> <i>${content}</i>`,
            color : "#C79121",
            iconSmall : "fa fa-shield fa-2x fadeInLeft animated",
        });
    }

    static smallBoxDanger(title, content, timeout){
        $.smallBox({
            title : title,
            timeout : timeout,
            content : `<i class='fa fa-clock-o'></i> <i>${content}</i>`,
            color : "#C46A69",
            iconSmall : "fa fa-warning shake animated fa-2x ",
        });
    }

    static smallBoxInfo(title, content, timeout){
        $.smallBox({
            title : title,
            timeout : timeout,
            content : `<i class='fa fa-clock-o'></i> <i>${content}</i>`,
            color : "#5384AF",
            iconSmall : "fa fa-bell fadeInRight animated"
        });
    }

    static smallBoxConfirmation(title, content, timeout){
        $.smallBox({
            title : title,
            timeout : timeout,
            content : `<i class='fa fa-clock-o'></i> <i>${content}</i>`,
            color : "#296191",
            iconSmall : "fa fa-thumbs-up bounce animated"
        });
    }
}