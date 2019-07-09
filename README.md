This is team `std::unique_ptr<Team>`'s IBM hackathon project!

To get it running locally:

1. Ask Michael Conard (conard@ibm.com) for an apikey to put in your local `server/localdev-config.json` file. Do not commit this file.
2. Run `npm install` and `npm install ibm-cloud-env` in the root directory to install node dependencies for the project.
3. Execute `./run-dev` to launch locally on `localhost:3000`, you may need to run `chmod +x run-dev`.

To deploy to IBM cloud run `ibmcloud dev deploy`. This is at `https://hackathonproject.us-south.cf.appdomain.cloud/` currently.
