import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { ICellRendererParams } from 'ag-grid-community';
import { get } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { Hyperlink } from '../../../../common/components/hyperlink/hyperlink';
import { JobModelType, Status } from '../../../models';
import { getTokenParam } from '../../helpers/layersUtils';

import './job.details.export-job-data.css';

interface JobDetailsExportJobDataProps extends ICellRendererParams {}

const NONE = 0;

const JobDetailsExportJobData: React.FC<JobDetailsExportJobDataProps> = ({ data }) => {
    const intl = useIntl();
    const jobData = data as JobModelType;
    
    const isExportJob = jobData.type?.toLowerCase().includes('export');

    const jobDescription = jobData.description as string | undefined ?? '';
    const exportLinks = get(jobData, `parameters.callbackParams.links`) as Record<string, string> | undefined;

    const jobStatus = jobData.status;

    // const exportLinkLabel = intl.formatMessage({id: 'system-status.export-details.link.label'});
    const jobNoDescriptionText = intl.formatMessage({id: 'system-status.export-details.no-description.text'});
    
    const jobDescriptionText = intl.formatMessage(
      { id: 'system-status.export-details.description.text' },
      {
        desc:
          jobDescription.length === NONE
            ? jobNoDescriptionText
            : jobDescription,
      }
    );

    if(!(isExportJob as boolean)) return null;

    return (
      <Box className="exportJobDataContainer">
        <Box className="jobDescriptionContainer">
          <Typography tag="p" className="jobDescription">
            {jobDescriptionText}
          </Typography>
        </Box>

        {typeof exportLinks !== 'undefined' && jobStatus === Status.Completed && (
          <Box className="exportJobLinkContainer">
            {Object.entries(exportLinks).map(([linkType, exportLink]) => {
              const typeToPresent = linkType.replace('URI', '');
              return (
                <Hyperlink
                  url={exportLink}
                  token={getTokenParam()}
                  label={typeToPresent}
                />
              );
            })}
          </Box>
        )}
      </Box>
    );
}

export default JobDetailsExportJobData;