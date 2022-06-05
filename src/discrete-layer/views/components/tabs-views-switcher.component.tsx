
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Fab, Tooltip, useTheme } from '@map-colonies/react-core';

import { useStore } from '../../models/RootStore';
import { TabViews } from '../tab-views';

import './tabs-views-switcher.component.css';

interface TabViewsSwitcherComponentProps {
  handleTabViewChange: (tabView: TabViews) => void;
  activeTabView: TabViews;
}

export const TabViewsSwitcher: React.FC<TabViewsSwitcherComponentProps> = observer((props) => {
  const store = useStore();
  const intl = useIntl();
  const theme = useTheme();
  const { handleTabViewChange, activeTabView } = props;
  const tabViews = [
    {
      idx: TabViews.CATALOG,
      title: 'tab-views.catalog',
      iconClassName: 'mc-icon-Catalog',
    },
    {
      idx: TabViews.SEARCH_RESULTS,
      title: 'tab-views.search-results',
      iconClassName: 'mc-icon-Search-History',
    },
    {
      idx: TabViews.CREATE_BEST,
      title: 'tab-views.create-best',
      iconClassName: 'mc-icon-Bests',
    }
  ];

  const editingBest = store.bestStore.editingBest;
  const availableTabs = (editingBest !== undefined) ? tabViews : tabViews.filter((tab) => tab.idx !== TabViews.CREATE_BEST);
  
  useEffect(() => {
    if (editingBest !== undefined) {
      handleTabViewChange(TabViews.CREATE_BEST);
    } else {
      handleTabViewChange(TabViews.CATALOG);
    }
  
  }, [editingBest]);
  
  return (
    <>
      <Box className="headerViewsSwitcherContainer">
        {
          availableTabs.map((tab) => {
            return <Tooltip key={`tabView_${tab.idx}`} content={intl.formatMessage({ id: `action.${tab.title}.tooltip` })}>
              <Box>
                <Fab 
                  key={tab.idx}
                  className={`${tab.iconClassName} tabViewIcon`}
                  mini 
                  onClick={(evt): void => handleTabViewChange(tab.idx)}
                  style={{ 
                    backgroundColor: (activeTabView === tab.idx ? theme.custom?.GC_SELECTION_BACKGROUND : theme.custom?.GC_ALTERNATIVE_SURFACE) as string, 
                  }}
                  theme={[activeTabView === tab.idx ? 'onPrimary' : 'onSurface']}
                />
              </Box>
            </Tooltip>;
          })
        }
      </Box>
      {
        store.bestStore.isDirty === true && <Box className="dirty-best-indicator"/>
      }
    </>
  );

});