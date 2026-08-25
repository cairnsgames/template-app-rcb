export type PropertyValue = string | number | boolean | null;

export type Property = {
  id?: number;
  user_id?: number;
  name: string;
  value: PropertyValue; // primitive, or a JSON-stringified object serialized as a string
  type?: string;
  options?: string[];
};
