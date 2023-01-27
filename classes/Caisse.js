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
            while (this.entreeMonnaie.stock.length) {
                this.fondCaisse.stock.push(this.entreeMonnaie.stock.shift());
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

    async calculerRenduMonnaie()
    {        
        let aRendre = this.aRendre;
        let montants = [50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01];
        
        for (let montant of montants) {
            while (aRendre >= montant && this.fondCaisse.stock.find(s => s.montant === montant) !== undefined) {
                let billet = this.fondCaisse.stock.find(s => s.montant === montant);
                this.transfert_fond_caisse_vers_retour_monnaie(this.fondCaisse.stock, this.retourMonnaie.stock, billet);
                aRendre -= montant;         

                if (billet.nom == '50c' || billet.nom == '20c' || billet.nom == '10c'|| billet.nom == '5c'  || billet.nom == '2c'  || billet.nom == '1c'){
                    this.aRendreAffichage.innerHTML += `<span><input class='button ${billet.type} ${billet.type}${(billet.montant)*100} animated' type='button' value='${(billet.montant)*100}c'></span>`;
                    await new Promise(r => setTimeout(r, 1000));
                }
                else{
                    if (billet.nom == '1€' || billet.nom == '2€')
                    {
                        this.aRendreAffichage.innerHTML += `<span><input class='button ${billet.type} ${billet.type}0${billet.montant}  animated' type='button' value='${billet.montant}€'></span>`;                    
                        await new Promise(r => setTimeout(r, 1000));
                    }
                    else
                    {
                        this.aRendreAffichage.innerHTML += `<span><input class='button ${billet.type} ${billet.type}${billet.montant}  animated' type='button' value='${billet.montant}€'></span>`;                    
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }
            }            
        }
    }

    getFondCaisse(){
        this.fondCaisse.compterStock();
    }

    change(value) {
        // Pointer la bonne monnaie (en fontion de value)
        let monnaieToWithdraw = this.fondCaisse.stock.find(monnaie => monnaie.value === value);
    
        // Verif si cela
        if (monnaieToWithdraw) {
          // on retire de fondCaisse.stock
          this.fondCaisse.stock = this.fondCaisse.stock.filter(monnaie => monnaie !== monnaieToWithdraw);
    
          // on ajoute dans retourMonnaie.stock
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