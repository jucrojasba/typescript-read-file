import { router } from './router';
import './styles.css'

const $root = document.getElementById('root');

if(!$root){
    throw new Error ('Element root does not exist')
}

router();