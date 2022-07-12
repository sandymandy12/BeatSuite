import { computed, makeObservable, observable } from "mobx"
import { v4 as uuid } from "uuid"
import { DEFAULT_ALBUM_COVER } from "../../../actions/fakeImage"
import { DEFAULT_SAMPLE, Sample } from "../Streamer/Looper"

export interface Track {
  src?: string
  album: string
  title: string
  cover: string
  duration?: number
  data?: HTMLMediaElement
  file?: File
  id: number | string
  sample: Sample
}
export interface AlbumProps {
  cover: string
  title: string
  year: number
  artist: string
  songs: Track[]
  contract?: string
  id?: number | string
}

export const EmptyTrack: Track = {
  album: "",
  title: "",
  cover: "",
  sample: DEFAULT_SAMPLE,
  id: -1,
}

export class EmptyAlbum implements AlbumProps {
  _cover: string
  _title = "untitled"
  _year = new Date().getFullYear()
  _artist = "jose rando"
  _songs: Track[] = []
  _tracks = 0
  _editing: Track | undefined
  _id: any

  constructor() {
    makeObservable<
      EmptyAlbum,
      "_cover" | "_title" | "_year" | "_artist" | "_songs" | "_tracks"
    >(this, {
      _cover: observable,
      _title: observable,
      _year: observable,
      _artist: observable,
      _songs: observable,
      _tracks: observable,
      artist: computed,
      songs: computed,
      title: computed,
      cover: computed,
      ids: computed,
      resetImg: observable,
      id: computed,
    })

    this._cover = DEFAULT_ALBUM_COVER
  }

  resetImg = async () => {}

  get editing() {
    return this._editing
  }

  set editing(track: Track | undefined) {
    this._editing = track
  }

  get id() {
    return this._id
  }

  set id(i: number | string) {
    this._id = i
  }
  get ids() {
    return this._songs.map((song) => song.id)
  }

  get artist() {
    return this._artist
  }
  set artist(_artist: string) {
    this._artist = _artist
  }

  get cover() {
    return this._cover
  }

  set cover(url: string) {
    this._cover = url
  }

  get year() {
    return this._year
  }

  get title() {
    return this._title
  }

  set title(_title: string) {
    this._title = _title
  }

  get songs() {
    return [...this._songs]
  }

  set songs(_songs: Track[]) {
    this._songs = _songs
  }

  createTrack() {
    this._tracks++
    this._songs = [
      ...this._songs,
      {
        album: this.title,
        cover: this.cover as string,
        title: `untitled banger ${this._tracks}`,
        id: uuid(`untitled-${this._tracks}`),
        sample: DEFAULT_SAMPLE,
      },
    ]
  }

  addFromFile(file: File) {
    const src = URL.createObjectURL(file)
    const data = new Audio(src)
    const id = Buffer.from(file.name.trim().replace(/\s/g, "")).toString()
    const track: Track = {
      album: this.title,
      cover: this.cover,
      title: file.name,
      sample: DEFAULT_SAMPLE,
      src,
      data,
      file,
      id,
    }

    this._songs = [...this.songs, track]
    return track
  }

  addFromMidi(blob: Blob) {
    const src = URL.createObjectURL(blob)
    const data = new Audio(src)
    const name = this.editing
      ? this.editing.title
      : `midiBanger-${this._tracks}`
    const id = uuid(name)
    const track: Track = {
      album: this.title,
      cover: this.cover,
      title: name,
      sample: DEFAULT_SAMPLE,
      src,
      data,
      id,
    }
    this._tracks++
    this._songs = [...this.songs, track]
    this.editing = undefined
    return track
  }

  remove(track: Track) {
    const idx = this.songs.indexOf(track)
    this._songs.splice(idx, 1)
  }

  updateTrack(idx: number, file: File) {
    const songs = this.songs
    const song = songs[idx]

    const src = URL.createObjectURL(file)
    const data = new Audio(src)

    songs.splice(idx, 1, {
      ...song,
      album: this.title,
      title: file.name,
      src,
      data,
    })
    this.songs = songs
  }
}
