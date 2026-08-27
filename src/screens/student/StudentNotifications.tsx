import { useEffect, useMemo, useState } from "react";
import { Bell, CircleCheck as CheckCircle2, Droplets, MessageCircleMore, Sparkles, Trash2, Truck, Wallet as Wallet2 } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonList } from "../../components/common/LoadingSkeleton";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

interface StudentNotificationsProps {
  mode?: "student" | "partner";
}

// Student notifications tab — feed of status update cards.
export function StudentNotifications({ mode = "student" }: StudentNotificationsProps) {
  const notifications = useAppStore((s) => s.notifications);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const deleteNotification = useAppStore((s) => s.deleteNotification);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = useMemo(() => notifications.filter((item) => item.forMode === mode), [notifications, mode]);

  const grouped = useMemo(() => {
    return visible.reduce<Record<string, typeof visible>>((acc, item) => {
      acc[item.group] = [...(acc[item.group] ?? []), item];
      return acc;
    }, {});
  }, [visible]);

  const groups = ["Today", "Yesterday", "Earlier"] as const;

  if (loading) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-12 pb-4">
          <h1 className="font-display text-2xl font-extrabold text-neutral-900">Notifications</h1>
          <p className="mt-1 text-sm text-neutral-500">Loading your activity feed…</p>
        </div>
        <div className="px-5">
          <SkeletonList count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-neutral-900">Notifications</h1>
            <p className="mt-1 text-sm text-neutral-500">Stay updated on your orders and partner activity.</p>
          </div>
          <button onClick={markAllNotificationsRead} className="btn-ghost">Mark all read</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="px-5"><EmptyState icon={<Bell className="h-6 w-6" />} title="No notifications" description="You’re all caught up for now. New updates will appear here." /></div>
      ) : (
        <div className="px-5 mt-2 space-y-5">
          {groups.map((group) => {
            const items = grouped[group] ?? [];
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">{group}</p>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className={`card p-4 ${item.unread ? "border-primary-200" : ""}`}>
                      <div className="flex gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneMap[item.tone]}`}>
                          {iconFor(item.title)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                            <span className="shrink-0 text-xs text-neutral-400">{item.time}</span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-neutral-500">{item.body}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${item.unread ? "bg-primary-50 text-primary-700" : "bg-neutral-100 text-neutral-500"}`}>
                          {item.unread ? "Unread" : "Read"}
                        </span>
                        <button onClick={() => setDeleteTarget(item.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete notification?"
          message="This notification will be permanently removed from your activity feed. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => {
            if (deleteTarget) deleteNotification(deleteTarget);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
    </div>
  );
}

const toneMap = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  accent: "bg-accent-50 text-accent-600",
  warning: "bg-warning-50 text-warning-600",
  error: "bg-error-50 text-error-600",
} as const;

function iconFor(title: string) {
  if (title.includes("booking") || title.includes("Booking")) return <CheckCircle2 className="h-5 w-5" />;
  if (title.includes("dish") || title.includes("washing") || title.includes("Laundry")) return <Droplets className="h-5 w-5" />;
  if (title.includes("wallet") || title.includes("Payment")) return <Wallet2 className="h-5 w-5" />;
  if (title.includes("review") || title.includes("performance")) return <MessageCircleMore className="h-5 w-5" />;
  if (title.includes("discount") || title.includes("Special")) return <Sparkles className="h-5 w-5" />;
  return <Truck className="h-5 w-5" />;
}
