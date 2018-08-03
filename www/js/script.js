    $('#bdnNAO').click(function(event) {
       $('#qtdEnvio').val("");
       $('#qtdEnvio').prop('disabled', true);
       $('#arquivo').prop('disabled', false);
    });  
    $('#bdnSIM').click(function(event) {
        $('#arquivo').val("");
        $('#qtdEnvio').prop('disabled', false);
        $('#arquivo').prop('disabled', true);
    });
    $('#VCARD').change(function() {
        if ($(this).is(':checked')) {
            $('#contVCARD').prop('disabled', false);
        }
        else{
            $('#contVCARD').val('');
            $('#contVCARD').prop('disabled', true);
        }
    });
    $('#tpMSG').change(function() {
        if ($(this).val() == 2) {
            $('#txtMSG').prop('disabled', true);
            $('#txtMSG').val("");
            $('#msgArquivo').prop('disabled', false);
        }
        else if ($(this).val() == 3) {
            $('#txtMSG').prop('disabled', false);
            $('#msgArquivo').prop('disabled', false);
        }
        else if ($(this).val() == 1) {
            $('#txtMSG').prop('disabled', false);
            $('#msgArquivo').prop('disabled', true);
        }
    });
    $(document).ready(function(){
        $('#data').mask('0000/00/00');
        $('#contVCARD').mask('(00) 0 0000-0000');
        $('#hora').mask('00:00');
    });

    $(function () {
    $('#formEnvio').bind('submit', function(e) {
        e.preventDefault();
        var nmCampanha = $('#nmCampanha').val();
        var tipoCampanha = $('#tpCampanha option').filter(':selected').text();
        var desc = $('#desc').val();
        var anMSG = Boolean($("input[name='radio-stacked']:checked").val());
        var tpMSG = $('#tpMSG').val();
        var txtMSG = $('#txtMSG').val();
        var aqvEnvio = $('#msgArquivo').val();
        var vcard = $('#contVCARD').val();
        var arqContato = $('#arquivo').val();
        var bdn = Boolean($("input[name='radio-stacked2']:checked").val());
        var qtd = $('#qtdEnvio').val();
        var dat = new Date($('#data').val());
        var respo = Boolean($("input[name='radio-stacked3']:checked").val());
        Inserir(nmCampanha, tipoCampanha, desc, anMSG, tpMSG, txtMSG, aqvEnvio, vcard, arqContato, bdn, qtd, dat, respo);
    });
});

function fileSrc(filehash){
    var src = null;
    $.ajax({
        url: "/media",
        dataType: "json",
        data: { filehash: filehash },
        async: false,
        success: function(result){
            src = 'data:' + result[0].data + ';' + result[0].type + ',' + result[0].content;
            console.log(src);
        },
        error: function () {
            alert('Error');
        }
    });
    return src;
}

function msgStatus(id){
    var status = null;
    $.ajax({
        url: "/status",
        dataType: "json",
        data: { id: id },
        async: false,
        success: function(result){
            status = result[0].status;
            console.log(status);
        },
        error: function () {
            alert('Error');
        }
    });
    return status;
}

function conversa(phone, picture){
    $.ajax({
        url: "/conversa",
        dataType: "json",
        data: { phone: phone },
        beforeSend: function() {
            $('#conversaConteudo').html(``);
            $('#conversaConteudo').append(`
            <div class="mask-loading">
                <figure class="align-loading">
                    <img class="ajax-spinner img-responsive" src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Loading...">
                </figure>
            </div>
            `);
        },
        success: async function(result){
            $('#conversaConteudo').html(``);
            for(var i=0; i<=result.length; i++) {

                var hour = result[i].date.substr(11,5);
                var msg = result[i].msg;
                var type = result[i].type;
                var msgId = result[i].msgId;
                var src = '';

                if(type == "ptt" || type == "audio" || type == "image")
                    src = await fileSrc(result[i].filehash)

                if(msg == "Audio")
                    msg = `<audio controls src="${src}"></audio>`;
                else if(msg == "Image")
                    msg = `<img src="${src}" />`;
                else
                    msg = `<p>${msg}</p>`;

                var status = await msgStatus(msgId);

                if(status == '1')
                    status = 'Enviado';
                else if(status == '2')
                    status = 'Recebido';
                else if(status == '3')
                    status = 'Visualizado';
                else
                    status = 'Erro';

                if(result[i].me == 0)
                    $('#conversaConteudo').append(`
                        <div class="containerConv">
                            <img src="${picture}" alt="Avatar" style="width:100%;">
                            ${msg}
                            <span class="time-right">Visualizado - ${hour}</span>
                        </div>
                    `);
                else
                    $('#conversaConteudo').append(`
                        <div class="containerConv darker">
                            <img src="https://www.shareicon.net/data/128x128/2016/09/07/826440_chat_512x512.png" class="right" style="width:100%;">
                            <p>${msg}</p>
                            <span class="time-left">${status} - ${hour}</span>
                        </div>
                    `);
            }
        },
        error: function () {
            alert('Error');
        }
    });
}

$(function(){
    $('#form1').bind('submit', function(e) {
        e.preventDefault();

        $.ajax({
            url: "/perfil",
            dataType: "json",
            success: function(result){
                console.log(result);
                $('#tabela > table > thead').html(`
                <tr>
                    <th>Foto</th>
                    <th>Telefone</th>
                    <th>Nickname</th>
                    <th>Status</th>
                </tr>
                `);
                for(var i=0; i<=result.length; i++) {
                    $('#tabela > table > thead').append("<tr onclick='conversa(\"" + result[i].phone + "\", \"" + result[i].picture + "\")' data-toggle='modal' data-target='#conversa'><td><img src='" + result[i].picture + "' width='50px' height='50px' /></td><td>" + result[i].phone + "</td><td>" + result[i].nick + "</td><td>" + result[i].status + "</td></tr>");
                }
            },
            error: function () {
                alert('Error');
            }
        });
    });
});
















//GRAFICOS DAQUI PRA BAIXO
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Enviados ao destinatário",
            backgroundColor: 'rgba(33, 150, 243, 0.5)',
            borderColor: 'rgba(33, 150, 243,1.0)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {}
});
var ctx = document.getElementById("myChart4").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 13, 5, 7, 4, 8],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
});
var ctx = document.getElementById("myChart5").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
var ctx = document.getElementById("myChart7").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["Marketing", "Cobrança", "Verificação"],
    datasets: [{
      backgroundColor: [
        "#2ecc71",
        "#e74c3c",
        "#34495e"
      ],
      data: [12, 19,  7]
    }]
  }
});

var ctx = document.getElementById("myChart8").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["Marketing", "Cobrança", "Verificação"],
    datasets: [{
      backgroundColor: [
        "#2ecc71",
        "#e74c3c",
        "#34495e"
      ],
      data: [12, 19,  7]
    }]
  }
});