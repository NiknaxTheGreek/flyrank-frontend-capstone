import { defineConfig } from 'vitest/config';
import { loadEnv, type PreviewServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createMovieHandler } from './api/movies.mjs';
import { lookupMovie } from './server/lookup-movie-tool.mjs';
import { createMovieChatHandler } from './server/movie-chat-handler.mjs';
import { asNodeMiddleware } from './server/movie-chat-node.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['OMDB_', 'GEMINI_']);
  const getOmdbKey = () => env.OMDB_API_KEY?.trim();

  const handler = createMovieHandler({ getKey: getOmdbKey });
  const chat = asNodeMiddleware(createMovieChatHandler({
    getKey: () => env.GEMINI_API_KEY?.trim(),
    executeMovieLookup: (input: { title: string }, options: { signal?: AbortSignal }) =>
      lookupMovie.execute(input, { ...options, getKey: getOmdbKey }),
  }));

  const middleware = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use('/api/movies', handler);
    server.middlewares.use('/api/movie-chat', chat);
  };

  return {
    plugins: [
      react(),
      {
        name: 'omdb-api',
        configureServer: middleware,
        configurePreviewServer: middleware,
      },
    ],
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.mjs'],
      setupFiles: ['./src/test/setup.ts'],
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
