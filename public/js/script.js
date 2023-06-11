const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function() {
  const pswdInput = document.getElementById("pword");
  const type = pswdInput.getAttribute("type");
  if (type == "account_password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "account_password");
    pswdBtn.innerHTML = "Show Password";
  }
});