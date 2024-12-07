var vm = new Vue({
	el: '#mainframe',
	data: {
		isSignEnded: false,
		courseName: '',
		majorName: '',
		beginTime: '',
		hours: 0,
		courseLocation: '',
		chineseNumbers: [
			'一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
			'十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八'
		],
		classestable: [],
		selectClass: '',
		studentList: [],
	},
	watch: {
		// 监听 studentList 或 isSignEnded 的变化
		'studentList.length': function (newVal) {
			if (newVal > 0 && !this.isSignEnded) {
				this.$nextTick(() => {
					this.Signing();  // 自动调用 Signing 方法
				});
			}
		},
		'isSignEnded': function (newVal) {
			if (this.studentList.length > 0 && !newVal) {
				this.$nextTick(() => {
					this.Signing();  // 自动调用 Signing 方法
				});
			}
		}
	},
	methods: {
		EndSign() {
			alert("截止签到！");
			let signedInCount = 0;
			let totalCount = this.studentList.length;
			this.studentList.forEach(student => {
				student.studentID = student.userID;
				student.studentName = student.roleName;
				student.stuSignState = student.stuSignState === '已签到' ? 1 : 0;
				if (student.stuSignState === '已签到') {
					signedInCount++;
				}
				delete student.roleName;
				delete student.userID;
			});
			console.log(`已签到的学生人数: ${signedInCount}`);
			console.log(`总学生人数: ${totalCount}`);
			console.log(`学生列表: `, this.studentList);
			console.log('发送的数据:', JSON.stringify(this.studentList));
			$.ajax({
				url: "https://localhost:8843/signSystem/stuSign/addStuSigns/" + this.selectClass,
				type: "POST",
				data: JSON.stringify(this.studentList),
				contentType: 'application/json',
				success: function () {
					console.log("操作成功，但无需返回数据");
					// alert("请求成功！");
				},
				error: (xhr, status, error) => {
					alert("请求失败！");
				}
			});
			localStorage.removeItem('studentList');
			this.studentList = [];
			this.isSignEnded = true;
			console.log('studentList:', this.studentList);
			console.log('isSignEnded:', this.isSignEnded);
		},
		seeSuccess() {
			alert("提交成功");
			$('#feedModal').modal('hide');
		},
		markAsCheckedIn(student) {
			const studentToUpdate = this.studentList.find(s => s.roleID === student.roleID);
			if (studentToUpdate) {
				studentToUpdate.status = '已签到';
			}
		},
		Signing() {
			const url = "https://localhost:8080/StudentsSign.html";
			this.$nextTick(() => {
				$('#qrcode').empty();
				this.makeQRCode(url);
			});
		},
		makeQRCode(url) {
			const canvas = document.createElement("canvas");
			document.getElementById("qrcode").appendChild(canvas);
			QRCode.toCanvas(canvas, url, { width: 256, height: 256 }, function (error) {
				if (error) {
					console.error(error);
				} else {
					console.log("二维码生成成功！");
				}
			});
		},
		StartSign(courseID) {
			this.selectClass = courseID;
			this.studentList = [];
			$.ajax({
				url: "https://localhost:8843/signSystem/stuCourse/allStuAndSignByCid/" + courseID,
				type: "GET",
				success: (res, status, xhr) => {
					console.selectClass
					this.studentList = res;
					this.isSignEnded = false;
					console.log(this.studentList);
					if (!this.studentList || this.studentList.length === 0) {
						console.log("没有学生信息，显示提示！");
						alert("无学生信息！");
						return;
					} else {
						console.log("有学生信息！");
						this.studentList.forEach(student => {
							if (student.stuSignState === null) {
								student.stuSignState = '未签到';
							}
						});
						console.log(this.studentList)
						localStorage.setItem('studentList', JSON.stringify(this.studentList));
						$('#classModal').modal('hide');

						// 如果数据更新，开始每 2 秒更新一次页面数据
						this.updateStudents();

						// 启动定时器，每 2 秒检查一次 localStorage 是否有更新
						this.checkInterval = setInterval(this.updateStudents, 500);
					}
				},
				error: (xhr, status, error) => {
					alert("请求失败！");
				}
			});
		},
		updateStudents() {
			const studentList = JSON.parse(localStorage.getItem('studentList')) || [];
			if (studentList.length > 0) {
				this.studentList = studentList;
				console.log('学生数据已更新:', this.studentList);
			}
		},
		seeClass() {
			var userID = sessionStorage.getItem('userID');
			$.ajax({
				url: 'https://localhost:8843/signSystem/course/allCByTid',
				type: 'GET',
				data: { "tea_id": userID },
				dataType: 'json',
				success: (res) => {
					this.classestable = res;
					console.log(this.classestable);  // 打印响应数据
					// alert(JSON.stringify(this.classestable));  // 格式化打印
				},
				error: (xhr, status, error) => {
					console.error('获取数据失败:', error);
					alert('获取数据失败:' + error);
				}
			});
		},
		ChangeStatus(roleID, roleName) {
			let studentList = JSON.parse(localStorage.getItem('studentList')) || [];
			const existingStudentIndex = studentList.findIndex(student => student.roleID === roleID && student.roleName === roleName);
			if (existingStudentIndex !== -1) {
				studentList[existingStudentIndex].stuSignState = '已签到';  // 如果找到匹配的学生，更新状态
				console.log(`学生 ${roleName}（学号: ${roleID}）已签到`);
			} else {
				console.log(`未找到匹配的学生: ${roleName}（学号: ${roleID}）`);
			}
			localStorage.setItem('studentList', JSON.stringify(studentList));
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
		},
		staChange(data) {
			if (confirm("修改" + data.stuName + "的签到状态？")) {
				data.Flag = true;
			}
		},
		addClass() {
			var userID = sessionStorage.getItem('userID');
			if (this.courseName == '' || this.majorName == '' || this.beginTime == '' || this.courseLocation == '') {
				alert("请填写完整的信息!");
				return;
			}
			if (parseInt(this.hours) <= 0) {
				alert("非法课时数!");
				return;
			}
			this.beginTime = "第" + String(this.chineseNumbers[parseInt(this.beginTime) - 1]) + "周"
			this.hours = parseInt(this.hours)
			var _this = this;
			$.ajax({
				type: 'POST',
				contentType: "application/json",
				url: 'https://localhost:8843/signSystem/course/addCourse',
				data: JSON.stringify({
					"courseName": this.courseName,
					"majorName": this.majorName,
					"beginTime": this.beginTime,
					"hours": this.hours,
					"teacherID": userID,
					"courseLocation": this.courseLocation
				}),
				xhrFields: {
					withCredentials: true
				},
				success: function (res) {
					_this.courList = res;
					console.log(JSON.stringify(res));
					alert("添加成功！");
				},
				error: function () {
					alert("添加失败，请重试！");
				}
			});
		},
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
			data: JSON.stringify({}),
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			success: function (res) {
				_this.roleID = res.roleID;
				console.log(res);
			},
			error: function () {
				alert("Failed to get user information.");
				console.log(JSON.stringify(res));
				console.error('Error:', error);
				window.location.href = "Index.html";
			},
		});
	},
	destroyed() {
		$.ajax({
			method: 'POST',
			contentType: "application/json",
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
function makeQRCode(Url) {
	$(document).ready(function () {
		$("#qrcode").qrcode(Url);
	});
}
function toDate(number) {
	var n = number * 1000;
	var date = new Date(n);
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
	var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	var h = date.getHours() + ':';
	var m = date.getMinutes().toString();
	return (M + "月" + D + "日 " + (h.length == 2 ? '0' + h : h) + (m.length == 1 ? '0' + m : m));
}