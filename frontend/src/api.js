import axios from 'axios';

export const getContactsByYearAndSeason = async (year, season) => {
  const response = await axios.get(`http://localhost:5000/api/contacts/${year}/${season}`);
  return response.data;
};
