
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  techStack: string[];
  url: string;
  category: 'Web App' | 'Experiment' | 'Utility';
  date: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
}
