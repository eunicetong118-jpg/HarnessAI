import NextAuth from "next-auth";

// Minimal stub for NextAuth v5
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [],
});
