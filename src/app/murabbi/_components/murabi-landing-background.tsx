"use client";

import Image from "next/image";

export function MurabiLandingBackground() {
  return (
    <div className="fixed inset-0 z-10 overflow-hidden bg-[#062f2d]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,83,78,0.6),rgba(6,47,45,0)_34%),radial-gradient(circle_at_50%_100%,rgba(19,143,132,0.34),rgba(6,47,45,0)_28%)]" />
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.8)_0_1px,transparent_2px),radial-gradient(circle_at_16%_42%,rgba(255,255,255,0.45)_0_1px,transparent_2px),radial-gradient(circle_at_27%_12%,rgba(255,255,255,0.55)_0_1px,transparent_2px),radial-gradient(circle_at_38%_30%,rgba(255,255,255,0.5)_0_1px,transparent_2px),radial-gradient(circle_at_62%_20%,rgba(255,255,255,0.6)_0_1px,transparent_2px),radial-gradient(circle_at_72%_42%,rgba(255,255,255,0.45)_0_1px,transparent_2px),radial-gradient(circle_at_84%_16%,rgba(255,255,255,0.75)_0_1px,transparent_2px),radial-gradient(circle_at_92%_36%,rgba(255,255,255,0.5)_0_1px,transparent_2px)]" />

      <Image
        src="/assets/murobbi/top.png"
        width={1470}
        height={258}
        alt=""
        priority
        className="absolute left-1/2 top-0 w-[min(74rem,76vw)] -translate-x-1/2 object-contain max-md:w-[98vw]"
      />

      <Image
        src="/assets/murobbi/lamp-left-right.png"
        width={504}
        height={272}
        alt=""
        priority
        className="absolute left-0 top-0 w-[22rem] object-contain max-lg:w-[17rem] max-md:-left-24 max-md:w-[15rem]"
      />
      <Image
        src="/assets/murobbi/lamp-left-right.png"
        width={504}
        height={272}
        alt=""
        priority
        className="absolute right-0 top-0 w-[22rem] scale-x-[-1] object-contain max-lg:w-[17rem] max-md:-right-24 max-md:w-[15rem]"
      />

      <Image
        src="/assets/murobbi/gebyar.png"
        width={745}
        height={152}
        alt=""
        priority
        className="absolute left-1/2 top-[9.5rem] w-[min(40rem,58vw)] -translate-x-1/2 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)] max-lg:top-[7.5rem] max-md:top-[5.25rem] max-md:w-[8    8vw]"
      />

      <Image
        src="/assets/murobbi/ornament-bottom-left-right.png"
        width={113}
        height={627}
        alt=""
        className="absolute bottom-0 left-0 h-[61vh] w-auto object-contain max-lg:h-[48vh] max-md:h-[34vh]"
      />
      <Image
        src="/assets/murobbi/ornament-bottom-left-right.png"
        width={113}
        height={627}
        alt=""
        className="absolute bottom-0 right-0 h-[61vh] w-auto scale-x-[-1] object-contain max-lg:h-[48vh] max-md:h-[34vh]"
      />
      <Image
        src="/assets/murobbi/bottom-ornament.png"
        width={671}
        height={218}
        alt=""
        className="absolute bottom-0 left-1/2 w-[min(34rem,48vw)] -translate-x-1/2 object-contain max-md:w-[76vw]"
      />
    </div>
  );
}
