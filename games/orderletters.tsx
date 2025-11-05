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
  <title>Spelling Game: Words with 'oo'</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f7f7f7;
      color: #333;
    }
    .game-container {
      background-color: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 90%;
      width: 600px;
    }
    h1 {
      color: #444;
      margin-bottom: 20px;
    }
    .sentence {
      font-size: 20px;
      margin-bottom: 30px;
      line-height: 1.4;
    }
    .tiles {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    .tile {
      width: 70px;
      height: 70px;
      border-radius: 15px;
      margin: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 36px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .instructions {
      font-size: 18px;
      color: #666;
      margin-bottom: 25px;
    }
    .scrambled {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 25px;
    }
    .scrambled-letter {
      width: 80px;
      height: 80px;
      background-color: #f0f0f0;
      border-radius: 18px;
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 40px;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .scrambled-letter:hover {
      transform: scale(1.05);
    }
    .scrambled-letter.used {
      opacity: 0;
      pointer-events: none;
    }
    .feedback {
      font-size: 28px;
      font-weight: bold;
      margin-top: 25px;
      min-height: 42px;
      color: #4CAF50;
    }
    .feedback.error {
      color: #F44336;
    }
    .progress {
      font-size: 18px;
      color: #666;
      margin-top: 25px;
    }
    @keyframes popIn {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .pop-in {
      animation: popIn 0.3s ease-out forwards;
    }
  </style>
  </head>
  <body>
  <div class="game-container">
    <h1>Out of Order</h1>
    <p class="sentence"></p>
    <div class="tiles"></div>
    <p class="instructions">Tap the letters in order and spell the missing word.</p>
    <div class="scrambled"></div>
    <div class="feedback"></div>
    <div class="progress"></div>
  </div>
  
  <script>
  const words = ${JSON.stringify(currentList)};
  let actualScore = words.length;
  let totalScore = words.length;
  let wrongWords = [];
  
  const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];
  
  let currentWordIndex = 0;
  let currentWord = words[currentWordIndex];
  
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  function getRandomColors(count) {
    const shuffledColors = shuffleArray(colors);
    return shuffledColors.slice(0, count);
  }
  
  function displayWord() {
    currentWord = words[currentWordIndex];
    document.querySelector('.sentence').textContent = currentWord.sentence;
    
    const tilesContainer = document.querySelector('.tiles');
    tilesContainer.innerHTML = '';
    const tileColors = getRandomColors(currentWord.word.length);
    for (let i = 0; i < currentWord.word.length; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.style.backgroundColor = tileColors[i];
      tilesContainer.appendChild(tile);
    }
    
    const scrambledContainer = document.querySelector('.scrambled');
    scrambledContainer.innerHTML = '';
    const shuffledLetters = shuffleArray([...currentWord.word]);
    shuffledLetters.forEach(letter => {
      const letterElement = document.createElement('div');
      letterElement.classList.add('scrambled-letter');
      letterElement.textContent = letter;
      letterElement.addEventListener('click', () => handleLetterClick(letter, letterElement));
      scrambledContainer.appendChild(letterElement);
    });
  
    updateProgress();
    clearFeedback();
  }
  
  function handleLetterClick(letter, element) {
    const tiles = document.querySelectorAll('.tile');
    const currentTileIndex = [...tiles].findIndex(tile => !tile.textContent);
    
    if (currentTileIndex !== -1) {
      if (letter === currentWord.word[currentTileIndex]) {
        tiles[currentTileIndex].textContent = letter;
        element.classList.add('used');
        
        if (currentTileIndex === currentWord.word.length - 1) {
          showFeedback('Correct! Well done!', false);
          setTimeout(() => {
            if (currentWordIndex === words.length - 1) {
              // Submit the game result
              (${submitGameResult.toString()})('${gameId}', actualScore, totalScore, wrongWords);
            } else {
              currentWordIndex = currentWordIndex + 1;
              displayWord();
            }
          }, 1500);
        }
      } else {
        showFeedback('Oops, try again!', true);
      }
    }
  }
  
  function showFeedback(message, isError) {
    const feedback = document.querySelector('.feedback');
    feedback.textContent = message;
    feedback.classList.remove('pop-in', 'error');
    if (isError) {
      feedback.classList.add('error');
    }
    void feedback.offsetWidth; // Trigger reflow
    feedback.classList.add('pop-in');
  }
  
  function clearFeedback() {
    const feedback = document.querySelector('.feedback');
    feedback.textContent = '';
    feedback.classList.remove('error');
  }
  
  function updateProgress() {
    const progress = document.querySelector('.progress');
    progress.textContent = \`Word \${currentWordIndex + 1} of \${words.length}\`;
  }
  
  displayWord();
  </script>
  
  </body></html>
  `;

  return raw_html;
}

export default function Game_OrderLetters({
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
