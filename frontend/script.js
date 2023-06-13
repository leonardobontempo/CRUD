$(document).ready(function() {
    const servidorURL = 'http://localhost:3000';
    const rotaAPI = '/usuarios';
    const urlCompleta = servidorURL + rotaAPI;
    
    $.ajax({
      url: urlCompleta,
      type: 'GET',
      success: function(response) {
        // A resposta do servidor é recebida no parâmetro "response"
        document.getElementById('resultado2').innerHTML = response;
        console.log(response);
      },
      error: function(error) {
        // Em caso de erro na requisição
        console.log('Erro:', error);
      }
    });
  });