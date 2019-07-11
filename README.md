This is team `unique_ptr<Team> m_OurTeam`'s IBM hackathon project!

Ask Michael Conard (conard@ibm.com) for an apikey to put in your local `server/localdev-config.json` and '.env' files. You can run `./setup_local` to generate these files. Do not commit these files.

Linux:

1. Run `npm install` and `npm install ibm-cloud-env` in the root directory to install node dependencies for the project. There may be other dependencies, just install them as they're needed.
2. Execute `./run-dev` or `npm run dev` to launch locally on `localhost:3000`, you may need to run `chmod +x run-dev`.

Mac:

1. Run `ibmcloud dev build` to build Docker images
2. Execute `ibmcloud dev run` to launch on `localhost:3000`.

To deploy to IBM cloud run `ibmcloud dev deploy` or `ibmcloud app push`, whatever works for your platform. 
This is hosted at `https://hackathonproject.us-south.cf.appdomain.cloud/` currently.
