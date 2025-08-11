"use client";

import Lottie from "lottie-react";
import submarineAnimation from "../../../../public/shipping.json";
import radarAnimation from "../../../../public/Radar.json";
import { useTheme } from "next-themes";

interface DesignLoginProps {
  animation?: "submarine" | "radar";
}

const DesignLogin = ({ animation = "submarine" }: DesignLoginProps) => {
  const { theme } = useTheme();
  const animationData = animation === "radar" ? radarAnimation : submarineAnimation;

  return (
    <div className="hidden md:block w-full h-full">
      <div className="w-full h-full relative overflow-hidden">
        {theme === "dark" && (
          <div className="absolute inset-0 bg-blue-600/0 z-10" />
        )}
        <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-20">
          <h1 className="text-white text-5xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">Marino Portal</h1>
            <h2 className="text-white text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Quanby Solutions Inc.</h2>
        </div>
        <Lottie
          animationData={animationData}
          className="w-full h-full object-cover -mt-10"
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default DesignLogin;
