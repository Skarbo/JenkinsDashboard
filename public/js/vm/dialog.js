define( ["jquery", "knockout"], function ( $, ko ) {

    return function ( header, contentTemplate, config ) {
        var self = this;
        self.header = header;
        self.contentTemplate = contentTemplate;
        $.extend( self, {
            closable: false
        }, config );

        var $_dialogTemplate = $( "<template />", {
            "data-template": "dialog",
            "data-bind": "template: { name: 'dialog-template' }"
        } );

        self.show = function () {
            $( "body" ).append( $_dialogTemplate );
            ko.applyBindings( self, $_dialogTemplate[0] );
            $_dialogTemplate.addClass( "visible" );

            if ( self.closable ) {
                $( "body" ).click( function ( event ) {
                    if ( $( event.target ).parents( "wrapper" ).length == 0 ) {
                        self.hide();
                    }
                } );
            }
        };

        self.hide = function () {
            $_dialogTemplate.removeClass( "visible" );

            setTimeout( function () {
                $_dialogTemplate.remove();
            }, 500 );
        };
    }

} );