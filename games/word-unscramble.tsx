import Loading from "@/components/loading";
import { IWord } from "@/lib/interface";
import { requestNewGame, submitGameResult } from "@/lib/util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getContent(wordList: IWord[], gameId: string) {
  const currentList = wordList.map((word) => ({
    word: word.word,
    hint: word.exemplarUsage.replace(word.word, "_____"),
  }));

  const raw_html =  `
  <html><head>
  <title>Word Unscramble - Spelling Challenge</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f8ff;
    }
    #game-container {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
    }
    #word-display {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .letter {
      font-size: 24px;
      font-weight: bold;
      margin: 0 5px;
      padding: 10px;
      background-color: #e0e0e0;
      border-radius: 5px;
      cursor: move;
      user-select: none;
    }
    #submit-btn {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      font-size: 18px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    #message, #hint-text {
      text-align: center;
      font-size: 18px;
      margin-top: 20px;
    }
    #hint-text {
      color: #666;
      font-style: italic;
    }
    #next-word-btn {
      display: none;
      margin: 20px auto;
      padding: 10px 20px;
      font-size: 18px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
  </head>
  <body>
    <div id="game-container">
      <h1>Scrambled Words</h1>
      <div id="word-display"></div>
      <div id="hint-text"></div>
      <button id="submit-btn">Submit</button>
      <div id="message"></div>
      <button id="next-word-btn">Next Word</button>
    </div>
  
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js"></script>
    <script>
      const words = ${JSON.stringify(currentList)};
      let currentWord = '';
      let currentWordIndex = 0;
      let actualScore = 0;
      let totalScore = words.length;
      let wrongWords = [];
  
      function shuffleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
      }
  
      function displayWord(word) {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.innerHTML = '';
        const shuffledWord = shuffleWord(word);
        shuffledWord.split('').forEach(letter => {
          const letterElement = document.createElement('div');
          letterElement.className = 'letter';
          letterElement.textContent = letter;
          wordDisplay.appendChild(letterElement);
        });
      }
  
      function initializeSortable() {
        new Sortable(document.getElementById('word-display'), {
          animation: 150,
          ghostClass: 'blue-background-class'
        });
      }
  
      function checkWord() {
        const submittedWord = Array.from(document.querySelectorAll('.letter'))
          .map(letter => letter.textContent)
          .join('');
        const message = document.getElementById('message');
        
        if (submittedWord === currentWord.word) {
          actualScore++;
          message.textContent = 'Correct! Well done!';
          message.style.color = 'green';
          document.getElementById('next-word-btn').style.display = 'block';
          document.getElementById('submit-btn').style.display = 'none';
        } else {
          message.textContent = 'Not quite. Try again!';
          message.style.color = 'red';
        }
      }
  
      function showHint() {
        const hintText = document.getElementById('hint-text');
        hintText.textContent = \`Hint: \${ currentWord.hint }\`;
      }
  
      function nextWord() {
        if (currentWordIndex === words.length - 1) {
          // Submit the game result
          (${submitGameResult.toString()})('${gameId}', actualScore, totalScore, wrongWords);
        }
        else {
          currentWordIndex = currentWordIndex + 1;
          currentWord = words[currentWordIndex];
          displayWord(currentWord.word);
          document.getElementById('message').textContent = '';
          document.getElementById('next-word-btn').style.display = 'none';
          document.getElementById('submit-btn').style.display = 'block';
          showHint();
        }
      }
  
      document.getElementById('submit-btn').addEventListener('click', checkWord);
      document.getElementById('next-word-btn').addEventListener('click', nextWord);
  
      // Initialize the game
      currentWord = words[currentWordIndex];
      displayWord(currentWord.word);
      initializeSortable();
      showHint();
    </script>
  </body>
  </html>
  `;

  return raw_html;
}


export default function Game_Unscramble({
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