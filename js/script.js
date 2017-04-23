var lock;
$(document).on('click','body *', function(){
//var pr = $(this).parents('._4tdt');
if ($(this).hasClass('_5yl5') && !lock) {
	 lock = true;
     var res = window.prompt("enter reply");
     var te = $(this).parents('._4tdt').parents(".fbNubFlyoutInner").find(".fbNubFlyoutFooter")[0];
	 var text = res + "\n----in reply to-----\n" +$(this).text() + "\n------------\n";
	 copyText(text);
	 te.click();
	 setTimeout(function(){
        chrome.runtime.sendMessage({cmd : "paste"});
        setTimeout(function(){
            lock = false;
        }, 3000);
     }, 3000);
	}
});

function copyText(text){
	var textarea = document.createElement("textarea");
	document.body.appendChild(textarea);
	textarea.value = text;
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);
}