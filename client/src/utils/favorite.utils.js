const favoriteUtils = {
  check: ({ listFavorites, mediaId }) =>
    listFavorites && listFavorites.find(item => item.mediaId == mediaId)
};

export default favoriteUtils;
