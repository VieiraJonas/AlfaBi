from pathlib import Path
from html.parser import HTMLParser
import re

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images, self.links, self.scripts = [], [], []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img': self.images.append(attrs)
        if tag == 'link': self.links.append(attrs)
        if tag == 'script': self.scripts.append(attrs)

page = Page()
page.feed(Path('dist/index.html').read_text(encoding='utf-8'))
hero = next(i for i in page.images if 'video-poster' in i.get('class', ''))
preload = next(i for i in page.links if i.get('as') == 'image')
assert hero['loading'] == 'eager' and hero['fetchpriority'] == 'high'
assert preload['fetchpriority'] == 'high'
assert preload['href'] == hero['src']
assert preload['imagesrcset'] == hero['srcset']
assert preload['imagesizes'] == hero['sizes']
for index, image in enumerate(page.images):
    assert int(image['width']) > 0 and int(image['height']) > 0, image
    assert image.get('srcset') and image.get('sizes'), image
    assert image['src'].startswith('/_astro/'), image
    if index > 1:
        assert image['loading'] == 'lazy' and image['decoding'] == 'async', image
for script in page.scripts:
    assert script.get('type') == 'module' or 'defer' in script or 'async' in script, script
for file in Path('dist').rglob('*'):
    if not file.is_file() or file.suffix not in ('.html', '.css', '.js'): continue
    text = file.read_text(encoding='utf-8')
    assert '@import ' not in text, file
    for asset in re.findall(r'(?:/assets/|/_astro/)[A-Za-z0-9_./-]+', text):
        assert Path('dist' + asset).is_file(), (file, asset)
css = Path('src/styles/global.css').read_text(encoding='utf-8')
fonts = re.findall(r'@font-face\s*\{[^}]+\}', css)
assert fonts and all('font-display:swap' in font for font in fonts)
print(f'PASS: {len(page.images)} responsive images; matching LCP preload; lazy loading; deferred modules; local assets; font-display:swap; no CSS @import.')
