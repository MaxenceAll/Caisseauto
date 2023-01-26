import { Monnaie } from "./Monnaie";
import { Wallet } from "./Wallet"

export class Caisse{   

    constructor(){

        this.fondCaisse     = new Wallet("fondCaisse");
        this.entreeMonnaie  = new Wallet("entreeMonnaie");
        this.retourMonnaie  = new Wallet("retourMonnaie");

        this.nombre_article = 0;
        this.restantapayer = 0;
        this.aRendre = 0;
    
        this.tab_articles = document.getElementById("tab_articles");

        this.restantapayerLabel = document.getElementById("restantapayer");
        this.nombre_articleLabel = document.getElementById("nombre_article");

        this.total_articleLabel = document.getElementById("total_article");
        this.aRendreLabel = document.getElementById("aRendre");
        
        this.fond_caisseLabel = document.getElementById("fond_caisse");

        //pointer Reste à Payer : / Reste à Rendre :
        this.ResteALabel = document.getElementById("ResteA");

        //pointer retour monnaie (affichage)
        this.aRendreAffichage = document.getElementById("aRendreAffichage");

    }

    initCaisse(){
        // 4 billets de 50
        for (let i = 0 ; i < 4 ; i++){
            let newBillet50 = new Monnaie("50€",50,"billet");
            this.fondCaisse.stock.push(newBillet50);
        }
        // 5 billets de 20
        for (let i = 0 ; i < 5 ; i++){
            let newBillet20 = new Monnaie("20€",20,"billet");
            this.fondCaisse.stock.push(newBillet20);
        } 
        // 6 billets de 10
        for (let i = 0 ; i < 6 ; i++){
            let newBillet10 = new Monnaie("10€",10,"billet");
            this.fondCaisse.stock.push(newBillet10);
        }
        // 7 billets de 5
        for (let i = 0 ; i < 7 ; i++){
            let newBillet5 = new Monnaie("5€",5,"billet");
            this.fondCaisse.stock.push(newBillet5);
        }      
        // 8 pieces de 2
        for (let i = 0 ; i < 8 ; i++){
            let newPiece2 = new Monnaie("2€",2,"piece");
            this.fondCaisse.stock.push(newPiece2);
        }    
        // 9 pieces de 1
        for (let i = 0 ; i < 9 ; i++){
            let newPiece1 = new Monnaie("1€",1,"piece");
            this.fondCaisse.stock.push(newPiece1);
        }
        // 10 pieces de 0.50
        for (let i = 0 ; i < 10 ; i++){
            let newPiece50 = new Monnaie("50c",0.50,"piece");
            this.fondCaisse.stock.push(newPiece50);
        }  
        // 11 pieces de 0.20
        for (let i = 0 ; i < 11 ; i++){
            let newPiece20 = new Monnaie("20c",0.20,"piece");
            this.fondCaisse.stock.push(newPiece20);
        }  
        // 12 pieces de 0.50
        for (let i = 0 ; i < 12 ; i++){
            let newPiece05 = new Monnaie("5c",0.05,"piece");
            this.fondCaisse.stock.push(newPiece05);
        }  
        // 13 pieces de 0.01
        for (let i = 0 ; i < 13 ; i++){
            let newPiece01 = new Monnaie("1c",0.01,"piece");
            this.fondCaisse.stock.push(newPiece01);
        }

        this.fond_caisseLabel.innerText = this.fondCaisse.compterStock();

    }

    scanArticle = (event) => {
        console.log("scanArticle");
        /* Probabilité sur le prix :
         * [1c .. 1€[ -> 20%
         * [1€ .. 5€[ -> 40%
         * [5€ .. 10€[ -> 30%
         * [10€ .. 50€[ -> 10%
         */
        let aleatoire = this.getRandomNumber(0, 100);
        let price = 0;
        if(aleatoire < 10){
            price = this.getRandomPrice(10, 50);
        }
        else if (aleatoire < 30){
            price = this.getRandomPrice(0.01, 1);
        }
        else if (aleatoire < 60){
            price = this.getRandomPrice(5, 10);
        }
        else{
            price = this.getRandomPrice(1, 5);
        }
        this.restantapayer += price;
        //UI
        this.tab_articles.innerHTML += "<p>-- Article ("+(this.nombre_article+1)+") :"+price+" € HT</p>";
        this.restantapayerLabel.innerText = this.restantapayer.toFixed(2);
        this.nombre_articleLabel.innerText = ++this.nombre_article;
        this.total_articleLabel.innerText = this.restantapayer.toFixed(2);
      }

      

