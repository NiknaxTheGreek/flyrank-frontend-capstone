import { createMovieChatHandler } from '../server/movie-chat-handler.mjs';
import { asNodeMiddleware } from '../server/movie-chat-node.mjs';

export default asNodeMiddleware(createMovieChatHandler());

