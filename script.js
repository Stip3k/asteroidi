let podlaga, last, raketa, meni, tockovnik, powup = 0;
let visina = 700, sirina = 1000, zivljenja = 3, tocke = 0;
let tipke = [], asteroidi = [], metki = [], pavza = [[0,0,69]], boom = [];

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
        this.powup = 0;

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

        //console.log("To so radiani: "+String(radiani));
        //console.log("To so stopinje: "+String(this.stopinje));

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

        last.beginPath();
        last.arc(this.konicaX,this.konicaY,5,0,2*Math.PI);
        
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
        this.style = "white"

        this.velX = 0;
        this.velY = 0;
    }

    posodobi() {
        let radiani = this.stopinje / Math.PI * 180;

        this.x -= Math.cos(radiani) * this.hitrost;
        this.y -= Math.sin(radiani) * this.hitrost;
    }

    risi() {
        last.fillStyle = this.style;
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
        last.strokeStyle = this.barva;
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

class Meni {
    constructor() {
        this.zacX = sirina/2 - 180;
        this.zacY = visina/2 - 150;
        this.moznosti = [[1,0,109/*M*/],[1,0,108/*L*/],[0,0,116/*T*/],[1,0,107/*K*/]];
        this.txt = ['Glasba - M','Infinite play - L','Theme - T','Scoreboard - K'];
        this.vel = 8;
        this.mx = 0;
    }

    risi() {
        last.strokeRect(this.zacX,this.zacY,(sirina - 2*this.zacX),(visina - 2*this.zacY));

        this.mx = (this.zacX+6*((sirina-2*this.zacX)/this.vel)),
        this.my = (this.zacY+((visina-2*this.zacY)/this.vel));

        this.preveri();


        last.fillStyle = 'white';
        last.font = '30px Atari';
        for (let i = 0; i < 4; i++) {
            //last.moveTo(this.mx,this.my);

            last.fillText(this.txt[i],(this.zacX+((sirina-2*this.zacX)/8)),(this.my+30));

            if (this.moznosti[i][0]) {
                last.fillRect(this.mx,this.my,((sirina-2*this.zacX)/this.vel),((visina-2*this.zacY)/this.vel));
            } else {
                last.strokeRect(this.mx,this.my,((sirina-2*this.zacX)/this.vel),((visina-2*this.zacY)/this.vel));
            }
            this.my += 50; 
        }
        last.font = '13px Atari';
        last.fillText('Ponastavi igro - /, Premiki rakete - W,A,D, Streljanje - SAPCE',this.zacX+15,(visina-this.zacY-10));
    }

    preveri() {
        for (let i = 0; i < this.moznosti.length; i++) {
            console.log(this.moznosti[i]);
            preveriTipke(i,this.moznosti);
        }
    }
}

class Tockovnik {
    constructor() {
        this.zacX = (sirina/3);
        this.zacY = 2*visina/8;
        this.xvnos = this.zacX + ((sirina-(2*this.zacX))/2);
        this.yvnos = this.zacY + 30;
        this.imeIg = "Usr";
        this.tabEl = [];
        this.ponovi = 0;
    }

    risi() {
        last.strokeRect(this.zacX, this.zacY, 2*180, visina-(this.zacX));
        this.vnos();
        this.izpisi();
    }

    vnos() {
        last.fillStyle = "white";
        last.font = '28px Atari';
        last.fillText("Vnesi ime:", this.xvnos - 35, this.yvnos);
        //  ctx.fillText(this.imeIg, canvas.width/2, 200);

        if (tipke[92]) {
            if ((this.imeIg != "") && (this.imeIg != "Usr")) {
                localStorage.setItem(this.imeIg,String(tocke));
            }
            location.reload();
        } else {
            last.fillText(this.imeIg, this.xvnos, this.yvnos + 50);
        }
    }

    izpisi() {
        let n = 10, zamik = 20;
        last.font = '25px Atari';
        if (n > this.tabEl.length) {
            n = this.tabEl.length;
        }

        for (let i = 0; i < n; i++) {
            let tmp = String(i+1)+". "+String(this.tabEl[i][1])+"-"+this.tabEl[i][0];
            last.fillText(tmp, this.xvnos - 50, this.yvnos + 100 + (i*zamik));
        }
    }
}

class Zvok {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    play(){
        this.sound.play();
    }
    stop (){
        this.sound.pause();
    }
}

class Powerup {
    constructor() {
        this.y = Math.floor(Math.random() * visina);
        this.x = Math.floor(Math.random() * sirina);
        this.radij = 10;
    }

    risi() {
        last.beginPath();

        last.arc(this.x, this.y, this.radij, 0, 2*Math.PI);
        
        last.closePath();
        last.stroke();
    }

    ponastavi() {
        this.y = Math.floor(Math.random() * visina);
        this.x = Math.floor(Math.random() * sirina);
    }
}

class Eksplozija {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radij = 2 + Math.random()*3;;
        this.vx = -5 + Math.random() * 10;
        this.vy = -5 + Math.random() * 10;
        this.barva = "white";
    }

    risi() {
        last.globalCompositeOperation = "source-over";

        last.beginPath();
        last.fillStyle = this.barva;
        last.arc(this.x, this.y, this.radij, 0, Math.PI * 2);
        last.fill();

        this.x += this.vx;
        this.y += this.vy;
        this.radius -= .02;
    }
}

