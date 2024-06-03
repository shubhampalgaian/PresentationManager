import React, { createContext, useState, useContext } from "react";

const LoaderContext = createContext();
export const useLoaderContext = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoader = (state) => {
    setIsLoading(state);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, toggleLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

// export const useLoader = () => {
//   return useContext(LoaderContext);
// };
