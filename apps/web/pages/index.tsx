import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div
      style={{
        background: "#121212",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {status === "loading" && <p>Ładowanie...</p>}

      {!session && status !== "loading" && (
        <>
          <h1>Witaj w aplikacji!</h1>
          <p>Zaloguj się, aby kontynuować.</p>
          <button
            onClick={() => signIn("google")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#4285F4",
              color: "#fff",
              marginTop: "20px",
            }}
          >
            Zaloguj się przez Google
          </button>
        </>
      )}

      {session && (
        <>
          <h1>Witaj, {session.user?.name}!</h1>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Avatar"
              style={{
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                margin: "20px 0",
              }}
            />
          )}
          <p>Email: {session.user?.email}</p>
          <button
            onClick={() => signOut()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#E53935",
              color: "#fff",
              marginTop: "20px",
            }}
          >
            Wyloguj się
          </button>
        </>
      )}
    </div>
  );
}
