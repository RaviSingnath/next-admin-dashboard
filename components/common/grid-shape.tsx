import Image from "next/image";

export default function GridShape() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]"
      >
        <Image
          width={540}
          height={254}
          src="/images/shape/grid-01.svg"
          alt=""
          decoding="async"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]"
      >
        <Image
          width={540}
          height={254}
          src="/images/shape/grid-01.svg"
          alt=""
          decoding="async"
        />
      </div>
    </>
  );
}
