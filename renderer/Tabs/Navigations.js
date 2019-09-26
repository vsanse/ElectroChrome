var $ = require("jquery");
var Color = require("color.js");
const devices = require("../devices").devices;
var fs = require("fs");
var urlRegex = require("url-regex");
const contextMenu = require("electron-context-menu");
const { remote } = require("electron");
module.exports = class Navigation {
    constructor() {
        this.buttons = {
            SVG_BACK:
                '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
            SVG_FORWARD:
                '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
            SVG_RELOAD:
                '<svg height="100%" viewBox="0 0 24 24" id="nav-ready"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
            SVG_FAVICON:
                '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
            SVG_ADD:
                '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>',
            SVG_CLEAR:
                '<svg class="close-nav" height="100%" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        };
        this.SESSION_ID = 1;
        this.TAB_ICON = "clean";

        $("#nav-body-ctrls").append(
            '<i id="nav-ctrls-back" class="nav-icons disabled" title="Go back">' +
                this.buttons.SVG_BACK +
                "</i>"
        );

        $("#nav-body-ctrls").append(
            '<i id="nav-ctrls-forward" class="nav-icons disabled" title="Go forward">' +
                this.buttons.SVG_FORWARD +
                "</i>"
        );

        $("#nav-body-ctrls").append(
            '<i id="nav-ctrls-reload" class="nav-icons disabled" title="Reload page">' +
                this.buttons.SVG_RELOAD +
                "</i>"
        );

        $("#nav-body-ctrls").append(
            `<span class="urlnav"><i class="nav-tabs-favicon nav-icons" title="Add new tab">${this.buttons.SVG_FAVICON}</i></span><input id="nav-ctrls-url" type="text" title="Enter an address or search term"/><i class="fa fa-minus" aria-hidden="true"></i><input type="range" min="1" max="300" value="100" class="zoomLevel-slider" id="zoomLevel-slider"><i class="fa fa-plus" aria-hidden="true"></i><span class="zoomLevel">100%<span>`
        );
    }

    init = () => {
        $(".device-bar-wrapper").removeClass("active");
        this.newTab(this.purifyUrl( "https://www.github.com/"));
    };

    // Update forward back and reload
    updateCtrls = () => {
        let webview = $(".nav-views-view.active")[0];
        if (!webview) {
            $("#nav-ctrls-back").addClass("disabled");
            $("#nav-ctrls-forward").addClass("disabled");
            $("#nav-ctrls-reload")
                .html(this.SVG_RELOAD)
                .addClass("disabled");
            return;
        }
        if (webview.canGoBack()) {
            $("#nav-ctrls-back").removeClass("disabled");
        } else {
            $("#nav-ctrls-back").addClass("disabled");
        }
        if (webview.canGoForward()) {
            $("#nav-ctrls-forward").removeClass("disabled");
        } else {
            $("#nav-ctrls-forward").addClass("disabled");
        }
        if (webview.isLoading()) {
            this.loading();
        } else {
            this.stopLoading();
        }
        if (webview.getAttribute("data-readonly") == "true") {
            $("#nav-ctrls-url").attr("readonly", "readonly");
        } else {
            $("#nav-ctrls-url").removeAttr("readonly");
        }
    };

    // set loading animation
    loading = tab => {
        tab = tab || null;

        if (tab == null) {
            tab = $(".nav-body-tab.is-active");
        }
        tab.find(".nav-tabs-favicon").css(
            "animation",
            "nav-spin 2s linear infinite"
        );
        $(".urlnav .nav-tabs-favicon").css(
            "animation",
            "nav-spin 2s linear infinite"
        );
        $("#nav-ctrls-reload").html(this.buttons.SVG_CLEAR);
    };

    // stops loading animation
    stopLoading = tab => {
        tab = tab || null;

        if (tab == null) {
            tab = $(".nav-body-tab.is-active");
        }
        tab.find(".nav-tabs-favicon").css("animation", "");
        $(".urlnav .nav-tabs-favicon").css("animation", "");
        $("#nav-ctrls-reload").html(this.buttons.SVG_RELOAD);
    };

    //  return pretfied URL
    purifyUrl = url => {
        if (
            urlRegex({
                strict: false,
                exact: true
            }).test(url)
        ) {
            url = url.match(/^https?:\/\/.*/) ? url : "http://" + url;
        } else {
            url = !url.match(/^[a-zA-Z]+:\/\//)
                ? "https://www.google.com/search?q=" + url.replace(" ", "+")
                : url;
        }
        return url;
    };

    // sets url tab icon color to most used color
    setTabColor = url => {
        const getHexColor = new Color(url, {
            amount: 1,
            format: "hex"
        });
        getHexColor.mostUsed(result => {
            $(".nav-tabs-favicon svg").attr("fill", result);
        });
    };

    // sets favicon to current site
    setFavicon = (sessionID, url) => {
        $(`.nav-body-tab[data-session=${sessionID}] .nav-tabs-favicon`).attr(
            "src",
            url
        );
        $(`.nav-body-tab[data-session=${sessionID}] .favicon`).attr(
            "data-faviconurl",
            url
        );
    };

    // Add events on webview
    addEvents = (webview, sessionID) => {
        let currtab = $('.nav-body-tab[data-session="' + sessionID + '"]');
        webview.on("dom-ready", () => {
            contextMenu({
                window: webview[0],
                labels: {
                    cut: "Cut",
                    copy: "Copy",
                    paste: "Paste",
                    save: "Save",
                    copyLink: "Copy Link",
                    inspect: "Inspect"
                }
            });
        });
        webview.on("page-title-updated", () => {
            currtab.find(".nav-tabs-title").text(webview[0].getTitle());
            currtab
                .find(".nav-tabs-title")
                .attr("title", webview[0].getTitle());
        });
        webview.on("did-start-loading", () => {
            this.loading(currtab);
        });
        webview.on("did-stop-loading", () => {
            this.stopLoading(currtab);
        });
        webview.on("enter-html-full-screen", () => {
            $(".nav-views-view.active")
                .siblings()
                .not("script")
                .hide();
            $(".nav-views-view.active")
                .parents()
                .not("script")
                .siblings()
                .hide();
        });
        webview.on("leave-html-full-screen", () => {
            $(".nav-views-view.active")
                .siblings()
                .not("script")
                .show();
            $(".nav-views-view.active")
                .parents()
                .siblings()
                .not("script")
                .show();
        });
        webview.on("load-commit", () => {
            this.updateCtrls();
        });
        webview[0].addEventListener("did-navigate", res => { 
            this.updateUrl(res.url);
        });
        webview[0].addEventListener("did-finish-load", res => {
            this.navigateAllviews(webview, res.url);
        });
        webview[0].addEventListener("did-fail-load", res => {
            if (
                res.validatedURL == $("#nav-ctrls-url").val() &&
                res.errorCode != -3
            ) {
                webview[0].executeJavaScript(
                    "document.body.innerHTML=" +
                        '<div style="background-color:whitesmoke;padding:40px;margin:20px;font-family:consolas;">' +
                        "<h2 align=center>Oops, this page failed to load correctly.</h2>" +
                        "<p align=center><i>ERROR [ " +
                        res.errorCode +
                        ", " +
                        res.errorDescription +
                        " ]</i></p>" +
                        "<br/><hr/>" +
                        "<h4>Try this</h4>" +
                        '<li type=circle>Check your spelling - <b>"' +
                        res.validatedURL +
                        '".</b></li><br/>' +
                        '<li type=circle><a href="javascript:location.reload();">Refresh</a> the page.</li><br/>' +
                        '<li type=circle>Perform a <a href=javascript:location.href="https://www.google.com/search?q=' +
                        res.validatedURL +
                        '">search</a> instead.</li><br/>' +
                        "</div>"
                );
            }
            this.updateUrl(res.validatedUrl);
        });
        webview[0].addEventListener("did-navigate-in-page", res => {
            this.updateUrl(res.url);
        });
        webview[0].addEventListener("new-window", res => {
            this.newTab(res.url);
        });
        webview[0].addEventListener("page-favicon-updated", res => {
            this.setTabColor(res.favicons[0], currtab);
            this.setFavicon(currtab.data("session"), res.favicons[0]);
        });
        return webview[0];
    };

    // Updates URL in url input bar
    updateUrl = url => {
        url = url || null;
        let urlInput = $("#nav-ctrls-url");
        if (url == null) {
            if ($(".nav-views-view").length) {
                url = $("#large-device-view.active")[0].getURL()
            } else {
                url = "";
            }
        }
        urlInput.off("blur");
        if (!urlInput.is(":focus")) {
            urlInput.prop("value", url);
            urlInput.data("last", url);
        } else {
            urlInput.on("blur", () => {
                // if url not edited
                if (urlInput.val() == urlInput.data("last")) {
                    urlInput.prop("value", url);
                    urlInput.data("last", url);
                }
                urlInput.off("blur");
            });
        }
    };

    // Add new TAB in browser with google as Default for now
    newTab = (url) => {
        $(".nav-body-tab, .nav-views-view, .device.active").removeClass(
            "active"
        );

        // build tab
        let tab = `
            <div id=${this.SESSION_ID} class="nav-body-tab active" data-session=${this.SESSION_ID}>
                <img class="nav-tabs-favicon nav-icons favicon" src="./images/earth.svg"/>
                <i class="nav-tabs-title"> New Tab </i>
                <i class="nav-icons nav-tabs-clear" title="Add new tab">${this.buttons.SVG_CLEAR}</i>
            </div>
            `;
        $("#nav-body-tabs-container").append(tab);
        // add webview
        let composedWebviewTag = `<div class="device active large-device" id="large-device" data-session=${
            this.SESSION_ID
        }><webview class="nav-views-view active" id="large-device-view" data-session="${
            this.SESSION_ID
        }" src="${this.purifyUrl(
            url
        )}" plugins`;

        $("#nav-body-views").append(`${composedWebviewTag}></webview></div>`);
        // enable reload button
        $("#nav-ctrls-reload").removeClass("disabled");

        // update url and add events
        this.updateUrl(this.purifyUrl(url));
        let webview = $(
            '.nav-views-view[data-session="' + this.SESSION_ID + '"]'
        );
        this.createDeviceBar(this.SESSION_ID);
        let newWebview = this.addEvents(webview, this.SESSION_ID++);
        (this.changeTabCallback || (() => {}))(newWebview);
        return newWebview;
    };

    // Change Tab
    changeTab = (url, id) => {
        id = id || null;
        if (id == null) {
            $(".nav-views-view.active").attr("src", this.purifyUrl(url));
        } else {
            if ($("#" + id).length) {
                $("#" + id).attr("src", this.purifyUrl(url));
            } else {
                console.log(
                    'ERROR[electron-navigation][func "changeTab();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }
    };
    // Close Tab
    closeTab = id => {
        if ($(".nav-body-tab").length === 1) {
            remote.app.quit();
        }
        id = id || null;
        var session;
        if (id == null) {
            session = $(".nav-body-tab.active, .nav-views-view.active");
        } else {
            if ($("#" + id).length) {
                var sessionID = $("#" + id).data("session");
                session = $(".nav-body-tab, .nav-views-view").filter(
                    '[data-session="' + sessionID + '"]'
                );
            } else {
                console.log(
                    'ERROR[electron-navigation][func "closeTab();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
                return false;
            }
        }
        if (session.hasClass("active")) {
            if (session.next(".nav-body-tab").length) {
                session.next().addClass("active");
                (this.changeTabCallback || (() => {}))(session.next()[1]);
            } else {
                session.prev().addClass("active");
                (this.changeTabCallback || (() => {}))(session.prev()[1]);
            }
        }
        session.remove();
        this.updateUrl();
        this.updateCtrls();
    };

    // go back on current or specified view
    //
    back = id => {
        id = id || null;
        if (id == null) {
            $(".nav-views-view.active")[0].goBack();
        } else {
            if ($("#" + id).length) {
                $("#" + id)[0].goBack();
            } else {
                console.log(
                    'ERROR[electron-navigation][func "back();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }
    }; //:back()
    //
    // go forward on current or specified view
    //
    forward = id => {
        id = id || null;
        if (id == null) {
            $(".nav-views-view.active")[0].goForward();
        } else {
            if ($("#" + id).length) {
                $("#" + id)[0].goForward();
            } else {
                console.log(
                    'ERROR[electron-navigation][func "forward();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }
    }; //:forward()
    //
    // reload current or specified view
    //
    reload = id => {
        id = id || null;
        if (id == null) {
            let views = $(".nav-views-view.active");
            for (let view = 0; view < views.length; view++) {
                views[view].reload();
            }
        } else {
            if ($("#" + id).length) {
                $("#" + id)[0].reload();
            } else {
                console.log(
                    'ERROR[electron-navigation][func "reload();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }
    }; //:reload()
    //
    // stop loading current or specified view
    //
    stop = id => {
        id = id || null;
        if (id == null) {
            $(".nav-views-view.active")[0].stop();
        } else {
            if ($("#" + id).length) {
                $("#" + id)[0].stop();
            } else {
                console.log(
                    'ERROR[electron-navigation][func "stop();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }
    }; //:stop()
    //
    // listen for a message from webview
    //
    listen = (id, callback) => {
        let webview = null;

        //check id
        if ($("#" + id).length) {
            webview = document.getElementById(id);
        } else {
            console.log(
                'ERROR[electron-navigation][func "listen();"]: Cannot find the ID "' +
                    id +
                    '"'
            );
        }

        // listen for message
        if (webview != null) {
            try {
                webview.addEventListener("ipc-message", event => {
                    callback(event.channel, event.args, webview);
                });
            } catch (e) {
                webview.addEventListener("dom-ready", event => {
                    webview.addEventListener("ipc-message", event => {
                        callback(event.channel, event.args, webview);
                    });
                });
            }
        }
    }; //:listen()
    //
    // send message to webview
    //
    send = (id, channel, args) => {
        let webview = null;

        // check id
        if ($("#" + id).length) {
            webview = $(`webview[data-session=${id}]`);
        } else {
            console.log(
                'ERROR[electron-navigation][func "send();"]: Cannot find the ID "' +
                    id +
                    '"'
            );
        }
        // send a message
        if (webview != null) {
            try {
                webview[0].send(channel, args);
            } catch (e) {
                webview[0].addEventListener("dom-ready", event => {
                    webview[0].send(channel, args);
                });
            }
        }
    }; //:send()
    //
    // open developer tools of current or ID'd webview
    //
    openDevTools = id => {
        id = id || null;
        let webview = null;

        // check id
        if (id == null) {
            webview = $(".nav-views-view.active")[0];
        } else {
            if ($("#" + id).length) {
                webview = document.getElementById(id);
            } else {
                console.log(
                    'ERROR[electron-navigation][func "openDevTools();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }

        // open dev tools
        if (webview != null) {
            try {
                webview.openDevTools();
            } catch (e) {
                webview.addEventListener("dom-ready", event => {
                    webview.openDevTools("right");
                });
            }
        }
    }; //:openDevTools()
    //
    // print current or specified tab and view
    //
    printTab = (id, opts) => {
        id = id || null;
        let webview = null;

        // check id
        if (id == null) {
            webview = $(".nav-views-view.active")[0];
        } else {
            if ($("#" + id).length) {
                webview = document.getElementById(id);
            } else {
                console.log(
                    'ERROR[electron-navigation][func "printTab();"]: Cannot find the ID "' +
                        id +
                        '"'
                );
            }
        }

        // print
        if (webview != null) {
            webview.print(opts || {});
        }
    };
    //:nextTab()
    //
    // toggle next available tab
    //
    nextTab = () => {
        var tabs = $(".nav-body-tab").toArray();
        var activeTabIndex = tabs.indexOf($(".nav-body-tab.active")[0]);
        var nexti = activeTabIndex + 1;
        if (nexti > tabs.length - 1) nexti = 0;
        $($(".nav-body-tab")[nexti]).trigger("click");
        return false;
    }; //:nextTab()
    //:prevTab()
    //
    // toggle previous available tab
    //
    prevTab = () => {
        var tabs = $(".nav-body-tab").toArray();
        var activeTabIndex = tabs.indexOf($(".nav-body-tab.active")[0]);
        var nexti = activeTabIndex - 1;
        if (nexti < 0) nexti = tabs.length - 1;
        $($(".nav-body-tab")[nexti]).trigger("click");
        return false;
    }; //:prevTab()
    // go to a tab by index or keyword
    //
    goToTab = index => {
        let $activeTabAndView = $(
            "#nav-body-tabs .nav-body-tab.active, #nav-body-views .nav-views-view.active"
        );
        let $tabAndViewToActivate;
        if (index == "previous") {
            $tabAndViewToActivate = $activeTabAndView.prev(
                "#nav-body-tabs .nav-body-tab, #nav-body-views .nav-views-view"
            );
        } else if (index == "next") {
            $tabAndViewToActivate = $activeTabAndView.next(
                "#nav-body-tabs .nav-body-tab, #nav-body-views .nav-views-view"
            );
        } else if (index == "last") {
            $tabAndViewToActivate = $(
                "#nav-body-tabs .nav-body-tab:last-of-type, #nav-body-views .nav-views-view:last-of-type"
            );
        } else {
            $tabAndViewToActivate = $(
                "#nav-body-tabs .nav-body-tab:nth-of-type(" +
                    index +
                    "), #nav-body-views .nav-views-view:nth-of-type(" +
                    index +
                    ")"
            );
        }

        if ($tabAndViewToActivate.length) {
            $("#nav-ctrls-url").blur();
            $activeTabAndView.removeClass("active");
            $tabAndViewToActivate.addClass("active");

            this.updateUrl();
            this.updateCtrls();
        }
    }; //:goToTab()
    // go to a tab by id of the webview tag
    goToTabByWebviewId = id => {
        const webviews = document.querySelectorAll("webview.nav-views-view");
        for (let index in webviews) {
            if (webviews[index].id == id) {
                this.goToTab(index + 1);
                return;
            }
        }
    }; //:goToTabByWebviewId()
    goToTabByWebviewId = id => {
        let $activeTabAndView = $(
            "#nav-body-tabs .nav-body-tab.active, #nav-body-views .nav-views-view.active, .device.active"
        );
        let $tabAndViewToActivate = $(
            `#nav-body-tabs .nav-body-tab[data-session=${id}], #nav-body-views .nav-views-view[data-session=${id}], .device[data-session=${id}]`
        );
        $activeTabAndView.removeClass("active");
        $tabAndViewToActivate.addClass("active");
        this.updateUrl();
        this.updateCtrls();
        this.setTabColor($(".nav-views-view.active")[0].getURL());
    };

    // add a device
    addDevice = device => {
        let sessionID = $(".nav-body-tab.active").data("session");
        let devicename = $(device).data("name");
        let composedWebviewTag = `
        <div class="device active" id="${devicename}-device" data-session=${sessionID}><div class="top-bar"><span>${$(
            device
        ).data(
            "displayname"
        )}<span></div><span class="captureview" title="screenshot"><i class="fa fa-camera-retro" aria-hidden="true"></i></span><span class="rotate" title="rotate"><i class="fa fa-mobile" aria-hidden="true"></i></span><div class="view-wrapper" style="width:${$(
            device
        ).data("width")}px;height:${$(device).data(
            "height"
        )}px"><webview class="nav-views-view active" partition="persist:devices" id="${devicename}-${sessionID}" data-session="${sessionID}" src="${$(
            "#large-device-view.active"
        )[0].getURL()}"></webview></div></div>`;
        $("#nav-body-views").prepend(composedWebviewTag);
        this.addEvents($(`#${devicename}-${sessionID}`), sessionID);
    };

    setZoomFactor = zoomfactor => {
        let webviews = $(".nav-views-view.active");
        console.log(webviews[0])
        for (let webview = 0; webview < webviews.length; webview++) {
            if ($(webviews[webview])
                    .parent()
                    .hasClass("view-wrapper")
            ) {
                try {
                    webviews[webview].setZoomFactor(zoomfactor);
                } catch (e) {
                    webviews[webview].addEventListener("dom-ready", event => {
                        webviews[webview].setZoomFactor(zoomfactor);
                    });
                }
            }
        }
    };

    // get same view in all browser
    navigateAllviews = (currentView, url) => {
        let webviews = $(".nav-views-view.active");
        url = url ? url : $(currentView).attr("src");
        for (let webview = 0; webview < webviews.length; webview++) {
            if (
                $(webviews[webview]).attr("src") !== $(currentView).attr("src")
            ) {
                $(webviews[webview]).attr("src", url);
            }
        }
    };

    // Create device top bar
    createDeviceBar = (sessionID) =>{
        $(".device-bar").append(`<div class="device-bar-wrapper active" data-session=${sessionID}></div>`);
        for (var device in devices) {
            $(`.device-bar-wrapper[data-session=${sessionID}]`).append(
                `<div id="view-${device}" class="view-device" data-name="${device}" data-displayname="${devices[device].name}" data-width=${devices[device].width} data-height=${devices[device].height}><span>${devices[device].name}</span></div>`
            );
        }
        $(`.device-bar-wrapper[data-session=${sessionID}]`).append(
            '<div class="view-device add-device"><span><i class="fa fa-plus-square-o" aria-hidden="true"></i></span></div>'
        );
    }
};
