"use strict";

var express = require( "express" ),
    request = require( "request" ),
    jenkins = {
        host: "http://cimagma.local/jenkins", // "http://localhost:8080", //
        jobs: {}
    },
    app = express(),
    port = 8082
    ;

// APP

app.use( express.static( __dirname + '/public' ) );

// Ajax
app.get( "/ajax", function ( req, res ) {

    // GET
    if ( req.query.get ) {
        var url = req.query.get;

        request( {
            method: 'GET',
            url: url
        }, function ( error, response, body ) {
            res.send( body );
        } );
    }
    // bad request
    else {
        res.writeHead( 400 );
    }
} );

// Jenkins
app.get( "/jenkins", function ( req, res ) {

    // job
    if ( req.query.job ) {
        retrieveJenkinsJob( req.query.job, function ( data ) {
            // emit jenkins data to all sockets
            io.sockets.emit( "jenkins", data );
        }, true );
        res.send( "Pulling Jenkins job: " + req.query.job );
    }
    // bad request
    else {
        res.writeHead( 400 );
    }

} );

// /APP

// SOCKETS

var io = require( 'socket.io' ).listen( app.listen( port ) );
console.log( "Listening on port '%s'", port );

io.sockets.on( "connection", function ( socket ) {

    socket.on( "jenkins", function ( job, callback ) {
        retrieveJenkinsJob( job, callback );
    } );

//    socket.emit( 'news', { hello: 'world' } );
//    socket.on( 'my other event', function ( data ) {
//        console.log( "My other event", data );
//    } );>
} );

// /SOCKETS

// FUNCTIONS

function retrieveJenkinsJob( job, callback, force ) {
    force = force || false;

    // jenkins job data cached
    if ( jenkins.jobs[job] || force ) {
        if ( callback ) {
            callback( { job: job, jenkins: jenkins.jobs[job]} );
        }
    }
    // retrieve jenkins job
    else {
        var url = jenkins.host + "/job/" + job + "/api/json?depth=3";

        request( {
            method: 'GET',
            url: url
        }, function ( error, response, body ) {
            if ( error || response.statusCode !== 200 ) {
                console.error( "Server.retrieveJenkinsJob( %s, ... ): %s, %s", job, error, response );
                callback( null );
                return;
            }

            // cache data
            jenkins.jobs[job];

            // call callback
            if ( callback ) {
                callback( { job: job, jenkins: JSON.parse( body ) } );
            }
        } );
    }
}

// /FUNCTIONS