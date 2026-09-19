import type { CSSProperties } from "react";

export type Density = "compact" | "comfortable" | "spacious";
export type FontScale = "sm" | "md" | "lg" | "xl";
export type ColorMode = "light" | "dark" | "auto";
export type ContrastMode = "standard" | "high";

export type ThemeTokens = {
  colors: {
    accent: string;
    brand: string;
    brandStrong: string;
    border: string;
    danger: string;
    focus: string;
    ink: string;
    inkMuted: string;
    onBrand: string;
    surface: string;
    surfaceMuted: string;
  };
  radii: {
    lg: number;
    md: number;
    sm: number;
    xl: number;
  };
  spacing: {
    lg: number;
    md: number;
    sm: number;
    xl: number;
    xs: number;
  };
  typography: {
    baseSize: number;
    displayFont: string;
    bodyFont: string;
    lineHeight: number;
  };
};

export type ThemeConfig = {
  colorMode?: ColorMode;
  contrastMode?: ContrastMode;
  density?: Density;
  fontScale?: FontScale;
  tokens?: Partial<ThemeTokens>;
};

export const defaultThemeTokens: ThemeTokens = {
  colors: {
    accent: "#cc7a2d",
    brand: "#2f6f4e",
    brandStrong: "#24553c",
    border: "#e2e8f0",
    danger: "#c2410c",
    focus: "rgba(47, 111, 78, 0.3)",
    ink: "#0f172a",
    inkMuted: "#475569",
    onBrand: "#f8fafc",
    surface: "#ffffff",
    surfaceMuted: "#f1f5f9",
  },
  radii: {
    lg: 24,
    md: 16,
    sm: 12,
    xl: 32,
  },
  spacing: {
    lg: 24,
    md: 16,
    sm: 12,
    xl: 32,
    xs: 8,
  },
  typography: {
    baseSize: 16,
    bodyFont: "IBM Plex Sans, Segoe UI, sans-serif",
    displayFont: "Space Grotesk, Segoe UI, sans-serif",
    lineHeight: 1.5,
  },
};

export const getDensityScale = (density: Density = "comfortable") => {
  const scale = {
    compact: 0.88,
    comfortable: 1,
    spacious: 1.15,
  };

  return scale[density];
};

export const getFontScale = (fontScale: FontScale = "md") => {
  const scale = {
    sm: 0.9,
    md: 1,
    lg: 1.12,
    xl: 1.25,
  };

  return scale[fontScale];
};

export const resolveThemeTokens = (
  overrides: Partial<ThemeTokens> = {},
): ThemeTokens => ({
  colors: {
    ...defaultThemeTokens.colors,
    ...overrides.colors,
  },
  radii: {
    ...defaultThemeTokens.radii,
    ...overrides.radii,
  },
  spacing: {
    ...defaultThemeTokens.spacing,
    ...overrides.spacing,
  },
  typography: {
    ...defaultThemeTokens.typography,
    ...overrides.typography,
  },
});

export const resolveThemeConfig = (config: ThemeConfig = {}) => {
  const density = config.density ?? "comfortable";
  const fontScale = config.fontScale ?? "md";
  const colorMode = config.colorMode ?? "light";
  const contrastMode = config.contrastMode ?? "standard";
  const densityFactor = getDensityScale(density);
  const fontFactor = getFontScale(fontScale);

  const baseTokens = resolveThemeTokens(config.tokens ?? {});
  const adjustedTokens: ThemeTokens = {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      ...(contrastMode === "high"
        ? {
            brand: "#005A9C",
            brandStrong: "#003E73",
            border: "#111827",
            danger: "#9A2B2B",
            focus: "rgba(0, 0, 0, 0.9)",
            ink: "#111827",
            inkMuted: "#374151",
            onBrand: "#ffffff",
            surface: "#ffffff",
            surfaceMuted: "#f3f4f6",
          }
        : {}),
    },
    radii: {
      ...baseTokens.radii,
      sm: Math.round(baseTokens.radii.sm * densityFactor),
      md: Math.round(baseTokens.radii.md * densityFactor),
      lg: Math.round(baseTokens.radii.lg * densityFactor),
      xl: Math.round(baseTokens.radii.xl * densityFactor),
    },
    spacing: {
      ...baseTokens.spacing,
      xs: Math.round(baseTokens.spacing.xs * densityFactor),
      sm: Math.round(baseTokens.spacing.sm * densityFactor),
      md: Math.round(baseTokens.spacing.md * densityFactor),
      lg: Math.round(baseTokens.spacing.lg * densityFactor),
      xl: Math.round(baseTokens.spacing.xl * densityFactor),
    },
    typography: {
      ...baseTokens.typography,
      baseSize: Math.round(baseTokens.typography.baseSize * fontFactor),
    },
  };

  return {
    colorMode,
    contrastMode,
    density,
    fontScale,
    tokens: adjustedTokens,
  };
};

export const createThemeStyle = (config: ThemeConfig = {}): CSSProperties => {
  const resolved = resolveThemeConfig(config);
  const tokens = resolved.tokens;

  return {
    "--ui-brand": tokens.colors.brand,
    "--ui-brand-strong": tokens.colors.brandStrong,
    "--ui-accent": tokens.colors.accent,
    "--ui-border": tokens.colors.border,
    "--ui-danger": tokens.colors.danger,
    "--ui-focus-ring": tokens.colors.focus,
    "--ui-ink": tokens.colors.ink,
    "--ui-ink-muted": tokens.colors.inkMuted,
    "--ui-on-brand": tokens.colors.onBrand,
    "--ui-surface": tokens.colors.surface,
    "--ui-surface-muted": tokens.colors.surfaceMuted,
    "--ui-radius-sm": `${tokens.radii.sm}px`,
    "--ui-radius-md": `${tokens.radii.md}px`,
    "--ui-radius-lg": `${tokens.radii.lg}px`,
    "--ui-radius-xl": `${tokens.radii.xl}px`,
    "--ui-space-xs": `${tokens.spacing.xs}px`,
    "--ui-space-sm": `${tokens.spacing.sm}px`,
    "--ui-space-md": `${tokens.spacing.md}px`,
    "--ui-space-lg": `${tokens.spacing.lg}px`,
    "--ui-space-xl": `${tokens.spacing.xl}px`,
    "--ui-font-body": tokens.typography.bodyFont,
    "--ui-font-display": tokens.typography.displayFont,
    "--ui-font-size-base": `${tokens.typography.baseSize}px`,
    "--ui-line-height": `${tokens.typography.lineHeight}`,
    "--ui-font-scale": `${getFontScale(resolved.fontScale)}`,
    "--ui-density-scale": `${getDensityScale(resolved.density)}`,
    colorScheme: resolved.colorMode === "dark" ? "dark" : "light",
    fontSize: `${getFontScale(resolved.fontScale)}rem`,
  } as CSSProperties;
};
