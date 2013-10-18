/**
 * Module handler
 */
define( ["jquery", "lib/util", "lib/event_handler"], function ( $, util, eventHandler ) {

    var ModuleHandler = function () {
        this.modules = {};
        this.moduleSelected = null;
        this.$wrapper = null;
    }

    ModuleHandler.prototype.addModule = function ( name, module ) {
        if ( !this.$wrapper ) {
            console.error( "ModuleHandler.addModule: Wrapper not given" );
            return;
        }

        this.modules[name] = module;

        // BUILD

        var $moduleWrapper = $( "<div />", {
            "class": "module_wrapper",
            "data-module": name
        } );

        module.doBuild( $moduleWrapper );

        this.$wrapper.append( $moduleWrapper );

        // /BUILD

        // fire module add event
        eventHandler.fire( "module", "add", name, module );
    };

    ModuleHandler.prototype.doBuild = function ( $wrapper ) {
        this.$wrapper = $wrapper;
    };

    ModuleHandler.prototype.doTransitionTick = function ( callback ) {

    };

    return new ModuleHandler();

} );