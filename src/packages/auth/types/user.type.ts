import Property from "../../profile/types/property.type";

export type Permission = {
  name: string;
  permission: string;
};

export type User = {
  id: number;
  email: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  token?: string;
  roleid?: number;
  role?: string;
  app_id?: string;
  permissions?: Permission[];
  properties?: Property[];
  debug?: any;
};

export default User;
