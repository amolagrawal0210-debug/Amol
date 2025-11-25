// Manually declare process.env for TypeScript since vite/client types might be missing in this environment
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
