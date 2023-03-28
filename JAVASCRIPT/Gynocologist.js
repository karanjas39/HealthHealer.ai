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
  `Have you visited in hospital's Obstetrics and Gynecology department before? (Yes/No)`,
  `Are you experiencing any specific symptoms or concerns?`,
  `When was the date of your last menstrual period?`,
  `How long is your typical menstrual cycle?`,
  `Have you ever been pregnant before? (Yes/No)`,
  // <!-- If yes -->
  `How many times have you been pregnant before?`,
  `Have you ever had a miscarriage or abortion? (Yes/No)`,
  // <!-- If yes -->
  `How many times have you had a miscarriage or abortion?`,
  `Are you currently sexually active? (Yes/No)`,
  // <!-- If yes -->
  `Are you using any form of contraception?`,
  `Have you had any unusual vaginal discharge or bleeding recently? (Yes/No)`,
  `Have you noticed any lumps or changes in your breasts recently? (Yes/No)`,
  `Have you had any pain or discomfort during sex? (Yes/No)`,
  `Have you had any issues with urinary incontinence or urinary tract infections? (Yes/No)`,
  `Have you had a Pap smear or HPV test in the past? (Yes/No)`,
  // <!-- If yes -->
  `When was your most recent test?`,
  `Have you ever been diagnosed with any gynecological conditions such as endometriosis or polycystic ovary syndrome? (Yes/No)`,
  // <!-- If yes -->
  `Please provide more details about your diagnosis.`,
  `Are you experiencing any pain or discomfort in your pelvic area? (Yes/No)`,
  `Have you had any previous surgeries related to your reproductive system? (Yes/No)`,
  // <!-- If yes -->
  `Which surgeries did you have and when were they done?`,
  `Are you experiencing any symptoms of menopause? (Yes/No)`,
  `Have you had any recent changes in your mood or energy levels? (Yes/No)`,
  `Do you have any concerns or questions about your reproductive health that you'd like to discuss with a doctor or nurse? (Yes/No)`,
  `Do you have any other medical conditions that we should be aware of? (Yes/No)`,
  `Is there anything else you'd like to share with us about your health history or current concerns?`,
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
    // TODO
    if (
      (currentBotMessageIndex === 6 ||
        currentBotMessageIndex === 8 ||
        currentBotMessageIndex === 10 ||
        currentBotMessageIndex === 16 ||
        currentBotMessageIndex === 18 ||
        currentBotMessageIndex === 21) &&
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
      const results = `Provide information about possible pregnancy, contraception, menstrual cycle, and other women's health issues by analyzing the folllowing data:
      What is your age: ${answers[1]}
      Have you visited in hospital's Obstetrics and Gynecology department before: ${answers[2]}
      Are you experiencing any specific symptoms or concerns: ${answers[3]}
      When was the date of your last menstrual period: ${answers[4]}
      How long is your typical menstrual cycle: ${answers[5]}
      Have you ever been pregnant before: ${answers[6]}
      How many times have you been pregnant before: ${answers[7]}
      Have you ever had a miscarriage or abortion: ${answers[8]}
      How many times have you had a miscarriage or abortion: ${answers[9]}
      Are you currently sexually active: ${answers[10]}
      Are you using any form of contraception:${answers[11]}
      Have you had any unusual vaginal discharge or bleeding recently: ${answers[12]}
      Have you noticed any lumps or changes in your breasts recently: ${answers[13]}
      Have you had any pain or discomfort during sex: ${answers[14]}
      Have you had any issues with urinary incontinence or urinary tract infections: ${answers[15]}
      Have you had a Pap smear or HPV test in the past: ${answers[16]}
      When was your most recent test: ${answers[17]}
      Have you ever been diagnosed with any gynecological conditions such as endometriosis or polycystic ovary syndrome: ${answers[18]}
      Please provide more details about your diagnosis: ${answers[19]}
      Are you experiencing any pain or discomfort in your pelvic area: ${answers[20]}
      Have you had any previous surgeries related to your reproductive system: ${answers[21]}
      Which surgeries did you have and when were they done: ${answers[22]}
      Are you experiencing any symptoms of menopause: ${answers[23]}
      Have you had any recent changes in your mood or energy levels: ${answers[24]}
      Do you have any concerns or questions about your reproductive health that you'd like to discuss with a doctor or nurse: ${answers[25]}
      Do you have any other medical conditions that we should be aware of: ${answers[26]}
      Is there anything else you'd like to share with us about your health history or current concerns: ${answers[27]}
      Provide medical recommendations as per the above data.`;
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
  messageContainer.innerHTML = ` Hi there! I'm Obstetrician and Gynecologist Bot, here to provide
  you advice on prenatal care, address women's health issues, and
  find OBGYNs near you.
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
