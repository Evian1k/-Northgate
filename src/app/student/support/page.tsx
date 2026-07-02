import { LifeBuoy, Mail, Phone, MessageSquare, BookOpen, Bug } from "lucide-react";
import { StudentPageHeader } from "@/components/student/ui";
import { SupportClient } from "./SupportClient";

export const dynamic = "force-dynamic";

export default function SupportPage() {
  const channels = [
    { icon: Mail, label: "Email Support", value: "support@northgate.ac.ke", href: "mailto:support@northgate.ac.ke", desc: "Response within 24 hours" },
    { icon: Phone, label: "Call IT Helpdesk", value: "+254 700 000 000", href: "tel:+254700000000", desc: "Mon–Fri, 8 AM – 5 PM EAT" },
    { icon: MessageSquare, label: "Live Chat", value: "Start a conversation", href: "#", desc: "Quick questions during office hours" },
  ];

  const resources = [
    { icon: BookOpen, label: "Student Handbook", desc: "Complete guide to policies and procedures" },
    { icon: BookOpen, label: "FAQ", desc: "Frequently asked questions and answers" },
    { icon: BookOpen, label: "Video Tutorials", desc: "Learn how to use the portal" },
    { icon: Bug, label: "Report a Bug", desc: "Found an issue? Let us know" },
  ];

  return (
    <div>
      <StudentPageHeader title="Support" subtitle="We're here to help" icon={LifeBuoy} />
      <SupportClient channels={channels} resources={resources} />
    </div>
  );
}
