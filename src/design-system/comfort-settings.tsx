import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Button, Input, Select } from "./atoms";
import { cx } from "./utils";

export type ComfortPresetId =
  | "easy-read"
  | "calm"
  | "compact"
  | "bright"
  | "high-contrast"
  | "cozy";

export type ComfortConfig = {
  presetId: ComfortPresetId;
  colors: {
    accent: string;
    brand: string;
    contrast: "soft" | "standard" | "strong" | "high";
    text?: string;
    surfaceTone: "neutral" | "warm" | "cool";
  };
  colorMode?: "light" | "dark" | "auto";
  layout: {
    controlSize: "compact" | "comfortable" | "large";
    marginScale: "compact" | "comfortable" | "spacious";
    paddingScale: "compact" | "comfortable" | "spacious";
    radius: "sharp" | "soft" | "round" | "pill";
  };
  typography: {
    baseSize: "sm" | "md" | "lg" | "xl";
    fontFamily: "system" | "atkinson" | "plex" | "inter" | "serif";
  };
};

export type ComfortPreset = {
  config: ComfortConfig;
  description: string;
  id: ComfortPresetId;
  name: string;
};

type ComfortContextValue = {
  config: ComfortConfig;
  style: CustomProperties;
};

export type ComponentConfigProviderProps = {
  children: ReactNode;
  config?: ComfortConfig;
};

export type ComponentConfigPageProps = {
  className?: string;
  onChange: (config: ComfortConfig) => void;
  onReset?: () => void;
  value: ComfortConfig;
};

type CustomProperties = CSSProperties & Record<`--${string}`, string>;

