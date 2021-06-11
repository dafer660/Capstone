# Udacity Capstone Frontend using ReactJS

------------

## Introduction

With this front end you should be able to:

- View the ``Homepage`` and ``About`` page without authentication.
- Authentication is done using [Auth0](https://auth0.com/).
- If authenticated, you should be able to access he ``Data`` tab in the Toolbar.
- The Data tab has 4 items, ``Agents``, ``Actors``, ``Categories`` and ``Movies``.
- According to the role, you will be able to perform actions, such as, ``view``, ``create``, ``update`` or ``delete`` records.
- There are 3 main roles using ``RBAC`` in [Auth0](https://auth0.com/):
    - **Casting Assistant**:
        - ``view`` Actors, Agents, Categories and Movies;
    - **Casting Director**:
        - ``view`` Actors, Agents, Categories and Movies;
        - ``create`` Actors and Agents;
        - ``update`` Actors, Agents and Movies;
        - ``delete`` Actors and Agents;
    - **Executive Producer**:
        - has all permissions.

## Pre-requisites and Local Development

Developers using this project should already have Node, installed on their local machines.

### Installing Dependencies

##### Node JS

Download and install [Node](https://nodejs.org/en/download/). Also check the guides for your own platform/OS.

##### Project Dependencies

From the front end folder run ``npm install``. All required packages are included in the ``package.json`` file.

#### Key Dependencies

- [Auth0 ReactJS SDK](https://auth0.com/docs/quickstart/spa/react) easy to integrate Auth0 API into ReactJS.
- [Material UI](https://material-ui.com/getting-started/installation/) for some easier styling and good looking components out of the box.
- [express](http://expressjs.com/en/starter/installing.html) in order to run our front end in Production (in Heroku).
- [jwt-decode](https://github.com/auth0/jwt-decode) library from Auth0 to decode our JWT tokens from Auth0.
- [moment](https://www.npmjs.com/package/moment/v/1.1.0) to handle dates.
- [react-paginate](https://www.npmjs.com/package/react-paginate) handles pagination.
- [react-router-dom](https://www.npmjs.com/package/react-router-dom) for navigation in our SPA.
- [webpack-cli](https://www.npmjs.com/package/webpack-cli/v/3.3.0)

## Running the Server

Throughout the app, all the ``fetch`` requests are done using an environment variable, ``REACT_APP_API_URL``.

### Development

Create a ``.env`` file and add the line ``REACT_APP_API_URL=http://localhost:5000``.

To run the local server, simply run from the console in the root folder ``npm run dev``, then a window should open on [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

### Production

When you deploy into production, it will be easier to setup by adding a ``Config Var`` to the React Application in Heroku.
Simply run ``heroku config:set REACT_APP_API_URL=<API URL>``. Amend the API URL according to your Backend API URL that you created in Heroku.

Take note on the version of ``node`` in ``package.json`` file:
````json
  "engines": {
    "node": "14.x"
  },
````
Also in the ``package.json`` file, make changes under ``scripts`` according to your liking, but be sure to leave ``heroku-postbuild`` which will handle our server to start:
````json
  "scripts": {
    "dev": "react-scripts start",
    "start": "node server.js",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "heroku-postbuild": "npm install && npm run build"
  },
````

Make sure you have the ``server.js`` file in the root folder, which will run your react application using express:
````js
const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000

// make sure you amend the path.
// in this case the react application will be packaged in the build directory
// we use '/*' so that we don't get the typical error "Cannot GET"
app.use(express.static(path.join(__dirname, '/build')))
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(port, () => console.log("Listening on Port", port))
````

Also create a ``Procfile`` with the following line ``web: npm run start`` which will start our express server.

To run the server you need to commit the root folder to Heroku:
- ``git init`` - if you haven't done so.
- ``git add .`` - this will add all the files not in .gitignore file to be ready to be pushed to the repo.
- ``git commit -m "1st commit."`` - commit the files to the repo.
- ``git push heroku master`` - pushed the files and builds the react application.

###### NOTES:
- you can create a ``static.json`` file with your needs. [follow or read this documentation](https://github.com/mars/create-react-app-buildpack#web-server) for more details.

