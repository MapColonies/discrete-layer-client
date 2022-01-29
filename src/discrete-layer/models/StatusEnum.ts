/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum Status {
  Pending="Pending",
InProgress="InProgress",
Completed="Completed",
Failed="Failed",
Expired="Expired"
}

/**
* Status
*/
export const StatusEnumType = types.enumeration("Status", [
        "Pending",
  "InProgress",
  "Completed",
  "Failed",
  "Expired",
      ])
