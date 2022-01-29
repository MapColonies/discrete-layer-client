import React from 'react';
import { Box } from '@map-colonies/react-components';
import './job-details.header.css';
import { JobModelType, Status } from '../../../models';
import { Typography } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import { CopyButton } from '../job-details.copy-button';

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
      internalId: {
        label: getDetailsTranslation('internalId'),
        value: internalId as string,
      },
      externalId: {
        label: getDetailsTranslation('extetnalId'),
        value: resourceId as string,
      },
      producerName: {
        label: getDetailsTranslation('producerName'),
        value: producerName as string,
      },
    },
    taskCountRow: {
      completed: {
        label: getStatusTranslation(Status.Completed),
        value: (completedTasks as unknown) as string,
      },
      failed: {
        label: getStatusTranslation(Status.Failed),
        value: (failedTasks as unknown) as string,
      },
      inProgress: {
        label: getStatusTranslation(Status.InProgress),
        value: (inProgressTasks as unknown) as string,
      },
      pending: {
        label: getStatusTranslation(Status.Pending),
        value: (pendingTasks as unknown) as string,
      },
    },
    failReason: {
      reason: status === Status.Failed ? reason : null,
    },
  };


  const generateDetailsRow = (): JSX.Element => {
    return (
      <>
        {Object.values(dataToPresent.detailsRow).map(({ label, value }, index) => {
          return (
            <Box className="detailsField" key={`${label}${index}`}>
              <Typography tag="p" className="detailLabel">
                {`${label}:`}
              </Typography>
              <Typography tag="p" className="detailValue">
                {value}
              </Typography>
              <CopyButton text={value}/>
            </Box>
          );
        })}
      </>
    );
  };

  const generateTaskCounts = (): JSX.Element => {
    const localeValueWithCommas = (value: string): string => Number(value).toLocaleString();

    return (
      <>
        {Object.values(dataToPresent.taskCountRow).map(({ label, value },index) => {
          return (
            <Box className="counterField" key={`${label}${index}`}>
              <Typography tag="p" className="countLabel">
                {`${label}:`}
              </Typography>
              <Typography tag="p" className="countValue">
                {localeValueWithCommas(value)}
              </Typography>
            </Box>
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
        <Typography tag="p" className="failReasonText">
          {failReason}
        </Typography>
        <CopyButton text={failReason}/>
      </>
    );
  };

  return (
    <Box className="jobDetailsHeaderContainer">
      <Box className="jobInfoTop">
        <Box className="detailsRow">{generateDetailsRow()}</Box>
        <Box className="taskCountsRow">{generateTaskCounts()}</Box>
      </Box>
      <Box className="failReasonBottom">{generateFailReason()}</Box>
    </Box>
  );
};
