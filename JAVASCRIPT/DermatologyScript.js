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
  `Have you been to hospital's Dermatology Department before? (Yes/No)`,
  `Are you experiencing any specific skin symptoms or concerns? (Yes/No)`,

  // <!-- If Yes -->

  `Which skin symptoms are you experiencing? (Options: Rashes, Bumps or lumps, Itching, Dryness or scaling, Discoloration, Pain or discomfort, Other)`,
  `Have you noticed any changes in your skin, such as moles or spots? (Yes/No)`,

  // <!-- If yes -->

  `Can you describe the changes that you've noticed?`,
  `Have you been exposed to any new products or substances that may have caused a skin reaction? (Yes/No)`,

  // <!-- If yes -->

  `Which products or substances have you been exposed to?`,
  `Have you ever been diagnosed with a skin condition before? (Yes/No)`,

  // <!-- If yes -->

  `Which skin condition have you been diagnosed with?`,
  `Have you had any recent skin infections or injuries? (Yes/No)`,

  // <!-- If yes -->

  `Please describe the infection or injury.`,
  `Have you had any recent changes to your diet or lifestyle? (Yes/No)`,
  `Are you currently taking any medications or supplements? (Yes/No)`,

  // <!-- If yes -->

  `Which medications or supplements are you taking?`,
  `Have you had any recent sun exposure? (Yes/No)`,

  // <!-- If Yes -->

  `How much time do you spend in the sun each day?`,
  `Do you have a family history of skin conditions or skin cancer? (Yes/No)`,
  `Have you ever had skin cancer or pre-cancerous skin lesions? (Yes/No)`,

  // <!-- If yes -->

  `Which type of skin cancer or pre-cancerous lesion did you have?`,
  `Is there anything else that you'd like to share with us about your health history or current concerns?`,
];
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
    // TODO:
    if (
      (currentBotMessageIndex === 4 ||
        currentBotMessageIndex === 6 ||
        currentBotMessageIndex === 8 ||
        currentBotMessageIndex === 10 ||
        currentBotMessageIndex === 12 ||
        currentBotMessageIndex === 15 ||
        currentBotMessageIndex === 17 ||
        currentBotMessageIndex === 20) &&
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
      const results = `Provide information about possible skin conditions and risk factors by analyzing the folllowing data:
      What is your age: ${answers[1]}
      What is your gender: ${answers[2]}
      Have you been to hospital's Dermatology Department before: ${answers[3]}
      Are you experiencing any specific skin symptoms or concerns: ${answers[4]}
      Which skin symptoms are you experiencing: ${answers[5]}
      Have you noticed any changes in your skin, such as moles or spots: ${answers[6]}
      Can you describe the changes that you've noticed: ${answers[7]}
      Have you been exposed to any new products or substances that may have caused a skin reaction: ${answers[8]}
      Which products or substances have you been exposed to: ${answers[9]}
      Have you ever been diagnosed with a skin condition before: ${answers[10]}
      Which skin condition have you been diagnosed with: ${answers[11]}
      Have you had any recent skin infections or injuries: ${answers[12]}
      Please describe the infection or injury: ${answers[13]}
      Have you had any recent changes to your diet or lifestyle: ${answers[14]}
      Are you currently taking any medications or supplements: ${answers[15]}
      Which medications or supplements are you taking: ${answers[16]}
      Have you had any recent sun exposure: ${answers[17]}
      How much time do you spend in the sun each day: ${answers[18]}
      Do you have a family history of skin conditions or skin cancer: ${answers[19]}
      Have you ever had skin cancer or pre-cancerous skin lesions: ${answers[20]}
      Which type of skin cancer or pre-cancerous lesion did you have: ${answers[21]}
      Is there anything else that you'd like to share with us about your health history or current concerns: ${answers[22]}
      Also recommend lifestyle changes,treatment and products to improve skin health if needed.`;
      //   console.log(results);
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
  messageContainer.innerHTML = `Hi there! I'm Dermatologist Bot, here to help you discover the best
  skincare practices for your unique needs, assess potential skin
  concerns, and locate dermatologists in your area.
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
