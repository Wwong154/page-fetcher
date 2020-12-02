const request = require('request');
const readline = require('readline');
const fs = require('fs');
const site = process.argv[2];
const file = process.argv[3];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(site, (error, response, body) => {
  if (!error) {
    if (fs.existsSync(file)) { //check file already existed
      rl.question("Do you want to overwrite existed file? 'Y'/'y' to confrim \n",   (input) => {
        if (input.toLowerCase() === 'y') {
          fs.writeFile(`${file}`, body, (err) => {
            if (err) {
              throw err;
            } else { //overwrite if user agree
              let stats = fs.statSync(`${file}`);
              console.log(`Downloaded and saved ${stats.size} bytes to ${file}`);
            }
          });
        }
        rl.close();
      });
    } else {
      fs.writeFile(`${file}`, body, (err) => {
        if (err) {
          throw new Error('The dirtory does not exist or you do not have the premission'); // if path is not vaild, tell user
        } else {
          let stats = fs.statSync(`${file}`);
          console.log(`Downloaded and saved ${stats.size} bytes to ${file}`);
          rl.close();
        }
      });
    }
  } else {
    console.log('Cannot save file: ', error); // Print error if page return error
    console.log('Respone of serevr: ', response);
  }
});
