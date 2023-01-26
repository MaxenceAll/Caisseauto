import { Caisse } from "./Caisse.js";
import { Monnaie } from "./Monnaie.js";

export class Wallet{

    constructor(nom, stock=null){
        this.nom = nom;
        this.stock = new Array;

        this.montant_total = document.getElementById("montant_total");

        this.tab_articles = document.getElementById("tab_articles");
    }

    ajouterMonnaie(montant){
        this.stock.push(montant);
        // console.log("stock (aka montant inséré)");
        // console.log(this.compterStock());
        this.montant_total.innerText = this.compterStock();
        this.tab_articles.innerHTML += "<p>++ Vous avez inséré "+montant.montant+" € ("+montant.type+")</p>";
    }

    debiterMonnaie(){

    }

    compterMonnaie(name){

    }

    compterStock(){
        let total = 0;
        for (let i = 0 ; i < this.stock.length ; i++)
        {
            total += this.stock[i].montant;
        }
        return total.toFixed(2);
    }

}