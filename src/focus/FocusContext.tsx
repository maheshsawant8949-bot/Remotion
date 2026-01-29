import { createContext, useContext, useState } from 'react';

type FocusState = {
  targetId: string | null;
  dimOpacity: number;
  blur: number;
};

const FocusContext = createContext<any>(null);

export const FocusProvider = ({ children }: any) => {
  const [focus, setFocus] = useState<FocusState>({
    targetId: null,
    dimOpacity: 0.5,
    blur: 4
  });

  return (
    <FocusContext.Provider value={{ focus, setFocus }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => useContext(FocusContext);
