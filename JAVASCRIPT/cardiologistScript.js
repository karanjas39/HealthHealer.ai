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
  `Have you been to hospital's Cardiology Department before? (Yes/No)`,
  `Have you ever been diagnosed with a heart condition? (Yes/No/I'm not sure)`,
  // <!-- If yes -->

  `Which heart condition have you been diagnosed with? (Options: Coronary artery disease, Heart failure, Arrhythmia, Valve disease, Congenital heart disease,Other)`,
  `Have you had any chest pain or discomfort? (Yes/No)`,
  //  <!-- If Yes -->

  `How would you describe the pain or discomfort? (Options: Crushing or squeezing pain, Sharp pain, Burning sensation, Tightness or pressure, Other)`,

  `Have you had any shortness of breath or difficulty breathing? (Yes/No)`,

  `Have you noticed any irregular heartbeats or palpitations? (Yes/No)`,
  `Are you experiencing any dizziness or lightheadedness? (Yes/No)`,
  `Do you have any swelling in your ankles or feet? (Yes/No)`,
  `Have you had any recent diagnostic tests, such as an electrocardiogram or echocardiogram? (Yes/No)`,
  //  <!-- If yes -->

  `When was your most recent test? (Options: Within the past month, Within the past year, More than a year ago)`,
  `Are you currently taking any medications for heart-related issues? (Yes/No)`,
  //  <!-- If yes -->

  `Which medications are you taking?`,

  `Have you had any recent procedures or surgeries related to your heart? (Yes/No)`,

  // <!-- If yes -->

  `Which procedure or surgery did you have and when was it done?`,

  `Have you had any recent changes to your diet or exercise routine? (Yes/No)`,

  `Do you smoke or use tobacco products? (Yes/No)`,

  `Have you had any family history of heart disease? (yes/No)`,

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
    if (
      (currentBotMessageIndex === 4 ||
        currentBotMessageIndex === 6 ||
        currentBotMessageIndex === 12 ||
        currentBotMessageIndex === 14 ||
        currentBotMessageIndex === 16 ||
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
      const results = `Provide information about possible heart conditions and risk factors by analyzing the folllowing data:
      What is your age: ${answers[1]}
      What is your gender: ${answers[2]}
      Have you been to hospital's Cardiology Department before: ${answers[3]}
      Have you ever been diagnosed with a heart condition: ${answers[4]}
      Which heart condition have you been diagnosed with: ${answers[5]}
      Have you had any chest pain or discomfort: ${answers[6]}
      How would you describe the pain or discomfort: ${answers[7]}
      Have you had any shortness of breath or difficulty breathing: ${answers[8]}
      Have you noticed any irregular heartbeats or palpitations: ${answers[9]}
      Are you experiencing any dizziness or lightheadedness: ${answers[10]}
      Do you have any swelling in your ankles or feet: ${answers[11]}
      Have you had any recent diagnostic tests, such as an electrocardiogram or echocardiogram: ${answers[12]}
      When was your most recent test: ${answers[13]}
      Are you currently taking any medications for heart-related issues: ${answers[14]}
      Which medications are you taking: ${answers[15]}
      Have you had any recent procedures or surgeries related to your heart: ${answers[16]}
      Which procedure or surgery did you have and when was it done: ${answers[17]}
      Have you had any recent changes to your diet or exercise routine: ${answers[18]}
      Do you smoke or use tobacco products: ${answers[19]}
      Have you had any family history of heart disease: ${answers[20]}
      Do you have any other medical conditions: ${answers[21]}
      Please list any other medical conditions that you have: ${answers[22]}
      Is there anything else that you'd like to share with us about your health history or current concerns: ${answers[23]}
      Also recommend lifestyle changes as well as treatment and medication options.
      `;
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
  messageContainer.innerHTML = `Hi there! I'm Cardiologist Bot, here to provide you personalized
  lifestyle recommendations, risk assessments, and find
  cardiologists near you, all from the comfort of your home.
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
