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
//    var dialog = document.querySelector('#'+id);
    var dialog = document.getElementById(id);
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
    var configTab =  document.querySelector('#configTab');
    var historyTab = document.querySelector('#historyTab');
    var runningTab = document.querySelector('#runningTab');

    configTab.addEventListener('click',function(e){
        window.location.href = "/";
    });

    historyTab.addEventListener('click',function(e){
        window.location.href = "/history";
    });
//    runningTab.addEventListener('click',function(e){
////        $.get('/running',function(data){
////            var $dom = $(document.createElement("html"));
////            $dom[0].innerHTML = data;
////            var $body = $dom.find("body");
////
////            $('body').html($body);
////        })
//        window.location.href = "/running";
//    });
});

function testv1Clicked(){
    $('#eventidv1').toggleClass('hide');
}

function testv2Clicked(){
    $('#eventidv2').toggleClass('hide');
}

function triggerJob(jobName){
    console.log("In triggerJob");
    $.post('/triggerJob/'+jobName,function(data){
        console.log(data);
    })
}

assembleBuildParams = function(jenkinsName){
    var params = {};
    var jobParams = document.querySelectorAll('.'+jenkinsName+'Param');
    for(var j=0;j<jobParams.length;j++){
        var jobParamsName = getParamNameFromId(jobParams[j].id);
        if(jobParams[j].tagName == 'PAPER-CHECKBOX'){
            params[jobParamsName] = jobParams[j].checked;
        }else if(jobParams[j].tagName == 'PAPER-INPUT'){
            params[jobParamsName] = jobParams[j].value;
        }else if(jobParams[j].tagName == 'PAPER-RADIO-GROUP'){
            params[jobParamsName] = jobParams[j].selected;
        }
    }
    return params;
};

getServer = function(){
    return document.querySelector('#runserver').selected;
};

getRelease = function(){
    return document.querySelector('#major').value + '.' + document.querySelector('#minor').value;
};

triggerJob = function(jenkinsName){
    var release = getRelease();
    var runserver = getServer();
    var buildInfo = {};
    var buildJobsWithParams = [];
    var params = assembleBuildParams(jenkinsName);
    params['identifier'] = jenkinsName + moment().format('YYYYMMDDHHmmssSSS');
    buildJobsWithParams.push({jenkinsName:jenkinsName,params: params, status:'RUNNING'});
    buildInfo.release = release;
    buildInfo.runserver = runserver;
    buildInfo.builds = buildJobsWithParams;
    for(var i=0;i<buildInfo.builds.length;i++){
        var eachJenkinsName = buildInfo.builds[i].jenkinsName;
        var displayTriggerTime = getDisplayTriggerTime(buildInfo.builds[i].params.identifier.substring(eachJenkinsName.length));
        var buildSize = $('#'+eachJenkinsName+'BuildsInfo > div').length;
        if(buildSize == 5){
            $('#'+eachJenkinsName+'BuildsInfo > div:last-child').remove();
        }
        $("<div id='"+buildInfo.builds[i].params.identifier+"BuildDiv'><span style='font-size:1.5rem;font-style:italic'>Triggered at "+displayTriggerTime+"</span><img width='30px' src='/images/loading.gif'/></div>").prependTo('#'+eachJenkinsName+'BuildsInfo');
    }
    triggerJobsPost(buildInfo);
};

function triggerAllJobs(){
//    var testDiv = $('#testDynamicContent');
//    $("<p>Test</p>").appendTo("#testDynamicContent");
    var jobs = document.querySelectorAll('.jobCheckBox');
    var release = getRelease();
    var runserver = getServer();
    var buildInfo = {};
    var buildJobsWithParams = [];
    for(var i=0;i<jobs.length;i++){
        if(jobs[i].checked){
            console.log(jobs[i].id);
            var jenkinsName = getJenkinsNameFromId(jobs[i].id);
            var params = assembleBuildParams(jenkinsName);
            params['identifier'] = jenkinsName + moment().format('YYYYMMDDHHmmssSSS');
            console.log(params);
            buildJobsWithParams.push({jenkinsName:jenkinsName,params: params, status:'RUNNING'});
        }
    }

    buildInfo.release = release;
    buildInfo.runserver = runserver;
    buildInfo.builds = buildJobsWithParams;

    for(var i=0;i<buildInfo.builds.length;i++){
        var eachJenkinsName = buildInfo.builds[i].jenkinsName;
        var displayTriggerTime = getDisplayTriggerTime(buildInfo.builds[i].params.identifier.substring(eachJenkinsName.length));
        var buildSize = $('#'+eachJenkinsName+'BuildsInfo > div').length;
        if(buildSize == 5){
            $('#'+eachJenkinsName+'BuildsInfo > div:last-child').remove();
        }
        $("<div id='"+buildInfo.builds[i].params.identifier+"BuildDiv'><span style='font-size:1.5rem;font-style:italic'>Triggered at "+displayTriggerTime+"</span><img width='30px' src='/images/loading.gif'/></div>").prependTo('#'+eachJenkinsName+'BuildsInfo');
    }

    triggerJobsPost(buildInfo);
}

triggerJobsPost = function(buildInfo){
    $.ajax({
        type: "POST",
        url: "/triggerBatchJobs",
        data: JSON.stringify(buildInfo),
        contentType: 'application/json'
    }).done(function(msg){
        console.log(msg);
        for(var each in msg){
            if(typeof each != 'undefined'){
                if(msg[each] == 201 || msg[each] == 200){
//                   $('#'+each+'BuildDiv > img').attr('src','/images/checkmark.png')
                }else{
                    $('#'+each+'BuildDiv > img').attr('src','/images/close.png')
                }
            }
        }
    });
};

openReport = function(buildNo, jenkinsName){
    $('#reportObject').attr('data','https://int.testing.stubcorp.dev/jenkins/view/Production/job/'+jenkinsName+'/'+buildNo+'/HTML_Report/');
    document.querySelector('#reportDialog').toggle();
};

function getJenkinsNameFromId(id){
    return id.substring(0,id.indexOf('-'));
}

function getParamNameFromId(id){
    return id.substring(id.indexOf('-') + 1);
}

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