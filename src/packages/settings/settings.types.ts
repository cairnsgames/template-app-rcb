export type Setting = {
  keyname: string;
  val: string;
};

export type SettingsContextValue = {
  settings: Setting[];
};
