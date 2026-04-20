import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>App Development</h3>', '<i class="ph ph-device-mobile card-front-icon"></i>\n                                <h3>App Development</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Website Development</h3>', '<i class="ph ph-globe card-front-icon"></i>\n                                <h3>Website Development</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Mini ERP Development</h3>', '<i class="ph ph-factory card-front-icon"></i>\n                                <h3>Mini ERP Development</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Software Development</h3>', '<i class="ph ph-cloud card-front-icon"></i>\n                                <h3>Software Development</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>AI Automation</h3>', '<i class="ph ph-cpu card-front-icon"></i>\n                                <h3>AI Automation</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Data Analytics</h3>', '<i class="ph ph-chart-bar card-front-icon"></i>\n                                <h3>Data Analytics</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Dynamic Dashboards</h3>', '<i class="ph ph-trend-up card-front-icon"></i>\n                                <h3>Dynamic Dashboards</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Process Automation</h3>', '<i class="ph ph-gear card-front-icon"></i>\n                                <h3>Process Automation</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Project Systems</h3>', '<i class="ph ph-kanban card-front-icon"></i>\n                                <h3>Project Systems</h3>'),
    (r'<span class="card-front-icon\">[^<]+</span>\s*<h3>Export Intelligence</h3>', '<i class="ph ph-globe-hemisphere-east card-front-icon"></i>\n                                <h3>Export Intelligence</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>Digital Marketing</h3>', '<i class="ph ph-megaphone card-front-icon"></i>\n                                <h3>Digital Marketing</h3>'),
    (r'<span class="card-front-icon">[^<]+</span>\s*<h3>IT Recruitment</h3>', '<i class="ph ph-users card-front-icon"></i>\n                                <h3>IT Recruitment</h3>')
]

for pat, repl in replacements:
    content = re.sub(pat, repl, content, flags=re.MULTILINE|re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Emojis replaced!')
