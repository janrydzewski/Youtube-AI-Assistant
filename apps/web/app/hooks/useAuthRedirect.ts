import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = (redirectTo: string) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace(redirectTo);
    }
  }, [session, router, redirectTo]);
};
