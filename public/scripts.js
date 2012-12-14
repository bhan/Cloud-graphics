function get_server_data(time) {
	$.get("cloth", {"time": time}, function(data) {
		alert("data: " + JSON.stringify(data));
	});
}

function init() {
	get_server_data(5);
}
