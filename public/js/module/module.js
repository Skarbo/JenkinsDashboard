define( ["jquery", "lib/util", "lib/event_handler"], function ( $, util, eventHandler ) {

    var Module = function ( id ) {
        this.id = id;
        this.$wrapper = null;
        this.categories = {};

        var self = this;
        eventHandler.on( "transition", function ( event, module, category, section ) {
            if ( id === module ) {
                self.doTransitionShow();
            }
            else {
                self.doTransitionHide();
            }
        } );
    };

    /**
     * @param {Category} category
     */
    Module.prototype.addCategory = function ( category ) {
        this.categories[category.id] = category;
    };

    Module.prototype.onData = function ( data ) {
        util.each( this.categories, function ( name, category ) {
            category.onData( data );
        } );
    };

    Module.prototype.doBuild = function ( $wrapper ) {
        util.each( this.categories, function ( name, category ) {
            category.doBuild( $wrapper );
        } );
    };

    Module.prototype.doTransitionShow = function ( transitionCount ) {

    };

    Module.prototype.doTransitionHide = function () {

    };

    return Module;

} );