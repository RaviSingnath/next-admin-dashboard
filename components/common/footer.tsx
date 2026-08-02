import Image from "next/image";
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/RaviSingnath",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ravi-singhnath-1bbb3780",
    icon: FaLinkedin,
  },
  {
    name: "X",
    href: "#",
    icon: FaXTwitter,
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-white pt-16 pb-20">
      {/* Transition from CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(45,114,162,0.12),transparent_70%)]"
      />

      {/* Decorative glow */}
      <div
        aria-hidden
        className="bg-brand-500/10 pointer-events-none absolute bottom-6 left-1/2 h-44 w-[900px] -translate-x-1/2 rounded-full blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between lg:items-center">
          <div>
            <Image
              src="/images/logo/logo.svg"
              alt="College Diary"
              width={140}
              height={40}
              className="h-10 w-auto transition-transform duration-300 hover:scale-[1.03]"
            />

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-600">
              Manage students, fees, departments and communication from one
              place.
            </p>
          </div>

          <div>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="group hover:border-brand-200 hover:text-brand-600 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-gray-500 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              © 2026 College Diary. All rights reserved.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Decorative Text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-5.5rem] flex justify-center overflow-hidden"
      >
        <span className="from-brand-500/[0.07] via-brand-500/[0.035] bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_top,transparent,black_35%)] bg-clip-text text-[clamp(9rem,24vw,22rem)] font-black tracking-[-0.08em] whitespace-nowrap text-transparent">
          College Diary
        </span>
      </div>
    </footer>
  );
}
