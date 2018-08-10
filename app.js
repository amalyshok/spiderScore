class Menu extends React.component {
  render() {
    let menus = [
      "home",
      "About us",
      "Game list"
    ]
    return(
      <div>
      {menus.map((item,index,list)=>{
        return console.log(item)

      })}
      </div>
    )
  }
}

class Link extends React.component {

}

ReactDOM.render(
  <div>
  <Menu />
  </div>, document.getElementById('content')
)
