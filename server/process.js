const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const request = require("request");
const params = require("watsonmodelparams");
const wml_credentials = new Map();

const mlInstanceId = params.mlInstanceId;
const apikey = params.apikey;
const scoring_url = params.scoring_url;
const options = params.options;
const fields = params.fields;

var iamToken;
var wmlToken;

function apiPost(payload, loadCallback, errorCallback){
	if(!wmlToken) {
        console.log("API not ready! Still preparing iam.");
        return -1;
    }
    
    const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", wmlToken);
	oReq.setRequestHeader("ML-Instance-ID", mlInstanceID);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

function sendPayload(dataArray) {
    const payload = "";

    apiPost(payload, function (resp) {
	    let parsedPostResponse;
	    try {
		    parsedPostResponse = JSON.parse(this.responseText);
	    } catch (ex) {
		    // TODO: handle parsing exception
	    }
	    console.log("Scoring response:");
	    console.log(parsedPostResponse);
    }, function (error) {
        console.log("Scoring error:");
	    console.log(error);
    });
}

function testPayloads() {
    //sendPayload(p1);
}

request.post(options, function(error, response, body)
{
    iamToken = JSON.parse(body)["access_token"];
    wmlToken = "Bearer " + iamToken;
    //testPayloads();
});

