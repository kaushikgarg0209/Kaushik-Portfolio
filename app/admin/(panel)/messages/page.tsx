"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ContactMessage } from "@/lib/db/schema";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function toggleRead(id: string, read: boolean) {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: !read }),
    });
    await fetchMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    toast.success("Message deleted");
    await fetchMessages();
  }

  return (
    <div>
      <AdminHeader title="Messages" description="Contact form submissions" />

      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            No messages yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={msg.read ? "opacity-70" : "border-cyan-500/20"}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{msg.name}</p>
                      {!msg.read && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-cyan-400">{msg.email}</p>
                    {msg.subject && (
                      <p className="mt-1 text-sm font-medium text-slate-300">
                        {msg.subject}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-slate-400">{msg.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleRead(msg.id, msg.read)}
                    >
                      {msg.read ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
