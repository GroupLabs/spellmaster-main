import { IWord } from "@/lib/interface";
import { useEffect, useState } from "react";
import { requestNewGame, submitGameResult } from "@/lib/util";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";

function getContent(wordList: IWord[], gameId: string) {
  const currentList = wordList.map((word) => (
    word.word
  ));

  const raw_html = `
  <html><head><base href="https://wordleshuffle.example.com/">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WordleShuffle: Compound Words Challenge</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    #game-container {
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      padding: 20px;
      text-align: center;
      position: relative;
      width: 1024px;
      height: 576px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    h1 {
      color: #333;
      font-size: 28px;
      margin-bottom: 10px;
    }
    #word-grid {
      display: grid;
      grid-template-columns: repeat(var(--word-length), 50px);
      gap: 5px;
      justify-content: center;
      margin: 10px auto;
    }
    .letter-tile {
      width: 50px;
      height: 50px;
      border: 2px solid #ccc;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      text-transform: uppercase;
    }
    #shuffled-letters {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 10px 0;
    }
    .shuffle-tile {
      width: 45px;
      height: 45px;
      background-color: #f9d5a7;
      border: 2px solid #e3a857;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.1s;
    }
    .shuffle-tile:hover {
      transform: scale(1.05);
    }
    #controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
    }
    #submit-btn, #clear-btn, #hear-btn, #play-again-btn {
      font-size: 18px;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    #submit-btn:hover, #clear-btn:hover, #hear-btn:hover, #play-again-btn:hover {
      background-color: #45a049;
    }
    #hear-btn {
      background-color: #3498db;
    }
    #hear-btn:hover {
      background-color: #2980b9;
    }
    #play-again-btn {
      display: none;
      background-color: #ff9800;
    }
    #play-again-btn:hover {
      background-color: #f57c00;
    }
    #message {
      font-size: 18px;
      margin-top: 10px;
      min-height: 24px;
    }
    .correct {
      background-color: #6aaa64;
      color: white;
    }
    .wrong-position {
      background-color: #c9b458;
      color: white;
    }
    .incorrect {
      background-color: #787c7e;
      color: white;
    }
    #notification {
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      opacity: 0;
      transition: top 0.5s, opacity 0.5s;
    }
    #notification.show {
      top: 10px;
      opacity: 1;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.2s ease-in-out 0s 2;
    }
  </style>
  </head>
  <body>
    <div id="game-container">
      <div id="notification">Good job!</div>
      <h1>Wurdle-Shuffle</h1>
      <div id="word-grid"></div>
      <div id="shuffled-letters"></div>
      <div id="controls">
        <button id="submit-btn">Submit</button>
        <button id="clear-btn">Clear</button>
        <button id="hear-btn">Hear Word</button>
        <button id="play-again-btn">Play Again</button>
      </div>
      <div id="message"></div>
    </div>
  
    <script>
      const allWords = ${JSON.stringify(currentList)};
      console.log(allWords)
      let words = [];
      let currentWordIndex = 0;
      let currentWord = '';
      let shuffledLetters = [];
      let attempts = 0;
      const maxAttempts = 3;
  
      // Create AudioContext for sound effects
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
      function playSound(frequency, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
  
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
  
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);
  
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
      }
  
      function playChime() {
        playSound(800, 0.1);
        setTimeout(() => playSound(1000, 0.1), 100);
        setTimeout(() => playSound(1200, 0.1), 200);
      }
  
      function playBuzz() {
        playSound(200, 0.3);
      }
  
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
  
      function initializeGame() {
        words = [...allWords];
        shuffleArray(words);
        currentWordIndex = 0;
        startNewWord();
      }
  
      function startNewWord() {
        currentWord = words[currentWordIndex];
        shuffledLetters = shuffleWord(currentWord);
        createWordGrid();
        createShuffledLetters();
        attempts = 0;
        updateMessage(\`Word \${currentWordIndex + 1} of \${words.length}\`);
        enableButtons();
        document.getElementById('play-again-btn').style.display = 'none';
      }
  
      function shuffleWord(word) {
        return word.split(\'\').sort(() => Math.random() - 0.5);
      }
  
      function createWordGrid() {
        const grid = document.getElementById('word-grid');
        grid.innerHTML = '';
        grid.style.setProperty('--word-length', currentWord.length);
        for (let i = 0; i < maxAttempts; i++) {
          for (let j = 0; j < currentWord.length; j++) {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.dataset.row = i;
            tile.dataset.col = j;
            grid.appendChild(tile);
          }
        }
      }
  
      function createShuffledLetters() {
        const container = document.getElementById('shuffled-letters');
        container.innerHTML = '';
        shuffledLetters.forEach((letter, index) => {
          const tile = document.createElement('div');
          tile.className = 'shuffle-tile';
          tile.textContent = letter;
          tile.addEventListener('click', () => placeLetter(letter, index));
          container.appendChild(tile);
        });
      }
  
      function placeLetter(letter, index) {
        const emptyTile = document.querySelector(\`.letter-tile:empty[data-row="\${attempts}"]\`);
        if (emptyTile) {
          emptyTile.textContent = letter;
          document.querySelectorAll('.shuffle-tile')[index].style.visibility = 'hidden';
        }
      }
  
      function clearCurrentAttempt() {
        document.querySelectorAll(\`.letter-tile[data-row="\${attempts}"]\`).forEach(tile => {
          tile.textContent = '';
          tile.className = 'letter-tile';
        });
        document.querySelectorAll('.shuffle-tile').forEach(tile => {
          tile.style.visibility = 'visible';
        });
      }
  
      function submitAttempt() {
        const currentAttempt = Array.from(document.querySelectorAll(\`.letter-tile[data-row="\${attempts}"]\`))
          .map(tile => tile.textContent)
          .join('');
  
        if (currentAttempt.length !== currentWord.length) {
          updateMessage('Please use all letters before submitting.');
          return;
        }
  
        checkAttempt(currentAttempt);
        attempts++;
  
        if (currentAttempt === currentWord) {
          playChime();
          showNotification('Good job!');
          updateMessage('Correct! Moving to the next word.');
          setTimeout(() => {
            currentWordIndex++;
            if (currentWordIndex < words.length) {
              startNewWord();
            } else {
              updateMessage('Good job, try again!');
              disableButtons();
              document.getElementById('play-again-btn').style.display = 'inline-block';
            }
          }, 1500);
        } else {
          playBuzz();
          shakeGrid();
          if (attempts >= maxAttempts) {
            updateMessage(\`Game over. The correct spelling is: \${currentWord}\`);
            disableButtons();
            document.getElementById('play-again-btn').style.display = 'inline-block';
          } else {
            updateMessage(\`Attempt \${attempts + 1} of \${maxAttempts}\`);
            document.querySelectorAll('.shuffle-tile').forEach(tile => {
              tile.style.visibility = 'visible';
            });
          }
        }
      }
  
      function checkAttempt(attempt) {
        const tiles = document.querySelectorAll(\`.letter-tile[data-row="\${attempts}"]\`);
        const letterCounts = {};
        currentWord.split(\'\').forEach(letter => {
          letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        });
  
        // First pass: mark correct letters
        tiles.forEach((tile, index) => {
          if (attempt[index] === currentWord[index]) {
            tile.classList.add('correct');
            letterCounts[attempt[index]]--;
          }
        });
  
        // Second pass: mark wrong position and incorrect letters
        tiles.forEach((tile, index) => {
          if (!tile.classList.contains('correct')) {
            if (letterCounts[attempt[index]] > 0) {
              tile.classList.add('wrong-position');
              letterCounts[attempt[index]]--;
            } else {
              tile.classList.add('incorrect');
            }
          }
        });
      }
  
      function updateMessage(msg) {
        document.getElementById('message').textContent = msg;
      }
  
      function hearWord() {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        speechSynthesis.speak(utterance);
      }
  
      function enableButtons() {
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('clear-btn').disabled = false;
        document.getElementById('hear-btn').disabled = false;
      }
  
      function disableButtons() {
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('clear-btn').disabled = true;
      }
  
      function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 2000);
      }
  
      function shakeGrid() {
        const grid = document.getElementById('word-grid');
        grid.classList.add('shake');
        setTimeout(() => {
          grid.classList.remove('shake');
        }, 500);
      }
  
      document.getElementById('submit-btn').addEventListener('click', submitAttempt);
      document.getElementById('clear-btn').addEventListener('click', clearCurrentAttempt);
      document.getElementById('hear-btn').addEventListener('click', hearWord);
      document.getElementById('play-again-btn').addEventListener('click', initializeGame);
  
      initializeGame();
    </script>
  </body>
  </html>
  `;

  return raw_html;
}

export default function Game_LetterBridge({
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
