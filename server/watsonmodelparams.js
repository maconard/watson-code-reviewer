require("dotenv").config();
IBM_Cloud_IAM_uid = "bx";
IBM_Cloud_IAM_pwd = "bx";
apikey = process.env.apikey;
btoa = require("btoa");

module.exports = {
    mlInstanceId: "4f507160-a2b5-4f76-a6aa-7265feff21ab",
    scoring_url: "https://us-south.ml.cloud.ibm.com/v3/wml_instances/4f507160-a2b5-4f76-a6aa-7265feff21ab/deployments/5882e7f9-4bd9-490d-bda3-217ca8860285/online",
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
