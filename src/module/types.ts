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
