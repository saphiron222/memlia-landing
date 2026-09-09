"""Mesure indépendante des fichiers intégrés : chaque frame, témoin R7 et son inchangé."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def run(*args):
    return subprocess.run(args, check=True, capture_output=True).stdout

def sha(data):
    return hashlib.sha256(data).hexdigest()

def main():
    report = {'media': [], 'roiXYWH': [1000, 50, 850, 70]}
    audio = []
    pixels_per_frame = 850 * 70
    table = bytes(int(i < 150) for i in range(256))
    for version in ['r7', 'r8']:
        path = ROOT / f'public/media/{version}/animatique-hero-45s.mp4'
        raw = run('ffmpeg', '-v', 'error', '-xerror', '-i', str(path), '-an', '-vf', 'crop=850:70:1000:50,format=gray', '-pix_fmt', 'gray', '-f', 'rawvideo', '-')
        assert len(raw) == 1350 * pixels_per_frame
        counts = [raw[start:start+pixels_per_frame].translate(table).count(1) for start in range(0, len(raw), pixels_per_frame)]
        assert (max(counts) == 0) if version == 'r8' else (min(counts) > 1000)
        aac = sha(run('ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:a:0', '-c:a', 'copy', '-f', 'adts', '-'))
        pcm = sha(run('ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:a:0', '-c:a', 'pcm_s32le', '-f', 's32le', '-'))
        audio.append((aac, pcm))
        report['media'].append({'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes()), 'frames': len(counts), 'minDarkPixels': min(counts), 'maxDarkPixels': max(counts), 'aacSha256': aac, 'pcmSha256': pcm})
    assert audio[0] == audio[1]
    def rgb(path, frame):
        return run('ffmpeg', '-v', 'error', '-i', str(ROOT / path), '-vf', f'select=eq(n\\,{frame}),format=rgb24', '-frames:v', '1', '-f', 'rawvideo', '-')
    frame = rgb('public/media/r8/animatique-hero-45s.mp4', 418)
    assert len(frame) == 1920 * 1080 * 3
    assert frame == rgb('public/media/r8/hero-poster.webp', 0)
    assert (ROOT / 'public/media/r8/animatique.vtt').read_bytes() == (ROOT / 'public/media/r7/animatique.vtt').read_bytes()
    historical = json.loads((ROOT / 'docs/qa/m4-r3/media-manifest.json').read_text())['entries']
    for entry in historical:
        assert sha((ROOT / entry['target']).read_bytes()) == entry['sha256'], entry['target']
    report.update(audioBitIdentical=True, vttBitIdentical=True, posterFrame=418, posterPixelSha256=sha(frame), historicalUnchanged=len(historical))
    destination = ROOT / 'docs/qa/m4-r4/r8-independent.json'
    destination.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))

if __name__ == '__main__':
    main()
