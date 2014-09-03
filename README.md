#Revisit Meatspac
This little project is an example express app that abides by the [revist.link spec.](http://revisit.link/spec.html) and posts an image to an instance of [Meatspaces](http://chat.meatspac.es)

##Installation:
 - `npm install -g nodemon`
 - `npm install`
 - `cp local.json-dist local.json`
 - fill out config params in local.json

##Usage:
 - `npm start`

The API provides a single `/service` endpoint to POST an image to, which posts
the image to meatspace and resonds with the image send in the request.

By default the app runs on port 8000, this can be configred in local.json.

Rate limiting is configured through local.json as well, with the following flags:
- `rate` - how many messages are allowed through (on average) in the `window`
- `burst` - the absolute maximum number of requests allowed through in `window`
- `window` - the time period under which request throttling is refreshed (in milliseconds)
