export interface IWord {
  word: string;
  exemplarUsage: string;
}

export interface IWordListSettings {
  id?: string;
  inspirationWords: string[];
  categories: string[];
  selectedCategory: number;
  customCategory?: string;
  wordList: IWord[];
}

export interface INewGameInfo {
  gameId: string;
  wordList: IWord[];
  category: string;
}

export interface IGameResult {
  id: string;
  actualScore: number;
  totalScore: number;
  wrongWords: string[];
  wordListSettingsId: string;
}

export interface IUser {
  username: string;
  browserToken: string;
}

export interface IUserStat {
  gold: number;
  gemGreen: number;
  gemBlue: number;
  gemPurple: number;
}
