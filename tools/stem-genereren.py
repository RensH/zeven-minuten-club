# Maakt de stemopnames in public/voice met Piper (https://github.com/OHF-Voice/piper1-gpl)
# en de stem en_US-amy-medium (https://rhasspy.github.io/piper-samples/#en_US-amy-medium).
# Gebruik: pip install piper-tts; zet en_US-amy-medium.onnx(.json) in deze map; python3 tools/stem-genereren.py
import json, re, subprocess, wave, sys, os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); OUT=os.path.join(ROOT,"public","voice")
from piper import PiperVoice, SynthesisConfig
voice = PiperVoice.load(os.path.join(HERE,"en_US-amy-medium.onnx"), config_path=os.path.join(HERE,"en_US-amy-medium.onnx.json"))
cfg = SynthesisConfig(length_scale=0.88, noise_scale=0.7, noise_w_scale=0.8)
js = open(os.path.join(ROOT,'public','oefeningen.js')).read()
EN = json.loads(re.search(r'const EN = (\{.*?\});', js).group(1))
lines = {"ready":"Get ready!", "rest":"Rest.", "side":"Switch sides!", "half":"Halfway there!",
         "last":"Last one!", "done":"Workout complete. Great job!", "three":"Three.", "two":"Two.", "one":"One."}
for k,v in EN.items(): lines["ex-"+k] = v + "!"
for k,text in lines.items():
    w = os.path.join(OUT,f"{k}.wav")
    with wave.open(w,"wb") as f: voice.synthesize_wav(text, f, syn_config=cfg)
    # stilte eraf, luidheid gelijk, mp3 mono
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",w,"-af",
      "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-14:TP=-1.5:LRA=7",
      "-ar","22050","-ac","1","-b:a","64k",os.path.join(OUT,f"{k}.mp3")],check=True)
os.system(f"rm -f {OUT}/*.wav"); print(len(lines),"clips")
json.dump({k:f"{k}.mp3" for k in lines}, open(os.path.join(OUT,"clips.json"),"w"), indent=1)
