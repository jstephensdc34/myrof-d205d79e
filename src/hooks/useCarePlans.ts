import { useEffect, useRef, useState, useCallback } from "react";
import { CategoryType, PatientInfo } from "@/types";
import {
  CarePlanPayload,
  CarePlanRow,
  deleteCarePlan,
  listSavedCarePlans,
  renameCarePlan,
  saveNamedCarePlan,
} from "@/services/carePlansService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseCarePlansArgs {
  patient: PatientInfo;
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals: string;
  activeCategory: CategoryType;
  setPatient: (p: PatientInfo) => void;
  setSelectedItems: (ids: string[]) => void;
  setAdditionalNotes: (n: string) => void;
  setCustomTreatmentGoals: (g: string) => void;
  setActiveCategory: (c: CategoryType) => void;
}

export const useCarePlans = (args: UseCarePlansArgs) => {
  const { toast } = useToast();
  const [savedPlans, setSavedPlans] = useState<CarePlanRow[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentPlanTitle, setCurrentPlanTitle] = useState<string | null>(null);
  const isAuthenticatedRef = useRef(false);

  const buildPayload = useCallback((): CarePlanPayload => ({
    patient_name: args.patient.name || null,
    report_date: args.patient.date || null,
    selected_item_ids: args.selectedItems,
    additional_notes: args.additionalNotes || null,
    custom_treatment_goals: args.customTreatmentGoals || null,
    active_category: args.activeCategory,
  }), [args.patient, args.selectedItems, args.additionalNotes, args.customTreatmentGoals, args.activeCategory]);

  const refreshSavedPlans = useCallback(async () => {
    if (!isAuthenticatedRef.current) return;
    setLoadingPlans(true);
    try {
      const plans = await listSavedCarePlans();
      setSavedPlans(plans);
    } catch (e) {
      console.error("Failed to load care plans", e);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  // Initial load: check auth and load saved plans (no auto-save/draft restore)
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      isAuthenticatedRef.current = !!data.user;
      if (!data.user) return;
      await refreshSavedPlans();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAs = useCallback(async (title: string) => {
    try {
      const row = await saveNamedCarePlan(title, buildPayload());
      setCurrentPlanId(row.id);
      setCurrentPlanTitle(row.title);
      await refreshSavedPlans();
      toast({ title: "Care Plan Saved", description: `"${title}" has been saved.` });
    } catch (e) {
      toast({ title: "Save failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    }
  }, [buildPayload, refreshSavedPlans, toast]);

  const updateCurrent = useCallback(async () => {
    if (!currentPlanId || !currentPlanTitle) return;
    try {
      await saveNamedCarePlan(currentPlanTitle, buildPayload(), currentPlanId);
      await refreshSavedPlans();
      toast({ title: "Care Plan Updated", description: `"${currentPlanTitle}" has been updated.` });
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    }
  }, [currentPlanId, currentPlanTitle, buildPayload, refreshSavedPlans, toast]);

  const loadPlan = useCallback((plan: CarePlanRow) => {
    args.setPatient({
      name: plan.patient_name ?? "",
      date: plan.report_date ?? new Date().toISOString().split("T")[0],
    });
    args.setSelectedItems(plan.selected_item_ids);
    args.setAdditionalNotes(plan.additional_notes ?? "");
    args.setCustomTreatmentGoals(plan.custom_treatment_goals ?? "");
    if (plan.active_category) args.setActiveCategory(plan.active_category as CategoryType);
    setCurrentPlanId(plan.id);
    setCurrentPlanTitle(plan.title);
    toast({ title: "Care Plan Loaded", description: `"${plan.title}" is ready to edit.` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const removePlan = useCallback(async (id: string) => {
    try {
      await deleteCarePlan(id);
      if (currentPlanId === id) {
        setCurrentPlanId(null);
        setCurrentPlanTitle(null);
      }
      await refreshSavedPlans();
      toast({ title: "Care Plan Deleted" });
    } catch (e) {
      toast({ title: "Delete failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    }
  }, [currentPlanId, refreshSavedPlans, toast]);

  const rename = useCallback(async (id: string, title: string) => {
    try {
      await renameCarePlan(id, title);
      if (currentPlanId === id) setCurrentPlanTitle(title);
      await refreshSavedPlans();
    } catch (e) {
      toast({ title: "Rename failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    }
  }, [currentPlanId, refreshSavedPlans, toast]);

  const newPlan = useCallback(() => {
    setCurrentPlanId(null);
    setCurrentPlanTitle(null);
    args.setPatient({ name: "", date: new Date().toISOString().split("T")[0] });
    args.setSelectedItems([]);
    args.setAdditionalNotes("");
    args.setCustomTreatmentGoals("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    savedPlans,
    loadingPlans,
    currentPlanId,
    currentPlanTitle,
    draftRestored: false,
    lastAutoSavedAt: null as Date | null,
    saveAs,
    updateCurrent,
    loadPlan,
    removePlan,
    rename,
    newPlan,
    refreshSavedPlans,
  };
};
