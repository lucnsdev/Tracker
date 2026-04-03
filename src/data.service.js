import fs from "fs";

const dataFolder = './data';

const dataService = {

  async getLastStatus() {
    if (!fs.existsSync(dataFolder || !fs.existsSync(`${dataFolder}/data.json`))) return undefined;
    try {
      const data = await fs.readFileSync(`${dataFolder}/data.json`);
      const jsonObject = JSON.parse(data);
      return jsonObject["status"];
    } catch (err) {
      console.error('File read failure. Error:', err);
    }
  },
  async putData({ data }) {
    const jsonData = JSON.stringify(data, null, 4);
    if (!fs.existsSync(dataFolder)) {
      await fs.mkdir(dataFolder, { recursive: true }, (err) => {
        if (err) {
          console.error('An error occurred while create raw folder.', err);
        }
      });
    }
    await fs.writeFile('./data/data.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while writing file.', err);
      }
    });
  },
  async getData() {
    if (!fs.existsSync(dataFolder) || !fs.existsSync(`${dataFolder}/data.json`)) return { "status": "empty_data" };
    try {
      const data = await fs.readFileSync(`${dataFolder}/data.json`);
      const jsonObject = JSON.parse(data);
      return jsonObject;
    } catch (err) {
      console.error('File read failure. Error:', err);
    }
    return { "status": "internal_read_failure" };
    //return { "fruit": "banana", "gender": "male" };
  }
};

export default dataService;