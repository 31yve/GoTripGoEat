// Global window types
interface Window {
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_NODE_ENV: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// React Router types
declare module 'react-router-dom' {
  export interface RouteObject {
    path?: string;
    index?: boolean;
    children?: RouteObject[];
    caseSensitive?: boolean;
    element?: React.ReactNode;
  }
}