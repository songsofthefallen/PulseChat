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
  id: number;
  recipient_id: number;
  actor_id: number;
  type: "message" | "mention" | "reply" | "reaction" | "invite" | "system";
  workspace_id: number | null;
  channel_id: number | null;
  conversation_id: number | null;
  message_id: number | null;
  dm_message_id: number | null;
  is_read: boolean;
  created_at: string;
  actor_username: string | null;
  message_content: string | null;
}

export interface NotificationUnreadCount {
  count: number;
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
