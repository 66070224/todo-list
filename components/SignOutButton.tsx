import { handleSignOut } from "@/actions/auth";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="border-2 rounded-2xl border-red-500 text-red-500 p-1 cursor-pointer"
      >
        Sign Out
      </button>
    </form>
  );
}
