export type Difficulty = 1 | 2 | 3 | 4;

export type Category = {
  category: string;
  words: [string, string, string, string];
  difficulty: Difficulty;
};

export type Tile = {
  word: string;
  category: string;
  difficulty: Difficulty;
};

export type GameData = [Category, Category, Category, Category];