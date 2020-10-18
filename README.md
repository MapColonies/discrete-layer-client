# discrete-layers-client

React app written in typescript to define manage and browse discrete layers image catalog.<br/>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Bring all dependencies

```
yarn
```

## Available Scripts

In the project directory, you can run:

### `yarn run confd:prod`

Generates (MUST)

```
public/env-config.js
```

due to env variables or use defaults if not defined.<br />

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Make sure to build all the dependencies before running this command (mc-react-components)**

Any relative request is proxied to the backend.<br/>
you can control the host by editing the package.json file.

```json
{
  "proxy": "http://localhost:8000"
}
```

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `Update configuration inside the docker`

In Docker run following in order to propregate ENV vars to clients

```
node ./confd/generate-config.js --environment production --indocker
```

Be sure that it runs from this location /usr/share/nginx/html
