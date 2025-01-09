import axios from 'axios';

const API_KEY = '6uPd0230rOa77K25LjyYywURmAniHpY8';
const BASE_URL = 'https://api.giphy.com/v1/gifs';

interface GIF {
  id: string;
  images: {
    fixed_width: {
      url: string;
    };
  };
}

export const getTrendingGifs = async (): Promise<GIF[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/trending`, {
      params: { api_key: API_KEY, limit: 20, rating: 'g' },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching trending GIFs:', error);
    return [];
  }
};

export const getFilteredGifs = async (query: string): Promise<GIF[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { api_key: API_KEY, q: query, limit: 20, rating: 'g' },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching filtered GIFs:', error);
    return [];
  }
};

export interface GiphyImage {
  fixed_width_still: any;
  fixed_width: any;
  original: any;
  fixed_width_downsampled: {
    url: string;
  };
}

export interface GiphyData {
  id: string;
  images: GiphyImage;
}

export interface GiphyApiResponse {
  data: GiphyData[];
}

export interface GIFCardProps {
  gifUrl: string;
  stillUrl: string;
  onPress: () => void;
}