let podlaga, last, raketa;
let visina = 700, sirina = 1000, zivljenja = 3, tocke = 0;
let tipke = [], asteroidi = [], metki = [];

class Raketa {
    constructor() {
        this.vidno = true;
        this.x = sirina/2;
        this.y = visina/2;
        this.premika = false;
        this.hitrost = 0.1;
        this.hitObrata = 0.001;
        this.radij = 15;
        this.stopinje = 0;
        this.barva = 'white';
        this.velX = 0;
        this.velY = 0;

        this.konicaX = sirina/2 + 15;
        this.konicaY = visina/2 + 15;
    }

    posodobi() {
        let radiani = this.stopinje / Math.PI * 180;
        
        if(this.premika) {
            this.velX += Math.cos(radiani) * this.hitrost;
            this.velY += Math.sin(radiani) * this.hitrost;
        }

        if(this.x < this.radij) {
            this.x = podlaga.width;
        }
        if(this.x > podlaga.width) {
            this.x = this.radij;
        }

        if(this.y < this.radij) {
            this.y = podlaga.height;
        }
        if(this.y > podlaga.height) {
            this.y = this.radij;
        }

        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;
    }

    obrat(smer) {
        this.stopinje += this.hitObrata * smer;
    }

    /*
        Risanje premika/obrata rakete.
    */
    risi() {
        last.strokeStyle = this.barva;
        last.beginPath();

        let kot = ((Math.PI * 2) / 3);
        let radiani = this.stopinje / Math.PI * 180;

        /*
            Uporabim teorijo iz trigonometrije (pomisli na kroznico).
        */
        this.konicaX = this.x - this.radij * Math.cos(kot * raketa.radij + radiani);
        this.konicaY = this.y - this.radij * Math.sin(kot * raketa.radij + radiani);

        for (let i = 0; i < 3; i++) {
            last.lineTo(
                this.x - this.radij * Math.cos(kot * i + radiani),
                this.y - this.radij * Math.sin(kot * i + radiani)
            );
        }

        last.closePath();
        last.stroke();
    }
}

class Metek {
    constructor(stopinje) {
        this.vidno = true;
        this.x = raketa.konicaX;
        this.y = raketa.konicaY;
        this.stopinje = stopinje;
        this.visina = 4;
        this.sirina = 4;
        this.hitrost = 5;

        this.velX = 0;
        this.velY = 0;
    }

    posodobi() {
        let radiani = this.stopinje / Math.PI * 180;

        this.x -= Math.cos(radiani) * this.hitrost;
        this.y -= Math.sin(radiani) * this.hitrost;
    }

    risi() {
        last.fillStyle = "white";
        last.fillRect(this.x, this.y, this.sirina, this.visina);
    }
}

class Asteroid {
    constructor(x,y,radij,stopnja,trkRadij) {
        this.vidno = true;
        this.y = x || Math.floor(Math.random() * visina);
        this.x = y || Math.floor(Math.random() * sirina);
        this.hitrost = 1;
        this.radij = radij || 50;
        this.barva = "white";
        this.stopinje = Math.floor(Math.random() * 359);
        this.trkRadij = trkRadij || 46;
        this.stopnja = stopnja || 1; 
    }

    posodobi() {
        let radiani = this.stopinje / Math.PI * 180;

        this.x -= Math.cos(radiani) * this.hitrost;
        this.y -= Math.sin(radiani) * this.hitrost;

        if(this.x < this.radij) {
            this.x = podlaga.width;
        }
        if(this.x > podlaga.width) {
            this.x = this.radij;
        }

        if(this.y < this.radij) {
            this.y = podlaga.height;
        }
        if(this.y > podlaga.height) {
            this.y = this.radij;
        }
    }

    risi() {
        last.beginPath();

        let kot = ((Math.PI * 2) / 6);
        let radiani = this.stopinje / Math.PI * 180;

        for (let i = 0; i < 6; i++) {
            last.lineTo(
                this.x - this.radij * Math.cos(kot * i + radiani),
                this.y - this.radij * Math.sin(kot * i + radiani)
            );
        }

        last.closePath();
        last.stroke();
    }
}

document.addEventListener("DOMContentLoaded", vzpostavi);

function vzpostavi() {
    podlaga = document.getElementById("podlaga");
    last = podlaga.getContext("2d");
    raketa = new Raketa();

    /*
        Pretvorba e.key String vrednosti v
        stevilo razporejeno po ASCII tabeli.
    */ 
    let tipka;
    
    podlaga.height = visina;
    podlaga.width = sirina;

    console.log('sirina '+String(podlaga.width));
    console.log('visina '+String(podlaga.height));

    last.fillStyle = 'black';
    last.fillRect(0,0,podlaga.width,podlaga.height);

    /**
     * Stvarjenje asteroidov.
     */
    for (let i = 0; i < 8; i++) {
        asteroidi.push(new Asteroid());
        
    }

    document.body.addEventListener("keydown", e => {
        tipka = e.key.charCodeAt(0);
        tipke[tipka] = true;
    });
    document.body.addEventListener("keyup", e => {
        tipka = e.key.charCodeAt(0);
        tipke[tipka] = false;

        if(tipka === 32) {
            metki.push(new Metek(raketa.stopinje));
        }
    });

    upodobi();
}

