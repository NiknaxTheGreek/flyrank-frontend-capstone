import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { createMovieHandler } from './api/movies.mjs';
import { createMovieChatHandler } from './server/movie-chat-handler.mjs';
import { asNodeMiddleware } from './server/movie-chat-node.mjs';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['OMDB_', 'OPENAI_']);
  const handler = createMovieHandler({ getKey: () => env.OMDB_API_KEY });
  const chat = asNodeMiddleware(createMovieChatHandler({ getKey: () => env.OPENAI_API_KEY }));
  const middleware = (server) => {
    server.middlewares.use('/api/movies', handler);
    server.middlewares.use('/api/movie-chat', chat);
  };
  return {
  plugins: [react(), { name: 'omdb-api', configureServer: middleware, configurePreviewServer: middleware }],
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
};
});

