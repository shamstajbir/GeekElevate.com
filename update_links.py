import os
import re
from bs4 import BeautifulSoup

def remove_html_extension_from_links(html_content):
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all <a> tags with href attributes
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        
        # Skip external links, anchors, and mailto: links
        if href.startswith(('http', 'mailto:', 'tel:', '#', 'javascript:')) or '//' in href:
            continue
            
        # Remove .html from internal links
        if href.endswith('.html'):
            a_tag['href'] = href[:-5]  # Remove .html
        elif href.endswith('/index'):
            a_tag['href'] = href[:-5]  # Remove /index
            
    return str(soup)

def process_html_files(directory):
    # Get all HTML files in the directory
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                print(f"Processing: {file_path}")
                
                # Read the file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Update links
                updated_content = remove_html_extension_from_links(content)
                
                # Write the updated content back to the file
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)

if __name__ == "__main__":
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Process all HTML files in the script's directory
    process_html_files(script_dir)
    
    print("\nLink update complete!")
    print("Don't forget to test all links after updating.")
