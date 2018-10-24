login = document.getElementById("login");
principal = document.getElementById("principal");
loading = document.getElementById("principal");

function load(){
    loading.style.display = "none";
    login.style.display = "none";
    principal.style.display = "block";
}


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
        if(result[0])
            src = 'data:' + result[0].data + ';' + result[0].type + ',' + result[0].content;
    },
    error: function() {
        console.log('Error');
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
        if(result[0])
            status = result[0].status;
    },
    error: function() {
        console.log('Error');
    }
});
return status;
}

function imgError(image){
image.onerror = "";
image.src = "/images/user.svg";
return true;
}

function conversa(phone, picture){
$.ajax({
    beforeSend: function(){
        $('#conversaConteudo').html(``);
        $('#conversaConteudo').append(`
        <div class="mask-loading">
            <figure class="align-loading">
                <img class="ajax-spinner img-responsive" src="images/loading.gif" style="margin: 0 auto; display: block;" alt="Loading...">
            </figure>
        </div>
        `);
    },
    url: "/conversa",
    dataType: "json",
    data: { phone: phone },        
    success: async function(result){
        $('#conversaConteudo').html(``);
        for(var i=0; i<result.length; i++) {

            if(result[i]){
                var hour = result[i].date.substr(11,5);
                var msg = result[i].msg;
                var type = result[i].type;
                var msgId = result[i].msgId;
                var me = result[i].me;
            }

            var src = '';

            if((type == "ptt" || type == "audio" || type == "image") && result[i])
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

            if(me == 0)
                $('#conversaConteudo').append(`
                    <div class="containerConv">
                        <img src="${picture}" alt="Avatar" style="width:100%;" onerror="imgError(this);" >
                        ${msg}
                        <span class="time-right">Visualizado - ${hour}</span>
                    </div>
                `);
            else
                $('#conversaConteudo').append(`
                    <div class="containerConv darker">
                        <img src="images/bot.svg" class="right" style="width:100%;">
                        <p>${msg}</p>
                        <span class="time-left">${status} - ${hour}</span>
                    </div>
                `);
        }
    },
    error: function(){
        console.log('Error');
    }
});
}



<<<<<<< HEAD
    function graf1(){ 
         $.ajax({
            url: "/grafico/volume",
            dataType: "json",
            success: function(result){
                console.log(result);
                alert(result[0].qtdee);
            },
            error: function (){
                alert('Erro');
            }
        });
     }
=======
function graf1(){ 
     $.ajax({
        url: "/grafico/volume",
        dataType: "json",
        success: function(result){
            console.log(result.length);
        },
        error: function (){
            console.log('Error');
        }
    });
 }
>>>>>>> 978c4a3f368719ce591237e7ecab164a2329390e


$(function(){
$('#form1').bind('submit', function(e) {
    e.preventDefault();

    $.ajax({
        beforeSend: function(){
            $("#searchLoading").show();
            $('#tabela > table > tbody').html(``);
        },
        url: "/perfil",
        dataType: "json",
        success: function(result){
            $("#searchLoading").hide();
            $('#tabela > table > thead').html(`
            <tr>
                <th>Foto</th>
                <th>Telefone</th>
                <th>Nickname</th>
                <th>Status</th>
            </tr>
            `);
            for(var i=0; i<result.length; i++) {
                if(result[i])
                    $('#tabela > table > tbody').append("<tr onclick='conversa(\"" + result[i].phone + "\", \"" + result[i].picture + "\")' data-toggle='modal' data-target='#conversa'><td><img src='" + result[i].picture + "' width='50px' height='50px' onerror='imgError(this);' /></td><td>" + result[i].phone + "</td><td>" + result[i].nick + "</td><td>" + result[i].status + "</td></tr>");
            }
        },
        error: function() {
            console.log('Error');
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
    labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"],
    datasets: [{
        label: "Quantidade de Envio",
        backgroundColor: 'rgba(41, 128, 185, 0.9)',
        borderColor: 'rgba(15, 15, 15, 1)',
        data: [0, 10, 5, 2, 20, 30, 45],
        borderWidth: 2,
        pointStyle: 'rectRot',
        pointRadius: 5,
        pointBorderColor: 'rgb(0, 0, 0)'
    }]
},
options: {
    responsive: true,
    legend: {
        labels: {
            usePointStyle: false
        }
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Período'
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Valores'
            }
        }]
    }
}
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