const chatContainer = document.querySelector('.chat-container');
const menu = document.querySelector('.menu');
const chatbot1Button = document.getElementById('chatbot1');
const chatbot2Button = document.getElementById('chatbot2');
const showMenuButton = document.getElementById('show-menu-button');

let activeChatbot = null;

// Sample chat data for Bot 1
const sampleChats1 = [
  { sender: 'me', content: 'Hi', timestamp: new Date('2023-04-18T10:00:00') },
  { sender: 'contact', content: 'Hello there!', timestamp: new Date('2023-04-18T10:01:00') },
];

// Emotion arrays
const happy = ["😄", "😁", "😊", "😃", ":)", ":D", "XD", "<3"];
const sad = ["😔", "😢", "😭", "😥", ":(", ":'(", ";(", "D:"];
const angry = ["😡", "😠", "🤬", "😤", ">:(", "(-_-ﾒ)", "😠"]; 
const confuse = ["😕", "🤔", "🤨", ":/", ":S", "-_-"]; 
const hate = ["😠", "😡", "🤬", "👿", ">:O", "(╯°□°）╯︵ ┻━┻"]; 

// Function to get a random emoji with weighted probability
function getRandomEmoji(emotionArray, increaseProbabilityBy = 0) {
  // Increase probability for the target emotion
  const weightedArray = [
    ...emotionArray,
    ...Array(increaseProbabilityBy).fill(emotionArray[0])
  ];

  const randomIndex = Math.floor(Math.random() * weightedArray.length);
  return weightedArray[randomIndex];
}

