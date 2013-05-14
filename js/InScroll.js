function InScroll( container, options ) {
  "use strict";
	
	// utilities
	var noop = function() {};
	
	var inter = null;
	
	if(!container) {
		alert('container element not provided');
		return;
	}
	if(!options.interval) options.interval = 500;
	
	if(!options.onBeforeLoad) options.onBeforeLoad = noop;
	
	// save screen info
	var page = {
		contentHeight: $(container).getHeight(),
		pageHeight: document.viewport.getHeight(),
		scrollPosition : 0,
	}

	function scroll() {
		var querystr = options.onBeforeLoad();
		if( !querystr ) return;
		
		// get scroll position y-axis.
		page.scrollPosition = document.viewport.getScrollOffsets()[1];
		
		if( Ajax.activeRequestCount == 0 && (page.contentHeight - page.pageHeight - page.scrollPosition ) < 100) {		
			new Ajax.Request(options.url + querystr , {
				onSuccess: append,
				onFailure: error,
				onComplete: onComplete
				
			});
		}
	}
	function onComplete() {
		page.contentHeight= $(container).getHeight();
	}
	
	function append( response ) {
		var resp = response.responseText.strip();
		
		if(resp == "") kill();
		
		container.innerHTML += resp;
	}
	
	function error( response ) {
		var resp = response.responseText.strip();
		container.innerHTML += resp;
	}
	
	function start() {
		
		if(!container) {
			alert('container element not provided');
			return;
		}
		
		if(!options || !options.url) {
			alert('content loader script should be set as options.url');
			return;
		}
		
		inter = window.setInterval( scroll, 50);
	}
	
	function kill() {
		clearInterval(inter);
		$(options.loader).hide();
	}
	return {
		start: start,
		kill : kill,
	}
}
