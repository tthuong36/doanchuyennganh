import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, List, ListItem, ListItemText, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate } from "react-router-dom";
import mediaApi from "../../api/modules/media.api"; // API tìm kiếm đã có trong project bạn

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [listShow, setListShow] = useState(false);

  const wrapperRef = useRef(null);

  // ---- CLICK OUTSIDE: tắt gợi ý ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setListShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- AUTO COMPLETE ----
  useEffect(() => {
    const loadSuggestions = async () => {
      if (searchText.length < 2) {
        setSuggestions([]);
        return;
      }

      const { response } = await mediaApi.search({ query: searchText, page: 1 });

      if (response && response.results) {
        setSuggestions(response.results.slice(0, 6));
        setListShow(true);
      }
    };

    const delayDebounce = setTimeout(() => loadSuggestions(), 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  // ---- SUBMIT SEARCH ----
  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/search/${searchText}`);
    setListShow(false);
  };

  // ---- VOICE SEARCH (SPEECH RECOGNITION) ----
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ Voice Search");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN"; // hỗ trợ tiếng Việt
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSearchText(text);
      navigate(`/search/${text}`);
    };
  };

  return (
    <Box ref={wrapperRef} sx={{ position: "relative", width: "100%" }}>
      {/* Ô nhập tìm kiếm */}
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: "30px",
          backgroundColor: "#1a1a1a",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Tìm phim, series..."
          InputProps={{
            disableUnderline: true,
            style: { color: "white", paddingLeft: "10px" },
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => searchText.length > 1 && setListShow(true)}
        />

        {/* Voice Search */}
        <IconButton onClick={startVoiceSearch} sx={{ color: "orange" }}>
          <MicIcon />
        </IconButton>

        {/* Nút tìm kiếm */}
        <IconButton onClick={handleSearch} sx={{ color: "white" }}>
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Danh sách gợi ý */}
      {listShow && suggestions.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "48px",
            width: "100%",
            backgroundColor: "#111",
            color: "white",
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "10px",
            zIndex: 99,
          }}
        >
          <List>
            {suggestions.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => {
                  navigate(`/detail/${item.media_type}/${item.id}`);
                  setListShow(false);
                }}
              >
                <ListItemText
                  primary={item.title || item.name}
                  secondary={item.release_date?.split("-")[0]}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
