var vm = new Vue({
    el: '#mainframe',
    data: {
        UserName: '',
        timetable: [],
        knowCourseID: '',
        historysignlist: [],
        signPlanID: '',
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
        HistoryDetails(courseID) {
            this.knowCourseID = courseID;
            $('#SignModal').modal('hide');
            $.ajax({
                url: "https://localhost:8843/signSystem/signPlan/getSignCount/" + courseID,
                type: "GET",
                success: (res, status, xhr) => {
                    this.historysignlist = res;
                    console.log(this.historysignlist);
                    if (!this.historysignlist || this.historysignlist.length === 0) {
                        $('#SignModal').modal('hide');
                        console.log("没有历史签到记录信息，显示提示！");
                        alert("无历史签到记录信息！");
                        return;
                    } else {
                        console.log("有历史签到记录信息，准备显示模态框！");
                        console.log(this.historysignlist);
                        $('#SignModal').modal('show');
                    }
                },
                error: (xhr, status, error) => {
                    alert("请求失败！");
                }
            });
        },
        courseDetails(signPlanID) {
            this.studentList = [];
            this.signPlanID = signPlanID;
            $('#myModal').modal('hide');
            $.ajax({
                url: "https://localhost:8843/signSystem/stuSign/getStuSignStatus/" + signPlanID,
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
                this.timetable = res;
                console.log(this.timetable);
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