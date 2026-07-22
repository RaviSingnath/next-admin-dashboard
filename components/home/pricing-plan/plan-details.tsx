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
        <h4 className="flex-none text-sm/6 font-semibold text-indigo-600 dark:text-indigo-400">
          What’s included
        </h4>
        <div className="h-px flex-auto bg-gray-100 dark:bg-white/10"></div>
      </div>
      <ul
        role="list"
        className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6 dark:text-gray-300"
      >
        <li className="flex gap-x-3">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          Unlimited colleges & departments
        </li>
        <li className="flex gap-x-3">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          Dedicated account manager
        </li>
        <li className="flex gap-x-3">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          Custom onboarding & training
        </li>
        <li className="flex gap-x-3">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          Priority 24/7 support
        </li>
        <li className="flex gap-x-3">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          Custom integrations & API access
        </li>
        <li className="flex gap-x-3">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          On-premise or cloud deployment
        </li>
      </ul>
    </div>
  );
}
