"use strict";

const submitMessage = document.querySelector(".submitMessage");

// Open the modal dialog box
function openModal() {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Disable scrolling on background
  }
}

// Close the modal dialog box
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Enable scrolling on background
}

// Store the API key in local storage
function storeApiKey() {
  const apiKey = document.getElementById("api-key-input").value;
  localStorage.setItem("apiKey", apiKey);
  closeModal(); // Close the modal dialog box
}

// Change the API key stored in local storage
function changeApiKey() {
  const newApiKey = prompt("Enter new API Key");
  if (newApiKey != "") {
    localStorage.setItem("apiKey", newApiKey);
  } else {
    changeApiKey();
  }
}

function clearForm() {
  submitMessage.style.display = "block";
  setTimeout(() => {
    submitMessage.style.display = "none";
    form.reset();
  }, 2500);
}

function goToLink() {
  window.open("https://www.youtube.com/watch?v=TE3rFhg0RdQ", "_blank");
}
