﻿/*

    EFI Actioneer v.0.0.2
    Tom Espen Pedersen / tom.espen.pedersen@gmail.com
    @ March 2014

    Launcher plugin for Efi CustomerService Intranet

    */

var base;

$.widget('efi.actioneer', {
/**************************************************************
*     GLOBAL VARIABLES / CONFIGURABLE OPTIONS                 *
**************************************************************/
    options: {
        keyTrigger: 'shift+space',
        jsonActions: '',
        searchResults: '',
        currentAction: ''
    },

/**************************************************************
*     INIT & BINDING                                          *
**************************************************************/
    _create: function () {
        "use strict";

        // store THIS in variable base to avoid collision with other functions refering to base.
        base = this;
        var keys = '';

        // create pop-up launcher html element and append to the <body>
        // base._container = $('<div id="jquery-actioneer"><div id="jquery-actioneer-inner"><input type="text" id="jquery-actioneer-search" /><button id="jquery-actioneer-go">&#x23CE;</button><ul id="jquery-actioneer-autocomplete"></ul></div></div>').appendTo('body');
        base._container = $('<div id="jquery-actioneer"><div id="jquery-actioneer-inner"><input type="text" id="jquery-actioneer-search" /><ul id="jquery-actioneer-autocomplete"></ul></div></div>').appendTo('body');


    /*******************************************
    *     Mouse bindings                       *
    *******************************************/
        $("#jquery-actioneer-go").click(function () {base.selectaction(); });


    /*******************************************
    *     Keyboard bindings                    *
    *******************************************/
        $('body').on('keypress', null, base.options.keyTrigger, function () {
            $("#jquery-actioneer-inner").children('span').remove();
            $('#jquery-actioneer').show();
            $("#jquery-actioneer-search").val('');
            $('#jquery-actioneer-search').focus();
            base.searchactions();
        });


        if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
            $('body').on('keydown', function (event) {
                keys += event.which;
                if (keys.length > 4) {
                    keys = keys.substr(-4);
                }

                if (keys === '1632') {
                    $("#jquery-actioneer-inner").children('span').remove();
                    $('#jquery-actioneer').show();
                    $("#jquery-actioneer-search").val('');
                    $('#jquery-actioneer-search').focus();
                    base.searchactions();

                    keys = '';
                }
            });
        } // END hardcoded binding for FireFox


        $("#jquery-actioneer-search").on('keydown', null, "esc", function () {
            // hide launcher
            base.resetstate();
            $('#jquery-actioneer').hide();
            $("#jquery-actioneer-autocomplete").hide();
        });

        $("#jquery-actioneer-search").on('keypress', null, base.options.keyTrigger, function () {
            // hide launcher
            base.resetstate();
            $('#jquery-actioneer').hide();
            $("#jquery-actioneer-autocomplete").hide();
        });


        // remove whitespace in empty searchbox
        $("#jquery-actioneer-search").on('keyup', function (event) {
            if ($("#jquery-actioneer-search").val().match(/^\s+/g)) {
                $("#jquery-actioneer-search").val('');
            }

            // update results whenver key is released, except for [arrow-keys] or [enter]
            if (event.which !== 38 && event.which !== 40 && event.which !== 13 && event.which !== 37 && event.which !== 39) {
                base.searchactions();
            }
        });


        $("#jquery-actioneer-search").on('keydown', function (event) {
            if (event.which === 13) {
                // enter => select current action
                base.selectaction();

            } else if (event.which === 8) {
                // backspace => remove previous action if searchfield is empty
                var searchtext = $("#jquery-actioneer-search").val();

                if (searchtext === "") {
                    base.options.currentAction = "";
                    $("#jquery-actioneer-inner span").remove();
                } // if searchtext == ""

            } // if event.which == ??
        }); // END on keydown

        $("#jquery-actioneer-search").on('keydown', null, "up", function () {
            // move selector up
            base.actionsmove('up');
        });
        $("#jquery-actioneer-search").on('keydown', null, "down", function () {
            // move selector down
            base.actionsmove('down');
        });

        // trigger callback event
        base._trigger('created', null, 'Plugin created ...');
    }, // End create()



    _init: function () {
        "use strict";

        if (base.options.jsonActions === '') {

            // build actions from parsing document
            base.buildactionslist();

        } else if (base.options.jsonActions.substr(-5) === '.json') {

            // build actions from .json file
            base.buildactionslistjsonfile();

        } else {

            // build actions from json blob..
            base.buildactionslistjson();

        }

        base._trigger('init', null, 'Plugin initiated');
    }, // end init()



/**************************************************************
*     PLUGIN SPESIFIC FUNCTIONS                               *
**************************************************************/


/*******************************************
*     Build / Search functions             *
*******************************************/


    buildactionslist: function () {
        "use strict";

        var actions = [];

        // loop over all elements with class 'actioneer'
        $(".actioneer").each(function () {

            // find attributes of elements with class 'actioneer' - only works with <a ..> tags at the moment.
            var actionitem = {
                name: $(this).text(),
                action: $(this).attr('href')
            };

            // push object into 'actions' array
            actions.push(actionitem);
        });

        // store actions array in options.
        base.options.actions = actions;

        // trigger event
        base._trigger('buildComplete', null, 'Action build completed.');
    }, // end buildactionslist()



    buildactionslistjson: function () {
        "use strict";

        var jsonobj = $.parseJSON(base.options.jsonActions),
            actions = [],
            i = 0,
            len = 0,
            actionitem = {},
            j = 0,
            sublen = 0,
            subactions = {},
            subactionitem = {};

        for (i = 0, len = jsonobj.length; i < len; i = i + 1) {
            if (jsonobj[i].subactions === undefined) {
                actionitem = {
                    name: jsonobj[i].name,
                    action: jsonobj[i].action
                };
            } else {

                subactions = [];
                for (j = 0, sublen = jsonobj[i].subactions.length; j < sublen; j = j + 1) {
                    subactionitem = {
                        name: jsonobj[i].subactions[j].name,
                        action: jsonobj[i].subactions[j].action
                    };
                    subactions.push(subactionitem);
                }

                actionitem = {
                    name: jsonobj[i].name,
                    action: jsonobj[i].action,
                    subactions: subactions
                };
            } // if jsonobj[i].subactions == undefined

            actions.push(actionitem);
        } // for loop

        base.options.actions = actions;
    }, // end buildactionslistjson()



    buildactionslistjsonfile: function () {
        "use strict";

        $.getJSON(base.options.jsonActions, function (jsonobj) {

            var actions = [],
                i = 0,
                len = 0,
                actionitem = {},
                j = 0,
                sublen = 0,
                subactions = {},
                subactionitem = {};

            for (i = 0, len = jsonobj.length; i < len; i = i + 1) {

                if (jsonobj[i].subactions === undefined) {
                    actionitem = {
                        name: jsonobj[i].name,
                        action: jsonobj[i].action
                    };
                } else {

                    subactions = [];
                    for (j = 0, sublen = jsonobj[i].subactions.length; j < sublen; j = j + 1) {
                        subactionitem = {
                            name: jsonobj[i].subactions[j].name,
                            action: jsonobj[i].subactions[j].action
                        };
                        subactions.push(subactionitem);
                    }

                    actionitem = {
                        name: jsonobj[i].name,
                        action: jsonobj[i].action,
                        subactions: subactions
                    };
                } // if jsonobj[i].subactions === undefined

                actions.push(actionitem);
            } // for loop

            base.options.actions = actions;
        }); // END $.getJSON()

        // trigger event
        base._trigger('buildComplete', null, 'Action build completed.');
    }, // end buildactionslistjsonfile()



    searchactions: function () {
        "use strict";

        var res = '',
            results = [],
            rx = '',
            jqueryActioneerAutocompleteError = false,
            stxt = '',
            i = 0,
            len = 0,
            t = 0,
            tlen = 0,
            searchname = '';

        $("#jquery-actioneer-autocomplete").show();
        stxt = $("#jquery-actioneer-search").val();


        if (base.options.currentAction === '') {

            // regexp search on action name
            for (i = 0, len = base.options.actions.length; i < len; i = i + 1) {
                // set node for easy access
                searchname = base.options.actions[i].name;

                // build regexp
                rx = '.*';
                for (t = 0, tlen = stxt.length; t < tlen; t = t + 1) {
                    rx += stxt.charAt(t) + '.*';
                }


                // match regexp
                res = searchname.match(new RegExp(rx, "gi"));

                // check for match
                if (res !== null) {
                    // if match push to result array;
                    results.push(base.options.actions[i]);
                }

                base.options.searchResults = results;
            }
        } else {

            // regexp search on subaction name
            for (i = 0, len = base.options.currentAction.subactions.length; i < len; i = i + 1) {
                // set node for easy access
                searchname = base.options.currentAction.subactions[i].name;

                // build regexp
                rx = '.*';
                for (t = 0, tlen = stxt.length; t < tlen; t = t + 1) {
                    rx += stxt.charAt(t) + '.*';
                }

                // match regexp
                res = searchname.match(new RegExp(rx, "gi"));

                // check for match
                if (res !== null) {
                    // if match push to result array;
                    results.push(base.options.currentAction.subactions[i]);
                }

                base.options.searchResults = results;

            }
        } // end if check on action / subaction

        $("#jquery-actioneer-autocomplete").text('');
        if (results.length) {
            for (i = 0, len = results.length; i < len; i = i + 1) {
                try {
                    $("#jquery-actioneer-autocomplete").append('<li>' + results[i].name + '</li>');
                } catch (e) {
                    jqueryActioneerAutocompleteError = true;
                    base.debug(e);
                }
            } // end results for loop
        } // end if results.length

        if (jqueryActioneerAutocompleteError === true) {
            base.debug("Autocomplete error.");
        }

        base.bindmouseactions();

    }, // end searchactions()


/*******************************************
*     Navigating / Keyboard                *
*******************************************/


    actionsmove: function (direction) {
        "use strict";

        var currentIndex = -1,
            maxIndex = $("#jquery-actioneer-autocomplete li").length;

        $("#jquery-actioneer-autocomplete li").each(function (index) {
            if ($(this).hasClass('selected') === true) {
                currentIndex = parseInt(index, 10);
            }
        });

        if (direction === 'down') {

            currentIndex += 1;

            $("#jquery-actioneer-autocomplete li").removeClass('selected');
            $("#jquery-actioneer-autocomplete li").eq(parseInt(currentIndex, 10)).addClass('selected');

            if (currentIndex > maxIndex - 1) {
                currentIndex = -1;
            }
                //base.debug(direction + ' - ' + parseInt(currentIndex));

        } else if (direction === 'up') {

            if (currentIndex === 0) {
                $("#jquery-actioneer-autocomplete li").removeClass('selected');
                currentIndex = -1;
            } else if (currentIndex === -1) {
                currentIndex = maxIndex - 1;
                $("#jquery-actioneer-autocomplete li").removeClass('selected');
                $("#jquery-actioneer-autocomplete li").eq(parseInt(currentIndex, 10)).addClass('selected');
            } else {
                currentIndex -= 1;
                $("#jquery-actioneer-autocomplete li").removeClass('selected');
                $("#jquery-actioneer-autocomplete li").eq(parseInt(currentIndex, 10)).addClass('selected');
            }
        } // end if
    }, // end actionsmove()



    selectaction: function () {
        "use strict";

        var currentIndex = -1,
            currentElement;

        $("#jquery-actioneer-autocomplete li").each(function (index) {
            if ($(this).hasClass('selected') === true) {
                currentIndex = parseInt(index, 10);
            }
        });

        // if something is written, but no action is selected, set first element as selected
        if ($("#jquery-actioneer-search").val() !== '' && currentIndex === -1 && base.options.searchResults.length >= 0) {
            currentIndex = 0;
            $("#jquery-actioneer-autocomplete li").eq(parseInt(currentIndex, 10)).addClass('selected');
        }

        // Check that something is selected
        if ($("#jquery-actioneer-search").val() !== '' || currentIndex !== -1) {

            if (base.options.currentAction === '' && base.options.searchResults[currentIndex].subactions === undefined) {

                base.execaction(currentIndex);

            } else if (base.options.currentAction === '') {

                // set current action to currently selected element.
                base.options.currentAction = base.options.searchResults[currentIndex];

                // find name for currently selected element and add it before the search field.
                currentElement = $("#jquery-actioneer-autocomplete li.selected").text();
                $("#jquery-actioneer-search").before('<span>' + currentElement + '</span>');
                $("#jquery-actioneer-search").val('');

                // invoke search of sub items
                base.searchactions();

            } else {
                base.execaction(currentIndex);
            }
        }
    }, // end selectaction()


/*******************************************
*     Mouse bindings                       *
*******************************************/

    bindmouseactions: function () {
        "use strict";

        $("#jquery-actioneer-autocomplete li").on('mouseenter', function () {
            $("#jquery-actioneer-autocomplete li.selected").removeClass("selected");
            $(this).addClass("selected");
        });

        $("#jquery-actioneer-autocomplete li").on('click', function () {
            base.selectaction();
        });

    }, // end bindmouseactions()


/*******************************************
*     Execute / Reset functions            *
*******************************************/

    resetstate: function () {
        "use strict";

        $('#jquery-actioneer').hide();
        $('#jquery-actioneer-search').show();
        $("#jquery-actioneer-search").val('');

        base.options.currentAction = "";

    }, // end resetstate()




    execaction: function (currentIndex) {
        "use strict";

        var currentElement;

        if (base.options.currentAction !== '') { $("#jquery-actioneer-search").before('<span> - </span>'); }

        currentElement = $("#jquery-actioneer-autocomplete li.selected").text();
        $("#jquery-actioneer-search").before('<span>' + currentElement + '</span>');


        if (typeof currentIndex === 'number') {

            $("#jquery-actioneer-autocomplete, #jquery-actioneer-search").hide();
            $("#jquery-actioneer-search").before('<span>...kjører!</span>');

            location.href = base.options.searchResults[currentIndex].action;

        }

        base.resetstate();
    },

/**************************************************************
*     DEBUG & TESTING                                         *
**************************************************************/
    debug: function (e) {
        "use strict";

        console.log(e);
    },


/**************************************************************
*     SELF DESTRUCT!                                          *
**************************************************************/
    _destroy: function () {
        "use strict";

        $.widget.prototype.destroy.call(this);
    },



    _setOption: function (key, value) {
        "use strict";

        this._super(key, value);
    }
});


$.widget.bridge("actioneer", $.efi.actioneer);

