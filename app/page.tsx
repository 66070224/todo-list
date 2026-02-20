import { auth } from "@/auth";
import NavBar from "@/components/NavBar";

export default async function HomePage() {
  const session = await auth();
  return (
    <>
      <div className="bg-yellow-700 text-center">
        Happy Chinese New Year, everyone!!!
      </div>
      <NavBar />
      <main className="min-h-screen flex flex-col">
        {session ? (
          <h1>Welcome, {session.user?.name || "ERROR"}</h1>
        ) : (
          <h1>Welcome To ToDo List!!!</h1>
        )}
      </main>
    </>
  );
}
