import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then((r) => r.data);
};

const create = (newData) => {
  const req = axios.post(baseUrl, newData);
  return req.then((r) => r.data);
};

const deleteData = (oldData) => {
  const req = axios.delete(`${baseUrl}/${oldData.id}`);
  return req.then((r) => r.data);
};

const update = (id, data) =>{
    const req = axios.put(`${baseUrl}/${id}`, data)
    return req.then((r) => r.data);
}

export default { getAll, create, deleteData , update };
