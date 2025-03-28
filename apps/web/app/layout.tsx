import AuthProvider from "./components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "Opis aplikacji",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="business">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
