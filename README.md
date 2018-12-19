
## Installation via docker image
link to hub.docker [image](https://hub.docker.com/r/siomask/slate_task)
[demo](http://206.189.178.244:3000)
```bash
$ docker pull siomask/slate_task:order_payment_db
$ docker run -p 27017:27017 -d order_payment_db
$ docker pull siomask/slate_task:order_payment_app
$ docker run -p 3000:3000 siomask/slate_task:order_payment_app
```
if you not trust to this image tags or it seems lot of installing just
clone this repo and run `docker-compose up`


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
