import fs from "fs";
import path from "path";
import fm from "front-matter";
import MarkdownIt from "markdown-it";
let md = new MarkdownIt();

export default function get_projects() {

  let project_path = path.resolve("./static/content/projects/");
  let project_file_list = fs.readdirSync(project_path);
  return project_file_list.map(project_file_name => {
    let content_file_path = path.join(project_path, project_file_name);
    let raw_content = fs.readFileSync(content_file_path, {
      encoding: 'utf8'
    });
    raw_content = fm(raw_content);
    let extension = path.extname(project_file_name);
    raw_content.attributes.slug = path.basename(project_file_name, extension);
    let {
      attributes
    } = raw_content;

    if (attributes.vignette) {
      let meta_file_path = path.resolve(`./static/media/${attributes.vignette}_meta.json`);
      attributes.vignette = get_meta(meta_file_path);
    }

    return {
      ...attributes,
      body: parse_inline_content(raw_content.body)
    };
  });
}

function parse_inline_content(content) {
  let lines = content.split("\n");
  return lines.map(line => {
    if (line.charAt(0) == "!") {
      let meta_file_name = line.replace("!", "") + "_meta.json",
        meta_file_path = path.resolve("./static/media/", meta_file_name);
      return get_meta(meta_file_path);

    } else {
      return {
        type: "html",
        content: md.render(line)
      };
    }
  });
}


function get_meta(path) {
  return JSON.parse(fs.readFileSync(path, {
    encoding: 'utf8'
  }));
}
