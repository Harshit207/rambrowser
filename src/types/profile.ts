export interface CookieData {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: number;
  httpOnly: boolean;
  secure: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: number;
  lastModified: number;
  cookies: CookieData[];
  settings: Record<string, string | number | boolean>;
  bookmarks: Array<{ title: string; url: string }>;
}

export interface USBDevice {
  name: string;
  path: string;
  profiles: UserProfile[];
  lastScanned: number;
}
