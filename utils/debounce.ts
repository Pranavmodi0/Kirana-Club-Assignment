import { debounce } from 'lodash';
import { getFilteredGifs } from '../api/giphy';

export const debouncedSearch = debounce(async (searchTerm: string, setGifs: React.Dispatch<React.SetStateAction<any[]>>) => {
  const gifs = await getFilteredGifs(searchTerm);
  setGifs(gifs);
}, 500);