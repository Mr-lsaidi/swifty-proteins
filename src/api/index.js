import axios from "axios";

const apiRequest = () => {
  const instance = axios.create({
    baseURL: "https://files.rcsb.org/ligands/view/",
    timeout: 30000,
  });

  instance.interceptors.request.use((req) => {
    req.url = instance.defaults.baseURL + req.url;
    return req;
  });

  return instance;
};

export { apiRequest };
