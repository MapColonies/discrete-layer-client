import { createContext } from 'react';

export type LookupKey = 'classificationList' | 'countryList';

export interface ILookupOption {
  value: string;
  translationCode?: string;
  properties: Record<string, unknown>
}

export interface ILookupTablesData {
  countryList?: ILookupOption[];
  classificationList?: ILookupOption[];
}

interface ILookupTablesContext {
  lookupTablesData?: ILookupTablesData;
  setLookupTablesData: (lookupTablesData: ILookupTablesData) => void;
}

export default createContext<ILookupTablesContext>({
  setLookupTablesData: () => { return }
});
