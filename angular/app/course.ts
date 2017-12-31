export class Course {
  id: number;
  subject: string;
  catalog_number: string;

  title?: string;
  description?: string;
  units?: string; // Number of UW course units, e.g. "0.50"

  prerequisites?: Course[];
  corequisites?: Course[];
  antirequisites?: Course[];

  prerequisitesDisplay?: string;
  corequisitesDisplay?: string;
  antirequisitesDisplay?: string;

  error?: string; // Empty string for no errors with course selection
}
