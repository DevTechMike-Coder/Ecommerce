import Exclusive from "@/components/nextHubCom/Exclusive";
import Hero from "@/components/nextHubCom/Hero";
import LatestCollection from "@/components/nextHubCom/LatestCollection";
import NewsLetter from "@/components/nextHubCom/NewsLetter";
import SpecialUserOffers from "@/components/nextHubCom/SpecialUserOffers";

export default function NextHub() {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <Exclusive />
      <NewsLetter />
      <SpecialUserOffers />
    </div>
  );
}
