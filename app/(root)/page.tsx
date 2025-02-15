import Image from "next/image";
import Hello from "@/components/hello"
import SearchForm from "@/components/SearchForm"

export default async function Home({searchParams} : {searchParams: Promise<{query?: string}>}) {
  console.log("sex");
  const query = (await searchParams).query;
  return (
    <>


    <section className="pink_container">
    <h1 className="heading">IDEAS WILL COME TO LIFE AND THAT IS THE INTENTION</h1>
    <p className="sub-heading !max-w-3xl">Spot outlier academic papers that rise unexpectedly in influence.</p><br></br>
    <p className="sub-heading !max-w-3xl">Be part of the discovery and showcase your ideas for <strong>Decentralized Peer Review</strong></p>

    <SearchForm query = {query}/>



    </section>
    </>

    
  );
}
