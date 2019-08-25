const { remote } = require("electron");
module.exports = class Tabs {
    constructor() {
        this.tabId = 0;
        this.lastActiveId = -1;
        this.currentActiveId = 1;
        this.activeTabs = [1];
    }
    buttons = {
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
            '<svg class="close-nav" height="100%" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
        SVG_GLOB:
            '<svg xmlns="http://www.w3.org/2000/svg" width="356.902" height="356.902"><path d="M212.961 212.051c0-10.475-8.521-18.997-18.997-18.997-.401 0-.798.017-1.192.041v2.406c.395-.028.789-.061 1.192-.061 9.159 0 16.61 7.452 16.61 16.611s-7.451 16.61-16.61 16.61c-.269 0-.53-.027-.795-.041v7.129h-5.899v3.182h13.388v-3.182h-5.104v-4.774c9.734-.812 17.407-8.986 17.407-18.924zM126.261 90.111l-1.633 1.702 2.19 1.813 2.202-1.813zM28.355 86.149l-.191-2.01a191.432 191.432 0 0 0-4.903 8.116l5.094-6.106zM85.188 44.188v-2.782h-6.459l-.361 1.33h-3.932V46.628h8.882zM355.637 137.951l1.266 2.37a134.116 134.116 0 0 0-.708-3.021l-.558.651zM115.06 96.577l3.37-.633 2.701-1.714v-3.543h-6.071v5.89zM345.54 106.069a163.124 163.124 0 0 0-4.218-8.749l-1.139 1.266v7.883l3.509-.47 1.848.07zM85.031 54.982s.326-3.904 0-3.904c-.331 0-4.281.668-4.281.668l-6.303 1.783 1.696 1.999 8.888-.546zM317.155 71.208l3.544-5.223a184.523 184.523 0 0 0-8.912-10.027l-.023 8.685-7.761 3.887.767 2.562 12.385.116zM100.095 70.981l-4.27-1.011-4.722 2.237 2.916 5.902 4.601-1.452zM118.099 84.999v4.235l3.723-.895zM107.52 83.437l-5.177 2.12-1.01 2.556 4.055 1.121h10.793v-3.677h-1.569v-2.12z"/><path d="M339.439 114.04l-4.717-5.13-.906-8.22-4.822 2.603-2.613 10.068-6.972-7.337-.278-6.948-6.739-5.728-2.486-2.452h-7.808l2.463 6.89 9.411 5.176 1.627 1.726-2.022 1.011.082 5.449-4.59 1.894-3.903-.859-2.44-3.422 6.344.343 1.72-2.283-14.082-9.399-1.068-4.008-5.739 5.112-5.811-1.179-8.83 11.352-1.73 4.461-5.658.5-8.365.047-4.996-2.307-1.465-9.823 1.778-4.665 8.517-1.859 9.271 1.859 1.139-5.083-3.95-.93L271.157 83l9.329-1.44 6.53-9.126 6.738-1.116 6.089.889h2.23l-1.231-8.563-7.39 2.945-2.603-6.396-4.299-.587-.79-4.386 3.509-3.776 8.319-3.224 2.148-3.782C276.081 23.833 246.953 9.257 214.81 3.116c-.738-.127-1.453-.261-2.19-.389-3.306-.598-6.698-.987-10.091-1.406-6.663-.726-13.42-1.145-20.298-1.145-39.654 0-76.317 12.566-106.241 33.828l7.563-.058 4.061 2.225 7.651 1.615.604 2.974 12.147.442-1.656-3.857-10.788-.296 2.545-2.376-.889-2.812h-9.76l10.66-7.86h10.195l4.798 6.53 7.958.441 4.781-4.607 3.607 1.784-6.605 6.378s-9.15.146-8.697.146.761 6.222.761 6.222l11.09-.296 1.202-2.963 7.657-.453.895-4.438-4.485-.75 1.499-3.997 3.439-1.034 12.002.592-6.611 5.938 1.069 4.595 6.901 1.034-.465-8.284 6.605-3.416 11.706-1.331 16.952 7.424v6.379l5.402 1.33-2.713 5.031h-7.65l-2.26 5.786-17.504-4.072 13.745-7.232-5.234-4.404-11.839 1.476-1.057 1.063-.035-.012-.191.25-3.416 3.498-5.641.476.453 2.783 1.963.796-.069.93-4.595.639-.332 2.631-4.392.227-.784-5.223-7.877 2.365-16.086 9.318 1.784 6.553 4.502 2.904 9.004 1.226v10.114l4.166-.668 3.828-7.901 9.58-2.998V54.645l5.315-3.962 12.862 2.998-.9 8.011h3.445l9.463-4.595.447 10.521 6.89 4.147-.285 6.222-6.605 2.23.453 2.057 7.936 3.579-.139 4.299-2.312.198a.281.281 0 0 0-.023-.116l-10.038-3.056-.418-3.189h-.012l2.928-1.987v-2.905l-3.155-.772-.773 2.678-5.542.843-.552-.192v.273l-1.911.291-1.562-3.12-1.807-.772H156.9l-1.783 1.44v3.224l3.37 1.104 3.329.465-.749.331-3.044 3.323-1.325-1.667-2.934-.75-8 7.436 1.063.842-11.816 6.448-11.113 11.427-.75 5.077-11.125 7.232-5.53 5.484.616 10.974-7.663-3.526.064-6.425H78.217l-11.032 5.524-4.781 8.72-1.905 6.925 3.107 6.71 8.686 1.034 13.814-9.126 1.196 4.525-4.211 7.872 10.521 1.76 1.046 16.04 1.319.227c-.012-.012-.012-.023-.012-.023l.145.047 12.955 2.178 9.15-10.457 11.113 2.236 3.892 5.362 10.66-.627.285-3.108 5.867 2.812 6.6 10.219 11.397.168 4.212 7.267.599 8.889 12.618 4.746 15.9.151 4.659 7.547 7.047 2.23-1.336 6.239-7.732 9.702-2.248 21.471-6.983 5.461-10.34-.303-3.463 5.926 2.574 11.131-11.258 14.221-3.613 6.53-10.725 5.112-7.041 1.057-.296 2.963 4.949 1.406-.598 3.195-4.432 4.206 2.695 3.346 5.333.163-.296 4.078-1.417 3.996-.441 3.266 7.889 6.564-1.057 3.416-10.747-.197-10.683-9.237-8.325-14.466 1.174-13.965-6.304-8.319 2.545-14.059-3.724-1.058v-30.545s-10.515-7.877-11.113-7.877c-.604 0-5.554-1.313-5.554-1.313l-1.046-5.774-13.658-16.917 1.342-6.077.453-9.934 9.446-6.535-1.33-11.119-13.803-1.022-10.806-12.165-7.657-2.068-4.95-.906.604-4.45-6.303-.889v2.521l-15.755-3.852-6.344-9.591 2.202-3.939-2.603-.023-.75-2.498 1.841-.93-8.075-11.647-1.725-10.528h-4.061l1.359 10.23 6.902 10.526-.75 4.166-5.855-.889-7.187-12.136v-14.111l-7.505-3.573v-8.598c-3.985 9.289-7.163 19.008-9.544 29.018l2.475-.5 1.464 6.959 3.097 4.938 2.056 2.33 3.724 1.441-3.521 4.136-6.82.656H2.19l.581-6.019 4.264-.883-.372-2.817-3.532-2.213A179.492 179.492 0 0 0 0 179.215c.523 97.98 81.284 177.511 180.525 177.511 56.426 0 106.886-25.76 140.022-65.96h-5.937v-11.862l-6.902-9.168v-14.291l-5.252-5.158-.453-5.949 6.67-12.605-12.664-22.093 1.51-14.994-11.387-1.168-4.217-4.147h-7.657l-3.903 3.555h-13.501l-.441 1.191h-7.529l-17.219-19.421.116-15.133 2.858-1.034 1.068-5.78h-4.043l-1.673-6.083 19.961-14.227V122.33l9.76-5.362 3.95.389h8.04l6.285-3.329 20.264-1.568v10.23l15.976 4.008 3.16 2.225h2.928v-5.554l9.214-.883 8.771 6.448h14.408l.998-.906a164.83 164.83 0 0 0-4.867-14.146l-9.4.158zM78.264 184.153l-3.428.465v-7.709l1.11-1.243a171.582 171.582 0 0 1 4.148 8.557l-1.83-.07zm11.682 31.254l.558-.651c.238.999.477 1.975.715 2.975l-1.273-2.324z"/><path d="M100.641 99.563l3.167 1.673 7.662-10.549h-5.972l-4.165 4.438zM122.606 94.573v3.212l1.581 2.237h5.733v-3.445l-6.86-2.004zM115.06 99.691l-2.696.215-.894 3.892h5.734l2.596-2.562v-3.451l-4.165.564zM89.946 215.407l1.261 2.324c-.238-1-.477-1.977-.715-2.975l-.546.651zM74.836 176.909v7.709l3.428-.465 1.818.058a170.13 170.13 0 0 0-4.148-8.557l-1.098 1.255zM95.994 181.01l.116.023-.133-.046zM40.189 150.005l2.609.036.389-.715-1.9-2.748-1.847.941zM6.664 149.291l.372 2.823-4.264.877-.582 6.019h5.141l6.814-.65 3.526-4.142-3.724-1.441-2.062-2.329-3.09-4.938-1.464-6.96-2.475.5-.418.081a175.72 175.72 0 0 0-1.592 7.767l.285.18 3.533 2.213z"/></svg>'
    };
    loadBrowser = options => {
        var defaults = {
            showBackButton: true,
            showForwardButton: true,
            showReloadButton: true,
            showUrlBar: true,
            showAddTabButton: true,
            closableTabs: true,
            verticalTabs: false,
            defaultFavicons: false,
            newTabCallback: null,
            changeTabCallback: null,
            newTabParams: null
        };

        options = options ? Object.assign(defaults, options) : defaults;
        /**
         * ADD ELEMENTS
         */
        if (options.showBackButton) {
            $("#nav-body-ctrls").append(
                '<i id="nav-ctrls-back" class="nav-icons disabled" title="Go back">' +
                    this.buttons.SVG_BACK +
                    "</i>"
            );
        }
        if (options.showForwardButton) {
            $("#nav-body-ctrls").append(
                '<i id="nav-ctrls-forward" class="nav-icons disabled" title="Go forward">' +
                    this.buttons.SVG_FORWARD +
                    "</i>"
            );
        }
        if (options.showReloadButton) {
            $("#nav-body-ctrls").append(
                '<i id="nav-ctrls-reload" class="nav-icons disabled" title="Reload page">' +
                    this.buttons.SVG_RELOAD +
                    "</i>"
            );
        }
        if (options.showUrlBar) {
            $("#nav-body-ctrls").append(
                '<span class="urlnav"><img class="favicon" src="./images/earth.svg"/></span><input id="nav-ctrls-url" type="text" title="Enter an address or search term" autofocus></input>'
            );
        }
        // if (options.showAddTabButton) {
        //     $("#nav-body-tabs-container").append(
        //         `<div class="is-active nav-body-tab" data-tabid=${this.tabId}>
        //             <img class="favicon nav-icons" src="./images/earth.svg"/>
        //             <span class="electro-title">New Tab</span>
        //             <i class="nav-icons nav-tabs-clear" title="Add new tab">
        //                 ${this.buttons.SVG_CLEAR}
        //             </i>
        //         </div>`
        //     );
        // }
        this.addTab();
    };
    loadUrl = (url, tabid) => {
        if (!tabid) {
            tabid = this.currentActiveId;
        }

        const webview = $(`webview[data-tabid=${tabid}]`)[0];
        url = url ? this.purifyUrl(url) : this.purifyUrl("google.com");
        $(webview).attr("src", url);
        const loadPage = () => {
            this.setTitle(tabid, url);
            webview.loadURL(this.purifyUrl(url));
            webview
                .getWebContents()
                .on(
                    "certificate-error",
                    (event, url, error, certificate, callback) => {
                        event.preventDefault();
                        console.log(event, url, error, certificate);
                        callback(true);
                    }
                );
            webview
                .getWebContents()
                .on("login", (event, req, authInfo, callback) => {
                    event.preventDefault();
                    callback("storefront", "eComweb123");
                });
            webview.removeEventListener("dom-ready", loadPage);
        };
        webview.addEventListener("dom-ready", loadPage);
        this.setLoadingFavicon(tabid);
        this.attachEventListeners(tabid);
    };
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
    addTab = url => {
        this.tabId += 1;
        $("#nav-body-tabs-container")
            .children("div")
            .removeClass("is-active");
        $("#nav-body-tabs-container").append(
            `<div class="is-active nav-body-tab" data-tabid=${this.tabId}>
                <img class="favicon nav-icons" src="./images/earth.svg"/>
                <span class="electro-title">New Tab</span>
                <i class="nav-icons nav-tabs-clear" title="Add new tab">
                    ${this.buttons.SVG_CLEAR}
                </i>
            </div>`
        );
        $("#nav-body-views").append(
            `<webview class="nav-views-view active" src="" webpreferences="allowRunningInsecureContent" plugins data-tabid=${
                this.tabId
            }></webview>`
        );
        this.activeTabs.push(this.tabId);
        this.changeTab(this.tabId);
        this.loadUrl(url, this.tabId);
    };
    changeTab = tabid => {
        var navTab = $(`.nav-body-tab[data-tabid=${tabid}]`);
        $("#nav-body-tabs-container div").removeClass("is-active");
        $(navTab).addClass("is-active");
        $("webview").removeClass("active");
        $(`webview[data-tabid=${tabid}]`).addClass("active");
        $("#nav-ctrls-url").val(navTab.data("currenturl"));
        this.setFavicon(tabid, navTab.data("faviconurl"));

        this.lastActiveId = this.currentActiveId;
        this.currentActiveId = tabid;
        console.log("last=", this.lastActiveId, "this=", this.currentActiveId);
    };
    closeTab = tabid => {
        if ($(".nav-body-tab").length === 1) {
            remote.app.quit();
        }
        this.activeTabs.splice(this.activeTabs.indexOf(tabid), 1);
        if (this.lastActiveId === tabid) {
            this.setLastActiveTab();
        }
        $(`.nav-body-tab[data-tabid=${tabid}]`).remove();
        $(`webview[data-tabid=${tabid}]`).remove();

        if (this.currentActiveId === tabid) {
            $(`.nav-body-tab[data-tabid=${this.lastActiveId}]`).addClass(
                "is-active"
            );
            $(`webview[data-tabid=${this.lastActiveId}]`).addClass("active");
            this.currentActiveId = this.lastActiveId;
            this.setLastActiveTab();
        }
    };
    setLastActiveTab = () => {
        if (this.activeTabs.length > 1) {
            if (this.activeTabs[0] !== this.currentActiveId) {
                this.lastActiveId = this.activeTabs[0];
            } else {
                this.lastActiveId = this.activeTabs[1];
            }
        } else {
            this.lastActiveId = this.currentActiveId;
        }
        console.log("lst changed to", this.lastActiveId);
    };
    setTitle = (tabid, title) => {
        $(`.nav-body-tab[data-tabid=${tabid}] .electro-title`).text(title);
        remote.getCurrentWindow().setTitle(title);
    };
    setFavicon = (tabid, url) => {
        $(`.nav-body-tab[data-tabid=${tabid}] .favicon`).attr("src", url);
        $(".urlnav .favicon").attr("src", url);
        $(`.nav-body-tab[data-tabid=${tabid}] .favicon`).attr(
            "data-faviconurl",
            url
        );
    };
    setLoadingFavicon = tabid => {
        this.setFavicon(tabid, "./images/loading.gif");
    };
    attachEventListeners = tabid => {
        const webview = $(`webview[data-tabid=${this.tabId}]`)[0];
        webview.addEventListener("dom-ready", event => {
            this.setTitle($(event.target).data("tabid"), webview.getTitle());
            contextMenu({
                window: webview,
                labels: {
                    cut: 'Cut',
                    copy: 'Copy',
                    paste: 'Paste',
                    save: 'Save',
                    copyLink: 'Copy Link',
                    inspect: 'Inspect'
                }
            });
            // if (webview.isLoading() || webview.isWaitingForResponse()) {
            //     this.setFavicon(tabid, "./images/loading.gif");
            // }
            // webview.openDevTools();
        });
        webview.addEventListener("did-navigate", event => {
            $(`.nav-body-tab[data-tabid=${tabid}]`).attr(
                "data-currenturl",
                event.url
            );
            $("#nav-ctrls-url").val(event.url);
        });
        webview.addEventListener("page-favicon-updated", event => {
            this.setFavicon($(event.target).data("tabid"), event.favicons[0]);
        });
        // webview.addEventListener(
        //     "did-start-loading",
        //     this.setLoadingFavicon(tabid)
        // );
        // webview.addEventListener("new-window", event => {
        //     this.addTab(event.url);
        // });
    };
    addEvents = function (sessionID, options) {
        let currtab = $('.nav-tabs-tab[data-session="' + sessionID + '"]');
        let webview = $('.nav-views-view[data-session="' + sessionID + '"]');

        webview.on('dom-ready', function () {
            if (options.contextMenu) {
                
            }
        });
        webview.on('page-title-updated', function () {
            if (options.title == 'default') {
                currtab.find('.nav-tabs-title').text(webview[0].getTitle());
                currtab.find('.nav-tabs-title').attr('title', webview[0].getTitle());
            }
        });
        webview.on('did-start-loading', function () {
            NAV._loading(currtab);
        });
        webview.on('did-stop-loading', function () {
            NAV._stopLoading(currtab);
        });
        webview.on('enter-html-full-screen', function () {
            $('.nav-views-view.active').siblings().not('script').hide();
            $('.nav-views-view.active').parents().not('script').siblings().hide();
        });
        webview.on('leave-html-full-screen', function () {
            $('.nav-views-view.active').siblings().not('script').show();
            $('.nav-views-view.active').parents().siblings().not('script').show();
        });
        webview.on('load-commit', function () {
            NAV._updateCtrls();
        });
        webview[0].addEventListener('did-navigate', (res) => {
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            NAV._updateUrl(res.validatedUrl);
        });
        webview[0].addEventListener('did-navigate-in-page', (res) => {
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener("new-window", (res) => {
            if (!(options.newWindowFrameNameBlacklistExpression instanceof RegExp && options.newWindowFrameNameBlacklistExpression.test(res.frameName))) {
                NAV.newTab(res.url, {
                    icon: NAV.TAB_ICON
                });
            }
        });
        webview[0].addEventListener('page-favicon-updated', (res) => {
            if (options.icon == 'clean') {
                NAV._setTabColor(res.favicons[0], currtab);
            } else if (options.icon == 'default') {
                currtab.find('.nav-tabs-favicon').attr('src', res.favicons[0]);
            }
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            if (res.validatedURL == $('#nav-ctrls-url').val() && res.errorCode != -3) {
                this.executeJavaScript('document.body.innerHTML=' +
                    '<div style="background-color:whitesmoke;padding:40px;margin:20px;font-family:consolas;">' +
                    '<h2 align=center>Oops, this page failed to load correctly.</h2>' +
                    '<p align=center><i>ERROR [ ' + res.errorCode + ', ' + res.errorDescription + ' ]</i></p>' +
                    '<br/><hr/>' +
                    '<h4>Try this</h4>' +
                    '<li type=circle>Check your spelling - <b>"' + res.validatedURL + '".</b></li><br/>' +
                    '<li type=circle><a href="javascript:location.reload();">Refresh</a> the page.</li><br/>' +
                    '<li type=circle>Perform a <a href=javascript:location.href="https://www.google.com/search?q=' + res.validatedURL + '">search</a> instead.</li><br/>' +
                    '</div>'
                );
            }
        });
        return webview[0];
    }
};
