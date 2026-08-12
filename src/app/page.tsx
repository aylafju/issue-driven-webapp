import { VersionFooter } from "@/components/VersionFooter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-900">
      <h1 className="text-3xl font-semibold">🚧 Im Aufbau</h1>
      <p className="text-neutral-500">
        Diese App wird issue-getrieben entwickelt – Features entstehen aus
        GitHub-Issues.
      </p>
      <VersionFooter />
    </main>
  );
}
