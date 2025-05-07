import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  linkAccounts: (email: string, password: string) => Promise<void>;
  updateProfile: (data: { username?: string, fullName?: string, bio?: string }) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => { },
  linkAccounts: async () => { },
  updateProfile: async () => { },
  updateAvatar: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const linkAccounts = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { error: linkError } = await supabase.auth.updateUser({
          email,
          password,
        });

        if (linkError) throw linkError;
      }
    } catch (error) {
      console.error("Error linking accounts:", error);
      throw error;
    }
  };

  const updateProfile = async (data: { username?: string, fullName?: string, bio?: string }) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const updates = {
        data: {
          ...(user.user_metadata || {}),
          ...(data.username && { username: data.username }),
          ...(data.fullName && { full_name: data.fullName }),
          ...(data.bio && { bio: data.bio }),
        }
      };

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      // Update local user to reflect changes immediately
      setUser(prev => prev ? {
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          ...(data.username && { username: data.username }),
          ...(data.fullName && { full_name: data.fullName }),
          ...(data.bio && { bio: data.bio }),
        }
      } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    try {
      if (!user) throw new Error("User not authenticated");

      console.log("Updating avatar to:", avatarUrl);

      // Update the avatar URL in the user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: avatarUrl,
          // Explicitly overriding the provider's avatar to ensure persistence
          provider_avatar_url: null,
        }
      });

      if (error) {
        console.error("Error updating avatar in Supabase:", error);
        throw error;
      }

      if (data.user) {
        console.log("Avatar updated successfully, new user data:", data.user);

        // Update local user state to reflect changes immediately
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            avatar_url: avatarUrl,
            provider_avatar_url: null,
          }
        });
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    linkAccounts,
    updateProfile,
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export const useAuthContext = () => useContext(AuthContext);