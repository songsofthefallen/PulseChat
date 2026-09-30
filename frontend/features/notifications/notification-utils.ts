import { NotificationItem } from "@/types"

export function getNotificationTitle(type: string) {
  switch (type) {
    case "message":
      return "New message";
    case "mention":
      return "You were mentioned";
    case "reply":
      return "New reply";
    case "reaction":
      return "New reaction";
    case "invite":
      return "New invitation";
    default:
      return "New notification";
  }
}

export function getNotificationBody(notification: NotificationItem) {
  if (notification.type === "message") {
    if (notification.channel_name) {
      return `New message in #${notification.channel_name}`;
    }

    return "You received a new direct message.";
  }

  switch (notification.type) {
    case "mention":
      return "Someone mentioned you.";
    case "reply":
      return "Someone replied to your message.";
    case "reaction":
      return "Someone reacted to your message.";
    case "invite":
      return "You received an invitation.";
    default:
      return "You have a new notification.";
  }
}