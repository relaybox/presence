export enum KeyPrefix {
  PRESENCE = 'presence',
  CLIENT = 'client'
}

export enum KeySuffix {
  INDEX = 'index',
  MEMBERS = 'members',
  PRESENCE = 'presence'
}

export interface ReducedSession {
  appPid: string;
  keyId: string;
  uid: string;
  clientId: string;
  connectionId: string;
}
