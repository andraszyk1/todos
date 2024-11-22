import './style.css'
import { Todos } from './todos'
import { Mode } from './types'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="todos">
    
  </div>
`
new Todos([],Mode.PROD)