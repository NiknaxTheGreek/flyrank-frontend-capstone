import Disclosure from '../../playground/Disclosure';
import Tabs from '../../playground/Tabs';
import Modal from '../../playground/Modal';
import ShadcnComparison from '../../playground/ShadcnComparison';
import './playground.css';

export default function PlaygroundPage() {
  return <section className="accessibility-playground" aria-labelledby="playground-title">
    <header><p className="eyebrow">REEL GOOD / ACCESSIBILITY PLAYGROUND</p><h1 id="playground-title" tabIndex={-1}>Made for every way in.</h1><p>Explore the custom keyboard interactions and their component-library equivalents.</p></header>
    <section><h2>Disclosure</h2><Disclosure title="How do I test this with a keyboard?"><p>Use Tab to focus the button, then Enter or Space to open and close it.</p><a href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/">Read the W3C disclosure pattern</a></Disclosure></section>
    <section><h2>Custom tabs</h2><Tabs /></section>
    <section><h2>Custom modal dialog</h2><Modal /></section>
    <ShadcnComparison />
  </section>;
}
