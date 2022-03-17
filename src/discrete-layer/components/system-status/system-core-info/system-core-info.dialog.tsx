import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@map-colonies/react-components';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@map-colonies/react-core';
import { FormattedMessage } from 'react-intl';
import { useQuery, useStore } from '../../../models/RootStore';
import { ExternalServiceModelType } from '../../../models';
import { DeploymentWithServicesModelType } from '../../../models';

import './system-core-info.dialog.css';
import { cloneDeep } from 'lodash';
import { GraphQLError } from '../../../../common/components/error/graphql.error-presentor';
import { ExternalService } from './external-service/external-service';
import { ClusterService } from './cluster-service/cluster-service';

interface SystemCoreInfoDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const SystemCoreInfoDialog: React.FC<SystemCoreInfoDialogProps> = observer(
  ({ isOpen, onSetOpen }: SystemCoreInfoDialogProps) => {
    const store = useStore();
    const clusterServicesQuery = useQuery();
    const externalServicesQuery = useQuery();

    const [clusterServices, setClusterServices] = useState<DeploymentWithServicesModelType[]>([]);
    const [externalServices, setExternalServices] = useState<ExternalServiceModelType[]>([]);
    const [clusterServicesError, setClusterServicesError] = useState<Record<string, unknown> | null>(null);
    const [externalServicesError, setExternalServicesError] = useState<Record<string, unknown> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      clusterServicesQuery.setQuery(store.queryGetClusterServices());
      externalServicesQuery.setQuery(store.queryGetExternalServices());
    }, []);

    useEffect(() => {
      // eslint-disable-next-line
      const { data, loading, error } = clusterServicesQuery;

      if (!loading) {
        if (error as boolean) {
          console.log('cluster error', error);
          setClusterServicesError(error);
        } else if (data) {
          const internalServices = cloneDeep(
            (data as { getClusterServices: DeploymentWithServicesModelType[] })
              .getClusterServices
          );
          setClusterServices(internalServices);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      clusterServicesQuery.data,
      clusterServicesQuery.loading,
      clusterServicesQuery.error,
    ]);

    useEffect(() => {
      // eslint-disable-next-line
      const { data, loading, error } = externalServicesQuery;
      console.log(data, loading, error);
      if (!loading) {
        if (error as boolean) {
          setExternalServicesError(error);
        } else if (data) {
          const externalServices = cloneDeep(
            (data as { getExternalServices: ExternalServiceModelType[] })
              .getExternalServices
          );
          setExternalServices(externalServices);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      externalServicesQuery.data,
      externalServicesQuery.loading,
      externalServicesQuery.error,
    ]);

    useEffect(() => {
      setIsLoading(
        externalServicesQuery.loading || clusterServicesQuery.loading
      );
    }, [externalServicesQuery.loading, clusterServicesQuery.loading]);

    const closeDialog = useCallback(() => {
      onSetOpen(false);
    }, [onSetOpen]);

    const renderClusterServices = useCallback(() => {
      let renderContent;

      if (clusterServicesError) {
        renderContent = <GraphQLError error={clusterServicesError} />;
      } else {
        renderContent = clusterServices.map((service) => {
          return (
            <ClusterService service={service} key={service.name as string} />
          );
        });
      }

      return <Box className="flex-column-center">{renderContent}</Box>;
      
    }, [clusterServicesError, clusterServices]);

    const renderExternalServices = useCallback(() => {
      let renderContent;

      if (externalServicesError) {
        renderContent = <GraphQLError error={externalServicesError} />;
      } else {
        renderContent = externalServices.map((service) => {
          return (
            <ExternalService service={service} key={service.url as string} />
          );
        });
      }

      return <Box className="flex-column-center">{renderContent}</Box>;

    }, [externalServicesError, externalServices]);

    return (
      <Box id="systemCoreInfoDialog">
        <Dialog open={isOpen} preventOutsideDismiss={true}>
          <DialogTitle>
            <FormattedMessage id="system-core-info.title" />

            <IconButton
              className="closeIcon mc-icon-Close"
              onClick={(): void => {
                closeDialog();
              }}
            />
          </DialogTitle>
          <DialogContent id="systemCoreInfoBody">
            {isLoading ? (
              <Box className="loader">
                <CircularProgress />
                <Typography className={'loaderText'} tag={'p'}>
                  <FormattedMessage id="general.loading.text" />
                </Typography>
              </Box>
            ):(
              <>
                <Box className="sectionTitle flex-column-center">
                  <FormattedMessage id="system-core-info.externalServicesTitle" />
                </Box>

                <Box className="section">{renderExternalServices()}</Box>

                <Box id="seperator" />

                <Box className="sectionTitle flex-column-center">
                  <FormattedMessage id="system-core-info.innerServicesTitle" />
                </Box>

                <Box className="section">{renderClusterServices()}</Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
);
