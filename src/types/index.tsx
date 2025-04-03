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
  items: [];
}

export interface $Page {
  pageId: string;
  title: string;
  content: string;
  choiceOptions: $ChoiceOption[];
  chatper: $Chapter;

  text?: string;
  img?: string;
}

export interface $Item {
  id: string;
  name: string;
  description: string;
}

export interface $Ending {
  id: string;
  title: string;
  description: string;
  returnPageId: number;
}