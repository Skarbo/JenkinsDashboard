define( [ "knockout", "mdl/module", "./builds_jenkins_category", "model/jenkins" ], function ( ko, Module, BuildsJenkinsCategory, Jenkins ) {

        JenkinsModule.prototype = new Module();

        function JenkinsModule( id ) {
            Module.apply( this, [id] );

            this.jenkins = null;

            this.doInit();
        };

        JenkinsModule.prototype.doInit = function () {
            this.addCategory( new BuildsJenkinsCategory( "builds24hours", this, {
                    date: {
                        from: Date.today().set( { hour: 00, minute: 00 } ),
                        to: Date.today().add( 1 ).days().set( { hour: 00, minute: 00 } ),
                        interval: 3600 * 1000
                    }
                }
            ) )
            ;

            this.addCategory( new BuildsJenkinsCategory( "builds2days", this, {
                    date: {
                        from: Date.parse( "-1 day" ).set( { hour: 00, minute: 00 } ),
                        to: Date.today().add( 1 ).days().set( { hour: 00, minute: 00 } ),
                        interval: 3600 * 1000
                    }
                }
            ) )
            ;

            this.addCategory( new BuildsJenkinsCategory( "week", this, {
                    date: {
                        from: Date.parse( "-7 days" ).set( {hour: 00, minute: 00} ),
                        to: Date.today().set( {hour: 00, minute: 00} ),
                        interval: 3600 * 1000 * 24
                    }
                }
            ) )

            ;
            this.addCategory( new BuildsJenkinsCategory( "month", this, {
                    date: {
                        from: new Date().set( {hour: 00, minute: 00} ).moveToFirstDayOfMonth(),
                        to: new Date().set( {hour: 23, minute: 59} ).moveToLastDayOfMonth(),
                        interval: 3600 * 1000 * 24
                    }
                }
            ) )
            ;
        };

        JenkinsModule.prototype.onData = function ( data ) {
            if ( data ) {
                this.jenkins = new Jenkins( data );

                Module.prototype.onData.call( this, this.jenkins );
            } else {
                console.error( "JenkinsModule.onData", data );
            }
        };

        return JenkinsModule;

    }
)
;