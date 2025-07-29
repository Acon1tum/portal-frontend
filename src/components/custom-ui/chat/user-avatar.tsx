import { FC } from "react";
import { User, UserStatus } from "@/utils/types";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  status?: UserStatus;
}

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  size = "md",
  showStatus = false,
  status = UserStatus.OFFLINE,
}) => {
  if (!user) return null;

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8 text-sm";
      case "lg":
        return "w-14 h-14 text-xl";
      default:
        return "w-10 h-10 text-base";
    }
  };

  const getStatusColorClass = () => {
    switch (status) {
      case UserStatus.ONLINE:
        return "bg-chart-5";
      case UserStatus.AWAY:
        return "bg-chart-4";
      case UserStatus.BUSY:
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  const getStatusSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-2 h-2";
      case "lg":
        return "w-4 h-4";
      default:
        return "w-3 h-3";
    }
  };

  return (
    <div className="relative">
      {user.business?.logo ? (
        <div className={`${getSizeClass()} rounded-full overflow-hidden`}>
          <img
            src={user.business.logo}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={`${getSizeClass()} rounded-full bg-gradient-to-r from-chart-1 to-chart-3 flex items-center justify-center text-card-foreground font-semibold`}
        >
          {user.name.charAt(0)}
        </div>
      )}
      {showStatus && (
        <div
          className={`absolute bottom-0 right-0 ${getStatusSizeClass()} ${getStatusColorClass()} rounded-full border-2 border-background`}
        ></div>
      )}
    </div>
  );
};

export default UserAvatar;