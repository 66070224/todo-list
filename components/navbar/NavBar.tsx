import { auth } from "@/auth";
import AccountDropDown from "../AccountDropDown";
import SignInButton from "../SignInButton";
import NavigateMenu from "./NavigateMenu";
import AvatarMenu from "./AvatarMenu";

interface Props {
  currentPage?: number;
}

export default async function NavBar({ currentPage }: Props) {
  const session = await auth();

  return (
    <nav className="bg-secondary text-secondary-foreground sticky top-0 flex flex-col items-center sm:flex-row sm:justify-between p-4 gap-3 shadow-2xl">
      <a href="/">
        <h1 className="font-extrabold text-2xl text-foreground-lighter">
          TODO LIST
        </h1>
      </a>

      <NavigateMenu />
      {session ? (
        <AvatarMenu imgUrl={session.user?.image || ""} />
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}
