export type Property = {
  id?: number;
  user_id?: number;
  name: string;
  value: any; // can be a primitive or a JSON-stringified object
  type?: string;
  options?: string[];
};

export default Property;
