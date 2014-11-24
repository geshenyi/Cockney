/**
 * Created by ssge on 2014/9/22.
 */
Bucket = new Bucket();

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
//        if(event.detail.isSelected && tabs.selected == 1){
//            console.log(tabs.selected);
//            var form1 = $('#configForm');
//            form1.attr('action','/history');
//            form1.submit();
//        }
//
//    });
    var configTab = document.querySelector('#configTab');
    var historyTab = document.querySelector('#historyTab');
    var runningTab = document.querySelector('#runningTab');

    configTab.addEventListener('click', function (e) {
        window.location.href = "/";
    });

    historyTab.addEventListener('click', function (e) {
        window.location.href = "/history";
    });
//    runningTab.addEventListener('click', function (e) {
////        $.get('/running',function(data){
////            var $dom = $(document.createElement("html"));
////            $dom[0].innerHTML = data;
////            var $body = $dom.find("body");
////
////            $('body').html($body);
////        })
//        window.location.href = "/running";
//    });

    var owl = $("#owl-demo");

    owl.owlCarousel({items: 8});

    // Custom Navigation Events
    $(".next").click(function () {
        owl.trigger('owl.next');
    })
    $(".prev").click(function () {
        owl.trigger('owl.prev');
    })
    $(".play").click(function () {
        owl.trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter
    })
    $(".stop").click(function () {
        owl.trigger('owl.stop');
    })
});

handleReleaseClicked = function (div, release) {
    $('.item').removeClass('clicked');
    $(div).addClass('clicked');
    $('#jobsDiv').empty();
    $('#jobDetails').empty();
    $('#jobParams').empty();
    Bucket.push('currentRelease', release);
    $.ajax({
        type: "GET",
        url: "/history/triggerTimes/" + release,
        contentType: 'application/json'
    }).done(function (msg) {
        var leftPanelDiv = assembleLeftPanel(msg);
        $('#history-left-panel').empty().append(leftPanelDiv);
    });
};

assembleLeftPanel = function (triggerTimeArray) {
    var leftPanelDiv = "";
    for (var i = 0; i < triggerTimeArray.length; i++) {
        if(triggerTimeArray[i].running){
            leftPanelDiv += "<div style='margin:10px' class='row left0 right0'>" +
                "<div class='col-lg-12 padding-left0px padding-right0px'>" +
                "<div class='trigger-btn text-center twinkling-element' onclick=\"handleTriggerTimeClicked(this,\'" + triggerTimeArray[i].hexString + "\')\"><span class='trigger-string'>" + triggerTimeArray[i].displayString + "</span>" +
                "</div>" +
                "</div>" +
                "</div>"
        }else {
            leftPanelDiv += "<div style='margin:10px' class='row left0 right0'>" +
                "<div class='col-lg-12 padding-left0px padding-right0px'>" +
                "<div class='trigger-btn text-center' onclick=\"handleTriggerTimeClicked(this,\'" + triggerTimeArray[i].hexString + "\')\"><span class='trigger-string'>" + triggerTimeArray[i].displayString + "</span>" +
                "</div>" +
                "</div>" +
                "</div>"
        }
    }
    return leftPanelDiv;
};

handleTriggerTimeClicked = function (div, triggerTimeId) {
    $('.trigger-btn').removeClass('clicked');
    $(div).addClass('clicked');
    Bucket.push('currentTrigger', triggerTimeId);
    var currentRelease = typeof Bucket.pull('currentRelease') != 'undefined' ? Bucket.pull('currentRelease') : $('#owl-demo .clicked').attr('id');
    $.ajax({
        type: "GET",
        url: "/history/triggerDetails/" + currentRelease + "/" + triggerTimeId,
        contentType: 'application/json'
    }).done(function (msg) {
        console.log(msg);
        Bucket.push(currentRelease+'-'+triggerTimeId, msg);
        $('#jobsDiv').empty().append(assembleJobsDiv(msg));
        $('#jobDetails').empty().append(assembleJobDetails(msg[0].builds[0].jenkinsName, msg));
        $('#jobParams').empty().append(assembleJobParams(msg[0].builds[0].jenkinsName, msg));
    });
};

