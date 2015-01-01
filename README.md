# [hattira][1] - events around you

[![Build Status](https://travis-ci.org/caulagi/sntd.png?branch=master)](https://travis-ci.org/caulagi/sntd)

hattira - Events around you - is a webapp to allow people
to easily discover what is happening in a city.  The key
words are easy and discover.  The existing solutions
feel like a 800 pound gorilla.  I wanted instead
a simple solution that does two things -

 * Find in a glance what is happening in a city.
 * Create an event as an organizer in less than a minute.
 
Did I succeed?  Let me know!

![Hattira screenshot](https://farm3.staticflickr.com/2922/14050802727_99c35fe33c_b.jpg)

## Dev setup

* Install mongodb and nodejs

* GO!

        $ sudo npm install -g yo bower grunt-cli
        $ npm install && bower install
        $ grunt serve

## Tests
    
* Some basics tests at the moment

        $ grunt test

#### History

Ah, so you noticed the mismatch between the repo name and
the project?  We started the project as sntd for 
Something New To Do.  But it was a hard name, and I had to
repeat it multiple times for people to grok it.  So I just
choose a name in a language you probably don't know.  It should
now be super simple to understand what I am talking about.  Hattira!

[1]: http://hattira.com
