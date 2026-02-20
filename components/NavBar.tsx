import { auth } from "@/auth";
import AccountDropDown from "./AccountDropDown";
import SignInButton from "./SignInButton";

export default async function NavBar() {
  const session = await auth();

  return (
    <nav className="bg-background-dark text-foreground-dark sticky top-0 flex flex-col items-center sm:flex-row sm:justify-between p-4 gap-3">
      <h1>TODO LIST</h1>
      <ul className="flex gap-3">
        <li>
          <a href="">Dashboard</a>
        </li>
        <li>
          <a href="">My tasks</a>
        </li>
        <li>
          <a href="">Dashboard</a>
        </li>
      </ul>
      {session ? (
        <AccountDropDown
          username={session.user?.name || "ERROR"}
          imgUrl={session.user?.image || ""}
        />
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}
