import { splitProps } from "solid-js";
import { UserProfile } from "@/features/users/schema/user-profile.schema";
import { Avatar, AvatarProps } from "./avatar";

export interface ProfileAvatarProps extends AvatarProps {
  profile?: UserProfile;
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
