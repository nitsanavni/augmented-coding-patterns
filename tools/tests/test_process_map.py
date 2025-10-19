import sys
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root / "tools"))

from process_map import save_semantic_map

def test_process_map_output_matches_golden():
    input_svg = project_root / "website" / "app" / "talk" / "map.svg"
    output_svg = project_root / "website" / "public" / "maps" / "semantic_map.svg"
    golden_svg = project_root / "tools" / "tests" / "golden" / "semantic_map.svg"

    save_semantic_map(str(input_svg), str(output_svg))

    generated_svg = output_svg.read_text()
    expected_svg = golden_svg.read_text()

    assert generated_svg == expected_svg, "Generated SVG differs from golden file"
