"use client";

import { useState, useCallback, createContext, useContext, ReactNode } from "react";

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UndoRedoContextProps<T> {
  state: T;
  set: (newPresent: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (newPresent: T) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedoContext = createContext<UndoRedoContextProps<any> | undefined>(undefined);
export function useUndoRedo<T>(initialState: T) {
    const [state, setState] = useState<UndoRedoState<T>>({
      past: [],
      present: initialState,
      future: [],
    });
  
    const undo = useCallback(() => {
      setState((currentState) => {
        const { past, present, future } = currentState;
        if (past.length === 0) return currentState;
  
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      });
    }, []);
  
    const redo = useCallback(() => {
      setState((currentState) => {
        const { past, present, future } = currentState;
        if (future.length === 0) return currentState;
  
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      });
    }, []);
  
    const set = useCallback((newPresent: T) => {
      setState((currentState) => {
        const { past, present } = currentState;
        if (newPresent === present) return currentState;
  
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
      });
    }, []);
  
    const add = useCallback((newItem: T) => {
      setState((currentState) => {
        const { past, present } = currentState;
        return {
          past: [...past, present],
          present: newItem,
          future: [],
        };
      });
    }, []);
  
    const update = useCallback((updatedItem: T) => {
      setState((currentState) => {
        const { past, present } = currentState;
        return {
          past: [...past, present],
          present: updatedItem,
          future: [],
        };
      });
    }, []);
  
    const remove = useCallback((itemToRemove: T) => {
      setState((currentState) => {
        const { past, present } = currentState;
        return {
          past: [...past, present],
          present: itemToRemove,
          future: [],
        };
      });
    }, []);
  
    const reset = useCallback((newPresent: T) => {
      setState({
        past: [],
        present: newPresent,
        future: [],
      });
    }, []);
  
    return {
      state: state.present,
      set,
      add,
      update,
      remove,
      undo,
      redo,
      reset,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
    };
  }

export function UndoRedoProvider<T>({ initialState, children }: { initialState: T; children: ReactNode }) {
  const undoRedo = useUndoRedo(initialState);

  return (
    <UndoRedoContext.Provider value={undoRedo}>
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedoContext<T>() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedoContext must be used within an UndoRedoProvider");
  }
  return context as UndoRedoContextProps<T>;
}