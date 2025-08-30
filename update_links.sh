#!/bin/bash

# Function to remove .html from links in a file
remove_html_extension() {
    local file="$1"
    echo "Processing: $file"
    
    # Use sed to replace .html in href attributes
    # This handles both href="file.html" and href='file.html' cases
    sed -i '' -E 's/(href=["'"'"'])([^"'"'"']+)\.html(["'"'"'])/\1\2\3/g' "$file"
    
    # Also handle links that end with /index
    sed -i '' -E 's/(href=["'"'"'])([^"'"'"']+)\/index(["'"'"'])/\1\2\3/g' "$file"
}

# Export the function so it can be used by find
export -f remove_html_extension

# Find all HTML files and process them
find . -type f -name "*.html" -exec bash -c 'remove_html_extension "$0"' {} \;

echo "\nLink update complete!"
echo "Don't forget to test all links after updating."
