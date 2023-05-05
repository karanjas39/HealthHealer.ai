"use strict";

const chatHistory = document.querySelector(".chat-history");
const chatInput = document.querySelector(".chat-input");
const chatContainer = document.querySelector(".chat-container");
const resultContainer = document.querySelector(".result");
const loader = document.querySelector(".loader");
const searchAgain = document.querySelector(".search-again");
const checkHistory = document.querySelector(".check-history");
const clearHistory = document.querySelector(".clear-history");
const apiData = {
  engine: "text-davinci-003",
};
let userName = "User";
let userFullName;
let searchHistory = [];
let searchNumber = 0;
const botMessages = [
  `What is your name?`,
  `What is your age ${userName}?`,
  `What is your gender ${userName}?`,
  `What is your primary health concern?`,
  `What is your dosha type? (Options: Vata, Pitta, Kapha, Not sure)`,
  `What is your current diet like? (Options: Vegetarian, Vegan, Meat-based, Mostly processed foods, Other )`,
  `How is your digestion? (Options: Strong and regular, Irregular or weak, Frequently bloated or gassy, Other)`,
  `List allergies or food sensitivities if any?`,
  `How is your sleep? (Options: Good and restful, Irregular or restless, Trouble falling or staying asleep)`,
  `How is your stress level? (Options: Low, Moderate, High)`,
  `What is your current exercise routine like? (Options: Sedentary, Light, Moderate, High intensity)`,
  `Do you have any other medical conditions? (List if Yes/No)`,
  `Have you tried any Ayurvedic treatments or remedies before? (List if Yes/No)`,
];
let currentBotMessageIndex = 0;
let userData = {};
let answers = [];

function addMessageToHistory(message, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("chat-message", `${sender}-message`);
  messageContainer.innerHTML = message;
  chatHistory.appendChild(messageContainer);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function processUserInput() {
  const userInput = chatInput.value.trim();
  if (userInput) {
    addMessageToHistory(userInput, "user");
    chatInput.value = "";
    const currentBotMessage = botMessages[currentBotMessageIndex];
    const currentBotMessageWithoutPunctuation = currentBotMessage.slice(0, -1);
    if (currentBotMessageIndex === 0) {
      userName = userInput;
      userFullName = userInput;
      userFullName = userFullName
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
      userName = userName.split(" ")[0];
      userName =
        userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
    } else {
      userData[currentBotMessageWithoutPunctuation] = userInput;
    }
    answers.push(userInput);
    currentBotMessageIndex++;
    if (currentBotMessageIndex < botMessages.length) {
      setTimeout(() => {
        const message = botMessages[currentBotMessageIndex].replace(
          "User",
          `${userName}`
        );
        addMessageToHistory(message, "bot");
      }, 500);
    } else {
      const results = `Based on the symptoms you provided, please suggest the most likely diagnosis and Ayurvedic treatment options:
      What is your age: ${answers[1]}
      What is your gender: ${answers[2]}
      What is your primary health concern: ${answers[3]}
      What is your dosha type: ${answers[4]}
      What is your current diet like: ${answers[5]}
      How is your digestion: ${answers[6]}
      List allergies or food sensitivities if any: ${answers[7]}
      How is your sleep: ${answers[8]}
      How is your stress level: ${answers[9]}
      What is your current exercise routine like: ${answers[10]}
      Do you have any other medical conditions: ${answers[11]}
      Have you tried any Ayurvedic treatments or remedies before: ${answers[12]}`;
      // console.log(results);
      fetchResults(results);
    }
  }
}

chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    processUserInput();
  }
});

chatContainer.classList.toggle("hidden");

function fetchResults(query) {
  loader.classList.toggle("hidden");
  chatContainer.classList.toggle("hidden");
  fetchResult(query);
}

function fetchResult(question) {
  fetch(`https://api.openai.com/v1/engines/${apiData.engine}/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("apiKey")}`,
    },
    body: JSON.stringify({
      prompt: question,
      max_tokens: 2048,
      n: 1,
      stop: "None",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      searchNumber++;
      loader.classList.toggle("hidden");
      resultContainer.innerHTML = "";
      resultContainer.classList.toggle("hidden");
      const answer = data.choices[0].text.trim().replace(/\n/g, "<br>");
      resultContainer.insertAdjacentHTML("afterbegin", answer);
      const html = `<strong>${searchNumber}. Search by ${userFullName}</strong></br></br>${answer}
      </br></br>`;
      searchHistory.push(html);
    })
    .catch((error) => {
      console.error(error);
    });
}

checkHistory.addEventListener("click", function () {
  chatContainer.classList.contains("hidden")
    ? chatContainer.classList.add("hidden")
    : chatContainer.classList.toggle("hidden");
  resultContainer.classList.contains("hidden")
    ? resultContainer.classList.remove("hidden")
    : resultContainer.classList.remove("hidden");
  loader.classList.contains("hidden")
    ? loader.classList.add("hidden")
    : loader.classList.toggle("hidden");
  resultContainer.innerHTML = "";
  if (searchHistory.length === 0) {
    resultContainer.insertAdjacentHTML("afterbegin", "History tab is empty");
  } else {
    searchHistory.forEach(function (data) {
      resultContainer.insertAdjacentHTML("beforeend", data);
    });
  }
});

searchAgain.addEventListener("click", function () {
  chatContainer.classList.contains("hidden")
    ? chatContainer.classList.toggle("hidden")
    : chatContainer.classList.remove("hidden");
  resultContainer.classList.contains("hidden")
    ? resultContainer.classList.add("hidden")
    : resultContainer.classList.toggle("hidden");
  loader.classList.contains("hidden")
    ? loader.classList.add("hidden")
    : loader.classList.toggle("hidden");
  userName = "User";
  currentBotMessageIndex = 0;
  userData = {};
  answers = [];
  chatHistory.innerHTML = "";
  const messageContainer = document.createElement("div");
  messageContainer.innerHTML = `Hi there! I'm Ayurvedic diagnosis Bot, an AI-powered chatbot here
  to provide personalized diagnoses and treatment options based on
  symptoms and body type.
  <br /><br />
  What's your name?`;
  chatHistory.appendChild(messageContainer);
  chatHistory.scrollTop = chatHistory.scrollHeight;
});

clearHistory.addEventListener("click", function () {
  chatContainer.classList.contains("hidden")
    ? chatContainer.classList.add("hidden")
    : chatContainer.classList.toggle("hidden");
  resultContainer.classList.contains("hidden")
    ? resultContainer.classList.remove("hidden")
    : resultContainer.classList.remove("hidden");
  loader.classList.contains("hidden")
    ? loader.classList.add("hidden")
    : loader.classList.toggle("hidden");
  resultContainer.innerHTML = "";
  if (searchHistory.length === 0) {
    resultContainer.insertAdjacentHTML(
      "afterbegin",
      "History tab is already empty"
    );
  } else {
    resultContainer.insertAdjacentHTML("afterbegin", "History deleted");
  }
  searchHistory = [];
});

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
