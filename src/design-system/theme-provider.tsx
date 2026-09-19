import {
  createContext,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  createThemeStyle,
  resolveThemeConfig,
  type ThemeConfig,
  type ThemeTokens,
} from "./theme";

export type ThemeContextValue = ThemeConfig & {
  setThemeConfig: (
    nextConfig: ThemeConfig | ((current: ThemeConfig) => ThemeConfig),
  ) => void;
  style: CSSProperties;
  tokens: ThemeTokens;
};

const defaultConfig: Required<ThemeConfig> = {
  colorMode: "light",
  contrastMode: "standard",
  density: "comfortable",
  fontScale: "md",
  tokens: {},
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: ReactNode;
  initialConfig?: ThemeConfig;
};

export function ThemeProvider({
  children,
  initialConfig = {},
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>({
    ...defaultConfig,
    ...initialConfig,
    tokens: {
      ...defaultConfig.tokens,
      ...initialConfig.tokens,
    },
  });

  const value = useMemo(() => {
    const resolved = resolveThemeConfig(config);
    const style = createThemeStyle(config);

    return {
      ...resolved,
      setThemeConfig: (
        nextConfig: ThemeConfig | ((current: ThemeConfig) => ThemeConfig),
      ) => {
        setConfig((current) => {
          const resolvedNext =
            typeof nextConfig === "function" ? nextConfig(current) : nextConfig;

          return {
            ...defaultConfig,
            ...current,
            ...resolvedNext,
            tokens: {
              ...current.tokens,
              ...resolvedNext.tokens,
            },
          };
        });
      },
      style,
      tokens: resolved.tokens,
    } satisfies ThemeContextValue;
  }, [config]);

  return (
    <ThemeContext.Provider value={value}>
      <div style={value.style}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    const fallback = resolveThemeConfig();

    return {
      ...fallback,
      setThemeConfig: () => undefined,
      style: createThemeStyle(),
      tokens: fallback.tokens,
    } satisfies ThemeContextValue;
  }

  return context;
}
