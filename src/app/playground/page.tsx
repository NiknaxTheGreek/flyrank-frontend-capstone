import ShadcnComparison from "../../../playground/ShadcnComparison";
import Modal from "../../../playground/Modal";
import Tabs from "../../../playground/Tabs";
import Disclosure from "../../../playground/Disclosure";

export default function PlaygroundPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Accessibility playground</h1>
        <p>
          Assignment 5: custom disclosure, tabs and modal components.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Disclosure</h2>
        <Disclosure title="How do I test this with a keyboard?">
          <p>
            Press Tab to focus the button. Press Enter or Space to
            expand or collapse this content.
          </p>
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
            className="mt-3 inline-block underline
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-4"
          >
            Read the W3C disclosure pattern
          </a>
        </Disclosure>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tabs</h2>
        <Tabs />
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Modal dialog</h2>
        <Modal />
      </section>
      <ShadcnComparison />
    </main>
  );
}
