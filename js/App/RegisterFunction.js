var vm = new Vue({
    el: '#main',
    data: {
        UserID: '',
        pwd: '',
        repwd: '',
        captcha: '',
        captchaInput: '',
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
        generateCaptcha() {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var mycaptcha = '';
            for (let i = 0; i < 4; i++) {
                mycaptcha += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            this.captcha = mycaptcha;
        },
        Register() {
            if (this.UserID == '' || this.pwd == '' || this.repwd == '' || this.captchaInput == '') {
                alert("请填写完整的信息!");
                return;
            }
            if (this.pwd.trim() !== this.pwd.trim()) {
                alert("两次密码不同!");
                return;
            }
            if (this.captchaInput.trim() !== this.captcha.trim()) {
                alert("验证码错误，请重新输入！");
                this.generateCaptcha(); // 错误时重新生成验证码
                return;
            }
            $.ajax({
                method: 'POST',
                contentType: "application/json",
                url: 'https://localhost:8843/signSystem/Register',
                data: JSON.stringify({
                    "classID": " ",
                    "password": this.pwd,
                    "role_Identity": this.Identity,
                    "role_id": this.UserID,
                    "role_name": this.UserID,
                    "role_openID": " "
                }),
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (res) {
                    if (res == true) {
                        alert("注册成功，请登录！");
                        window.location.href = "Index.html"; // 注册成功后跳转
                    } else {
                        alert("注册失败，请重试！");
                    }
                },
                error: function () {
                    alert("注册失败，请重试！");
                }
            });
        } //end of sign
    },
    // 页面加载时生成验证码
    mounted() {
        this.generateCaptcha();
    }
});