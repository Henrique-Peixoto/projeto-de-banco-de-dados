export default function Utils() {
  return {
    formatarNumero: function(num) {
      return new Intl.NumberFormat('pt-BR').format(num); 
    },
    normalizarString: function(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  }
}
