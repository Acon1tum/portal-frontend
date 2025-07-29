"use client";

import Image from "next/image";

const DesignLogin = () => {
  return (
    <div className="hidden md:block w-full h-full">
      <div className="w-full h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/60 not-dark:block hidden z-10" />
        <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-20">
          <h1 className="text-white text-5xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">B2B Software</h1>
            <h2 className="text-white text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Quanby Solutions Inc.</h2>
        </div>
        <Image
          src="/retro.png"
          alt="Background Image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default DesignLogin;
