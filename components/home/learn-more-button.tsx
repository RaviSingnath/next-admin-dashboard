"use client";
export default function LearnMoreButton() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <button
      onClick={() => handleScroll("why-our-app")}
      className="text-sm/6 font-semibold text-gray-900 dark:text-white"
    >
      Learn more <span aria-hidden="true">→</span>
    </button>
  );
}
