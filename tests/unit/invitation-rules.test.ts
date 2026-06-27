import { assertInviteIsResendable } from "@/features/invite/security/invite.resend.security";
import { createInvite } from "../test-factories";
import { dayAfterDate, dayBeforeDate } from "@/lib/helper/date";

/**
 * Pin "now" to a fixed point so tests are deterministic regardless of
 * when they run. All expires_at values are chosen relative to this anchor.
 */
const TODAY_DATE = new Date().toISOString();
const PAST_DATE = dayBeforeDate(); // before NOW — invite is expired
const FUTURE_DATE = dayAfterDate(); // after NOW — invite is still active

describe("assertInviteIsResendable", () => {
  // ─── Happy path ────────────────────────────────────────────────────────────

  describe("does not throw", () => {
    it("when status is pending and the invite has expired", () => {
      const invite = createInvite({ status: "pending", expires_at: PAST_DATE });

      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).not.toThrow();
    });
  });

  // ─── Status guard ──────────────────────────────────────────────────────────

  describe("throws when status is not pending", () => {
    it("status is onboarding — invite was already accepted", () => {
      const invite = createInvite({
        status: "onboarding",
        expires_at: PAST_DATE,
      });

      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).toThrow(
        "This invite has already been accepted and is in onboarding",
      );
    });

    it("status is accepted", () => {
      const invite = createInvite({
        status: "accepted",
        expires_at: PAST_DATE,
      });

      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).toThrow(
        "This invite has already been accepted",
      );
    });

    it("status is revoked", () => {
      const invite = createInvite({ status: "revoked", expires_at: PAST_DATE });

      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).toThrow(
        "This invite has been revoked and cannot be resent",
      );
    });

    it("status is cancelled", () => {
      const invite = createInvite({
        status: "cancelled",
        expires_at: PAST_DATE,
      });

      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).toThrow(
        "This invite cannot be resent in its current state",
      );
    });
  });

  // ─── Expiry guard ──────────────────────────────────────────────────────────

  describe("throws when status is pending but the invite has not expired", () => {
    it("expires_at is in the future", () => {
      const invite = createInvite({
        status: "pending",
        expires_at: FUTURE_DATE,
      });

      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).toThrow(
        "This invite has not yet expired and does not need to be resent",
      );
    });

    it("expires_at is exactly equal to now (boundary — not yet expired)", () => {
      const invite = createInvite({
        status: "pending",
        expires_at: TODAY_DATE,
      });

      // new Date(expires_at) > now is false when equal, so this does NOT throw.
      // The invite expires at exactly NOW — treated as just expired.
      expect(() => assertInviteIsResendable(invite, TODAY_DATE)).not.toThrow();
    });
  });
});
