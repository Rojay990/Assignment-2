
let username = document.getElementById("username");
let password = document.getElementById("password");
let loginStatustext = document.getElementById("login-status");
let signupButton = document.getElementById("signup-button");
let loginButton = document.getElementById("login-button");

let usernames= ["tash","rohan"];
let passwords= ["tash","rohan"];





function verifyUser(){
    let usernameValue = username.value;
    let passwordValue = password.value;
    let x = usernames.indexOf(usernameValue);

    if(usernameValue == usernames[x] && passwordValue == passwords[x])
    {
        window.location.href = "../HTML/homepage.html", "_blank";
    } else {
        window.alert("Login Unsuccessful\nPassword or Username incorrect");
    }
}

function addUser(){
    let usernameValue = username.value;
    let passwordValue = password.value;

    window.alert(passwordValue)

    if(usernames.indexOf(usernameValue)>=0 || usernameValue == "" ){
        window.alert("Username not available");
        window.alert(usernames)
    } else if(passwordValue = "") {
        window.alert("Must enter password");
    }else{
        usernames.push(usernameValue);
        passwords.push(passwordValue);
        window.alert("SIGNUP SUCCESSFUL");

        const fs = require('fs');

const data = {
    username: usernames,
    password: passwords
};

// Convert object to JSON and write to file
fs.writeFileSync("../JSON/users.json", JSON.stringify(data, null, 4), "utf8");
    }
}

// Attach event listeners only if the button exists
if (loginButton) {
    loginButton.addEventListener("click", verifyUser);
}
if (signupButton) {
    signupButton.addEventListener("click", addUser);
}
