import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
export default function CAT() {
  return (
    <div className="bg-brand-700/80 w-full">
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            One platform to run your entire college, end to end.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-brand-200">
            No more scattered spreadsheets, manual fee tracking, or uncontrolled
            access. College Diary brings every role, department, and payment
            under one secure roof — so you can focus on education, not
            administration.
          </p>
          <div className="mt-10 max-w-md mx-auto grid grid-cols-3 items-center justify-center gap-x-6  bg-white rounded-sm p-2">
            <span className="col-span-2">
              <Input
                className="bg-white border-0 focus:border-0 focus:ring-transparent"
                placeholder="Your college email address*"
              />
            </span>
            <Button className="rounded-md col-span-1 bg-brand-700/80 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-600/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:shadow-none">
              {" "}
              Book a Demo{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
