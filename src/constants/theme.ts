/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#102F55',
    background: '#F7FAFE',
    backgroundElement: '#EAF3FC',
    backgroundSelected: '#DDF5EE',
    textSecondary: '#5C7187',
    brandNavy: '#102F55',
    brandBlue: '#155A9C',
    brandTeal: '#10A889',
    brandTealLight: '#DDF5EE',
    border: '#D7E5F0',
    surface: '#FFFFFF',
    success: '#159A68',
    warning: '#D99018',
    error: '#D34B4B',
    info: '#287AC5',
  },
  dark: {
    text: '#F4F8FC',
    background: '#081A31',
    backgroundElement: '#102F55',
    backgroundSelected: '#12483F',
    textSecondary: '#B5C9DB',
    brandNavy: '#8BB9E4',
    brandBlue: '#5FA5E2',
    brandTeal: '#53D2B5',
    brandTealLight: '#12483F',
    border: '#294968',
    surface: '#102743',
    success: '#53D2B5',
    warning: '#F2B84B',
    error: '#F08080',
    info: '#73B9F0',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
