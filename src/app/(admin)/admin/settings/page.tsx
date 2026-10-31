import { SettingsConsole } from "@/components/features/settings/SettingsConsole";

export const metadata = {
  title: "Settings | LoopOS",
  description: "Configure legal entity metadata, sequence numbering prefixes, and dunning rules.",
};

export default function SettingsPage() {
  return <SettingsConsole />;
}
