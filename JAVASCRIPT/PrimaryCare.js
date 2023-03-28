"use strict";

const chatHistory = document.querySelector(".chat-history");
const chatInput = document.querySelector(".chat-input");
const chatContainer = document.querySelector(".chat-container-1");
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
  `What is your age?`,
  `What is your gender?`,
  `What are your main symptoms? (Options: stomach pain, headache, fever)`,
  `How long have you had these symptoms? (Options: a few hours, a few days, a week)`,
  `Have you experienced these symptoms before? (Yes/No)`,
  // <!-- If yes -->
  `When did you last experience them and were they similar to your current symptoms?`,
  `On a scale of 1-10, how severe are your symptoms? (Options: 1 being mild, 10 being severe)`,
  `Have you noticed anything that triggers or worsens your symptoms? (Options: certain foods, activities, stress)`,
  `Have you taken any medications or remedies for your symptoms? (Yes/No)`,
  // <!-- If yes -->
  `Which ones and have they been effective?`,
  `Have you noticed any changes in your symptoms recently? (Yes/No)`,
  // <!-- If yes -->
  `What kind of changes?`,
  `Have you had any recent injuries or surgeries? (Yes/No)`,
  // <!-- If yes -->
  `Please explain.`,
  `Do you have any pre-existing medical conditions? (Yes/No)`,
  // <!-- If yes -->
  `Please list them.`,
  `Are you currently taking any medications or supplements? (Yes/No)`,
  // <!-- If yes -->
  `Please list them.`,
  `Have you traveled recently? (Yes/No)`,
  // <!-- If yes -->
  `When and where did you travel to?`,
  `Have you been exposed to anyone who is sick? (Yes/No)`,
  // <!-- If yes -->
  `Who and what kind of illness did they have?`,
  `Have you experienced any other symptoms or discomfort? (Yes/No)`,
  // <!-- If yes -->
  `Please describe them.`,
  `Are you experiencing any pain or discomfort in a specific location of your body? (Yes/No)`,
  // <!-- If yes -->
  `Please specify where.`,
  `Have you had any recent changes in your diet or lifestyle? (Yes/No)`,
  // <!-- If yes -->
  `Please explain.`,
  `Are you experiencing any emotional or mental health symptoms? (Yes/No)`,
  // <!-- If yes -->
  `Please describe them.`,
  `How many hours of sleep and minutes of exercise are you getting per day?`,
  `Have you tried any self-care techniques or remedies for your symptoms? (Yes/No)`,
  // <!-- If yes -->
  `Which ones and have they been effective?`,
  `Is there anything else that you'd like to share with us about your health history or current concerns?`,
];

/*



*/
let currentBotMessageIndex = 0;
let userData = {};
let answers = [];
let currentLocation = {};

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
    // TODO
    if (
      (currentBotMessageIndex === 5 ||
        currentBotMessageIndex === 9 ||
        currentBotMessageIndex === 11 ||
        currentBotMessageIndex === 13 ||
        currentBotMessageIndex === 15 ||
        currentBotMessageIndex === 17 ||
        currentBotMessageIndex === 19 ||
        currentBotMessageIndex === 21 ||
        currentBotMessageIndex === 23 ||
        currentBotMessageIndex === 25 ||
        currentBotMessageIndex === 27 ||
        currentBotMessageIndex === 29 ||
        currentBotMessageIndex === 32) &&
      userInput.toLowerCase() == "no"
    ) {
      answers[currentBotMessageIndex] = userInput;
      currentBotMessageIndex += 1;
    } else {
      answers[currentBotMessageIndex] = userInput || "nothing";
    }
    currentBotMessageIndex++;
    if (currentBotMessageIndex < botMessages.length) {
      setTimeout(() => {
        addMessageToHistory(botMessages[currentBotMessageIndex], "bot");
      }, 500);
    } else {
      const results = `Can you suggest some self-care remedies or techniques if needed and recommend any medications that can help relieve if needed as per following data:
      What is your age: ${answers[0]}
      What is your gender: ${answers[1]}
      What are your main symptoms: ${answers[2]}
      How long have you had these symptoms: ${answers[3]}
      Have you experienced these symptoms before: ${answers[4]}
      When did you last experience them and were they similar to your current symptoms: ${answers[5]}
      On a scale of 1-10, how severe are your symptoms: ${answers[6]}
      Have you noticed anything that triggers or worsens your symptoms: ${answers[7]}
      Have you taken any medications or remedies for your symptoms: ${answers[8]}
      Which ones of medications or remedies been effective: ${answers[9]}
      Have you noticed any changes in your symptoms recently: ${answers[10]}
      What kind of changes you notice recently: ${answers[11]}
      Have you had any recent injuries or surgeries: ${answers[12]}
      Please explain your recent injury: ${answers[13]}
      Do you have any pre-existing medical conditions: ${answers[14]}
      Please list your pre-existing medical conditions: ${answers[15]}
      Are you currently taking any medications or supplements: ${answers[16]}
      Please list medications or supplements you are taking currently: ${answers[17]}
      Have you traveled recently: ${answers[18]}
      When and where did you travel to: ${answers[19]}
      Have you been exposed to anyone who is sick: ${answers[20]}
      Who and what kind of illness did the person you exposed to have: ${answers[21]}
      Have you experienced any other symptoms or discomfort: ${answers[22]}
      Please describe other symptom or discomfort you experience: ${answers[23]}
      Are you experiencing any pain or discomfort in a specific location of your body: ${answers[24]}
      Please specify the location of body where you experience pain or discomfort: ${answers[25]}
      Have you had any recent changes in your diet or lifestyle: ${answers[26]}
      Please explain the recent changes in your diet or lifestyle: ${answers[27]}
      Are you experiencing any emotional or mental health symptoms: ${answers[28]}
      Please describe emotional or mental health symptoms you experience: ${answers[29]}
      How many hours of sleep and minutes of exercise are you getting per day: ${answers[30]}
      Have you tried any self-care techniques or remedies for your symptoms: ${answers[31]}
      Which self-care techniques or remedies you try and have they been effective: ${answers[32]}
      Is there anything else that you'd like to share with us about your health history or current concerns: ${answers[33]}
      List all the possible Causes and suggest some lifestyle changes if needed as well as does he/she have any warning signs or symptoms that indicate he/she may require medical attention?
      `;
      console.log(results);
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
  messageContainer.innerHTML = ` Hi there! I'm Primary Care Provider, here to provide you advice
  and suggestions for basic medical issues and find Primary Care
  Centre near you, all from the comfort of your home.
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
