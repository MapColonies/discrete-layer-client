/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum ProductType {
  ORTHOPHOTO = "Orthophoto",
  ORTHOPHOTO_HISTORY = "OrthophotoHistory",
  ORTHOPHOTO_BEST = "OrthophotoBest",
  RASTER_MAP = "RasterMap",
  RASTER_MAP_BEST = "RasterMapBest",
  RASTER_AID = "RasterAid",
  RASTER_AID_BEST = "RasterAidBest",
  RASTER_VECTOR = "RasterVector",
  RASTER_VECTOR_BEST = "RasterVectorBest",
  VECTOR_BEST = "VectorBest",
  DTM = "DTM",
  DSM = "DSM",
  QUANTIZED_MESH = "QuantizedMesh",
  PHOTO_REALISTIC_3D = "3DPhotoRealistic",
  POINT_CLOUD = "PointCloud"
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
  "POINT_CLOUD",
      ])
