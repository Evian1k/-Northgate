"use client";

import { motion } from "framer-motion";
import { Building2, BedDouble, Users, Calendar, Home, Wrench, Phone } from "lucide-react";
import { StudentPageHeader, EmptyState, StatCard } from "@/components/student/ui";

interface Allocation {
  roomNo: string;
  allocatedAt: string;
  hostel: { name: string; block: string; capacity: number; occupied: number };
}

export function HostelClient({ allocation }: { allocation: Allocation | null }) {
  if (!allocation) {
    return (
      <div>
        <StudentPageHeader title="Hostel" subtitle="Your accommodation details" icon={Building2} />
        <EmptyState
          title="No hostel allocation"
          message="You don't have a hostel allocation. Contact the accommodation office to apply."
          icon={Home}
        />
      </div>
    );
  }

  const occupancyRate = Math.round((allocation.hostel.occupied / allocation.hostel.capacity) * 100);

  return (
    <div>
      <StudentPageHeader title="Hostel" subtitle="Your accommodation details" icon={Building2} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden mb-6"
      >
        <div className="gradient-royal p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-white/15 backdrop-blur-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl">{allocation.hostel.name}</h2>
                <p className="text-white/70 text-sm">Block {allocation.hostel.block}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="grid place-items-center h-16 w-16 rounded-2xl bg-gold/10">
              <BedDouble className="h-8 w-8 text-gold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Your Room</p>
              <p className="font-display font-bold text-3xl">{allocation.roomNo}</p>
              <p className="text-xs text-muted-foreground mt-1">Allocated on {new Date(allocation.allocatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Capacity" value={allocation.hostel.capacity} icon={Users} />
            <StatCard label="Occupied" value={allocation.hostel.occupied} icon={BedDouble} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-950/40" />
            <StatCard label="Occupancy" value={`${occupancyRate}%`} icon={Building2} color="text-purple-600" bg="bg-purple-100 dark:bg-purple-950/40" />
          </div>
        </div>
      </motion.div>

      {/* Quick info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-base mb-3">Hostel Rules</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Quiet hours: 10 PM – 6 AM</li>
            <li>• Visitors allowed until 9 PM only</li>
            <li>• No cooking in rooms (use common kitchen)</li>
            <li>• Report maintenance issues promptly</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-base mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted hover:bg-muted/70 text-sm font-medium transition-colors">
              <Wrench className="h-4 w-4 text-gold" /> Report Maintenance Issue
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted hover:bg-muted/70 text-sm font-medium transition-colors">
              <Phone className="h-4 w-4 text-gold" /> Contact Warden
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted hover:bg-muted/70 text-sm font-medium transition-colors">
              <Calendar className="h-4 w-4 text-gold" /> View Hostel Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
