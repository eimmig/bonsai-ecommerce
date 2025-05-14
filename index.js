// Carrega um componente HTML em um container
function loadComponent(id, path) {
    fetch(path)
        .then(res => res.text())
        .then(data => document.getElementById(id).innerHTML = data);
}

loadComponent("header", "app/header/header.html");
loadComponent("footer", "app/footer/footer.html");