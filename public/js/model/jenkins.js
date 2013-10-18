define( [ "jquery", "lib/util" ], function ( $, util ) {

        var _BUILD_RESULT = {
            SUCCESS: "SUCCESS",
            FAILURE: "FAILURE"
        };

        // FUNCTIONS

        var _incResult = function ( arg, result ) {
            arg.result.builds++;
            if ( arg.result[result] !== undefined ) {
                arg.result[result]++;
            }
        }

        var _dateCreateYear = function ( date ) {
            var year = {
                    result: {
                        builds: 0,
                        success: 0,
                        failure: 0
                    },
                    weeks: {}
                },
                weeks = util.weeksInYear( date );
            ;

            for ( var week = 1; week <= weeks; week++ ) {
                year.weeks[week] = _dateCreateWeek();
            }
            for ( var month = 0; month < 12; month++ ) {
                year[month] = _dateCreateMonth( date.getFullYear(), month );
            }

            return year;
        };
        var _dateCreateMonth = function ( year, month ) {
            var date = new Date( year, month, 1 ),
                days = date.getDaysInMonth(),
                month = {
                    result: {
                        builds: 0,
                        success: 0,
                        failure: 0
                    },
                    weeks: util.weeksInMonth( date )
                }
                ;

            for ( var day = 1; day <= days; day++ ) {
                month[day] = _dateCreateDay();
            }

            return month;
        };
        var _dateCreateWeek = function () {
            return {
                result: {
                    builds: 0,
                    success: 0,
                    failure: 0
                }
            }
        };
        var _dateCreateDay = function () {
            var day = {
                result: {
                    builds: 0,
                    success: 0,
                    failure: 0
                }
            }

            for ( var hour = 0; hour <= 23; hour++ ) {
                day[hour] = {
                    result: {
                        builds: 0,
                        success: 0,
                        failure: 0
                    }
                }
            }

            return day;
        };

        // /FUNCTIONS

        /**
         * Jenkins
         * @param {Object} data
         * @returns {Jenkins}
         * @constructor
         */
        var Jenkins = function ( data ) {

            var self = this,
                _data = data
                ;

            // ... CREATE

            /**
             * @param {Object} build
             * @returns {Object} Object{building: (boolean), description: string, duration: number, estimatedDuration: number, fullDisplayName: string, id: string, number: number, result: {success: boolean, failure: boolean}, timestamp: number, url: string, culpritId: string, change: array}
             * @private
             */
            var _createBuild = function ( build ) {

                /**
                 * @param {Object} changeSet
                 * @returns {Object} Object{affectedPaths: array, timestamp: number, commitId: string, author: string, msg: string, comment: string, id: string}
                 * @private
                 */
                var _createChange = function ( changeSet ) {
                    if ( !changeSet ) {
                        return null;
                    }

                    var _change = {
                        "affectedPaths": changeSet.affectedPaths || [],
                        "timestamp": changeSet.timetamp,
                        "commitId": changeSet.commitId,
                        "author": changeSet.author ? changeSet.author.fullName : null,
                        "msg": changeSet.msg,
                        "comment": changeSet.comment,
                        "id": changeSet.id
                    };

                    return _change;
                };

                var _build = {
                    "build": build,
                    "building": build.building,
                    "description": build.description,
                    "duration": build.duration,
                    "estimatedDuration": build.estimatedDuration,
                    "fullDisplayName": build.fullDisplayName,
                    "id": build.id,
                    "number": build.number,
                    "result": {
                        "success": build.result === _BUILD_RESULT.SUCCESS,
                        "failure": build.result === _BUILD_RESULT.FAILURE,
                        "result": build.result.toLowerCase()
                    },
                    "timestamp": build.timestamp,
                    "date": new Date( build.timestamp ),
                    "url": build.job
                };

                // culprit
                _build.culpritId = null;
                if ( build.culprits && build.culprits.length > 0 ) {
                    _build.culpritId = build.culprits[0].id;
                }

                // change
                _build.change = [];
                if ( build.changeSet && build.changeSet.items && build.changeSet.items.length > 0 ) {
                    var len = build.changeSet.items.length;
                    for ( var i = 0; i < len; i++ ) {
                        var change = _createChange( build.changeSet.items[i] );
                        if ( change ) {
                            _build.change.push( change );
                        }
                    }
                }

                return _build;
            };

            /**
             * @param culprit
             * @returns {Object} Object{fullName: string, id: string, result: {success: number, failure: number, builds: number, successPercent: number, failurePercent: number, buildsPercent: number}}
             * @private
             */
            var _createCulprit = function ( culprit ) {
                var _culprit = {
                    fullName: culprit.fullName,
                    id: culprit.id,
                    result: {
                        success: 0,
                        failure: 0,
                        builds: 0,
                        successPercent: 0.0,
                        failurePercent: 0.0,
                        buildsPercent: 0.0
                    }
                }

                // property
                var property;
                for ( var p in culprit.property ) {
                    property = culprit.property[p];

                    // address
                    if ( property.address ) {
                        _culprit.email = property.address;
                    }
                }

                return _culprit;
            };

            // ... /CREATE

            // ... GET

            /**
             * @param {Object} [filter] Object{ sort: (string), order: (desc|asc), count: (number), date: (from|[from, to]) }
             * @returns {Array} Array(build, ...)
             */
            self.getBuilds = function ( filter ) {
                filter = util.merge( {
                    sort: "number",
                    order: "desc",
                    count: -1,
                    date: null
                }, filter );

                var builds = [],
                    buildsLen = _data.allBuilds.length,
                    build = null
                    ;

                for ( var i = 0; i < buildsLen; i++ ) {
                    build = _createBuild( _data.allBuilds[i] );

                    if ( build ) {
                        builds.push( build );
                    }
                }

                // FILTER

                // sort
                builds.sort( function ( left, right ) {
                    if ( typeof filter.sort === "function" ) {
                        return filter.sort( left, right );
                    }
                    return filter.order === "desc" ? left[filter.sort] < right[filter.sort] : left[filter.sort] > right[filter.sort];
                } );

                // date
                if ( filter.date ) {
                    var _parseDate = function ( date ) {
                        return Object.prototype.toString.call( date ) === "[object Date]" ? date.getTime() : (typeof date === "string" ? Date.parse( date ) : date);
                    };

                    var dateFrom = null,
                        dateTo = (new Date()).getTime();
                    if ( util.isArray( filter.date ) ) {
                        dateFrom = _parseDate( filter.date[0] );
                        dateTo = _parseDate( filter.date[1] );
                    }
                    else {
                        dateFrom = _parseDate( filter.date );
                    }

                    builds = builds.filter( function ( build ) {
                        return dateFrom <= build.timestamp && dateTo >= build.timestamp;
                    } );
                }

                // count
                if ( filter.count > -1 ) {
                    builds = builds.slice( 0, filter.count );
                }

                // /FILTER

                return builds;
            };

            /**
             * @returns {Object} Object{last: build, successful: build, failed: build}
             */
            self.getBuildsLatest = function () {
                return {
                    last: _createBuild( _data.lastBuild ),
                    successful: _createBuild( _data.lastSuccessfulBuild ),
                    failed: _createBuild( _data.lastFailedBuild )
                };
            };

            /**
             * @param {Object} [builds]
             * @returns {Object} Object{id : culprit, ...}
             */
            self.getCulprits = function ( builds ) {
                builds = builds || self.getBuilds();

                var culprits = {},
                    build = null,
                    buildsLen = builds.length,
                    culprit = null,
                    culpritLen = 0,
                    _culprit = null
                    ;

                for ( var i = 0; i < buildsLen; i++ ) {
                    build = builds[i];
                    culpritLen = build.build.culprits.length;

                    for ( var j = 0; j < culpritLen; j++ ) {
                        culprit = build.build.culprits[j];
                        _culprit = culprits[culprit.id] || _createCulprit( culprit );

                        // build result
                        if ( build.result.success ) {
                            _culprit.result.success++;
                        }
                        if ( build.result.failure ) {
                            _culprit.result.failure++;
                        }
                        _culprit.result.builds++;

                        if ( _culprit ) {
                            culprits[_culprit.id] = _culprit;
                        }
                    }
                }

                for ( var p in culprits ) {
                    var culprit = culprits[p];
                    culprit.result.successPercent = culprit.result.success / culprit.result.builds;
                    culprit.result.failurePercent = culprit.result.failure / culprit.result.builds;
                    culprit.result.buildsPercent = culprit.result.builds / buildsLen;
                }

                return culprits;
            };

            /**
             * @param {Array} [builds]
             * @returns {Object} {success: number, failure: number, builds: number, successPercent: number, failurePercent: number, date: Object}
             */
            self.getStatistics = function ( builds ) {
                builds = builds || self.getBuilds();

                var stats = {
                        result: {
                            success: 0,
                            failure: 0,
                            builds: builds.length,
                            successPercent: 0.0,
                            failurePercent: 0.0
                        },
                        date: {
                        }
                    }
                    ;

                util.each( builds, function ( build, i ) {

                        var result = build.result.result;

                        // Result
                        _incResult( build, result );

                        // DATE

                        var date = new Date( build.timestamp );
                        if ( !stats.date[date.getFullYear()] ) {
                            stats.date[date.getFullYear()] = _dateCreateYear( date );
                        }

                        _incResult( stats.date[date.getFullYear()], result );
                        _incResult( stats.date[date.getFullYear()].weeks[util.weekOfDate( date )], result );
                        _incResult( stats.date[date.getFullYear()][date.getMonth()], result );
                        _incResult( stats.date[date.getFullYear()][date.getMonth()][date.getDate()], result );
                        _incResult( stats.date[date.getFullYear()][date.getMonth()][date.getDate()][date.getHours()], result );

                        // /DATE

                    }
                )
                ;

                stats.result.successPercent = stats.result.success / stats.result.builds;
                stats.result.failurePercent = stats.result.failure / stats.result.builds;

                return stats;
            };

            self.getStats = function ( builds, filter ) {
                var _dateFrom = filter.date[0],
                    _dateTo = filter.date[1],
                    _interval = filter.interval,
                    stats = {
                        result: {
                            success: 0,
                            failure: 0,
                            builds: 0
                        }
                    },
                    _stats = null,
                    _statsKeyFunc = null,
                    _date = null
                    ;

                // less than a day
                if ( _interval < 3600 * 1000 * 24 ) {
                    _statsKeyFunc = function ( date ) {
                        return new Date( date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() ).getTime();
                    };
                }
                else {
                    _statsKeyFunc = function ( date ) {
                        return new Date( date.getFullYear(), date.getMonth(), date.getDate() ).getTime();
                    };
                }

                for ( var time = _dateFrom.getTime(); time <= _dateTo.getTime(); time += _interval ) {
                    _date = new Date( time );
                    stats[ time ] = {
                        result: {
                            success: 0,
                            failure: 0,
                            builds: 0
                        }
                    };
                }

                util.each( builds, function ( build ) {
                    _stats = stats[ _statsKeyFunc( build.date ) ];

                    if ( _stats ) {
                        _incResult( stats, build.result.result );
                        _incResult( _stats, build.result.result );
                    }
                    else {
                        console.warn( "Jenkins.getStats: Stat for build not found", _statsKeyFunc( build.date ), build );
                    }
                } );

                return stats;
            };

            // ... /GET

            return self;

        }

        return Jenkins;

    }
)
;