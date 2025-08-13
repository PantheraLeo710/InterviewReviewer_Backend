// cleanDuplicates.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/interview-reviewer";
const client = new MongoClient(uri);

async function cleanDuplicates() {
  try {
    await client.connect();
    const db = client.db("interview-reviewer");
    const submissions = db.collection("submissions");

    const userIds = await submissions.distinct("userId");

    for (const uid of userIds) {
      const subs = await submissions
        .find({ userId: uid })
        .sort({ submittedAt: -1 }) // latest first
        .toArray();

      const toDelete = subs.slice(1); // keep latest

      for (const doc of toDelete) {
        await submissions.deleteOne({ _id: doc._id });
        console.log(`Deleted submission ${doc._id} for user ${uid}`);
      }
    }

    console.log("Duplicate cleanup done.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

cleanDuplicates();
