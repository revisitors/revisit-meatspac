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
