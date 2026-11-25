import { Link } from 'react-router-dom';
export default function NotFoundPage({ movie = false }: { movie?: boolean }) {
  return <section className="intro">
    <h1 tabIndex={-1}>{movie ? 'Movie not found' : 'Page not found'}</h1>
    <p className="intro-copy">{movie ? 'This movie is not in our sample collection.' : 'This address does not match a page.'}</p>
    <Link className="button button-primary" to="/">Browse movies</Link>
  </section>;
}

