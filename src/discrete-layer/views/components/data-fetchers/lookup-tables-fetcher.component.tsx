import { observer } from 'mobx-react';
import React, { useContext, useEffect } from 'react';
import lookupTablesContext, { ILookupTablesData } from '../../../../common/contexts/lookupTables.context';
import { useQuery, useStore } from '../../../models/RootStore';

export const LookupTablesFetcher: React.FC = observer(() => {
  const store = useStore();
  const { data, loading } = useQuery((store) => store.queryGetLookupTablesData({},
    `classificationList
  `));

  const { setLookupTablesData } = useContext(lookupTablesContext);

  useEffect(() => {
    if (!loading) {
      const lookupTablesData = data?.getLookupTablesData as ILookupTablesData;
      setLookupTablesData(lookupTablesData);
    }
  }, [data, loading, store.discreteLayersStore]);

  return (
    <></>
  );
});
