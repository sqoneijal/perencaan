import React from "react";
import { create } from "zustand";

export const useDialog = create<{
   open: boolean;
   setOpen: (status: boolean) => void;
}>((set) => ({
   open: false,
   setOpen: (status) => set({ open: status }),
}));

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
