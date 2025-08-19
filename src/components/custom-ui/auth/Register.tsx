"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CardDescription, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Mail, Lock } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { signupWithEmailAndPassword } from "@/service/authservice";


// Import your registration service function here
// import { register } from "@/app/service/authservice";


export function RegisterForm({
  onLogin,
  onLoadingChange,
  ...props
}: React.ComponentProps<"div"> & {
  onLogin?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    onLoadingChange?.(true); // Trigger full-screen loading
    
    try {
      const { message } = await signupWithEmailAndPassword(email, password);
      alert(message);
      // Optionally switch to login form or route to login page
      if (onLogin) {
        onLogin();
      } else {
        router.push("/");
      }
      // Loading screen will stay visible during navigation
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
      onLoadingChange?.(false); // Only hide loading on error
    }
    // Removed finally block - loading stays visible on success
  };


  return (
    <form className="flex flex-col gap-6 h-fit w-full" onSubmit={handleSubmit}>
      <div>
        <CardTitle className="text-2xl font-bold py-0">Register</CardTitle>

        <CardDescription className="py-0 text-xs">
          Create a new account to get started.
        </CardDescription>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-email">Email</Label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-green-500"
          />
          <Input
            className="rounded-full pl-10"
            id="register-email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-password">Password</Label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-green-500"
          />
          <Input
            className="rounded-full pl-10"
            id="register-password"
            type="password"
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-green-500"
          />
          <Input
            className="rounded-full pl-10"
            id="register-confirm-password"
            type="password"
            placeholder="Confirm your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="flex flex-col gap-4 mt-4">
        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white hover:opacity-90 transition-opacity"
          disabled={loading}
        >
           {loading ? "Creating..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
