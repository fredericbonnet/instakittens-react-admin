# Instakittens React administration interface

This project implements an administration interface for the [Instakittens
project](https://github.com/fredericbonnet/instakittens).

It is based on the awesome [React-admin](https://github.com/marmelab/react-admin/) framework that lets you build admin web apps on top of REST/GraphQL APIs very rapidly.

It connects to the [Instakittens JSON Server](https://github.com/fredericbonnet/instakittens-json-server) backend on port 3000.

## NPM Scripts

### Serving the app

Start the development server on port 3001:

```sh
npm run start
```

### Unit tests

Run Jest unit tests in watch mode:

```sh
npm run test
```

### End-to-end tests

End-to-end tests need a running development server on port 3001.

#### Puppeteer

Run Puppeteer tests once:

```sh
npm run e2e
```

Run Puppeteer tests in watch mode:

```sh
npm run e2e:watch
```

Run Puppeteer Cucumber scenarios once:

```sh
npm run cucumber
```

Run Puppeteer Cucumber scenarios in watch mode:

```sh
npm run cucumber:watch
```

#### Playwright

Run Playwright tests once:

```sh
npm run e2e-playwright
```

Run Playwright tests in watch mode:

```sh
npm run e2e-playwright:watch
```

Run Playwright Cucumber scenarios once:

```sh
npm run cucumber-playwright
```

Run Playwright Cucumber scenarios in watch mode:

```sh
npm run cucumber-playwright:watch
```

#### Cypress

Run Cypress tests & scenarios once:

```sh
npm run cypress:run
```

Open Cypress GUI:

```sh
npm run cypress:open
```

#### TestCafé

Run TestCafé tests & scenarios once:

```sh
npm run testcafe
```

Run TestCafé tests & scenarios in watch mode:

```sh
npm run testcafe:watch
```

#### CodeceptJS

Run CodeceptJS tests & scenarios once:

```sh
npm run codeceptjs
```

Run CodeceptJS tests & scenarios in watch mode:

```sh
npm run codeceptjs:watch
```

## Project bootstrap

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) along with the React-Admin dependencies.

```sh
create-react-app instakittens-react-admin
cd instakittens-react-admin
npm install react-admin ra-data-json-server prop-types
```

The app's default port 3000 has been changed to 3001 in the [.env](.env) file.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
