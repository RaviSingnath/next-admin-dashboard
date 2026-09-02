import { cookies } from "next/headers";
import Image from "next/image";

const IMAGES = {
  light: {
    src: "/images/dashboard-screenshot/admin-dashboard.webp",
    width: 3354,
    height: 1724,
  },
  dark: {
    src: "/images/dashboard-screenshot/admin-dashboard-dark.webp",
    width: 3352,
    height: 1742,
  },
} as const;

export default async function HeroDashboardImage() {
  const cookieValue = (await cookies()).get("theme")?.value;
  const theme = cookieValue === "dark" ? "dark" : "light";
  const img = IMAGES[theme];

  return (
    <Image
      key={theme}
      src={img.src}
      alt={`College Diary admin dashboard${theme === "dark" ? " dark" : ""}`}
      width={img.width}
      height={img.height}
      sizes="(max-width: 1024px) calc(100vw - 3rem), 1152px"
      preload
      fetchPriority="high"
      className="mt-12 w-full rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 sm:mt-16"
    />
  );
}
