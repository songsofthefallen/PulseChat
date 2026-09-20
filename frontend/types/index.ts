export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

export interface User {
  id: number;
  username: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  status: PresenceStatus;
  customStatus?: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
}

export interface Server {
  id: string;
  name: string;
  iconUrl?: string;
  unreadCount: number;
  hasMention: boolean;
}

export type ChannelType = "text" | "voice" | "dm";

export interface Channel {
  id: number;
  name: string;
}

export interface ChannelCategory {
  id: string;
  serverId: string;
  name: string;
  collapsed?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
  size: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface MessageUser {
  id: number;
  username: string;
  avatar_url: string | null;
}

export interface Message {
  id: number;
  channel_id: number;
  content: string;
  created_at: string;
  user: MessageUser;
}

export interface MessageRead {
  user_id: number;
  message_id: number;
  read_at: string;
  username: string;
}

export interface RecentConversation {
  id: number;
  channel_id: number;
  content: string;
  created_at: string;
  user: MessageUser;
  channel: {
    id: number;
    workspace_id: number;
    name: string;
  };
}

export interface PinnedChannel {
  id: number;
  workspace_id: number;
  name: string;
}

export interface NotificationItem {
  id: string;
  type: "mention" | "reply" | "reaction" | "system" | "invite";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface SearchResult {
  id: string;
  kind: "message" | "channel" | "user" | "server";
  title: string;
  subtitle?: string;
}

export interface Paginated<T> {
  items: T[];
  nextCursor?: string;
}
