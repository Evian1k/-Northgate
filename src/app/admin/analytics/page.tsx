export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return (
    <div className="rounded-3xl bg-card border border-border p-12 text-center">
      <h2 className="font-display font-bold text-2xl mb-2">Analytics</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Detailed analytics dashboards will appear here. Connect Google Analytics, Mixpanel, or Plausible
        via environment variables to enable visitor tracking, conversion funnels, and traffic sources.
      </p>
    </div>
  );
}
