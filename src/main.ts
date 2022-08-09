import { DB } from "./class/DB";
import { loadStudyData } from "./loadStudyData";

async function main() {
  // await loadStudyData(false, false);

  DB.SyncCorrelativesWithSubjects();

  // TRABAJAR DB
}

main();
