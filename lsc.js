const a = process.argv.slice(2);
let r = "";

if (a.length) {
    const s = a[0];
    
    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j <= s.length; j++) {
            const t = s.slice(i, j);
            
            if (a.every(v => v.includes(t)) && t.length > r.length) {
                r = t;
            }
        }
    }
}

console.log(r);