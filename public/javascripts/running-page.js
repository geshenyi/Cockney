/**
 * Created by ssge on 2014/9/22.
 */
function outputTextInfo() {
    console.log(document.querySelector('paper-input#major').value);
    console.log($('#major')[0]);
    console.log(document.querySelector('paper-input#major'));
    console.log(document.querySelector('paper-input#minor').value);
    console.log(document.querySelector('paper-radio-group#runserver').selected);


}

$(document).ready(function () {
    var tabs = document.querySelector('paper-tabs');
//    tabs.addEventListener('core-select',function(event){
//        var form1 = $('#historyForm');
//        if(event.detail.isSelected && tabs.selected == 0){
//            console.log(tabs.selected);
//            form1.attr('action','/');
//            form1.submit();
//        }
//    });
    var configTab = document.querySelector('#configTab');
    var historyTab = document.querySelector('#historyTab');
    configTab.addEventListener('click', function (event) {
        var form1 = $('#runningForm');
        form1.attr('action', '/');
        form1.submit();
    });
    historyTab.addEventListener('click', function (event) {
        var form1 = $('#runningForm');
        form1.attr('action', '/history');
        form1.submit();
    })
});