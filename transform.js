  "use strict";
  const _ = require("lodash");
  const Promise = require("bluebird");
  const Transform = require("stream").Transform;
  const fs = require("fs");
  const split = require("split");

  class DataProcessor extends Transform {
    constructor() {
      super({objectMode: true});
    }

    processData(input) {
      return Promise.delay(1000).then(() => {
        return Promise.resolve(input);
      });
    }

    _transform(chunk, encoding, cb) {
      console.log("hi");
      this.processData(chunk)
      .then((output) => {
        output.gender = "m";
        this.push(JSON.stringify(output));
        cb();
      });
    }
  }

  const transformStream = new DataProcessor();

  const readStream = fs.createReadStream("./test.json");
  readStream.pipe(split(JSON.parse, null, {trailing: false}))
  .pipe(transformStream)
  .on("data", (data) => {
    console.log(`${JSON.stringify(data)}\n`);
  })
  .on("error", (err) => {
    console.log(`Reading file failed ${err.message}`);
  });


