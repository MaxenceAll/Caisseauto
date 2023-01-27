import { Caisse } from "./classes/Caisse";
import { Monnaie } from "./classes/Monnaie";


const maCaisse = new Caisse();
maCaisse.initCaisse();

btn_scan.onclick = maCaisse.scanArticle;

// listener sur tous les boutons d'insertion.
document.querySelectorAll(".argent").forEach(function(element){
    element.addEventListener("click", function(){
        let montant = this.id;   
        let type;
        let name;

        if ( parseFloat(montant) > 2){
            type = "billet";
            name = montant+"€"
        }
        else{
            type = "piece";
            name = montant+"c"
        }
        maCaisse.entreeMonnaie.ajouterMonnaie(new Monnaie(name,parseFloat(montant),type));
    });
});

// listener bouton Payer 
let btn_payer = document.getElementById("btn_payer");
btn_payer.addEventListener("click", function (){
    maCaisse.fairePaiement();
}
)


// // btn test pour afficher contenu des wallets
// const btn_test = document.getElementById("btn_test");
// btn_test.addEventListener("click", function (){
//         getLog();
//         console.log(maCaisse.restantapayer);
//     }
// )
// function getLog(){    
//     console.log("Fond Caisse :");
//     console.log(maCaisse.fondCaisse);
//     console.log("Entrée Monnaie :");
//     console.log(maCaisse.entreeMonnaie);
//     console.log("Retour Monnaie :");
//     console.log(maCaisse.retourMonnaie);
// }

