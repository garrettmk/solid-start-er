import { Button } from "~/components/buttons/button";
import { Drawer } from "~/components/drawers/drawer";
import { XMarkIcon } from "~/components/icons/x-mark";
import { createToggle } from "~/lib/util/create-toggle";

export function ProfilePage() {
  const isOpen = createToggle(false);

  return (
    <div>
      Welcome to your profile
      <Button onClick={isOpen.toggle}>Show Drawer</Button>
      <Drawer placement="right" isOpen={isOpen.value}>
        Hello
        <Button onClick={isOpen.off}>
          <XMarkIcon />
        </Button>
      </Drawer>
    </div>
  );
}

export default ProfilePage;
