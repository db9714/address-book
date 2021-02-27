var backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "uam-dev-deployment.s3-website-us-east-1.amazonaws.com") {
  backendHost = "https://portal-api-stg.uppercampus.cloud/";
} else if (hostname === "uam-qa-deployment.s3-website-us-east-1.amazonaws.com") {
  backendHost = "https://portal-api-stg.uppercampus.cloud/";
} else if (hostname === "uam-staging-deployment.s3-website-us-east-1.amazonaws.com") {
  backendHost = `https://portal-api-stg.uppercampus.cloud/`;
} else if (hostname === "university.uppercampus.com") {
  backendHost = `https://portalapi.uppercampus.cloud/`;
} else {
  backendHost = `http://localhost:5000/`;
}

export const API_URL = `${backendHost}`;
