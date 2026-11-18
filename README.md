# HUJI AICODE Lab 6 setup

This project contains a five-second Remotion test composition with Kokoro narration.

## Preview

```bash
npm run dev
```

## Render a new video

```bash
npx remotion render src/index.ts TestClip render-01.mp4
```

Choose a new output name for each later render (`render-02.mp4`, etc.) so the last finished video stays available. The lab video has not been started here.

## Recreate narration

```bash
source .venv/bin/activate
python scripts/narrate.py
```

The Kokoro model files belong in `models/` and are ignored by Git. The sample narration is tracked so the test composition previews after cloning. Rendered videos are ignored by Git.

To recreate the local Python setup and model files on another machine:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
mkdir -p models
curl -fL -o models/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx
curl -fL -o models/voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin
```
