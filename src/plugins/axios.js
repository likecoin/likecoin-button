import axios from 'axios';

const options = {
  timeout: 30000,
};
// The server-side needs a full url to works
// if (process.server) {
//   options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
// }

const instance = axios.create(options);
export default instance;
