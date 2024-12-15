const OPENAI_API_KEY = "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";

let conversation = [
    { role: "system", content: "You are a helpful assistant." }
];

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            return; 
        } else {
            event.preventDefault(); 
            sendMessage();
        }
    }
});

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessageToChat(userMessage, "user");
    userInput.value = "";
    conversation.push({ role: "user", content: userMessage });

    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message assistant loading';
    loadingMessage.textContent = 'Tænker...';
    messagesDiv.appendChild(loadingMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversation,
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content.trim();
        
        messagesDiv.removeChild(loadingMessage);
        conversation.push({ role: "assistant", content: assistantMessage });
        addMessageToChat(assistantMessage, "assistant");
    } catch (error) {
        console.error(error);
        messagesDiv.removeChild(loadingMessage);
        addMessageToChat("Sorry, I couldn't respond at this time.", "assistant");
    }
}

function addMessageToChat(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);

    if (sender === "assistant") {
        const toolsContainer = document.createElement('div');
        toolsContainer.style.position = "relative";
        toolsContainer.style.display = "flex";
        toolsContainer.style.flexDirection = "row";
        toolsContainer.style.marginTop = "10px";

        // Copy Icon
        const copyIcon = document.createElement('i');
        copyIcon.className = "fa-regular fa-clone";
        copyIcon.style.cursor = "pointer";
        copyIcon.style.marginRight = "10px";
        copyIcon.style.padding = "8px";
        copyIcon.style.borderRadius = "4px";
        copyIcon.style.transition = "background-color 0.3s";
        copyIcon.style.position = "relative";
        copyIcon.addEventListener('mouseover', () => {
            tooltipCopy.style.visibility = "visible";
            tooltipCopy.style.opacity = "1";
        });
        copyIcon.addEventListener('mouseout', () => {
            tooltipCopy.style.visibility = "hidden";
            tooltipCopy.style.opacity = "0";
        });
        copyIcon.addEventListener('click', () => copyToClipboard(text));
        toolsContainer.appendChild(copyIcon);

        // Tooltip for Copy Icon
        const tooltipCopy = document.createElement('span');
        tooltipCopy.textContent = "Copy";
        tooltipCopy.style.visibility = "hidden";
        tooltipCopy.style.position = "absolute";
        tooltipCopy.style.backgroundColor = "#333";
        tooltipCopy.style.color = "#fff";
        tooltipCopy.style.textAlign = "center";
        tooltipCopy.style.borderRadius = "4px";
        tooltipCopy.style.padding = "5px";
        tooltipCopy.style.fontSize = "12px";
        tooltipCopy.style.width = "50px";
        tooltipCopy.style.top = "130%"; // Position slightly below the icon
        tooltipCopy.style.left = "50%";
        tooltipCopy.style.transform = "translateX(-50%)";
        tooltipCopy.style.zIndex = "1";
        tooltipCopy.style.transition = "opacity 0.3s";
        toolsContainer.appendChild(tooltipCopy);

        // Text-to-Speech Icon
        const ttsIcon = document.createElement('i');
        ttsIcon.className = "fa-solid fa-volume-high";
        ttsIcon.style.cursor = "pointer";
        ttsIcon.style.padding = "8px";
        ttsIcon.style.borderRadius = "4px";
        ttsIcon.style.transition = "background-color 0.3s";
        ttsIcon.style.position = "relative";
        ttsIcon.addEventListener('mouseover', () => {
            tooltipTTS.style.visibility = "visible";
            tooltipTTS.style.opacity = "1";
        });
        ttsIcon.addEventListener('mouseout', () => {
            tooltipTTS.style.visibility = "hidden";
            tooltipTTS.style.opacity = "0";
        });
        ttsIcon.addEventListener('click', () => speakText(text));
        toolsContainer.appendChild(ttsIcon);

        // Tooltip for Text-to-Speech Icon
        const tooltipTTS = document.createElement('span');
        tooltipTTS.textContent = "Speak";
        tooltipTTS.style.visibility = "hidden";
        tooltipTTS.style.position = "absolute";
        tooltipTTS.style.backgroundColor = "#333";
        tooltipTTS.style.color = "#fff";
        tooltipTTS.style.textAlign = "center";
        tooltipTTS.style.borderRadius = "4px";
        tooltipTTS.style.padding = "5px";
        tooltipTTS.style.fontSize = "12px";
        tooltipTTS.style.width = "50px";
        tooltipTTS.style.top = "130%"; // Position slightly below the icon
        tooltipTTS.style.left = "50%";
        tooltipTTS.style.transform = "translateX(-50%)";
        tooltipTTS.style.zIndex = "1";
        tooltipTTS.style.transition = "opacity 0.3s";
        toolsContainer.appendChild(tooltipTTS);

        messageDiv.appendChild(toolsContainer);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Text-to-Speech Function
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Adjust language as needed
    window.speechSynthesis.speak(utterance);
}
