"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Inbox, ArrowLeft, Loader2 } from "lucide-react";
import { StudentPageHeader, EmptyState } from "@/components/student/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Msg {
  id: string; subject: string; body: string;
  readAt: string | null; createdAt: string;
  from: string; fromEmail?: string | null;
}

export function MessagesClient({ inbox, sent }: { inbox: Msg[]; sent: { id: string; subject: string; body: string; createdAt: string }[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = React.useState<"inbox" | "sent" | "compose">("inbox");
  const [selected, setSelected] = React.useState<Msg | null>(null);
  const [compose, setCompose] = React.useState({ subject: "", body: "" });
  const [sending, setSending] = React.useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compose),
      });
      if (res.ok) {
        toast({ title: "Message sent!", description: "We'll respond within 24 hours." });
        setCompose({ subject: "", body: "" });
        setTab("sent");
        router.refresh();
      } else {
        toast({ title: "Failed", description: "Try again", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <StudentPageHeader
        title="Messages"
        subtitle="Your inbox and support communications"
        icon={MessageSquare}
        actions={
          <Button onClick={() => { setTab("compose"); setSelected(null); }} size="sm" className="rounded-full gradient-royal text-white">
            <Send className="h-3.5 w-3.5 mr-1.5" /> Compose
          </Button>
        }
      />

      <div className="flex gap-2 mb-6">
        <button onClick={() => { setTab("inbox"); setSelected(null); }} className={`text-xs font-medium px-4 py-2 rounded-full ${tab === "inbox" ? "gradient-royal text-white" : "bg-card border border-border"}`}>Inbox ({inbox.length})</button>
        <button onClick={() => { setTab("sent"); setSelected(null); }} className={`text-xs font-medium px-4 py-2 rounded-full ${tab === "sent" ? "gradient-royal text-white" : "bg-card border border-border"}`}>Sent ({sent.length})</button>
      </div>

      {tab === "compose" ? (
        <form onSubmit={send} className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">To</label>
            <Input value="Administration & Support" disabled className="h-11 bg-muted" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Subject</label>
            <Input required value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} className="h-11" placeholder="How can we help?" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Message</label>
            <textarea
              required rows={6}
              value={compose.body}
              onChange={(e) => setCompose({ ...compose, body: e.target.value })}
              className="w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Type your message…"
            />
          </div>
          <Button type="submit" disabled={sending} className="rounded-full gradient-royal text-white">
            {sending ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Sending…</> : <><Send className="h-4 w-4 mr-1.5" /> Send Message</>}
          </Button>
        </form>
      ) : selected ? (
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </button>
          <h2 className="font-display font-bold text-xl mb-2">{selected.subject}</h2>
          <p className="text-xs text-muted-foreground mb-4">From {selected.from} · {new Date(selected.createdAt).toLocaleString()}</p>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line text-foreground/80 leading-relaxed">{selected.body}</p>
          </div>
        </div>
      ) : tab === "inbox" ? (
        inbox.length === 0 ? (
          <EmptyState title="Inbox is empty" message="No messages yet." icon={Inbox} />
        ) : (
          <div className="space-y-2">
            {inbox.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                onClick={() => setSelected(m)}
                className={`rounded-2xl bg-card border p-4 shadow-soft cursor-pointer hover:shadow-premium transition-all ${
                  !m.readAt ? "border-royal/30 bg-royal/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{m.subject}</p>
                    <p className="text-xs text-muted-foreground">From {m.from} · {new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!m.readAt && <span className="h-2 w-2 rounded-full bg-royal flex-shrink-0" />}
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        sent.length === 0 ? (
          <EmptyState title="No sent messages" message="Messages you send will appear here." icon={Send} />
        ) : (
          <div className="space-y-2">
            {sent.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="rounded-2xl bg-card border border-border p-4 shadow-soft"
              >
                <p className="font-semibold text-sm">{m.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{m.body}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{new Date(m.createdAt).toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
