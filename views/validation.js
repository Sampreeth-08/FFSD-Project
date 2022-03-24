function login() {
    let email = document.getElementById("email").value;
    let regemail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!regemail.test(email)) {
        str += `---> Invalid Email Address
`
    }
    if (str !== ``) {
        alert(str);
    }
}
function verifyForm() {
    let user = document.getElementById("username").value;
    let reguser = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm;
    let email = document.getElementById("email").value;
    let regemail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    let str = ``
    let password = document.getElementById("password").value;
    let repassword = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/;
    let confirm_password = document.getElementById("confirm_password").value;
    if (!reguser.test(user)) {
        str += `--->  Username should only contain alphabet numeric _  .  where consecutive dot's are not allowed and username should start or end with .
`
    }
    if (!regemail.test(email)) {
        str += `---> Invalid Email Address
`
    }
    if (!repassword.test(password)) {
        str += `---> Password should contain two uppercase letters,one special letter,two digits,three lowercase letters and password should be greater than 8
`
    }
    if (password !== confirm_password) {
        str += `--> Passwords Doesn't Match`
    }
    if (str !== ``) {
        alert(str);
    }
}
function validate() {

    let user = document.getElementById("username").value;
    let reguser = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm;
    let email = document.getElementById("email").value;
    let regemail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    let str = ``
    let bio = document.getElementById("bio").value;
    if (!reguser.test(user)) {
        str += `--->  Username should only contain alphabet numeric _  .  where consecutive dot's are not allowed and username should start or end with .
`
    }
    if (!regemail.test(email)) {
        str += `---> Invalid Email Address
`
    }
    if (bio > 300) {
        str += `--> Bio should be less than 300 characters`
    }
    if (str !== ``) {
        alert(str);
    }
}