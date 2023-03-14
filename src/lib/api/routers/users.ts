import { UserProfileData } from "~/lib/schemas/users/user-profile-schema";
import { recursivelyCamelize } from "~/lib/util/util";
import { protectedProcedure, router } from "../trpc";

export const usersRouter = router({
  findUsersWithRoles: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    return supabase
      .from("user_profiles")
      .select(
        `
          id,
          full_name,
          roles:application_roles!application_users(
            id,
            name,
            description
          )
        `
      )
      .then((result) => ({
        ...result,
        data: recursivelyCamelize<UserProfileData[] | null>(result.data),
      }));
  }),
});