    fairePaiement(){

        if (this.entreeMonnaie.compterStock() < this.restantapayer )
        {
            // alert("il faut plus");
            //changer le texte resteA :
            this.ResteALabel.innerText = "Reste à payer :";
            this.ResteALabel.classList.add("rouge","blink_me");
            // passerResteAPayerEnRouge();
            this.restantapayerLabel.classList.add("rouge","blink_me");

            //vider montant inséré vers fond caisse
            // for (let i = 0 ; i < this.entreeMonnaie.stock.length + 1 ; i++){
            //     this.fondCaisse.stock.push(this.entreeMonnaie.stock[i]);
            //     this.entreeMonnaie.stock.shift();
            // }
            if(this.entreeMonnaie.stock.length){
                for (let i = 0 ; i < this.entreeMonnaie.stock.length ; i++){
                    this.fondCaisse.stock.push(this.entreeMonnaie.stock.pop());
                }
            }

            //déduire reste à payer
            this.restantapayer -= this.entreeMonnaie.montant_total.innerText;
            this.restantapayerLabel.innerText = this.restantapayer.toFixed(2);
            //maj montant inséré
            this.entreeMonnaie.montant_total.innerText = this.entreeMonnaie.compterStock();
            this.fond_caisseLabel.innerText = this.fondCaisse.compterStock();
        }
        else
        {
            if (this.entreeMonnaie.compterStock() == this.restantapayer)
            {
                alert("Transaction terminée.");
                //impression ticket de caisse.
            }
            else
            {
                //changer le texte resteA :
                this.ResteALabel.innerText = "Reste à rendre :";
                this.ResteALabel.classList.add("vert", "blink_me");

                // passerResteAPayerEnVert();
                this.restantapayerLabel.classList.add("vert","blink_me");
                //vider montant inséré vers fond caisse
                if(this.entreeMonnaie.stock.length){
                    for (let i = 0 ; i < this.entreeMonnaie.stock.length ; i++){
                        this.fondCaisse.stock.push(this.entreeMonnaie.stock.pop());
                    }
                }                
                //déduire reste à payer
                this.restantapayer -= this.entreeMonnaie.montant_total.innerText;
                this.restantapayerLabel.innerText = this.restantapayer.toFixed(2);
                //maj montant inséré
                this.entreeMonnaie.montant_total.innerText = this.entreeMonnaie.compterStock();
                // maj du fond de caisse
                this.fond_caisseLabel.innerText = parseFloat(this.fondCaisse.compterStock());


                // alert("Trop percu, retour monnaie nécessaire");
                this.aRendreLabel.innerText = this.restantapayer.toFixed(2);
                this.aRendre = (this.restantapayer.toFixed(2));

                this.aRendre = Math.abs(this.aRendre);
                
                // Ajout sur ticket caisse :
                this.tab_articles.innerHTML += "<p>$$ A rendre: "+this.aRendre+" €</p>";
                console.log("A rendre =");
                console.log(this.aRendre);


                let b50e=0; let b20e=0; let b10e=0;
                let b5e=0;  let p2e=0;  let p1e=0;
                let p50c=0; let p20c=0; let p10c=0;
                let p5c=0;  let p2c=0;  let p1c=0;
                while (this.aRendre > 0)
                {
                    while (this.aRendre >= 50)
                    {
                        this.aRendre -= 50; b50e++; this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button billet billet50' type='button' value='50€'></span>";
                    }
                    while (this.aRendre >= 20)
                    {
                        this.aRendre -= 20; b20e++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button billet billet20' type='button' value='20€'></span>";
                    }
                    while (this.aRendre >= 10)
                    {
                        this.aRendre -= 10; b10e++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button billet  billet10' type='button' value='10€'></span>";
                    }
                    while (this.aRendre >= 5)
                    {
                        this.aRendre -= 5; b5e++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button billet billet5' type='button' value='5€'></span>";
                    }
                    while (this.aRendre >= 2)
                    {
                        this.aRendre -= 2; p2e++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece2e' type='button' value='2€'></span>";
                    }
                    while (this.aRendre >= 1)
                    {
                        this.aRendre -= 1; p1e++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece1e' type='button' value='1€'></span>";
                    }
                    while (this.aRendre >= 0.50)
                    {
                        this.aRendre -= 0.50; p50c++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece50c' type='button' value='50c'></span>";
                    }
                    while (this.aRendre >= 0.20)
                    {
                        this.aRendre -= 0.20; p20c++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece20c' type='button' value='20c'></span>";
                    }
                    while (this.aRendre >= 0.10)
                    {
                        this.aRendre -= 0.10; p10c++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece10c' type='button' value='10c'></span>";
                    }
                    while (this.aRendre >= 0.05)
                    {
                        this.aRendre -= 0.05; p5c++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece5c' type='button' value='5c'></span>";
                    }
                    while (this.aRendre >= 0.02)
                    {
                        this.aRendre -= 0.02; p2c++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece2c' type='button' value='2c'></span>";
                    }
                    while (this.aRendre >= 0.01)
                    {
                        this.aRendre -= 0.01; p1c++;this.aRendre=this.aRendre.toFixed(2);
                        this.aRendreAffichage.innerHTML += "<span><input class='button piece piece1c' type='button' value='1c'></span>";
                    }                    
                }                

            }
        }
    }


    calculerRenduMonnaie(){        

    }


 
    getFondCaisse(){
        this.fondCaisse.compterStock();
    }
    // TOOLS
    getRandomPrice = (min, max) => {
        return +(Math.random() * (max - min) + min).toFixed(2);
    }
    getRandomNumber = (min, max, precision = 0) => {
        return +(Math.random() * (max - min) + min).toFixed(precision);
    }


} 