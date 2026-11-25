import { Component, type ReactNode } from 'react';

/** React Router/Vite equivalent of a Next.js route error boundary. */
export class RouteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="intro" role="alert">
      <h1>That page couldn’t load</h1>
      <p>Try loading it again, or return to the movie catalogue.</p>
      <button type="button" onClick={() => this.setState({ failed: false })}>Try this page again</button>
      <a href="/movies">Browse movies</a>
    </section>;
    return this.props.children;
  }
}
