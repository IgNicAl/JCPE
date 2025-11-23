import ReactPlayer from 'react-player';

export const getVideoThumbnail = (url: string | undefined): string => {
  if (!url) return 'https://placehold.co/600x400?text=No+Video';

  // YouTube
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }

  // If not a known video service, assume it's an image URL
  return url;
};

export const isVideoUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  return ReactPlayer.canPlay(url);
};


