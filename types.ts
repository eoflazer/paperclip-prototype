export enum ReadingStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

export interface ReadingItem {
  id: string;
  url: string;
  title: string;
  author: string;
  siteName?: string;
  summary?: string;
  addedAt: string; // ISO Date string
  status: ReadingStatus;
}

export interface AddItemResponse {
  title: string;
  author: string;
  siteName: string;
  summary: string;
}
