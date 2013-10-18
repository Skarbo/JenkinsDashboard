define( ["jquery", "lib/util", "lib/event_handler"], function ( $, util, eventHandler ) {

    var Section = function ( id, category ) {
        this.id = id;
        this.category = category;
        this.$wrapper = null;

        var self = this;
        eventHandler.on( "transition", function ( event, module, category, section ) {
            if ( /*self.category.module.id === module && self.category.id === category &&*/ id === section ) {
                self.doTransitionShow();
            }
            else {
                self.doTransitionHide();
            }
        } );

    }

    /**
     * @returns {Object} {seconds: number, transitions: number}
     */
    Section.prototype.getTransition = function () {
        return {
            seconds: 5,
            transitions: 1
        };
    };

    Section.prototype.onData = function ( data ) {

    };

    Section.prototype.doBuild = function ( $wrapper ) {
        this.$wrapper = $wrapper;
    }

    Section.prototype.doTransitionShow = function ( transitionCount ) {

    };

    Section.prototype.doTransitionHide = function () {

    };

    return Section;

} );