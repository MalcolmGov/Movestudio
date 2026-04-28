export { TEXT_REGISTRY } from './text'
export { BACKGROUNDS_REGISTRY } from './backgrounds'
export { ANIMATIONS_REGISTRY } from './animations'
export { BUTTONS_REGISTRY } from './buttons'
export { CARDS_REGISTRY } from './cards'
export { UI_REGISTRY } from './ui'
export { LAYOUT_REGISTRY } from './layout'
export { FORMS_REGISTRY } from './forms'
export { NAVIGATION_REGISTRY } from './navigation'
export { OVERLAYS_REGISTRY } from './overlays'

import { TEXT_REGISTRY } from './text'
import { BACKGROUNDS_REGISTRY } from './backgrounds'
import { ANIMATIONS_REGISTRY } from './animations'
import { BUTTONS_REGISTRY } from './buttons'
import { CARDS_REGISTRY } from './cards'
import { UI_REGISTRY } from './ui'
import { LAYOUT_REGISTRY } from './layout'
import { FORMS_REGISTRY } from './forms'
import { NAVIGATION_REGISTRY } from './navigation'
import { OVERLAYS_REGISTRY } from './overlays'

export const REGISTRY: Record<string, any> = {
  ...TEXT_REGISTRY,
  ...BACKGROUNDS_REGISTRY,
  ...ANIMATIONS_REGISTRY,
  ...BUTTONS_REGISTRY,
  ...CARDS_REGISTRY,
  ...UI_REGISTRY,
  ...LAYOUT_REGISTRY,
  ...FORMS_REGISTRY,
  ...NAVIGATION_REGISTRY,
  ...OVERLAYS_REGISTRY,
}
