import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace <h2 class="section-title"> data-aos headers
# We want to remove data-aos from h2 and add typo-reveal class
text = re.sub(r'(<h2[^>]*?\sclass=\"[^\"]*)\"(.*?)data-aos=\"[^\"]*\"([^>]*>)', r'\1 typo-reveal"\2\3', text)
# If h2 didn't have data-aos but we still want it to be typo-reveal, wait, they all had it.

# For standard hero h1:
text = re.sub(r'(<h1[^>]*?)data-aos=\"[^\"]*\"([^>]*>)', r'\1class="reveal-up"\2', text)
text = text.replace('class="hero-title live-text-anim"class="reveal-up"', 'class="hero-title live-text-anim reveal-up"') # Cleanup just in case

# Replace all other data-aos with just adding reveal-up class
# Many divs already have a class, e.g. <div class="hero-typewriter" data-aos="flip-up">
# We want: <div class="hero-typewriter reveal-up">
def add_class(match):
    prefix = match.group(1)
    cls_content = match.group(2)
    suffix = match.group(3)
    return f'{prefix}class="{cls_content} reveal-up"{suffix}'

text = re.sub(r'(<[^>]*?)class=\"([^\"]*)\"([^>]*?)data-aos=\"[^\"]*\"([^>]*>)', add_class, text)

# For elements that didn't have a class attribute but had data-aos
text = re.sub(r'(<[^>]*?)\sdata-aos=\"[^\"]*\"([^>]*>)', r'\1 class="reveal-up"\2', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated HTML tags cleanly")
