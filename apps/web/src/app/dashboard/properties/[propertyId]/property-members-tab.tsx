'use client';

import { useState } from 'react';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { usePropertyMembers, useAddMember, useRemoveMember } from '@/hooks/use-properties';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface PropertyMembersTabProps {
  propertyId: string;
  isManager: boolean;
}

export function PropertyMembersTab({ propertyId, isManager }: PropertyMembersTabProps) {
  const { user } = useAuth();
  const { data: members } = usePropertyMembers(propertyId);
  const { data: allUsers } = useUsers(undefined, isManager);
  const addMember = useAddMember(propertyId);
  const removeMember = useRemoveMember(propertyId);
  const { toast } = useToast();

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [removeMemberTarget, setRemoveMemberTarget] = useState<string | null>(null);

  const memberIds = new Set(members?.map((m) => m.userId) ?? []);
  const addableUsers = allUsers?.data?.filter((u) => !memberIds.has(u.id)) ?? [];

  const onAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await addMember.mutateAsync({ userId: selectedUserId });
      toast({ title: 'Member added' });
      setMemberDialogOpen(false);
      setSelectedUserId('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const onRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync(userId);
      toast({ title: 'Member removed' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  if (!members || members.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium">No members yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Add team members to this property to collaborate on maintenance tasks.
          </p>
          {isManager && (
            <Button className="mt-4" onClick={() => setMemberDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {members.map((m) => (
          <Card key={m.userId}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">
                    {m.user.firstName?.[0]}
                    {m.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {m.user.firstName} {m.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {m.user.role.toLowerCase()}
                  </p>
                </div>
              </div>
              {isManager && m.userId !== user?.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-error-500"
                  onClick={() => setRemoveMemberTarget(m.userId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Member Dialog */}
      {isManager && (
        <>
          <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member</DialogTitle>
                <DialogDescription>
                  Select a user to add as a member of this property.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {addableUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.role.toLowerCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMemberDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onAddMember} disabled={!selectedUserId}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Remove Member Confirmation */}
          <AlertDialog
            open={!!removeMemberTarget}
            onOpenChange={(open) => {
              if (!open) setRemoveMemberTarget(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove member?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove their access to this property. They will no longer be able to
                  view or create tickets for this property.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => removeMemberTarget && onRemoveMember(removeMemberTarget)}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
