const linksNavBar = document.querySelector(".links");
const menuButton = document.querySelector("nav .menuButton");
const navLinks = document.querySelectorAll(".links a");

// Add click event listeners to all the navigation links
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    // hide the menu bar
    linksNavBar.classList.add("hide");
  });
});
// To show ot hide nav bar
menuButton.addEventListener("click", function () {
  linksNavBar.classList.toggle("hide");
});
