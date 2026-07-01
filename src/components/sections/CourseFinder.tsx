import { getPublishedProgrammes, getPublishedDepartments } from "@/lib/data";
import { CourseFinderClient } from "./CourseFinderClient";

export async function CourseFinder() {
  const [programmes, departments] = await Promise.all([
    getPublishedProgrammes(),
    getPublishedDepartments(),
  ]);

  const mapped = programmes.map((p) => ({
    code: p.code,
    title: p.title,
    dept: p.department.name,
    duration: p.duration,
    level: p.qualification,
  }));

  const depts = departments.map((d) => d.name);

  return <CourseFinderClient programmes={mapped} departments={depts} />;
}
