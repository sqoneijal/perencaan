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

type PaginationStore = {
   pagination: {
      pageIndex: number;
      pageSize: number;
   };
   setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
};

export const useTablePagination = create<PaginationStore>((set) => ({
   pagination: {
      pageIndex: 0,
      pageSize: 25,
   },
   setPagination: (pagination) => set({ pagination }),
}));