// Function to get bot's response with emoji
function getBotResponse(userInput) {
  userInput = userInput.toLowerCase();

  // Define chat pairs with responses and associated emotion arrays
  const pairs = [
    [/^(Hi|Hello|Hey|Howdy|Greetings)$/i, ["Hello!", "Hi there!", "Hey hey!", "Howdy partner!", "Greetings to you too!", happy]],
    [/^How are you\??$/i, ["I'm doing well, thanks!", "Not bad, how about you?", "I'm a chatbot, but I'm feeling positive!", "I'm fantastic, thanks for asking!", happy]],
    [/^(Bye|Goodbye|See ya|Later|Ciao)$/i, ["See you later!", "Goodbye!", "Talk to you soon!", "Have a great day!", "Ciao for now!", happy]],
    [/^(hate|dislike|detest|abhor|loathe)$/i, ["I try to be neutral, but those are strong words.", "Let's focus on positive things.", "I understand you're feeling negative.", "Everyone's entitled to their opinion, even if it's negative.", hate]],
    [/^(confused\??|huh\??|what\??|don't understand)$/i, ["I'm a bit confused too.", "Can you explain it in another way?", "Let me see if I understand.", "Could you rephrase that?", confuse]],
    [/^(sad|unhappy|down|depressed|bummed)$/i, ["I'm sorry to hear you're feeling that way.", "Is there anything I can do to help?", "It's okay to feel sad sometimes.", "I'm here to listen if you want to talk.", sad]],
    [/^(good|great|awesome|fantastic|excellent|wonderful|terrific|marvelous|superb)$/i, ["That's great to hear!", "I'm happy for you!", "Keep up the good work!", happy]],
    [/^(bad|terrible|awful|horrible|dreadful)$/i, ["I'm sorry to hear that.", "That sounds really tough.", "Is there anything I can do to help?", sad]],
    [/^(tired|exhausted|worn out|beat)$/i, ["Get some rest!", "You deserve a break.", "Maybe a nap would help?", sad]],
    [/^(excited|thrilled|pumped|stoked)$/i, ["That's awesome!", "I'm excited for you!", "Tell me more!", happy]],
    [/^(bored|uninterested|dull)$/i, ["Maybe we can find something fun to talk about?", "What are you interested in?", "I'm here to entertain you!", confuse]],
    [/^(hungry|starving|famished)$/i, ["Go grab a bite to eat!", "I'm hungry just thinking about it!", "What's your favorite food?", happy]],
    [/^(thirsty|parched|dehydrated)$/i, ["Go get a drink!", "Water is always a good choice.", "Stay hydrated!", happy]],
    [/^(love|adore|cherish)$/i, ["That's so sweet!", "Love is a beautiful thing.", "<3", happy]],
    [/^(happy birthday)$/i, ["Happy birthday!", "Wishing you all the best!", "May your day be filled with joy!", happy]],
    [/^(thank you|thanks|thx)$/i, ["You're welcome!", "No problem!", "Anytime!", happy]],
    [/^(please|plz)$/i, ["Sure thing!", "Happy to help!", "Of course!", happy]],
    [/^(yes|yeah|yep|sure|okay|ok)$/i, ["Great!", "Sounds good!", "Let's do it!", happy]],
    [/^(no|nope|nah|not really)$/i, ["Okay, no problem.", "Maybe another time?", "I understand.", sad]],
    [/^(maybe|perhaps|possibly)$/i, ["It's up to you!", "No pressure.", "Let me know when you decide.", confuse]],
    [/^(what's your name\??|who are you\??)$/i, ["I'm a friendly chatbot!", "You can call me Botty.", "I'm here to chat and have fun!", happy]],
    // ... add 170 more similar pairs ... 
];

  // Check for pattern matches and add corresponding emoji
  for (const [pattern, responsesAndEmoji] of pairs) {
    if (pattern.test(userInput)) {
      const responses = responsesAndEmoji.slice(0, -1);
      const emotionArray = responsesAndEmoji[responsesAndEmoji.length - 1];

      const randomResponseIndex = Math.floor(Math.random() * responses.length);

      let randomEmoji;
      if (emotionArray === happy) {
        randomEmoji = getRandomEmoji(emotionArray, 10); // 10% higher chance
      } else if (emotionArray === angry || emotionArray === sad || emotionArray === confuse) {
        randomEmoji = getRandomEmoji(emotionArray, 5); // 5% higher chance
      } else {
        randomEmoji = getRandomEmoji(emotionArray); // Default probability
      }

      return responses[randomResponseIndex] + " " + randomEmoji;
    }
  }

  // Default response if no match
  return "Interesting. Tell me more!";
}

function formatTimestamp(timestamp) {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMessages(messages) {
  const messageContainer = document.querySelector('.message-container');
  messageContainer.innerHTML = '';

  messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.sender);
    messageElement.innerHTML = `
      <p class="message-content">${message.content}</p>
      <span class="message-timestamp">${formatTimestamp(message.timestamp)}</span>
    `;
    messageContainer.appendChild(messageElement);
  });

  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function addNewMessage(sender, content) {
  const newMessage = { sender, content, timestamp: new Date() };
  sampleChats1.push(newMessage);
  renderMessages(sampleChats1);

  if (sender === 'me') {
    if (activeChatbot === 'chatbot1') {
      let response = getBotResponse(content);
      if (response) {
        setTimeout(() => addNewMessage('contact', response), 1000);
      }
    } else if (activeChatbot === 'chatbot2') {
      let response = calculate(content);
      if (response) {
        setTimeout(() => addNewMessage('contact', response), 1000);
      }
    }
  }
}

function calculate(expression) {
  try {
    const result = math.evaluate(expression);
    return `${result}`;
  } catch (error) {
    return "Invalid expression. Please try again.";
  }
}


// Event listeners for chatbot selection
chatbot1Button.addEventListener('click', () => {
  activeChatbot = 'chatbot1';
  menu.style.display = 'none';
  chatContainer.style.display = 'flex';
  renderMessages(sampleChats1);
});

chatbot2Button.addEventListener('click', () => {
  activeChatbot = 'chatbot2';
  menu.style.display = 'none';
  chatContainer.style.display = 'flex';
  renderMessages([]); // Start with an empty chat history
});

// Event listener for showing the menu
showMenuButton.addEventListener('click', () => {
  menu.style.display = 'block';
  chatContainer.style.display = 'none';
});

// Event listener for sending messages
const messageForm = document.querySelector('.message-form');
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageInput = document.querySelector('.message-input');
  const messageContent = messageInput.value.trim();
  if (messageContent) {
    addNewMessage('me', messageContent);
    messageInput.value = '';
  }
});