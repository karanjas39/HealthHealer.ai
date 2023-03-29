"use strict";

const linksNavBar = document.querySelector(".links");
const menuButton = document.querySelector("nav .menuButton");

// To show ot hide nav bar
menuButton.addEventListener("click", function () {
  linksNavBar.classList.toggle("hide");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

const target = document.querySelector(".parah");
observer.observe(target);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});
