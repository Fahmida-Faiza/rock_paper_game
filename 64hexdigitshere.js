const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

// Email in lowercase
const email = "fahmidafaiza57@gmail.com";

// Function to calculate SHA3-256 hash of a file
const hashFile = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath); // Read the file as a binary buffer
  const hash = crypto.createHash("sha3-256"); // Use SHA3-256
  hash.update(fileBuffer);
  return hash.digest("hex"); // Return the hex digest
};

const directoryPath = "./task2"; 
const files = fs.readdirSync(directoryPath);

if (files.length !== 256) {
  console.error("There should be exactly 256 files!");
  process.exit(1);
}

const hashes = files
  .map((file) => hashFile(path.join(directoryPath, file)))
  .sort();

const concatenatedHashes = hashes.join("");

const finalString = concatenatedHashes + email.toLowerCase();

const finalHash = crypto
  .createHash("sha3-256")
  .update(finalString)
  .digest("hex");

console.log(finalHash);
