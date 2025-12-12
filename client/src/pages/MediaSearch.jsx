import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField, Toolbar, Paper, List, ListItem, ListItemButton } from "@mui/material";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/media.api";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";

const mediaTypes = ["movie", "tv", "people"];
let timer;
const timeout = 500;

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  /** ======================
   * AUTOCOMPLETE
   =======================*/
  const [suggestions, setSuggestions] = useState([]);

  /** ======================
   * VOICE SEARCH – WEB SPEECH API
   =======================*/
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Smart correction cho tiếng Việt
  const corrections = {
    "phẩy": "phim",
    "phầy": "phim",
    "phi": "phim",
    "phim.": "phim",
    "ma vồ": "marvel",
    "ma vờ": "marvel",
    "mà vồ": "marvel",
    "mà vờ": "marvel",
    "tê la": "stella",
    "a đi mẹ": "anime",
    "a ni mê": "anime",
    "a mi mê": "anime",
  };

  const correctText = (text) => {
    let t = text.toLowerCase();

    Object.keys(corrections).forEach((key) => {
      if (t.includes(key)) {
        t = t.replace(key, corrections[key]);
      }
    });

    return t;
  };

  // INIT SPEECH RECOGNITION
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Trình duyệt không hỗ trợ Web Speech API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.continuous = false;

    // tăng độ chính xác
    recognition.maxAlternatives = 5;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;

      // sửa lỗi
      text = correctText(text);

      setQuery(text);
      search(text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startVoiceInput = () => {
    recognitionRef.current && recognitionRef.current.start();
  };

  /** ======================
   * SEARCH FUNCTION
   =======================*/
  const search = useCallback(
    async (forceText) => {
      const q = forceText || query;
      if (!q.trim()) return;

      setOnSearch(true);
      const { response, err } = await mediaApi.search({
        mediaType,
        query: q,
        page
      });
      setOnSearch(false);

      if (err) toast.error(err.message);
      if (response) {
        if (page > 1) setMedias(prev => [...prev, ...response.results]);
        else setMedias([...response.results]);
      }
    },
    [mediaType, query, page]
  );

  /** ======================
   * AUTO SEARCH ON QUERY CHANGE
   =======================*/
  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setSuggestions([]);
      setPage(1);
    } else {
      search();
    }
  }, [search, query, mediaType, page]);

  // reset page khi đổi loại media
  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  /** ======================
   * FETCH AUTOCOMPLETE
   =======================*/
  const fetchAutocomplete = async (text) => {
    if (!text.trim()) return setSuggestions([]);

    try {
      const { response } = await mediaApi.search({
        mediaType,
        query: text,
        page: 1
      });

      if (response) setSuggestions(response.results.slice(0, 6));
    } catch (err) {
      console.log(err);
    }
  };

  /** ======================
   * ON CHANGE QUERY (DEBOUNCE)
   =======================*/
  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);

    timer = setTimeout(() => {
      setQuery(newQuery);
      fetchAutocomplete(newQuery);
    }, timeout);
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack spacing={2}>

          {/* CATEGORY BUTTONS */}
          <Stack direction="row" spacing={2} justifyContent="center">
            {mediaTypes.map((item, index) => (
              <Button
                key={index}
                size="large"
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color: mediaType === item ? "primary.contrastText" : "text.primary"
                }}
                onClick={() => setMediaType(item)}
              >
                {item}
              </Button>
            ))}
          </Stack>

          {/* SEARCH BAR + MICROPHONE */}
          <Box sx={{ position: "relative" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                color="success"
                placeholder="Search Gỗ Phim..."
                sx={{ width: "100%" }}
                autoFocus
                onChange={onQueryChange}
                value={query}
              />

              <Button
                onClick={startVoiceInput}
                sx={{
                  minWidth: "50px",
                  height: "55px",
                  background: listening ? "#ff4444" : "#333",
                  color: "white",
                  fontSize: "22px",
                  borderRadius: "8px",
                  "&:hover": {
                    background: listening ? "#cc0000" : "#444"
                  }
                }}
              >
                🎤
              </Button>
            </Stack>

            {/* AUTOCOMPLETE LIST */}
            {suggestions.length > 0 && query.trim() !== "" && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "65px",
                  width: "100%",
                  zIndex: 50,
                  background: "#111",
                  border: "1px solid #333"
                }}
              >
                <List>
                  {suggestions.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          const t = item.title || item.name;
                          setQuery(t);
                          setSuggestions([]);
                          search(t);
                        }}
                      >
                        {item.title || item.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          {/* RESULTS */}
          <MediaGrid medias={medias} mediaType={mediaType} />

          {medias.length > 0 && (
            <LoadingButton
              loading={onSearch}
              onClick={() => setPage(page + 1)}
            >
              load more
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;
