define( [ "knockout", "util", "mdl/section" ], function ( ko, util, Section ) {

    ChartbuildJenkinsSection.prototype = new Section();

    function ChartbuildJenkinsSection( id, category, config ) {
        Section.apply( this, [ id, category ] );

        this.data = {
            builds: [],
            failure: [],
            success: []
        };
        this.config = util.merge( {
            chart: {}
        }, config );
        this.jenkins = null;
        this.$template = null;
    };

    // ... ON

    ChartbuildJenkinsSection.prototype.onData = function ( data ) {
        this.jenkins = data;
        this.doData();
    };

    // ... /ON

    // ... DO

    ChartbuildJenkinsSection.prototype.doData = function () {
        var self = this,
            stats = this.category.jenkinsStats
            ;

        if ( !stats ) {
            console.error( "DoData: Stats is empty", stats );
            return;
        }

        this.data = {
            builds: [],
            failure: [],
            success: []
        };

        util.each( stats, function ( key, data ) {
            if ( !isNaN( parseInt( key ) ) ) {
                self.data.builds.push( [parseInt( key ), data.result.builds] );
                self.data.failure.push( [parseInt( key ), data.result.failure] );
                self.data.success.push( [parseInt( key ), data.result.success] );
            }
        } );
    };

    ChartbuildJenkinsSection.prototype.doBuild = function ( $wrapper ) {
        Section.prototype.doBuild.call( this, $wrapper );

        this.$template = $( "<div />", {
            "data-template": "chartbuild-builds-jenkins",
            "data-transition": "",
            "data-bind": "template: { name: 'chartbuild-builds-jenkins-template' }"
        } );

        ko.applyBindings( this, this.$template[0] );

        $wrapper.append( this.$template );

    };

    ChartbuildJenkinsSection.prototype.doTransitionShow = function ( transitionCount ) {
        console.log( "ChartbuildJenkinsSection.doTransitionShow" );

        if ( this.$template ) {
            this.doBuildChart();
            this.$template.attr( "data-transition", "horizontal_in" );
        }
    };

    ChartbuildJenkinsSection.prototype.doTransitionHide = function () {
        if ( this.$template ) {
            this.$template.attr( "data-transition", "horizontal_out" );
            setTimeout( function () {
                this.$template.attr( "data-transition", "" );
            }, 500 );
        }
    };

    ChartbuildJenkinsSection.prototype.doBuildChart = function () {
        if ( !this.$template || this.$template.length == 0 ) {
            console.error( "DoBuildChart: $template not given" );
            return;
        }

        var self = this,
            $_chartContainer = this.$template.find( ".chart[data-container]" )
            ;

        if ( !$_chartContainer || $_chartContainer.length == 0 ) {
            console.error( "DoBuildChart: $chartContainer not found" );
            return;
        }

        $_chartContainer.removeClass( "show" );

        setTimeout( function () {

            var chart = $_chartContainer.highcharts( util.merge( {
                chart: {
                    backgroundColor: 'rgba(255, 255, 255, 0)'
                },
                title: {
                    text: null
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    gridLineColor: "#e8e8e8",
                    title: {
                        text: null
                    },
                    min: 0,
                    endOnTick: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        marker: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    },
                    line: {
                        marker: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                tooltip: {
                    enabled: false
                },
                series: [
                    {
                        name: "Builds",
                        data: self.data.builds,
                        type: 'line',
                        color: "#CCC",
                        marker: {
                            enabled: false
                        },
                        pointStart: self.config.date.from,
                        pointInterval: self.config.date.interval
                    },
                    {
                        name: "Success",
                        data: self.data.success,
                        type: 'area',
                        color: "#66CC33",
                        marker: {
                            enabled: false
                        },
                        pointStart: self.config.date.from,
                        pointInterval: self.config.date.interval
                    },
                    {
                        name: "Failure",
                        data: self.data.failure,
                        type: 'area',
                        color: "#CC3300",
                        marker: {
                            enabled: false
                        },
                        pointStart: self.config.date.from,
                        pointInterval: self.config.date.interval
                    }
                ]
            }, self.config.chart ) );

            $_chartContainer.addClass( "show" );

        }, 100 );
    };

    // ... /DO

    return ChartbuildJenkinsSection;

} );