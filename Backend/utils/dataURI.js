import DataURIParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  const parser = new DataURIParser();
  const ext = path.extname(file.originalname).toString();
  return parser.format(ext, file.buffer);
};

export default getDataUri;
