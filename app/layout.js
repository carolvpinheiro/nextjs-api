import "../styles/globals.css";
import MainLayout from "../components/MainLayout";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

export const metadata = {
  title: "JamJar",
  description: "A workspace for managing projects, tasks, and deadlines.",
};
