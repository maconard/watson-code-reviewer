const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const request = require("request");
const wml_credentials = new Map();
const ml_instance_id = "df542fb4-f3c6-47a6-8b8a-3e0632efb43c";
const apikey = require("./apikey.js");
const IBM_Cloud_IAM_uid = "bx";
const IBM_Cloud_IAM_pwd = "bx";
var iam_token;
var options = { 
    url     : "https://iam.bluemix.net/oidc/token",
    headers : { 
        "Content-Type"  : "application/x-www-form-urlencoded",
        "Authorization" : "Basic " + btoa( IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd ) 
    },
    body    : "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey" 
};


function apiPost(scoring_url, token, mlInstanceID, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", token);
	oReq.setRequestHeader("ML-Instance-ID", mlInstanceID);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

function sendPayload(dataArray) {
    const wmlToken = "Bearer " + iam_token;
    //console.log("wmlToken: " + wmlToken);

    const mlInstanceId = ml_instance_id;

    const payload = '{"fields": ["COLUMN2", "COLUMN3", "COLUMN4", "COLUMN5", "COLUMN6", "COLUMN7", "COLUMN8", "COLUMN9", "COLUMN10", "COLUMN11", "COLUMN12", "COLUMN13", "COLUMN14", "COLUMN15", "COLUMN16", "COLUMN17", "COLUMN18", "COLUMN19", "COLUMN20", "COLUMN21", "COLUMN22", "COLUMN23", "COLUMN24", "COLUMN25", "COLUMN26", "COLUMN27", "COLUMN28", "COLUMN29", "COLUMN30", "COLUMN31", "COLUMN32", "COLUMN33", "COLUMN34", "COLUMN35", "COLUMN36", "COLUMN37", "COLUMN38", "COLUMN39", "COLUMN40", "COLUMN41", "COLUMN42", "COLUMN43", "COLUMN44", "COLUMN45", "COLUMN46", "COLUMN47", "COLUMN48", "COLUMN49", "COLUMN50", "COLUMN51", "COLUMN52", "COLUMN53", "COLUMN54", "COLUMN55", "COLUMN56", "COLUMN57", "COLUMN58", "COLUMN59", "COLUMN60", "COLUMN61", "COLUMN62", "COLUMN63", "COLUMN64", "COLUMN65", "COLUMN66", "COLUMN67", "COLUMN68", "COLUMN69", "COLUMN70", "COLUMN71", "COLUMN72", "COLUMN73", "COLUMN74", "COLUMN75", "COLUMN76", "COLUMN77", "COLUMN78", "COLUMN79", "COLUMN80", "COLUMN81", "COLUMN82", "COLUMN83", "COLUMN84", "COLUMN85", "COLUMN86", "COLUMN87", "COLUMN88", "COLUMN89", "COLUMN90", "COLUMN91", "COLUMN92", "COLUMN93", "COLUMN94", "COLUMN95", "COLUMN96", "COLUMN97", "COLUMN98", "COLUMN99", "COLUMN100", "COLUMN101", "COLUMN102", "COLUMN103", "COLUMN104", "COLUMN105", "COLUMN106"], "values": [' + dataArray  + ']}';

    const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/df542fb4-f3c6-47a6-8b8a-3e0632efb43c/deployments/51b3165a-c3fd-4f37-ae19-c7deba03d179/online";

    apiPost(scoring_url, wmlToken, mlInstanceId, payload, function (resp) {
	    let parsedPostResponse;
	    try {
		    parsedPostResponse = JSON.parse(this.responseText);
	    } catch (ex) {
		    // TODO: handle parsing exception
	    }
	    console.log("Scoring response");
	    console.log(parsedPostResponse);
    }, function (error) {
	    console.log(error);
    });
}

function testPayloads() {

    //var p1 = [0.715385,0,5.400966,12,0,0.084615,1,11.225455,45,0,5.142308,45,37,0.894737,0,1,0,0.18,0.14,0.4,0.022727,0,5.497409,0,9.046512,0.348837,43.627907,0,4.837209,0.72093,0.32,0.92,1.488372,9.302326,26,46,1,76,11,9,445,27,4.642231,2608.622111,50,50,50,51,1,1,50,50,50,1,50,50,50,45,50,50,0,0,75.960784,49.74026,75.941176,49.74026,75.960784,49.896104,75.960784,49.753247,0,0,75.941176,49.727273,0,0.542327,0.032769,0.004915,0.084107,0,0.118514,0,0,0,0,0,0,0.060423,0.009063,0.155086,0,0.21853,0.15,2.566667,0,3.616667,17.111111,0,24.111111,0,1.409091,0,88,121,0,0.6,0,6.333333,8,4,0.4,2,0.857143,4,100,2.8,9,2,1,0,0,0,0,0.222222,0.166667,0.5,0,6,0,4,0.5,13.75,0,1.25,0,0,0.166667,0,1.5,10,8,1,34,4,0,60,3,3.939665,36.541209,9,1,6,1,1,1,6,6,6,1,6,1,1,6,1,6,52.2,8.881356,58,8.966102,58,8.898305,0,0,0,0,0,0,58,8.915254,0.680233,0.139535,0.046512,0,0,0,0.02907,0.205128,0.068376,0,0,0,0.042735,0.333333,0,0,0,0.208333,0,0,0,0.625,0,0,0,0,0,0,0,0,1];

    //sendPayload(p1);
}

request.post( options, function( error, response, body )
{
    iam_token = JSON.parse( body )["access_token"];
    //console.log("iam_token: " + iam_token);
    testPayloads();
});

