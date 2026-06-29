import DeleteInviteButton from "../components/invite-actions/delete/delete-invite-button";
import ResendInviteButton from "../components/invite-actions/resend/resend-invite-button";
import RevokeInviteButton from "../components/invite-actions/revoke-invite-button";
import ViewUserButton from "../components/invite-actions/view-user-button";

export const inviteActionRegistry = {
  resend: ResendInviteButton,
  revoke: RevokeInviteButton,
  delete: DeleteInviteButton,
  view: ViewUserButton,
};
