import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove everything from the orphaned tealGrad linearGradient up to the Infinite Marquee comment
pattern = r'<linearGradient id="tealGrad".*?(?=\s*<!--\s*Infinite Marquee)'
result = re.sub(pattern, '', content, flags=re.DOTALL)
print(f'Removed {len(content) - len(result)} chars')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)
print('Done')
