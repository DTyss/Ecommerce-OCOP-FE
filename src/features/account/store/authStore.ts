import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_USERS } from "@/features/account/mock/data";
import type { User } from "@/features/account/types/account";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface StorefrontAuthStore {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUserId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
};

export const useStorefrontAuthStore = create<StorefrontAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      login: async ({ email }) => {
        await wait(600);

        const user = MOCK_USERS.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

        if (!user) {
          return false;
        }

        set({ user });
        return true;
      },
      register: async ({ fullName, email, phone }) => {
        await wait(600);

        const normalizedEmail = email.trim().toLowerCase();
        const exists = MOCK_USERS.some((item) => item.email.toLowerCase() === normalizedEmail);

        if (exists) {
          return false;
        }

        set({
          user: {
            id: createUserId(),
            fullName: fullName.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            avatar: null,
            joinedDate: new Date().toISOString(),
          },
        });

        return true;
      },
      logout: () => set({ user: null }),
      updateProfile: (updates) => {
        const { user } = get();

        if (!user) {
          return;
        }

        set({ user: { ...user, ...updates } });
      },
    }),
    {
      name: "ocop-storefront-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export const useStorefrontIsLoggedIn = () => useStorefrontAuthStore((state) => Boolean(state.user));
