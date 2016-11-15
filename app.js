require('dotenv').config()
const express = require('express');
const duo_api = require('./duo_api/main');

var app = express(app);

app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;

var arr = [];

//Duo variables
var integrationKey = process.env.DUO_IKEY;
var secretKey = process.env.DUO_SKEY;
var host = process.env.DUO_HOST;

var date = new Date().toUTCString();
//172800 is two days in seconds. i.e get the authentications from the last 2 days. 
var mintime = Math.floor((new Date().getTime() / 1000) - 172800).toString();
var params = { 'mintime': mintime };
var jsonResult;

var client = new duo_api.Client(integrationKey, secretKey, host);

client.jsonApiCall(
    'GET', '/admin/v1/logs/authentication', params,
    function (res) {
        if (res.stat !== 'OK') {
            console.error('API call returned error: '
                + res.message);
                process.exit(1);
        }
                
        var duoData = res.response;        
        
        for (var i=0; i < duoData.length; i++) {
            duoData[i].timestamp = new Date(duoData[i].timestamp *1000).toString();            
        }
        
        jsonResult = duoData;
    })

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    var displayData = jsonResult;
    res.render('index', {
        displayData: displayData
    })
});

app.listen(port, () => {
    console.log(`running on port ${port}`)
});