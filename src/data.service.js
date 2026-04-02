import fs from "fs";
const raw = process.env.SECRETS_PATH;

const dataService = {

  async getLastStatus() {
    if (!fs.existsSync(dir)) return undefined;
    try {
      const data = await fs.readFileSync(`${raw}/data.json`);
      const jsonObject = JSON.parse(data);
      return jsonObject["status"];
    } catch (err) {
      console.error('File read failure. Error:', err);
    }
  },
  async putData({ data }) {
    const jsonData = JSON.stringify(data, null, 4);
    if (!fs.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          console.error('An error occurred while create raw folder.', err);
        }
      });
    }
    await fs.writeFile(`${raw}/data.json`, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while writing file.', err);
      }
    });
  },
  async getData() {
    if (!fs.existsSync(dir)) return { "status": "data_not_exists" };
    try {
      const data = await fs.readFileSync(`${raw}/data.json`);
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