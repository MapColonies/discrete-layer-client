import { createContext } from 'react';

export interface ILookupOption {
  value: string;
  translationCode?: string;
  properties: Record<string, unknown>
}

export interface ILookupTablesData {
  countryList: ILookupOption[];
  classificationList: ILookupOption[];
}

interface ILookupTablesContext {
  lookupTablesData: ILookupTablesData | null;
  setLookupTablesData: (lookupTablesData: ILookupTablesData) => void;
}

export default createContext<ILookupTablesContext>({
  lookupTablesData: null,
  setLookupTablesData: () => { return }
});
