/**
 * Scroll “revealed” state for /solucoes K color — lives outside React context so
 * client components nested under Server Components (e.g. AboutBlock) still subscribe.
 */
let hasScrolled = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function markSolucoesFirstScroll() {
  if (hasScrolled) return;
  hasScrolled = true;
  emit();
}

export function getSolucoesFirstScrollSnapshot() {
  return hasScrolled;
}

export function subscribeSolucoesFirstScroll(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}
