$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signUp");
  const userNameInput = $("input#userName-input");
  const passwordInput = $("input#password-input");
  console.log(signUpForm,userNameInput,passwordInput)
  // When the signup button is clicked, we validate the userName and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      userName: userNameInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.userName || !userData.password) {
      return;
    }
    // If we have an userName and password, run the signUpUser function
    signUpUser(userData.userName, userData.password);
    userNameInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(userName, password) {
    console.log(userName, password)
    $.post("/api/signup", {
      userName: userName,
      password: password
    })
      .then(() => {
        window.location.replace("/profile");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});