function preveriTipke(i,tab) {
    if(tipke[tab[i][2]]) {
        if(tab[i][1]) {
            tab[i][0] = !tab[i][0];
            tab[i][1] = 0;
        }
    } else {
        tab[i][1] = 1;
    }
}

document.addEventListener("DOMContentLoaded", vzpostavi);

function vzpostavi() {
    podlaga = document.getElementById("podlaga");
    last = podlaga.getContext("2d");
    raketa = new Raketa();
    meni = new Meni()
    tockovnik = new Tockovnik();
    strel = new Zvok('laser.mp3');
    powerup = new Powerup();

    /*
        Pretvorba e.key String vrednosti v
        stevilo razporejeno po ASCII tabeli.
    */ 
    let tipka;
    
    podlaga.height = visina;
    podlaga.width = sirina;

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
        if ((zivljenja == 0) && (tockovnik.imeIg.length < 10)) {
            if (tipka >= 97) {
                tockovnik.imeIg += e.key;
            } else if (tipke[66]) {
                tockovnik.imeIg = tockovnik.imeIg.slice(0,tockovnik.imeIg.length-1);
            }
        }
    });
    document.body.addEventListener("keyup", e => {
        tipka = e.key.charCodeAt(0);
        tipke[tipka] = false;

        if(tipka === 32 && zivljenja > 0) {
            if (meni.moznosti[0][0]) {
                strel.play();
            }
            if(powup > 0) {
                metki.push(new Metek(raketa.stopinje));
                metki.push(new Metek(raketa.stopinje + 160));
                metki.push(new Metek(raketa.stopinje - 160));

                if(powup == 1) {
                    raketa.powup = 0;
                    powerup.ponastavi();
                }

                powup--;
            } else {
                metki.push(new Metek(raketa.stopinje));
            }
        }
    });

    upodobi();
}

function upodobi() {
    //Ali je igra na pavzi
    preveriTipke(0,pavza);
    raketa.premika = (tipke[119]);
    if(tipke[100]) {
        raketa.obrat(1);
    } else if(tipke[97]) {
        raketa.obrat(-1);
    }

    last.clearRect(0,0,sirina, visina);

    last.fillStyle = "rgb(38, 38, 37)";
    last.fillRect(0,0,podlaga.width,podlaga.height);

    for (let i = 0; i < boom.length; i++) {
        if(boom[i].radij < 0) {
            boom.splice(i,1);
        } else {
            boom[i].risi();
            console.log("Rise eks...")
        } 
    }

    /**
     * Narise tockovnik.
     */
    last.fillStyle = 'white';
    last.font = '21px Atari';
    last.fillText('Tocke: '+ tocke.toString(),20,35);
    
    kazalecZiv();

    if(pavza[0][0]) {
        meni.risi();
    } else if(zivljenja <= 0) {
        raketa.vidno = false;
        last.fillStyle = 'white';
        last.font = '50px Atari';
        last.fillText("Konec igre!", sirina/2-100, visina/8);

        if (meni.moznosti[3][0]) { 
            if (!tockovnik.ponovi) {
                for (let i = 0; i < localStorage.length; i++) {
                    let kljuc = localStorage.key(i), tmp = [];
                    tmp.push(kljuc,localStorage.getItem(kljuc));
                    tockovnik.tabEl.push(tmp);
                }
                tockovnik.tabEl.sort((a,b) => {
                    if (a[1] === b[1]) {
                        return 0;
                    }
                    else {
                        return (a[1] > b[1]) ? -1 : 1;
                    }
                });
                tockovnik.ponovi = 1;
            }
            tockovnik.risi();
        } else if (tipke[92]) {
            //localStorage.clear(); //Brisi spomin
            location.reload();
        } 
    } else {

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

        if(trKrog(
            powerup.x, powerup.y, powerup.radij,
            raketa.x, raketa.y, raketa.radij
        )) {
            raketa.powup = 1;
            powup = 3;
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
                        for (let z = 0; z < 10; z++) {
                            boom[z] = new Eksplozija(asteroidi[i].x,asteroidi[i].y);
                        }
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
        } else if (asteroidi.length == 0) {
            if (meni.moznosti[1][0]) {
                for (let i = 0; i < 8; i++) {
                    asteroidi.push(new Asteroid());
                }
            } else {
                zivljenja = 0;
            }
        }


        if(raketa.vidno) {
            raketa.posodobi();
            raketa.risi();

            if(!raketa.powup) {
                powerup.risi();
            }
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