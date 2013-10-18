define( ["jquery", "highcharts", "lib/event_handler", "mdl/handler", "vm/dialog", "vm/toast"], function ( $, Highcharts, eventHandler, moduleHandler, DialogVM, ToastVM ) {

    var self = this;

    console.log( "Main App loaded" );

    var loadingDialog = new DialogVM( "Loading data", "loading-content-template" );

    // EVENT HANDLER

    // toast
    eventHandler.on( "toast", function ( event, message ) {
        (new ToastVM( message )).show();
    } );

    // module
    eventHandler.on( "module", function ( event, type, name, module ) {
        switch ( type ) {
            case "add":
                loadingDialog.hide();
                _transitionTick();
                _transitionStart();
                break;
        }
    } );

    eventHandler.on( "transition", function () {
        console.log( "on transition", arguments );
    } );

    // /EVENT HANDLER

    var $wrapper = $( "body #wrapper" );

    // build module handler
    moduleHandler.doBuild( $wrapper );

    // show loading dialog
    loadingDialog.show();

    var _transitions = [
            ["jenkins", "builds24hours", "chartbuild"],
            ["jenkins", "builds24hours", "culpritsbuild"],
            ["jenkins", "builds2days", "chartbuild"],
            ["jenkins", "builds2days", "culpritsbuild"],
            ["jenkins", "week", "chartbuild"],
            ["jenkins", "week", "culpritsbuild"],
            ["jenkins", "month", "chartbuild"],
            ["jenkins", "month", "culpritsbuild"]
        ],
        _transitionCount = 0,
        _transitionTick = function () {
            var _transition = _transitions[_transitionCount++ % _transitions.length];
            console.log( "Transition interval", _transition )
            eventHandler.fire( "transition", _transition[0], _transition[1], _transition[2] );
        },
        _transitionStart = function () {
            setInterval( _transitionTick, 5000 );
        };

} );