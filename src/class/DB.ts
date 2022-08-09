import { File } from "./File";
import { CorrelativeDB } from "../types/Correlative";
import { Subject } from "../types/Subject";
import { CONFIG } from "../config";

export class DB {
  private static Subjects: Subject[] = JSON.parse(File.read(CONFIG.SUBJECT_DB));
  private static Correlatives: CorrelativeDB = JSON.parse(File.read(CONFIG.CORRELATIVE_DB));

  private async scrapData() {
    let existSubject = File.exist(CONFIG.SUBJECT_DB);
    let existCorrelative = File.exist(CONFIG.CORRELATIVE_DB);

    
  }

  /**
   * Actualiza las correlativas necesarias.
   */
  public static SyncCorrelativesWithSubjects() {
    this.Subjects.forEach(subject => {
      let id = subject.correlativesId;

      if (id) {

        if (["A", "P"].includes(subject.cond!)) {
          this.Correlatives[id] = true;
          
        }
        
      }
    })
  }
}
