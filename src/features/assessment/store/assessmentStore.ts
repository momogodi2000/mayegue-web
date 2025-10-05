import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AssessmentState {
  // Test state
  currentTest: {
    id: string;
    questions: any[];
    answers: Record<string, string>;
    startTime: Date | null;
    completed: boolean;
  } | null;
  
  // Results
  testResults: Array<{
    id: string;
    score: number;
    level: string;
    date: Date;
    recommendations: string[];
  }>;
  
  // User progress
  userLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  lastAssessmentDate: Date | null;
  
  // Actions
  startTest: (testId: string, questions: any[]) => void;
  submitAnswer: (questionId: string, answer: string) => void;
  completeTest: (results: any) => void;
  updateUserLevel: (level: string) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentTest: null,
      testResults: [],
      userLevel: null,
      lastAssessmentDate: null,

      startTest: (testId: string, questions: any[]) => {
        set({
          currentTest: {
            id: testId,
            questions,
            answers: {},
            startTime: new Date(),
            completed: false
          }
        });
      },

      submitAnswer: (questionId: string, answer: string) => {
        const { currentTest } = get();
        if (currentTest) {
          set({
            currentTest: {
              ...currentTest,
              answers: {
                ...currentTest.answers,
                [questionId]: answer
              }
            }
          });
        }
      },

      completeTest: (results: any) => {
        const { currentTest, testResults } = get();
        if (currentTest) {
          const newResult = {
            id: currentTest.id,
            score: results.score,
            level: results.level,
            date: new Date(),
            recommendations: results.recommendations
          };

          set({
            currentTest: {
              ...currentTest,
              completed: true
            },
            testResults: [...testResults, newResult],
            lastAssessmentDate: new Date()
          });
        }
      },

      updateUserLevel: (level: string) => {
        set({ userLevel: level as any });
      },

      resetAssessment: () => {
        set({
          currentTest: null,
          testResults: [],
          userLevel: null,
          lastAssessmentDate: null
        });
      }
    }),
    {
      name: 'assessment-storage',
      partialize: (state) => ({
        testResults: state.testResults,
        userLevel: state.userLevel,
        lastAssessmentDate: state.lastAssessmentDate
      })
    }
  )
);
