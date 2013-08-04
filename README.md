# [eiyc][1] - Events In Your City

[![Build Status](https://travis-ci.org/caulagi/eiyc.png?branch=master)](https://travis-ci.org/caulagi/eiyc)

eiyc, pronouced eeeiiiccc is a webapp to allow people
to easily track what is happening in a city.  Anybody
can create a listing for free, and it will have some
social features like following.

Built with love using Nodejs and Mongodb.

## Dev setup

* Install mongodb

* Load data about cities and countries

        $ node data/loadCities.js

* Install dependencies and start node

        $ npm install
        $ nodemon server.js

## Tests
    
* Some basics tests at the moment

        $ npm test

## License

Licensed under [MIT][1]

[1]: https://github.com/caulagi/eiyc/blob/master/LICENSE
[2]: https://github.com/caulagi/eiyc/blob/master/CREDITS
[3]: http://eiyc.pw
