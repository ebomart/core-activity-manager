# Core Activity Manager

Use of this APP:

- is to Create Activity Template and publish it to various outlets.
- Once Acitivities are created, it can be completed by end users having required roles.
- if the activity is not completed till expiry time of activity, the activity will marked as LAPSED and no further action can be taken on that acitivity.

Application for better compatibility needs to run with:

### Install Project Dependencies

To be able to run the application properly you need to execute the
following commands:

    $ npm i

### Run Console Commands

In order to run your application service
you can use any of this:

Run Unit Tests:
$ npm run test:unit

To start service on your local machine you may use
$ npm run start

To run lint fixing you may use
$ npm run link:fix

## ENV variables needed to run this APP

- DB_USER=postgres
- DB_PASSWORD=mysecretpassword
- DB_NAME=postgres
- DB_HOST=localhost
- DB_PORT=54320
- NODE_ENV=dev
- PORT=4444
