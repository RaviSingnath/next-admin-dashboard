import StatsCardList from "./stats-card-list";

export default function Stats() {
  return (
    <div className="w-full rounded-t-[50px] bg-white bg-linear-180 from-[#fff6e9] from-0% via-white to-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
              Trusted by institutions worldwide
            </h2>
            <p className="mt-4 text-lg/8 text-gray-600 dark:text-gray-300">
              From small colleges to large universities — College Diary handles
              the complexity so you don&apos;t have to.
            </p>
          </div>
          <StatsCardList />
        </div>
      </div>
    </div>
  );
}
