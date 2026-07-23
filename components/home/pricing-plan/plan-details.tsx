import { Check } from "lucide-react";

export default function PlanDetails() {
  return (
    <div className="p-8 sm:p-10 lg:flex-auto">
      <h3 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Custom Plan
      </h3>
      <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-300">
        Built for large university networks and government institutions that
        need a tailored solution. We&apos;ll work directly with your team to
        configure College Diary exactly the way you need it.
      </p>
      <div className="mt-10 flex items-center gap-x-4">
        <h4 className="flex-none text-sm/6 font-semibold text-brand-600 dark:text-brand-400">
          What’s included
        </h4>
        <div className="h-px flex-auto bg-gray-100 dark:bg-white/10"></div>
      </div>
      <ul
        role="list"
        className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6 dark:text-gray-300"
      >
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
          Unlimited colleges & departments
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
          Dedicated account manager
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
          Custom onboarding & training
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
          Priority 24/7 support
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
          Custom integrations & API access
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
          On-premise or cloud deployment
        </li>
      </ul>
    </div>
  );
}
