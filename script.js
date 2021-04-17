let calchistory = []
let lastcalc
document.getElementById("from").addEventListener('change', ()=>{
    if (document.getElementById("from").value==="standard") {
        document.getElementById("solvestandard").style.display = 'initial'
        document.getElementById("solvevertex").style.display = 'none'
        hideSteps()
    } else if (document.getElementById("from").value==="vertex") {
        document.getElementById("solvestandard").style.display = 'none'
        document.getElementById("solvevertex").style.display = 'initial'
        hideSteps()
    }
})
document.getElementById("solvestandard").addEventListener('submit', event => {
    event.preventDefault()
    hideSteps()
    let formData = new FormData(document.getElementById("solvestandard"))
    document.getElementById("savalue").value = ""; document.getElementById("sbvalue").value = ""; document.getElementById("scvalue").value = ""
    let a = formData.get("avalue"); let b = formData.get("bvalue"); let c = formData.get("cvalue");
    solve(a, b, c)
})
document.getElementById("solvevertex").addEventListener('submit', event=>{
    event.preventDefault()
    hideSteps()
    let formData = new FormData(document.getElementById("solvevertex"))
    document.getElementById("vavalue").value = ""; document.getElementById("vhvalue").value = ""; document.getElementById("vkvalue").value = ""
    let a = formData.get("avalue"); let h = formData.get("hvalue"); let k = formData.get("kvalue");
    let b = ((-h)+(-h))*a; let c = (((-h)**2)*a)+Number(k);
    document.getElementById("formulapreview").innerText += `$$v = (${h},${k}), ${(k==0) ? `k = 0, x-int = (${h},${k})` : `k \\ne 0, x-int = Ø`}$$
    The x-intercept is ${(k==0) ? `(${h},${k})` : `Ø`}, but if you ignore that and do the calculations, this is what you get:
    (NOTE: If the numbers get too big (or small), the result will be wrong. Use the result above if the one listed is different.)

    ${`$$y = {${a}(x-${h})^2+${k}}$$`}
    ${`$$y = {${a}(x^2${((-h)+(-h)>=0) ? `+${((-h)+(-h))}x` : `${((-h)+(-h))}x`}${(((-h)**2)>=0) ? `+${((-h)**2)}` : ((-h)**2)})+${k}}$$`}
    ${`$$y = {${a}x^2${(b>=0) ? `+${b}x` : `${b}x`}${(c>=0) ? `+${c}` : c}}$$`}
    ${`$$a = ${a}, b = ${b}, c = ${c}$$`}
    `
    solve(a, b, c)
})
function loadLast() {
    if (lastcalc) {
        document.getElementById("savalue").value = lastcalc[0]
        document.getElementById("sbvalue").value = lastcalc[1]
        document.getElementById("scvalue").value = lastcalc[2]
    } else {
        alert("You have no calculation history")
    }
}
function solve(a, b, c) {
    try {
        let res
        let discriminant = (b ** 2) - (4 * a * c)
        if (discriminant > 0) {
            //Two Solutions
            let x1 = ((-b) + Math.sqrt(discriminant)) / (2 * a)
            let x2 = ((-b) - Math.sqrt(discriminant)) / (2 * a)
            res = `(${x1}, 0), (${x2}, 0)`
            if (MathJax) {
                document.getElementById("formulapreview").innerText += `${`$$x = {${-b} \\pm \\sqrt{${b}^2-4(${a})(${c})} \\over 2(${a})}$$`} 
                ${`$$x = {${-b} \\pm \\sqrt{${b**2}${((-4*a*c)>=0) ? "+" + (-4*a*c) : (-4*a*c)}} \\over ${2*a}}$$`} 
                ${`$$x = {${-b} \\pm \\sqrt{${discriminant}} \\over ${2*a}}$$`} 
                ${`$$x = {${-b}+${Math.sqrt(discriminant)} \\over ${2*a}}, x = {${-b}-${Math.sqrt(discriminant)} \\over ${2*a}}$$`} 
                ${ `$$x = {${(-b)+Math.sqrt(discriminant)} \\over ${2*a}}, x = {${(-b)-Math.sqrt(discriminant)} \\over ${2*a}}$$`} 
                ${`$$x = {${((-b)+Math.sqrt(discriminant))/(2*a)}}, x = {${((-b)-Math.sqrt(discriminant))/(2*a)}}$$`}`
                MathJax.typeset()
                document.getElementById("hidesteps").style.display = 'initial'
            }
        } else if (discriminant === 0) {
            //One Solution
            let x = ((-b) + Math.sqrt(discriminant)) / (2 * a)
            res = `(${x}, 0)`
            if (MathJax) {
                document.getElementById("formulapreview").innerText += `${`$$x = {${-b} \\pm \\sqrt{${b}^2-4(${a})(${c})} \\over 2(${a})}$$`} 
                ${`$$x = {${-b} \\pm \\sqrt{${b**2}${((-4*a*c)>=0) ? "+" + (-4*a*c) : (-4*a*c)}} \\over ${2*a}}$$`} 
                ${`$$x = {${-b} \\pm \\sqrt{${discriminant}} \\over ${2*a}}$$`} 
                ${`$$x = {${-b}\\over ${2*a}}$$`} 
                ${`$$x = {${(-b)/(2*a)}}$$`}`
                MathJax.typeset()
                document.getElementById("hidesteps").style.display = 'initial'
            }
        } else if (discriminant < 0) {
            //No Solutions
            res = `Ø (No X-Intercept)`
            if (MathJax) {
                document.getElementById("formulapreview").innerText += `${`$$x = {${-b} \\pm \\sqrt{${b}^2-4(${a})(${c})} \\over 2(${a})}$$`} 
                ${`$$x = {${-b} \\pm \\sqrt{${b**2}${((-4*a*c)>=0) ? "+" + (-4*a*c) : (-4*a*c)}} \\over ${2*a}}$$`}
                ${`$$x = {${-b} \\pm \\sqrt{${discriminant}} \\over ${2*a}}$$`} 
                ${`$$ \\sqrt{${discriminant}} = {Ø}, x = {Ø} $$`}`
                MathJax.typeset()
                document.getElementById("hidesteps").style.display = 'initial'
            }
        } else {
            //Error 
            throw `Discriminant is '${discriminant}', which is neither greater than, less than, or equal to 0`
        }
        document.getElementById("result").innerText = res
        calchistory.push(`A = ${a}, B = ${b}, C = ${c} : ${res}`)
        document.getElementById("history").innerHTML = calchistory.reverse().join(" <br> ")
        calchistory.reverse()
        lastcalc = [a, b, c]
    } catch (err) {
        document.getElementById("result").innerText = "Error: " + err
    }
}
function showFormulas(button) {
    if (MathJax) {
        document.getElementById('formulas').style.display='initial'
        button.style.display='none'
    } else {
        alert("Sorry, MathJax is not loaded so the formulas could not be displayed.")
    }
}
function hideSteps() {
    document.getElementById("formulapreview").innerText = ""
    document.getElementById("hidesteps").style.display = 'none'
}