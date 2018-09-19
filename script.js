var sc = document.createElement("script");
sc.src = "https://code.jquery.com/jquery-3.3.1.js";
document.body.appendChild(sc);

document.oncontextmenu = function(e){
    var pc = "._5yl5";
    
//     if(e.target.tagName !== "SPAN") return;
//     if(e.target.)
    if(!$(e.target).parents(pc)[0]) return;
    var dv = document.createElement("div");
    dv.innerText = "Reply"
    dv.style.left = e.clientX + "px";
    dv.style.top = e.clientY + "px";
    dv.style.position = "absolute";
    dv.style.zIndex = "10000000";
    dv.dataset.srcElem = e.target.innerText;
    document.body.appendChild(dv);
    dv.tabIndex = -1;
    dv.focus();
    dv.onblur = function(){
        dv.parentElement.removeChild(dv);
    }
    dv.onclick = function(){
        var te = $(e.target).parents('._4tdt').parents(".fbNubFlyoutInner").find(".fbNubFlyoutFooter")[0];
        var dv = $(te).find("._18yz")[0];
        
        var repDv = document.createElement("div");
        repDv.innerText = e.target.innerText;
        var cross = document.createElement("cross");
        cross.innerText = "x";
        cross.onclick = function(){
            repDv.parentElement.removeChild(repDv);
        }
        repDv.appendChild(cross);
        dv.prepend(repDv);
    }
    return false;
}

