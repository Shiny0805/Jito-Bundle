import Holdings from "components/token/holding";
import Market from "../components/token/market";
import Mint from "../components/token/mint";
import Token from "../components/token/token"

export default function Home() {
  return (
    <>
      <Token />
      <Mint />
      <Market />
      <Holdings />
    </>
  );
}
