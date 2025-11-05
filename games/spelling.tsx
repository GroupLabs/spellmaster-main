import Loading from "@/components/loading";
import { IWord } from "@/lib/interface";
import { requestNewGame, submitGameResult } from "@/lib/util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getContent(wordList: IWord[], gameId: string) {
  const currentList = wordList.map((word) => ({
    word: word.word,
    sentence: word.exemplarUsage.replace(word.word, "_____"),
  }));

  const raw_html = `
  <html><head>
  <title>SpellingChallenge.edu - Plural Endings: -s, -es</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f8ff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    .game-container {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      max-width: 800px;
      width: 100%;
    }
    h1, h2 {
      color: #4a90e2;
      text-align: center;
    }
    .word-tiles {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .tile {
      width: 30px;
      height: 40px;
      border: 2px solid #4a90e2;
      margin: 0 5px 5px 0;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      color: #4a90e2;
    }
    .controls {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    #spellingForm button {
      background-color: #4a90e2;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 0 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    #spellingForm button:hover {
      background-color: #3a7bc8;
    }

    .controls button {
      background-color: #FAB900;
      color: black;
      border: none;
      padding: 10px 20px;
      margin: 0 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .controls button:hover {
      background-color: #d6a502;
    }

    input[type="text"] {
      width: 90%;
      padding: 10px;
      margin-bottom: 20px;
      font-size: 18px;
      border: 2px solid #4a90e2;
      border-radius: 5px;
    }
    .feedback {
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
    }
    .correct {
      color: #2ecc71;
    }
    .incorrect {
      color: #e74c3c;
    }
    .sentence {
      text-align: center;
      margin: 20px 0;
      font-size: 18px;
      line-height: 1.5;
    }
    .blank {
      display: inline-block;
      width: 100px;
      height: 2px;
      background-color: #4a90e2;
      vertical-align: middle;
    }
    .progress {
      text-align: center;
      margin-top: 20px;
      font-size: 16px;
      color: #4a90e2;
    }
    .celebration {
      text-align: center;
      font-size: 24px;
      color: #2ecc71;
      margin: 20px 0;
      animation: celebrate 1s ease-in-out infinite;
    }
    @keyframes celebrate {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    .star-counter {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .star {
      font-size: 24px;
      margin: 0 2px;
      color: #ccc;
    }
    .star.gold {
      color: gold;
    }
  </style>
  </head>
  <body>
    <div class="game-container">
      <h1>Speak and Spell Challenge</h1>
      <div class="star-counter" id="starCounter">
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
      </div>
      <div class="controls">
        <button id="playWord">Play Word</button>
        <button id="playSentence">Play Sentence</button>
      </div>
      <div class="sentence" id="sentenceDisplay"></div>
      <div class="word-tiles" id="wordTiles"></div>
      <form id="spellingForm">
        <input type="text" id="userInput" name="spelling" placeholder="Type the word here" autocomplete="off">
        <button type="submit">Check Spelling</button>
      </form>
      <div class="feedback" id="feedback"></div>
      <div class="progress" id="progress"></div>
      <div class="celebration" id="celebration" style="display: none;"></div>
    </div>
  
    <audio id="correctChime">
      <source src="https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg" type="audio/ogg">
      Your browser does not support the audio element.
    </audio>
  
    <script>
      const allWords = ${JSON.stringify(currentList)};
  
      let currentWords = [];
      let currentWordIndex = 0;
      let currentWord;
      let attempts = 0;
      let actualScore = 0;
      let totalScore = allWords.length;
      let wrongWords = [];
      let audioContext;
  
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
  
      function startNewRound() {
        shuffleArray(allWords);
        currentWords = allWords.slice(0, 10);
        currentWordIndex = 0;
        actualScore = 0;
        resetStars();
        selectNextWord();
      }
  
      function selectNextWord() {
        if (currentWordIndex < currentWords.length) {
          currentWord = currentWords[currentWordIndex];
          displayWordTiles(currentWord.word);
          displaySentence(currentWord.sentence);
          updateProgress();
          attempts = 0;
        } else {
          celebrateCompletion();
        }
      }
  
      function displayWordTiles(word) {
        const tilesContainer = document.getElementById('wordTiles');
        tilesContainer.innerHTML = '';
        for (let i = 0; i < word.length; i++) {
          const tile = document.createElement('div');
          tile.className = 'tile';
          tilesContainer.appendChild(tile);
        }
      }
  
      function displaySentence(sentence) {
        const sentenceDisplay = document.getElementById('sentenceDisplay');
        sentenceDisplay.innerHTML = sentence.replace('_____', '<span class="blank"></span>');
      }
  
      function playWord() {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        speechSynthesis.speak(utterance);
      }
  
      function playSentence() {
        const fullSentence = currentWord.sentence.replace('_____', currentWord.word);
        const utterance = new SpeechSynthesisUtterance(fullSentence);
        speechSynthesis.speak(utterance);
      }
  
      function updateTiles(input) {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile, index) => {
          if (index < input.length) {
            tile.textContent = input[index].toUpperCase();
          } else {
            tile.textContent = '';
          }
        });
      }
  
      function updateProgress() {
        const progressElement = document.getElementById('progress');
        progressElement.textContent = \`Word \${currentWordIndex + 1} of 10 \`;
      }
  
      function celebrateCompletion() {
        const celebrationElement = document.getElementById('celebration');
        celebrationElement.textContent = \`🎉 Congratulations! You've completed the round! 🎉\nYour score: \${actualScore} out of \${totalScore}\`;
        celebrationElement.style.display = 'block';
        // Submit the game result
        (${submitGameResult.toString()})('${gameId}', actualScore, totalScore, wrongWords);
        setTimeout(() => {
          celebrationElement.style.display = 'none';
        }, 5000);
      }
  
      function resetStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => star.classList.remove('gold'));
      }
  
      function updateStars(correct) {
        const stars = document.querySelectorAll('.star');
        if (correct) {
          stars[currentWordIndex].classList.add('gold');
        }
      }
  
      function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    function playSineWave(frequency, duration, volume) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
    
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
    
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
    
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    function playPing() {
        playSineWave(600, 0.1, 0.1);
    }
    
    function playCorrectChime() {
      initAudio();  
      playSineWave(800, 0.3, 0.2);
        setTimeout(() => playSineWave(1000, 0.3, 0.2), 100);
        setTimeout(() => playSineWave(1200, 0.3, 0.2), 200);
    }
      function playCorrectChime2() {
        const chime = document.getElementById('correctChime');
        chime.play();
      }
  
      document.getElementById('playWord').addEventListener('click', playWord);
      document.getElementById('playSentence').addEventListener('click', playSentence);
  
      document.getElementById('userInput').addEventListener('input', function(e) {
        updateTiles(e.target.value);
      });
  
      document.getElementById('spellingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userInput = document.getElementById('userInput').value.toLowerCase();
        const feedback = document.getElementById('feedback');
  
        if (userInput === currentWord.word) {
          feedback.textContent = "Correct! Great job!";
          feedback.className = "feedback correct";
          actualScore++;
          updateStars(true);
          playCorrectChime();
          setTimeout(() => {
            currentWordIndex++;
            selectNextWord();
            document.getElementById('userInput').value = '';
            updateTiles('');
            feedback.textContent = '';
          }, 1500);
        } else {
          attempts++;
          if (attempts === 1) {
            feedback.textContent = "Oops! Try again.";
            feedback.className = "feedback incorrect";
          } else {
            feedback.textContent = \`The correct spelling is: \${currentWord.word}\`;
            feedback.className = "feedback incorrect";
            updateStars(false);
            wrongWords.push(currentWord.word);
            setTimeout(() => {
              currentWordIndex++;
              selectNextWord();
              document.getElementById('userInput').value = '';
              updateTiles('');
              feedback.textContent = '';
            }, 2500);
          }
        }
      });
  
      startNewRound();
    </script>
  </body ></html >
  `;

  return raw_html;
}

export default function Game_Spelling({ wordListId }: { wordListId: string }) {
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
