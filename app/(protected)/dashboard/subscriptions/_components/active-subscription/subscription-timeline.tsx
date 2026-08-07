import {
  Building2,
  CreditCard,
  Rocket,
  ArrowUpCircle,
  RotateCw,
  CircleCheckBig,
  LucideIcon,
  ArrowDownCircle,
} from "lucide-react";

const timelines: {
  title: string;
  description: string;
  date: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Secound Payment",
    description: "Starter Plan • $29",
    date: "Aug 06, 2026",
    icon: CreditCard,
  },
  {
    title: "Plan Downgraded",
    description: "Professional → Starter",
    date: "Aug 06, 2026",
    icon: ArrowDownCircle,
  },
  {
    title: "First Payment",
    description: "Professional Plan • $79",
    date: "Aug 05, 2026",
    icon: CreditCard,
  },
  {
    title: "Plan Upgraded",
    description: "Starter → Professional",
    date: "Aug 05, 2026",
    icon: ArrowUpCircle,
  },
  {
    title: "Trial Started",
    description: "14-day free trial",
    date: "Jul 20, 2026",
    icon: Rocket,
  },
  {
    title: "College Created",
    description: "MIT College workspace",
    date: "Jul 20, 2026",
    icon: Building2,
  },
];

export default function SubscriptionTimeline() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Timeline
        </h3>

        <p className="mt-1 text-sm text-gray-500">Subscription activity</p>
      </div>

      <div className="max-h-[430px] overflow-y-auto pr-4 mx-auto">
        {timelines.map((event, index) => {
          const Icon = event.icon;

          return (
            <div
              key={`${event.title}-${event.date}`}
              className="grid grid-cols-[90px_40px_1fr] gap-4 pb-8"
            >
              {/* Date */}
              <div className="pt-1 text-right">
                <p className="text-xs font-medium text-gray-500">
                  {event.date}
                </p>
              </div>

              {/* Timeline */}
              <div className="relative flex justify-center">
                {index !== timelines.length - 1 && (
                  <div className="absolute top-9 h-full w-px bg-gray-200 dark:bg-gray-700" />
                )}

                <div className="bg-brand-500 relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-white">
                  <Icon size={16} />
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
