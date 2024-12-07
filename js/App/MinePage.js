var vm = new Vue({
    el: '#mainframe',
    data: {
        UserName: '',
        roleID: '',
        roleIdentity: '',
        roleName: '',
        pwd: '',
        repwd: '',
    },
    methods: {
        seeSuccess() {
            alert("提交成功")
            $('#feedModal').modal('hide');
        },
        toTea() {
            this.roleIdentity = '教师';
        },
        toAdmi() {
            this.roleIdentity = '管理员';
        },
        toStu() {
            this.roleIdentity = '学生';
        },
        signup() {
            var userID = sessionStorage.getItem('userID');
            if (this.pwd != this.repwd) {
                alert("两次密码不同，请重新填写！");
                return;
            }
            $.ajax({
                url: 'https://localhost:8843/signSystem/User/' + userID,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    role_name: this.roleName,
                    role_Identity: this.roleIdentity,
                    role_id: this.roleName,
                    password: this.pwd,
                }),
                success: (res, status, xhr) => {
                    if (xhr.status === 200) {
                        alert('修改成功！请重新登录');
                        this.logout();
                    } else {
                        alert('操作失败，请稍后再试');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('获取数据失败:', error);
                    alert('获取数据失败:' + error);
                }
            });
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
                _this.UserName = res.roleName;
                // _this.roleName = res.roleName;
                // _this.roleIdentity = res.roleIdentity;
                console.log(res);
            },
            error: function () {
                window.location.href = "Index.html";
            },
        });
    },
    mounted() {
        var userID = sessionStorage.getItem('userID');
        $.ajax({
            url: 'https://localhost:8843/signSystem/User/' + userID,
            type: 'GET',
            dataType: 'json',
            success: (res) => {
                this.roleName = res.roleName;
                this.roleIdentity = res.roleIdentity;
                console.log(res);
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
            url: 'https://localhost:8843/signSystem/LoginOut',
            xhrFields: {
                withCredentials: true
            }
        });
    }
});