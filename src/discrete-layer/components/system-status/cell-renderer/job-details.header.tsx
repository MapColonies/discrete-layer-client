import React from 'react';
import { Box } from '@map-colonies/react-components';
import './job-details.header.css';
import { JobModelType, Status } from '../../../models';
import { IconButton, Typography } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';

interface JobDetailsHeaderProps {
  job: JobModelType;
}

// Component should present additional job details:
// internalId, resourceId, producerName,
// Fail reason if status failed: reason, if status === Status.Failed
// Number of tasks specification: failedTasks, inProgressTasks, completedTasks, pendingTasks

export const JobDetailsHeader: React.FC<JobDetailsHeaderProps> = ({
  job: {
    internalId,
    resourceId,
    producerName,
    reason,
    status,
    failedTasks,
    inProgressTasks,
    completedTasks,
    pendingTasks,
  },
}) => {
  const intl = useIntl();

  const getStatusTranslation = (status: Status): string => {
    return intl.formatMessage({
      id: `system-status.job.status_translation.${status as string}`,
    });
  };

  const getDetailsTranslation = (detail: string): string => {
    return intl.formatMessage({
      id: `system-status.job-details.header.${detail}`,
    });
  };

  const dataToPresent = {
    detailsRow: {
      internalId: `${getDetailsTranslation('internalId')}: ${
        internalId as string
      }`,
      externalId: `${getDetailsTranslation('extetnalId')}: ${
        resourceId as string
      }`,
      producerName: `${getDetailsTranslation('producerName')}: ${
        producerName as string
      }`,
    },
    taskCountRow: {
      completed: `${getStatusTranslation(Status.Completed)}: ${
        (completedTasks as unknown) as string
      }`,
      failed: `${getStatusTranslation(Status.Failed)}: ${
        (failedTasks as unknown) as string
      }`,
      inProgress: `${getStatusTranslation(Status.InProgress)}: ${
        (inProgressTasks as unknown) as string
      }`,
      pending: `${getStatusTranslation(Status.Pending)}: ${
        (pendingTasks as unknown) as string
      }`,
    },
    failReason: {
      reason: status === Status.Failed ? reason : 'null',
    },
  };

  const renderCopyBtn = (text: string, iconSize?: number): JSX.Element => {
    const DEFAULT_ICON_SIZE = 20;
    iconSize = iconSize ?? DEFAULT_ICON_SIZE;

    return (
      <CopyToClipboard text={text}>
        <IconButton
          style={{ fontSize: `${iconSize}px` }}
          className="mc-icon-Copy"
        />
      </CopyToClipboard>
    );
  };

  const generateDetailsRow = (): JSX.Element => {
    return (
      <>
        {Object.values(dataToPresent.detailsRow).map((val) => {
          return (
            <>
              <Typography tag="p" className="detailText">
                {val}
              </Typography>
              {renderCopyBtn(val)}
            </>
          );
        })}
      </>
    );
  };

  const generateTaskCounts = (): JSX.Element => {
    return (
      <>
        {Object.values(dataToPresent.taskCountRow).map((val) => {
          return (
            <Typography tag="p" className="countText">
              {val}
            </Typography>
          );
        })}
      </>
    );
  };

  const generateFailReason = (): JSX.Element | null => {
    const failReason = dataToPresent.failReason.reason as string;
    if (!failReason) return null;
    return (
      <>
        <Typography tag="p" className="countText">
          {failReason}
        </Typography>
        {renderCopyBtn(failReason)}
      </>
    );
  };

  return (
    <Box className={'jobDetailsHeaderContainer'}>
      <Box className={'jobInfoTop'}>
        <Box className={'detailsRow'}>{generateDetailsRow()}</Box>
        <Box className={'taskCountsRow'}>{generateTaskCounts()}</Box>
      </Box>
      <Box className={'failReasonBottom'}>{generateFailReason()}</Box>
    </Box>
  );
};
