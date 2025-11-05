import Loading from "@/components/loading";
import { IWord } from "@/lib/interface";
import { requestNewGame, submitGameResult } from "@/lib/util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getContent(wordList: IWord[], gameId: string) {
  const currentList = wordList.map((word) => ({
    word: word.word,
    clue: word.exemplarUsage.replace(word.word, "_____"),
  }));

  const raw_html = `
<html><head><title>BubbleBounce - Pop and Spell!</title>
<style>
  body, html {
    height: 100%;
    margin: 0;
    font-family: Arial, sans-serif;
    overflow: hidden;
    background: linear-gradient(to bottom, #87CEEB, #E0F6FF);
    touch-action: none;
  }
  #game-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  #word-display {
    font-size: 2em;
    margin-top: 20px;
    z-index: 10;
  }
  #clue-display {
    font-size: 1.2em;
    margin-top: 10px;
    font-style: italic;
    z-index: 10;
  }
  #bubble-container {
    width: 100%;
    height: calc(100% - 200px); /* Adjust for top elements and bottom margin */
    position: relative;
    margin-bottom: 100px; /* Increase bottom margin to 100px */
  }
  .bubble {
    position: absolute;
    font-size: 1.5em;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: transform 0.1s;
  }
  .bubble:hover {
    transform: scale(1.1);
  }
  #score {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5em;
    z-index: 10;
  }
  #lives-container {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 200px;
    z-index: 10;
  }
  #lives-label {
    font-size: 1.2em;
    margin-bottom: 5px;
  }
  #lives-display {
    font-size: 1.5em;
    font-weight: bold;
  }
  #level-complete {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    z-index: 100;
    display: none;
  }
  #level-complete h2 {
    margin-top: 0;
  }
  #next-level-btn {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  }
</style>
</head>
<body>
<div id="game-container">
  <div id="word-display"></div>
  <div id="clue-display"></div>
  <div id="bubble-container"></div>
  <div id="score">Score: <span id="score-value">0</span></div>
  <div id="lives-container">
    <div id="lives-label">Lives:</div>
    <div id="lives-display">10</div>
  </div>
  <div id="level-complete">
    <h2>Level Complete!</h2>
    <p>Congratulations! You've completed level <span id="current-level"></span>.</p>
    <button id="next-level-btn">Next Level</button>
  </div>
</div>

<script>
  const words = ${JSON.stringify(currentList)};
  let currentWord = '';
  let currentClue = '';
  let poppedLetters = [];
  let score = 0;
  let lives = 10;
  let bubbles = [];
  let level = 1;

  let actualScore = 0;
  let totalScore = words.length;
  let wrongWords = [];

  const wordDisplay = document.getElementById('word-display');
  const clueDisplay = document.getElementById('clue-display');
  const bubbleContainer = document.getElementById('bubble-container');
  const scoreDisplay = document.getElementById('score-value');
  const livesDisplay = document.getElementById('lives-display');
  const levelCompleteDisplay = document.getElementById('level-complete');
  const currentLevelDisplay = document.getElementById('current-level');
  const nextLevelBtn = document.getElementById('next-level-btn');

  const BUBBLE_RADIUS = 30;
  const BUBBLE_DIAMETER = BUBBLE_RADIUS * 2;
  const BASE_SPEED = 0.5;
  const MAX_SPEED = 2;
  const BOTTOM_MARGIN = 100; // New constant for bottom margin

  // Create an AudioContext
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  // Function to create and play a "pop" sound
  function playPopSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Start at 440 Hz
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // Ramp up to 880 Hz

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // Function to create and play a buzzer sound
  function playBuzzerSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function startGame() {
    bubbleContainer.innerHTML = '';
    bubbles = [];
    const wordObj = words[Math.floor(Math.random() * words.length)];
    currentWord = wordObj.word;
    currentClue = wordObj.clue;
    poppedLetters = [];
    updateLivesDisplay();
    prefillLetters();
    clueDisplay.textContent = \`Clue: \${currentClue}\`;
    createBubbles();
    animateBubbles();
  }

  function prefillLetters() {
    const prefillCount = Math.max(1, Math.floor(currentWord.length * 0.3));
    const uniqueIndices = new Set();
    while (uniqueIndices.size < prefillCount) {
      uniqueIndices.add(Math.floor(Math.random() * currentWord.length));
    }
    uniqueIndices.forEach(index => {
      poppedLetters.push(currentWord[index]);
    });
    updateWordDisplay();
  }

  function updateWordDisplay() {
    wordDisplay.textContent = currentWord.split('').map(letter => 
      poppedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  }

  function createBubbles() {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bubbleCount = 20; // Adjust this number to change difficulty

    for (let i = 0; i < bubbleCount; i++) {
      let letter;
      if (Math.random() < 0.6) {
        // 60% chance to create a letter from the word
        letter = currentWord[Math.floor(Math.random() * currentWord.length)];
      } else {
        // 40% chance to create a random letter
        letter = allLetters[Math.floor(Math.random() * allLetters.length)];
      }

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = letter;
      bubble.style.left = \`\${Math.random() * (window.innerWidth - BUBBLE_DIAMETER)}px\`;
      bubble.style.top = \`\${Math.random() * (window.innerHeight - BUBBLE_DIAMETER)}px\`;

      bubble.addEventListener('click', () => popBubble(bubble));
      bubbleContainer.appendChild(bubble);

      bubbles.push({
        element: bubble,
        x: parseFloat(bubble.style.left),
        y: parseFloat(bubble.style.top),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
  }

  function animateBubbles() {
    function update() {
      bubbles.forEach((bubble, index) => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Keep bubbles within the screen
        if (bubble.x <= 0 || bubble.x >= window.innerWidth - BUBBLE_DIAMETER) {
          bubble.vx *= -1;
          bubble.x = Math.max(0, Math.min(bubble.x, window.innerWidth - BUBBLE_DIAMETER));
        }
        if (bubble.y <= 0 || bubble.y >= window.innerHeight - BUBBLE_DIAMETER - BOTTOM_MARGIN) {
          bubble.vy *= -1;
          bubble.y = Math.max(0, Math.min(bubble.y, window.innerHeight - BUBBLE_DIAMETER - BOTTOM_MARGIN));
        }

        for (let i = index + 1; i < bubbles.length; i++) {
          const otherBubble = bubbles[i];
          const dx = bubble.x - otherBubble.x;
          const dy = bubble.y - otherBubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < BUBBLE_DIAMETER) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const vx1 = bubble.vx * cos + bubble.vy * sin;
            const vy1 = bubble.vy * cos - bubble.vx * sin;
            const vx2 = otherBubble.vx * cos + otherBubble.vy * sin;
            const vy2 = otherBubble.vy * cos - otherBubble.vx * sin;

            bubble.vx = vx2 * cos - vy1 * sin;
            bubble.vy = vy1 * cos + vx2 * sin;
            otherBubble.vx = vx1 * cos - vy2 * sin;
            otherBubble.vy = vy2 * cos + vx1 * sin;

            const overlap = BUBBLE_DIAMETER - distance;
            bubble.x += overlap * cos / 2;
            bubble.y += overlap * sin / 2;
            otherBubble.x -= overlap * cos / 2;
            otherBubble.y -= overlap * sin / 2;
          }
        }

        bubble.element.style.left = \`\${bubble.x}px\`;
        bubble.element.style.top = \`\${bubble.y}px\`;
      });

      requestAnimationFrame(update);
    }

    update();
  }

  function popBubble(bubble) {
    const letter = bubble.textContent;
    if (currentWord.includes(letter) && !poppedLetters.includes(letter)) {
      poppedLetters.push(letter);
      score += 10;
      scoreDisplay.textContent = score;
      updateWordDisplay();
      playPopSound();
      
      if (isWordComplete()) {
        actualScore ++;
        score += 50;
        scoreDisplay.textContent = score;
        level++;
        showLevelComplete();
      }
    } else if (!currentWord.includes(letter)) {
      score = Math.max(0, score - 5);
      scoreDisplay.textContent = score;
      lives--;
      if (!wrongWords.includes(currentWord)) {
        wrongWords.push(currentWord);
      }
      updateLivesDisplay();
      playBuzzerSound();
      if (lives <= 0) {
        gameOver();
      }
    }
    bubbleContainer.removeChild(bubble);
    bubbles = bubbles.filter(b => b.element !== bubble);
  }

  function isWordComplete() {
    return currentWord.split('').every(letter => poppedLetters.includes(letter));
  }

  function updateLivesDisplay() {
    livesDisplay.textContent = lives;
  }

  function showLevelComplete() {
    currentLevelDisplay.textContent = level - 1;
    levelCompleteDisplay.style.display = 'block';
  }

  function gameOver() {
    // Submit the game result
    (${submitGameResult.toString()})('${gameId}', actualScore, totalScore, wrongWords);
  }

  bubbleContainer.addEventListener('mousedown', handleInteraction);
  bubbleContainer.addEventListener('touchstart', handleInteraction);

  function handleInteraction(event) {
    event.preventDefault();
    const touch = event.type === 'touchstart' ? event.touches[0] : event;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('bubble')) {
      popBubble(element);
    }
  }

  nextLevelBtn.addEventListener('click', () => {
    levelCompleteDisplay.style.display = 'none';
    startGame();
  });

  startGame();
</script>
</body></html>`

  return raw_html;
}


export default function Game_WordBubble({
  wordListId,
}: {
  wordListId: string;
}) {
  const [wordList, setWordList] = useState<IWord[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    requestNewGame(wordListId).then((game) => {
      setGameId(game.gameId);
      setWordList(game.wordList);
    });
  }, [wordListId]);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      const { gameId } = event.data;
      if (gameId) {
        router.push(`/game/complete?gameId=${gameId}`);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  if (!gameId || wordList.length === 0) {
    return <Loading />;
  }
  return (
    <iframe
      srcDoc={getContent(wordList, gameId)}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}