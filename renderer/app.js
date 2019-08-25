var $ = require("jquery");
var Color = require("color.js");
var urlRegex = require("url-regex");
const contextMenu = require("electron-context-menu");
const tabs = new (require("./Tabs/Tabs"))();
tabs.loadBrowser();
$("#nav-ctrls-url").on("keyup", event => {
    if (event.keyCode === 13) {
        tabs.loadUrl($("#nav-ctrls-url").val());
    }
});
$(".nav-tabs-add").on("click", event => {
    tabs.addTab();
});
$("#nav-body-tabs-container").on("click", ".nav-body-tab", event => {
    if (!$(event.target).parent().hasClass("nav-tabs-clear")) {
        tabs.changeTab(
            $(event.target)
                .closest(".nav-body-tab")
                .data("tabid")
        );
    }
});
$("#nav-body-tabs-container").on("click", ".nav-tabs-clear", event => {
    tabs.closeTab(
        $(event.target)
            .closest(".nav-body-tab")
            .data("tabid")
    );
});
