define( [ "jquery", "knockout", "util", "mdl/section" ], function ( $, ko, util, Section ) {

    CulpritsbuildJenkinsSection.prototype = new Section();

    function CulpritsbuildJenkinsSection( id, category, config ) {
        Section.apply( this, [ id, category ] );

        this.config = util.merge( {
        }, config );
        this.jenkins = null;
        this.culprits = null;
        this.$template = null;
        this.viewModel = {
            culprits: ko.observableArray()
        };

        this.doInit();
    };

    // ... ON

    CulpritsbuildJenkinsSection.prototype.onData = function ( data ) {
        this.jenkins = data;

        this.doData();
    };

    // ... /ON
    // ... DO

    CulpritsbuildJenkinsSection.prototype.doInit = function () {

    };

    CulpritsbuildJenkinsSection.prototype.doData = function () {
        var self = this;

        this.culprits = this.jenkins.getCulprits( this.category.jenkinsBuilds );
        console.log( "Culprits", this.culprits, Highcharts.getOptions().colors );

        self.viewModel.culprits.removeAll();

        var i = 0,
            colors = Highcharts.getOptions().colors;
        $.each( this.culprits, function ( id, culprit ) {
            self.viewModel.culprits.push( {
                name: culprit.fullName,
                image: util.gravatarImage( culprit.email ),
                stats: [
                    {
                        type: "builds",
                        stat: culprit.result.builds,
                        substat: Math.round( culprit.result.buildsPercent * 100 )
                    },
                    {
                        type: "success",
                        stat: Math.round( culprit.result.successPercent * 100 ),
                        substat: culprit.result.success
                    },
                    {
                        type: "failure",
                        stat: Math.round( culprit.result.failurePercent * 100 ),
                        substat: culprit.result.failure
                    }
                ],
                color: colors[i++ % colors.length]
            } );
        } );

        this.doBuildChart();
    };

    CulpritsbuildJenkinsSection.prototype.doBuild = function ( $wrapper ) {
        Section.prototype.doBuild.call( this, $wrapper );

        this.$template = $( "<div />", {
            "data-template": "culpritsbuild-builds-jenkins",
            "data-transition": "",
            "data-bind": "template: { name: 'culpritsbuild-builds-jenkins-template' }"
        } );

        ko.applyBindings( this.viewModel, this.$template[0] );

        $wrapper.append( this.$template );

    };

    CulpritsbuildJenkinsSection.prototype.doTransitionShow = function ( transitionCount ) {
        this.doBuildChart();

        if ( this.$template ) {
            this.$template.attr( "data-transition", "horizontal_in" );
        }
    };

    CulpritsbuildJenkinsSection.prototype.doTransitionHide = function () {
        if ( this.$template ) {
            this.$template.attr( "data-transition", "horizontal_out" );
            setTimeout( function () {
                this.$template.attr( "data-transition", "" );
            }, 500 );
        }
    };

    CulpritsbuildJenkinsSection.prototype.doBuildChart = function () {
        var $chart = this.$wrapper.find( "[data-container='chart']" );

        var culpritsData = [],
            resultsData = [],
            percentResult = 0;

        $.each( this.culprits, function ( id, culprit ) {
            culpritsData.push( {
                name: culprit.fullName,
                y: Math.round( culprit.result.buildsPercent * 100 )
            } );

            resultsData.push( {
                name: "Success",
                y: Math.round( culprit.result.successPercent * 100 * culprit.result.buildsPercent ),
                color: "rgba(0,102,0,0.8)"
            } );

            resultsData.push( {
                name: "Failure",
                y: Math.round( culprit.result.failurePercent * 100 * culprit.result.buildsPercent ),
                color: "rgba(102,0,0,0.8)"
            } );

            percentResult += culprit.result.buildsPercent;
        } );

        culpritsData.push( {
            name: "Other",
            y: 100 - Math.round( percentResult * 100 ),
            color: "#FFFFFF"
        } );

        resultsData.push( {
            name: "Other",
            y: 100 - Math.round( percentResult * 100 ),
            color: "#EEE"
        } );

        $chart.removeClass( "show" );

        setTimeout( function () {

            $chart.highcharts( {
                chart: {
                    type: 'pie',
                    backgroundColor: 'rgba(255, 255, 255, 0)'
                },
                title: {
                    text: null
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%']
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                },
                series: [
                    {
                        name: 'Builds',
                        data: culpritsData,
                        size: '80%',
                        dataLabels: {
                            formatter: function () {
                                return this.y > 1 ? '<b>' + this.point.name + '</b>' : null;
                            }
                        }
                    },
                    {
                        name: 'Results',
                        data: resultsData,
                        size: '100%',
                        innerSize: '90%',
                        dataLabels: {
                            formatter: function () {
                                return null;
                            }
                        }
                    }
                ]
            } );

            $chart.addClass( "show" );

            var causeRepaintsOn = $( ".repaint" );

            $( window ).resize( function () {
                causeRepaintsOn.css( "z-index", 1 );
            } );

        }, 100 );
    };

    // ... /DO

    return CulpritsbuildJenkinsSection;

} );