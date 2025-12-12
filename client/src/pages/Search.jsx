import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mediaApi from "../api/modules/media.api";
import MediaGrid from "../components/common/MediaGrid";

const Search = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const search = async () => {
      const { response } = await mediaApi.search({ query });
      if (response) setResults(response.results);
    };
    search();
  }, [query]);

  return (
    <div>
      <h2 style={{ color: "white" }}>Search results for: {query}</h2>

      <MediaGrid medias={results} />
    </div>
  );
};

export default Search;
