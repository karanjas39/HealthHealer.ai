"use strict";

const submitMessage = document.querySelector(".submitMessage");
const linksNavBar = document.querySelector(".links");
const menuButton = document.querySelector("nav .menuButton");
const navLinks = document.querySelectorAll(".links a");
const slides = document.querySelectorAll(".slide");
let index = 0;

// ! ***********************************************************************************************************FUNCIONS
function nextSlide() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

function openModal() {
  let fullYear = new Date().getFullYear();
  document.querySelector(".website-year").textContent = fullYear || 2023;
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey || apiKey == "null" || apiKey == "") {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function storeApiKey() {
  const apiKey = document.getElementById("api-key-input").value.trim();
  if (!apiKey) {
    return;
  }
  localStorage.setItem("apiKey", apiKey);
  closeModal();
}

function changeApiKey() {
  const apiKey = localStorage.getItem("apiKey");

  if (apiKey === null) {
    const newApiKey = prompt("No key is added, please add the proper key.");
    if (newApiKey !== null && newApiKey.trim() !== "") {
      localStorage.setItem("apiKey", newApiKey);
    }
  } else {
    const newApiKey = prompt("Enter new API Key");
    if (newApiKey !== null && newApiKey.trim() !== "") {
      localStorage.setItem("apiKey", newApiKey);
    }
  }
}

function goToLink() {
  window.open("https://www.youtube.com/watch?v=TE3rFhg0RdQ", "_blank");
}
function getApiKey() {
  window.open("https://platform.openai.com/account/api-keys", "_blank");
}

function showMessage(message = "") {
  try {
    let isMessageHide = submitMessage.classList.contains("hidden");
    if (isMessageHide) {
      submitMessage.textContent = message;
      submitMessage.classList.remove("hidden");
      setTimeout(() => {
        submitMessage.classList.add("hidden");
      }, 3000);
    } else {
      submitMessage.classList.add("hidden");
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in showMessage`);
  }
}

function isWordCountExceed(text, limit) {
  try {
    text = text.trim();
    var words = text.split(/\s+/);
    return words.length <= limit;
  } catch (error) {
    console.log(`Error: ${error.toString()} in isWordCountExceed`);
  }
}

async function sendMessage(query) {
  try {
    showMessage("Sending Message...");
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/contact/add`,
      {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      showMessage("Jaskaran Singh will be in touch with you shortly.");
    } else {
      showMessage(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in sendMessage`);
  }
}

// ! ***********************************************************************************************************EVENT LISTNERS
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    // hide the menu bar
    linksNavBar.classList.add("hide");
  });
});

menuButton.addEventListener("click", function () {
  linksNavBar.classList.toggle("hide");
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

document
  .querySelector(".contact-form-btn")
  .addEventListener("click", async () => {
    try {
      let name = document.querySelector(".name").value.trim();
      let email = document.querySelector(".email").value.trim();
      let message = document.querySelector(".message").value.trim();
      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let invalidFields = [];
      if (!name) {
        invalidFields.push("Name");
      }
      if (!email) {
        invalidFields.push("Email");
      }
      if (!message) {
        invalidFields.push("Message");
      }
      if (invalidFields.length != 0) {
        showMessage(`Required: ${invalidFields.join(", ")}`);
        return;
      }
      if (!emailRegex.test(email)) {
        return showMessage("Please provide a valid email address.");
      }
      if (!isWordCountExceed(name, 5)) {
        return showMessage("Please enter a name with a maximum of 5 words.");
      }
      if (!isWordCountExceed(message, 30)) {
        return showMessage(
          "Please limit your message to a maximum of 30 words."
        );
      }
      let data = {
        from: "HealthHealer.ai",
        email,
        name,
        message,
      };
      await sendMessage(data);
      document.querySelector(".name").value = "";
      document.querySelector(".email").value = "";
      document.querySelector(".message").value = "";
    } catch (error) {
      console.log(`Error: ${error.toString()} in sendingContactForm`);
    }
  });

setInterval(nextSlide, 4000);
showMessage("", 0);
