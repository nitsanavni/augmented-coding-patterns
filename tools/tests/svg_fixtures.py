import xml.etree.ElementTree as ET

def create_shape_group(x, y, color):
    svg_ns = "{http://www.w3.org/2000/svg}"
    group = ET.Element(f'{svg_ns}g')
    group.set('stroke-linecap', 'round')
    group.set('transform', f'translate({x} {y}) rotate(0 26.7 26.2)')

    path = ET.SubElement(group, f'{svg_ns}path')
    path.set('fill', color)
    path.set('stroke', '#1e1e1e')
    path.set('stroke-width', '1')
    path.set('d', 'M21.58 0.31 C26.98 -0.69, 35.41 1.37, 40.59 4.25...')

    return group

def create_text_group(x, y, text_content):
    svg_ns = "{http://www.w3.org/2000/svg}"
    group = ET.Element(f'{svg_ns}g')
    group.set('transform', f'translate({x} {y}) rotate(0 48.8 25.1)')

    text = ET.SubElement(group, f'{svg_ns}text')
    text.set('x', '48.8')
    text.set('y', '17.6')
    text.text = text_content

    return group

def create_multi_line_text_group(x, y, line1, line2):
    svg_ns = "{http://www.w3.org/2000/svg}"
    group = ET.Element(f'{svg_ns}g')
    group.set('transform', f'translate({x} {y}) rotate(0 48.8 25.1)')

    text1 = ET.SubElement(group, f'{svg_ns}text')
    text1.set('x', '48.8')
    text1.set('y', '17.6')
    text1.text = line1

    text2 = ET.SubElement(group, f'{svg_ns}text')
    text2.set('x', '48.8')
    text2.set('y', '42.6')
    text2.text = line2

    return group

def create_minimal_svg():
    svg_ns = "http://www.w3.org/2000/svg"
    ET.register_namespace('', svg_ns)

    root = ET.Element(f'{{{svg_ns}}}svg')
    root.set('viewBox', '0 0 1000 1000')

    root.append(create_shape_group(500, 300, '#b2f2bb'))
    root.append(create_text_group(505, 305, 'Context Management'))
    root.append(create_text_group(498, 318, '1'))

    root.append(create_shape_group(200, 200, '#ffc9c9'))
    root.append(create_multi_line_text_group(205, 205, 'Cannot', 'Learn'))

    root.append(create_shape_group(100, 850, '#ffec99'))
    root.append(create_text_group(110, 855, 'Anti-Pattern'))

    root.append(create_shape_group(150, 850, '#a5d8ff'))
    root.append(create_text_group(155, 855, 'Pit Stop'))

    return root
