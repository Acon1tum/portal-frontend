import { User } from "@/utils/types";

export const navigateToChatWithUser = (user: User, router: any) => {
  const chatUrl = `/owner/chat?user=${encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name || "Unknown User",
    email: user.email,
    role: user.role,
    userType: user.userType
  }))}`;
  router.push(chatUrl);
};
