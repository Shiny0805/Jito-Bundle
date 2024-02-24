import Pool from "components/project/pool";
import Token from "../components/project/token"
import Zombie from "../components/project/zombie"
import Users from "../components/project/users"

export default function Home() {
  return (
    <>
      <Token />
      <Zombie />
      <Pool />
      <Users />
    </>
  );
}
