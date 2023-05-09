import { Subjects } from './contracts/subjects';

export interface Event {
  subject: Subjects;
  data: any;
}
