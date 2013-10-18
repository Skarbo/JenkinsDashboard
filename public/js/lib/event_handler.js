define( ["lib/util"],
    function ( util ) {

        "use strict";

        var eventHandlers = {},
            tokenLast = -1;

        /**
         * Attach an event handler function for given event.
         * @param event Event type.
         * @param handler A function to execute when the event is fired. (function(event [,arguments])
         * @param [priority] Priority for given event handler. Highest priority are fired first. Default 0.
         * @returns {string} An unique token for given event handler.
         */
        function on( event, handler, priority ) {
            priority = priority || 0;
            if ( !eventHandlers[event] ) {
                eventHandlers[event] = {};
            }
            if ( !eventHandlers[event][priority] ) {
                eventHandlers[event][priority] = {};
            }
            var token = (++tokenLast).toString();
            eventHandlers[event][priority][token] = {
                token: token,
                handler: handler,
                event: event,
                priority: priority
            };
            return token;
        }

        /**
         * Remove and event handler.
         * @param token Unique event handler token.
         * @returns {boolean} True if event handler exists and is removed.
         */
        function off( token ) {
            for ( var event in eventHandlers ) {
                if ( eventHandlers.hasOwnProperty( event ) ) {
                    for ( var priority in eventHandlers[event] ) {
                        if ( eventHandlers[event].hasOwnProperty( priority ) && eventHandlers[event][priority].hasOwnProperty( token ) ) {
                            delete eventHandlers[event][priority][token];
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /**
         * Execute all handlers for given event type.
         * @param event Event type.
         * @returns {boolean} True if one or more event handler is executed.
         */
        function fire( event ) {
            var args = Array.prototype.slice.call( arguments, 1 );
            /*jshint validthis:true */
            var context = this;
            if ( !eventHandlers[event] ) {
                return false;
            }
            var keys = util.objectKeys( eventHandlers[event] );
            keys.sort( function ( a, b ) {
                return b - a;
            } );
            for ( var i in keys ) {
                if ( keys.hasOwnProperty( i ) && eventHandlers[event].hasOwnProperty( keys[i] ) ) {
                    for ( var token in eventHandlers[event][keys[i]] ) {
                        if ( eventHandlers[event][keys[i]].hasOwnProperty( token ) ) {
                            var eventHandlerObject = eventHandlers[event][keys[i]][token];
                            var eventObject = {
                                token: eventHandlerObject.token,
                                event: eventHandlerObject.event,
                                priority: eventHandlerObject.priority
                            };
                            eventHandlerObject.handler.apply( context, [eventObject].concat( args ) );
                        }
                    }
                }
            }

            return true;
        }

        return {
            on: on,
            off: off,
            fire: fire
        }

    } )
;