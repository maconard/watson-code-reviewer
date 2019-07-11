IBM_Cloud_IAM_uid: "bx",
IBM_Cloud_IAM_pwd: "bx",
apikey: require("./apikey.js"),

module.exports = {
    mlInstanceId: "df542fb4-f3c6-47a6-8b8a-3e0632efb43c",
    scoring_url = "",
    apikey: apikey,
    options = { 
        url     : "https://iam.bluemix.net/oidc/token",
        headers : { 
            "Content-Type"  : "application/x-www-form-urlencoded",
            "Authorization" : "Basic " + btoa(IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd) 
        },
        body    : "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey" 
    },
    fields: {}
};
