// Icônes vectorielles des séances — plus pro que les emojis dans l'UI de structure.
import { Dumbbell, Grip, Zap, Activity, Shield, Moon, BicepsFlexed } from 'lucide-react'

const ICONS = {
  'push-a': Dumbbell,
  'pull-a': Grip,
  'push-b': Zap,
  'pull-b': Activity,
  arms: BicepsFlexed,
  core: Shield,
  repos: Moon,
}

export function SessionIcon({ session, size = 20, className = '' }) {
  const Icon = ICONS[session] || Dumbbell
  return <Icon size={size} className={className} />
}
