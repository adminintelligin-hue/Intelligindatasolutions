with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The garbled arrow is Â↻ - replace the card-hint spans entirely
import re

# Replace any malformed card-hint spans
text = re.sub(r'<span class="card-hint">[^<]*</span>', '<span class="card-hint">&#8635; Hover to explore</span>', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed card hints')
