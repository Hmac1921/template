# Comfort Settings Feature

## Summary

Add an optional end-user configuration system for the component library. The goal is to let consuming apps expose a friendly settings page where users can tune readability, spacing, contrast, color, radius, and typography with instant preview.

This is especially useful for consumer apps where comfort matters, such as apps used by older users or users with different visual preferences.

## Product Shape

The library should export a prebuilt configuration page that a consuming app can place inside user settings.

```tsx
<ComponentConfigPage
  value={config}
  onChange={setConfig}
  onReset={resetConfig}
/>
```

The consuming app owns persistence. The component library should emit config changes, but should not decide whether they are saved to localStorage, cookies, a database, an API, or account preferences.

```tsx
<ComponentConfigProvider config={config}>
  <App />
</ComponentConfigProvider>
```

## Target User

The settings page is for end users when the consuming app enables it. It should not feel like a developer token editor.

The UI language should use human outcomes rather than design-system jargon.

Examples:

- Easy Read
- Calm
- Compact
- Bright
- High Contrast
- Cozy

Internal preset ids can remain developer-friendly:

```ts
type ComfortPresetId =
  | "easy-read"
  | "calm"
  | "compact"
  | "bright"
  | "high-contrast"
  | "cozy";
```

## MVP Scope

Start with global controls only. Per-component overrides can come later.

Global controls:

- theme preset
- brand color
- accent color
- background warmth / surface tone
- contrast level
- base font size
- control size
- font family
- padding scale
- margin / layout spacing scale
- border radius
- reset to preset/default

Possible later controls:

- motion level
- per-component overrides
- advanced token editor
- import/export JSON

## Preview Behavior

Changes should apply immediately. Avoid a delayed apply/save workflow.

The settings page should support both:

- live updates to the actual app through `ComponentConfigProvider`
- an embedded preview panel with common components

The preview panel should show:

- text hierarchy
- buttons
- inputs
- cards
- badges/status indicators
- list or table row
- dialog preview

## Presets

Presets are jumping-off points. Users can choose a preset and then customize the details.

Suggested starter presets:

- Easy Read: larger text, larger controls, stronger clarity.
- Calm: gentle color, comfortable spacing, lower visual intensity.
- Compact: tighter density for users who prefer more information on screen.
- Bright: crisp light UI with stronger brand/accent presence.
- High Contrast: accessibility-first contrast.
- Cozy: warmer surfaces, rounder radius, relaxed spacing.

## Color Editing

Keep color controls friendly for v1:

- brand color
- accent color
- background warmth / surface tone
- contrast level

Do not expose full token editing in the first version. Advanced token editing can be added later.

## Typography

Separate text scale from control size.

This lets users make text easier to read without forcing every control to become huge. It also supports users who want larger click targets without dramatically changing content density.

Suggested font choices should balance readability and personality:

- System
- Atkinson Hyperlegible
- IBM Plex Sans
- Inter
- Georgia / serif comfort mode

## Accessibility Guardrails

Warn users about poor readability, but do not hard-block customization.

Examples:

- "This color combination may be hard to read."
- "Try stronger contrast."
- "Auto-fix contrast."

Later implementation can calculate contrast ratios and show WCAG-oriented pass/warn indicators.

## Suggested Types

```ts
type ComfortConfig = {
  presetId: ComfortPresetId;
  colors: {
    brand: string;
    accent: string;
    surfaceTone: "neutral" | "warm" | "cool";
    contrast: "soft" | "standard" | "strong" | "high";
  };
  typography: {
    fontFamily: "system" | "atkinson" | "plex" | "inter" | "serif";
    baseSize: "sm" | "md" | "lg" | "xl";
  };
  layout: {
    controlSize: "compact" | "comfortable" | "large";
    paddingScale: "compact" | "comfortable" | "spacious";
    marginScale: "compact" | "comfortable" | "spacious";
    radius: "sharp" | "soft" | "round" | "pill";
  };
};
```

## Suggested Implementation Order

1. Define `ComfortConfig` and preset types.
2. Create default config and named preset configs.
3. Add a resolver that converts config into CSS variables.
4. Add `ComponentConfigProvider`.
5. Add `ComponentConfigPage`.
6. Add embedded preview components.
7. Wire existing components to the config variables.
8. Add contrast/readability warnings.

## Design Principle

This feature should make the component library feel personally comfortable, not endlessly configurable. Presets give users a good starting point; controls let them adjust the parts that affect readability, touch comfort, and visual calm.
