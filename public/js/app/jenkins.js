define(
    ["app/socket", "lib/event_handler", "mdl/handler", "mdl/jenkins/jenkins_module"],
    function ( socket, eventHandler, moduleHandler, JenkinsModule ) {

        console.log( "Jenkins App loaded" );

        var jenkinsModule = new JenkinsModule( "jenkins" );

        function handleData( data ) {
            if ( data ) {
                // load jenkins data
                jenkinsModule.onData( data.jenkins );
            }
            else {
                // fire toast
                eventHandler.fire( "toast", "Could not retrieve Jenkins data" );
            }
        }

        moduleHandler.addModule( "jenkins", jenkinsModule );

        socket.on( "jenkins", handleData );
        socket.emit( "jenkins", "BankID_2.0_JST", handleData );

    } );