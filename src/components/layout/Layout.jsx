import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTracking } from "@/hooks/useTracking";
import { HeartPulse, LayoutDashboard, Apple, History as HistoryIcon, Settings as SettingsIcon, Shield, LogOut, Moon, Sun, Languages } from "lucide-react";

export default function Layout({ children }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { isLoggedIn } = useTracking();

  // Static/placeholder values
  const userName = "User";
  const theme = "light";
  const lang = "en";

  // Hide sidebar on landing page or when not logged in
  const showSidebar = isLoggedIn && loc.pathname !== "/";

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
    { to: "/foods", label: "Food Database", icon: Apple, testid: "nav-foods" },
    { to: "/history", label: "History", icon: HistoryIcon, testid: "nav-history" },
    { to: "/settings", label: "Settings", icon: SettingsIcon, testid: "nav-settings" },
  ];

  const handleLogout = () => {
    nav("/");
  };

  const handleThemeToggle = () => {
    // Placeholder for theme toggle
  };

  const handleLangToggle = () => {
    // Placeholder for language toggle
  };

  const handleHomeClick = () => {
    if (loc.pathname === "/") {
      // Already on home - scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to home
      nav("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Only show when authenticated and not on landing page */}
      {showSidebar && (
        <aside className="lg:w-64 lg:min-h-screen border-b lg:border-b-0 lg:border-e border-border bg-card flex-shrink-0">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--rs-primary)" }}>
              <HeartPulse className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="font-extrabold text-lg" style={{ fontFamily: "Manrope" }}>RenalSync</div>
              <div className="text-xs text-muted-foreground">{userName}</div>
            </div>
          </div>
          <nav className="px-3 pb-4 space-y-1">
            {items.map((it) => {
              const active = loc.pathname === it.to;
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  data-testid={it.testid}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all ${
                    active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{it.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-border space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleThemeToggle}
                className="flex-1 gap-2 flex items-center justify-center px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                data-testid="theme-toggle"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="ml-1">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
              <button
                onClick={handleLangToggle}
                className="flex-1 gap-2 flex items-center justify-center px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                data-testid="lang-toggle"
              >
                <Languages className="w-4 h-4" />
                <span className="ml-1">{lang === "en" ? "AR" : "EN"}</span>
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="w-full justify-start gap-3 flex items-center px-4 py-2 text-sm rounded-md text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
