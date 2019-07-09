This is team `unique_ptr<Team> m_OurTeam`'s IBM hackathon project!

Linux:

1. Ask Michael Conard (conard@ibm.com) for an apikey to put in your local `server/localdev-config.json` file. Do not commit this file.
2. Run `npm install` and `npm install ibm-cloud-env` in the root directory to install node dependencies for the project.
3. Execute `./run-dev` to launch locally on `localhost:3000`, you may need to run `chmod +x run-dev`.

Mac:
1. Ask Michael Conard (conard@ibm.com) for an apikey to put in your local `server/localdev-config.json` file. Do not commit this file.
2. Run `ibmcloud dev build` to build Docker images
3. Execute `ibmcloud dev run` to launch on `localhost:3000`.

To deploy to IBM cloud run `ibmcloud dev deploy` or `ibmcloud app push`, whatever works for your platform. 
This is hosted at `https://hackathonproject.us-south.cf.appdomain.cloud/` currently.
