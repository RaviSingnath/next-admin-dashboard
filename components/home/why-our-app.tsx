import OurAppFeatures from "./pricing-plan/our-app-features";

export default function WhyOurApp() {
  return (
    <div className="overflow-hidden min-h-screen w-full bg-white py-24 sm:py-32 dark:bg-gray-900 bg-linear-180 from-brand-200 from-0% via-white to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto lg:mx-0">
          <h2 className="text-base/7 font-semibold text-brand-600 dark:text-brand-400">
            Why College Diary?
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Everything your college needs, managed in one place
          </p>
          <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
            From student enrollment to tuition payments, College Diary gives
            every role — admin, supervisor, and student — exactly the tools they
            need, with enterprise-grade security built in from day one.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus-visible:outline-brand-500"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
      <OurAppFeatures />
    </div>
  );
}
