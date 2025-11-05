import Loading from "@/components/loading";
import { IWord } from "@/lib/interface";
import { requestNewGame, submitGameResult } from "@/lib/util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*function getContent(wordList: IWord[], gameId: string) {
  const currentList = wordList.map((word) => ({
    word: word.word,
    sentence: word.exemplarUsage.replace(word.word, "_____"),
  }));

const words = [
      "tranquility", "serenity", "calm", "peace", "harmony", "balance", "mindfulness",
      "breathe", "relax", "meditate", "focus", "nature", "gentle", "soothing",
      "stillness", "quiet", "reflect", "unwind", "presence", "bloom",
      "zen", "garden", "blossom", "growth", "nurture", "flourish", "vitality",
      "radiance", "essence", "wisdom", "clarity", "purity", "enlighten", "sublime",
      "ethereal", "serene", "placid", "idyllic", "halcyon", "luminous", "ephemeral",
      "transcend", "nirvana", "dharma", "karma", "mantra", "chakra", "aura", "yoga"
  ];



*/

function getContent(wordList: IWord[], gameId: string) {
    const currentList = wordList.map((word) => ({
      word: word.word,
      sentence: word.exemplarUsage.replace(word.word, '<strong>' + word.word + '</strong>'),
    }));


  const raw_html = `
  <html><head><base href="https://websim.io/"><title>Zen Typing Garden</title>
  <style>
      body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
      }
      .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.8);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 1000px;
          width: 100%;
          transform: scale(0.80);
          transform-origin: center; /* keeps the container centered */
      }
      #garden {
          width: 960px;
          height: 540px;
          background: #e8f5e9;
          border-radius: 10px;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
          transition: opacity 1s ease;
      }
      #word {
          font-size: 2rem;
          color: #1b5e20;
          margin-bottom: 1rem;
          letter-spacing: 5px;
      }
      #word span {
          transition: color 0.3s ease;
      }
      .plant {
          position: absolute;
          width: 90px;
          height: 90px;
          transition: all 0.5s ease;
      }
      #score, #level {
          font-size: 1.2rem;
          color: #1b5e20;
          margin-top: 1rem;
      }
      .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(76, 175, 80, 0.3);
          animation: ripple 1s linear;
          pointer-events: none;
      }
      @keyframes ripple {
          to {
              transform: scale(4);
              opacity: 0;
          }
      }
      #level-transition {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 3rem;
          color: #1b5e20;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
      }
      #praise {
          font-size: 2rem;
          color: #4caf50;
          margin-top: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      }
      #example-sentence {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 1rem;
          line-height: 1.5;
      }
      #example-sentence strong {
          color: #1b5e20;
          font-weight: bold;
      }
      #instructions {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
        line-height: 1;
    }
  </style>
  </head>
  <body>
  <div class="container">
      <div id="instructions">Type the word below, make your zen garden grow!</div>
      <div id="example-sentence"></div>
      <div id="garden"></div>
      <div id="word"></div>
      <div id="score">Score: 0</div>
      <div id="level">Level: 1</div>
  </div>
  <div id="level-transition">
      <div id="level-text"></div>
      <div id="praise"></div>
  </div>
  
  <script>
  const wordsDefs = ${JSON.stringify(currentList)};
      console.log(wordsDefs)

      // Extract array of words
    const words = wordsDefs.map(item => item.word);
    console.log(words)
      // Extract array of sentences
    const TTTexampleSentences = wordsDefs.map(item => item.sentence);

    const exampleSentences = wordsDefs.reduce((acc, wordObject) => {
        acc[wordObject.word] = wordObject.sentence;
        return acc;
      }, {});
      
      console.log(exampleSentences);
  
    const TTwords = [
    "tranquility", "serenity", "calm", "peace", "harmony", "balance", "mindfulness",
    "breathe", "relax", "meditate", "focus", "nature", "gentle", "soothing",
    "stillness", "quiet", "reflect", "unwind", "presence", "bloom",
    "zen", "garden", "blossom", "growth", "nurture", "flourish", "vitality",
    "radiance", "essence", "wisdom", "clarity", "purity", "enlighten", "sublime",
    "ethereal", "serene", "placid", "idyllic", "halcyon", "luminous", "ephemeral",
    "transcend", "nirvana", "dharma", "karma", "mantra", "chakra", "aura", "yoga"
    ];

  const TTexampleSentences = {
      "tranquility": "The garden exudes <strong>tranquility</strong>, calming all who enter.",
      "serenity": "She found <strong>serenity</strong> in the quiet moments of meditation.",
      "calm": "The lake's surface was perfectly <strong>calm</strong>, like a mirror.",
      "peace": "In the midst of chaos, there was <strong>peace</strong>.",
      "harmony": "The sounds of nature brought a sense of <strong>harmony</strong>.",
      "balance": "Finding <strong>balance</strong> is key to a fulfilling life.",
      "mindfulness": "Practicing <strong>mindfulness</strong> leads to greater awareness.",
      "breathe": "Take a moment to <strong>breathe</strong> and relax.",
      "relax": "It’s important to <strong>relax</strong> amidst a busy day.",
      "meditate": "To <strong>meditate</strong> is to find inner peace.",
      "focus": "With <strong>focus</strong>, you can achieve your goals.",
      "nature": "Being in <strong>nature</strong> heals the soul.",
      "gentle": "A <strong>gentle</strong> touch can be very comforting.",
      "soothing": "The music had a <strong>soothing</strong> effect on her.",
      "stillness": "In the <strong>stillness</strong>, she found clarity.",
      "quiet": "The <strong>quiet</strong> of the night was peaceful.",
      "reflect": "To <strong>reflect</strong> is to learn from our experiences.",
      "unwind": "It’s time to <strong>unwind</strong> after a long day.",
      "presence": "Being in the moment is a true <strong>presence</strong>.",
      "bloom": "With care, the flowers will <strong>bloom</strong> beautifully.",
      "zen": "Finding <strong>zen</strong> can bring great joy.",
      "garden": "Tending to the <strong>garden</strong> is a fulfilling task.",
      "blossom": "With love, the seeds will <strong>blossom</strong> into flowers.",
      "growth": "Personal <strong>growth</strong> comes from challenge.",
      "nurture": "It’s important to <strong>nurture</strong> our dreams.",
      "flourish": "With hard work, you can <strong>flourish</strong> in any area.",
      "vitality": "She radiated <strong>vitality</strong> and energy.",
      "radiance": "The <strong>radiance</strong> of the sun is uplifting.",
      "essence": "Finding the <strong>essence</strong> of you is vital.",
      "wisdom": "With age comes <strong>wisdom</strong> and understanding.",
      "clarity": "Achieving <strong>clarity</strong> of thought is important.",
      "purity": "The <strong>purity</strong> of nature inspires awe.",
      "enlighten": "Books can <strong>enlighten</strong> us beyond our limits.",
      "sublime": "The view was <strong>sublime</strong> and breathtaking.",
      "ethereal": "The atmosphere felt <strong>ethereal</strong> at dusk.",
      "serene": "A <strong>serene</strong> lake is a sight to behold.",
      "placid": "The <strong>placid</strong> water reflected the sky perfectly.",
      "idyllic": "She dreamed of an <strong>idyllic</strong> countryside.",
      "halcyon": "The <strong>halcyon</strong> days of summer bring joy.",
      "luminous": "The stars looked <strong>luminous</strong> in the night sky.",
      "ephemeral": "Life’s beauty is often <strong>ephemeral</strong>.",
      "transcend": "Art can <strong>transcend</strong> cultural boundaries.",
      "nirvana": "They aimed to reach <strong>nirvana</strong> through meditation.",
      "dharma": "Following one’s <strong>dharma</strong> leads to fulfillment.",
      "karma": "<strong>Karma</strong> is an integral part of our life’s journey.",
      "mantra": "A positive <strong>mantra</strong> can change your mindset.",
      "chakra": "Balancing your <strong>chakra</strong> promotes health.",
      "aura": "She has a warm <strong>aura</strong> around her.",
      "yoga": "Practicing <strong>yoga</strong> improves flexibility and mind."
  };
  
  const praises = [
      "Let's go!",
      "Here we go!",
      "Feeling good!",
      "So peaceful",
      "You're a natural!",
  ];
  
  let currentWord = "";
  let typedIndex = 0;
  let score = 0;
  let level = 0;
  let usedWords = new Set();
  const garden = document.getElementById('garden');
  const wordDisplay = document.getElementById('word');
  const scoreDisplay = document.getElementById('score');
  const levelDisplay = document.getElementById('level');
  const levelTransition = document.getElementById('level-transition');
  const levelText = document.getElementById('level-text');
  const praiseDisplay = document.getElementById('praise');
  let audioContext;
  
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
  
  function playChime() {
      playSineWave(800, 0.3, 0.2);
      setTimeout(() => playSineWave(1000, 0.3, 0.2), 100);
      setTimeout(() => playSineWave(1200, 0.3, 0.2), 200);
  }
  
  function getRandomWord() {
      const availableWords = words.filter(word => !usedWords.has(word));
      if (availableWords.length === 0) {
          usedWords.clear();
          return words[Math.floor(Math.random() * words.length)];
      }
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      usedWords.add(word);
      return word;
  }
  
  function updateWord() {
      currentWord = getRandomWord();
      typedIndex = 0;
      wordDisplay.innerHTML = currentWord.split('').map(letter => 
          \`<span style="color: #cccccc">\${letter}</span>\`
      ).join('');
      
      const exampleSentence = exampleSentences[currentWord] 
      console.log(currentWord)
      console.log(exampleSentences['atom'])
      console.log(exampleSentence)
      document.getElementById('example-sentence').innerHTML = exampleSentence;
  }
  
  const gridSize = 90;
  const gridWidth = Math.floor(960 / gridSize);
  const gridHeight = Math.floor(540 / gridSize);
  let occupiedCells = [];
  
  function getAvailableCell() {
      let availableCells = [];
      for (let y = 0; y < gridHeight; y++) {
          for (let x = 0; x < gridWidth; x++) {
              if (!occupiedCells.some(cell => cell.x === x && cell.y === y)) {
                  availableCells.push({x, y});
              }
          }
      }
      if (availableCells.length === 0) return null;
      return availableCells[Math.floor(Math.random() * availableCells.length)];
  }
  
  function createPlant() {
      const cell = getAvailableCell();
      if (!cell) return;
  
      occupiedCells.push(cell);
  
      const plant = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      plant.setAttribute("class", "plant");
      plant.setAttribute("viewBox", "0 0 100 100");
      plant.style.left = \`\${cell.x * gridSize}px\`;
      plant.style.top = \`\${cell.y * gridSize}px\`;
      
      const plantType = Math.floor(Math.random() * 5);
      
      switch(plantType) {
          case 0: // Sunflower
              plant.innerHTML = \`
                  <line x1="50" y1="100" x2="50" y2="60" stroke="#4caf50" stroke-width="4"/>
                  <circle cx="50" cy="40" r="20" fill="#ffd700"/>
                  <circle cx="50" cy="40" r="12" fill="#8b4513"/>
              \`;
              break;
          case 1: // Rose
              plant.innerHTML = \`
                  <line x1="50" y1="100" x2="50" y2="50" stroke="#4caf50" stroke-width="4"/>
                  <path d="M30 50 Q50 20 70 50 Q50 80 30 50" fill="#ff69b4"/>
              \`;
              break;
          case 2: // Tulip
              plant.innerHTML = \`
                  <line x1="50" y1="100" x2="50" y2="60" stroke="#4caf50" stroke-width="4"/>
                  <path d="M30 60 Q50 20 70 60 L50 80 Z" fill="#ff6347"/>
              \`;
              break;
          case 3: // Daisy
              plant.innerHTML = \`
                  <line x1="50" y1="100" x2="50" y2="60" stroke="#4caf50" stroke-width="4"/>
                  <circle cx="50" cy="40" r="20" fill="#fff"/>
                  <circle cx="50" cy="40" r="10" fill="#ffff00"/>
              \`;
              break;
          case 4: // Lavender
              plant.innerHTML = \`
                  <line x1="50" y1="100" x2="50" y2="20" stroke="#4caf50" stroke-width="4"/>
                  <path d="M40 20 Q50 0 60 20" fill="none" stroke="#8a2be2" stroke-width="4"/>
                  <path d="M35 30 Q50 10 65 30" fill="none" stroke="#8a2be2" stroke-width="4"/>
                  <path d="M30 40 Q50 20 70 40" fill="none" stroke="#8a2be2" stroke-width="4"/>
              \`;
              break;
      }
      
      garden.appendChild(plant);
      
      plant.style.opacity = '0';
      plant.style.transform = 'scale(0.5)';
      
      setTimeout(() => {
          plant.style.opacity = '1';
          plant.style.transform = 'scale(1)';
      }, 100);
  }
  
  function createRipple(x, y) {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = \`\${x}px\`;
      ripple.style.top = \`\${y}px\`;
      garden.appendChild(ripple);
      setTimeout(() => garden.removeChild(ripple), 1000);
  }
  
  function levelUp() {
      level++;
      const praise = praises[Math.floor(Math.random() * praises.length)];
      levelText.textContent = \`Level \${level}\`;
      praiseDisplay.textContent = praise;
      levelTransition.style.opacity = '1';
  
      setTimeout(() => {
          levelDisplay.textContent = \`Level: \${level}\`;
          garden.innerHTML = '';
          occupiedCells = [];
          updateWord();
          levelTransition.style.opacity = '0';
      }, 3000);
  }
  
  document.addEventListener('keydown', (e) => {
      if (!audioContext) initAudio();
      if (e.key.toLowerCase() === currentWord[typedIndex].toLowerCase()) {
          const spans = wordDisplay.getElementsByTagName('span');
          spans[typedIndex].style.color = '#1b5e20';
          typedIndex++;
  
          playPing();
  
          if (typedIndex === currentWord.length) {
              score++;
              scoreDisplay.textContent = \`Score: \${score}\`;
              createPlant();
              createRipple(Math.random() * 960, Math.random() * 540);
  
              playChime();
  
              updateWord();
              
              if (score % 10 === 0) {
                  levelUp();
              }
          }
      }
  });
  
  garden.addEventListener('click', (e) => {
      const rect = garden.getBoundingClientRect();
      createRipple(e.clientX - rect.left, e.clientY - rect.top);
  });
  
  updateWord();
  levelUp();
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
