import { SanityClient } from '@sanity/client'
import { BikeTagApiResponse, TagData } from '../common/types'
import { constructTagDataObject, constructSanityFieldsQuery } from './helpers'
import { tagDataFields } from '../common/data'
import { getTagPayload } from '../common/payloads'

export async function getTag(
  client: SanityClient,
  options: getTagPayload
): Promise<BikeTagApiResponse<TagData>> {
  if (!options) {
    throw new Error('no options')
  }

  if (!options.slug?.length && !options.tagnumber) {
    throw new Error('no slug or tagnumber')
  }

  let slug = ''
  let tagnumber = ''

  if (options.slug) {
    slug = `&& slug.current in ${options.slug}`
  }

  if (options.tagnumber) {
    tagnumber = `&& tagnumber in ${options.tagnumber}`
  }

  const fields = constructSanityFieldsQuery(
    options.fields?.length ? options.fields : tagDataFields
  )

  const slugIsLatest = options.slug === 'latest'
  const slugIsFirst = options.slug === 'first'
  const slugQuery = slugIsLatest
    ? `|order(tagnumber desc)[0]`
    : slugIsFirst
    ? `|order(tagnumber asc)[0]`
    : slug.length
    ? slug
    : tagnumber

  const query =
    slugIsLatest || slugIsFirst
      ? `*[_type == "tag"]{${fields}}${slugQuery}`
      : `*[_type == "tag" ${slugQuery}][0]{${fields}}`

  const params = {}

  return client.fetch(query, params).then((tag) => {
    // construct tagData object from tag
    const tagData = constructTagDataObject(tag, fields)

    // wrap tag in BikeTagApiResponse
    const response = {
      data: tagData,
      status: 1,
      success: true,
      source: 'sanity',
    }

    // return BikeTagApiResponse
    return response as BikeTagApiResponse<TagData>
  })
}
