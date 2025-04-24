export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: Option[];
  totalVotes: number;
  createdAt: string;
}

export interface VoteDto {
  optionId: string;
}
