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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Longest Streak</title>
  <style>
      body {
          font-family: 'Montserrat', sans-serif;
          background-color: #f0f0f0;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          transition: background-color 0.5s ease;
      }
      #game-container {
          width: 100%;
          max-width: 800px;
          text-align: center;
          background-color: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
          color: #333;
      }
      #sentence {
          font-size: 1.5em;
          margin-bottom: 30px;
          background-color: #f9f9f9;
          color: #333;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      #choices {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
      }
      .choice-btn {
          border: none;
          color: white;
          padding: 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 1.2em;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 10px;
          transition: transform 0.3s, box-shadow 0.3s;
          font-weight: bold;
      }
      .choice-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
      #feedback {
          margin-top: 30px;
          font-weight: bold;
          font-size: 1.3em;
          min-height: 30px;
      }
      #next-btn {
          display: none;
          margin-top: 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1.2em;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
      }
      #next-btn:hover {
          background-color: #45a049;
          transform: scale(1.05);
      }
      .timer {
          width: 100%;
          height: 10px;
          background-color: #e0e0e0;
          margin-top: 20px;
          border-radius: 5px;
          overflow: hidden;
      }
      .timer-bar {
          width: 100%;
          height: 100%;
          background-color: #4CAF50;
          transition: width 1s linear;
      }
      #streak-container {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 1.5em;
          font-weight: bold;
      }
      #streak-count {
          display: inline-block;
          transition: color 0.3s ease;
      }
  </style>
  </head>
  <body>
  <div id="game-container">
      <h1>Missing Word</h1>
      <h3>Select the correct spelling</h3>
      <div id="sentence"></div>
      <div id="choices"></div>
      <div id="feedback"></div>
      <button id="next-btn">Next Question</button>
      <div class="timer">
          <div class="timer-bar"></div>
      </div>
  </div>
  <div id="streak-container">
      Streak: <span id="streak-count">0</span>
  </div>
  
  <script>
      const words = ${JSON.stringify(currentList)};
      let actualScore = 0;
      let totalScore = words.length;
      let wrongWords = [];    
  
      let currentWordIndex = 0;
      let timerInterval;
      let streak = 0;
  
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
      const streakColors = ['#FF6B6B', '#FF9B54', '#4ECDC4', '#45B7D1', '#FFA07A', '#C780E8'];
  
      // Create an audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
  
      // Function to play a chime sound
      function playChime() {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
  
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
  
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
  
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
      }
  
      function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
          }
      }
  
      function generateMisspellings(word) {
          const misspellings = [
              word.replace(/([aeiou])/, m => 'aeiou'.replace(m, '')[Math.floor(Math.random() * 4)]),
              word.slice(0, -1) + (word.slice(-1) === 's' ? '' : 's'),
              generatePhoneticMisspelling(word)
          ];
          return misspellings.filter(w => w !== word);
      }
  
      function generatePhoneticMisspelling(word) {
          const phoneticMisspellings = {
              'sun': 'son', 'butter': 'budder', 'tooth': 'tuth', 'wind': 'wynd',
              'star': 'starr', 'key': 'kee', 'light': 'lite', 'book': 'buk',
              'moon': 'mune', 'fire': 'fyre'
          };
  
          for (const [correct, misspelled] of Object.entries(phoneticMisspellings)) {
              if (word.includes(correct)) {
                  return word.replace(correct, misspelled);
              }
          }
  
          return word.replace(/(.)(.)/, (_, p1, p2) => p2 + p1);
      }
  
      function displayQuestion() {
          const wordObj = words[currentWordIndex];
          const sentence = document.getElementById('sentence');
          const choices = document.getElementById('choices');
          const feedback = document.getElementById('feedback');
          const nextBtn = document.getElementById('next-btn');
  
          sentence.textContent = wordObj.sentence;
          feedback.textContent = '';
          nextBtn.style.display = 'none';
  
          const misspellings = generateMisspellings(wordObj.word);
          const allChoices = [wordObj.word, ...misspellings];
          shuffleArray(allChoices);
  
          choices.innerHTML = '';
          allChoices.forEach((choice, index) => {
              const button = document.createElement('button');
              button.textContent = choice;
              button.className = 'choice-btn';
              button.style.backgroundColor = colors[index];
              button.addEventListener('click', () => checkAnswer(choice, wordObj.word));
              choices.appendChild(button);
          });
  
          startTimer();
      }
  
      function checkAnswer(choice, correctWord) {
          clearInterval(timerInterval);
          const feedback = document.getElementById('feedback');
          const nextBtn = document.getElementById('next-btn');
          const buttons = document.querySelectorAll('.choice-btn');
          const streakCount = document.getElementById('streak-count');
  
          buttons.forEach(button => button.disabled = true);
  
          if (choice === correctWord) {
              feedback.textContent = "Awesome! You got it right!";
              feedback.style.color = '#4CAF50';
              streak++;
              actualScore++;
              streakCount.textContent = streak;
              const streakColor = streakColors[streak % streakColors.length];
              streakCount.style.color = streakColor;
              
              // Play chime sound
              playChime();
              
              // Flash background color
              document.body.style.backgroundColor = streakColor;
              setTimeout(() => {
                  document.body.style.backgroundColor = '#f0f0f0';
              }, 500);
          } else {
              feedback.textContent = 'Oops! The correct spelling is: ' + correctWord + '.';
              wrongWords.push(correctWord);

              feedback.style.color = '#FF6B6B';
              streak = 0;
              streakCount.textContent = streak;
              streakCount.style.color = streakColors[0];
          }
  
          nextBtn.style.display = 'inline-block';
      }
  
      function startTimer() {
          const timerBar = document.querySelector('.timer-bar');
          let timeLeft = 100;
          timerBar.style.width = '100%';
  
          timerInterval = setInterval(() => {
              timeLeft -= 1;
              timerBar.style.width = timeLeft + '%';
  
              if (timeLeft <= 0) {
                  clearInterval(timerInterval);
                  checkAnswer('', words[currentWordIndex].word);
              }
          }, 100);
      }
  
      document.getElementById('next-btn').addEventListener('click', () => {
        if (currentWordIndex === words.length - 1) {
            // Submit the game result
            (${submitGameResult.toString()})('${gameId}', actualScore, totalScore, wrongWords);
        }
        else {
            currentWordIndex = currentWordIndex + 1;
            displayQuestion();
        }
      });
  
      displayQuestion();
  </script>
  </body></html>
`;

  return raw_html;
}

export default function Game_TimeQuiz({ wordListId }: { wordListId: string }) {
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
