import Link from "next/link";
import {
  Award,
  Briefcase,
  FolderKanban,
  MessageSquare,
  Star,
} from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCertifications,
  getContactMessages,
  getExperience,
  getProjects,
  getSkills,
  getUnreadMessageCount,
} from "@/lib/db/queries";

export default async function AdminDashboardPage() {
  const [skills, projects, experience, certifications, messages, unread] =
    await Promise.all([
      getSkills(),
      getProjects(),
      getExperience(),
      getCertifications(),
      getContactMessages(),
      getUnreadMessageCount(),
    ]);

  const stats = [
    { label: "Skills", value: skills.length, icon: Star, href: "/admin/skills" },
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Experience",
      value: experience.length,
      icon: Briefcase,
      href: "/admin/experience",
    },
    {
      label: "Certifications",
      value: certifications.length,
      icon: Award,
      href: "/admin/certifications",
    },
    {
      label: "Messages",
      value: messages.length,
      icon: MessageSquare,
      href: "/admin/messages",
      badge: unread > 0 ? `${unread} unread` : undefined,
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Overview of your portfolio content"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-colors hover:border-cyan-500/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  {stat.badge && (
                    <p className="mt-1 text-xs text-cyan-400">{stat.badge}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
