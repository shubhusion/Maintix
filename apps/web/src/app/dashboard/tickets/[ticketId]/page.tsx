'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = use(params);
  const router = useRouter();
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
          <Button variant="link" className="mt-2">Go back to tickets</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[ticket.status];
  const StatusIcon = status?.icon ?? Clock;

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mt-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
            <Badge variant={status?.variant ?? 'secondary'} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status?.label ?? ticket.status}
            </Badge>
            {ticket.priority === Priority.URGENT && (
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-error-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Created {new Date(ticket.createdAt).toLocaleDateString()} by{' '}
            {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm max-w-prose">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Cancellation reason */}
          {ticket.cancellationReason && (
            <Card className="border-error-500/30">
              <CardHeader>
                <CardTitle className="text-base text-error-500">
                  Cancellation Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm max-w-prose">{ticket.cancellationReason}</p>
              </CardContent>
            </Card>
          )}

          {/* Workflow Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {/* Manager: Assign */}
              {isManager && ticket.status === TicketStatus.OPEN && (
                <Button onClick={() => setAssignDialogOpen(true)} disabled={assignTicket.isPending}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assign Technician
                </Button>
              )}

              {/* Technician: Start Work */}
              {isTechnician &&
                isAssignee &&
                ticket.status === TicketStatus.ASSIGNED && (
                  <Button
                    disabled={startWork.isPending}
                    onClick={() =>
                      handleAction(
                        () =>
                          startWork.mutateAsync({
                            ticketId: ticket.id,
                            version: ticket.version,
                          }),
                        'Work started',
                      )
                    }
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {startWork.isPending ? 'Starting…' : 'Start Work'}
                  </Button>
                )}

              {/* Technician: Submit Completion */}
              {isTechnician &&
                isAssignee &&
                ticket.status === TicketStatus.IN_PROGRESS && (
                  <Button
                    disabled={submitCompletion.isPending}
                    onClick={() =>
                      handleAction(
                        () =>
                          submitCompletion.mutateAsync({
                            ticketId: ticket.id,
                            version: ticket.version,
                          }),
                        'Submitted for approval',
                      )
                    }
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {submitCompletion.isPending ? 'Submitting…' : 'Submit Completion'}
                  </Button>
                )}

              {/* Manager: Approve */}
              {isManager &&
                ticket.status === TicketStatus.AWAITING_APPROVAL && (
                  <Button
                    disabled={approveTicket.isPending}
                    onClick={() =>
                      handleAction(
                        () =>
                          approveTicket.mutateAsync({
                            ticketId: ticket.id,
                            version: ticket.version,
                          }),
                        'Ticket approved',
                      )
                    }
                    className="bg-success-600 hover:bg-success-600/90"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {approveTicket.isPending ? 'Approving…' : 'Approve'}
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
                  >
                    Update Priority
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

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{ticket.category?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm font-medium capitalize">
                    {ticket.priority.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="text-sm font-medium">
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : 'Unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>Choose a technician to handle this ticket.</DialogDescription>
          </DialogHeader>
          <Select value={assignTechId} onValueChange={setAssignTechId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a technician" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((m) => (
                <SelectItem key={m.userId} value={m.userId}>
                  {m.user.firstName} {m.user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!assignTechId}
              onClick={async () => {
                await handleAction(
                  () =>
                    assignTicket.mutateAsync({
                      ticketId: ticket.id,
                      technicianId: assignTechId,
                      version: ticket.version,
                    }),
                  'Technician assigned',
                );
                setAssignDialogOpen(false);
              }}
            >
              Assign
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
            <Label>Reason for cancellation <span className="text-error-500">*</span></Label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Why are you cancelling this ticket?"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button
              variant="destructive"
              disabled={cancelReason.length < 5}
              onClick={async () => {
                await handleAction(
                  () =>
                    cancelTicket.mutateAsync({
                      ticketId: ticket.id,
                      reason: cancelReason,
                      version: ticket.version,
                    }),
                  'Ticket cancelled',
                );
                setCancelDialogOpen(false);
              }}
            >
              Cancel Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Priority</DialogTitle>
            <DialogDescription>Change the priority level of this ticket.</DialogDescription>
          </DialogHeader>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Priority).map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPriorityDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedPriority}
              onClick={async () => {
                await handleAction(
                  () =>
                    updatePriority.mutateAsync({
                      ticketId: ticket.id,
                      priority: selectedPriority as Priority,
                      version: ticket.version,
                    }),
                  'Priority updated',
                );
                setPriorityDialogOpen(false);
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Ticket</DialogTitle>
            <DialogDescription>Select a different technician for this ticket.</DialogDescription>
          </DialogHeader>
          <Select value={reassignTechId} onValueChange={setReassignTechId}>
            <SelectTrigger>
              <SelectValue placeholder="Select new technician" />
            </SelectTrigger>
            <SelectContent>
              {technicians
                .filter((m) => m.userId !== ticket.assignedTo?.id)
                .map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.user.firstName} {m.user.lastName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!reassignTechId}
              onClick={async () => {
                await handleAction(
                  () =>
                    reassignTicket.mutateAsync({
                      ticketId: ticket.id,
                      technicianId: reassignTechId,
                      version: ticket.version,
                    }),
                  'Ticket reassigned',
                );
                setReassignDialogOpen(false);
              }}
            >
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