handleJobClicked = function(div, jenkinsName){
    $('.job-div').removeClass('clicked');
    $(div).addClass('clicked');
    var currentData = Bucket.pull(Bucket.pull('currentRelease')+'-'+Bucket.pull('currentTrigger'));
//    $('#jobsDiv').empty().append(assembleJobsDiv(msg));
    $('#jobDetails').empty().append(assembleJobDetails(jenkinsName, currentData));
    $('#jobParams').empty().append(assembleJobParams(jenkinsName, currentData));
};

assembleJobsDiv = function (triggerDetails) {
    var jobsDiv = '';
    for (var i = 0; i < triggerDetails[0].builds.length; i++) {
        if (i == 0) {
            jobsDiv += "<div class='jobsDiv'>" +
                "<div class='job-div clicked color"+i % color.length+"' onclick='handleJobClicked(this,\""+triggerDetails[0].builds[i].jenkinsName+"\")'>" + triggerDetails[0].builds[i].jenkinsName + "</div>" +
                "</div>";
        } else {
            jobsDiv += "<div class='jobsDiv'>" +
                "<div class='job-div color" + i % color.length + "' onclick='handleJobClicked(this,\""+triggerDetails[0].builds[i].jenkinsName+"\")'>" + triggerDetails[0].builds[i].jenkinsName + "</div>" +
                "</div>";
        }

    }
    return jobsDiv;
};

assembleJobDetails = function (jobName, triggerDetails) {
    var jobDetails = '';
    var selectedJob = triggerDetails[0].builds[fetchIndexForSpecificJob(jobName,triggerDetails)];
    jobDetails = "<div class='row left0 right0'>"+
                 "<div class='col-lg-4 build-field-name'>"+
                 "<span>Build No(Jenkins)</span>"+
                 "</div>"+
                 "<div class='col-lg-4 build-field-value'>"+
                 "<span>#"+selectedJob.buildNo+"</span>"+
                 "</div>"+
                 "</div>"+
                 "<div class='row left0 right0'>"+
                 "<div class='col-lg-4 build-field-name'>"+
                 "<span>Build Time</span>"+
                 "</div>"+
                 "<div class='col-lg-4 build-field-value'>"+
                 "<span>"+fetchTimestampFromIdentifier(jobName, selectedJob.params.identifier)+"</span>"+
                 "</div>"+
                 "</div>"+
                 "<div class='row left0 right0'>"+
                 "<div class='col-lg-4 build-field-name'>"+
                 "<span>Release Version</span>"+
                 "</div>"+
                 "<div class='col-lg-4 build-field-value'>"+
                 "<span>"+triggerDetails[0].release+"</span>"+
                 "</div>"+
                 "</div>"+
                 "<div class='row left0 right0'>"+
                 "<div class='col-lg-4 build-field-name'>"+
                 "<span>Run Server</span>"+
                 "</div>"+
                 "<div class='col-lg-4 build-field-value'>"+
                 "<span>"+triggerDetails[0].runserver+"</span>"+
                 "</div>"+
                 "</div>";
    return jobDetails;
};

assembleJobParams = function(jobName, triggerDetails){
    var jobParams = '';
    var selectedJob = triggerDetails[0].builds[fetchIndexForSpecificJob(jobName,triggerDetails)];
    for(var eachParam in selectedJob.params){
        jobParams += "<div class='row left0 right0'>"+
                     "<div class='col-lg-3 build-field-name'>"+
                     "<span>"+eachParam+"</span>"+
                     "</div>"+
                     "<div class='col-lg-3 build-field-value'>"+
                     "<span>"+selectedJob.params[eachParam]+"</span>"+
                     "</div>"+
                     "</div>";
    }
    return jobParams;
};

fetchIndexForSpecificJob = function(jobName, triggerDetails){
  for(var i=0;i<triggerDetails[0].builds.length;i++){
      if(triggerDetails[0].builds[i].jenkinsName == jobName){
          return i;
      }
  }
  return -1;
};

fetchTimestampFromIdentifier = function(jobName, identifier){
    return getDisplayTriggerTime(identifier.substring(jobName.length));
};


function getDisplayTriggerTime(timestamp){
    var s1 = "-",s2 = ":";
    var year = timestamp.substring(0,4);
    var month = timestamp.substring(4,6);
    var date = timestamp.substring(6,8);
    var hour = timestamp.substring(8,10);
    var minute = timestamp.substring(10,12);
    var second = timestamp.substring(12,14);
    var millisecond = timestamp.substring(14,17);
    return year+s1+month+s1+date+' '+hour+s2+minute+s2+second+s2+millisecond;
}