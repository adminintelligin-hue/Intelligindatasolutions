"""
Run this script once to copy the real Intelligin logo to the website folder.
Place your logo PNG file in c:\intelligin Web\ named 'my_logo.png'
then run this script, OR just manually rename/copy your logo to:
  c:\intelligin Web\logo.png
  c:\intelligin Web\favicon.png
"""
import shutil
import os

website_dir = r"c:\intelligin Web"

# Path to the real logo the user shared (saved by Antigravity)
logo_source = r"C:\Users\Admin\.gemini\antigravity\brain\af24827a-ab39-4eb4-8691-49f0bc6a4c8c\intelligin_logo_1776700841205.png"

# Copy as logo.png
dest_logo = os.path.join(website_dir, "logo.png")
shutil.copy2(logo_source, dest_logo)
print(f"✓ Copied logo to {dest_logo}")

# Also update favicon.png with the real logo
dest_favicon = os.path.join(website_dir, "favicon.png") 
shutil.copy2(logo_source, dest_favicon)
print(f"✓ Updated favicon.png")

print("\nDone! Now run start_server.bat and open http://localhost:5500 in Chrome.")
