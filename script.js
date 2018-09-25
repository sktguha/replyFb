var sc = document.createElement("script");
sc.src = "https://code.jquery.com/jquery-3.3.1.js";
document.body.appendChild(sc);

document.oncontextmenu = function(e){
    var clsName = "_5yl5";
    var pc = "."+ clsName;
    var target = e.target;
    if(target.tagName === "DIV"){
       target = $(target).children(pc)[0];   
    }
    if( !($(e.target).parents(pc)[0] || $(target).hasClass(clsName)) ) {
    	return;
    } 

    var dv = document.createElement("div");
    $(dv).text("Reply");
    dv.style = "position:absolute;z-index:10000000;" 
     + "padding: 4px 10px 4px 10px;background:black;color:white;cursor:pointer;";
    dv.style.left = e.clientX - 21 + "px";
    dv.style.top = e.clientY + (273 + 170 )+ "px";
    
    dv.dataset.srcElem = target.innerText;
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
        var mainContainer = $(target).parents('._4tdt').parents(".fbNubFlyoutInner");
        var te = mainContainer.find(".fbNubFlyoutFooter")[0];
        var dv = $(te).find("._18yz")[0];
        
        var repDv = document.createElement("div");
        repDv.style = "background:rgb(246, 241, 241);" + 
            "padding-left: 3px;border-left:3px solid blue;" 
            + "position:relative;" 
            + "white-space: nowrap; overflow: hidden; " 
            + "text-overflow: ellipsis;";
        repDv.innerText = target.innerText;
        repDv.dataset.replyContent = target.innerText;
        var elem = target;
        do{
          elem = elem.parentElement;
        } while ( elem && elem.className.indexOf("fantaTabMain-user") === -1);

        var cls = Array.from(elem.classList).find(function(cls){
          return cls.indexOf("fantaTabMain-user:")!==-1;
        });
        var userId = cls.split("fantaTabMain-user:")[1]*1;
        
        var qid = "replycontentcustom" + userId;
        var oldDiv = document.getElementById(qid);
        if(oldDiv){
          oldDiv.parentElement.removeChild(oldDiv);	
        }
        repDv.id = qid;
        var cross = document.createElement("div");
        cross.innerText = "x";
        cross.className = "repCross"
        cross.style = "color:black;position:absolute;right:3px;top:-1px;cursor:pointer;zoom:1.4;background:rgb(246, 241, 241);" + 
          "border-left : 4px solid rgb(246, 241, 241);" + 
          "border-right : 2px solid rgb(246, 241, 241);";
        cross.onclick = function(){
            repDv.parentElement.removeChild(repDv);
        }
        
        repDv.appendChild(cross);
        dv.prepend(repDv);
        setTimeout(() => { mainContainer.find("._5wd4").last()[0].click(); }, 40);
    }
    return false;
}



//----------------- portion to intercept network requests------------------
//registerHook();
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
		var tx = replyDiv.dataset.replyContent;
		var words = tx.replace( /\n/g, " " ).split( " " )
		var lineStart = "  ";
		var fns = "\n===== In Reply To =====\n" + lineStart;
		var limit = 15;
		var ct = 0;
		var breaks = 0;
		for (var i = 0;i<words.length;i++){
		   if(ct > limit){
			  fns += "\n" + lineStart;
			  ct = 0;
			  breaks ++;
			  if(breaks === 2){
				  fns = fns.slice(0,-3) + "..."
				  break;
			  }
		   }
		   fns += " " + words[i];
           ct += words[i].length;
		}
		msg += encodeURIComponent(fns);
        paramsArr[mbd] = "body="+msg;
        body = paramsArr.join("&");
		setTimeout(function(){
			var lastmsg = $(replyDiv).parents(".fbNubFlyoutInner").find("._5yl5").last()[0];
			lastmsg.innerText = decodeURIComponent(msg);
			replyDiv.parentElement.removeChild(replyDiv);
		}, 400);
    }
    return body;
}
function registerHook(){
(function(send) {
    XMLHttpRequest.prototype.send = function() {
        try{
		   arguments[0] = intercept(arguments[0]);	
		} catch(e){
			console.error(e);
		}
		send.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.send);
}

var string = intercept.toString() + ";" + registerHook.toString()+"; registerHook();";
var sc = document.createElement("script");
sc.textContent = string;
document.body.appendChild(sc);
