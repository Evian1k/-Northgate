/**
 * Global UI state store (Zustand).
 * Manages sidebar collapse state, command palette open state, mobile drawer state.
 */
import { create } from "zustand";

interface UIState {
  // Admin sidebar
  adminSidebarCollapsed: boolean;
  toggleAdminSidebar: () => void;

  // Student sidebar
  studentSidebarCollapsed: boolean;
  toggleStudentSidebar: () => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Mobile drawer
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  adminSidebarCollapsed: false,
  toggleAdminSidebar: () =>
    set((s) => ({ adminSidebarCollapsed: !s.adminSidebarCollapsed })),

  studentSidebarCollapsed: false,
  toggleStudentSidebar: () =>
    set((s) => ({ studentSidebarCollapsed: !s.studentSidebarCollapsed })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  mobileDrawerOpen: false,
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
}));
