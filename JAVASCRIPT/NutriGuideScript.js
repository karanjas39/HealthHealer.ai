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
  `What unit of height you will prefer ${userName}? (Options: cm, feet, inches)`,
  `What unit of weight you will prefer ${userName}? (Options: kg, lbs)`,
  `What is your height ${userName}?`,
  `What is your weight ${userName}?`,
  `What are your fitness goals ${userName}? (Options: lose weight, maintain weight, gain weight, Improve overall health)`,
  `Do you have any dietary restrictions or preferences ${userName}? (Options: vegetarian, vegan, gluten-free, dairy-free, none)`,
  `What is your activity level ${userName}? (Options: sedentary, lightly active, moderately active, very active)`,
  `What's your daily calorie target ${userName}? (Options: <1200, 1200-1500, 1500-1800, 1800-2000, 2000-2500 )`,
  `What's your current diet like ${userName}? (Options: High in sugar, High in saturated fat, High in processed foods, High in carbohydrates, Low in protein, Low in fiber, Other)`,
  `Do you have any medical conditions or allergies that affect your diet ${userName}? (yes/no)`,
  // Yes
  `What medical conditions or allergies do you have ${userName}?`,
  `Are there any foods you can't eat at all ${userName}?`,
  `Are there any foods you can eat in moderation ${userName}?`,
  `Are there any substitutes you'd like the bot to keep in mind ${userName}?`,
  // No present+4
  `What foods did you eat today ${userName}?`,
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
    if (currentBotMessageIndex === 12 && userInput.toLowerCase() == "no") {
      answers[currentBotMessageIndex] = userInput;
      currentBotMessageIndex += 4;
    } else {
      answers[currentBotMessageIndex] = userInput;
    }
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
      const results = `Analyzie the meal composition of a ${answers[1]} old ${
        answers[2]
      } having height${answers[5]} ${answers[3]} and weights ${answers[6]} ${
        answers[4]
      }.The person have ${answers[7]} fitness goal to achieve with a ${
        answers[8]
      }.The person's activity level is ${
        answers[9]
      } with a targeted calorie intake as ${
        answers[10]
      }.The person's current diet is ${answers[11]}.The person have  ${
        answers[12].toLowerCase() == "yes"
          ? `${answers[13]} medical condition and he/she can't eat ${answers[14]} but except that he/she can eat ${answers[15]} in moderation.he/she would like you add ${answers[16]} as a substitutes in your mind. These are the `
          : "no"
      } medical condition or allergies.The person ate ${
        answers[17]
      } today.Now based on the Meal composition and other factors provide information about the calories, fat, protein, and other nutrients in different foods, and suggest ways to optimize the the nutrient intake based on dietary needs and goals. Also suggest specific foods that are high in certain nutrients, or suggest ways to incorporate more of these nutrients into my diet.`;
      // console.log(results);
      fetchResults(results);
    }
  }
}

/* 
Provide information about the calories, fat, protein, and other nutrients in different foods, and suggest ways to optimize the my nutrient intake based on my mentioned dietary needs and goals and Also suggest specific foods that are high in certain nutrients, or suggest ways to incorporate more of these nutrients into my diet as per the following requirements:
      Age: ${answers[1]}
      Gender: ${answers[2]}
      Height: ${answers[5]} ${answers[3]}
      Weight: ${answers[6]} ${answers[4]}
      Fitness Goals: ${answers[7]}
      Dietary Restrictions or Preferences: ${answers[8]}
      Activity Level: ${answers[9]}
      Calorie Target: ${answers[10]}
      Current Diet: ${answers[11]}
      Medical conditions or allergies: ${answers[12]} 
      ${
        answers[12].toLowerCase() == "yes"
          ? `
    What medical condition:${answers[13]}
    Foods that user can't eat: ${answers[14]}
    Foods user can eat in moderation: ${answers[15]}
    Any substitutes: ${answers[16]}`
          : ""
      }
    Foods user eat today: ${answers[17]}

*/

chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    processUserInput();
  }
});

// This starts the code
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
  messageContainer.innerHTML = ` Hey, I'm NutriGuide, and I'm here to help you optimize your
  nutrient intake! Just tell me what you're eating, and I'll give
  you a detailed breakdown of the nutrients in your meals, along
  with personalized recommendations to help you meet your health
  goals.<br /><br />
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
