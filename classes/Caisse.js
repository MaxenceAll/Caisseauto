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

        // AFFICHAGE SUPERIEUR :
        // pointer vers affichage du nombre ( Reste à payer : )
        this.restantapayerLabel = document.getElementById("restantapayer");
        // pointer vers affichage du fond de caisse ( Fond de caisse = )
        this.fond_caisseLabel = document.getElementById("fond_caisse");
        //pointer Reste à Payer : / Reste à Rendre :
        this.ResteALabel = document.getElementById("ResteA");
        
        // AFFICHAGE retour monnaie :
        // pointer vers le montant a rendre ( - à rendre = X )
        this.aRendreLabel = document.getElementById("aRendre");
        //pointer retour monnaie (affichage visuel)
        this.aRendreAffichage = document.getElementById("aRendreAffichage");
        
        // TICKET CAISSE :
        // pointer vers liste des articles pour ajouter à la suite.
        this.tab_articles = document.getElementById("tab_articles");
        // pointer vers affichage du nombre article ( nombre article = x )
        this.nombre_articleLabel = document.getElementById("nombre_article");
        // pointer vers affichage des différents article <p> ... 
        this.total_articleLabel = document.getElementById("total_article");
    }

    // Remplir le fond de caisse de monnaie:
    initCaisse()
    {
        // un tab pour aller chercher les infos à ajouter 
        const denominations = [
            {nom: "50€", montant: 50, type: "billet", combien: 4},
            // {nom: "20€", montant: 20, type: "billet", combien: 5},
            {nom: "10€", montant: 10, type: "billet", combien: 6},
            {nom: "5€", montant: 5, type: "billet", combien: 7},
            {nom: "2€", montant: 2, type: "piece", combien: 8},
            {nom: "1€", montant: 1, type: "piece", combien: 9},
            {nom: "50c", montant: 0.50, type: "piece", combien: 10},
            {nom: "20c", montant: 0.20, type: "piece", combien: 11},
            {nom: "5c", montant: 0.05, type: "piece", combien: 12},
            {nom: "1c", montant: 0.01, type: "piece", combien: 13}
        ];
        // sortir le montant total en fond de caisse
        let montant_fond_caisse = 0;
        // double boucle 1: passer pour chaque element de denomination 2: new Monnaie en fonction des données dans le dénomination en cours
        for (const denomination of denominations) {
            for (let i = 0; i < denomination.combien; i++)
            {
                const newMonnaie = new Monnaie(denomination.nom, denomination.montant, denomination.type);
                this.fondCaisse.stock.push(newMonnaie);
                montant_fond_caisse += denomination.montant;
            }
        }
        // affichage
        this.fond_caisseLabel.innerText = montant_fond_caisse.toFixed(2);
    }

    scanArticle = (event) => {
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

    fairePaiement()
    {
        // Si pas assez d'argent inséré
        if (this.entreeMonnaie.compterStock() < this.restantapayer )
        {
            this.passerResteAPayerEnRouge();
            this.transfert_entreeMonnaie_vers_fond_caisse();
            this.updateFondCaisse();
        }
        // Si assez d'argent inséré
        else
        {
            this.passerResteAPayerEnVert();
            this.transfert_entreeMonnaie_vers_fond_caisse();
            this.updateFondCaisse();

            // Changement affichage à rendre :
            this.aRendreLabel.innerText = this.restantapayer.toFixed(2);
            this.aRendre = (this.restantapayer.toFixed(2));
            // maj attribut caisse.aRendre
            this.aRendre = Math.abs(this.aRendre);

            // Ajout sur ticket caisse :
            this.tab_articles.innerHTML += "<p>$$ A rendre: "+this.aRendre+" €</p>";

            this.calculerRenduMonnaie();
        }
    }

    passerResteAPayerEnRouge(){
        this.ResteALabel.innerText = "Reste à payer :";
        this.ResteALabel.classList.add("rouge","blink_me");
        this.restantapayerLabel.classList.add("rouge","blink_me");
    }
    passerResteAPayerEnVert(){
        this.ResteALabel.innerText = "Reste à rendre :";
        this.ResteALabel.classList.add("vert", "blink_me");
        this.restantapayerLabel.classList.add("vert","blink_me");
    }

    transfert_entreeMonnaie_vers_fond_caisse(){
        if(this.entreeMonnaie.stock.length){
            for (let i = 0 ; i < this.entreeMonnaie.stock.length ; i++)
            {
                this.fondCaisse.stock.push(this.entreeMonnaie.stock.pop());
            }
        }
        //changement affichage.
        this.restantapayer -= this.entreeMonnaie.montant_total.innerText;
        this.restantapayerLabel.innerText = this.restantapayer.toFixed(2);
        // changement affichage montant inséré
        this.entreeMonnaie.montant_total.innerText = this.entreeMonnaie.compterStock();
    }

    transfert_fond_caisse_vers_retour_monnaie(fondcaisse, retourMonnaie, item)
    {
        let index = this.fondCaisse.stock.indexOf(item);
        if (index !== -1) {
            this.retourMonnaie.stock.push(this.fondCaisse.stock[index]);
            this.fondCaisse.stock.splice(index, 1);
        }
    }

    updateFondCaisse(){
        // maj du fond de caisse
        this.fond_caisseLabel.innerText = parseFloat(this.fondCaisse.compterStock());
    }

    calculerRenduMonnaie()
    {        
        // const currencyValues = [50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
        // const currencyTypes = ["billet50", "billet20", "billet10", "billet5", "piece2e",
        //      "piece1e", "piece50c", "piece20c", "piece10c", "piece5c", "piece2c", "piece1c"];

        // let change = {};

        // for (let i = 0; i < currencyValues.length; i++)
        // {
        //     while (this.aRendre >= currencyValues[i]) 
        //         {
        //             this.aRendre -= currencyValues[i];
        //             this.aRendre = this.aRendre.toFixed(2);
        //             if (change[currencyTypes[i]])
        //             {
        //                 change[currencyTypes[i]]++;
        //             } else
        //             {
        //                 change[currencyTypes[i]] = 1;
        //             }
        //             this.aRendreAffichage.innerHTML += `<span><input class='button ${currencyTypes[i]}' type='button' value='${currencyValues[i]}€'></span>`;
        //         }
        // }

        let stockFondCaisse = this.fondCaisse.compterStock();
        let stockRetourMonnaie = this.retourMonnaie.compterStock();
        
        let aRendre = this.aRendre;
        // rendu billets 50
        while ( aRendre > 50  && (this.fondCaisse.stock.find(s => s.montant === 50)) != undefined )
        {            
            let billet50 = this.fondCaisse.stock.find(s => s.montant === 50)
            if ( billet50 != undefined){
                //billet 50 dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, billet50);
                aRendre-=50;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${billet50.type} ${billet50.type}${billet50.montant}' type='button' value='${billet50.montant}€'></span>`;
            }
        }
        // rendu billets 20
        while ( aRendre > 20  && (this.fondCaisse.stock.find(s => s.montant === 20)) != undefined )
        {
            let billet20 = this.fondCaisse.stock.find(s => s.montant === 20)
            if ( billet20 != undefined){
                //billet 20 dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, billet20);
                aRendre-=20;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${billet20.type} ${billet20.type}${billet20.montant}' type='button' value='${billet20.montant}€'></span>`;
            }
        }
        // rendu billets 10
        while ( aRendre > 10  && (this.fondCaisse.stock.find(s => s.montant === 10)) != undefined )
        {
            let billet10 = this.fondCaisse.stock.find(s => s.montant === 10)
            if ( billet10 != undefined){
                //billet 10 dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, billet10);
                aRendre-=10;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${billet10.type} ${billet10.type}${billet10.montant}' type='button' value='${billet10.montant}€'></span>`;
            }
        }
        // rendu billets 5
        while ( aRendre > 5   && (this.fondCaisse.stock.find(s => s.montant === 5)) != undefined )
        {
            let billet5 = this.fondCaisse.stock.find(s => s.montant === 5)
            if ( billet5 != undefined){
                //billet 5 dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, billet5);
                aRendre-=5;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${billet5.type} ${billet5.type}${billet5.montant}' type='button' value='${billet5.montant}€'></span>`;
            }
        }
        // rendu piece 2
        while ( aRendre > 2   && (this.fondCaisse.stock.find(s => s.montant === 2)) != undefined )
        {
            let piece2 = this.fondCaisse.stock.find(s => s.montant === 2)
            if ( piece2 != undefined){
                //piece2  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece2);
                aRendre-=2;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece2.type} ${piece2.type}${piece2.montant}e' type='button' value='${piece2.montant}€'></span>`;
            }
        }
        // rendu piece 1
        while ( aRendre > 1   && (this.fondCaisse.stock.find(s => s.montant === 1)) != undefined )
        {
            let piece1 = this.fondCaisse.stock.find(s => s.montant === 1)
            if ( piece1 != undefined){
                //piece1  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece1);
                aRendre-=1;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece1.type} ${piece1.type}${piece1.montant}e' type='button' value='${piece1.montant}€'></span>`;
            }
        }
        // rendu piece 50
        while ( aRendre > 0.5   && (this.fondCaisse.stock.find(s => s.montant === 0.50)) != undefined )
        {
            let piece50 = this.fondCaisse.stock.find(s => s.montant === 0.50)
            if ( piece50 != undefined){
                //piece50  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece50);
                aRendre-=0.5;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece50.type} piece50c' type='button' value='50c'></span>`;
            }
        }
        // rendu piece 20
        while ( aRendre > 0.20   && (this.fondCaisse.stock.find(s => s.montant === 0.20)) != undefined )
        {
            let piece20 = this.fondCaisse.stock.find(s => s.montant === 0.20)
            if ( piece20 != undefined){
                //piece20  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece20);
                aRendre-=0.20;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece20.type} piece20c' type='button' value='20c'></span>`;
            }
        }
        // rendu piece 10
        while ( aRendre > 0.10   && (this.fondCaisse.stock.find(s => s.montant === 0.10)) != undefined )
        {
            let piece10 = this.fondCaisse.stock.find(s => s.montant === 0.10)
            if ( piece10 != undefined){
                //piece10  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece10);
                aRendre-=0.10;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece10.type} piece10c' type='button' value='10c'></span>`;
            }
        }
        // rendu piece 5
        while ( aRendre > 0.05   && (this.fondCaisse.stock.find(s => s.montant === 0.05)) != undefined )
        {
            let piece5 = this.fondCaisse.stock.find(s => s.montant === 0.05)
            if ( piece5 != undefined){
                //piece5  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece5);
                aRendre-=0.05;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece5.type} piece5c' type='button' value='5c'></span>`;
            }
        }
        // rendu piece 2
        while ( aRendre > 0.02   && (this.fondCaisse.stock.find(s => s.montant === 0.02)) != undefined )
        {
            let piece2 = this.fondCaisse.stock.find(s => s.montant === 0.02)
            if ( piece2 != undefined){
                //piece5  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece2);
                aRendre-=0.02;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece2.type} piece2c' type='button' value='2c'></span>`;
            }
        }
        // rendu piece 1
        while ( aRendre > 0.01   && (this.fondCaisse.stock.find(s => s.montant === 0.01)) != undefined )
        {
            let piece1 = this.fondCaisse.stock.find(s => s.montant === 0.01)
            if ( piece1 != undefined){
                //piece5  dispo
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, piece1);
                aRendre-=0.01;
                //Ajout affichage.
                this.aRendreAffichage.innerHTML += `<span><input class='button ${piece1.type} piece1c' type='button' value='1c'></span>`;                
            }
        }


        // console.log("combien de billet 50?");
        // console.log(combien50);
        // console.log("combien de billet 20?");
        // console.log(combien20);
        // console.log("combien de billet 10?");
        // console.log(combien10);
        // console.log("combien de billet 5?");
        // console.log(combien5);



        // while ( aRendre > 50 )
        // {
        //     //check si j'ai des billets de 50
        //     for ( let i = 0 ; i < this.fondCaisse.stock.length ; i++)
        //     {
        //         // if (this.fondCaisse.stock[i].montant == 50)
        //         // {
        //         //     // alert("j'ai trouvé un billet de 50 en fond de caisse");
        //         //     //je retire un billet de 50 de fondcaisse vers retourmonnaie
        //         //     // this.transfert_fond_caisse_vers_retour_monnaie();

        //         //     aRendre -= 50;                    
        //         // }
        //     }
        // }
    }

    getFondCaisse(){
        this.fondCaisse.compterStock();
    }

    change(value) {
        // Find the appropriate Monnaie object in fondCaisse.stock
        let monnaieToWithdraw = this.fondCaisse.stock.find(monnaie => monnaie.value === value);
    
        // Check if the Monnaie object exists in fondCaisse.stock
        if (monnaieToWithdraw) {
          // Remove the Monnaie object from fondCaisse.stock
          this.fondCaisse.stock = this.fondCaisse.stock.filter(monnaie => monnaie !== monnaieToWithdraw);
    
          // Add the Monnaie object to retourMonnaie.stock
          this.retourMonnaie.stock.push(monnaieToWithdraw);
        }
      }

    // TOOLS
    getRandomPrice = (min, max) => {
        return +(Math.random() * (max - min) + min).toFixed(2);
    }
    getRandomNumber = (min, max, precision = 0) => {
        return +(Math.random() * (max - min) + min).toFixed(precision);
    }
} 