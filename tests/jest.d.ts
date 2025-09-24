/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeType(type: string): R;
    }
  }
}

export {};