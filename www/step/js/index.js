$("#principal").live("pageinit",function(e) {
	$("#close").click(function(e) {
		var sessionId = sessionStorage.getItem("13004443");
		$.ajax({ 
			type: "GET",
			url: "http://www.anywhere.cl/tradeagenda/login/close",
			dataType:"json",
			data: { mngrsessionid : sessionId},
			crossDomain : true,
			success: function(data,status,jqXHR) {
				sessionStorage.removeItem(sessionId);
				top.location.href = "login.html";
			},
			beforeSend: function() {
			    e.preventDefault();
			    e.stopPropagation();					
				$.mobile.loading("show");
			},            	
			error: function(XMLHttpRequest, textStatus, errorThrown) {
		       alert("error : " + textStatus + "," + errorThrown);
		    }
		})			
		navigator.app.exitApp();
	});
});