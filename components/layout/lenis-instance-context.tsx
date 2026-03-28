"use client";

import type Lenis from "lenis";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type LenisInstanceContextValue = {
  instance: Lenis | null;
  setInstance: Dispatch<SetStateAction<Lenis | null>>;
};

const LenisInstanceContext = createContext<LenisInstanceContextValue | null>(
  null,
);

export function LenisInstanceProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<Lenis | null>(null);
  const value = useMemo(
    () => ({ instance, setInstance }),
    [instance],
  );
  return (
    <LenisInstanceContext.Provider value={value}>
      {children}
    </LenisInstanceContext.Provider>
  );
}

export function useLenisInstance(): Lenis | null {
  return useContext(LenisInstanceContext)?.instance ?? null;
}

export function useLenisInstanceSetter() {
  return useContext(LenisInstanceContext)?.setInstance;
}
