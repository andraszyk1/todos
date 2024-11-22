import './style.css'
import { Todos } from './todos'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="todos">
    
  </div>
`
new Todos([])