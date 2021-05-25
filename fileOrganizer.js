const { createWriteStream } = require("fs");
const fs = require("fs-extra");
const path = require("path");
const homedir = require("os").homedir();
const mv = require("mv");

const downloads = path.join(homedir, "Downloads");
const movies = path.join(homedir, "Movies");
const docs = path.join(homedir, "Documents");
const images = path.join(homedir, "Pictures");
const apps = "/Applications";
const video_ext = [".mp4", ".mkv", ".ts", ".MOV"];
const text_ext = [".txt", ".doc", ".docx", ".pdf", ".pages", ".ppt,", ".xlx"];
const image_ext = [".png", ".jpeg", ".jpg", ".ico"];
const apps_ext = [".app"];

const move_file = (source, dest, counter = 0) => {
  mv(source, dest, { clobber: false }, (err) => {
    if (err) {
      if (err.code == "EEXIST") {
        const ext = path.extname(dest);
        dest = dest.split(".").slice(0, -1).join(".");
        dest = dest + ` (${counter})` + ext;
        counter++;
        move_file(source, dest, counter);
        return;
      }
      return;
    } else {
      console.log(`moved from ${source} --> ${dest}`);
    }
  });
};

fs.watch(downloads, () => {
  fs.readdir(downloads, function (err, files) {
    if (err) {
      console.log("read error");
      return;
    }
    files.forEach(function (file_name) {
      const source = downloads + "/" + file_name;

      //move videos to /user/movies
      if (video_ext.includes(path.extname(file_name))) {
        const dest = path.join(movies, file_name);
        move_file(source, dest);
      }
      //move text documents to /user/documents
      else if (text_ext.includes(path.extname(file_name))) {
        const dest = path.join(docs, file_name);
        move_file(source, dest);
      }
      //move images to /user/pictures
      else if (image_ext.includes(path.extname(file_name))) {
        const dest = path.join(images, file_name);
        move_file(source, dest);
      }
      //move Apps to /user/Applications
      else if (apps_ext.includes(path.extname(file_name))) {
        const dest = path.join(apps, file_name);
        move_file(source, dest);
      }
    });
  });
});
