import re

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Fix remaining garbled sequences using unicode codepoints
text = text.replace('\u00e2\u0086\u00bb', '&#8635;')  # â†» -> ↻
text = text.replace('\u00e2\u0086\u2019', '&rarr;')   # â†' -> →
text = text.replace('\u00e2\u20ac\u201d', '&mdash;')  # â€" -> —
text = text.replace('\u00c2\u00b7', '&middot;')       # Â· -> ·
text = text.replace('\u00e2\u0152\u2026', '&#9733;')  # â˜… -> ★
text = text.replace('\u00e2\u009c\u2022', '&#10005;') # âœ• -> ✕

# Remove orphan data-aos-delay attributes
text = re.sub(r'\s+data-aos-delay="[^"]*"', '', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Encoding fixed cleanly')
