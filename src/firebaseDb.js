import firebase from "firebase/app";
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl1qtS-n3wljIMa0MKR63FU4LSS0_dyiw",
  authDomain: "projeto-de-banco-de-dado-70c7c.firebaseapp.com",
  databaseURL: 'https://projeto-de-banco-de-dado-70c7c.firebaseapp.com/',
  projectId: "projeto-de-banco-de-dado-70c7c",
  storageBucket: "projeto-de-banco-de-dado-70c7c.appspot.com",
  messagingSenderId: "160745338182",
  appId: "1:160745338182:web:daa529422cad5d0a1aa147",
  measurementId: "G-Q02JHK3YB3"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default function firebaseDb() {
  return {
    getCandidatosDoEstado: async function(estado, limite = 10) {
      try {
        // ! TYPO EM 'CANDITATOS'
        const collectionRef = db.collection('Canditatos_' + estado);
        const query = collectionRef.orderBy('NM_URNA_CANDIDATO', 'desc').limit(limite);
        const querySnapshot = await query.get();
        const dados = querySnapshot.docs.map(doc => doc.data());
        return dados;
      } catch (error) { 
        console.error(error) 
      }
    },
    query: async function(collection, filtros) {
      // ! ao mandar os filtros como [], retorna todos os candidatos de um estado
      try {
        const collectionRef = db.collection(collection);
        let query = collectionRef;
        filtros.forEach(filtro => {
          query = query.where(filtro.nomeCampo, filtro.operacao, filtro.valorCampo);
        });
        const result = await query.get();
        let docs = [];
        result.forEach(doc => docs.push(doc.data()));
        return docs;
      } catch (error) { 
        console.error(error) 
      }
    }
  }
}

