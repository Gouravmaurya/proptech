# /public/videos/

Place your two hero background videos here:

| Filename        | Recommended Content                                      |
|-----------------|----------------------------------------------------------|
| `hero1.mp4`     | Exterior footage — luxury home, drone flyover, landscape |
| `hero2.mp4`     | Interior footage — modern living room, kitchen, staging  |

## Tips for Best Results
- Use **H.264 / MP4** format for maximum browser compatibility.
- Recommended resolution: **1920×1080** (16:9) for each video.
- Keep each file under **10 MB** for fast loading (compress with HandBrake or ffmpeg if needed).
- Remove audio from the videos — they autoplay muted.

## Quick ffmpeg compress command
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -an output.mp4
```
