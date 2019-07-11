require("dotenv").config();
IBM_Cloud_IAM_uid = "bx";
IBM_Cloud_IAM_pwd = "bx";
apikey = process.env.apikey;
btoa = require("btoa");

module.exports = {
    mlInstanceId: "df542fb4-f3c6-47a6-8b8a-3e0632efb43c",
    scoring_url: "https://us-south.ml.cloud.ibm.com/v3/wml_instances/df542fb4-f3c6-47a6-8b8a-3e0632efb43c/deployments/d3c99ab0-252b-45e2-9e90-9d16e9450c85/online",
    apikey: apikey,
    options: { 
        url     : "https://iam.bluemix.net/oidc/token",
        headers : { 
            "Content-Type"  : "application/x-www-form-urlencoded",
            "Authorization" : "Basic " + btoa(IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd) 
        },
        body    : "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey" 
    },
    fields: {}
};
