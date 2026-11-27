# Reel Good — Assignment 11: Planet Studio

In this assignment, Reel Good gains an interactive fictional world configurator using Three.js. The experience explores real 3D geometry, responsive controls, optional loading and accessible static fallbacks while respecting rendering budgets.

[Public Planet Studio](https://reel-good-planet-studio.vercel.app/planet-studio) · [Implementation and design](docs/assignment-11/README.md) · [Submission and evidence](docs/assignment-11/submission.md)

## Implementation

The scene supports surface, rings, lighting, rotation and camera controls. It loads on demand and retains usable SVG controls if WebGL is unavailable. Performance measurements and device-emulation limits are documented in the assignment notes.

## Reviewing the assignment

Open Planet Studio, launch the optional 3D scene, customize the world and camera, and compare the static view and reduced-motion behavior.

## Local development and verification

Use Node 24, `npm ci`, `npm run dev`, `npm test` and `npm run build`. No credentials are needed for this demo. See the linked implementation notes for detailed commands and recorded checks.

## Connection to the capstone

The optional 3D feature extends the movie experience with a sci-fi world-building lab, integrated into the A14 release.
