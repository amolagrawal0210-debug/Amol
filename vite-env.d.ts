// Augment the NodeJS ProcessEnv interface to include API_KEY
// This avoids redeclaring 'process' which is already defined in the global scope (e.g. by @types/node)

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
