import { splitProps } from "solid-js";
import { UserProfileData } from "@/lib/schemas/user-profile-schema";
import { Avatar, AvatarProps } from "./avatar";

export interface ProfileAvatarProps extends AvatarProps {
  profile?: UserProfileData;
}

export function ProfileAvatar(props: ProfileAvatarProps) {
  const [, avatarProps] = splitProps(props, ["profile"]);

  return (
    <Avatar
      src={props.profile?.avatarUrl}
      initials={props.profile?.avatarInitials}
      {...avatarProps}
    />
  );
}
