// Elementos
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const agriculturaContainer = document.getElementById('agriculturaContainer');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnCaptcha = document.getElementById('btnCaptcha');
const captchaDiv = document.getElementById('captchaDiv');
const captchaCanvas = document.getElementById('captchaCanvas');
const captchaInput = document.getElementById('captchaInput');
const mensaje = document.getElementById('mensaje');
const infoCard = document.getElementById('infoCard');
const btnCerrarInfo = document.getElementById('btnCerrarInfo');
const btnLogout = document.getElementById('btnLogout');
const btnAgricultura = document.getElementById('btnAgricultura');
const btnVolverDashboard = document.getElementById('btnVolverDashboard');
const togglePassword = document.getElementById('togglePassword');

let captchaGenerado = "";
let inactivityTimer;
const TIEMPO_INACTIVIDAD = 20*1000; // 20 segundos

// Toggle password
togglePassword.addEventListener('click', ()=>{
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type==='password' ? '👁️' : '🙈';
});

// Feedback contraseña
const infoText = document.querySelector('.info-text');
passwordInput.addEventListener('input', () => {
    const regex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{0,8}$/;
    if(passwordInput.value.length > 8){
        infoText.style.color='red';
        infoText.textContent="¡Demasiados caracteres!";
    } else if(!regex.test(passwordInput.value)){
        infoText.style.color='red';
        infoText.textContent="Caracter inválido detectado.";
    } else if(passwordInput.value.length===8){
        infoText.style.color='green';
        infoText.textContent="Contraseña válida ✔️";
    } else {
        infoText.style.color='#555';
        infoText.textContent="La contraseña debe tener exactamente 8 caracteres especiales";
    }
});

// Generar captcha
function generarCaptcha(){
    captchaGenerado="";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0;i<6;i++){
        captchaGenerado += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    const ctx = captchaCanvas.getContext('2d');
    // Limpiar canvas
    ctx.clearRect(0,0,captchaCanvas.width,captchaCanvas.height);
    // Fondo del captcha
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0,0,captchaCanvas.width,captchaCanvas.height);
    // Texto
    ctx.font = "25px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(captchaGenerado, 20, 35);
    // Añadir líneas aleatorias para mayor seguridad
    for(let i=0;i<5;i++){
        ctx.strokeStyle = "#"+Math.floor(Math.random()*16777215).toString(16);
        ctx.beginPath();
        ctx.moveTo(Math.random()*200, Math.random()*50);
        ctx.lineTo(Math.random()*200, Math.random()*50);
        ctx.stroke();
    }
}
// Mostrar mensaje
function mostrarMensaje(text,color){
    mensaje.textContent=text;
    mensaje.style.color=color;
    mensaje.style.opacity=1;
    setTimeout(()=>{mensaje.style.opacity=0;},2500);
}

// Validar captcha
btnCaptcha.addEventListener('click', ()=>{
    if(captchaInput.value===captchaGenerado){
        mostrarMensaje("Captcha correcto ✔️","green");
        setTimeout(()=>{mostrarDashboard();},500);
    } else {
        mostrarMensaje("Captcha incorrecto ❌","red");
        generarCaptcha();
        captchaInput.value="";
    }
});

// Login
// Login
btnLogin.addEventListener('click', ()=>{
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value;
    if(usuario===""){
        mostrarMensaje("Ingresa un usuario","red");
        return;
    }
    if(password.length!==8){
        mostrarMensaje("Contraseña debe tener 8 caracteres especiales","red");
        return;
    }
    // Mostrar captcha al instante y generarlo
    captchaDiv.style.display="block";
    generarCaptcha();
    captchaInput.value="";
});

// Mostrar dashboard
function mostrarDashboard(){
    loginContainer.style.display="none";
    dashboardContainer.style.display="block";
    setTimeout(()=>{infoCard.classList.add('show');},300);
    resetInactivityTimer();
}

// Cerrar info card
btnCerrarInfo.addEventListener('click', ()=>{infoCard.classList.remove('show');});

// Dashboard ↔ Agricultura
btnAgricultura.addEventListener('click', ()=>{
    dashboardContainer.style.display='none';
    agriculturaContainer.style.display='block';
});
btnVolverDashboard.addEventListener('click', ()=>{
    agriculturaContainer.style.display='none';
    dashboardContainer.style.display='block';
});

// Logout
btnLogout.addEventListener('click', logout);
function logout(){
    dashboardContainer.style.display='none';
    agriculturaContainer.style.display='none';
    loginContainer.style.display='block';
    usuarioInput.value='';
    passwordInput.value='';
    captchaInput.value='';
    captchaDiv.style.display='none';
    clearTimeout(inactivityTimer);
}

// Auto logout
function resetInactivityTimer(){
    clearTimeout(inactivityTimer);
    inactivityTimer=setTimeout(autoLogout,TIEMPO_INACTIVIDAD);
}
function autoLogout(){
    alert("No se detectó actividad. Cerrando sesión por seguridad.");
    logout();
}
['mousemove','keydown','click','scroll','touchstart'].forEach(event=>{
    document.addEventListener(event, resetInactivityTimer);
});