import { observer } from "mobx-react-lite"
import { FC } from "react"
import { useStores } from "../../../hooks/useStores"
import Wallets from "../../Wallets/Wallets"
import { TransportPlayer } from "../Audio/AudioControls"
import Banner from "../Banner/Banner"
import Poster from "../Poster"
import { Upload } from "../Upload"
import {
  BodyContainer,
  Container,
  Effectdiv,
  EffectsContainer,
  EffectsH2,
  EffectsWrapper,
  MainCSS,
} from "./CSS"

const Effect: FC = () => {
  return (
    <>
      <EffectsContainer>
        <EffectsH2>Effects</EffectsH2>
        <EffectsWrapper>
          {effects.map((e, i) => {
            return <Effectdiv>{e}</Effectdiv>
          })}
        </EffectsWrapper>
      </EffectsContainer>
    </>
  )
}

const effects = ["Wicked", "tough", "wild", "ultra"]

const Body: FC = observer(() => {
  const { router } = useStores()
  const path = router.path

  return (
    <BodyContainer>
      {path === "sampler" && <Effect />}
      {path === "wallets" && <Wallets />}
      {path === "bangers" && <Poster />}
      {path === "upload" && <Upload />}
    </BodyContainer>
  )
})

const Pane: FC = () => {
  return (
    <>
      <MainCSS />
      <Container>
        <Banner />
        <Body />
        <TransportPlayer />
      </Container>
    </>
  )
}

export default Pane
