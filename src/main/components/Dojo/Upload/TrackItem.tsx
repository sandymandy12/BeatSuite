import styled from "@emotion/styled"
import AirplayIcon from "@mui/icons-material/Airplay"
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"

import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PlayDisabledIcon from "@mui/icons-material/PlayDisabled"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import { observer } from "mobx-react-lite"
import { ChangeEvent, FC, useRef } from "react"
import Playlist from "../../../../common/playlist/Playlist"
import { EmptyAlbum, Track } from "../Album/Album"

const Container = styled.div`
  border-bottom: 1px solid rgb(67, 67, 67);
  display: flex;
  align-items: center;
  overflow: auto;
`

const TrackInput = styled.input`
  color: #99badd;
  background: none;
  margin-left: 4rem;
  border-radius: 5px;
  padding-left: 10px;
  overflow-x: scroll;
  width: 20rem;
  :hover {
    opacity: 0.5;
  }
`

const TrackItem: FC<{
  key: number
  song: Track
  album: EmptyAlbum
  playlist: Playlist
}> = observer(({ key, song, album, playlist }) => {
  const audioRef = useRef<HTMLInputElement>(null)

  const handlePlay = () => {
    console.log("playing")
    playlist.setActive(song)
  }
  const handleQueue = (song: Track) => {
    playlist.addNext(song)
  }

  const handleRemove = () => {
    album.remove(song)
    if (playlist.inQueue(song)) {
      playlist.remove(song)
    }
  }

  const triggerInput = () => {
    audioRef.current?.click()
  }

  const uploadTrack = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (file) {
      try {
        album.updateTrack(key, file)
        const track = { ...album.songs[key] }
        playlist.addToQueue(track)
        console.log("uploaded", track.title)
      } catch (ex) {
        console.error(ex)
      }
    }
  }

  return (
    <Container key={key}>
      <RemoveCircleOutlineIcon className="removeIcon" onClick={handleRemove} />
      <TrackInput
        type="text"
        onChange={(e) => (song.title = e.target.value)}
        value={song.title}
      />
      <CloudUploadIcon className="uploadIcon" onClick={triggerInput} />

      {song.data ? (
        <>
          <AirplayIcon className="playIcon" onClick={handlePlay} />
          <PlaylistAddIcon
            className="playIcon"
            onClick={(e) => handleQueue(song)}
          />
        </>
      ) : (
        <PlayDisabledIcon id="disabled" className="playIcon" />
      )}
      <input
        style={{ display: "none" }}
        accept="audio/*"
        type="file"
        ref={audioRef}
        onChange={uploadTrack}
      />
    </Container>
  )
})

export default TrackItem
