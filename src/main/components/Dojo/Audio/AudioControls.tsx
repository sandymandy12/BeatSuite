import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { useStores } from "../../../hooks/useStores"
import CSS, { Container } from "./AudioControlCSS"

import AllInclusiveIcon from "@mui/icons-material/AllInclusive"
import FastForwardIcon from "@mui/icons-material/FastForward"
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline"
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"
import RestoreIcon from "@mui/icons-material/Restore"
import SkipNextIcon from "@mui/icons-material/SkipNext"
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious"
import ToolTip from "../../../helpers/tootlTip"

import { Fade, List, Popper } from "@mui/material"
import { Box } from "@mui/system"
import PlaylistPopper from "./PlaylistPopper"

import RepeatOnIcon from "@mui/icons-material/RepeatOn"
import RepeatOneOnIcon from "@mui/icons-material/RepeatOneOn"
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled"
import { Loop } from "../Streamer/Looper"

// renders late so these are off and index
const LoopIcons = [
  AllInclusiveIcon,
  RepeatOnIcon,
  RepeatOneOnIcon,
  UpdateDisabledIcon,
]

const loopToolTips = ["Sampler", "Loop All", "Loop 1", "Loop off"]

export const TransportPlayer: FC = observer(() => {
  const rootStore = useStores()
  const {
    services: { streamer },
    playlist,
  } = rootStore

  const [unmount, setUnmount] = useState<null | SVGSVGElement>(null)

  const handlePlay = (e: React.MouseEvent) => {
    streamer.isPlaying ? streamer.pause() : streamer.play()
  }
  const handlePrevious = (e: React.MouseEvent) => {
    streamer.previous()
  }
  const handleNext = (e: React.MouseEvent) => {
    streamer.skip()
  }
  const handleRewind = (e: React.MouseEvent) => {
    const { begin, end, current, enabled } = streamer.loop

    let progress
    let tick
    if (enabled) {
      progress = Math.max(begin / end, 0.00001)
      console.log("progress - enabled", progress)
    } else {
      tick = current / end
      progress = Math.max(tick - 0.05 * end, 0.00001)
      console.log("progress - ", progress)
    }

    const setting = _loop.setting
    console.log({ tick, progress, setting })
    streamer.audio?.setState({ played: progress })
    streamer.audio?.seekTo(progress, "fraction")
  }

  const handleSeek = (e: React.MouseEvent) => {
    const { end, current } = streamer.loop
    const tick = current / end
    const progress = tick + 0.05
    console.log({ tick, progress, current, end })
    streamer.audio?.setState({ played: progress })
    streamer.audio?.seekTo(progress, "fraction")
  }

  const handlePlaylistPopper = (e: React.MouseEvent<SVGSVGElement>) => {
    setUnmount(unmount ? null : e.currentTarget)
  }

  const { _loop } = streamer
  const LoopIcon = LoopIcons[_loop.setting]

  const handleLoop = (e: React.MouseEvent) => {
    let setting = _loop.setting
    setting = setting > 2 ? 0 : setting + 1
    const enabled = setting === Loop.OFF ? false : true

    streamer.loop.enabled = setting === Loop.OFF ? false : true
    streamer._loop.setting = setting

    console.log({ setting, enabled })
  }

  const open = Boolean(unmount)
  const id = open ? "playlist-popper" : undefined

  return (
    <Container>
      <CSS />
      <div className="centralControls">
        <ToolTip title={loopToolTips[_loop.setting]}>
          <LoopIcon
            className="seekIcon"
            fontSize="medium"
            onClick={handleLoop}
          />
        </ToolTip>
        <ToolTip title="Previous">
          <SkipPreviousIcon
            className="seekIcon"
            fontSize="medium"
            onClick={handlePrevious}
          />
        </ToolTip>
        <ToolTip title="Loop back">
          <RestoreIcon
            className="seekIcon"
            fontSize="medium"
            onClick={handleRewind}
          />
        </ToolTip>

        {streamer.isPlaying ? (
          <ToolTip title="Pause">
            <PauseCircleOutlineIcon
              className="playPause"
              fontSize="large"
              onClick={handlePlay}
            />
          </ToolTip>
        ) : (
          <ToolTip title="Play">
            <PlayCircleOutlineIcon
              className="playPause"
              fontSize="large"
              onClick={handlePlay}
            />
          </ToolTip>
        )}
        <ToolTip title="Seek">
          <FastForwardIcon
            className="seekIcon"
            fontSize="medium"
            onClick={handleSeek}
          />
        </ToolTip>

        <ToolTip title="Skip">
          <SkipNextIcon
            className="seekIcon"
            fontSize="medium"
            onClick={handleNext}
          />
        </ToolTip>

        <ToolTip title="Open queue">
          <PlaylistAddIcon
            aria-describedby={id}
            className="seekIcon"
            fontSize="medium"
            onClick={handlePlaylistPopper}
          />
        </ToolTip>
        <Popper placement="right-start" id={id} open={open} anchorEl={unmount}>
          <Fade in={open} exit={true} timeout={300}>
            <Box className="playlistContainer">
              Queue
              <List component="nav" aria-label="main playlist content">
                {playlist.queue.map((track, i) => {
                  const active = streamer.active === track
                  return (
                    <PlaylistPopper
                      track={track}
                      idx={i}
                      active={active}
                      playlist={playlist}
                    />
                  )
                })}
              </List>
            </Box>
          </Fade>
        </Popper>
      </div>
    </Container>
  )
})
