import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import VehicleQuotation from "@/pages/vehicle-quotation";
import SearchQuotations from "@/pages/search-quotations";
import VehicleManagement from "@/pages/vehicle-management";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={VehicleQuotation} />
      <Route path="/search" component={SearchQuotations} />
      <Route path="/management" component={VehicleManagement} />
      <Route path="/quotation/:id" component={VehicleQuotation} />
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
