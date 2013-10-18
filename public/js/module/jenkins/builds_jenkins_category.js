define( [ "knockout", "lib/util", "mdl/category", "./chartbuild_jenkins_section", "./culpritsbuild_jenkins_section", "lib/event_handler" ], function ( ko, util, Category, ChartbuildJenkinsSection, CulpritsbuildJenkinsSection, eventHandler ) {

    BuildsJenkinsCategory.prototype = new Category();

    function BuildsJenkinsCategory( id, module, config ) {
        console.log( "BUILDSJENKINS", id, module );
        Category.apply( this, [ id, module ] );

        this.config = util.merge( {
            date: {
                from: new Date().set( {hour: 00, minute: 00} ).moveToFirstDayOfMonth(),
                to: new Date().set( {hour: 23, minute: 59} ).moveToLastDayOfMonth(),
                interval: 3600 * 1000 * 24 // day
            }
        }, config );

        this.$template = null;
        this.jenkins = null;
        this.jenkinsBuilds = null;
        this.jenkinsStats = null;
        this.jenkinsStatsDate = null;

        this.viewModel = {
            stats: ko.observableArray( [] ),
            title: ko.observable( "" ),
            subtitle: ko.observable( "" )
        };

        this.doInit();
    };

    // ... VARIABLES

    BuildsJenkinsCategory.DATE_TYPE = {
        MONTH: "month",
        WEEK: "week",
        TWOWEEK: "twoweek",
        DAY: "day",
        TWODAYS: "days"
    };

    // ... /VARIABLES

    // ... ON

    BuildsJenkinsCategory.prototype.onData = function ( jenkins ) {
        this.jenkins = jenkins;
        this.doData();

        Category.prototype.onData.call( this, jenkins );
    };

    // ... /ON

    // ... DO

    BuildsJenkinsCategory.prototype.doInit = function () {
        var configChart = {};

        this.addSection( new ChartbuildJenkinsSection( "chartbuild", this, this.config ) );
        this.addSection( new CulpritsbuildJenkinsSection( "culpritsbuild", this, this.config ) );
    };

    BuildsJenkinsCategory.prototype.doBuild = function ( $wrapper ) {
        this.$template = $( "<div />", {
            "data-template": "builds-jenkins",
            "data-transition": "",
            "data-bind": "template: { name: 'builds-jenkins-template' }"
        } );

        ko.applyBindings( this.viewModel, this.$template[0] );

        $wrapper.append( this.$template );

        var $dataContainer = this.$template.find( "[data-container='builds']" );

        if ( $dataContainer.length == 0 ) {
            console.error( "DoBuild: Data container not found in template" );
            return;
        }

        Category.prototype.doBuild.call( this, $dataContainer );
    };

    BuildsJenkinsCategory.prototype.doTransitionShow = function ( transitionCount ) {
        console.log( "BuildsJenkinsCategory.doTransitionShow" );
        if ( this.$template ) {
            this.$template.attr( "data-transition", "horizontal_in" );
        }
    };

    BuildsJenkinsCategory.prototype.doTransitionHide = function () {
        if ( this.$template ) {
            this.$template.attr( "data-transition", "horizontal_out" );
            setTimeout( function () {
                this.$template.attr( "data-transition", "" );
            }, 500 );
        }
    };

    BuildsJenkinsCategory.prototype.doData = function () {
        var _dateFrom = this.config.date.from,
            _dateTo = this.config.date.to,
            _dateDiff = util.dateDiff( _dateFrom, _dateTo ),
            _interval = this.config.date.interval
            ;

        // month
        if ( _dateDiff.weeks === 4 ) {
            this.viewModel.title( _dateFrom.toString( "MMMM" ) );
            this.viewModel.subtitle( _dateFrom.toString( "yyyy" ) );
        }
        // hours
        else if ( _dateDiff.hours <= 24 ) {
            this.viewModel.title( _dateDiff.hours + " hours" );
            this.viewModel.subtitle( _dateTo.toString( "dd. MMM" ) );
        }
        // days
        else if ( _dateDiff.days < 7 ) {
            this.viewModel.title( _dateDiff.days + " days" );
            if ( _dateDiff.months == 0 ) {
                this.viewModel.subtitle( _dateFrom.toString( "dd." ) + "-" + _dateTo.toString( "dd. MMM" ) );
            }
            else {
                this.viewModel.subtitle( _dateFrom.toString( "dd. MMM" ) + " - " + _dateTo.toString( "dd. MMM" ) );
            }
        }

        var jenkinsBuildsFilter = {
            date: [ _dateFrom, _dateTo ],
            interval: _interval
        };

        this.jenkinsBuilds = this.jenkins.getBuilds( jenkinsBuildsFilter );
        this.jenkinsStats = this.jenkins.getStats( this.jenkinsBuilds, jenkinsBuildsFilter );

        this.viewModel.stats.removeAll();
        this.viewModel.stats.push(
            {
                title: "Builds",
                stat: this.jenkinsStats.result.builds,
                substat: "&nbsp;",
                type: "builds"
            } );
        this.viewModel.stats.push(
            {
                title: "Success",
                stat: ((this.jenkinsStats.result.success / this.jenkinsStats.result.builds) * 100 || 0).toFixed( 0 ) + "%",
                substat: this.jenkinsStats.result.success,
                type: "success"
            } );
        this.viewModel.stats.push(
            {
                title: "Failure",
                stat: ((this.jenkinsStats.result.failure / this.jenkinsStats.result.builds) * 100 || 0).toFixed( 0 ) + "%",
                substat: this.jenkinsStats.result.failure,
                type: "failure"
            }
        );
    };

    // ... /DO

    return BuildsJenkinsCategory;

} )
;