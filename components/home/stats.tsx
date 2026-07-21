import Counter from "./Counter";

export default function Stats() {
  return (
    <div className="bg-white py-24 sm:py-32 w-full dark:bg-gray-900 bg-linear-180 from-[#fff6e9] from-0% via-white to-white rounded-t-[50px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
              Trusted by creators worldwide
            </h2>
            <p className="mt-4 text-lg/8 text-gray-600 dark:text-gray-300">
              From small colleges to large universities — College Diary handles
              the complexity so you don't have to.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
              <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                Creators on the platform
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                <Counter value={8000} duration={1} />+
              </dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
              <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                Flat platform fee
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                <Counter value={3} duration={0.5} />%
              </dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
              <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                Uptime guarantee
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                <Counter value={99} duration={1} />%
              </dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
              <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                Paid out to creators
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                $<Counter value={7} duration={0.5} />M
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
