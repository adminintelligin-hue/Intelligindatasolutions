import os
with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Fix common garbled utf-8 -> latin-1 artifacts
text = text.replace('â†’', '&rarr;')
text = text.replace('â€”', '&mdash;')
text = text.replace('Â·', '&middot;')
text = text.replace('â˜…', '&#9733;')
text = text.replace('âœ•', '&#10005;')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Garbage replaced')
