/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum OperationType {
  INCREMENT="INCREMENT",
EXPLICIT="EXPLICIT",
COPY="COPY"
}

/**
* OperationType
*/
export const OperationTypeEnumType = types.enumeration("OperationType", [
        "INCREMENT",
  "EXPLICIT",
  "COPY",
      ])
