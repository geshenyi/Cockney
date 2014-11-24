var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

module.exports = router;

var a = [
    {
        jobname: "sellapi",
        jenkinsname: "com.stubhub.tests-sell-integrationtests-apismoketest-Production",
        defaultparams: {
            eventId: "4341863",
            POOL: "",
            gatewayPool: 'srwd10'
        }},
    {
        jobname: "buyapi",
        jenkinsname: "Buy-APIs-Smoke-Test-Production",
        defaultparams: {
            EventId: "4371724",
            EventIdV2: "4371732",
            AddDiscount: "no",
            Payment: "creditcard",
            Checkout: "yes",
            gateway: "",
            smoketest_v1: "true",
            smoketest_v2: "true"
        }},
    {
        jobname: "fulfillmentapi",
        jenkinsname: "fulfillment-main-api-prod-smoketesting",
        defaultparams: {
            eventId: "9040429",
            poolType: ""
        }},
    {
        jobname: "socialapi",
        jenkinsname: "socialdomain-production-smoketests",
        defaultparams: {
            pool: ""
        }},
    {
        jobname: "usui",
        jenkinsname: "com.stubhub.tests-pb_prod_smoke-integrationtests-smoketest-production",
        defaultparams: {
            pool: "",
            site: "US",
            poolType: "qa",
            browser: "chrome",
            openReportInBrowser: "firefox",
            sellticket: "false",
            checkout: "false",
            listingId: "",
            ups: "true",
            newpdf: "true",
            aeg: "true",
            cstools: "true",
            eventdisplay: "true",
            searchevents : "true",
            abl : "true",
            cswebtool : "true",
            sfr : "true",
            sfr3 : "true",
            checkcc : "false",
            pdf: "false",
            reRunTimes: "0",
            browserVersion: "26.0",
            pageLoadTimeout: "",
            isCanaryTest: ""
        }},
    {
        jobname: "ukui",
        jenkinsname: "com.stubhub.tests-pb_prod_smoke-integrationtests-smoketest-production-uk",
        defaultparams: {
            pool: "",
            site: "UK",
            poolType: "qa",
            browser: "chrome",
            openReportInBrowser: "firefox",
            sellticket: "false",
            checkout: "false",
            listingId: "",
            ups: "true",
            pdf: "true",
            abl: "true",
            browserVersion: "27.0",
            pageLoadTimeout: "",
            isCanaryTest: ""
        }}
];