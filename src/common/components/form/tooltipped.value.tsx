import React, { useMemo, useRef } from 'react';
import { Typography, Tooltip } from '@map-colonies/react-core';
import useIsEllipsisActive from '../../hooks/isEllipsisActive.hook';

export interface TooltippedValueProps {
  tag?: string | React.ComponentType<unknown>;
  className?: string;
  disableTooltip?: boolean;
  alwaysTooltip?: boolean;
  customTooltipText?: string;
}

const TooltippedValue: React.FC<TooltippedValueProps> = ({
  tag = 'span',
  className = '',
  disableTooltip = false,
  alwaysTooltip = false,
  customTooltipText = '',
  children,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const isEllipsisActive = useIsEllipsisActive(elementRef);
  const typographyElement = useMemo(() => (
    <Typography dir="auto" ref={elementRef} className={className} tag={tag}>
      {children}
    </Typography>
  ), [children]);

  return alwaysTooltip || (isEllipsisActive && !disableTooltip) ? (
    <Tooltip content={customTooltipText || typographyElement}>{typographyElement}</Tooltip>
  ) : (
    typographyElement
  );
};

export default TooltippedValue;
