"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { login, signupWithGoogle } from "@/service/authservice";
import { CardDescription, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { UserRole, SessionUser } from "@/utils/types";
import { useAuth } from "@/lib/auth-context";

export function LoginForm({
  onForgotPassword,
}: React.ComponentProps<"div"> & {
  onForgotPassword?: () => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      console.log("login result:", result);
      
      if (result && result.user) {
        // Update auth context
        authLogin(result.user as SessionUser);
        
        // Get the user's role from the session user
        const user = result.user as SessionUser;
        const roleName = user.role;
        
        // Redirect based on role using the new UserRole enum
        if (roleName === UserRole.SUPERADMIN) {
          router.push("/admin");
        } else if (roleName === UserRole.EXHIBITOR || roleName === UserRole.SPONSOR) {
          router.push("/owner");
        } else if (roleName === UserRole.JOBSEEKER || roleName === UserRole.MANNING_AGENCY) {
          router.push("/dashboard");
        } else if (roleName === UserRole.VISITOR) {
          // Visitors might have limited access or need to complete profile
          router.push("/dashboard");
        } else {
          // For users with other roles or no role
          setError("Your account doesn't have access to the system. Please contact an administrator.");
        }
      } else {
        setError("Login successful but user data is missing. Please try again.");
      }
    } catch (err: Error | unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signupWithGoogle();
    // Note: For Google login, you'll need to handle redirects after successful authentication
    // This would typically be done on the callback route from Google OAuth
  };

  return (
    <form className="flex flex-col gap-6 h-fit w-full" onSubmit={handleSubmit}>
      <div>
        <CardTitle className="text-2xl font-bold py-0">Login</CardTitle>
        <CardDescription className="py-0 text-xs">
          Enter your email and password to login to your account.
        </CardDescription>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <User
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-600"
          />
          <Input
            className="rounded-full pl-10"
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <div className="relative">
          <Lock
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-600"
          />
          <Input
            className="rounded-full pl-10"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      {error && <div className="text-sm text-red-500 -mt-2">{error}</div>}
      <div className="flex justify-end items-center mt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-gray-400 hover:text-blue-600"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full rounded-full bg-muted text-accent-foreground transition-colors duration-300 ease-in-out hover:bg-muted-foreground/20"
          disabled={isLoading}
        >
          Login with Google
        </Button>
        
      </div>
    </form>
  );
}

export default LoginForm;