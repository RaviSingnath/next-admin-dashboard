/**
 * Event types written to `college_subscription_events`.
 *
 * Payment success/failure is intentionally NOT here — that already lives in
 * `billing_transactions` (via onInvoicePaid/onInvoicePaymentFailed). This
 * table only holds narrative events that current-state columns on
 * `college_subscriptions` can't reconstruct after the fact (plan_id gets
 * overwritten on every update, so "it used to be Starter" is otherwise lost).
 *
 * Keep this in sync with the `event_type` values your webhook handlers
 * actually insert — nothing in Postgres enforces this list unless you add a
 * check constraint (see note at the bottom).
 */
export const SUBSCRIPTION_EVENT_TYPES = {
  COLLEGE_CREATED: "college_created",

  TRIAL_STARTED: "trial_started",
  TRIAL_CONVERTED: "trial_converted",
  TRIAL_ENDED_WITHOUT_CONVERSION: "trial_ended_without_conversion",

  PLAN_UPGRADED: "plan_upgraded",
  PLAN_DOWNGRADED: "plan_downgraded",
  PLAN_CHANGE_SCHEDULED: "plan_change_scheduled",

  CANCELLATION_SCHEDULED: "cancellation_scheduled",
  CANCELLATION_REVERSED: "cancellation_reversed",
  SUBSCRIPTION_ENDED: "subscription_ended",
} as const;

export type SubscriptionEventType =
  (typeof SUBSCRIPTION_EVENT_TYPES)[keyof typeof SUBSCRIPTION_EVENT_TYPES];

/**
 * Display metadata for rendering timeline rows — label, icon (lucide-react
 * name, matching your existing stack), and whether from_plan_id/to_plan_id
 * are expected to be populated for this event type.
 */
export const SUBSCRIPTION_EVENT_DISPLAY: Record<
  SubscriptionEventType,
  { label: string; icon: string; hasPlanChange: boolean }
> = {
  [SUBSCRIPTION_EVENT_TYPES.COLLEGE_CREATED]: {
    label: "College Created",
    icon: "Building2",
    hasPlanChange: false,
  },
  [SUBSCRIPTION_EVENT_TYPES.TRIAL_STARTED]: {
    label: "Trial Started",
    icon: "Rocket",
    hasPlanChange: false,
  },
  [SUBSCRIPTION_EVENT_TYPES.TRIAL_CONVERTED]: {
    label: "Trial Converted",
    icon: "CheckCircle2",
    hasPlanChange: false,
  },
  [SUBSCRIPTION_EVENT_TYPES.TRIAL_ENDED_WITHOUT_CONVERSION]: {
    label: "Trial Ended",
    icon: "TimerOff",
    hasPlanChange: false,
  },
  [SUBSCRIPTION_EVENT_TYPES.PLAN_UPGRADED]: {
    label: "Plan Upgraded",
    icon: "ArrowUpCircle",
    hasPlanChange: true,
  },
  [SUBSCRIPTION_EVENT_TYPES.PLAN_DOWNGRADED]: {
    label: "Plan Downgraded",
    icon: "ArrowDownCircle",
    hasPlanChange: true,
  },
  [SUBSCRIPTION_EVENT_TYPES.PLAN_CHANGE_SCHEDULED]: {
    label: "Plan Change Scheduled",
    icon: "CalendarClock",
    hasPlanChange: true,
  },
  [SUBSCRIPTION_EVENT_TYPES.CANCELLATION_SCHEDULED]: {
    label: "Cancellation Scheduled",
    icon: "AlertCircle",
    hasPlanChange: false,
  },
  [SUBSCRIPTION_EVENT_TYPES.CANCELLATION_REVERSED]: {
    label: "Cancellation Reversed",
    icon: "RotateCcw",
    hasPlanChange: false,
  },
  [SUBSCRIPTION_EVENT_TYPES.SUBSCRIPTION_ENDED]: {
    label: "Subscription Ended",
    icon: "XCircle",
    hasPlanChange: false,
  },
};
