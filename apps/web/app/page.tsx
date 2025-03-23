"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./components/Loader";
import { AuthStatus } from "./models/AuthStatus";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === AuthStatus.Authenticated) {
      router.push("/dashboard");
    } else if (status === AuthStatus.Unauthenticated) {
      router.push("/login");
    }
  }, [status, router]);

  return <Loader />;
}
