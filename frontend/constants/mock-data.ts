/**
 * Static fixture data used only to render the UI while there is no real
 * backend. This is NOT a mock server / API layer — components read these
 * arrays directly today and will be pointed at TanStack Query hooks backed
 * by `api/*` once a real backend exists. Replace freely.
 */
import type {
  Channel,
  ChannelCategory,
  Message,
  NotificationItem,
  Server,
  User,
} from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Sasha Ridley",
  handle: "sasha",
  status: "online",
  customStatus: "Shipping the composer",
};

export const mockUsers: User[] = [
  currentUser,
  { id: "u2", name: "Marcus Webb", handle: "marcus", status: "online" },
  { id: "u3", name: "Priya Anand", handle: "priya", status: "idle", customStatus: "In a meeting" },
  { id: "u4", name: "Jonah Ellis", handle: "jonah", status: "dnd", customStatus: "Focus mode" },
  { id: "u5", name: "Wren Okafor", handle: "wren", status: "offline" },
  { id: "u6", name: "Tobias Lin", handle: "tobias", status: "online" },
];

export const mockServers: Server[] = [
  { id: "s1", name: "PulseChat HQ", unreadCount: 3, hasMention: true },
  { id: "s2", name: "Design Guild", unreadCount: 0, hasMention: false },
  { id: "s3", name: "Indie Hackers", unreadCount: 12, hasMention: false },
  { id: "s4", name: "Weekend Project", unreadCount: 0, hasMention: false },
];

export const mockCategories: ChannelCategory[] = [
  { id: "cat1", serverId: "s1", name: "Information" },
  { id: "cat2", serverId: "s1", name: "Text Channels" },
  { id: "cat3", serverId: "s1", name: "Voice Channels" },
];

export const mockChannels: Channel[] = [
  { id: "c1", serverId: "s1", categoryId: "cat1", name: "announcements", type: "text", unreadCount: 0, mentionCount: 0 },
  { id: "c2", serverId: "s1", categoryId: "cat1", name: "rules", type: "text", unreadCount: 0, mentionCount: 0 },
  { id: "c3", serverId: "s1", categoryId: "cat2", name: "general", type: "text", unreadCount: 5, mentionCount: 1, isFavorite: true },
  { id: "c4", serverId: "s1", categoryId: "cat2", name: "design-review", type: "text", unreadCount: 0, mentionCount: 0 },
  { id: "c5", serverId: "s1", categoryId: "cat2", name: "random", type: "text", unreadCount: 2, mentionCount: 0 },
  { id: "c6", serverId: "s1", categoryId: "cat3", name: "Lounge", type: "voice", unreadCount: 0, mentionCount: 0 },
  { id: "c7", serverId: "s1", categoryId: "cat3", name: "Pairing Room", type: "voice", unreadCount: 0, mentionCount: 0 },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    channelId: "c3",
    author: mockUsers[1],
    content: "Morning — pushed the new composer states, can someone give it a look before standup?",
    createdAt: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
    attachments: [],
    reactions: [{ emoji: "👀", count: 2, reactedByMe: false }],
  },
  {
    id: "m2",
    channelId: "c3",
    author: mockUsers[2],
    content: "On it — will check after my 10am.",
    createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    attachments: [],
    reactions: [],
    replyToId: "m1",
  },
  {
    id: "m3",
    channelId: "c3",
    author: currentUser,
    content: "Reminder: design review moved to 3pm today, `#design-review` for the doc.",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    attachments: [],
    reactions: [{ emoji: "✅", count: 4, reactedByMe: true }],
  },
  {
    id: "m4",
    channelId: "c3",
    author: mockUsers[3],
    content: "Anyone else seeing the typing indicator flicker on slow connections? Filed a note in the tracker.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    attachments: [],
    reactions: [],
  },
  {
    id: "m5",
    channelId: "c3",
    author: mockUsers[4],
    content: "Nice catch — I'll take a look after lunch.",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    attachments: [],
    reactions: [],
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "mention",
    title: "Priya Anand mentioned you",
    body: "in #design-review: \"@sasha can you weigh in on the empty state?\"",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: "n2",
    type: "reply",
    title: "Marcus Webb replied to your message",
    body: "in #general: \"Sounds good, moving it now.\"",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    read: false,
  },
  {
    id: "n3",
    type: "invite",
    title: "You were invited to Weekend Project",
    body: "Jonah Ellis invited you to join.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
  },
  {
    id: "n4",
    type: "reaction",
    title: "Wren Okafor reacted to your message",
    body: "✅ in #general",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    read: true,
  },
];
