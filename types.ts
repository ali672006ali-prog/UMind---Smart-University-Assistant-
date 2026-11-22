
export enum SubjectDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export interface Subject {
  id: string;
  name: string;
  difficulty: SubjectDifficulty;
  examDate: string;
  targetGrade: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  durationMinutes: number;
  completed: boolean;
}

export interface GPAEntry {
  id: string;
  subjectName: string;
  creditHours: number;
  grade: number; // 0.0 to 4.0
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  type: 'mcq' | 'tf' | 'essay';
}
