"use server";

import { auth, signIn } from "@/auth";
import AppSidebar from "@/components/AppSidebar";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader header="Home" />
        <main className="flex flex-col p-5 gap-10 text-center">
          {session && (
            <h1 className="text-xl font-bold">
              WELCOME, {session.user?.name} to
            </h1>
          )}
          <h1 className="text-5xl font-bold">TODO LIST</h1>
          <span className="text-center">
            Organize your life. Boost your productivity.
          </span>
          <div className="flex justify-center">
            <p className="text-muted-foreground text-center max-w-xl">
              A simple and powerful task manager built with Next.js,
              authentication, and modern UI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Create, edit and complete tasks easily.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Secure Login</CardTitle>
                <CardDescription>Google OAuth authentication.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>
                  See your productivity at a glance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            <h3>Ready to get productive?</h3>
            {session ? (
              <div className="flex items-center justify-center gap-5">
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>

                <Button asChild>
                  <Link href="/tasks">Go to Tasks</Link>
                </Button>
              </div>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <Button>
                  <LogInIcon />
                  Sign in now
                </Button>
              </form>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
