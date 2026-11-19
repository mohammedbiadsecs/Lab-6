"""Generate narration for BinarySearchExtended without changing earlier audio."""

from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCENES = [
    ("ext-01-question", "If you had a million numbers, would you check every one to find a target? There is a much faster way. A single comparison can cut the work in half."),
    ("ext-02-linear", "Linear search starts at the beginning and checks each number in turn. Two, five, eight, and so on, until fifty six. On this array, that takes eight checks. It works, but the target can be the very last element."),
    ("ext-03-sorted", "Binary search has one important requirement: the values must be sorted. In an unsorted list, a middle value tells us nothing about where the target is. In a sorted list, it tells us which half to keep."),
    ("ext-04-setup", "Here is our sorted array. We want fifty six. Set the left boundary to the first item and the right boundary to the last."),
    ("ext-05-sixteen", "Check the midpoint between those boundaries. It is sixteen: comparison one. Fifty six is larger, so discard sixteen and everything left of it. Move the left boundary right."),
    ("ext-06-thirty-eight", "In the remaining range, the new midpoint is thirty eight: comparison two. Fifty six is still larger. Discard thirty eight and twenty three, then move the left boundary again."),
    ("ext-07-found", "The next midpoint is fifty six: comparison three. It matches our target. Found! The shrinking boundaries led straight to the answer."),
    ("ext-08-missing", "What if we search for fifty instead? Check sixteen, then thirty eight, then fifty six. Fifty is smaller than fifty six, so move the right boundary left. The boundaries cross: the target is absent."),
    ("ext-09-compare", "Linear search may check every element, giving order n time. Binary search halves the range each step, giving order log n time. For one million sorted elements, at most twenty midpoint checks are enough."),
    ("ext-10-recap", "The recipe: sort the array, check its middle, and keep only the half that could contain the target. Repeat until found, or the range is empty."),
]


def main() -> None:
    output = ROOT / "public"
    output.mkdir(parents=True, exist_ok=True)
    model_dir = ROOT / "models"
    kokoro = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))
    for name, script in SCENES:
        samples, sample_rate = kokoro.create(script, voice="af_sarah", speed=1.0, lang="en-us")
        path = output / f"{name}.wav"
        sf.write(path, samples, sample_rate)
        print(f"{name}: {len(samples) / sample_rate:.2f}s", flush=True)


if __name__ == "__main__":
    main()
