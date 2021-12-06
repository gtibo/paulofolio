import fs from "fs";
import path from "path";
import fm from "front-matter";
import MarkdownIt from "markdown-it";
let md = new MarkdownIt();
let root_path = process.cwd();

export async function get({
  params
}) {
  let about_path = path.join(root_path, "/static/content/about.md");
  let raw_content = fs.readFileSync(about_path, {
    encoding: 'utf8'
  });
  raw_content = fm(raw_content);
  let {
    attributes
  } = raw_content;
  let about = {
    ...attributes,
    body: md.render(raw_content.body)
  }
  let body = JSON.stringify(about);
  return {
    body
  };
}
