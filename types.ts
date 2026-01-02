
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export enum Category {
  FUNDAMENTALS = 'Fundamentals',
  MODERN_CPP = 'Modern C++',
  DESIGN_PATTERNS = 'Design Patterns',
  ADVANCED_TOPICS = 'Advanced Topics'
}

export interface Example {
  name: string;
  code: string;
}

export interface Topic {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  standard?: string;
  summary: string;
  detailedContent?: string;
  initialCode?: string;
  examples?: Example[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface LearningState {
  currentTopicId: string;
  completedTopics: string[];
  code: string;
}
