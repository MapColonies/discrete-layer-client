import React from 'react';
import { Box } from '@map-colonies/react-components';
import './job-details.header.css'


interface JobDetailsHeaderProps{}

export const JobDetailsHeader: React.FC<JobDetailsHeaderProps> = () => {
    return (<Box className={'jobDetailsHeaderContainer'} />);
}