// /app/main/page.tsx
import { redirect } from "next/navigation";

export default function MainPage() {
  redirect("/main");
  return null;
}