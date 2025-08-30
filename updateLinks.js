const fs = require('fs');
const path = require('path');

// Function to process a single HTML file
function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace .html in href attributes (handles both single and double quotes)
    content = content.replace(
      /href=(["'])([^"']+)\.html(["'])/g,
      'href=$1$2$3'
    );
    
    // Also handle links that end with /index
    content = content.replace(
      /href=(["'])([^"']+)\/index(["'])/g,
      'href=$1$2$3'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Function to find all HTML files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  let processedCount = 0;
  let errorCount = 0;
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other common directories
      if (!['node_modules', '.git', '.github', '.vscode'].includes(file)) {
        const result = processDirectory(fullPath);
        processedCount += result.processedCount;
        errorCount += result.errorCount;
      }
    } else if (file.endsWith('.html')) {
      const success = processFile(fullPath);
      if (success) {
        processedCount++;
      } else {
        errorCount++;
      }
    }
  });
  
  return { processedCount, errorCount };
}

// Start processing from the current directory
console.log('Starting to update HTML links...');
const { processedCount, errorCount } = processDirectory(__dirname);

console.log('\n--- Update Complete ---');
console.log(`Processed: ${processedCount} files`);
if (errorCount > 0) {
  console.warn(`Encountered errors with ${errorCount} files`);
} else {
  console.log('All files processed successfully!');
}
console.log('\nPlease test all links to ensure they work correctly.');
