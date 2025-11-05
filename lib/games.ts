import Game_Spelling from "@/games/spelling";
import Game_WordBubble from "@/games/word-bubble";
import Game_Unscramble from "@/games/word-unscramble";
import Game_TimeQuiz from "@/games/timequiz";
import Game_OrderLetters from "@/games/orderletters";
import Game_LetterBridge from "@/games/letterbridge";
import { IWord } from "./interface";

export interface IGameInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  isUnity: boolean;
}

const games: {
  [name: string]: {
    info: IGameInfo;
    component: ({ wordListId }: { wordListId: string }) => JSX.Element;
  };
} = {};

export function registerGame(
  gameInfo: IGameInfo,
  component: ({ wordListId }: { wordListId: string }) => JSX.Element
) {
  games[gameInfo.id] = {
    info: gameInfo,
    component: component,
  };
}

export function getGameComponent(
  name: string
): ({ wordListId }: { wordListId: string }) => JSX.Element {
  return games[name].component;
}

export function listGames(): IGameInfo[] {
  return Object.keys(games).map((name) => games[name].info);
}

registerGame(
  {
    id: "spelling",
    name: "Speak and Spell Challenge",
    description: "A simulated spelling bee - don't be nervous!",
    image: "/images/spelling.png",
    isUnity: false,
  },
  Game_Spelling
);

registerGame(
  {
    id: "orderletters",
    name: "Out of Order",
    description: "Can you select the letters in the correct order?",
    image: "/images/orderletters.png",
    isUnity: true,
  },
  Game_OrderLetters
);

registerGame(
  {
    id: "word-bubble",
    name: "Bubble Bounce",
    description: "The more bubbles you pop, the more words you got!",
    image: "/images/word-bubble.png",
    isUnity: true,
  },

  Game_WordBubble
);
registerGame(
  {
    id: "word-unscramble",
    name: "Scrambled Words",
    description: "Help us unscramble the letters",
    image: "/images/word-unscramble.png",
    isUnity: false,
  },
  Game_Unscramble
);
registerGame(
  {
    id: "timequiz",
    name: "Zen Typing Garden",
    description: "Type the word below, make your zen garden grow!",
    image: "/images/timequiz.png",
    isUnity: false,
  },
  Game_TimeQuiz
);

registerGame(
  {
    id: "letterbridge",
    name: "Wurdle-Shuffle",
    description: "You have only 3 tries to spell the word correctly!",
    image: "/images/letterbridge.png",
    isUnity: false,
  },
  Game_LetterBridge
);
