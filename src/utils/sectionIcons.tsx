import {
  Activity,
  Stethoscope,
  HeartPulse,
  CalendarDays,
  Target,
  Home,
  Dumbbell,
  Info,
  type LucideIcon,
} from "lucide-react";

const map: { match: RegExp; icon: LucideIcon }[] = [
  { match: /spinal\s*diagnosis|^diagnosis/i, icon: Stethoscope },
  { match: /extremity/i, icon: Activity },
  { match: /treatment\s*modalit/i, icon: HeartPulse },
  { match: /care\s*plan|phase\s*of\s*care/i, icon: CalendarDays },
  { match: /treatment\s*goal/i, icon: Target },
  { match: /home\s*care/i, icon: Home },
  { match: /exercise|therapeutic/i, icon: Dumbbell },
];

export const getSectionIcon = (title: string): LucideIcon => {
  return map.find((m) => m.match.test(title))?.icon ?? Info;
};