const fontStacks: Record<ComfortConfig["typography"]["fontFamily"], string> = {
  atkinson: '"Atkinson Hyperlegible", "IBM Plex Sans", "Segoe UI", sans-serif',
  inter: 'Inter, "IBM Plex Sans", "Segoe UI", sans-serif',
  plex: '"IBM Plex Sans", "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  system:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const baseSizePixels: Record<ComfortConfig["typography"]["baseSize"], number> =
  {
    sm: 15,
    md: 16,
    lg: 18,
    xl: 20,
  };

const controlScale: Record<ComfortConfig["layout"]["controlSize"], number> = {
  compact: 0.9,
  comfortable: 1,
  large: 1.16,
};

const spacingScale: Record<ComfortConfig["layout"]["paddingScale"], number> = {
  compact: 0.86,
  comfortable: 1,
  spacious: 1.18,
};

const marginScale: Record<ComfortConfig["layout"]["marginScale"], number> = {
  compact: 0.88,
  comfortable: 1,
  spacious: 1.22,
};

const radiusPixels: Record<ComfortConfig["layout"]["radius"], number> = {
  pill: 999,
  round: 28,
  sharp: 6,
  soft: 16,
};

const toneSurfaces: Record<
  ComfortConfig["colors"]["surfaceTone"],
  {
    darkSurface: string;
    darkSurfaceMuted: string;
    surface: string;
    surfaceMuted: string;
  }
> = {
  cool: {
    darkSurface: "#14202c",
    darkSurfaceMuted: "#1d2d3d",
    surface: "#f8fbff",
    surfaceMuted: "#e8f0f7",
  },
  neutral: {
    darkSurface: "#111827",
    darkSurfaceMuted: "#1f2937",
    surface: "#ffffff",
    surfaceMuted: "#f1f5f9",
  },
  warm: {
    darkSurface: "#241a14",
    darkSurfaceMuted: "#35261c",
    surface: "#fffaf3",
    surfaceMuted: "#f4eadc",
  },
};

const contrastTokens: Record<
  ComfortConfig["colors"]["contrast"],
  { border: string; ink: string; inkMuted: string }
> = {
  high: { border: "#020617", ink: "#020617", inkMuted: "#1f2937" },
  soft: { border: "#e5e7eb", ink: "#1f2937", inkMuted: "#64748b" },
  standard: { border: "#e2e8f0", ink: "#0f172a", inkMuted: "#475569" },
  strong: { border: "#94a3b8", ink: "#020617", inkMuted: "#334155" },
};

export const comfortPresets: Record<ComfortPresetId, ComfortPreset> = {
  "easy-read": {
    description: "Larger text, roomy controls, and clear contrast.",
    id: "easy-read",
    name: "Easy Read",
    config: {
      presetId: "easy-read",
      colors: {
        accent: "#b45309",
        brand: "#1d4ed8",
        contrast: "strong",
        text: "#172033",
        surfaceTone: "neutral",
      },
      colorMode: "light",
      layout: {
        controlSize: "large",
        marginScale: "spacious",
        paddingScale: "spacious",
        radius: "soft",
      },
      typography: {
        baseSize: "lg",
        fontFamily: "atkinson",
      },
    },
  },
  calm: {
    description: "Gentle color, easy spacing, and low visual noise.",
    id: "calm",
    name: "Calm",
    config: {
      presetId: "calm",
      colors: {
        accent: "#8b6f47",
        brand: "#2f6f4e",
        contrast: "standard",
        text: "#24342b",
        surfaceTone: "warm",
      },
      colorMode: "light",
      layout: {
        controlSize: "comfortable",
        marginScale: "comfortable",
        paddingScale: "comfortable",
        radius: "round",
      },
      typography: {
        baseSize: "md",
        fontFamily: "plex",
      },
    },
  },
  compact: {
    description: "Tighter spacing for users who want more on screen.",
    id: "compact",
    name: "Compact",
    config: {
      presetId: "compact",
      colors: {
        accent: "#7c3aed",
        brand: "#0f766e",
        contrast: "standard",
        text: "#102a2a",
        surfaceTone: "neutral",
      },
      colorMode: "light",
      layout: {
        controlSize: "compact",
        marginScale: "compact",
        paddingScale: "compact",
        radius: "sharp",
      },
      typography: {
        baseSize: "sm",
        fontFamily: "system",
      },
    },
  },
  bright: {
    description: "Crisp light surfaces with a stronger accent feel.",
    id: "bright",
    name: "Bright",
    config: {
      presetId: "bright",
      colors: {
        accent: "#db2777",
        brand: "#2563eb",
        contrast: "standard",
        text: "#18243b",
        surfaceTone: "cool",
      },
      colorMode: "light",
      layout: {
        controlSize: "comfortable",
        marginScale: "comfortable",
        paddingScale: "comfortable",
        radius: "soft",
      },
      typography: {
        baseSize: "md",
        fontFamily: "inter",
      },
    },
  },
  "high-contrast": {
    description: "Maximum clarity with stronger borders and text.",
    id: "high-contrast",
    name: "High Contrast",
    config: {
      presetId: "high-contrast",
      colors: {
        accent: "#b45309",
        brand: "#005a9c",
        contrast: "high",
        text: "#020617",
        surfaceTone: "neutral",
      },
      colorMode: "light",
      layout: {
        controlSize: "large",
        marginScale: "comfortable",
        paddingScale: "comfortable",
        radius: "sharp",
      },
      typography: {
        baseSize: "lg",
        fontFamily: "atkinson",
      },
    },
  },
  cozy: {
    description: "Warm surfaces, relaxed spacing, and friendly rounding.",
    id: "cozy",
    name: "Cozy",
    config: {
      presetId: "cozy",
      colors: {
        accent: "#c2410c",
        brand: "#9a3412",
        contrast: "standard",
        text: "#3a1b12",
        surfaceTone: "warm",
      },
      colorMode: "light",
      layout: {
        controlSize: "comfortable",
        marginScale: "spacious",
        paddingScale: "spacious",
        radius: "round",
      },
      typography: {
        baseSize: "md",
        fontFamily: "serif",
      },
    },
  },
};

export const cloneComfortConfig = (config: ComfortConfig): ComfortConfig => ({
  ...config,
  colors: { ...config.colors },
  layout: { ...config.layout },
  typography: { ...config.typography },
});

export const getComfortPresetConfig = (presetId: ComfortPresetId) =>
  cloneComfortConfig(comfortPresets[presetId].config);

export const defaultComfortConfig = getComfortPresetConfig("calm");

const ComfortContext = createContext<ComfortContextValue | null>(null);

function clampColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#2f6f4e";
}

