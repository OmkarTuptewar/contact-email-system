import axios from 'axios';

export const getContactsByYearAndSeason = async (year, season) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/contacts/${year}/${season}`);
  return response.data;
};
