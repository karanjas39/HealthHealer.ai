"use strict";

const chatHistory = document.querySelector(".chat-history");
const chatInput = document.querySelector(".chat-input");
const chatContainer = document.querySelector(".chat-container-2");
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
  `${userName}, How many meals would you like to plan for (Breakfast, Lunch, Dinner, Snacks)?`,
  `What's your preferred style of eating ${userName}?\n(Options: Vegetarain, Vegan, Low-Carb, High-protein, Gluten-free, Dairy-free, Paleo, Mediterranean, Other)`,
  `Do you have any dietary restrictions or allergies ${userName}? (yes/no)`,
  // If yes
  `What dietary restrictions or allergies do you have ${userName}?`,
  `Are there any foods you can't eat at all ${userName}?`,
  `Are there any foods you can eat in moderation ${userName}?`,
  `Are there any substitutes you'd like the bot to keep in mind ${userName}?`,
  // If no (present+5)
  `What's your daily calorie target ${userName}?\n(Options: <1200, 1200-1500 , 1500-1800 , 1800-2000 , 2000-2500)`,
  `What's your budget for meals ${userName}?\n(Options:  <$20 per day , $20-$30 per day , $30-$40 per day , More than $40 per day )`,
  `How much time do you have for meal preparation ${userName}?\n(Options: 'Less than 30 mins','30 mins to 1 hour','1-2 hours','More than 2 hours')`,
  `What's your preferred type of cuisine ${userName}?\n(Options:  Italian , Mexican , Chinese , Indian , Thai , American , Other)`,
  `Do you have any foods you dislike or would prefer to avoid ${userName}?\n(If any than mention Otherwise type no)`,
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
    if (currentBotMessageIndex === 3 && userInput.toLowerCase() == "no") {
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
      const results = `Create a custom ${answers[1]}-meal plan that focus on ${
        answers[11]
      } cuisine and that fits within a budget of $${
        answers[9]
      }. The plan should have ${
        answers[8]
      } targeted calories and shouldn't add ${
        answers[12]
      } in meal plan.The meal should prepare in ${
        answers[10]
      } time.The plan should take into account your ${
        answers[2]
      } style of eating and have ${
        answers[3].toLowerCase() == "yes"
          ? `${answers[4]} Dietary restrictions or allergies and I can't eat ${answers[5]} but except that I can eat ${answers[6]} in moderation.I would like you  add ${answers[7]} as a substitutes in your mind. These are the `
          : "no"
      } dietary restrictions or allergies. It should also include nutritional information and grocery lists to make meal preparation and shopping easier.`;
      // console.log(results);
      fetchResults(results);
    }
  }
}

// Previous Template
/*
Suggest recipes for each meal of the day, along with snacks and desserts, that are easy to make and fit into my mentioned dietary needs and Also provide a shopping list for each week, so I can easily purchase the ingredients I need as per following requirements:
      No. of Meals I would like to plan for (Breakfast, Lunch, Dinner, Snacks): ${
        answers[1]
      },My Style of eating: ${
        answers[2]
      },Dietary restrictions or Preferences: ${answers[3]}${
        answers[3].toLowerCase() == "yes"
          ? `Dietary restrictions or allergies I have: ${answers[4]},Food I can't eat at all: ${answers[5]},Food I can eat in moderation: ${answers[6]},Any Subtitute food: ${answers[7]}`
          : ""
      },Target Calorie: ${answers[8]},My Meal Budget: ${
        answers[9]
      },Meal Preparation Time I have: ${answers[10]},Preferred cuisine: ${
        answers[11]
      },Food that I dislike or avoid: ${
        answers[12]
      },Ingredients that I already have: ${answers[13]}
 */

chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    processUserInput();
  }
});

// Addititon Changes

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
  messageContainer.innerHTML = `Hi, I'm MealPlannerPro, your personal meal planning assistant! Let
  me take the stress out of meal planning by creating customized
  meal plans that fit your schedule, budget, and nutritional needs.
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
