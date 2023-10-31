import Runtime from "../../../../bindings/bot-runtime";
import { Payload, User, Context } from "../../../../types";

export async function getCollaboratorsForRepo(context: Context): Promise<User[]> {
  const runtime = Runtime.getState();
  const payload = context.event.payload as Payload;
  const collaboratorUsers: User[] = [];

  try {
    let page = 1;
    let shouldFetch = true;

    while (shouldFetch) {
      const res = await context.event.octokit.rest.repos.listCollaborators({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        per_page: 100,
        page: page,
      });

      if (res.data.length > 0) {
        res.data.forEach((collaborator) => collaboratorUsers.push(collaborator as User));
        page++;
      } else {
        shouldFetch = false;
      }
    }
  } catch (e: unknown) {
    runtime.logger.error("Fetching collaborator IDs for repo failed!", e);
  }

  return collaboratorUsers;
}