function getRelativeLuminance(hexColor: string) {
  const hex = clampColor(hexColor).slice(1);
  const channels = [0, 2, 4].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function getContrastRatio(foreground: string, background: string) {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function darkenHex(hexColor: string, amount: number) {
  const hex = clampColor(hexColor).slice(1);
  const channels = [0, 2, 4].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16);
    return Math.max(0, Math.round(value * (1 - amount)))
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

export function createComfortStyle(config: ComfortConfig): CustomProperties {
  const surface = toneSurfaces[config.colors.surfaceTone];
  const contrast = contrastTokens[config.colors.contrast];
  const brand = clampColor(config.colors.brand);
  const accent = clampColor(config.colors.accent);
  const text = clampColor(config.colors.text ?? contrast.ink);
  const darkText =
    getContrastRatio(text, surface.darkSurface) >= 4.5 ? text : "#f8fafc";
  const colorMode = config.colorMode ?? "light";
  const padding = spacingScale[config.layout.paddingScale];
  const margin = marginScale[config.layout.marginScale];
  const control = controlScale[config.layout.controlSize];
  const radius = radiusPixels[config.layout.radius];
  const baseSize = baseSizePixels[config.typography.baseSize];
  const spacing = 0.25 * padding;

  return {
    "--accent": accent,
    "--border": contrast.border,
    "--brand": brand,
    "--brand-soft": `${brand}1f`,
    "--brand-strong": darkenHex(brand, 0.22),
    "--color-accent": accent,
    "--color-border": contrast.border,
    "--color-brand": brand,
    "--color-brand-soft": `${brand}1f`,
    "--color-brand-strong": darkenHex(brand, 0.22),
    "--color-ink": text,
    "--color-ink-muted": contrast.inkMuted,
    "--color-surface": surface.surface,
    "--color-surface-muted": surface.surfaceMuted,
    "--comfort-dark-border": "#475569",
    "--comfort-dark-ink": darkText,
    "--comfort-dark-ink-muted": "#cbd5e1",
    "--comfort-dark-surface": surface.darkSurface,
    "--comfort-dark-surface-muted": surface.darkSurfaceMuted,
    "--comfort-light-ink": text,
    "--comfort-light-ink-muted": contrast.inkMuted,
    "--comfort-light-surface": surface.surface,
    "--comfort-light-surface-muted": surface.surfaceMuted,
    "--focus-ring": `${brand}4d`,
    "--font-body": fontStacks[config.typography.fontFamily],
    "--font-display": fontStacks[config.typography.fontFamily],
    "--ink": text,
    "--ink-muted": contrast.inkMuted,
    "--radius-lg": `${radius}px`,
    "--radius-md": `${Math.max(4, Math.round(radius * 0.72))}px`,
    "--radius-sm": `${Math.max(3, Math.round(radius * 0.5))}px`,
    "--radius-xl": `${Math.round(radius * 1.25)}px`,
    "--surface": surface.surface,
    "--surface-muted": surface.surfaceMuted,
    "--spacing": `${spacing}rem`,
    "--ui-comfort-control-scale": `${control}`,
    "--ui-comfort-margin-scale": `${margin}`,
    "--ui-comfort-padding-scale": `${padding}`,
    colorScheme: colorMode === "auto" ? "light dark" : colorMode,
    fontFamily: fontStacks[config.typography.fontFamily],
    fontSize: `${baseSize}px`,
  } satisfies CustomProperties;
}

export function ComponentConfigProvider({
  children,
  config = defaultComfortConfig,
}: ComponentConfigProviderProps) {
  const style = createComfortStyle(config);

  return (
    <ComfortContext.Provider value={{ config, style }}>
      <div data-comfort-color-mode={config.colorMode ?? "light"} style={style}>
        {children}
      </div>
    </ComfortContext.Provider>
  );
}

export function useComponentConfig() {
  const context = useContext(ComfortContext);

  if (context) {
    return context;
  }

  return {
    config: defaultComfortConfig,
    style: createComfortStyle(defaultComfortConfig),
  } satisfies ComfortContextValue;
}

type ComfortConfigSection = "colors" | "layout" | "typography";

function updateConfig<TSection extends ComfortConfigSection>(
  config: ComfortConfig,
  section: TSection,
  value: Partial<ComfortConfig[TSection]>,
) {
  return {
    ...config,
    [section]: {
      ...config[section],
      ...value,
    },
  };
}

function ControlGroup({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="grid gap-3">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function SelectField({
  children,
  label,
  value,
  onChange,
}: {
  children: ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </Select>
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <span className="flex items-center gap-3 rounded-md border border-border bg-surface p-2">
        <input
          className="h-9 w-12 cursor-pointer rounded-sm border border-border bg-transparent"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Input
          aria-label={`${label} hex value`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function ComponentPreview() {
  return (
    <div className="grid gap-[calc(1rem*var(--ui-comfort-margin-scale))] rounded-lg border border-border bg-surface p-[calc(1.25rem*var(--ui-comfort-padding-scale))] shadow-[var(--shadow-card)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Preview
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
          Comfortable interface sample
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Settings update this preview and the surrounding app immediately.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Name" placeholder="Maja Andersson" uiSize="lg" />
        <Input label="Reminder" placeholder="Medication at 18:00" uiSize="lg" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Save changes</Button>
        <Button variant="secondary">Cancel</Button>
        <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-strong">
          Active
        </span>
      </div>

      <div className="rounded-md border border-border bg-surface-muted p-[calc(1rem*var(--ui-comfort-padding-scale))]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-ink">Upcoming appointment</p>
            <p className="text-sm text-ink-muted">Tuesday, 14:30</p>
          </div>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ComponentConfigPage({
  className,
  onChange,
  onReset,
  value,
}: ComponentConfigPageProps) {
  const previewStyle = createComfortStyle(value);
  const brandContrast = getContrastRatio(value.colors.brand, "#ffffff");
  const hasContrastWarning =
    value.colors.contrast !== "high" && brandContrast < 3.5;

  return (
    <div
      className={cx(
        "grid gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]",
        className,
      )}
    >
      <div className="grid gap-5 rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Comfort settings
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Make the interface feel right
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Start from a preset, then tune readability, spacing, shape, and
            color.
          </p>
        </div>

        <ControlGroup title="Preset">
          <SelectField
            label="Starting point"
            value={value.presetId}
            onChange={(nextValue) =>
              onChange(getComfortPresetConfig(nextValue as ComfortPresetId))
            }
          >
            {Object.values(comfortPresets).map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </SelectField>
          <p className="text-sm leading-6 text-ink-muted">
            {comfortPresets[value.presetId].description}
          </p>
        </ControlGroup>

        <ControlGroup title="Color">
          <ColorField
            label="Brand"
            value={value.colors.brand}
            onChange={(brand) =>
              onChange(updateConfig(value, "colors", { brand }))
            }
          />
          <ColorField
            label="Accent"
            value={value.colors.accent}
            onChange={(accent) =>
              onChange(updateConfig(value, "colors", { accent }))
            }
          />
          <ColorField
            label="Text"
            value={value.colors.text ?? "#0f172a"}
            onChange={(text) =>
              onChange(updateConfig(value, "colors", { text }))
            }
          />
          <SelectField
            label="Color mode"
            value={value.colorMode ?? "light"}
            onChange={(colorMode) =>
              onChange({
                ...value,
                colorMode: colorMode as ComfortConfig["colorMode"],
              })
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Use device setting</option>
          </SelectField>
          <SelectField
            label="Surface tone"
            value={value.colors.surfaceTone}
            onChange={(surfaceTone) =>
              onChange(
                updateConfig(value, "colors", {
                  surfaceTone:
                    surfaceTone as ComfortConfig["colors"]["surfaceTone"],
                }),
              )
            }
          >
            <option value="neutral">Neutral</option>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
          </SelectField>
          <SelectField
            label="Contrast"
            value={value.colors.contrast}
            onChange={(contrast) =>
              onChange(
                updateConfig(value, "colors", {
                  contrast: contrast as ComfortConfig["colors"]["contrast"],
                }),
              )
            }
          >
            <option value="soft">Soft</option>
            <option value="standard">Standard</option>
            <option value="strong">Strong</option>
            <option value="high">High</option>
          </SelectField>
          {hasContrastWarning ? (
            <div className="rounded-md border border-warning bg-surface-muted p-3 text-sm leading-6 text-ink">
              This brand color may be hard to read on white buttons. Try
              stronger contrast or a darker brand color.
            </div>
          ) : null}
        </ControlGroup>

        <ControlGroup title="Reading">
          <SelectField
            label="Font"
            value={value.typography.fontFamily}
            onChange={(fontFamily) =>
              onChange(
                updateConfig(value, "typography", {
                  fontFamily:
                    fontFamily as ComfortConfig["typography"]["fontFamily"],
                }),
              )
            }
          >
            <option value="system">System</option>
            <option value="atkinson">Atkinson Hyperlegible</option>
            <option value="plex">IBM Plex Sans</option>
            <option value="inter">Inter</option>
            <option value="serif">Serif comfort</option>
          </SelectField>
          <SelectField
            label="Text size"
            value={value.typography.baseSize}
            onChange={(baseSize) =>
              onChange(
                updateConfig(value, "typography", {
                  baseSize: baseSize as ComfortConfig["typography"]["baseSize"],
                }),
              )
            }
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra large</option>
          </SelectField>
        </ControlGroup>

        <ControlGroup title="Spacing and shape">
          <SelectField
            label="Control size"
            value={value.layout.controlSize}
            onChange={(controlSize) =>
              onChange(
                updateConfig(value, "layout", {
                  controlSize:
                    controlSize as ComfortConfig["layout"]["controlSize"],
                }),
              )
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="large">Large</option>
          </SelectField>
          <SelectField
            label="Padding"
            value={value.layout.paddingScale}
            onChange={(paddingScale) =>
              onChange(
                updateConfig(value, "layout", {
                  paddingScale:
                    paddingScale as ComfortConfig["layout"]["paddingScale"],
                }),
              )
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </SelectField>
          <SelectField
            label="Margins"
            value={value.layout.marginScale}
            onChange={(marginScale) =>
              onChange(
                updateConfig(value, "layout", {
                  marginScale:
                    marginScale as ComfortConfig["layout"]["marginScale"],
                }),
              )
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </SelectField>
          <SelectField
            label="Radius"
            value={value.layout.radius}
            onChange={(radius) =>
              onChange(
                updateConfig(value, "layout", {
                  radius: radius as ComfortConfig["layout"]["radius"],
                }),
              )
            }
          >
            <option value="sharp">Sharp</option>
            <option value="soft">Soft</option>
            <option value="round">Round</option>
            <option value="pill">Pill</option>
          </SelectField>
        </ControlGroup>

        {onReset ? (
          <Button variant="secondary" onClick={onReset}>
            Reset settings
          </Button>
        ) : null}
      </div>

      <div style={previewStyle}>
        <ComponentPreview />
      </div>
    </div>
  );
}
