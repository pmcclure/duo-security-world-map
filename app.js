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
var twoDaysInSeconds = 172800;
var mintime = Math.floor((new Date().getTime() / 1000) - twoDaysInSeconds).toString();
var params = { 'mintime': mintime };
var client = new duo_api.Client(integrationKey, secretKey, host);
var duoData = [];


function getDuoData() {
    client.jsonApiCall('GET', '/admin/v1/logs/authentication', params, function (res) {
    if (res.stat !== 'OK') {
        console.error('API call returned error: '
            + res.message);
        process.exit(1);
    }

    jsonResult = res.response;
    
    for (var i = 0; i < jsonResult.length; i++) {
        jsonResult[i].timestamp = new Date(jsonResult[i].timestamp * 1000).toString();
    }

    duoData = jsonResult;    
})
}

getDuoData();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    getDuoData();
    var displayData = duoData;

    res.render('index', {
        displayData: duoData
    })
});

app.listen(port, () => {
    console.log(`running on port ${port}`)
});