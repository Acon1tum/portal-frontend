"use client";

import { useState } from "react";
import Lottie from "lottie-react";
import steuerradAnimation from "../../../public/Steuerrad.json";

import DesignLogin from "@/components/custom-ui/auth/DesignLeft";
import LoginForm from "@/components/custom-ui/auth/Login";
import ResetPasswordForm from "@/components/custom-ui/auth/ResetPassword";
import RegisterForm from "@/components/custom-ui/auth/Register";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define form type to track which form is currently active
type FormType = "login" | "reset" | "register";

export function AuthTemplate({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Change from boolean to string to handle three form states
  const [activeForm, setActiveForm] = useState<FormType>("login");
  const [isLoading, setIsLoading] = useState(false);

  // Updated toggle functions for specific form transitions
  const showLoginForm = () => setActiveForm("login");
  const showResetForm = () => setActiveForm("reset");
  const showRegisterForm = () => setActiveForm("register");

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      {/* Full-screen loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4">
              <Lottie
                animationData={steuerradAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
              />
            </div>
            <p className="text-white text-lg font-semibold">Processing...</p>
            <p className="text-white/70 text-sm mt-2">Please wait while we authenticate your request</p>
          </div>
        </div>
      )}

      <Card className="overflow-hidden rounded-xl py-0">
        <CardContent className="p-0 flex flex-row-reverse w-[70dvw] h-[80dvh] relative">
          {/* Right Side with sliding animation */}
          <div className={cn(
            "p-6 md:p-8 w-[50%] h-full justify-center items-center flex transition-transform duration-500 ease-in-out",
            activeForm === "register" ? "transform translate-x-[-108%]" : "transform translate-x-0"
          )}>
            <div className="w-full max-w-md">
              {/* Render the appropriate form based on activeForm state */}
              {activeForm === "login" && (
                <LoginForm 
                  onForgotPassword={showResetForm} 
                  onLoadingChange={handleLoadingChange}
                />
              )}
              {activeForm === "reset" && (
                <ResetPasswordForm 
                  onBackToLogin={showLoginForm} 
                  onLoadingChange={handleLoadingChange}
                />
              )}
              {activeForm === "register" && (
                <RegisterForm 
                  onLoadingChange={handleLoadingChange}
                />
              )}

              {/* Conditional footer links */}
              <div className="mt-6 text-center">
                {activeForm === "login" && (
                  <button
                    type="button"
                    onClick={showRegisterForm}
                    className="text-sm text-gray-500 hover:text-green-500"
                    disabled={isLoading}
                  >
                    Do not have an account? Sign up
                  </button>
                )}

                {activeForm === "register" && (
                  <button
                    type="button"
                    onClick={showLoginForm}
                    className="text-sm text-gray-500 hover:text-green-500"
                    disabled={isLoading}
                  >
                    Already have an account? Log in
                  </button>
                )}

                {activeForm === "reset" && (
                  <button
                    type="button"
                    onClick={showLoginForm}
                    className="text-sm text-gray-500 hover:text-green-500"
                    disabled={isLoading}
                  >
                    Back to login
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Left side design with sliding animation and conditional animation */}
          <div className={cn(
            "transition-transform duration-500 ease-in-out",
            activeForm === "register" ? "transform translate-x-[91%]" : "transform translate-x-0"
          )}>
            <DesignLogin 
              animation={activeForm === "register" ? "radar" : "submarine"} 
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthTemplate;
