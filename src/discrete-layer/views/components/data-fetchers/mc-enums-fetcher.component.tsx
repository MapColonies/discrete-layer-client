import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { McEnumsModelType } from '../../../models';
import { useQuery, useStore } from '../../../models/RootStore';

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
