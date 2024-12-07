var vm = new Vue({
	el: '#main',
	data: {
		UserID: '',
		pwd: '',
		Identity: '教师'
	},
	methods: {
		toTea() {
			this.Identity = '教师';
		},
		toAdmi() {
			this.Identity = '管理员';
		},
		toStu() {
			this.Identity = '学生';
		},
		Sign() {
			if (this.UserID == '' || this.pwd == '') {
				alert("请完整的填写信息!");
				return;
			}
			$.ajax({
				method: 'POST',
				contentType: "application/json",
				url: 'https://localhost:8843/signSystem/Login',
				data: JSON.stringify({
					"classID": " ",
					"password": this.pwd,
					"role_Identity": this.Identity,
					"role_id": this.UserID,
					"role_name": " ",
					"role_openID": " "
				}),
				dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				success: function (res) {
					console.log(res)
					if (res.userID) {
						sessionStorage.setItem('userID', res.userID);  // 存储 sessionid
						document.cookie = "userID=" + res.userID + "; path=/; max-age=86400";
					}
					window.location.href = "HomePage.html";
				},
				error: function () {
					alert("登录失败");
				}
			});
		} //end of sign
	}
});