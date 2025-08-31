import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import DsaLogin from "@/pages/dsa-login";
import DsaDashboard from "@/pages/dsa-dashboard";
import UserLogin from "@/pages/user-login";
import UserDashboard from "@/pages/user-dashboard";
import TermsAndConditions from "@/pages/terms-and-conditions";
import TrackApplication from "@/pages/track-application";
import TrackStatus from "@/pages/track-status";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/dsa" component={DsaLogin} />
      <Route path="/dsa/dashboard" component={DsaDashboard} />
      <Route path="/user" component={UserLogin} />
      <Route path="/user/dashboard" component={UserDashboard} />
      <Route path="/terms" component={TermsAndConditions} />
      <Route path="/track-application" component={TrackApplication} />
      <Route path="/track-status" component={TrackStatus} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
