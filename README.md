# likecoin-button
[![CircleCI](https://circleci.com/gh/likecoin/likecoin-button.svg?style=svg)](https://circleci.com/gh/likecoin/likecoin-button)
[![Greenkeeper badge](https://badges.greenkeeper.io/likecoin/likecoin-button.svg)](https://greenkeeper.io/)

> Link based LikeButton on firebase functions + hosting

## Introduction
For introduction ot LikeCoin button, please refer to [user guide](https://docs.like.co/user-guide/likecoin-button) here.

## Documentation
Please refer to [developer guide](https://docs.like.co/developer/likecoin-button) and [integration guide](https://github.com/likecoin/LikeCoinButton-integration).

## Folder structure
```bash
├── functions
│   ├── dist # auto generated dist ver by babel
│   ├── modules # aux helpers
│   ├── nuxt # auto generated nuxt directory
│   ├── ssrapp.js # handle nuxt SSR logic
│   └── index.js # import all other functions
├── public_base # public static content, will be merged with nuxt build
├── public # auto generated static content folder from nuxt and public_base
├── src # Actualy nuxt project, where development should happen
├── .firebaserc # define firebase project
└── firebase.json # firebase related settings
```
## Dev Setup

``` bash
# switch to nuxt project directory
$ cd src

# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```

## Deploy

``` bash
# deploy everything
$ firebase deploy
```

