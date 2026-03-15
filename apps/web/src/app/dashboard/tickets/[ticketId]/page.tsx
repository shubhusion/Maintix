'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  User,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  UserCheck,
  RotateCcw,
  Paperclip,
  FileText,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import {
  useTicket,
  useAssignTicket,
  useStartWork,
  useSubmitCompletion,
  useApproveTicket,
  useCancelTicket,
  useUpdatePriority,
  useReassignTicket,
} from '@/hooks/use-tickets';
import { usePropertyMembers } from '@/hooks/use-properties';
import { useAuth } from '@/contexts/auth-context';
import { ActivityTimeline } from '@/components/activity-timeline';
import { UploadDropzone } from '@/components/upload-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { statusConfig } from '@/lib/ticket-config';
import { TicketStatus, Priority, Role } from '@maintix/shared-types';

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: ticket, isLoading } = useTicket(ticketId);
  const { data: members } = usePropertyMembers(ticket?.property?.id || '');
  const { toast } = useToast();

  const assignTicket = useAssignTicket();
  const startWork = useStartWork();
  const submitCompletion = useSubmitCompletion();
  const approveTicket = useApproveTicket();
  const cancelTicket = useCancelTicket();
  const updatePriority = useUpdatePriority();
  const reassignTicket = useReassignTicket();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [assignTechId, setAssignTechId] = useState('');
  const [reassignTechId, setReassignTechId] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const isManager = user?.role === Role.MANAGER;
  const isTechnician = user?.role === Role.TECHNICIAN;
  const isAssignee = ticket?.assignedTo?.id === user?.id;
  const isCreator = ticket?.createdBy?.id === user?.id;

  const technicians = members?.filter((m) => m.user.role === Role.TECHNICIAN) ?? [];

  // Helper to get latest ticket version for optimistic concurrency
  const getLatestVersion = async (): Promise<number> => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ['tickets', 'detail', ticketId],
      });
      const latest = queryClient.getQueryData(['tickets', 'detail', ticketId]) as any;
      return latest?.version ?? ticket?.version ?? 0;
    } catch {
      return ticket?.version ?? 0;
    }
  };

  const handleAction = async (action: () => Promise<any>, successMsg: string) => {
    try {
      await action();
      toast({ title: successMsg });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">Ticket not found</h3>
        <Link href="/dashboard/tickets">
          <Button variant="link" className="mt-2">
            Go back to tickets
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[ticket.status];
  const StatusIcon = status?.icon ?? Clock;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back button + header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mt-1 h-9 w-9 sm:h-10 sm:w-10 shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight break-words">{ticket.title}</h1>
            <Badge variant={status?.variant ?? 'secondary'} className="gap-1 shrink-0 w-fit">
              <StatusIcon className="h-3 w-3" />
              <span className="hidden sm:inline">{status?.label ?? ticket.status}</span>
              <span className="sm:hidden">{status?.label?.charAt(0) ?? ticket.status.charAt(0)}</span>
            </Badge>
            {ticket.priority === Priority.URGENT && (
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-error-500 shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Created {new Date(ticket.createdAt).toLocaleDateString()} by{' '}
            {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm max-w-prose">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Cancellation reason */}
          {ticket.cancellationReason && (
            <Card className="border-error-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base text-error-500">Cancellation Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm max-w-prose">{ticket.cancellationReason}</p>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="hidden sm:inline">Attachments ({ticket.attachments.length})</span>
                  <span className="sm:hidden">({ticket.attachments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {ticket.attachments.map(
                    (att: {
                      id: string;
                      url: string;
                      fileName: string;
                      mimeType: string;
                      fileSize: number;
                    }) => {
                      const isImage = att.mimeType.startsWith('image/');
                      return (
                        <div key={att.id} className="group relative">
                          {isImage ? (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block aspect-square overflow-hidden rounded-lg border bg-muted"
                            >
                              <img
                                src={att.url}
                                alt={att.fileName}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            </a>
                          ) : (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-muted transition-colors hover:bg-muted/80"
                            >
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </a>
                          )}
                          <p
                            className="mt-1 truncate text-xs text-muted-foreground"
                            title={att.fileName}
                          >
                            {att.fileName}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Dropzone — hidden for terminal ticket states */}
          {ticket.status !== TicketStatus.DONE &&
            ticket.status !== TicketStatus.CANCELLED && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Upload Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UploadDropzone
                    ticketId={ticketId}
                    propertyId={ticket.property.id}
                    currentCount={ticket.attachments?.length ?? 0}
                    onUploadComplete={() => {
                      queryClient.invalidateQueries({
                        queryKey: ['tickets', 'detail', ticketId],
                      });
                    }}
                  />
                </CardContent>
              </Card>
            )}

          {/* Workflow Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {/* Manager: Assign */}
              {isManager && ticket.status === TicketStatus.OPEN && (
                <Button onClick={() => setAssignDialogOpen(true)} disabled={assignTicket.isPending} className="h-10">
                  <UserCheck className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Assign Technician</span>
                  <span className="sm:hidden">Assign</span>
                </Button>
              )}

              {/* Technician: Start Work */}
              {isTechnician && isAssignee && ticket.status === TicketStatus.ASSIGNED && (
                <Button
                  disabled={startWork.isPending}
                  onClick={async () => {
                    const version = await getLatestVersion();
                    await handleAction(
                      () =>
                        startWork.mutateAsync({
                          ticketId: ticket.id,
                          version,
                        }),
                      'Work started',
                    );
                  }}
                  className="h-10"
                >
                  <Play className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{startWork.isPending ? 'Starting…' : 'Start Work'}</span>
                  <span className="sm:hidden">{startWork.isPending ? 'Starting…' : 'Start'}</span>
                </Button>
              )}

              {/* Technician: Submit Completion */}
              {isTechnician && isAssignee && ticket.status === TicketStatus.IN_PROGRESS && (
                <Button
                  disabled={submitCompletion.isPending}
                  onClick={async () => {
                    const version = await getLatestVersion();
                    await handleAction(
                      () =>
                        submitCompletion.mutateAsync({
                          ticketId: ticket.id,
                          version,
                        }),
                      'Submitted for approval',
                    );
                  }}
                  className="h-10"
                >
                  <CheckCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{submitCompletion.isPending ? 'Submitting…' : 'Submit Completion'}</span>
                  <span className="sm:hidden">{submitCompletion.isPending ? 'Submitting…' : 'Complete'}</span>
                </Button>
              )}

              {/* Manager: Approve */}
              {isManager && ticket.status === TicketStatus.AWAITING_APPROVAL && (
                <Button
                  disabled={approveTicket.isPending}
                  onClick={async () => {
                    const version = await getLatestVersion();
                    await handleAction(
                      () =>
                        approveTicket.mutateAsync({
                          ticketId: ticket.id,
                          version,
                        }),
                      'Ticket approved',
                    );
                  }}
                  className="bg-success-600 hover:bg-success-600/90 h-10"
                >
                  <CheckCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{approveTicket.isPending ? 'Approving…' : 'Approve'}</span>
                  <span className="sm:hidden">{approveTicket.isPending ? 'Approving…' : 'OK'}</span>
                </Button>
              )}

              {/* Manager: Update Priority */}
              {isManager &&
                ticket.status !== TicketStatus.DONE &&
                ticket.status !== TicketStatus.CANCELLED && (
                  <Button
                    variant="outline"
                    onClick={() => setPriorityDialogOpen(true)}
                    disabled={updatePriority.isPending}
                    className="h-10"
                  >
                    <span className="hidden sm:inline">Update Priority</span>
                    <span className="sm:hidden">Priority</span>
                  </Button>
                )}

              {/* Manager: Reassign */}
              {isManager &&
                (ticket.status === TicketStatus.ASSIGNED ||
                  ticket.status === TicketStatus.IN_PROGRESS) && (
                  <Button
                    variant="outline"
                    onClick={() => setReassignDialogOpen(true)}
                    disabled={reassignTicket.isPending}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reassign
                  </Button>
                )}

              {/* Creator: Cancel */}
              {isCreator &&
                (ticket.status === TicketStatus.OPEN ||
                  ticket.status === TicketStatus.ASSIGNED) && (
                  <Button
                    variant="destructive"
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={cancelTicket.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Ticket
                  </Button>
                )}

              {ticket.status === TicketStatus.DONE && (
                <p className="text-sm text-success-600 font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> This ticket has been completed.
                </p>
              )}

              {ticket.status === TicketStatus.CANCELLED && (
                <p className="text-sm text-error-500 font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> This ticket has been cancelled.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <ActivityTimeline ticketId={ticketId} />
        </div>

        {/* Sidebar - moves below on mobile */}
        <div className="space-y-4 order-first lg:order-last">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium truncate">{ticket.category?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm font-medium capitalize truncate">{ticket.priority.toLowerCase()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="text-sm font-medium truncate">
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : 'Unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium truncate">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Version: {ticket.version}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Assign Technician</DialogTitle>
            <DialogDescription className="text-sm">Choose a technician to handle this ticket.</DialogDescription>
          </DialogHeader>
          <Select value={assignTechId} onValueChange={setAssignTechId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a technician" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {technicians.map((m) => (
                <SelectItem key={m.userId} value={m.userId}>
                  {m.user.firstName} {m.user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              disabled={!assignTechId || assignTicket.isPending}
              onClick={async () => {
                try {
                  // Refetch ticket to get latest version before assignment
                  const latestTicket = await queryClient.fetchQuery({
                    queryKey: ['tickets', 'detail', ticketId],
                    queryFn: async () => {
                      // Invalidate and refetch
                      await queryClient.invalidateQueries({
                        queryKey: ['tickets', 'detail', ticketId],
                      });
                      // Get the fresh data from cache
                      return queryClient.getQueryData(['tickets', 'detail', ticketId]);
                    },
                  });

                  await assignTicket.mutateAsync({
                    ticketId: ticket.id,
                    technicianId: assignTechId,
                    version: (latestTicket as any)?.version ?? ticket.version,
                  });
                  toast({ title: 'Technician assigned successfully' });
                  setAssignDialogOpen(false);
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : 'An error occurred';
                  toast({ title: 'Error', description: message, variant: 'destructive' });
                }
              }}
            >
              {assignTicket.isPending ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Ticket</DialogTitle>
            <DialogDescription>Provide a reason for cancelling this ticket.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>
              Reason for cancellation <span className="text-error-500">*</span>
            </Label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Why are you cancelling this ticket?"
              rows={3}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} className="w-full sm:w-auto">
              Go Back
            </Button>
            <Button
              variant="destructive"
              disabled={cancelReason.length < 5 || cancelTicket.isPending}
              onClick={async () => {
                const version = await getLatestVersion();
                await handleAction(
                  () =>
                    cancelTicket.mutateAsync({
                      ticketId: ticket.id,
                      reason: cancelReason,
                      version,
                    }),
                  'Ticket cancelled',
                );
                setCancelDialogOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              {cancelTicket.isPending ? 'Cancelling...' : 'Cancel Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Update Priority</DialogTitle>
            <DialogDescription className="text-sm">Change the priority level of this ticket.</DialogDescription>
          </DialogHeader>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Object.values(Priority).map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button variant="outline" onClick={() => setPriorityDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              disabled={!selectedPriority || updatePriority.isPending}
              onClick={async () => {
                const version = await getLatestVersion();
                await handleAction(
                  () =>
                    updatePriority.mutateAsync({
                      ticketId: ticket.id,
                      priority: selectedPriority as Priority,
                      version,
                    }),
                  'Priority updated',
                );
                setPriorityDialogOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              {updatePriority.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Reassign Ticket</DialogTitle>
            <DialogDescription className="text-sm">Select a different technician for this ticket.</DialogDescription>
          </DialogHeader>
          <Select value={reassignTechId} onValueChange={setReassignTechId}>
            <SelectTrigger>
              <SelectValue placeholder="Select new technician" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {technicians
                .filter((m) => m.userId !== ticket.assignedTo?.id)
                .map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.user.firstName} {m.user.lastName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button variant="outline" onClick={() => setReassignDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              disabled={!reassignTechId || reassignTicket.isPending}
              onClick={async () => {
                const version = await getLatestVersion();
                await handleAction(
                  () =>
                    reassignTicket.mutateAsync({
                      ticketId: ticket.id,
                      technicianId: reassignTechId,
                      version,
                    }),
                  'Ticket reassigned',
                );
                setReassignDialogOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              {reassignTicket.isPending ? 'Reassigning...' : 'Reassign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
