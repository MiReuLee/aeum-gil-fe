export interface $Chapter {
  chapterId: number;
  title: string;
  image: string;
  firstPageId: number;
}

export interface $ChoiceOption {
  choiceOptionId: number;
  content: string;
  targetId: number;
  moveTargetType: 1 | 2; // 1: page, 2: ending
  items: { actionType: number; itemId: number }[];
}

export interface $Page {
  pageId: number;
  content: string;
  choiceOptions: $ChoiceOption[];
  chapter: $Chapter;
  place: string;

  text?: string;
  img?: string;
  object?: string;
}

export interface $Item {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface $Ending {
  id: string;
  title: string;
  description: string;
  returnPageId: number;
  content: string;
  isCleared: boolean;

  text?: string;
  img?: string;
}