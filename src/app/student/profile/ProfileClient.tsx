"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, IdCard, Users, Save, Loader2, CheckCircle2 } from "lucide-react";
import { StudentPageHeader } from "@/components/student/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  name: string; email: string; phone: string; admissionNo: string;
  gender: string; dateOfBirth: string; nationality: string; idNumber: string;
  address: string; nextOfKin: string; nextOfKinPhone: string;
  profileImageUrl?: string | null; profileComplete: number;
  programme: string; year: number; semester: number;
  enrollmentDate: string; hostel: { room: string; name: string } | null;
}

export function ProfileClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    phone: profile.phone, address: profile.address, gender: profile.gender,
    nationality: profile.nationality, nextOfKin: profile.nextOfKin, nextOfKinPhone: profile.nextOfKinPhone,
  });
  const [saving, setSaving] = React.useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Profile updated!", description: `Profile is now ${data.profileComplete}% complete.` });
        router.refresh();
      } else {
        toast({ title: "Failed", description: "Try again", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Full Name", value: profile.name, icon: User, editable: false },
    { label: "Email", value: profile.email, icon: Mail, editable: false },
    { label: "Admission No.", value: profile.admissionNo, icon: IdCard, editable: false },
    { label: "Programme", value: profile.programme, icon: User, editable: false },
    { label: "Year / Semester", value: `Year ${profile.year} · Semester ${profile.semester}`, icon: Calendar, editable: false },
    { label: "Enrolled", value: new Date(profile.enrollmentDate).toLocaleDateString(), icon: Calendar, editable: false },
    ...(profile.hostel ? [{ label: "Hostel", value: `${profile.hostel.name} · Room ${profile.hostel.room}`, icon: MapPin, editable: false }] : []),
  ];

  return (
    <div>
      <StudentPageHeader title="Profile" subtitle="View and update your personal information" icon={User} />

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-card border border-border p-6 shadow-soft mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-24 w-24 rounded-3xl overflow-hidden ring-4 ring-royal/20 flex-shrink-0">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center gradient-royal text-white font-display font-bold text-3xl">
                {profile.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-gold mt-1 font-medium">{profile.programme}</p>
          </div>
          <div className="text-center">
            <div className="relative h-20 w-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                  className="text-emerald-500"
                  strokeDasharray={2 * Math.PI * 40}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 - (profile.profileComplete / 100) * 2 * Math.PI * 40 }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display font-bold text-lg">{profile.profileComplete}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Complete</p>
          </div>
        </div>
      </motion.div>

      {/* Read-only info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {fields.map((f, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-4 shadow-soft">
            <f.icon className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{f.label}</p>
            <p className="font-semibold text-sm mt-0.5 truncate">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Editable form */}
      <form onSubmit={save} className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-5">
        <h3 className="font-display font-bold text-lg">Editable Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" icon={Phone}>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" placeholder="+254 700 000 000" />
          </Field>
          <Field label="Gender" icon={User}>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm">
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="Nationality" icon={MapPin}>
            <Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="h-11" placeholder="Kenyan" />
          </Field>
          <Field label="Address" icon={MapPin}>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-11" placeholder="Nairobi, Kenya" />
          </Field>
          <Field label="Next of Kin" icon={Users}>
            <Input value={form.nextOfKin} onChange={(e) => setForm({ ...form, nextOfKin: e.target.value })} className="h-11" placeholder="Parent/Guardian name" />
          </Field>
          <Field label="Next of Kin Phone" icon={Phone}>
            <Input value={form.nextOfKinPhone} onChange={(e) => setForm({ ...form, nextOfKinPhone: e.target.value })} className="h-11" placeholder="+254 700 000 000" />
          </Field>
        </div>
        <Button type="submit" disabled={saving} className="rounded-full gradient-royal text-white">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Saving…</> : <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </label>
      {children}
    </div>
  );
}
