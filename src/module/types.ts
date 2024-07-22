export enum KeyPrefix {
  PRESENCE = 'presence'
}

export enum KeySuffix {
  INDEX = 'index',
  MEMBERS = 'members'
}

export interface ReducedSession {
  appPid: string;
  keyId: string;
  uid: string;
  clientId: string;
  connectionId: string;
}
