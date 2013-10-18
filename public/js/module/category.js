define( ["jquery", "lib/util", "lib/event_handler"], function ( $, util, eventHandler ) {

    var Category = function ( id, module ) {
        this.id = id;
        this.module = module;
        this.$wrapper = null;
        this.sections = {};

        var self = this;
        eventHandler.on( "transition", function ( event, module, category, section ) {
            if ( /*self.category.module.id === module &&*/ id === category ) {
                self.doTransitionShow();
            }
            else {
                self.doTransitionHide();
            }
        } );
    };

    /**
     * @returns {number} Number of seconds to be displayed in transition
     */
    Category.prototype.getTransitionSeconds = function () {
        return 5;
    };

    /**
     * @returns {number} Number of transitions in section
     */
    Category.prototype.getTransitionCount = function () {
        var count = 0;
        util.each( this.sections, function ( section ) {
            count += section.getTransitionCount();
        } );
        return count;
    };

    /**
     * @param {Section} section
     */
    Category.prototype.addSection = function ( section ) {
        this.sections[section.id] = section;
    }

    Category.prototype.onData = function ( data ) {
        util.each( this.sections, function ( name, section ) {
            section.onData( data );
        } );
    };

    Category.prototype.doBuild = function ( $wrapper ) {
        util.each( this.sections, function ( name, section ) {
            section.doBuild( $wrapper );
        } );
    };

    Category.prototype.doTransitionShow = function ( transitionCount ) {

    };

    Category.prototype.doTransitionHide = function () {

    };

    return Category;

} );