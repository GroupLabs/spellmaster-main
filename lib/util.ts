import { IGameResult, INewGameInfo, IUser, IUserStat } from "./interface";

export function createId(digits: number) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < digits; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function requestNewGame(
  wordListId: string
): Promise<INewGameInfo> {
  const response = await fetch("/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wordListId: wordListId,
    }),
  });

  return await response.json();
}

export async function submitGameResult(
  id: string,
  actualScore: number,
  totalScore: number,
  wrongWords: string[]
) {
  const response = await fetch(`/api/game/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      actualScore,
      totalScore,
      wrongWords,
    }),
  });

  if (!response.ok) {
    throw new Error("Game not found");
  }

  // redirect to completion page
  // window.location.href = `/game/complete?gameId=${id}`;
  const message = { gameId: id };
  window.parent.postMessage(message, "*"); // You can replace '*' with the parent's exact origin
}

export async function readGameResult(id: string): Promise<IGameResult> {
  const response = await fetch(`/api/game/get-result?id=${id}`);
  return await response.json();
}

function loadFromLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function saveToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function createUser(initStat: IUserStat) {
  // create a new user
  const user = {
    username: createId(8),
    browserToken: createId(16),
  };

  saveToLocalStorage("user", user);

  const response = await fetch("/api/user/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...user,
      stat: initStat,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }
}

export async function updateUserStat(userStat: IUserStat) {
  let user: IUser = loadFromLocalStorage("user");
  if (!user) {
    throw new Error("User not found");
  }

  // Update the user's score in database
  const response = await fetch("/api/user/update-stat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user.username,
      browserToken: user.browserToken,
      stat: userStat,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update coin");
  }
}

export async function getUserStat(): Promise<IUserStat> {
  let user: IUser = loadFromLocalStorage("user");

  // If user is not found in local storage, create a new user.
  // And return default stat.
  if (!user) {
    const initStat: IUserStat = {
      gold: 10,
      gemGreen: 0,
      gemBlue: 0,
      gemPurple: 0,
    };
    await createUser(initStat);
    return initStat;
  }

  const response = await fetch(
    `/api/user/get-stat?browserToken=${user.browserToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to get user stat");
  }

  const stat = await response.json();

  return stat;
}
