import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { ICellRendererParams } from 'ag-grid-community';
import { get } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { Hyperlink } from '../../../../common/components/hyperlink/hyperlink';
import { JobModelType } from '../../../models';
import { getTokenParam } from '../../helpers/layersUtils';

import './job.details.export-job-data.css';

interface JobDetailsExportJobDataProps extends ICellRendererParams {}

const NONE = 0;
const LINK_PROPERTY_TO_PRESENT = 'dataURI';

const JobDetailsExportJobData: React.FC<JobDetailsExportJobDataProps> = ({ data }) => {
    const intl = useIntl();
    
    const isExportJob = (data as JobModelType).type?.toLowerCase().includes('export');

    const jobDescription = get(data as JobModelType, 'description') as string | undefined ?? '';
    const exportLink = get(data as JobModelType, `parameters.callbackParams.links.${LINK_PROPERTY_TO_PRESENT}`) as string | undefined;

    const exportLinkLabel = intl.formatMessage({id: 'system-status.export-details.link.label'});
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

        {typeof exportLink !== 'undefined' && (
          <Box className="exportJobLinkContainer">
            <Hyperlink
              url={exportLink}
              token={getTokenParam()}
              label={exportLinkLabel}
            />
          </Box>
        )}
      </Box>
    );
}

export default JobDetailsExportJobData;