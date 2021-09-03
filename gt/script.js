
class sound {
    constructor () {
        this.aud=new Audio();
    }
    play (filename) {
        this.aud.src=filename;
        if (document.getElementById("checkme") .checked==true) {
            this.aud.loop=true;
        }
        else if(document.getElementById("checkme") .checked==false) {
            this.aud.loop=false;
        }
        this.aud.play();
    }
    stop () {
        this.aud.pause();
        this.aud.currentTime=0;
    }
}

snd=new sound();