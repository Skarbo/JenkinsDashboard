requirejs.config( {
    "baseUrl": "js/lib",
    "paths": {
        "app": "../app",
        "lib": "../lib",
        "vm": "../vm",
        "mdl": "../module",
        "model": "../model",
        "jquery": "external/jquery.2.0.0",
        "knockout": "external/knockout.2.3.0",
        "socketio": "../../socket.io/socket.io",
        "highcharts": "external/highcharts"
    }, shim: {
        "socketio": {
            exports: "io"
        },
        "jquery": {
            "exports": "$"
        },
        "knockout": {
            "exports": "ko"
        },
        "md5": {
            "exports": "md5"
        },
        "highcharts": {
            "exports": "Highcharts",
            "deps": [ "jquery" ]
        }
    }
} );

// Load the main app module to start the app
requirejs( ["app/main", "app/jenkins"] );