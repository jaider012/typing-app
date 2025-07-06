import { CaretStyle, TestMode } from './test';

export interface AppSettings {
  // Test Configuration
  defaultTime: number;
  defaultMode: TestMode;
  language: string;
  
  // Visual Settings
  theme: string;
  fontSize: number;
  caretStyle: CaretStyle;
  
  // Behavior
  soundOnClick: boolean;
  smoothCaret: boolean;
  showLiveWPM: boolean;
  showLiveAccuracy: boolean;
  
  // Advanced
  blindMode: boolean;
  quickRestart: boolean;
  showKeyTips: boolean;
}

export const defaultSettings: AppSettings = {
  defaultTime: 60,
  defaultMode: 'time',
  language: 'english',
  theme: 'dark',
  fontSize: 18,
  caretStyle: 'line',
  soundOnClick: false,
  smoothCaret: true,
  showLiveWPM: true,
  showLiveAccuracy: true,
  blindMode: false,
  quickRestart: true,
  showKeyTips: false,
};