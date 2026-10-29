export const slugOfFile = (file) => file.replace(/\.[^.]+$/, '');
export const slugOf = (project) => slugOfFile(project.file);
