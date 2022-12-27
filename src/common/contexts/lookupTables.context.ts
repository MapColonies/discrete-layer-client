import { createContext } from 'react';
import { LookupTablesDataModelType } from '../../discrete-layer/models';

interface ILookupTablesContext {
  lookupTablesData: LookupTablesDataModelType | null;
  setLookupTablesData: (lookupTablesData: LookupTablesDataModelType) => void;
}

export default createContext<ILookupTablesContext>({
  lookupTablesData: null,
  setLookupTablesData: () => { return }
});
