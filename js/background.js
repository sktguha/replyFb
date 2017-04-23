chrome.runtime.onMessage.addListener(function(req){
	document.execCommand('paste');
});