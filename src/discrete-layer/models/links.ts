/* eslint-disable @typescript-eslint/naming-convention */
import { LinkType } from '../../common/models/link-type.enum';

const {
  WMTS_LAYER,
  XYZ_LAYER,
  THREE_D_LAYER,
  THREE_D_TILES,
  TERRAIN_QMESH,
  WMTS,
  WMS,
  WCS,
  THUMBNAIL_S,
  THUMBNAIL_M,
  THUMBNAIL_L,
  LEGEND_DOC,
  LEGEND_IMG,
  LEGEND,
} = LinkType;

interface IValidation {
  errorMsgCode: string;
  fileSize?: number;
}

export interface ILink {
  linkAction: 'copy' | 'link';
  editable?: boolean;
  validation?: IValidation[];
  fileTypes?: string;
  isMulti?: boolean;
}

export const links: Partial<Record<LinkType, ILink>> = {
  [WMTS_LAYER]: { linkAction: 'copy' },
  [XYZ_LAYER]: { linkAction: 'copy' },
  [THREE_D_LAYER]: { linkAction: 'copy' },
  [THREE_D_TILES]: { linkAction: 'copy' },
  [TERRAIN_QMESH]: { linkAction: 'copy' },
  [WMTS]: { linkAction: 'copy' },
  [WMS]: { linkAction: 'copy' },
  [WCS]: { linkAction: 'copy' },
  [THUMBNAIL_S]: {
    linkAction: 'link',
    editable: true,
    validation: [
      {
        errorMsgCode: 'validation-field.links.fileSize',
        fileSize: 128
      }
    ],
    fileTypes: '.png'
  },
  [THUMBNAIL_M]: {
    linkAction: 'link',
    editable: true,
    validation: [
      {
        errorMsgCode: 'validation-field.links.fileSize',
        fileSize: 400
      }
    ],
    fileTypes: '.png'
  },
  [THUMBNAIL_L]: {
    linkAction: 'link',
    editable: true,
    validation: [
      {
        errorMsgCode: 'validation-field.links.fileSize',
        fileSize: 600
      }
    ],
    fileTypes: '.png'
  },
  [LEGEND_DOC]: {
    linkAction: 'link',
    editable: true,
    fileTypes: '.pdf'
  },
  [LEGEND_IMG]: {
    linkAction: 'link',
    editable: true,
    fileTypes: '.png,.bmp,.jpeg,.jpg'
  },
  [LEGEND]: {
    linkAction: 'link',
    editable: true,
    fileTypes: '.json'
  },
};
