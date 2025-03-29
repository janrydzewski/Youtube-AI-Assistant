import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseAuthRedirectOptions {
  redirectIfUnauthenticated?: boolean;

  redirectIfAuthenticated?: boolean;

  redirectTo: string;
}

export function useAuthRedirect({
  redirectIfUnauthenticated = false,
  redirectIfAuthenticated = false,
  redirectTo,
}: UseAuthRedirectOptions) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      (redirectIfUnauthenticated && status !== "loading" && !session) ||
      (redirectIfAuthenticated && status === "authenticated")
    ) {
      router.push(redirectTo);
    }
  }, [
    session,
    status,
    redirectIfUnauthenticated,
    redirectIfAuthenticated,
    redirectTo,
    router,
  ]);

  return { session, status };
}
