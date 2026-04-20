with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('class="section-title"', 'class="section-title typo-reveal"')
text = text.replace('class="reveal-up">YOUR COMPLETE DIGITAL', 'class="typo-reveal">YOUR COMPLETE DIGITAL')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed H2 tags')
