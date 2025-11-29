// ================= HEX ↔ RGBA =================
export function hexToRgba(hex: string): { r: number, g: number, b: number, a: number } {
    if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return { r:0,g:0,b:0,a:1 };
    let c = hex.substring(1);
    if (c.length === 3) c = c.split("").map(x => x+x).join("");
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
}

export function rgbaToHex({ r, g, b }: { r:number, g:number, b:number }): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function rgbaToString({ r, g, b, a }: { r:number,g:number,b:number,a:number }): string {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function stringToRgba(rgba: string): { r:number,g:number,b:number,a:number } {
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);
    if (!m) return { r:0,g:0,b:0,a:1 };
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4]?+m[4]:1 };
}

// ================= HEX ↔ HSL =================
export function hexToHsl(hex: string): { h:number,s:number,l:number } {
    const { r, g, b } = hexToRgba(hex);
    const r1 = r/255, g1 = g/255, b1 = b/255;
    const max = Math.max(r1,g1,b1), min = Math.min(r1,g1,b1);
    let h=0,s=0,l=(max+min)/2;
    if(max!==min){
        const d=max-min;
        s=l>0.5?d/(2-max-min):d/(max+min);
        switch(max){
            case r1: h=(g1-b1)/d + (g1<b1?6:0); break;
            case g1: h=(b1-r1)/d+2; break;
            case b1: h=(r1-g1)/d+4; break;
        }
        h/=6;
    }
    return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

export function hslToHex({h,s,l}:{h:number,s:number,l:number}): string {
    s/=100; l/=100;
    const c=(1-Math.abs(2*l-1))*s;
    const x=c*(1-Math.abs((h/60)%2-1));
    const m=l-c/2;
    let r=0,g=0,b=0;
    if(h<60){r=c;g=x;b=0;}
    else if(h<120){r=x;g=c;b=0;}
    else if(h<180){r=0;g=c;b=x;}
    else if(h<240){r=0;g=x;b=c;}
    else if(h<300){r=x;g=0;b=c;}
    else{r=c;g=0;b=x;}
    return rgbaToHex({r:Math.round((r+m)*255),g:Math.round((g+m)*255),b:Math.round((b+m)*255)});
}

// ================= HEX ↔ CMYK =================
export function hexToCmyk(hex:string): { c:number,m:number,y:number,k:number } {
    const {r,g,b} = hexToRgba(hex);
    if(r===0 && g===0 && b===0) return {c:0,m:0,y:0,k:100};
    let c1=1-r/255, m1=1-g/255, y1=1-b/255;
    let k=Math.min(c1,m1,y1);
    return {
        c: Math.round((c1-k)/(1-k)*100),
        m: Math.round((m1-k)/(1-k)*100),
        y: Math.round((y1-k)/(1-k)*100),
        k: Math.round(k*100)
    };
}

export function cmykToHex({c,m,y,k}:{c:number,m:number,y:number,k:number}): string {
    let r=Math.round(255*(1-c/100)*(1-k/100));
    let g=Math.round(255*(1-m/100)*(1-k/100));
    let b=Math.round(255*(1-y/100)*(1-k/100));
    return rgbaToHex({r,g,b});
}

// ================= HEX ↔ HSV =================
export function hexToHsv(hex:string): { h:number,s:number,v:number } {
    const { r,g,b } = hexToRgba(hex);
    const r1=r/255, g1=g/255, b1=b/255;
    const max=Math.max(r1,g1,b1), min=Math.min(r1,g1,b1);
    let h=0,s=0,v=max;
    const d=max-min;
    s=max===0?0:d/max;
    if(d!==0){
        switch(max){
            case r1: h=(g1-b1)/d + (g1<b1?6:0); break;
            case g1: h=(b1-r1)/d+2; break;
            case b1: h=(r1-g1)/d+4; break;
        }
        h/=6;
    }
    return { h: Math.round(h*360), s: Math.round(s*100), v: Math.round(v*100) };
}

export function hsvToHex({h,s,v}:{h:number,s:number,v:number}): string {
    s/=100; v/=100;
    let c=v*s, x=c*(1-Math.abs((h/60)%2-1)), m=v-c;
    let r=0,g=0,b=0;
    if(h<60){r=c;g=x;b=0;}
    else if(h<120){r=x;g=c;b=0;}
    else if(h<180){r=0;g=c;b=x;}
    else if(h<240){r=0;g=x;b=c;}
    else if(h<300){r=x;g=0;b=c;}
    else{r=c;g=0;b=x;}
    return rgbaToHex({r:Math.round((r+m)*255),g:Math.round((g+m)*255),b:Math.round((b+m)*255)});
}


// Parse "hsl(120, 50%, 60%)" → { h: 120, s: 50, l: 60 }
export function parseHslString(hsl: string) {
    const m = hsl.match(/hsl\(\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*\)/i);
    if (!m) throw new Error("Format HSL invalide");
    return { h: +m[1], s: +m[2], l: +m[3] };
}

// Parse "cmyk(0%, 50%, 100%, 0%)" → { c:0, m:50, y:100, k:0 }
export function parseCmykString(cmyk: string) {
    const m = cmyk.match(/cmyk\(\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*\)/i);
    if (!m) throw new Error("Format CMYK invalide");
    return { c: +m[1], m: +m[2], y: +m[3], k: +m[4] };
}

// Parse "hsv(120, 50%, 60%)" → { h:120, s:50, v:60 }
export function parseHsvString(hsv: string) {
    const m = hsv.match(/hsv\(\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*\)/i);
    if (!m) throw new Error("Format HSV invalide");
    return { h: +m[1], s: +m[2], v: +m[3] };
}

// Parse "#FF00FF" → "#FF00FF" (valide HEX)
export function parseHexString(hex: string) {
    if(!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) throw new Error("HEX invalide");
    return hex.toUpperCase();
}
