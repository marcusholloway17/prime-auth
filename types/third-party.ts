export type ThirdPartyType = {
  key: string;
  secret: string;
  name: string;
  description?: string;
  host: string;
  logoUrl?: string;
  faviconUrl?: string;
  redirectionUrl: string;
  maxUser: number;
  userCount: number;
  allowRegistration: boolean;
  allowRecovery: boolean;
  onlyVerified: boolean;
  useCustom: boolean;
  lastActivity: string;
  active: boolean;
  adminId: string;
  activatedBy?: string;
  activatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  AuthorizedClients: AuthorizedClientType;
  ReqLogs?: ReqLogType;
};

export type AuthorizedClientType = {
  clientId: string;
  clientSecret: string;
  name: string;
  description: string;
  scopes: string[];
  thirdPartyKey: string;
  active: boolean;
  revoked: boolean;
  revokedBy?: string;
  revokedAt?: string;
  revokeReason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ReqLogType = {
  id: string;
  method: string;
  protocol: 'http' | 'https';
  hostname: string;
  path: string;
  originalUrl?: string;
  subdomains?: string;
  cookies?: any;
  ip: string;
  date: string;
  thirdPartyKey: string;
};
