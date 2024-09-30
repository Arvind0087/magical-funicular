import {
  useState,
  createContext,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { defaultSettings } from "./config";
import { defaultPreset, getPresets, presetsOption } from "./presets";
import { setData } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { getIndividualSettingByIdAsync } from "redux/slices/individualSetting/individualSetting.async";
import { isJson } from "utils/isJson";

const initialState = {
  ...defaultSettings,
  onToggleMode: () => {},
  onChangeMode: () => {},
  onToggleDirection: () => {},
  onChangeDirection: () => {},
  onChangeDirectionByLang: () => {},
  onChangeLayout: () => {},
  onToggleContrast: () => {},
  onChangeContrast: () => {},
  onChangeColorPresets: () => {},
  presetsColor: defaultPreset,
  presetsOption: [],
  onToggleStretch: () => {},
  onResetSetting: () => {},
};

export const SettingsContext = createContext(initialState);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettingsContext must be use inside SettingsProvider");
  return context;
};

export function SettingsProvider({ children }) {
  const dispatch = useDispatch();
  const { getIndividualSetting, updateIndividualSetting } = useSelector(
    (state) => state.individualSetting
  );
  const [settings, setSettings] = useState(defaultSettings);
  
  useMemo(() => {
    dispatch(setData(settings));
  }, [settings]);

  useEffect(() => {
    const userId = isJson(localStorage.getItem("auth"))
      ? JSON.parse(localStorage.getItem("auth"))
      : null;
    if (userId) {
      dispatch(getIndividualSettingByIdAsync({ userId: userId.id }));
    }
  }, []);

  useEffect(() => {
    if (getIndividualSetting?.themeColorPresents) {
      setSettings({
        themeColorPresets: getIndividualSetting?.themeColorPresents,
        themeContrast: getIndividualSetting?.themeContrast,
        themeDirection: getIndividualSetting?.themeDirection,
        themeLayout: getIndividualSetting?.themeLayout,
        themeMode: getIndividualSetting?.themeMode,
        themeStretch: getIndividualSetting?.themeStretch,
      });
    } else {
      setSettings(defaultSettings);
    }
  }, [getIndividualSetting]);

  const langStorage =
    typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : "";

  const onToggleMode = useCallback(() => {
    const themeMode = settings.themeMode === "light" ? "dark" : "light";
    setSettings({ ...settings, themeMode });
  }, [setSettings, settings]);

  const onChangeMode = useCallback(
    (event) => {
      const themeMode = event.target.value;
      setSettings({ ...settings, themeMode });
    },
    [setSettings, settings]
  );

  // Direction
  const onToggleDirection = useCallback(() => {
    const themeDirection = settings.themeDirection === "rtl" ? "ltr" : "rtl";
    setSettings({ ...settings, themeDirection });
  }, [setSettings, settings]);

  const onChangeDirection = useCallback(
    (event) => {
      const themeDirection = event.target.value;
      setSettings({ ...settings, themeDirection });
    },
    [setSettings, settings]
  );

  const onChangeDirectionByLang = useCallback(
    (lang) => {
      const themeDirection = lang === "ar" ? "rtl" : "ltr";
      setSettings({ ...settings, themeDirection });
    },
    [setSettings, settings]
  );

  // Layout
  const onChangeLayout = useCallback(
    (event) => {
      const themeLayout = event.target.value;
      setSettings({ ...settings, themeLayout });
    },
    [setSettings, settings]
  );

  // Contrast
  const onToggleContrast = useCallback(() => {
    const themeContrast =
      settings.themeContrast === "default" ? "bold" : "default";
    setSettings({ ...settings, themeContrast });
  }, [setSettings, settings]);

  const onChangeContrast = useCallback(
    (event) => {
      const themeContrast = event.target.value;
      setSettings({ ...settings, themeContrast });
    },
    [setSettings, settings]
  );

  // Color
  const onChangeColorPresets = useCallback(
    (event) => {
      const themeColorPresets = event.target.value;
      setSettings({ ...settings, themeColorPresets });
    },
    [setSettings, settings]
  );

  // Stretch
  const onToggleStretch = useCallback(() => {
    const themeStretch = !settings.themeStretch;
    setSettings({ ...settings, themeStretch });
  }, [setSettings, settings]);

  // Reset
  const onResetSetting = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  const value = useMemo(
    () => ({
      ...settings,
      // Mode
      onToggleMode,
      onChangeMode,
      // Direction
      onToggleDirection,
      onChangeDirection,
      onChangeDirectionByLang,
      // Layout
      onChangeLayout,
      // Contrast
      onChangeContrast,
      onToggleContrast,
      // Stretch
      onToggleStretch,
      // Color
      onChangeColorPresets,
      presetsOption,
      presetsColor: getPresets(settings.themeColorPresets),
      // Reset
      onResetSetting,
    }),
    [
      settings,
      // Mode
      onToggleMode,
      onChangeMode,
      // Direction
      onToggleDirection,
      onChangeDirection,
      onChangeDirectionByLang,
      // Layout
      onChangeLayout,
      onChangeContrast,
      // Contrast
      onToggleContrast,
      // Stretch
      onToggleStretch,
      // Color
      onChangeColorPresets,
      // Reset
      onResetSetting,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
