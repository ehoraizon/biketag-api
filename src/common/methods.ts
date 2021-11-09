import {
  AccessToken,
  ClientKey,
  SanityAccessToken,
  ImgurAccessToken,
  ImgurClientId,
  ImgurCredentials,
  RedditCredentials,
  RedditClientId,
  RedditRefreshToken,
  SanityCredentials,
  SanityProjectId,
  Credentials,
  BikeTagCredentials,
  Payload,
  BikeTagConfiguration,
  Game,
} from './types'
import FormData from 'form-data'
import TinyCache from 'tinycache'

export const putCacheIfExists = (
  key: string,
  value: any,
  cache?: typeof TinyCache
): void => {
  if (cache) cache.put(key, value)
}

export const getCacheIfExists = (
  key: string,
  cache?: typeof TinyCache
): any => {
  if (cache) return cache.get(key)

  return null
}

export const isBase64 = (payload: string | Payload): boolean => {
  if (typeof payload === 'string') {
    return false
  }

  return typeof payload.base64 !== 'undefined'
}

export const isImageUrl = (payload: string | Payload): boolean => {
  if (typeof payload === 'string') {
    return true
  }

  return typeof payload.image !== 'undefined' && typeof payload === 'string'
}

export const isStream = (payload: string | Payload): boolean => {
  if (typeof payload === 'string') {
    return false
  }

  return typeof payload.stream !== 'undefined'
}

export const createForm = (payload: string | Payload): FormData => {
  const form = new FormData()

  if (typeof payload === 'string') {
    form.append('image', payload)
    return form
  }

  for (const [key, value] of Object.entries(payload)) {
    const supportedUploadObjectTypes = ['base64', 'stream']
    if (supportedUploadObjectTypes.indexOf(key) !== -1) {
      if (supportedUploadObjectTypes.indexOf(payload.type as string) !== -1) {
        form.append(key, payload)
      }
    } else {
      form.append(key, value)
    }
  }
  return form
}

export const hasAccessToken = (arg: unknown): arg is AccessToken => {
  return (arg as AccessToken).accessToken !== undefined
}

export const hasClientKey = (arg: unknown): arg is ClientKey => {
  return (arg as ClientKey).clientKey !== undefined
}

export const hasSanityAccessToken = (
  arg: unknown
): arg is SanityAccessToken => {
  return (arg as SanityAccessToken).token !== undefined
}

export const hasSanityProjectId = (arg: unknown): arg is SanityProjectId => {
  return (arg as SanityProjectId).projectId !== undefined
}

export const hasImgurAccessToken = (arg: unknown): arg is ImgurAccessToken => {
  return (arg as ImgurAccessToken).accessToken !== undefined
}

export const hasImgurClientId = (arg: unknown): arg is ImgurClientId => {
  return (arg as ImgurClientId).clientId !== undefined
}

export const constructTagNumberSlug = (number: number, game = ''): string => {
  return `${game}-tag-${number}`
}

export const isImgurCredentials = (credentials: ImgurCredentials): boolean => {
  return (
    credentials?.clientId !== undefined ||
    credentials?.clientSecret !== undefined ||
    (credentials?.clientId !== undefined && credentials?.hash !== undefined)
  )
}

export const isImgurApiReady = (credentials: ImgurCredentials): boolean => {
  return credentials?.clientId !== undefined
}

export const hasRedditClientId = (arg: unknown): arg is RedditClientId => {
  return (arg as RedditClientId).clientId !== undefined
}

export const hasRedditRefreshToken = (
  arg: unknown
): arg is RedditRefreshToken => {
  return (arg as RedditRefreshToken).refreshToken !== undefined
}

export const isRedditCredentials = (
  credentials: RedditCredentials
): boolean => {
  return (
    credentials?.clientId !== undefined ||
    (credentials?.username !== undefined && credentials.password !== undefined)
  )
}

export const isRedditApiReady = (credentials: RedditCredentials): boolean => {
  return (
    credentials?.userAgent !== undefined && credentials?.clientId !== undefined
  )
}

export const isSanityCredentials = (
  credentials: SanityCredentials
): boolean => {
  return credentials?.projectId !== undefined
}

export const isSanityApiReady = (credentials: SanityCredentials): boolean => {
  return (
    credentials.projectId !== undefined && credentials.dataset !== undefined
  )
}

export const isBikeTagCredentials = (
  credentials: BikeTagCredentials | Credentials
): boolean => {
  return (
    (credentials as Game)?.game !== undefined ||
    ((credentials as ClientKey)?.clientToken !== undefined &&
      (credentials as ClientKey)?.clientKey !== undefined)
  )
}

export const isBikeTagApiReady = (
  credentials: BikeTagCredentials | Credentials
): boolean => {
  return (
    (credentials as ClientKey).clientToken !== undefined &&
    (credentials as ClientKey).clientKey !== undefined
  )
}

