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
  `Have you been to hospital's Gastroentrology Department before? (Yes/No)`,
  `Are you experiencing any specific symptoms or concerns? (Yes/No)`,
  `Have you ever been diagnosed with any gastrointestinal (GI) conditions?(Yes/No/I'm not sure)`,
  // <!-- If yes -->
  `Which GI condition have you been diagnosed with? (Options: Irritable bowel syndrome (IBS), Inflammatory bowel disease (IBD), Gastroesophageal reflux disease (GERD), Peptic ulcer disease, Celiac disease, Liver disease, Other)`,
  `Have you had any changes in your bowel movements? (Yes/No)`,
  // <!-- If yes -->
  `How would you describe the changes in your bowel movements? (Options: Diarrhea, Constipation, Alternating diarrhea and constipation, Bloody stools, Other)`,
  `Have you had any abdominal pain or discomfort? (Yes/No)`,
  // <!-- If yes -->
  `Where is the pain located? (Options: Upper abdomen, Lower abdomen, Other)`,
  `Have you noticed any changes in your appetite or weight? (Yes/No)`,
  `Have you experienced any nausea or vomiting? (Yes/No)`,
  `Do you have any family history of GI conditions? (Yes/No)`,
  `Have you had any recent diagnostic tests, such as an endoscopy or colonoscopy? (Yes/No)`,
  // <!-- If yes -->
  `When was your most recent test? (Options: Within the past month, Within the past year, More than a year ago)`,
  `Are you currently taking any medications for GI-related issues? (Yes/No)`,
  // <!-- If yes -->
  `Which medications are you taking?`,
  `Have you had any recent surgeries related to your GI tract? (Yes/No)`,
  // <!-- If Yes -->
  `Which surgery did you have and when was it done?`,
  `Have you had any recent changes to your diet or exercise routine? (Yes/No)`,
  `Do you smoke or use tobacco products? (Yes/No)`,
  `Do you have any other medical conditions? (Yes/No)`,
  // <!-- If yes -->
  `Please list any other medical conditions that you have.`,
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
    // TODO
    if (
      (currentBotMessageIndex === 5 ||
        currentBotMessageIndex === 7 ||
        currentBotMessageIndex === 9 ||
        currentBotMessageIndex === 14 ||
        currentBotMessageIndex === 16 ||
        currentBotMessageIndex === 18 ||
        currentBotMessageIndex === 22) &&
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
      const results = `Provide information about possible digestive system disorders and their symptoms by analyzing the folllowing data:
      What is your age: ${answers[1]}
      What is your gender: ${answers[2]}
      Have you been to hospital's Gastroentrology Department before: ${answers[3]}
      Are you experiencing any specific symptoms or concerns: ${answers[4]}
      Have you ever been diagnosed with any gastrointestinal (GI) conditions: ${answers[5]}
      Which GI condition have you been diagnosed with:${answers[6]}
      Have you had any changes in your bowel movements: ${answers[7]}
      How would you describe the changes in your bowel movements: ${answers[8]}
      Have you had any abdominal pain or discomfort: ${answers[9]}
      Where is the pain located: ${answers[10]}
      Have you noticed any changes in your appetite or weight: ${answers[11]}
      Have you experienced any nausea or vomiting: ${answers[12]}
      Do you have any family history of GI conditions: ${answers[13]}
      Have you had any recent diagnostic tests, such as an endoscopy or colonoscopy: ${answers[14]}
      When was your most recent test: ${answers[15]}
      Are you currently taking any medications for GI-related issues: ${answers[16]}
      Which medications are you taking: ${answers[17]}
      Have you had any recent surgeries related to your GI tract: ${answers[18]}
      Which surgery did you have and when was it done: ${answers[19]}
      Have you had any recent changes to your diet or exercise routine: ${answers[20]}
      Do you smoke or use tobacco products: ${answers[21]}
      Do you have any other medical conditions: ${answers[22]}
      Please list any other medical conditions that you have: ${answers[23]}
      Is there anything else that you'd like to share with us about your health history or current concerns: ${answers[24]}
      Also recommend lifestyle, treatment options and tests for further investigation if needed.`;
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
  messageContainer.innerHTML = `Hi there! I'm Gastroentrologist Bot, here to let you learn about
  gut health, identify potential digestive issues, and find
  gastroenterologists in your region.
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
