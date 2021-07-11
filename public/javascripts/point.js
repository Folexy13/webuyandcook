function FSPCalculation(point) {
    var fsp = document.getElementById('fsp');
    if (point < 550 ) {
        fsp.style.color = 'red'
        return fsp.innerHTML = 0 + ' points';
    }
   else if (point >= 550 && point < 1000) {
        fsp.style.color = 'red'
        return fsp.innerHTML = 0.5 + ' points';
    } else {
        var multiplier = parseInt(point / 1000);
        fsp.style.color = 'gold'
        return fsp.innerHTML = multiplier * 1 + ' points'
    }
}
 

function statusChecker(totalPoints) {
    var status = document.getElementById('status'),
        checker = parseInt(totalPoints/10);
    if (checker < 100) {
        status.style.color = 'purple'
        return status.innerHTML = "Starter"
    }
    status.style.color = 'Blue'
    return status.innerHTML = "Regular"
}
