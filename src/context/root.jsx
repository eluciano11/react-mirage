import React, { createContext, useContext } from 'react';
import RootStore from '../stores/root';


const RootStoreContext = createContext();

const RootStoreProvider = ({ children }) => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      {children}
    </RootStoreContext.Provider>
  )
}

const useRootStore = () => {
  return useContext(RootStoreContext);
}

export {
  useRootStore,
  RootStoreProvider
}