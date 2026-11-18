from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro


ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "models"
OUTPUT = ROOT / "public" / "narration.wav"

kokoro = Kokoro(str(MODEL_DIR / "kokoro-v1.0.onnx"), str(MODEL_DIR / "voices-v1.0.bin"))
samples, sample_rate = kokoro.create(
    "This is my animation and narration test.",
    voice="af_sarah",
    speed=1.0,
    lang="en-us",
)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
sf.write(OUTPUT, samples, sample_rate)
print(f"Created {OUTPUT}")
