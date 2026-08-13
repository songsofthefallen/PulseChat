"use client";

import * as React from "react";
import { Bell, Eye, KeyRound, Palette, User as UserIcon, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, PresenceDot } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { currentUser } from "@/constants/mock-data";
import { initials } from "@/lib/utils";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <span className="font-display font-semibold">Settings</span>
        <Button variant="ghost" size="icon" asChild aria-label="Close settings">
          <Link href="/dashboard">
            <X className="size-4" />
          </Link>
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">
                <UserIcon className="size-3.5" /> Profile
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="size-3.5" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="size-3.5" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Eye className="size-3.5" /> Privacy
              </TabsTrigger>
              <TabsTrigger value="security">
                <KeyRound className="size-3.5" /> Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceTab />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="privacy">
              <PrivacyTab />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6">
      <h3 className="font-display font-semibold">{title}</h3>
      {description && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ProfileTab() {
  const { toast } = useToast();
  return (
    <div className="divide-y divide-border">
      <SettingsSection title="Avatar" description="Shown across servers and DMs.">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">
                {initials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot status={currentUser.status} className="size-4" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Upload image</Button>
            <Button variant="ghost" size="sm">Remove</Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="About you">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" defaultValue={currentUser.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="handle">Handle</Label>
            <Input id="handle" defaultValue={`@${currentUser.handle}`} />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell people a little about yourself" rows={3} />
        </div>
      </SettingsSection>

      <SettingsSection title="Status" description="Let people know what you're up to.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Presence</Label>
            <Select defaultValue={currentUser.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="dnd">Do not disturb</SelectItem>
                <SelectItem value="offline">Appear offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customStatus">Custom status</Label>
            <Input id="customStatus" defaultValue={currentUser.customStatus} />
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-end pt-6">
        <Button onClick={() => toast({ title: "Profile saved" })}>Save changes</Button>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  return (
    <SettingsSection title="Theme" description="Choose how PulseChat looks on this device.">
      <div className="grid grid-cols-3 gap-3">
        {(["light", "dark", "system"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`rounded-lg border p-3 text-left text-sm capitalize transition-colors ${
              theme === t ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-sunken"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </SettingsSection>
  );
}

function ToggleRow({ label, description, defaultChecked = true }: { label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function NotificationsTab() {
  return (
    <SettingsSection title="Notifications" description="Control what interrupts you and what waits.">
      <div className="divide-y divide-border">
        <ToggleRow label="Direct messages" description="Notify me for all new DMs." />
        <ToggleRow label="Mentions" description="Notify me when someone @mentions me." />
        <ToggleRow label="Thread replies" description="Notify me on replies to my messages." defaultChecked={false} />
        <ToggleRow label="Sound" description="Play a sound for new notifications." />
      </div>
    </SettingsSection>
  );
}

function PrivacyTab() {
  return (
    <SettingsSection title="Privacy" description="Manage who can reach you.">
      <div className="divide-y divide-border">
        <ToggleRow label="Allow direct messages from server members" />
        <ToggleRow label="Show my online status" />
        <ToggleRow label="Read receipts" description="Let others see when you've read a message." defaultChecked={false} />
      </div>
    </SettingsSection>
  );
}

function SecurityTab() {
  const { toast } = useToast();
  return (
    <div className="divide-y divide-border">
      <SettingsSection title="Change password">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input id="confirmNewPassword" type="password" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast({ title: "Password updated" })}>
              Update password
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Accessibility"
        description="Reduce motion and adjust text size for readability."
      >
        <div className="divide-y divide-border">
          <ToggleRow label="Reduce motion" description="Minimize animations across the app." defaultChecked={false} />
          <ToggleRow label="High contrast" defaultChecked={false} />
        </div>
      </SettingsSection>
    </div>
  );
}
