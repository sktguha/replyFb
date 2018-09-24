var sc = document.createElement("script");
sc.src = "https://code.jquery.com/jquery-3.3.1.js";
document.body.appendChild(sc);

document.oncontextmenu = function(e){
    var pc = "._5yl5";
    
//     if(e.target.tagName !== "SPAN") return;
//     if(e.target.)
    if(!$(e.target).parents(pc)[0]) return;
    var dv = document.createElement("div");
    $(dv).text("Reply");
    dv.style = "position:absolute;z-index:10000000;" 
     + "padding: 4px 10px 4px 10px;background:black;color:white;cursor:pointer;";
    dv.style.left = e.clientX - 21 + "px";
    dv.style.top = e.clientY + (319 - 156 )+ "px";
    
    dv.dataset.srcElem = e.target.innerText;
    document.body.appendChild(dv);
    dv.tabIndex = -1;
    dv.focus();
    var hidden = false;
    function hideDv(){
        try {
           dv.parentElement.removeChild(dv);
        } catch(e){
            
        }
    }
    dv.onblur = hideDv;
    dv.onclick = function(){
        hideDv();
        var te = $(e.target).parents('._4tdt').parents(".fbNubFlyoutInner").find(".fbNubFlyoutFooter")[0];
        var dv = $(te).find("._18yz")[0];
        
        var repDv = document.createElement("div");
        repDv.style = "background:rgb(246, 241, 241);" + 
            "padding-left: 3px;border-left:3px solid blue;" 
            + "position:relative;";
        repDv.innerText = e.target.innerText;
        repDv.dataset.replyContent = e.target.innerText;
        var elem = e.target;
        do{
          elem = elem.parentElement;
        } while ( elem && elem.className.indexOf("fantaTabMain-user") === -1);

        var cls = Array.from(elem.classList).find(function(cls){
          return cls.indexOf("fantaTabMain-user:")!==-1;
        });
        var userId = cls.split("fantaTabMain-user:")[1]*1;
        
        var qid = "replycontentcustom" + userId;
        repDv.id = qid;
        var cross = document.createElement("div");
        cross.innerText = "x";
        cross.style = "position:absolute;right:3px;top:-1px;cursor:pointer;"
        cross.onclick = function(){
            repDv.parentElement.removeChild(repDv);
        }
        
        repDv.appendChild(cross);
        dv.prepend(repDv);
    }
    return false;
}


registerHook();
//need to verify if using chrome.tabs.onUpdate.addListener approach is better than this
//In future changing the requestBody data in a  "post" request using the webrequest api can be used if support is added ,
// can intercept the network call to send.php
// https://bugs.chromium.org/p/chromium/issues/detail?id=91191 . (support for this already exists on firefox)
function intercept(body){
    if(body && body.indexOf("action_type=ma-type%3Auser-generated-message") !== -1){
        var paramsArr = body.split("&");
        var userId = paramsArr.filter(function(part){
           return part.startsWith("other_user_fbid=");
        })[0];
        userId = userId.split("other_user_fbid=")[1]*1;
        var qid = "replycontentcustom" + userId;
        var replyDiv = document.getElementById(qid);
        if(!replyDiv) return body;

        var mbd = paramsArr.findIndex(function(part){
           return part.startsWith("body=");
        });
        if(mbd === -1){
            return body;
        }
        var mparam = paramsArr[mbd];
        var msg = mparam.split("body=")[1];
        msg += encodeURIComponent("replied to : " + replyDiv.dataset.replyContent);
        paramsArr[mbd] = "body="+msg;
        body = paramsArr.join("&");
        replyDiv.parentElement.removeChild(replyDiv);
    }
    return body;
}
function registerHook(){
(function(send) {
    XMLHttpRequest.prototype.send = function() {
        arguments[0] = intercept(arguments[0]);        
		send.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.send);
}
