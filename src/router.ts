import { routes } from "./helpers/routes";

export function router(){
    const path = window.location.pathname;
    const publicRoute = routes.public.find(r => r.path === path);
    const resultRoute = routes.result.find(r=>r.path===path);
    const uploadedFile = localStorage.getItem('csvFileContent');
    
    //Si accede a ruta principal y no hay archivo cargado
    if((path == '/' || path=='/result') && !uploadedFile) {
        navigateTo('/upload-file');
        return
    }

    //Si accede a ruta principal hay archivo cargado
    if(path == '/' && uploadedFile) {
        navigateTo('/result');
        return
    }

    //Si accede a upload-file pero hay archivo cargado
    if(path == '/upload-file' && uploadedFile) {
        navigateTo('/result');
        return
    }

    //Manejo de rutas publicas
    if (publicRoute) {
        publicRoute.component();
        return;
    } 

    //Manejo de rutas de resultado
    if (resultRoute) {
        resultRoute.component();
        return;
    } 

    //Si no encuentra la ruta redirije a not-found
    if((!publicRoute || !resultRoute) && path != '/'){
        navigateTo('/not-found');
        return;
    }
    
}

export function navigateTo(path: string):void {
    window.history.pushState({}, "", window.location.origin + path);
    router();
}
window.addEventListener('popstate',router)