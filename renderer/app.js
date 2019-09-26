var $ = require("jquery");

const tabs = new (require("./Tabs/Navigations"))();
var { ipcRenderer, remote } = require("electron");
tabs.init();
//
// add a tab, default to google.com
//
$(".nav-tabs-add").on("click", event => {
    tabs.init();
});
$("#nav-body-tabs-container").on("click", ".nav-body-tab", event => {
    if (
        !$(event.target)
            .parent()
            .hasClass("nav-tabs-clear")
    ) {
        tabs.goToTabByWebviewId(
            $(event.target)
                .closest(".nav-body-tab")
                .data("session")
        );
    }
});
$("#nav-body-tabs-container").on("click", ".nav-tabs-clear", event => {
    tabs.closeTab(
        $(event.target)
            .closest(".nav-body-tab")
            .data("session")
    );
});

//
// go back
//
$("#nav-body-ctrls").on("click", "#nav-ctrls-back", function() {
    tabs.back();
});
//
// go forward
//
$("#nav-body-ctrls").on("click", "#nav-ctrls-forward", function() {
    tabs.forward();
});
//
// reload page
//
$("#nav-body-ctrls").on("click", "#nav-ctrls-reload", function() {
    if ($(this).find("#nav-ready").length) {
        tabs.reload();
    } else {
        tabs.stop();
    }
});
//
// highlight address input text on first select
//
$("#nav-ctrls-url").on("focus", function(e) {
    $(this)
        .one("mouseup", function() {
            $(this).select();
            return false;
        })
        .select();
});
//
// load or search address on enter / shift+enter
//
$("#nav-ctrls-url").keyup(e => {
    if (e.keyCode == 13) {
        tabs.changeTab($("#nav-ctrls-url").val());
    }
});

$(document).on("click", ".view-device", function() {
    if ($(this).hasClass("active")) {
        let deviceName = $(this).data("name");
        $(`#${deviceName}-device`).remove();
    } else {
        tabs.addDevice($(this)[0]);
    }
    $(this).toggleClass("active");
});

$(document).on("input change", ".zoomLevel-slider", function() {
    var zoomFactor = $(this).val();
    setzoom(zoomFactor);
});

$("#nav-body-ctrls").on("click", ".fa-minus", function() {
    var currZoom = parseInt($(".zoomLevel-slider").val());
    $(".zoomLevel-slider").val(currZoom - 1);
    setzoom(currZoom - 1);
});
$("#nav-body-ctrls").on("click", ".fa-plus", function() {
    var currZoom = parseInt($(".zoomLevel-slider").val());
    $(".zoomLevel-slider").val(currZoom + 1);
    setzoom(currZoom + 1);
});

function setzoom(zoomFactor) {
    $(".zoomLevel").text(zoomFactor + "%");
    $("#nav-body-views").css("zoom", zoomFactor * 0.01);
    tabs.setZoomFactor(zoomFactor * 0.01);
}

$(document).on("click", ".captureview", function() {
    let $viewWrapper = $(this).siblings(".view-wrapper");
    let $deviceDiv = $(this).parent(".device");
    options = {
        width: parseInt($viewWrapper.css("width").split("px")[0]),
        height: parseInt($viewWrapper.css("height").split("px")[0]),
        url: $deviceDiv.find("webview")[0].getURL(),
        device: $deviceDiv.attr("id")
    };
    ipcRenderer.send("windowchannel", options);
});

$(document).on("click", ".rotate", function() {
    $(this).toggleClass("landscape");
    var $view = $(this).siblings(".view-wrapper");
    $view.toggleClass("landscape");
    var width = $view.css("width");
    $view.css("width", $view.css("height"));
    $view.css("height", width);
});
