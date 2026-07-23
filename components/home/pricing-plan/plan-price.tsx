export default function PlanPrice() {
  return (
    <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
      <div className="rounded-2xl bg-gray-50 py-10 text-center inset-ring inset-ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16 dark:bg-gray-900 dark:inset-ring-white/10">
        <div className="mx-auto max-w-xs px-8">
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
            Pay once, built for your institution
          </p>
          <p className="mt-6 flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Custom
            </span>
          </p>
          <a
            href="#"
            className="mt-10 block w-full rounded-md bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:bg-brand-500 dark:shadow-none dark:hover:bg-brand-400 dark:focus-visible:outline-brand-500"
          >
            Book a Demo
          </a>
          <p className="mt-6 text-xs/5 text-gray-600 dark:text-gray-400">
            Invoices and receipts available for easy institutional reimbursement
          </p>
        </div>
      </div>
    </div>
  );
}
