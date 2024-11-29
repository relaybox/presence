export enum KeyPrefix {
  PRESENCE = 'presence',
  CLIENT = 'client',
  CONNECTION = 'connection'
}

export enum KeyNameSpace {
  PRESENCE = 'presence'
}

export enum KeySuffix {
  INDEX = 'index',
  MEMBERS = 'members',
  PRESENCE_SETS = 'presence-sets'
}

export interface ReducedSession {
  appPid: string;
  keyId: string;
  uid: string;
  clientId: string;
  connectionId: string;
}

export interface AuthUser {
  id: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  isOnline: boolean;
  lastOnline: string;
}

export enum AuthUserEvent {
  CONNECTION_STATUS = 'user:connection:status',
  CONNECT = 'user:connect',
  DISCONNECT = 'user:disconnect'
}

export interface SessionData {
  uid: string;
  appPid: string;
  keyId: string;
  clientId: string;
  exp: number;
  timestamp: string;
  socketId: string;
  connectionId: string;
  user?: AuthUser;
}
