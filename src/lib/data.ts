
export interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  imageHint: string;
}

export interface Update {
  slug: string;
  version: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageUrl: string;
  imageHint: string;
}
