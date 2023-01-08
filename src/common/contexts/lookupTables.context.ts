import { createContext } from 'react';

export interface ILookupOption {
  value: string;
  translationCode?: string;
  properties: Record<string, unknown>
}
export interface ILookupTableData {
  dictionary?: Record<string, ILookupOption[]>;
}

interface ILookupTablesContext {
  lookupTablesData?: ILookupTableData;
  setLookupTablesData: (lookupTablesData: ILookupTableData) => void;
}

export default createContext<ILookupTablesContext>({
  setLookupTablesData: () => { return }
});
