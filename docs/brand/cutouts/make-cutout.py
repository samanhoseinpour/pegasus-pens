"""Make a pen's cut-out for the product metafield `custom.cutouts` (see docs/brand/README.md).

The result is the studio photo on a transparent 1200 x 1600 canvas, with the pen centred and scaled so its length is
80 % of the canvas height. Every cut-out is framed the same way, so every pen shows at the same size on the cards,
the product page and the home page, whatever the original photo's framing.

Usage: python3 -I docs/brand/cutouts/make-cutout.py <studio photo> <out.png> [--cut-below Y]
  --cut-below Y  clear the mask from row Y of the photo down, where a glossy studio floor mirrors the tip
Needs macOS 14 or later (Apple Vision draws the subject mask, via mask.swift) and ImageMagick 7 (`magick`).
"""

import math
import os
import subprocess
import sys
import tempfile

CANVAS_W, CANVAS_H = 1200, 1600
PEN_LENGTH = 1280  # 80 % of the canvas height
HERE = os.path.dirname(os.path.abspath(__file__))


def run(*cmd, text=False):
    return subprocess.run(cmd, check=True, capture_output=True, text=text).stdout


def size(path):
    w, h = run("magick", "identify", "-format", "%w %h", path, text=True).split()
    return int(w), int(h)


def pen_length(path):
    """The pen's length along its own axis, in pixels, so a diagonal pen counts as fully as an upright one."""
    w, h = size(path)
    alpha = run("magick", path, "-alpha", "extract", "-depth", "8", "gray:-")
    pts = [(x, y) for y in range(0, h, 2) for x in range(0, w, 2) if alpha[y * w + x] > 128]
    mx = sum(x for x, _ in pts) / len(pts)
    my = sum(y for _, y in pts) / len(pts)
    sxx = sum((x - mx) ** 2 for x, _ in pts)
    syy = sum((y - my) ** 2 for _, y in pts)
    sxy = sum((x - mx) * (y - my) for x, y in pts)
    angle = 0.5 * math.atan2(2 * sxy, sxx - syy)  # the main axis of the pen's silhouette
    proj = [(x - mx) * math.cos(angle) + (y - my) * math.sin(angle) for x, y in pts]
    return max(proj) - min(proj)


def main(argv):
    cut_below = None
    if "--cut-below" in argv:
        i = argv.index("--cut-below")
        cut_below = int(argv[i + 1])
        del argv[i : i + 2]
    if len(argv) != 2:
        sys.exit(__doc__)
    photo, out = argv

    with tempfile.TemporaryDirectory() as tmp:
        mask, trimmed = f"{tmp}/mask.png", f"{tmp}/trimmed.png"
        run("swift", f"{HERE}/mask.swift", photo, mask)
        mask_ops = ["(", mask]
        if cut_below is not None:
            mask_ops += ["-fill", "black", "-draw", f"rectangle 0,{cut_below} 100000,100000"]
        # Tighten the mask's soft edge and take one pixel off, so no white fringe from the studio backdrop is left.
        mask_ops += ["-level", "45%,100%", "-morphology", "Erode", "Disk:1", ")"]
        run("magick", photo, *mask_ops, "-alpha", "off", "-compose", "CopyOpacity", "-composite", "-trim", "+repage", trimmed)
        scale = PEN_LENGTH / pen_length(trimmed)
        run("magick", trimmed, "-filter", "Lanczos", "-resize", f"{scale * 100:.4f}%",
            "-background", "none", "-gravity", "center", "-extent", f"{CANVAS_W}x{CANVAS_H}", out)

    # Self-check: same canvas and same pen length as every other cut-out (a pen cut by the canvas edge would be short).
    assert size(out) == (CANVAS_W, CANVAS_H), size(out)
    length = pen_length(out)
    assert abs(length - PEN_LENGTH) <= PEN_LENGTH * 0.015, f"pen length {length:.0f}, expected {PEN_LENGTH}"
    print(f"{out}: {CANVAS_W}x{CANVAS_H}, pen length {length:.0f}")


if __name__ == "__main__":
    main(sys.argv[1:])
