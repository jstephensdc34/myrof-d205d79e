import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FolderOpen, Trash2, Pencil, Plus, Check, X } from "lucide-react";
import { CarePlanRow } from "@/services/carePlansService";

interface CarePlansPanelProps {
  savedPlans: CarePlanRow[];
  loadingPlans: boolean;
  currentPlanId: string | null;
  currentPlanTitle: string | null;
  lastAutoSavedAt: Date | null;
  draftRestored: boolean;
  onSaveAs: (title: string) => Promise<void>;
  onUpdateCurrent: () => Promise<void>;
  onLoad: (plan: CarePlanRow) => void;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, title: string) => Promise<void>;
  onNew: () => void;
  hasContent: boolean;
}

export const CarePlansPanel = ({
  savedPlans,
  loadingPlans,
  currentPlanId,
  currentPlanTitle,
  lastAutoSavedAt,
  draftRestored,
  onSaveAs,
  onUpdateCurrent,
  onLoad,
  onDelete,
  onRename,
  onNew,
  hasContent,
}: CarePlansPanelProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleSave = async () => {
    if (!newTitle.trim()) return;
    await onSaveAs(newTitle.trim());
    setNewTitle("");
    setSaveDialogOpen(false);
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="mt-4 space-y-2 rounded-md border bg-card p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {currentPlanTitle ? (
            <span>Editing: <span className="text-primary">{currentPlanTitle}</span></span>
          ) : (
            <span className="text-muted-foreground">Unsaved plan</span>
          )}
        </div>
        {lastAutoSavedAt && (
          <span className="text-xs text-muted-foreground">
            Auto-saved {formatTimeAgo(lastAutoSavedAt)}
          </span>
        )}
      </div>
      {draftRestored && !currentPlanId && (
        <p className="text-xs text-muted-foreground">Restored from your last session.</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {currentPlanId ? (
          <Button size="sm" variant="default" onClick={onUpdateCurrent} disabled={!hasContent}>
            <Save className="mr-1 h-4 w-4" /> Update
          </Button>
        ) : (
          <Button size="sm" variant="default" onClick={() => setSaveDialogOpen(true)} disabled={!hasContent}>
            <Save className="mr-1 h-4 w-4" /> Save Plan
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => setLoadDialogOpen(true)}>
          <FolderOpen className="mr-1 h-4 w-4" /> Load
        </Button>
        {currentPlanId && (
          <Button size="sm" variant="outline" onClick={() => setSaveDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Save As New
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onNew}>
          New
        </Button>
      </div>

      {/* Save dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Care Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="planTitle">Plan name</Label>
            <Input
              id="planTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Patient #1234 — Initial visit"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!newTitle.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Saved Care Plans</DialogTitle>
          </DialogHeader>
          {loadingPlans ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : savedPlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved care plans yet.</p>
          ) : (
            <ScrollArea className="max-h-96">
              <ul className="space-y-2">
                {savedPlans.map((plan) => (
                  <li key={plan.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <div className="min-w-0 flex-1">
                      {renamingId === plan.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" onClick={async () => {
                            if (renameValue.trim()) await onRename(plan.id, renameValue.trim());
                            setRenamingId(null);
                          }}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setRenamingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="truncate font-medium">{plan.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {plan.patient_name ? `Patient: ${plan.patient_name} • ` : ""}
                            Updated {new Date(plan.updated_at).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="sm" variant="default" onClick={() => {
                        onLoad(plan);
                        setLoadDialogOpen(false);
                      }}>
                        Load
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => {
                        setRenamingId(plan.id);
                        setRenameValue(plan.title);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(plan.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
