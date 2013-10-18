define( ["lib/md5"], function ( md5 ) {
    return {

        /**
         * @param {string} url Request url
         * @returns {string} Ajax padded url
         */
        ajaxGetUrl: function ( url ) {
            return location.protocol + "//" + location.hostname + ":" + location.port + "/ajax/?get=" + encodeURIComponent( url );
        },

        /**
         * Checks if argument is an array.
         * @param arg           The argument to check.
         * @returns {boolean}   True if argument is array.
         */
        isArray: function ( arg ) {
            return Object.prototype.toString.call( arg ) === '[object Array]';
        },

        /**
         * Checks if argument is an object
         * @param arg           The argument to check.
         * @returns {boolean}   True if argument is object.
         */
        isObject: function ( arg ) {
            return arg !== null && typeof arg === 'object' && !this.isArray( arg );
        },

        /**
         * @param (Object} object
         * @returns {Array}
         */
        objecToArray: function ( object ) {
            var array = [];
            for ( var key in object ) {
                array.push( object[key] );
            }
            return array;
        },

        /**
         * Returns all the keys associated to given object.
         * @param object    The object to retrieve keys from.
         * @returns {Array} The keys associated to object.
         */
        objectKeys: function ( object ) {
            var keys = [];
            if ( this.isObject( object ) ) {
                for ( var key in object ) {
                    if ( object.hasOwnProperty( key ) ) {
                        keys.push( key );
                    }
                }
            }
            return keys;
        },

        /**
         * Merge the contents of two objects, or more together, into the first object.
         * @returns {Object} Merged objects
         */
        merge: function () {
            var i = 0,
                deep = false,
                argLen = arguments.length;

            if ( typeof arguments[0] === "boolean" ) {
                deep = arguments[0];
                i = 1
            }

            function mergeRecursive( par1, par2 ) {

                for ( var p in par2 ) {
                    if ( par2.hasOwnProperty( p ) ) {
                        try {
                            // Property in destination object set; update its value.
                            if ( this.isObject( par2[p] ) && deep ) {
                                par1[p] = mergeRecursive( par1[p], par2[p] );
                            } else {
                                par1[p] = par2[p];
                            }
                        } catch ( e ) {
                            // Property in destination object not set; create it and set its value.
                            par1[p] = par2[p];
                        }
                    }
                }

            }

            var retObject = arguments[i];

            for ( ; i < argLen; i++ ) {
                mergeRecursive( retObject, arguments[i] );
            }

            return retObject;
        },

        gravatarImage: function ( email ) {
            return 'http://www.gravatar.com/avatar/' + md5( email || "" );
        },

        /**
         * @param {Object|Array} arg
         * @param {Function} callback Object: Function(key, value), Array: Function(value, index)
         */
        each: function ( arg, callback ) {
            if ( this.isArray( arg ) ) {
                var len = arg.length;
                for ( var i = 0; i < len; i++ ) {
                    callback( arg[i], i );
                }
            }
            else if ( this.isObject( arg ) ) {
                for ( var k in arg ) {
                    callback( k, arg[k] );
                }
            }
        },

        weekOfDate: function ( date ) {
            var d = new Date( date );
            d.setHours( 0, 0, 0 );
            d.setDate( d.getDate() + 4 - (d.getDay() || 7) );
            var yearStart = new Date( d.getFullYear(), 0, 1 );
            var weekNo = Math.ceil( ( ( (d - yearStart) / 86400000) + 1) / 7 );
            return weekNo;
        },

        /**
         * @param {Date} date
         * @returns {Array} Weeks in month for date
         */
        weeksInMonth: function ( date ) {
            date = new Date( date );
            var firstOfMonth = date.moveToFirstDayOfMonth(),
                lastOfMonth = date.moveToLastDayOfMonth(),
                weeks = []
                ;
            for ( var week = this.weekOfDate( firstOfMonth ); week <= this.weekOfDate( lastOfMonth ); week++ ) {
                weeks.push( week );
            }
            return weeks;
        },

        /**
         * @param {Date} date
         * @returns {number} Weeks in year for date
         */
        weeksInYear: function ( date ) {
            var first = new Date( date.getFullYear(), 0, 1 );
            var dayms = 1000 * 60 * 60 * 24;
            var numday = ((date - first) / dayms)
            var weeks = Math.ceil( (numday + first.getDay() + 1) / 7 );
            return weeks
        },

        /**
         * @param {Date} dateFrom
         * @param {Date} dateTo
         * @returns {Object} {days: Number, weeks: Number, months: number, years: number}
         */
        dateDiff: function ( dateFrom, dateTo ) {
            var t1 = dateFrom.getTime();
            var t2 = dateTo.getTime();
            var date1Y = dateFrom.getFullYear();
            var date2Y = dateTo.getFullYear();
            var date1M = dateFrom.getMonth();
            var date2M = dateTo.getMonth();
            var tDiff = (t2 - t1);
            var day = (24 * 3600 * 1000);

            return {
                hours: parseInt( tDiff / (3600 * 1000) ),
                days: parseInt( tDiff / day ),
                weeks: parseInt( tDiff / (day * 7) ),
                months: (date2M + 12 * date2Y) - (date1M + 12 * date1Y),
                years: dateTo.getFullYear() - dateFrom.getFullYear()
            }
        }

    }
} );