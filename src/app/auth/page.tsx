"use client";

import { useState } from "react";

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

  // Updated toggle functions for specific form transitions
  const showLoginForm = () => setActiveForm("login");
  const showResetForm = () => setActiveForm("reset");
  const showRegisterForm = () => setActiveForm("register");

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
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
                <LoginForm onForgotPassword={showResetForm} />
              )}
              {activeForm === "reset" && (
                <ResetPasswordForm onBackToLogin={showLoginForm} />
              )}
              {activeForm === "register" && <RegisterForm />}

              {/* Conditional footer links */}
              <div className="mt-6 text-center">
                {activeForm === "login" && (
                  <button
                    type="button"
                    onClick={showRegisterForm}
                    className="text-sm text-gray-500 hover:text-green-500"
                  >
                    Do not have an account? Sign up
                  </button>
                )}

                {activeForm === "register" && (
                  <button
                    type="button"
                    onClick={showLoginForm}
                    className="text-sm text-gray-500 hover:text-green-500"
                  >
                    Already have an account? Log in
                  </button>
                )}

                {activeForm === "reset" && (
                  <button
                    type="button"
                    onClick={showLoginForm}
                    className="text-sm text-gray-500 hover:text-green-500"
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
            <DesignLogin animation={activeForm === "register" ? "radar" : "submarine"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthTemplate;
