import { useStores } from "../../../hooks/useStores"
import CSS, {
  AlbumContent,
  Artist,
  Cover,
  Details,
  OpenButton,
  TableContent,
  TableHeader,
  Title,
  TitleHeader,
  TopBan,
  TrackInput,
} from "./CSS"

import AddIcon from "@mui/icons-material/Add"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import RemoveIcon from "@mui/icons-material/Remove"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import Opensea from "../../../images/opensea.png"
import { Track } from "../Album/Album"

export default observer(() => {
  const {
    services: { streamer },
    user,
    album,
  } = useStores()

  useEffect(() => {
    const info = user.info
    console.log({ info })
    if (info?.name) {
      album.artist = info.name
    }
  }, [])
  const uploadTrack = (e: any) => {}
  const handleMint = (e: any) => {}
  const handleSave = (e: any) => {}
  const handleImg = (e: any) => {}
  const handleTitle = (e: any) => {
    album.title = e.target.value
  }

  return (
    <>
      <CSS />
      <AlbumContent>
        <TopBan>
          <Cover src={album.cover} alt="albumCover"></Cover>
          <Details>
            <div>ALBUM</div>
            <Title type="text" onChange={handleTitle} value={album.title} />
            <Artist>{album.artist}</Artist>
            {album.year} • {album.songs.length} Songs
          </Details>
        </TopBan>
        <TopBan>
          <OpenButton disabled={album.songs.length == 0} onClick={handleSave}>
            Upload
          </OpenButton>
          <OpenButton disabled={album.songs.length == 0} onClick={handleMint}>
            Mint
            <img src={Opensea} style={{ height: "20px" }} />
          </OpenButton>
        </TopBan>
        <TableHeader>
          <AddIcon
            className="addIcon"
            onClick={(e) => {
              album.addTrack()
            }}
          />
          <TitleHeader>TRACKS</TitleHeader>
        </TableHeader>
        {album.songs.map((song: Track, i) => {
          return (
            <div key={i}>
              <TableContent>
                <RemoveIcon
                  className="removeIcon"
                  onClick={(e) => {
                    album.remove(i)
                  }}
                />
                <TrackInput
                  type="text"
                  onChange={(e) => {
                    song.title = e.target.value
                  }}
                  value={song.title}
                />
                <CloudUploadIcon className="uploadIcon" onClick={uploadTrack} />
              </TableContent>
            </div>
          )
        })}
      </AlbumContent>
    </>
  )
})