export const isBikeTagConfiguration = (
  credentials: BikeTagConfiguration
): boolean => {
  return (
    credentials.biketag !== undefined ||
    credentials.sanity !== undefined ||
    credentials.reddit !== undefined ||
    credentials.imgur !== undefined
  )
}

export const createImgurCredentials = (
  credentials: Partial<ImgurCredentials>,
  defaults: Partial<ImgurCredentials> = {}
): ImgurCredentials => {
  return {
    clientId: credentials.clientId ?? defaults.clientId,
    clientSecret: credentials.clientSecret ?? defaults.clientSecret,
    hash: credentials.hash ?? defaults.hash,
    accessToken: credentials.accessToken ?? defaults.accessToken,
  }
}

export const assignImgurCredentials = (
  credentials: ImgurCredentials
): ImgurCredentials => {
  const imgurCredentials = isImgurCredentials(credentials as ImgurCredentials)
    ? createImgurCredentials(credentials)
    : undefined

  return imgurCredentials as ImgurCredentials
}

export const createSanityCredentials = (
  credentials: Partial<SanityCredentials>,
  defaults: Partial<SanityCredentials> = {}
): SanityCredentials => {
  return {
    useCdn:
      credentials.token !== undefined
        ? false
        : credentials.useCdn ?? defaults.useCdn ?? true,
    projectId: credentials.projectId ?? defaults.projectId,
    dataset: credentials.dataset ?? defaults.dataset ?? 'development',
    token: credentials.token ?? defaults.token ?? '',
    password: credentials.password ?? defaults.password,
    username: credentials.username ?? defaults.username,
    apiVersion: credentials.apiVersion ?? defaults.apiVersion ?? '2021-06-07',
  }
}

export const assignSanityCredentials = (
  credentials: SanityCredentials
): SanityCredentials => {
  const sanityCredentials = isSanityCredentials(
    credentials as SanityCredentials
  )
    ? createSanityCredentials(credentials)
    : undefined

  return sanityCredentials as SanityCredentials
}

export const createRedditCredentials = (
  credentials: Partial<RedditCredentials>,
  defaults: Partial<RedditCredentials> = {}
): RedditCredentials => {
  return {
    subreddit: credentials.subreddit ?? defaults.subreddit,
    clientId: credentials.clientId ?? defaults.clientId,
    clientSecret: credentials.clientSecret ?? defaults.clientSecret,
    password: credentials.password ?? defaults.password,
    username: credentials.username ?? defaults.username,
    refreshToken: credentials.refreshToken ?? defaults.refreshToken,
    userAgent: credentials.userAgent ?? defaults.userAgent ?? 'biketag API',
  }
}

export const assignRedditCredentials = (
  credentials: RedditCredentials
): RedditCredentials => {
  const RedditCredentials = isRedditCredentials(
    credentials as RedditCredentials
  )
    ? createRedditCredentials(credentials)
    : undefined

  return RedditCredentials as RedditCredentials
}

export const createBikeTagCredentials = (
  credentials: Partial<BikeTagCredentials>,
  defaults: Partial<BikeTagCredentials> = {}
): BikeTagCredentials => {
  return {
    game: credentials.game ?? defaults.game,
    source: credentials.source ?? defaults.source,
    clientKey: credentials.clientKey ?? defaults.clientKey,
    clientToken: credentials.clientToken ?? defaults.clientToken,
    accessToken: credentials.accessToken ?? defaults.accessToken,
  }
}

export const assignBikeTagCredentials = (
  credentials: Credentials
): BikeTagCredentials => {
  const biketagCredentials = isBikeTagCredentials(credentials as Credentials)
    ? createBikeTagCredentials(credentials)
    : undefined

  return biketagCredentials as BikeTagCredentials
}

export const assignBikeTagConfiguration = (
  config: BikeTagConfiguration
): BikeTagConfiguration => {
  const configuration: BikeTagConfiguration = {} as BikeTagConfiguration

  /// Parse individual configurations from the entire config object
  const parsedConfig = {
    biketag: assignBikeTagCredentials(config as unknown as BikeTagCredentials),
    sanity: assignSanityCredentials(config as unknown as SanityCredentials),
    imgur: assignImgurCredentials(config as unknown as ImgurCredentials),
    reddit: assignRedditCredentials(config as unknown as RedditCredentials),
  }

  /// Assign the individual configs with the parsed object plus overrides from individual configs in the passed in object
  configuration.biketag = config.biketag
    ? { ...parsedConfig.biketag, ...createBikeTagCredentials(config.biketag) }
    : parsedConfig.biketag
  configuration.sanity = config.sanity
    ? { ...parsedConfig.sanity, ...createSanityCredentials(config.sanity) }
    : parsedConfig.sanity
  configuration.imgur = config.imgur
    ? { ...parsedConfig.imgur, ...createImgurCredentials(config.imgur) }
    : parsedConfig.imgur
  configuration.reddit = config.reddit
    ? { ...parsedConfig.reddit, ...createRedditCredentials(config.reddit) }
    : parsedConfig.reddit

  return configuration
}
