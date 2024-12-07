var vm = new Vue({
	el: '#mainframe',
	data: {
		UserName: ''
	},
	methods: {
		seeSuccess() {
			alert("提交成功")
			$('#feedModal').modal('hide');
		},
		logout() {
			console.log('登出方法被触发');
			sessionStorage.removeItem('userID');
			this.clearCookies();
			window.location.href = 'Index.html';
		},
		clearCookies() {
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=" + new Date(0).toUTCString() + ";path=/";
			}
		}
	},
	created() {
		var _this = this;
		var userID = sessionStorage.getItem('userID');
		if (!userID) {
			alert("Session expired or user not logged in.");
			window.location.href = "Index.html";
			return;
		}
		$.ajax({
			method: 'POST',
			contentType: "application/json",
			url: 'https://localhost:8843/signSystem/returnUForS',
			data: JSON.stringify({
				userID: userID
			}),
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			success: function (res) {
				_this.UserName = res.roleName;
				console.log(JSON.stringify(res));
			},
			error: function (res) {
				alert("Failed to get user information.");
				console.log(JSON.stringify(res));
				console.error('Error:', error);
				window.location.href = "Index.html";
			}
		});
	},
	destroyed() {
		$.ajax({
			method: 'POST',
			contentType: "application/json",
			// url: 'http://localhost:8889/signSystem/LoginOut',
			url: 'https://localhost:8843/signSystem/LoginOut',
			xhrFields: {
				withCredentials: true
			},
			success: function () {
				// 清除 sessionStorage 中的 sessionid
				sessionStorage.removeItem('userID');
				console.log("User logged out and userID cleared.");
			}
		});
	}
});