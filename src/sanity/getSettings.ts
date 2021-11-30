import { SanityClient } from '@sanity/client'
import { BikeTagApiResponse, Setting } from '../common/types'
import { AvailableApis, HttpStatusCode, DataTypes } from '../common/enums'
import {
  constructPlayerFromSanityObject,
  constructSanityDocumentQuery,
  constructSanityFieldsQuery,
} from './helpers'
import { getSettingsPayload } from '../common/payloads'

export async function getSettings(
  client: SanityClient,
  payload: getSettingsPayload
): Promise<BikeTagApiResponse<Setting[]>> {
  const fields = constructSanityFieldsQuery(payload.fields, DataTypes.setting)
  const fieldsFilter = payload.fields?.length ? payload.fields : []
  const query = constructSanityDocumentQuery(
    DataTypes[DataTypes.setting],
    payload.game,
    payload.slugs,
    undefined,
    fields
  )

  return client.fetch(query, {}).then((settingsData) => {
    const settings = settingsData.map((setting: any) =>
      constructPlayerFromSanityObject(setting, fieldsFilter)
    )

    const response = {
      data: settings,
      status: HttpStatusCode.Found,
      success: true,
      source: AvailableApis[AvailableApis.sanity],
    }

    return response as BikeTagApiResponse<Setting[]>
  })
}