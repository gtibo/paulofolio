import fs from "fs";
import path from "path";
import image_size from "image-size";
import sharp from "sharp";

let image_sizes = [{
  name: "small",
  width: 520
}, {
  name: "medium",
  width: 920
}, {
  name: "large",
  width: 1920
}]

let to_explores = [];
to_explores.push(
  path.resolve("./static/media")
);

while (to_explores.length != 0) {
  let current_path = to_explores[0];
  let files = fs.readdirSync(to_explores[0]);
  to_explores.shift(0);
  for (var i = files.length - 1; i >= 0; i--) {
    let file = files[i],
      file_path = path.join(current_path, file),
      is_dir = fs.statSync(file_path).isDirectory();
    if (is_dir) {
      to_explores.push(file_path);
      continue;
    }
    set_meta(file, file_path, current_path);
  }
}

function set_meta(file_name, file_path, location_path) {
  let file_extension = path.extname(file_name);
  let file_type = watdat(file_extension);
  // Don't set meta if not a video or image
  if (!file_type) return;
  let meta_path = path.join(location_path, file_name + "_meta.json"),
    already_have_meta = fs.existsSync(meta_path);
  // Skip if media is older than already existing meta data
  if (
    already_have_meta &&
    new Date(fs.statSync(meta_path).mtime) >
    new Date(fs.statSync(file_path).mtime)
  ) return;

  let meta_data =
    (already_have_meta) ?
    JSON.parse(fs.readFileSync(meta_path, {
      encoding: 'utf8'
    })) : {};

  meta_data.type = file_type;

  switch (file_type) {
    case "image":
      let dimensions = image_size(file_path);
      meta_data.width = dimensions.width;
      meta_data.height = dimensions.height;
      meta_data.formats = {};
      // resize images
      let resize_path = path.resolve("./static/media_resize")
      image_sizes.forEach(new_format => {
        let format_path = file_path;
        if (meta_data.width >= new_format.width) {
          format_path = path.join(resize_path, `${path.basename(file_name,file_extension)}_${new_format.name}${file_extension}`);
          sharp(file_path).resize({
            width: new_format.width
          }).toFile(format_path);
        }
        meta_data.formats[new_format.name] = format_path.split("static").pop();

      })
      meta_data.alt = meta_data.alt || "";
      break;
    case "video":
      console.log("Should do smth...");
      break;
    default:
  }

  meta_data.path = file_path.split("static").pop();
  fs.writeFileSync(meta_path, JSON.stringify(meta_data), (err) => {
    if (err) console.log(err);
  });
  console.log(`${file_name} Updated`);
}

function watdat(extension) {
  extension = extension.replace(".", "").toLowerCase();
  let formats = {
    'video': 'mp4|webm',
    'image': 'png|jpeg|jpg|webp|gif'
  }
  for (var type in formats) {
    let f = new RegExp(formats[type], 'g');
    if (extension.match(f)) return type;
  }
  return false;
}
