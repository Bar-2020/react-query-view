import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The repo is published as a GitHub Pages *project* site
// (https://bar-2020.github.io/react-query-view/), so the build needs a
// matching base path. `vite preview` also runs with mode "production" (it
// serves the built output), so checking `mode` keeps `preview` and `build`
// in sync — checking `command` does not, since preview's command is "serve".
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/react-query-view/' : '/',
  plugins: [react()],
}));
