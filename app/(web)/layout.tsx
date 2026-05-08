import "./web.css";
import { WebNav } from "@/components/web/WebNav";
import { AuthProvider } from "@/components/web/AuthProvider";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="web-app">
        <WebNav />
        <main className="web-main">{children}</main>
      </div>
    </AuthProvider>
  );
}
