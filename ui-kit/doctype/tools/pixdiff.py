#!/usr/bin/env python3
"""Pixel diff of out/<dt>.png vs live/<dt>.live.png (first viewport). Prints % of pixels differing (>24/255 per channel sum-abs)."""
import sys, os
from PIL import Image, ImageChops
here=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for dt in ['sales_invoice','customer','item','company']:
    for kind,ext in (('viewport','png'),('full','full.png')):
        a=os.path.join(here,'out',f'{dt}.{ext}'); b=os.path.join(here,'live',f'{dt}.live.{ext}')
        if not (os.path.exists(a) and os.path.exists(b)): continue
        A=Image.open(a).convert('RGB'); B=Image.open(b).convert('RGB'); B=B.resize((B.width//2,B.height//2),Image.LANCZOS) if B.width==2*A.width else B
        w=min(A.width,B.width); h=min(A.height,B.height)
        if kind=='full': h=min(h,A.height,B.height)
        A=A.crop((0,0,w,h)); B=B.crop((0,0,w,h))
        d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0)
        n=sum(d.histogram()[255:])
        print(f'{dt:14s} {kind:9s} {n*100/(w*h):6.2f}%  (out {Image.open(a).size} live {B.size})')
