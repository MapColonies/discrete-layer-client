import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useStore } from '../../../models/RootStore';
import { McEnumsModelType } from '../../../models';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';

export const MCEnumsFetcher: React.FC = observer(() => {
  const store = useStore();
  const mcEnumsQuery = useQuery((store) => store.queryGetMcEnums());
  const { setEnumsMap } = useContext(EnumsMapContext);

  useEffect(() => {
    if (!mcEnumsQuery.loading) {
      const enums = mcEnumsQuery.data?.getMcEnums;
      setEnumsMap((enums as McEnumsModelType).enums as IEnumsMapType);
    }
  }, [mcEnumsQuery.data, mcEnumsQuery.loading, store.discreteLayersStore]);
  
  return (
    <></>
  );
});
