import React from "react";
import { Avatar, AvatarGroup } from "@chakra-ui/react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  bg?: string;
  color?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = "md",
  bg = "caret",
  color = "bg",
}) => {
  return (
    <Avatar.Root size={size} bg={bg} color={color}>
      <Avatar.Fallback>{name?.charAt(0)}</Avatar.Fallback>
      {src && <Avatar.Image src={src} />}
    </Avatar.Root>
  );
};

interface UserAvatarGroupProps {
  users: Array<{
    src?: string | null;
    name?: string | null;
  }>;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  maxCount?: number;
  bg?: string;
  color?: string;
}

export const UserAvatarGroup: React.FC<UserAvatarGroupProps> = ({
  users,
  size = "md",
  maxCount = 3,
  bg = "caret",
  color = "bg",
}) => {
  return (
    <AvatarGroup size={size} maxWidth={maxCount}>
      {users.map((user, index) => (
        <UserAvatar
          key={index}
          src={user.src}
          name={user.name}
          size={size}
          bg={bg}
          color={color}
        />
      ))}
    </AvatarGroup>
  );
};
