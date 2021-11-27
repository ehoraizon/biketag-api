import { updateTagPayload } from '../common/payloads'
import { BikeTagApiResponse, Tag } from '../common/types'
import TwitterClient from 'twitter-v2'

export async function updateTag(
  client: TwitterClient,
  payload: updateTagPayload | updateTagPayload[]
): Promise<BikeTagApiResponse<Tag> | BikeTagApiResponse<Tag>[]> {
  // const promises: Promise<BikeTagApiResponse<TagData>>[] = []
  // const payloads = Array.isArray(payload) ? payload : [payload]

  throw new Error('updateTag not implemented for Twitter adapter')
}