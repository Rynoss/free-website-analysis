# Free Website Analysis Site
## Free Website Analysis site that billing uses at https://free.rynoss.com
<img src="https://img.shields.io/badge/Version-1.0.0.b2-blue.svg" />

Site used by billing to pull in potential leads for RYNOss.


### Deployment Commands
Deploy Serverless Configuration: sls deploy -s dev (or prod)
Deploy Static Site Elements: npm run deploy -s dev (or prod)


### Setup Serverless Enviroment
npm install -g serverless
Access AWS Account and create an IAM account to get access to deploy
serverless config credentials --provider aws --key {KEY} --secret {SECRET}
