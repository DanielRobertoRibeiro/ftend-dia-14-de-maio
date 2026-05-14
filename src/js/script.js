//Declarações dos Elementos usando DOM(Document Object Model)
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//Função assincrona para habilitar a câmera
async function configurarCamera(){
    //tratamento de erros
    try{
        //chama a api do navegador para solicitar acesso
        const midia= await navigator.mediaDevices.getUserMedia({
            //habilit a câmera traseira
            video:{ facingMode: "environment"},
            //o audio não será capturado
            audio:false
        });
        //recebe a função midia para ser executada
        videoElemento.srcObject=midia;
        //força a reprodução do video
        videoElemento.play();

    }catch(erro){
        resultado.innerText="Erro ao acessar a Câmera",erro;
    }
}
//executando a função
configurarCamera();

// captura de texto na camera
botaoScanear.onclick= async() => {
    botaoScanear.disabled=true;
    resultado.innerText="Fazendo a leitura do texto ..."
    
    // Define o canvas para iniciar leitura
    const contexto = canvas.getContext("2d");

    // ajusta o tamanho do canvas para tamanho real do video
    canvas.widht = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // aplica filtro para melhora o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)'

    // desenha o video no canvas

    contexto.drawImage(videoElemento,0,0, canvas.widht, canvas.height);

    try{
        const {data:{ text }}=await Tesseract.recognize(
            canvas,
            'por' //define o idioma
        );
        // remove espaços em branco
        const textofinal = text.trim();
        // extrutura condicional ternaria ?= if : else
        resultado.innerText=textofinal.length > 0 ? textofinal: "Não foi possivel identificar o texto";

        
    }catch(erro){
        resultado.innerText="Erro no processamento",erro

    }
    finally{
        //desabilita o botao para fazer nova captura
        botaoScanear.disabled=false;
    }

}
