import { Status } from "../../models"

export const FINAL_STATUSES = [
    Status.Completed,
    Status.Expired,
    Status.Failed,
]

export const FINAL_NEGATIVE_STATUSES = [
    Status.Expired,
    Status.Failed,
]

export const JOB_ENTITY = 'Job';