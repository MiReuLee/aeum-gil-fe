interface ChoiceOption {
  id: number;
  content: string;
  nextPageId: number;
  orderNum: number;
}

export interface Page {
  id: number;
  description: string;
  title: string;
  content: string;
  choiceOptions: ChoiceOption[];
}
