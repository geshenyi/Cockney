var express = require('express');
var http = require('http');
var rest = require('../node_modules/restler');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/trigger', function(req,res){
    console.log('in trigger');
    rest.post("http://int.testing.stubcorp.dev/jenkins/job/TestJenkinsApi/buildWithParameters",{data:{token:'testapi',testStringParam:'triggerNode'}}).on('complete',function(data,response){
        console.log(response.statusCode);
    });
    res.json({"message":"test"});
});

module.exports = router;
