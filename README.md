# likecoin-button

> Link based LikeButton on firebase functions + hosting

## Folder structure
```bash
├── functions
│   ├── dist # auto generated dist ver by babel
│   ├── modules # aux helpers
│   ├── nuxt # auto generated nuxt directory
│   ├── ssrapp.js # handle nuxt SSR logic
│   └── index.js # import all other functions
├── public # public static content, will be merged with nuxt build
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

