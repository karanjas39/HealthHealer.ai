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
  `What is your height ${userName}? (Options: 158 cms or 5 feet 2 inch)`,
  `What is your weight ${userName}? (Options: 132 lbs or 59 kg)`,
  `What is your gender ${userName}?`,
  `What is your activity level ${userName}? (Options: Sedentary (little to no exercise), Lightly active (1-3 days per week of exercise), Moderately active (3-5 days per week of exercise), Very active (6-7 days per week of exercise), Extremely active (intense exercise every day))`,
  `Do you have any specific dietary requirements, such as being vegetarian or having a food allergy ${userName}? (Options: Vegetarian, Vegan, Gluten-free, Dairy-free, Nut-free or Other)`,
  `What are your fitness goals ${userName}? (Options: Lose weight, Build muscle, Improve overall fitness, Improve cardiovascular health or Other)`,
  `How many meals and snacks do you usually eat in a day ${userName}? (Options: 3 meals, 2 snacks, 3 meals, 1 snack, 3 meals, no snacks, 2 meals, 2 snacks, 2 meals, 1 snack, 2 meals, no snacks or Other)`,
  `What is your typical daily calorie intake ${userName}? (Options:1200-1500, 1500-1800, 1800-2100, 2100-2400, 2400-2700 or Other)`,
  `Do you have any preferences for certain types of food or flavors ${userName}? (Options: Spicy, Sweet, Savory, Salty, Bitter, No preference or Other)`,
  `Do you currently take any supplements ${userName}, and if so, which ones? (Options: Multivitamin, Protein powder, Creatine, Fish oil, BCAAs, Other or None)`,
  `Are there any foods or ingredients that you don't like or can't eat ${userName}?`,
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
      const results = `Provide nutritional guidance by suggesting healthy meals, snacks, and supplements for a ${answers[4]} of age ${answers[1]} who weights ${answers[3]} and stands ${answers[2]} long.Person have the activity level as ${answers[5]} who wants to ${answers[7]} as a fitness goal.Person have ${answers[6]} dietary requirement or food allergy.Person have ${answers[8]} in a day with a calorie intake of ${answers[9]}.Person have some food or flavor preferences as ${answers[10]} as he/she is currenty taking ${answers[11]} supplement and he/she don't like ${answers[12]},so keep it in mind.`;
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
  messageContainer.innerHTML = `Hi there! I'm Nutri Expert Bot, an AI-powered chatbot here to
  provide you nutritional guidance by suggesting healthy meals,
  snacks, and supplements based on the user's dietary requirements
  and goals.
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
