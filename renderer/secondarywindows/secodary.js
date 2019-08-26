var {ipcRenderer, remote} = require('electron')
var $ = require("jquery");

let loginCred = {
    username:"",
    password:"",
    canceled:false,
    isUpdate:true
  }
$(".cancel").on("click",()=>{
    loginCred.canceled = true;
    loginCred.isUpdate = true;
    ipcRenderer.send("loginchannel",loginCred);
    remote.getCurrentWindow().close();
})
const sendvar = $(".submit").on("click", ()=>{
    loginCred.username = $(".username").val();
    loginCred.password = $(".password").val();
    loginCred.isUpdate = true;
    ipcRenderer.send("loginchannel",loginCred);
    remote.getCurrentWindow().close();
})
