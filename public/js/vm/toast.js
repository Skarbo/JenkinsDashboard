define( ["jquery", "knockout"], function ( $, ko ) {

    return function ( toast ) {
        var self = this;
        self.toast = toast;

        var $_toastTemplate = $( "<template />", {
                "data-template": "toast",
                "data-bind": "template: { name: 'toast-template' }"
            } ),
            _timer = null,
            _timeout = 5000;

        self.show = function () {
            $( "body" ).append( $_toastTemplate );
            ko.applyBindings( self, $_toastTemplate[0] );
            $_toastTemplate.addClass( "visible" );

            clearTimeout( _timer );
            _timer = setTimeout( function () {
                self.hide();
            }, _timeout );
        };

        self.hide = function () {
            _timer = null;
            $_toastTemplate.removeClass( "visible" );
            setTimeout( function () {
                $_toastTemplate.remove();
            }, 500 );
        };
    }

} );