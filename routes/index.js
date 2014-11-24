var express = require('express');
var http = require('http');
var rest = require('../node_modules/restler');
var router = express.Router();
var XMLMapping = require('xml-mapping');
var jenkinsApi = require('jenkinsService');
var MongoService = require('MongoService');
var mongos = new MongoService('localhost','27017','cockneydb');
//var serverUrl = "int.testing.stubcorp.dev";
var serverUrl = "localhost:8080";

color = [
    {upperBgColor: '#ffd9d1', lowerBgColor: '#ff5252'},
    {upperBgColor: '#ffffbe', lowerBgColor: '#ffeb3b'},
    {upperBgColor: '#acffff', lowerBgColor: '#03A9F4'},
    {upperBgColor: '#ffc2ff', lowerBgColor: '#7e57c2'},
    {upperBgColor: '#b9f6ca', lowerBgColor: '#1de9b6'},
    {upperBgColor: '#ffd18c', lowerBgColor: '#ffac30'}
];

function Job(jenkinsName, appName, displayName){
    this.jenkinsName = jenkinsName;
    this.appName = appName;
    this.displayName = displayName;
}

findJobIndex = function(jobName, jobArray){
  for(var i=0;i<jobArray.length;i++){
      if(jobArray[i].jenkinsName == jobName){
          return i;
      }
  }
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

docsHandler = function(jenkinsName, docs){
    var retDoc = [];
    for(var i=0;i<docs.length;i++){
        for(var j=0;j<docs[i].builds.length;j++){
            var eachBuildObj = {};
            if(docs[i].builds[j].jenkinsName == jenkinsName){
                eachBuildObj.timestampsStr = getDisplayTriggerTime(docs[i].builds[j].params.identifier.substring(jenkinsName.length));
                eachBuildObj.status = docs[i].builds[j].status;
                eachBuildObj.identifier = docs[i].builds[j].params.identifier;
                eachBuildObj.buildNo = docs[i].builds[j].buildNo;
                retDoc.push(eachBuildObj);
                break;
            }
        }
    }
    return retDoc;
};

/* GET home page. */
router.get('/', function (req, res) {
//    var jobs = [{jenkinsName:'Buy-APIs-Smoke-Test-Production', appName:'buyapi'},{jenkinsName:'com.stubhub.tests-pb_prod_smoke-integrationtests-smoketest-production',appName:'usui'},{appName:'ukui',jenkinsName:'com.stubhub.tests-pb_prod_smoke-integrationtests-smoketest-production-uk'}
//               ,{jenkinsName: 'com.stubhub.tests-sell-integrationtests-apismoketest',appName:'sellapi'},{jenkinsName: 'fulfillment-main-api-prod-smoketesting',appName:'fulfillmentapi'},{jenkinsName:'socialdomain-production-smoketests',appName:'socialapi'}];
//    var jobs = [
//        {jenkinsName: 'TestJob', appName: 'tj1', displayName: 'Test Job1'},
//        {jenkinsName: 'TestJenkins2', appName: 'tj2', displayName: 'Test Jenkins2'}
//    ];
    var jobs = [];



    var jobParams = [];
    var serverUrl1 = "localhost:8080";
    var count;
    var done = function (job , params, msg, resStatus) {
        if(typeof params == null || resStatus != '200'){
            res.render('index', { title: 'Smoke Test', jobs: [], jobParams: [], color: color, status: resStatus});
        }

        jobParams.push({jenkinsName: job.jenkinsName, appName: job.appName, displayName: job.displayName, params: params});
        count -= 1;
        if (count == 0) {
            console.log("rendering");
            console.log(jobParams);
            res.render('index', { title: 'Smoke Test', jobs: jobs, jobParams: jobParams, color: color});
        }

    };

    var fetchLastBuildsHandler = function(jenkinsName, docs){
        count -= 1;
        jobs[findJobIndex(jenkinsName, jobs)].lastBuilds = docsHandler(jenkinsName, docs);
        if(count == 0){
            res.render('index', { title: 'Smoke Test', jobs: jobs, jobParams: jobParams, color: color});
        }
    };

    eligibleJobsHandler = function(docs){
//        count = docs.length * 2;
        count = 2*2;
        for (var i =0; i < docs.length; i++) {
            jobs = [
                    {jenkinsName: 'TestJob', appName: 'tj1', displayName: 'Test Job1'},
                    {jenkinsName: 'TestJenkins2', appName: 'tj2', displayName: 'Test Jenkins2'}
                ];
//            jobs.push(new Job(docs[i].jenkinsName, '', docs[i].displayName));
        }
        for (var i = 0; i < jobs.length; i++) {
            jenkinsApi.jobConfiguration(serverUrl, jobs[i], done);
            mongos.fetchLastNumberOfBuilds(jobs[i].jenkinsName,5, fetchLastBuildsHandler);
        }
    };
    mongos.fetchEligibleJobs(eligibleJobsHandler);



});

router.post('/testNotification', function (req, res) {
    console.log(req.body);
    mongos.updateBuildStatus(req.body);
    io.sockets.emit('buildComplete',{jenkinsName: req.body.name, status: req.body.build.status, identifier: req.body.build.parameters.identifier, buildNo: req.body.build.number});

});

router.post('/triggerBatchJobs',function(req,res){
    console.log(req.body);
    mongos.saveBuildJobs(req.body);
    var count = req.body.builds.length;
    var responseJson = {};
    var completeHandler = function(jenkinsName, responseCode, identifier){
        count -= 1;
        responseJson[identifier] = responseCode;
        if(count == 0){
            res.json(responseJson);
        }
    };
    for(var i=0; i<req.body.builds.length; i++){
        var eachBuild = req.body.builds[i];
        eachBuild.params.runserver = req.body.runserver;
        jenkinsApi.triggerJob(serverUrl, eachBuild.jenkinsName, eachBuild.params, completeHandler);
    }
});

router.post('/triggerJob/:jobName', function (req, res) {
    console.log(req.params.jobName);
    rest.post("http://localhost:8080/jenkins/job/TestJob/buildWithParameters", {data: {testParam: 'testFromNode'}}).on('complete', function (data, response) {
        console.log(response.statusCode);
        res.status(response.statusCode).json({message: 'messageFromNode'});
    });
});


router.get('/running', function (req, res) {
    res.render('running', {});
});


router.get('/trigger', function (req, res) {

    res.render('error', {});
});

module.exports = router;
