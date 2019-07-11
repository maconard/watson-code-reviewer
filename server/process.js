require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = require("request");
const params = require("./watsonmodelparams");
const wml_credentials = new Map();

const mlInstanceID = params.mlInstanceId;
const apikey = process.env.apikey;
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

var sendPayload = function(dataArray) {
    const payload = '{"fields": ["maxLineLength", "avgLineLength", "avgParensPerLine", "maxParensPerLine", "avgParenSpaceBuffersPerLine", "avgPeriodsPerLine", "maxPeriodsPerLine", "avgComparisonsPerLine", "maxComparisonsPerLine", "avgSpacesPerLine", "maxSpacesPerLine", "avgTabsPerLine", "maxTabsPerLine", "avgIdentifiersPerLine", "maxIdentifiersPerLine"], "values": [[' + dataArray + ']]}';
    //console.log(dataArray);
    apiPost(payload, function (resp) {
	    let parsedPostResponse;
	    try {
		    parsedPostResponse = JSON.parse(this.responseText);
	    } catch (ex) {
        }
        console.log(payload);
        console.log(parsedPostResponse);
        var res = parsedPostResponse.values[0];
        console.log("\nScore: " + (res[17][0] >= .70 ? "Readable, " : "Not readable, ") + Math.round(res[17][0] * 1000,0.1)/10.0 + " points");
    }, function (error) {
        console.log("Scoring error:");
	    console.log(error);
    });
}

request.post(options, function(error, response, body)
{
    iamToken = JSON.parse(body)["access_token"];
    wmlToken = "Bearer " + iamToken;
});

