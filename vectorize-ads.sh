#!/bin/bash
files=$(ls database/ads/ad-*) ; 
	for x in ${files[@]} ; do  
		filename=$(basename $x);  
		echo $filename":"; 
		time python commercial-detect-opencv.py vectorize  $x  database/vectorized/$filename.djv ; 
done 
#ad-Aflubin.mp4, :
#
#real	0m33.713s
#user	0m30.012s
#sys	0m4.796s
#ad-Coldrex.mp4, :
#
#real	0m7.098s
#user	0m7.668s
#sys	0m0.912s
#ad-Gemorroy.mp4, :
#
#real	0m32.284s
#user	0m29.236s
#sys	0m4.544s
#ad-Huggies.mp4, :
#
#real	0m5.543s
#user	0m6.348s
#sys	0m0.680s
#ad-Nalgezin.mp4, :
#
#real	0m17.326s
#user	0m15.756s
#sys	0m2.328s
#ad-Pektolvan-.mp4, :
#
#real	0m24.129s
#user	0m21.488s
#sys	0m3.336s
#ad-Volia-ISP.mp4, :
#
#real	0m25.096s
#user	0m22.428s
#sys	0m3.556s
#ad-WellaFlex.mp4, :
#
#real	0m32.973s
#user	0m29.860s
#sys	0m4.716s

