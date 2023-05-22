const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");
const loading = document.getElementById("loading");
const historyInput = document.getElementById("history");

async function fetchStream() {
  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: chatInput.value,
      history: historyInput.value,
    }),
  });

  if (!response.ok) {
    displayMessage("assistant", "An error occurred. Please try again.");
    return;
  }

  const data = await response.json(); // fetch the JSON directly
  displayMessage("assistant", data); // pass the data to the display function
  historyInput.value += data;

  loading.style.display = "none";
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = chatInput.value;
  displayMessage("user", userMessage);

  historyInput.value += userMessage;
  loading.style.display = "block";

  fetchStream();
  chatInput.value = "";
});

function displayMessage(role, content) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", role);

  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");

  const converter = new showdown.Converter();
  messageElement.innerHTML = converter.makeHtml(content);

  messageContainer.appendChild(messageElement);
  chatWindow.appendChild(messageContainer);

  // Smooth scrolling
  chatWindow.scrollTo({
    top: chatWindow.scrollHeight,
    behavior: "smooth",
  });
}
