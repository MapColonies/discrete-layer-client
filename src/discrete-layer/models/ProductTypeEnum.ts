/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum ProductType {
  ORTHOPHOTO="ORTHOPHOTO",
ORTHOPHOTO_HISTORY="ORTHOPHOTO_HISTORY",
ORTHOPHOTO_BEST="ORTHOPHOTO_BEST",
RASTER_MAP="RASTER_MAP",
RASTER_MAP_BEST="RASTER_MAP_BEST",
RASTER_AID="RASTER_AID",
RASTER_AID_BEST="RASTER_AID_BEST",
RASTER_VECTOR="RASTER_VECTOR",
RASTER_VECTOR_BEST="RASTER_VECTOR_BEST",
VECTOR_BEST="VECTOR_BEST",
DTM="DTM",
DSM="DSM",
QUANTIZED_MESH="QUANTIZED_MESH",
PHOTO_REALISTIC_3D="PHOTO_REALISTIC_3D"
}

/**
* ProductType
*/
export const ProductTypeEnumType = types.enumeration("ProductType", [
        "ORTHOPHOTO",
  "ORTHOPHOTO_HISTORY",
  "ORTHOPHOTO_BEST",
  "RASTER_MAP",
  "RASTER_MAP_BEST",
  "RASTER_AID",
  "RASTER_AID_BEST",
  "RASTER_VECTOR",
  "RASTER_VECTOR_BEST",
  "VECTOR_BEST",
  "DTM",
  "DSM",
  "QUANTIZED_MESH",
  "PHOTO_REALISTIC_3D",
      ])
