var express = require('express');
var rest = require('restler');
var router = express.Router();
var jenkinsApi = require('jenkinsService');
var MongoService = require('MongoService');
var mongos = new MongoService('localhost', '27017', 'cockneydb');
var async = require('async');
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;
//var serverUrl = "int.testing.stubcorp.dev";
var serverUrl = "localhost:8080";

router.get('/', function (req, res) {
    console.log('in history.js');

    async.waterfall([function (callback) {
        handleDistinctReleases = function (err, docs) {
            var releaseArray = docs.sort().reverse();
            callback(null, {releases: releaseArray});
        };
        mongos.fetchDistinctReleases(handleDistinctReleases);
    }, function (result, callback) {
        mongos.fetchBuildsByRelease(result.releases[0], function (err, docs) {
            console.log(docs);
//            var str = docs[0].ObjectId.toHexString();
            var triggerTimeArray = [];
            for (var i = 0; i < docs.length; i++) {
                var running = false;
                for (var j = 0;j<docs[i].builds.length;j++){
                    if(docs[i].builds[j].status == 'RUNNING'){
                        running = true;
                        break;
                    }
                }
                triggerTimeArray.push({"running":running,"hexString": docs[i]._id.toHexString(), "displayString": moment(docs[i]._id.getTimestamp()).format('YYYY-MM-DD HH:mm:ss:SSS')});
            }
            result.triggerTimeArray = triggerTimeArray;
            callback(null, result);
        });
    }], function (err, result) {
        res.render('history', result);
    });

});

router.get('/triggerTimes/:release', function (req, res) {
    console.log(req.params.release);
    mongos.fetchBuildsByRelease(req.params.release, function (err, docs) {
        console.log(docs);
//            var str = docs[0].ObjectId.toHexString();
        var triggerTimeArray = [];
        for (var i = 0; i < docs.length; i++) {
            var running = false;
            for (var j = 0;j<docs[i].builds.length;j++){
                if(docs[i].builds[j].status == 'RUNNING'){
                    running = true;
                    break;
                }
            }
            triggerTimeArray.push({"running":running,"hexString": docs[i]._id.toHexString(), "displayString": moment(docs[i]._id.getTimestamp()).format('YYYY-MM-DD HH:mm:ss:SSS')});
        }
        res.status('200').json(triggerTimeArray);
    });
});

router.get('/triggerDetails/:release/:triggerTime', function (req, res) {
    console.log(req.params.release);
    console.log(req.params.triggerTime);
    mongos.fetchBuildDetails(req.params.release, req.params.triggerTime, function(err, docs){
        res.status('200').json(docs);
    });
});

module.exports = router;
