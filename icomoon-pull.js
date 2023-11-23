const download = require('download');
const path = require('path');
const url = require('url');
const fs = require('fs');
const tmp = require('tmp');

class IcomoonPull {
  constructor() {
    var args = process.argv.slice(2);

    fs.readFile('./.icomoonrc.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading .icomoonrc.json file. Please create one. See README.md for more information.');
        return;
      }

      for (let key in JSON.parse(data)) {
        if (args.length > 0 && !args.includes(key)) {
          continue;
        }
        try {
          this.run(key, JSON.parse(data)[key]);
        } catch (e) {
          console.error(e);
        }
      }
    })
  }

  run(key, options) {
    const defaultOptions = {
      clean: false,
      fontsPath: './fonts',
      fontsRelativePath: 'fonts',
      styleFile: './icomoon.css',
    }
    options = Object.assign(defaultOptions, options);

    console.log('Download icomoon font for ' + key + ' from ' + options.link);

    if (!options.link || options.link.length === 0) {
      console.error('missing link option.')
      return;
    }

    const urlPart = this.urlWithOutFile(options.link);
    const tmpDirPath = tmp.dirSync({prefix: 'icomoon-pull'}).name;

    download(options.link, tmpDirPath).then(() => {
      fs.readFile(path.join(tmpDirPath, 'style.css'), (err, data) => {
        if (err) throw err;

        let fontFiles = this.collectFontFiles(data.toString());

        Promise.all(
          [...new Set(fontFiles)]
            .map(x => download(x, tmpDirPath))).then(() => {
          // create directory if not exists
          this.createFolderIfNeeded(options.fontsPath, options.clean);
          this.createFolderIfNeeded(path.dirname(options.styleFile));

          // copy style file and replace font path
          let style = fs.readFileSync(path.join(tmpDirPath, 'style.css')).toString();

          // write style file
          let openSyncFD = fs.openSync(options.styleFile, 'w', 0o644);
          fs.writeSync(openSyncFD, style.replace(new RegExp(urlPart, 'g'), options.fontsRelativePath));

          fontFiles.forEach((file) => this.copy(file, tmpDirPath, options.fontsPath));
          console.log('Pulling icomoon font for ' + key + ' finished.')
        });
      });
    });
  }


  copy(file, tmpDirPath, fontsPath) {
    let fileName = url.parse(file).pathname.split("/").pop();

    let tmpFontName = path.join(tmpDirPath, fileName);
    let destFilePath = path.join(fontsPath, fileName);
    fs.copyFileSync(tmpFontName, destFilePath);
  }

  urlWithOutFile(link) {
    let parsedUrl = url.parse(link);
    let path = parsedUrl.pathname.split("/");
    // remove the last part
    path.pop();
    // rebuild the url
    return parsedUrl.protocol + '//' + parsedUrl.hostname + path.join('/');
  }

  createFolderIfNeeded(dir, clean) {
    if (clean && fs.existsSync(dir)) {
      console.log("Clean option was set. Remove existing dir " + dir);
      fs.rmSync(dir, {recursive: true, force: true});
    }

    if (!fs.existsSync(dir)) {
      console.log("Create directory " + dir);
      fs.mkdirSync(dir, {recursive: true});
    }
  }

  collectFontFiles(style) {
    let regex = new RegExp(/url\(\'(.*)\?.*\'\)/g);
    let fontFiles = [];
    let match = '';
    while (match = regex.exec(style)) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      fontFiles.push(match[1]);
    }
    return fontFiles;
  }
}

new IcomoonPull();
