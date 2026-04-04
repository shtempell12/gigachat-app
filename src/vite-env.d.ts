/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GIGACHAT_CLIENT_ID: string;
  readonly VITE_GIGACHAT_CLIENT_SECRET: string;
  readonly VITE_GIGACHAT_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
