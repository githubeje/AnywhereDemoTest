$("#principal").live("pageinit",function(e) {		
	$("#close").click(function(e) {
		var sessionId = sessionStorage.getItem("11111111");
		$.ajax({ 
			type: "GET",
			url: "http://www.anywhere.cl/agenda/login/close",
			dataType:"json",
			data: { mngrsessionid : sessionId},
			crossDomain : true,
			success: function(data,status,jqXHR) {
				sessionStorage.removeItem(sessionId);
				top.location.href = "login.html";
			},
            beforeSend: function() { 
            	$.mobile.showPageLoadingMsg(); 
            },
			complete: function() {  
				$.mobile.hidePageLoadingMsg(); 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
		       alert("error : " + textStatus + "," + errorThrown);
		    }
		})			
		navigator.app.exitApp();
	});
});
