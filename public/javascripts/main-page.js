/**
 * Created by ssge on 2014/9/22.
 */
function outputTextInfo(){
    console.log(document.querySelector('paper-input#major').value);
    console.log($('#major')[0]);
    console.log(document.querySelector('paper-input#major'));
    console.log(document.querySelector('paper-input#minor').value);
    console.log(document.querySelector('paper-radio-group#runserver').selected);


}

function settingClicked(job){
    alert(job);
}

function changeEvent(){
    alert('a');
}

function toggleDialog(id){
    var dialog = document.querySelector('#'+id);
    dialog.toggle();
}

$(document).ready(function(){
    var tabs = document.querySelector('paper-tabs');
//    tabs.addEventListener('core-select',function(event){
//        if(event.detail.isSelected && tabs.selected == 1){
//            console.log(tabs.selected);
//            var form1 = $('#configForm');
//            form1.attr('action','/history');
//            form1.submit();
//        }
//
//    });
    var historyTab = document.querySelector('#historyTab');
    var runningTab = document.querySelector('#runningTab');
    var buyapiButton = document.querySelector('#buyapi');
    var usuiSetting = document.querySelector('#usui_setting');
    var usuiSave = document.querySelector('#usui_save');

    buyapiButton.addEventListener('click',function(e){
        alert('buy api trigger');
    });
    historyTab.addEventListener('click',function(e){
        var form1 = $('#configForm');
            form1.attr('action','/history');
            form1.submit();
    });
    runningTab.addEventListener('click',function(e){
        var form1 = $('#configForm');
        form1.attr('action','/running');
        form1.submit();
    });
//    usuiSetting.addEventListener('click',function(e){
//        $('#usui_front').css('display','none');
//        $('#usui_back').css('display','block');
//        $('#usui_setting').addClass('hide');
//        $('#usui_save').removeClass('hide');
//    })
//
//    usuiSave.addEventListener('click',function(e){
//        $('#usui_front').css('display','block');
//        $('#usui_back').css('display','none');
//        $('#usui_setting').removeClass('hide');
//        $('#usui_save').addClass('hide');
//    })
});

function testv1Clicked(){
    $('#eventidv1').toggleClass('hide');
}

function testv2Clicked(){
    $('#eventidv2').toggleClass('hide');
}