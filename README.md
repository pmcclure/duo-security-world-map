# Duo Security World Map

Just a quick, basic node site that connects to your Duo Security Account via their API and displays a large world map (via Google GeoChart) with your most recent authentications. 

Duo does include a small map on their admin dashboard but you cannot hover over markers to found out info on the authentication attempt. 

This map on mouseover inlcudes location/username/Timestamp/IP/Method

### Prerequisites

You will need to include your Duo API credentials (host, integration key and secret key). You will have to create a file at the root of the project named '.env' with your variables.

```
DUO_HOST=*******.duosecurity.com
DUO_IKEY=*******************
DUO_SKEY=*******************
```

### Installing

clone the repo, add the .env file, npm install and simply run with node app.js