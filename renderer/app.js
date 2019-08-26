var $ = require("jquery");
var { ipcRenderer, remote } = require("electron");
const devices = require("./devices").devices;
const tabs = new (require("./Tabs/Navigations"))();
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

for (var device in devices) {
    $(".device-bar").append(
        `<div id="view-${device}" class="view-device" data-name=${device} data-width=${devices[device].width} data-height=${devices[device].height}><span>${device}</span><button>${devices[device].width} &times; ${devices[device].height}</button></div>`
    );
}

$(".view-device").on("click", function(){
    if($(this).hasClass('active')){
        let deviceName = $(this).data("name");
        $(`#${deviceName}-device`).remove();
    }
    else{
        tabs.addDevice($(this)[0]);
    }
    $(this).toggleClass("active");
})