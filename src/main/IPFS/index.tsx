import { create, IPFSHTTPClient } from "ipfs-http-client"
import { AlbumProps, EmptyTrack, Track } from "../components/Dojo/Album/Album"

const projectId = process.env.REACT_APP_IPFS_ID
const projectSecret = process.env.REACT_APP_IPFS_SECRET
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64")

export const IPFS_URL = "https://beatsuite.infura-ipfs.io/ipfs/"

const ipfs = async (file: any) => {
  console.log("uploading to IPFS")
  let client: IPFSHTTPClient | undefined

  try {
    client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    })

    const { path } = await client.add(file)

    return path
  } catch (error) {
    console.error("IPFS error", error)
    client = undefined
  }
}

export const generateHash = async (src: string) => {
  const response = await fetch(src)
  const arrayBuffer = await response.arrayBuffer()
  const hash = await ipfs(arrayBuffer)
  return hash
}

export const createTrack = async (song: Track, album: AlbumProps) {
  if (!song.src) {
    return EmptyTrack
  }
  const songHash = await generateHash(song.src)
  const id = songHash ? songHash : song.id
  const src = (await IPFS_URL) + songHash
  console.log({ src })
  const track: Track = {
    cover: album.cover,
    album: album.title,
    title: song.title,
    sample: song.sample,
    id,
    src,
  }
  return track
}

export default ipfs
