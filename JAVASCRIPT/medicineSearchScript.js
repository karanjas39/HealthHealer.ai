"use strict";

const engine = "text-davinci-003";
let numsearches = 0;
let answerCache = [];
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

// Smooth Scrooling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// variables
const loader = document.querySelector(".loader");
const searchInput = document.querySelector(".input-field");
const searchButton = document.querySelector(".input-search-btn");
const outputField = document.querySelector(".answer-fetch-field");
const printHistory = document.querySelector(".history");
const clearHistory = document.querySelector(".clearhistory");

// DOM Manipulations

searchButton.addEventListener("click", function () {
  let medicineName = searchInput.value;
  if (medicineName === "") {
    outputField.innerHTML = "";
    outputField.insertAdjacentHTML("afterbegin", "Please enter a search query");
  } else {
    const modifiedQuestion = `Can you give me information about ${medicineName}, including indications, dosage, side effects, contraindications, precautions, storage instructions, availability, and pricing?`;
    outputField.innerHTML = "";
    loader.classList.toggle("hidden");
    outputField.style.height = "500px";
    fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("apiKey")}`,
      },
      body: JSON.stringify({
        prompt: modifiedQuestion,
        max_tokens: 1024,
        n: 1,
        stop: "None",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        outputField.innerHTML = "";
        numsearches++;
        loader.classList.toggle("hidden");
        outputField.style.height = "max-content";
        const answer = data.choices[0].text.trim().replace(/\n/g, "<br>");
        const cacheAnswer = `<h2>${numsearches}. ${medicineName.toUpperCase()}</h2><br>
        ${answer}
        <br><br>
        `;
        answerCache.push(cacheAnswer);
        outputField.insertAdjacentHTML("afterbegin", answer);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

printHistory.addEventListener("click", function () {
  outputField.innerHTML = "";
  if (answerCache.length === 0) {
    outputField.insertAdjacentHTML("afterbegin", "History tab is empty");
  } else {
    answerCache.forEach(function (data) {
      outputField.insertAdjacentHTML("beforeend", data);
    });
  }
});

clearHistory.addEventListener("click", function () {
  outputField.style.height = "500px";
  if (answerCache.length === 0) {
    outputField.innerHTML = "";
    outputField.insertAdjacentHTML(
      "afterbegin",
      "Nothing to clear history tab is already empty"
    );
  } else {
    outputField.innerHTML = "";
    outputField.insertAdjacentHTML("afterbegin", "History deleted");
    numsearches = 0;
    answerCache = [];
  }
});
