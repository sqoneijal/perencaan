import React from "react";
import { create } from "zustand";

type HeaderButtonStore = {
   button: React.ReactElement;
   setButton: (btn: React.ReactElement) => React.ReactElement;
};

export const useHeaderButton = create<HeaderButtonStore>((set) => ({
   button: <div />,
   setButton: (btn) => {
      set({ button: btn });
      return btn;
   },
}));
