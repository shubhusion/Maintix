export function NotificationItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-primary-500/[0.06] dark:bg-white/[0.04] px-3 py-2 w-full">
      <span className="text-sm" aria-hidden="true">{icon}</span>
      <span className="text-xs text-foreground/70 dark:text-white/70 flex-1 truncate">{text}</span>
      <span className="text-[10px] text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}
