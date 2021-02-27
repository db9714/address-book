var backendHost;

const hostname = window && window.location && window.location.hostname;
if (hostname === "localhost") backendHost = `http://localhost:5000/`;
else backendHost = ``;

export const API_URL = `${backendHost}`;
