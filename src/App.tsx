import { useState } from "react";

import "./App.css";
import {
  Button,
  ComponentConfigPage,
  ComponentConfigProvider,
  defaultComfortConfig,
  InlineDialog,
  Input,
  ParentDialog,
  ScreenDialog,
  type ComfortConfig,
} from "./design-system";

const releaseItems = [
  "Confirm keyboard and click-away behavior.",
  "Review the visual state against light and dark themes.",
  "Ship the dialog as a reusable molecule export.",
];

function DialogBody({ mode }: { mode: string }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm leading-6 text-ink-muted">
        This {mode} dialog uses the same panel treatment, accessible title
        wiring, escape dismissal, focus placement, and token-driven colors.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Reviewer" placeholder="Ada Lovelace" />
        <Input label="Release tag" placeholder="v1.0.0" />
      </div>
      <div className="rounded-md border border-border bg-surface-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Checklist
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-ink-muted">
          {releaseItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  const [comfortConfig, setComfortConfig] =
    useState<ComfortConfig>(defaultComfortConfig);
  const [screenOpen, setScreenOpen] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);

  return (
    <ComponentConfigProvider config={comfortConfig}>
      <main className="min-h-screen bg-surface-muted px-5 py-10 text-ink">
        <div className="mx-auto grid max-w-6xl gap-8">
          <section className="app-hero">
            <div>
              <p className="app-eyebrow">Comfort settings</p>
              <h1>Personalized components for real people.</h1>
            </div>
            <p className="app-intro">
              Tune readability, spacing, color, and shape from a prebuilt user
              settings page. Changes apply instantly to the preview and the demo.
            </p>
          </section>

          <ComponentConfigPage
            value={comfortConfig}
            onChange={setComfortConfig}
            onReset={() => setComfortConfig(defaultComfortConfig)}
          />

          <section className="grid gap-5 lg:grid-cols-3">
            <article className="surface-gradient rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Screen overlay
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                Center modal
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Opens in the center of the viewport and slightly darkens everything
                underneath.
              </p>
              <Button className="mt-5" onClick={() => setScreenOpen(true)}>
                Open centered dialog
              </Button>
            </article>

            <ParentDialog
              description="The overlay is scoped to this card, so the dialog snaps to the component that called it."
              footer={
                <>
                  <Button variant="secondary" onClick={() => setParentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setParentOpen(false)}>Apply</Button>
                </>
              }
              onOpenChange={setParentOpen}
              open={parentOpen}
              parent={
                <article className="min-h-[24rem] rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    Parent overlay
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold">
                    Snapped modal
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    The parent stays visible, darkened, and contained while the
                    dialog fills its bounds.
                  </p>
                  <div className="mt-5 grid gap-3 rounded-md bg-surface-muted p-4 text-sm text-ink-muted">
                    <span>Parent content remains underneath.</span>
                    <span>The overlay never escapes this component.</span>
                  </div>
                  <Button className="mt-5" onClick={() => setParentOpen(true)}>
                    Open parent dialog
                  </Button>
                </article>
              }
              title="Parent-scoped settings"
            >
              <DialogBody mode="parent-scoped" />
            </ParentDialog>

            <InlineDialog
              description="This version takes over the same layout slot instead of floating above it."
              footer={
                <>
                  <Button variant="secondary" onClick={() => setInlineOpen(false)}>
                    Back
                  </Button>
                  <Button onClick={() => setInlineOpen(false)}>Save</Button>
                </>
              }
              onOpenChange={setInlineOpen}
              open={inlineOpen}
              parent={
                <article className="min-h-[24rem] rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    Inline replacement
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold">
                    Push-in dialog
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    Opens instead of the calling component and occupies the same
                    space in the document flow.
                  </p>
                  <Button className="mt-5" onClick={() => setInlineOpen(true)}>
                    Open inline dialog
                  </Button>
                </article>
              }
              title="Inline release form"
              wrapperClassName="min-h-[24rem]"
            >
              <DialogBody mode="inline" />
            </InlineDialog>
          </section>
        </div>

        <ScreenDialog
          description="This is the classic viewport-level modal with a soft dark overlay."
          footer={
            <>
              <Button variant="secondary" onClick={() => setScreenOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setScreenOpen(false)}>Approve</Button>
            </>
          }
          onOpenChange={setScreenOpen}
          open={screenOpen}
          title="Centered release approval"
        >
          <DialogBody mode="centered" />
        </ScreenDialog>
      </main>
    </ComponentConfigProvider>
  );
}

export default App;
