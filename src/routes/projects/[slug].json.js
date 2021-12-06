import get_projects from "./get_projects.js";

export async function get({
  params
}) {
  const {
    slug
  } = params;
  let projects = get_projects();

  for(let i = 0; i < projects.length; i++){
    let current_project = projects[i];
    if(i-1 >= 0) current_project.previous_project = {
      slug: projects[i-1].slug,
      title: projects[i-1].title,
      type: projects[i-1].type
    };
    if(i+1 < projects.length)current_project.next_project = {
      slug: projects[i+1].slug,
      title: projects[i+1].title,
      type: projects[i+1].type
    };
  }

  let project = projects.find(
    project => project.slug === slug
  );
  if(!project) return {status:404}
  let body = JSON.stringify(project);
  return {
    body
  };
}
