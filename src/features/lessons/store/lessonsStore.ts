import { create } from 'zustand';

interface LessonsState {
  currentLessonId?: string;
  setCurrentLesson: (id?: string) => void;
}

export const useLessonsStore = create<LessonsState>((set) => ({
  currentLessonId: undefined,
  setCurrentLesson: (id) => set({ currentLessonId: id }),
}));


