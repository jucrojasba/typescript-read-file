import './styles.css'

const $root = document.getElementById('root');

if(!$root){
    throw new Error ('Element root does not exist')
}

$root.innerHTML=`
<h1>Hola desde Index</h1>
`