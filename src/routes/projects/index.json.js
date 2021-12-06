import get_projects from "./get_projects.js";

export async function get({
  params
}) {
  let projects = get_projects().map(project => {
    return {
      title: project.title,
      slug: project.slug,
      date: project.date,
      vignette: project.vignette
    };
  });
  let body = JSON.stringify(projects);
  return {
    body
  };
}
