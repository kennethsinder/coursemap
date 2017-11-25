export class Course {
  id: number;
  subject: string;
  catalog_number: string;
  title: string;
  description: string;
  units: string; // Number of UW course units, e.g. "0.50"
  prerequisites: string;
  corequisites: string;
  antirequisites: string;
}
