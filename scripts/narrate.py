from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro


ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "models"
OUTPUT = ROOT / "public"

SCENES = [
    ("01-intro", "Binary search finds a value by repeatedly cutting a sorted search range in half. The array must be sorted first."),
    ("02-array", "Let's find fifty six in this sorted array. We start with all nine numbers and inspect the middle."),
    ("03-sixteen", "The middle is sixteen. Fifty six is larger, so everything through sixteen can be discarded."),
    ("04-thirty-eight", "The new middle is thirty eight. Fifty six is still larger. Discard the left part again."),
    ("05-found", "Now the middle is fifty six. That's our target. Found in just three comparisons."),
    ("06-compare", "Linear search checks items one by one: order n. Binary search halves the range: order log n. In one million sorted elements, that's up to one million comparisons versus only twenty."),
    ("07-summary", "Remember: sort first, check the middle, and keep only the possible half. That's binary search."),
]


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(str(MODEL_DIR / "kokoro-v1.0.onnx"), str(MODEL_DIR / "voices-v1.0.bin"))
    for name, text in SCENES:
        samples, sample_rate = kokoro.create(text, voice="af_sarah", speed=1.12, lang="en-us")
        path = OUTPUT / f"{name}.wav"
        sf.write(path, samples, sample_rate)
        print(f"{name}: {len(samples) / sample_rate:.2f}s -> {path}", flush=True)


if __name__ == "__main__":
    main()
