"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultResultDataSchema, DefaultResultDataType, ResultData } from "../../../../../../schemas/store.schema";

const defaultResultData: DefaultResultDataType = {
  address: "",
  details: "",
  city_id: undefined,
  longitude: undefined,
  latitude: undefined,
  selectedAdminId: undefined,
  selectedAdminInfo: undefined
};

const LOCAL_STORAGE_KEY = "multi-page-create-store-result-data";

type CreateStoreType = {
  resultData: DefaultResultDataType;
  updateResultData: (resultDetail: Partial<ResultData>) => void;
  dataLoaded: boolean;
  resetData: () => void;
};

const CreateStoreContext = createContext<CreateStoreType | null>(null);

export const useResultData = () => {
  const context = useContext(CreateStoreContext);
  if (context === null) {
    throw new Error("useResultData must be used within a AddDealContextProvider");
  }
  return context;
};

export const CreateStoreProvider = ({ children }: { children: ReactNode }) => {
  const [resultData, setResultData] = useState<DefaultResultDataType>(defaultResultData);
  const [dataLoaded, setDataLoaded] = useState(false);

  const updateResultData = useCallback(
    (newData: Partial<ResultData>) => {
      setResultData((prev) => ({ ...prev, ...newData }));
    },
    [resultData],
  );

  useEffect(() => {
    readLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveLocalStorage(resultData);
    }
  }, [resultData, dataLoaded]);

  const readLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setResultData(defaultResultData);
    const validate = defaultResultDataSchema.safeParse(JSON.stringify(loadedDataString));

    if (validate.success) {
      setResultData(validate.data);
    } else {
      setResultData(defaultResultData);
    }
  };

  const saveLocalStorage = (currentData: DefaultResultDataType) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
  };

  const resetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setResultData(defaultResultData);
  };

  const contextValue = useMemo<CreateStoreType>(
    () => ({
      resultData,
      updateResultData,
      dataLoaded,
      resetData,
    }),
    [resultData, dataLoaded, updateResultData],
  );

  return <CreateStoreContext.Provider value={contextValue}>{children}</CreateStoreContext.Provider>;
};
