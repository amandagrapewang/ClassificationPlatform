var vm = new Vue({
    el: '#mainframe',
    data: {
        UserName: '',
        classestable: [],
        selectedFile: '',
        selectedFileCourseID: '',
        knowCourseID: '',
        studentList: [],
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
        },
        getFile(event) {
            this.selectedFile = event.target.files[0];
            console.log(this.selectedFile);
        },
        uploadFile(courseID) {
            this.selectedFileCourseID = courseID
            if (!this.selectedFile) {
                alert("请先选择文件");
                return;
            }
            const formData = new FormData();
            formData.append("file", this.selectedFile);
            const url = `https://localhost:8843/signSystem/User/addUserByExcel?course_id=${courseID}`;
            console.log(url);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            console.log(this.selectedFile);
            $.ajax({
                url: url,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: (res, status, xhr) => {
                    if (xhr.status === 200) {
                        alert('文件上传成功！');
                        console.log(res)
                    } else {
                        alert('操作失败，请稍后再试');
                    }
                },
                error: (xhr, status, error) => {
                    alert("文件上传失败！");
                }
            });
        },
        StuDetails(courseID) {
            this.studentList = [];
            this.knowCourseID = courseID;
            $('#myModal').modal('hide');

            $.ajax({
                url: "https://localhost:8843/signSystem/stuCourse/allSByCid/" + courseID,
                type: "GET",
                success: (res, status, xhr) => {
                    this.studentList = res;
                    console.log(this.studentList);
                    if (!this.studentList || this.studentList.length === 0) {
                        $('#myModal').modal('hide');
                        console.log("没有学生信息，显示提示！");
                        alert("无学生信息！");
                        return;
                    } else {
                        console.log("有学生信息，准备显示模态框！");
                        $('#myModal').modal('show');
                    }
                },
                error: (xhr, status, error) => {
                    alert("请求失败！");
                }
            });
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
    mounted() {
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