function upodobi() {
    //w:119, a:97, d:100, space:32;

    raketa.premika = (tipke[119]);
    if(tipke[100]) {
        raketa.obrat(1);
    } else if(tipke[97]) {
        raketa.obrat(-1);
    }

    /*
    console.log("x "+String(raketa.x));
    console.log("y "+String(raketa.y));
    */

    last.clearRect(0,0,sirina, visina);

    last.fillStyle = "rgb(38, 38, 37)";
    last.fillRect(0,0,podlaga.width,podlaga.height);

    /**
     * Narise tockovnik.
     */
    last.fillStyle = 'white';
    last.font = '21px Atari';
    last.fillText('Tocke: '+ tocke.toString(),20,35);
    if(zivljenja <= 0) {
        raketa.vidno = false;
        last.fillStyle = 'white';
        last.font = '50px Atari';
        last.fillText("Konec igre!", sirina/2-100, visina/2);
    }
    kazalecZiv();


    /**
     * Preverja trke rakete z asteroidi
     */
    if(asteroidi.length !== 0) {
        for (let i = 0; i < asteroidi.length; i++) {
            if(trKrog(raketa.x, raketa.y, 11,
                        asteroidi[i].x,
                        asteroidi[i].y,
                        asteroidi[i].trkRadij)
            ) {
                raketa.x = sirina / 2;
                raketa.y = visina / 2;
                raketa.velX = 0;
                raketa.velY = 0;
                zivljenja -= 1;    
            }
            
        }
    }

    if(asteroidi.length !== 0 && metki.length != 0) {
        loop1:
        for (let i = 0; i < asteroidi.length; i++) {
            for (let j = 0; j < metki.length; j++) {
                if(trKrog(metki[j].x,metki[j].y, 3,
                            asteroidi[i].x,
                            asteroidi[i].y,
                            asteroidi[i].trkRadij)
                ) {
                    if(asteroidi[i].stopnja === 1) {
                        asteroidi.push(new Asteroid(
                            asteroidi[i].x - 5,
                            asteroidi[i].y - 5,
                            25, 2, 22
                        ));
                        asteroidi.push(new Asteroid(
                            asteroidi[i].x + 5,
                            asteroidi[i].y + 5,
                            25, 2, 22
                        ));
                    } else if(asteroidi[i].stopnja === 2) {
                        asteroidi.push(new Asteroid(
                            asteroidi[i].x - 5,
                            asteroidi[i].y - 5,
                            15, 3, 12
                        ));
                        asteroidi.push(new Asteroid(
                            asteroidi[i].x + 5,
                            asteroidi[i].y + 5,
                            15, 3, 12
                        ));
                    }
                    asteroidi.splice(i, 1);
                    metki.splice(j, 1);
                    tocke += 25;
                    break loop1;
                }
            }
        }
    }


    if(raketa.vidno) {
        raketa.posodobi();
        raketa.risi();

        /**
         * Najprej posodobi spremneljivke metkov,
         * potem pa jih narisi.
         */
        if(metki.length != 0) {
            for (let i = 0; i < metki.length; i++) {
                metki[i].posodobi();
                metki[i].risi();            
            }
        }
    }
    /**
     * Najprej posodobi spremneljivke asteroidov,
     * potem pa jih narisi.
     */
    if(asteroidi.length != 0) {
        for (let i = 0; i < asteroidi.length; i++) {
            asteroidi[i].posodobi();
            asteroidi[i].risi(i);            
        }
    }

    requestAnimationFrame(upodobi);
}

function trKrog(p1x,p1y,r1,p2x,p2y,r2) {
    let sumRadij = r1 + r2,
        xDiff = p1x - p2x,
        yDiff = p1y - p2y;

    if(sumRadij > Math.sqrt((xDiff*xDiff) + (yDiff*yDiff))) {
        return true;
    } else {
        return false;
    }
}

function kazalecZiv() {
    let zacX = sirina - 50, zacY = 10, tocke = [[9,9],[-9,9]];
    last.strokeStyle = 'white';

    for (let i = 0; i < zivljenja; i++) {
        last.beginPath();
        last.moveTo(zacX,zacY);

        for (let i = 0; i < tocke.length; i++) {
            last.lineTo(zacX + tocke[i][0], zacY + tocke[i][1]);
        }

        last.closePath();
        last.stroke();
        zacX -= 30;
    }
}