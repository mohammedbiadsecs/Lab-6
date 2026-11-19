"""Generate independent voice clips for BinarySearchFinal with local Kokoro."""

from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
CLIPS = [
    ("final-01-intro", "Binary search finds a target in a sorted array by repeatedly shrinking the area where it could be. Each midpoint tells us which half to keep."),
    ("final-02-requirements", "Our target is fifty six. The left boundary starts at index zero, and the right boundary at index eight. Because these values are sorted, a comparison with the middle tells us which side cannot contain the target. We keep only the possible side."),
    ("final-03-middle", "How do we pick the middle index? Add left and right, divide by two, then round down. If the average is fractional, floor rounds down. With left zero and right eight, the middle index is four. The value at index four is sixteen."),
    ("final-04-setup", "Now let's run the complete search. We want fifty six. The current range spans all nine elements, from left index zero to right index eight."),
    ("final-05-first", "Check index four: the middle value is sixteen. That's midpoint check one. Fifty six is greater, so values from two through sixteen are too small. Eliminate them and move left to index five."),
    ("final-06-second", "The remaining indices are five through eight. Their middle is index six, value thirty eight: check two. Fifty six is greater again. Eliminate twenty three and thirty eight, and move left to index seven."),
    ("final-07-found", "Now left is seven and right is eight. Rounding their midpoint down gives index seven. The value is fifty six: check three. It matches the target, so we stop. Found!"),
    ("final-08-missing", "What if the target is fifty instead? The first midpoint is sixteen, so move left. The second is thirty eight, so move left again. The third is fifty six, which is too large, so move right to index six. Left is now seven, greater than right. The range is empty, and fifty is not in the array."),
    ("final-09-summary", "Binary search keeps halving the possible range: from a million values to half a million, then a quarter million, and so on. That gives logarithmic time, O of log n. Start with sorted values, check the middle, update one boundary, and repeat until found or the boundaries cross."),
]


def main() -> None:
    model_dir = ROOT / "models"
    out = ROOT / "public"
    out.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))
    for name, text in CLIPS:
        speed = 1.2 if name in {"final-04-setup", "final-05-first", "final-06-second", "final-09-summary"} else 1.15 if name == "final-07-found" else 1.05
        samples, rate = kokoro.create(text, voice="af_sarah", speed=speed, lang="en-us")
        sf.write(out / f"{name}.wav", samples, rate)
        print(f"{name}: {len(samples) / rate:.2f}s", flush=True)


if __name__ == "__main__":
    main()
