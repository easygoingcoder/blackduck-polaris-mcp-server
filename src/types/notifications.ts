export interface NotificationPreferences {
  email?: boolean;
  slack?: boolean;
  [key: string]: unknown;
}

export interface EventGroupSubscription {
  _id?: string;
  eventGroupId?: string;
  name?: string;
  subscribed?: boolean;
  [key: string]: unknown;
}
